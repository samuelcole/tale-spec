#!/usr/bin/env node

import { spawn } from "node:child_process";
import { isDeepStrictEqual } from "node:util";
import { readFile, readdir } from "node:fs/promises";
import { basename, dirname, extname, join, resolve } from "node:path";
import { pathToFileURL } from "node:url";

const RESULT_PREFIX = "TALE_CONFORMANCE_RESULT ";

function fail(message) {
  throw new Error(message);
}

async function readJson(path) {
  try {
    return JSON.parse(await readFile(path, "utf8"));
  } catch (error) {
    fail(`${path}: ${error.message}`);
  }
}

function object(value, label) {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    fail(`${label} must be an object`);
  }
  return value;
}

function validateRule(rule, label) {
  object(rule, label);
  const keys = Object.keys(rule);
  const operators = [
    "equals",
    "notEquals",
    "greaterThan",
    "greaterThanOrEqual",
    "lessThan",
    "lessThanOrEqual",
    "between",
  ];
  if (keys.length !== 1 || !operators.includes(keys[0])) {
    fail(`${label} must contain exactly one supported comparison`);
  }
  const value = rule[keys[0]];
  if (
    keys[0] === "between" &&
    (!Array.isArray(value) || value.length !== 2)
  ) {
    fail(`${label}.between must contain an inclusive [minimum, maximum] pair`);
  }
  if (
    value &&
    typeof value === "object" &&
    !Array.isArray(value) &&
    (Object.keys(value).length !== 1 || typeof value.ref !== "string")
  ) {
    fail(`${label}.${keys[0]} has an invalid reference`);
  }
}

function references(value) {
  if (Array.isArray(value)) return value.flatMap(references);
  if (
    value &&
    typeof value === "object" &&
    !Array.isArray(value) &&
    typeof value.ref === "string"
  ) {
    return [value.ref];
  }
  return [];
}

export function validateScenario(scenario) {
  object(scenario, "scenario");
  if (scenario.format !== "tale-surface-scenario") {
    fail("scenario.format must be tale-surface-scenario");
  }
  if (!Number.isInteger(scenario.version) || scenario.version < 1) {
    fail("scenario.version must be a positive integer");
  }
  if (typeof scenario.id !== "string" || !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(scenario.id)) {
    fail("scenario.id must be a kebab-case string");
  }
  if (!Array.isArray(scenario.steps) || scenario.steps.length === 0) {
    fail("scenario.steps must be a non-empty array");
  }

  const ids = new Set();
  const availableCaptures = new Set();
  for (const [index, stepValue] of scenario.steps.entries()) {
    const label = `scenario.steps[${index}]`;
    const step = object(stepValue, label);
    if (typeof step.id !== "string" || !step.id) {
      fail(`${label}.id must be a non-empty string`);
    }
    if (ids.has(step.id)) {
      fail(`${label}.id duplicates ${step.id}`);
    }
    ids.add(step.id);
    const action = object(step.action, `${label}.action`);
    if (typeof action.op !== "string" || !action.op) {
      fail(`${label}.action.op must be a non-empty string`);
    }
    const expectations = object(step.expect, `${label}.expect`);
    if (Object.keys(expectations).length === 0) {
      fail(`${label}.expect must not be empty`);
    }
    for (const [name, rule] of Object.entries(expectations)) {
      validateRule(rule, `${label}.expect.${name}`);
      for (const reference of references(rule[Object.keys(rule)[0]])) {
        if (!availableCaptures.has(reference)) {
          fail(`${label}.expect.${name} references uncaptured value ${reference}`);
        }
      }
    }
    if (step.capture !== undefined) {
      const captures = object(step.capture, `${label}.capture`);
      for (const [name, observation] of Object.entries(captures)) {
        if (!name || typeof observation !== "string" || !observation) {
          fail(`${label}.capture entries must map names to observation names`);
        }
        if (availableCaptures.has(name)) {
          fail(`${label}.capture duplicates ${name}`);
        }
        availableCaptures.add(name);
      }
    }
  }
  return scenario;
}

export async function checkScenarioPairs(proseDir, scenarioDir) {
  const proseEntries = await readdir(proseDir, { withFileTypes: true });
  const scenarioEntries = await readdir(scenarioDir, { withFileTypes: true });
  const prose = new Set(
    proseEntries
      .filter((entry) => entry.isFile() && entry.name.endsWith(".md") && entry.name !== "README.md")
      .map((entry) => basename(entry.name, extname(entry.name))),
  );
  const executable = new Set(
    scenarioEntries
      .filter((entry) => entry.isFile() && entry.name.endsWith(".json"))
      .map((entry) => basename(entry.name, extname(entry.name))),
  );
  const missingPlans = [...prose].filter((id) => !executable.has(id)).sort();
  const missingProse = [...executable].filter((id) => !prose.has(id)).sort();
  if (missingPlans.length || missingProse.length) {
    const problems = [];
    if (missingPlans.length) problems.push(`missing executable plans: ${missingPlans.join(", ")}`);
    if (missingProse.length) problems.push(`missing prose scenarios: ${missingProse.join(", ")}`);
    fail(problems.join("; "));
  }
  for (const id of [...executable].sort()) {
    const path = resolve(scenarioDir, `${id}.json`);
    const scenario = validateScenario(await readJson(path));
    if (scenario.id !== id) {
      fail(`${path}: scenario.id must match its filename (${id})`);
    }
  }
  return [...prose].sort();
}

function expectedValue(value, captures, label) {
  if (
    value &&
    typeof value === "object" &&
    !Array.isArray(value) &&
    typeof value.ref === "string"
  ) {
    if (!captures.has(value.ref)) {
      fail(`${label} references uncaptured value ${value.ref}`);
    }
    return captures.get(value.ref);
  }
  if (Array.isArray(value)) {
    return value.map((entry, index) => expectedValue(entry, captures, `${label}[${index}]`));
  }
  return value;
}

function comparisonPasses(operator, actual, wanted) {
  if (operator === "equals") return isDeepStrictEqual(actual, wanted);
  if (operator === "notEquals") return !isDeepStrictEqual(actual, wanted);
  if (operator === "between") {
    return (
      typeof actual === "number" &&
      typeof wanted[0] === "number" &&
      typeof wanted[1] === "number" &&
      actual >= wanted[0] &&
      actual <= wanted[1]
    );
  }
  if (typeof actual !== "number" || typeof wanted !== "number") return false;
  if (operator === "greaterThan") return actual > wanted;
  if (operator === "greaterThanOrEqual") return actual >= wanted;
  if (operator === "lessThan") return actual < wanted;
  if (operator === "lessThanOrEqual") return actual <= wanted;
  return false;
}

export function checkResult(scenarioValue, resultValue, client) {
  const scenario = validateScenario(scenarioValue);
  const result = object(resultValue, `${client} result`);
  if (result.protocol !== 1) {
    fail(`${client}: result protocol must be 1`);
  }
  if (result.client !== client) {
    fail(`${client}: result names client ${JSON.stringify(result.client)}`);
  }
  if (result.scenario !== scenario.id || result.version !== scenario.version) {
    fail(
      `${client}: result is for ${result.scenario}@${result.version}, expected ${scenario.id}@${scenario.version}`,
    );
  }
  if (!Array.isArray(result.steps)) {
    fail(`${client}: result.steps must be an array`);
  }
  const wanted = scenario.steps.map((step) => step.id);
  const found = result.steps.map((step) => step?.id);
  if (!isDeepStrictEqual(found, wanted)) {
    fail(
      `${client}: result steps ${JSON.stringify(found)} do not exactly match ${JSON.stringify(wanted)}`,
    );
  }

  const captures = new Map();
  for (let index = 0; index < scenario.steps.length; index += 1) {
    const step = scenario.steps[index];
    const observations = object(
      result.steps[index].observations,
      `${client}:${step.id}.observations`,
    );
    for (const [name, rule] of Object.entries(step.expect)) {
      if (!Object.hasOwn(observations, name)) {
        fail(`${client}:${step.id} did not report ${name}`);
      }
      const operator = Object.keys(rule)[0];
      const wantedValue = expectedValue(rule[operator], captures, `${client}:${step.id}.${name}`);
      if (!comparisonPasses(operator, observations[name], wantedValue)) {
        fail(
          `${client}:${step.id}.${name} ${operator} ${JSON.stringify(wantedValue)}, got ${JSON.stringify(observations[name])}`,
        );
      }
    }
    for (const [capture, observation] of Object.entries(step.capture ?? {})) {
      if (!Object.hasOwn(observations, observation)) {
        fail(`${client}:${step.id} cannot capture missing observation ${observation}`);
      }
      captures.set(capture, observations[observation]);
    }
  }
  return { client, scenario: scenario.id, version: scenario.version, steps: wanted.length };
}

async function runClient(
  scenario,
  scenarioText,
  matrixDir,
  clientConfig,
  scenarioCopy = clientConfig.scenario,
) {
  const client = object(clientConfig, "matrix client");
  if (typeof client.id !== "string" || !client.id) {
    fail("matrix client.id must be a non-empty string");
  }
  if (!Array.isArray(client.command) || client.command.some((part) => typeof part !== "string")) {
    fail(`${client.id}: command must be an array of strings`);
  }
  if (client.command.length === 0) {
    fail(`${client.id}: command must not be empty`);
  }
  if (typeof scenarioCopy !== "string" || !scenarioCopy) {
    fail(`${client.id}: scenario must be a non-empty path`);
  }
  const cwd = resolve(matrixDir, client.cwd ?? ".");
  const clientEnv = client.env === undefined ? {} : object(client.env, `${client.id}.env`);
  if (Object.values(clientEnv).some((value) => typeof value !== "string")) {
    fail(`${client.id}: env values must be strings`);
  }
  const copyPath = resolve(cwd, scenarioCopy);
  const copyText = await readFile(copyPath, "utf8");
  if (copyText !== scenarioText) {
    fail(`${client.id}: vendored scenario differs from the authoritative file`);
  }

  const [command, ...args] = client.command.map((part) =>
    part.replaceAll("{scenario}", scenario.id),
  );
  const child = spawn(command, args, {
    cwd,
    env: {
      ...process.env,
      ...clientEnv,
      TALE_CONFORMANCE_CLIENT: client.id,
      TALE_CONFORMANCE_SCENARIO: scenarioCopy,
      TALE_CONFORMANCE_SCENARIO_ID: scenario.id,
    },
    stdio: ["ignore", "pipe", "pipe"],
  });
  let pending = "";
  const results = [];
  child.stdout.on("data", (chunk) => {
    process.stdout.write(chunk);
    pending += chunk.toString();
    const lines = pending.split(/\r?\n/);
    pending = lines.pop() ?? "";
    for (const line of lines) {
      const marker = line.indexOf(RESULT_PREFIX);
      if (marker >= 0) {
        results.push(JSON.parse(line.slice(marker + RESULT_PREFIX.length)));
      }
    }
  });
  child.stderr.on("data", (chunk) => process.stderr.write(chunk));
  const exitCode = await new Promise((resolveExit, reject) => {
    child.on("error", reject);
    child.on("close", resolveExit);
  });
  if (pending) {
    const marker = pending.indexOf(RESULT_PREFIX);
    if (marker >= 0) {
      results.push(JSON.parse(pending.slice(marker + RESULT_PREFIX.length)));
    }
  }
  if (exitCode !== 0) {
    fail(`${client.id}: adapter exited ${exitCode}`);
  }
  if (results.length !== 1) {
    fail(`${client.id}: adapter emitted ${results.length} result records, expected 1`);
  }
  return checkResult(scenario, results[0], client.id);
}

export async function runMatrix(scenarioPath, matrixPath) {
  const scenarioText = await readFile(scenarioPath, "utf8");
  const scenario = validateScenario(JSON.parse(scenarioText));
  const matrix = object(await readJson(matrixPath), "matrix");
  if (!Array.isArray(matrix.clients) || matrix.clients.length === 0) {
    fail("matrix.clients must be a non-empty array");
  }
  const ids = matrix.clients.map((client) => client?.id);
  if (new Set(ids).size !== ids.length) {
    fail("matrix client ids must be unique");
  }
  const reports = [];
  for (const client of matrix.clients) {
    reports.push(
      await runClient(scenario, scenarioText, dirname(resolve(matrixPath)), client),
    );
  }
  return reports;
}

export async function runAll(scenarioDir, matrixPath) {
  const matrix = object(await readJson(matrixPath), "matrix");
  if (!Array.isArray(matrix.clients) || matrix.clients.length === 0) {
    fail("matrix.clients must be a non-empty array");
  }
  const ids = matrix.clients.map((client) => client?.id);
  if (new Set(ids).size !== ids.length) {
    fail("matrix client ids must be unique");
  }
  const files = (await readdir(scenarioDir, { withFileTypes: true }))
    .filter((entry) => entry.isFile() && entry.name.endsWith(".json"))
    .map((entry) => entry.name)
    .sort();
  if (files.length === 0) fail("scenario directory contains no JSON plans");

  const reports = [];
  const skipped = [];
  const matrixDir = dirname(resolve(matrixPath));
  for (const clientConfig of matrix.clients) {
    const client = object(clientConfig, "matrix client");
    if (typeof client.scenarioDir !== "string" || !client.scenarioDir) {
      fail(`${client.id}: scenarioDir must be a non-empty path for run-all`);
    }
    const notApplicable =
      client.notApplicable === undefined
        ? {}
        : object(client.notApplicable, `${client.id}.notApplicable`);
    for (const [id, reason] of Object.entries(notApplicable)) {
      if (typeof reason !== "string" || !reason) {
        fail(`${client.id}: notApplicable.${id} must explain why the scenario does not apply`);
      }
      if (!files.includes(`${id}.json`)) {
        fail(`${client.id}: notApplicable names unknown scenario ${id}`);
      }
    }
    for (const file of files) {
      const scenarioPath = resolve(scenarioDir, file);
      const scenarioText = await readFile(scenarioPath, "utf8");
      const scenario = validateScenario(JSON.parse(scenarioText));
      const fileId = basename(file, ".json");
      if (scenario.id !== fileId) {
        fail(`${scenarioPath}: scenario.id must match its filename (${fileId})`);
      }
      const reason = Object.hasOwn(notApplicable, scenario.id)
        ? notApplicable[scenario.id]
        : undefined;
      if (reason) {
        skipped.push({ client: client.id, scenario: scenario.id, reason });
        continue;
      }
      reports.push(
        await runClient(
          scenario,
          scenarioText,
          matrixDir,
          client,
          join(client.scenarioDir, file),
        ),
      );
    }
  }
  return { reports, skipped };
}

async function main(args) {
  const [command, scenarioArg, matrixArg] = args;
  if (command === "check-pairs" && !args[3]) {
    const proseDir = resolve(scenarioArg ?? "spec/scenarios");
    const scenarioDir = resolve(matrixArg ?? "scenarios");
    const ids = await checkScenarioPairs(proseDir, scenarioDir);
    console.log(`${ids.length} prose scenarios have executable plans`);
    return;
  }
  if (command === "validate" && scenarioArg && !matrixArg) {
    const path = resolve(scenarioArg);
    const scenario = validateScenario(await readJson(path));
    console.log(`${scenario.id}@${scenario.version}: ${scenario.steps.length} steps`);
    return;
  }
  if (command === "run" && scenarioArg && matrixArg) {
    const reports = await runMatrix(resolve(scenarioArg), resolve(matrixArg));
    for (const report of reports) {
      console.log(
        `PASS ${report.client} ${report.scenario}@${report.version} (${report.steps} steps)`,
      );
    }
    return;
  }
  if (command === "run-all" && scenarioArg && matrixArg) {
    const { reports, skipped } = await runAll(resolve(scenarioArg), resolve(matrixArg));
    for (const report of reports) {
      console.log(
        `PASS ${report.client} ${report.scenario}@${report.version} (${report.steps} steps)`,
      );
    }
    for (const skip of skipped) {
      console.log(`N/A ${skip.client} ${skip.scenario}: ${skip.reason}`);
    }
    return;
  }
  fail(
    "usage: tale-spec check-pairs [prose-dir] [scenario-dir] | tale-spec validate <scenario.json> | tale-spec run <scenario.json> <matrix.json> | tale-spec run-all <scenario-dir> <matrix.json>",
  );
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  main(process.argv.slice(2)).catch((error) => {
    console.error(`FAIL ${error.message}`);
    process.exitCode = 1;
  });
}
