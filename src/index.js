import * as github from "@actions/github";
import * as core from "@actions/core";
import { stringify } from "querystring";
import load from "@commitlint/load";
import lint from "@commitlint/lint";
import { config } from "./config";

const context = github.context;

const run = async () => {
  const title = context.payload.pull_request.title;
  const body = context.payload.pull_request.body;
  const commitlint_input = title + "\n\n" + body;

  try {
    const opts = load(config);
    const report = lint(
      commitlint_input,
      opts.rules,
      opts.parserPreset ? { parserOpts: opts.parserPreset.parserOpts } : {}
    );
    if (report.value) {
      core.info("All OK");
    } else {
      core.info(stringify(report));
      core.setFailed(`Action failed: Improper title/description format.`)
    }
    return report;
  } catch (error) {
    //core.info(error);
    throw new Error('An error occurred when running CommitLint', {cause: error})
  }
}

(async () => {
  try {
    const result = await run();
    console.log(result);
  } catch (err) {
    core.info(err);
    core.setFailed(`Action failed with error ${err}`)
  }
})();

