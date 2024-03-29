import * as github from "@actions/github";
import * as core from "@actions/core";
import { stringify } from "querystring";
import load from "@commitlint/load";
import lint from "@commitlint/lint";
import { config } from "./config";

const context = github.context;

const checkedTypes = ["fix", "feat"];

function testForStoryOrDefect(msg) {
  const msgParts = msg.split("\n");
  const [title] = msgParts;
  const [type] = title.split(":");
  const [ident] = msgParts.slice(-1);
  if (
    checkedTypes.includes(type) &&
    (msgParts.length === 1 || !/^#\d+/.test(ident))
  ) {
    return false;
  }
  return true;
}

const run = async () => {
  const title = context.payload.pull_request.title;
  const body = context.payload.pull_request.body;
  const commitlint_input = title + "\n\n" + body;

  try {
    const opts = await load(config);
    const report = await lint(
      commitlint_input,
      opts.rules,
      opts.parserPreset ? { parserOpts: opts.parserPreset.parserOpts } : {}
    );
    if (report.valid) {
      if (testForStoryOrDefect(commitlint_input)) {
        core.info("All OK");
      } else {
        core.setFailed(
          `Action failed: You forgot the story/defect identifier in your description ('#[identifier]').`
        );
      }
    } else {
      core.info(stringify(report));
      core.setFailed(`Action failed: Improper title/description format.`);
    }
    return report;
  } catch (error) {
    throw new Error("An error occurred when running CommitLint", {
      cause: error,
    });
  }
};

(async () => {
  try {
    const result = await run();
    if (!result.valid) {
      console.log(result.errors.map(({ message }) => message));
    }
  } catch (err) {
    core.info(err);
    core.setFailed(`Action failed with error ${err}`);
  }
})();
