import assert from "node:assert/strict";
import { spawn } from "node:child_process";
import test from "node:test";
import { mkdir, mkdtemp, readFile, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import {
  checkResult,
  checkScenarioPairs,
  runAll,
  InconclusiveVerdict,
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
    "a-new-edition-keeps-your-place",
    "address-speaks-its-language",
    "book-contents",
    "book-navigation",
    "browse-without-typing",
    "choose-a-new-place",
    "choose-interface-language",
    "choose-language-from-a-shelf",
    "clear-the-search",
    "fetch-fails-honestly",
    "filter-a-directory",
    "filter-by-language",
    "finish-and-discover",
    "finish-and-leave",
    "follow-and-override",
    "interface-follows-the-device",
    "keep-outlives-the-screen",
    "kept-on-a-stalled-network",
    "kept-on-open",
    "leave-and-return",
    "library-browse",
    "library-language",
    "library-open",
    "library-search",
    "link-handoff",
    "mark-offline-and-sync",
    "note-and-back",
    "open-and-read",
    "open-at-a-quote",
    "payload-presentation",
    "place-follows-you",
    "plan-opens-on-its-tip",
    "play-and-pocket",
    "position-and-motion",
    "read-in-your-language",
    "reading-preferences",
    "steer-the-library",
    "the-voice-begins-with-the-recording",
    "the-voice-brings-the-new-edition",
    "time-in-browse",
    "voice-flourish-and-peek",
    "voice-follows-a-tall-paragraph",
    "voice-kept-in-part",
    "voice-on-a-stalled-network",
    "voice-rides-along",
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

async function keepGoingFixture(adapterBody, { batch = true } = {}) {
  const root = await mkdtemp(join(tmpdir(), "tale-spec-keep-going-"));
  const authoritativeDir = join(root, "authoritative");
  const clientDir = join(root, "client");
  await Promise.all([
    mkdir(authoritativeDir, { recursive: true }),
    mkdir(join(clientDir, "scenarios"), { recursive: true }),
  ]);
  for (const id of ["alpha", "beta", "gamma"]) {
    const text = JSON.stringify({
      format: "tale-surface-scenario",
      version: 1,
      id,
      steps: [{ id: "observe", action: { op: "observe" }, expect: { ready: { equals: true } } }],
    });
    await writeFile(join(authoritativeDir, `${id}.json`), text);
    await writeFile(join(clientDir, "scenarios", `${id}.json`), text);
  }
  await writeFile(
    join(clientDir, "adapter.mjs"),
    `const report = (id, ready) => console.log("TALE_CONFORMANCE_RESULT " + JSON.stringify({ protocol: 1, client: process.env.TALE_CONFORMANCE_CLIENT, scenario: id, version: 1, steps: [{ id: "observe", observations: { ready } }] }));\n` +
      `const ids = process.env.TALE_CONFORMANCE_SCENARIO_IDS ? JSON.parse(process.env.TALE_CONFORMANCE_SCENARIO_IDS) : [process.env.TALE_CONFORMANCE_SCENARIO_ID];\n` +
      adapterBody,
  );
  const matrixPath = join(root, "matrix.json");
  const command = [process.execPath, "adapter.mjs"];
  await writeFile(
    matrixPath,
    JSON.stringify({
      clients: [
        batch
          ? { id: "keep", cwd: "client", scenarioDir: "scenarios", batchCommand: command }
          : {
              id: "keep",
              cwd: "client",
              scenarioDir: "scenarios",
              // `run` names its one copy; `run-all` uses scenarioDir.
              scenario: "scenarios/alpha.json",
              command,
            },
      ],
    }),
  );
  return { authoritativeDir, matrixPath };
}

// alpha mismatches, beta passes, gamma is never reported, and the adapter
// exits 1, as Playwright does when any one test is red.
const oneOfEach =
  `for (const id of ids) { if (id === "alpha") report(id, false); if (id === "beta") report(id, true); }\n` +
  `process.exitCode = 1;\n`;

test("run-all stops at the first failure by default", async () => {
  const { authoritativeDir, matrixPath } = await keepGoingFixture(oneOfEach);
  await assert.rejects(runAll(authoritativeDir, matrixPath), /adapter exited 1/);
});

test("run-all --keep-going judges every plan a failing batch adapter reported", async () => {
  const { authoritativeDir, matrixPath } = await keepGoingFixture(oneOfEach);
  const result = await runAll(authoritativeDir, matrixPath, { keepGoing: true });
  assert.deepEqual(
    result.reports.map(({ scenario }) => scenario),
    ["beta"],
  );
  assert.deepEqual(
    result.failures.map(({ scenario }) => scenario),
    [null, "alpha", "gamma"],
  );
  assert.match(result.failures[0].message, /adapter exited 1/);
  assert.match(result.failures[1].message, /ready/);
  assert.match(result.failures[2].message, /omitted gamma/);
});

test("run-all --keep-going judges every plan of a one-at-a-time adapter", async () => {
  const { authoritativeDir, matrixPath } = await keepGoingFixture(
    `const [id] = ids;\n` +
      `if (id === "alpha") report(id, false);\n` +
      `if (id === "beta") report(id, true);\n` +
      `if (id === "gamma") process.exitCode = 1;\n`,
    { batch: false },
  );
  const result = await runAll(authoritativeDir, matrixPath, { keepGoing: true });
  assert.deepEqual(
    result.reports.map(({ scenario }) => scenario),
    ["beta"],
  );
  assert.deepEqual(
    result.failures.map(({ scenario }) => scenario),
    ["alpha", "gamma"],
  );
});

test("run-all --keep-going still stops on a structural error", async () => {
  const { authoritativeDir, matrixPath } = await keepGoingFixture(oneOfEach);
  await writeFile(join(dirname(matrixPath), "client", "scenarios", "beta.json"), "{}");
  await assert.rejects(
    runAll(authoritativeDir, matrixPath, { keepGoing: true }),
    /vendored scenario differs/,
  );
});

// Exit 75 (EX_TEMPFAIL) is the adapter saying it could not decide: a timeout
// on the test's clock, a lost server, a duration bound missed under a CPU
// throttle. INCONCLUSIVE is neither a pass nor a fail (TAL-494).

test("run reports an adapter that exits 75 as inconclusive, not failed", async () => {
  const { authoritativeDir, matrixPath } = await keepGoingFixture(`process.exitCode = 75;\n`, {
    batch: false,
  });
  await assert.rejects(
    runMatrix(join(authoritativeDir, "alpha.json"), matrixPath),
    (error) => error instanceof InconclusiveVerdict && /could not decide/.test(error.message),
  );
});

test("run still fails a mismatched result even when the adapter exits 75", async () => {
  const { authoritativeDir, matrixPath } = await keepGoingFixture(
    `report(ids[0], false);\nprocess.exitCode = 75;\n`,
    { batch: false },
  );
  await assert.rejects(
    runMatrix(join(authoritativeDir, "alpha.json"), matrixPath),
    (error) => !(error instanceof InconclusiveVerdict) && /ready/.test(error.message),
  );
});

test("run-all records an inconclusive plan and judges the rest, even without --keep-going", async () => {
  const { authoritativeDir, matrixPath } = await keepGoingFixture(
    `const [id] = ids;\n` +
      `if (id === "alpha") process.exitCode = 75;\n` +
      `if (id === "beta") report(id, true);\n` +
      `if (id === "gamma") report(id, true);\n`,
    { batch: false },
  );
  const result = await runAll(authoritativeDir, matrixPath);
  assert.deepEqual(
    result.reports.map(({ scenario }) => scenario),
    ["beta", "gamma"],
  );
  assert.deepEqual(result.failures, []);
  assert.deepEqual(
    result.inconclusive.map(({ scenario }) => scenario),
    ["alpha"],
  );
});

test("run-all judges a batch that exits 75: reported plans pass or fail, unreported ones are inconclusive", async () => {
  const { authoritativeDir, matrixPath } = await keepGoingFixture(
    `for (const id of ids) { if (id === "beta") report(id, true); }\n` + `process.exitCode = 75;\n`,
  );
  const result = await runAll(authoritativeDir, matrixPath);
  assert.deepEqual(
    result.reports.map(({ scenario }) => scenario),
    ["beta"],
  );
  assert.deepEqual(result.failures, []);
  assert.deepEqual(
    result.inconclusive.map(({ scenario }) => scenario),
    [null, "alpha", "gamma"],
  );
  assert.match(result.inconclusive[0].message, /adapter exited 75/);
});

test("a batch that exits 75 still fails a mismatched plan", async () => {
  const { authoritativeDir, matrixPath } = await keepGoingFixture(
    `for (const id of ids) { if (id === "alpha") report(id, false); if (id === "beta") report(id, true); }\n` +
      `process.exitCode = 75;\n`,
  );
  const result = await runAll(authoritativeDir, matrixPath, { keepGoing: true });
  assert.deepEqual(
    result.failures.map(({ scenario }) => scenario),
    ["alpha"],
  );
  assert.deepEqual(
    result.inconclusive.map(({ scenario }) => scenario),
    [null, "gamma"],
  );
});

test("the CLI exits 75 when nothing failed and something was inconclusive, 1 when anything failed", async () => {
  const cli = fileURLToPath(new URL("../bin/tale-spec.mjs", import.meta.url));
  const exit = (args) =>
    new Promise((resolveExit) => {
      const child = spawn(process.execPath, [cli, ...args], { stdio: ["ignore", "pipe", "pipe"] });
      let out = "";
      child.stdout.on("data", (chunk) => {
        out += chunk;
      });
      child.on("close", (code) => resolveExit({ code, out }));
    });
  const inconclusive = await keepGoingFixture(
    `for (const id of ids) { if (id !== "alpha") report(id, true); }\nprocess.exitCode = 75;\n`,
  );
  const quiet = await exit(["run-all", inconclusive.authoritativeDir, inconclusive.matrixPath]);
  assert.equal(quiet.code, 75);
  assert.match(quiet.out, /^INCONCLUSIVE alpha: /m);

  const failing = await keepGoingFixture(
    `for (const id of ids) { if (id === "beta") report(id, false); if (id === "gamma") report(id, true); }\nprocess.exitCode = 75;\n`,
  );
  const red = await exit(["run-all", "--keep-going", failing.authoritativeDir, failing.matrixPath]);
  assert.equal(red.code, 1);

  const one = await keepGoingFixture(`process.exitCode = 75;\n`, { batch: false });
  const single = await exit(["run", join(one.authoritativeDir, "alpha.json"), one.matrixPath]);
  assert.equal(single.code, 75);
  assert.match(single.out, /^INCONCLUSIVE alpha: keep: adapter exited 75/m);
});

test("run judges every client of a matrix even after one is inconclusive", async () => {
  const { authoritativeDir, matrixPath } = await keepGoingFixture(`process.exitCode = 75;\n`, {
    batch: false,
  });
  const root = dirname(matrixPath);
  const second = join(root, "second");
  await mkdir(join(second, "scenarios"), { recursive: true });
  await writeFile(
    join(second, "scenarios", "alpha.json"),
    await readFile(join(authoritativeDir, "alpha.json"), "utf8"),
  );
  await writeFile(
    join(second, "adapter.mjs"),
    `import { writeFileSync } from "node:fs";\nwriteFileSync("ran", "yes");\n` +
      `console.log("TALE_CONFORMANCE_RESULT " + JSON.stringify({ protocol: 1, client: process.env.TALE_CONFORMANCE_CLIENT, scenario: "alpha", version: 1, steps: [{ id: "observe", observations: { ready: false } }] }));\n`,
  );
  const matrix = JSON.parse(await readFile(matrixPath, "utf8"));
  matrix.clients.push({
    id: "second",
    cwd: "second",
    scenario: "scenarios/alpha.json",
    command: [process.execPath, "adapter.mjs"],
  });
  await writeFile(matrixPath, JSON.stringify(matrix));
  // The second client ran, and its wrong answer outranks the first's
  // inconclusive.
  await assert.rejects(
    runMatrix(join(authoritativeDir, "alpha.json"), matrixPath),
    (error) => !(error instanceof InconclusiveVerdict) && /ready/.test(error.message),
  );
  assert.equal(await readFile(join(second, "ran"), "utf8"), "yes");
});

test("run fails an adapter that reports more than one result, whatever it exits", async () => {
  const { authoritativeDir, matrixPath } = await keepGoingFixture(
    `report(ids[0], false);\nreport(ids[0], true);\nprocess.exitCode = 75;\n`,
    { batch: false },
  );
  await assert.rejects(
    runMatrix(join(authoritativeDir, "alpha.json"), matrixPath),
    (error) => !(error instanceof InconclusiveVerdict) && /2 result records/.test(error.message),
  );
});
