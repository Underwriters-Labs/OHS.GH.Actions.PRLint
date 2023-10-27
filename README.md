# OHS.GH.Actions.PRLint

This package contains a reusable GitHub Action for running [CommitLint](https://github.com/conventional-changelog/commitlint) against a pull request title & message.

To implement this action in your repository, create a new workflow file in the `.github/workflows` directory. The following is an example of a workflow file that uses this action:

```yaml
name: CommitLint
on:
  pull_request:
    types: ["opened", "edited", "reopened", "synchronize"]
# testing something
jobs:
  lint:
    name: Lint PR Title and Message
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Install Dependencies
        run: npm ci
      - name: Lint
        id: lint
        uses: Underwriters-Labs/OHS.GH.Actions.PRLint@v0.0.10
      # Post some output on failure
      - name: Output Results
        if: steps.lint.outcome != 'success'
        run: echo "${{ steps.lint.outputs.message }}" >> $GITHUB_STEP_SUMMARY
```
