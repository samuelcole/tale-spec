import assert from "node:assert/strict";
import test from "node:test";
import { mkdir, mkdtemp, readFile, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import {
  checkResult,
  checkScenarioPairs,
  runAll,
  runMatrix,
  validateScenario,
} from "../bin/tale-spec.mjs";

const scenario = JSON.parse(
  await readFile(new URL("../scenarios/open-and-read.json", import.meta.url), "utf8"),
);

const passing = {
  protocol: 1,
  client: "fixture",
  scenario: "open-and-read",
  version: 1,
  steps: [
    {
      id: "open-fresh",
      observations: {
        cover: "on-screen",
        position: "start",
        dimBoundary: null,
        firstBlock: "p1",
      },
    },
    {
      id: "read-forward",
      observations: {
        cover: "above-screen",
        readingExtent: "several-screens",
        settled: true,
        topBlock: "p20",
        dimBoundary: null,
        successor: "p21",
      },
    },
    {
      id: "resume",
      observations: {
        cover: "above-screen",
        topBlock: "p21",
        dimBoundary: "p20",
        firstInk: "p21",
        dimIsOneRunFromTop: true,
        inkBoundary: "at-top",
        unreadBelow: "screenful",
      },
    },
    {
      id: "reopen-without-reading-1",
      observations: { topBlock: "p21", dimBoundary: "p20" },
    },
    {
      id: "reopen-without-reading-2",
      observations: { topBlock: "p21", dimBoundary: "p20" },
    },
  ],
};

test("the executable scenario validates", () => {
  assert.equal(validateScenario(scenario), scenario);
});

test("every prose scenario has a matching executable plan", async () => {
  const root = dirname(dirname(fileURLToPath(import.meta.url)));
  const ids = await checkScenarioPairs(
    join(root, "spec/scenarios"),
    join(root, "scenarios"),
  );
  assert.deepEqual(ids, [
    "fetch-fails-honestly",
    "follow-and-override",
    "kept-on-open",
    "leave-and-return",
    "library-browse",
    "library-open",
    "library-search",
    "mark-offline-and-sync",
    "note-and-back",
    "open-and-read",
    "play-and-pocket",
    "position-and-motion",
    "reading-preferences",
  ]);
});

test("an orphaned prose scenario fails the pair gate", async () => {
  const root = await mkdtemp(join(tmpdir(), "tale-spec-pairs-"));
  const proseDir = join(root, "prose");
  const scenarioDir = join(root, "scenarios");
  await Promise.all([
    mkdir(proseDir, { recursive: true }),
    mkdir(scenarioDir, { recursive: true }),
  ]);
  await writeFile(join(proseDir, "unpaired.md"), "# Scenario: unpaired\n");
  await assert.rejects(
    checkScenarioPairs(proseDir, scenarioDir),
    /missing executable plans: unpaired/,
  );
});

test("a complete client result passes centrally", () => {
  assert.deepEqual(checkResult(scenario, passing, "fixture"), {
    client: "fixture",
    scenario: "open-and-read",
    version: 1,
    steps: 5,
  });
});

test("a missing step fails closed", () => {
  const missing = structuredClone(passing);
  missing.steps.pop();
  assert.throws(
    () => checkResult(scenario, missing, "fixture"),
    /do not exactly match/,
  );
});

test("a missing observation fails closed", () => {
  const missing = structuredClone(passing);
  delete missing.steps[2].observations.inkBoundary;
  assert.throws(
    () => checkResult(scenario, missing, "fixture"),
    /did not report inkBoundary/,
  );
});

test("a captured cross-step expectation is enforced centrally", () => {
  const advanced = structuredClone(passing);
  advanced.steps[3].observations.topBlock = "p22";
  assert.throws(
    () => checkResult(scenario, advanced, "fixture"),
    /topBlock equals "p21", got "p22"/,
  );
});

test("numeric comparisons are enforced centrally", () => {
  const numericScenario = {
    format: "tale-surface-scenario",
    version: 1,
    id: "numeric",
    steps: [
      {
        id: "measure",
        action: { op: "measure" },
        expect: {
          elapsed: { between: [2_500, 3_000] },
          position: { greaterThanOrEqual: 8 },
        },
      },
    ],
  };
  const result = {
    protocol: 1,
    client: "fixture",
    scenario: "numeric",
    version: 1,
    steps: [{ id: "measure", observations: { elapsed: 2_499, position: 8 } }],
  };
  assert.throws(
    () => checkResult(numericScenario, result, "fixture"),
    /elapsed between \[2500,3000\], got 2499/,
  );
});

test("a plan cannot reference a future capture", () => {
  const invalid = structuredClone(scenario);
  invalid.steps[0].expect.position = { equals: { ref: "stoppedAt" } };
  assert.throws(
    () => validateScenario(invalid),
    /references uncaptured value stoppedAt/,
  );
});

test("a stale vendored scenario fails before the adapter launches", async () => {
  const root = await mkdtemp(join(tmpdir(), "tale-spec-"));
  const scenarioPath = join(root, "authoritative.json");
  const clientScenarioPath = join(root, "vendored.json");
  const matrixPath = join(root, "matrix.json");
  await writeFile(scenarioPath, JSON.stringify(scenario));
  await writeFile(clientScenarioPath, `${JSON.stringify(scenario)}\n`);
  await writeFile(
    matrixPath,
    JSON.stringify({
      clients: [
        {
          id: "fixture",
          scenario: "vendored.json",
          command: [process.execPath, "--version"],
        },
      ],
    }),
  );

  await assert.rejects(
    runMatrix(scenarioPath, matrixPath),
    /vendored scenario differs from the authoritative file/,
  );
});

test("run-all gives a new client every executable plan by default", async () => {
  const root = await mkdtemp(join(tmpdir(), "tale-spec-all-"));
  const authoritativeDir = join(root, "authoritative");
  const clientDir = join(root, "client");
  await Promise.all([
    mkdir(authoritativeDir, { recursive: true }),
    mkdir(join(clientDir, "scenarios"), { recursive: true }),
  ]);
  const plan = (id) => ({
    format: "tale-surface-scenario",
    version: 1,
    id,
    steps: [{ id: "observe", action: { op: "observe" }, expect: { ready: { equals: true } } }],
  });
  for (const id of ["alpha", "beta"]) {
    const text = JSON.stringify(plan(id));
    await writeFile(join(authoritativeDir, `${id}.json`), text);
    await writeFile(join(clientDir, "scenarios", `${id}.json`), text);
  }
  await writeFile(
    join(clientDir, "adapter.mjs"),
    `import { readFile } from "node:fs/promises";\n` +
      `const plan = JSON.parse(await readFile(process.env.TALE_CONFORMANCE_SCENARIO, "utf8"));\n` +
      `console.log("TALE_CONFORMANCE_RESULT " + JSON.stringify({ protocol: 1, client: process.env.TALE_CONFORMANCE_CLIENT, scenario: plan.id, version: plan.version, steps: [{ id: "observe", observations: { ready: true } }] }));\n`,
  );
  const matrixPath = join(root, "matrix.json");
  await writeFile(
    matrixPath,
    JSON.stringify({
      clients: [
        {
          id: "new-client",
          cwd: "client",
          scenarioDir: "scenarios",
          command: [process.execPath, "adapter.mjs"],
        },
      ],
    }),
  );

  const result = await runAll(authoritativeDir, matrixPath);
  assert.deepEqual(
    result.reports.map(({ client, scenario }) => ({ client, scenario })),
    [
      { client: "new-client", scenario: "alpha" },
      { client: "new-client", scenario: "beta" },
    ],
  );
  assert.deepEqual(result.skipped, []);
});

test("run-all accepts every plan from one batch adapter process", async () => {
  const root = await mkdtemp(join(tmpdir(), "tale-spec-batch-"));
  const authoritativeDir = join(root, "authoritative");
  const clientDir = join(root, "client");
  await Promise.all([
    mkdir(authoritativeDir, { recursive: true }),
    mkdir(join(clientDir, "scenarios"), { recursive: true }),
  ]);
  const plan = (id) => ({
    format: "tale-surface-scenario",
    version: 1,
    id,
    steps: [{ id: "observe", action: { op: "observe" }, expect: { ready: { equals: true } } }],
  });
  for (const id of ["alpha", "beta"]) {
    const text = JSON.stringify(plan(id));
    await writeFile(join(authoritativeDir, `${id}.json`), text);
    await writeFile(join(clientDir, "scenarios", `${id}.json`), text);
  }
  await writeFile(
    join(clientDir, "batch-adapter.mjs"),
    `import { readFile, writeFile } from "node:fs/promises";\n` +
      `import { join } from "node:path";\n` +
      `await writeFile("batch-ran", "once");\n` +
      `const ids = JSON.parse(process.env.TALE_CONFORMANCE_SCENARIO_IDS).reverse();\n` +
      `for (const id of ids) {\n` +
      `  const plan = JSON.parse(await readFile(join(process.env.TALE_CONFORMANCE_SCENARIO_DIR, id + ".json"), "utf8"));\n` +
      `  console.log("TALE_CONFORMANCE_RESULT " + JSON.stringify({ protocol: 1, client: process.env.TALE_CONFORMANCE_CLIENT, scenario: plan.id, version: plan.version, steps: [{ id: "observe", observations: { ready: true } }] }));\n` +
      `}\n`,
  );
  const matrixPath = join(root, "matrix.json");
  await writeFile(
    matrixPath,
    JSON.stringify({
      clients: [
        {
          id: "batch-client",
          cwd: "client",
          scenarioDir: "scenarios",
          batchCommand: [process.execPath, "batch-adapter.mjs"],
        },
      ],
    }),
  );

  const result = await runAll(authoritativeDir, matrixPath);
  assert.deepEqual(
    result.reports.map(({ client, scenario }) => ({ client, scenario })),
    [
      { client: "batch-client", scenario: "alpha" },
      { client: "batch-client", scenario: "beta" },
    ],
  );
  assert.equal(await readFile(join(clientDir, "batch-ran"), "utf8"), "once");
});
