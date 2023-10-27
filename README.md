# OHS.GH.Actions.PRLint

This package contains a reusable GitHub Action for running [CommitLint](https://github.com/conventional-changelog/commitlint) against a pull request title & message.

## Uses A Custom Configuration

The configuration for this action is a slight adjustment over the [default](https://github.com/conventional-changelog/commitlint/tree/master/@commitlint/config-conventional) (see above link for that configuration), with the following modifications:

1. Subject case is set to `sentence-case` instead of `lower-case`
2. Scope case (`scope-case`) is not enforced

To implement this action in your repository, create a new workflow file in the `.github/workflows` directory. The following is an example of a workflow file that uses this action:

```yaml
# Will run commit lint a pull request title and message against the
# conventional commit standard
name: CommitLint
on:
  pull_request:
    types: ["opened", "edited", "reopened", "synchronize"]
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
