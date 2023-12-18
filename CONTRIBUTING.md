# Contributing to Badeel

A big welcome and thank you for considering contributing to Badeel! It’s people like you that make it a reality for users in our community.

Reading and following these guidelines will help us make the contribution process easy and effective for everyone involved. It also communicates that you agree to respect the time of the developers managing and developing these open source projects. In return, we will reciprocate that respect by addressing your issue, assessing changes, and helping you finalize your pull requests.

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
  - [Issues](#issues)
  - [Pull Requests](#pull-requests)
- [Committing](#committing)

## Code of Conduct

We take the open source community seriously and hold ourselves and other contributors to high standards of communication. By participating and contributing to this project, you agree to uphold the [Code of Conduct](./CODE_OF_CONDUCT.md).

## Getting Started

Contributions are made to this repo via Issues and Pull Requests (PRs). A few general guidelines that cover both:

- Search for existing Issues and PRs before creating your own.
- Depending on the impact, it could take a while to investigate the root cause of a bug. A friendly ping in the comment thread to the submitter or a contributor can help draw attention if your issue is blocking.

### Issues

Issues should be used to report problems with the platform, request a new feature, or to discuss potential changes before a PR is created. When you create a new Issue, a template will be loaded that will guide you through collecting and providing the information we need to investigate.

If you find an Issue that addresses the problem you're having, please add your own reproduction information to the existing issue rather than creating a new one. Adding a [reaction](https://github.blog/2016-03-10-add-reactions-to-pull-requests-issues-and-comments/) can also help be indicating to our maintainers that a particular problem is affecting more than just the reporter.

> ⚠️ Reproduction steps for bugs greatly helps.

### Pull Requests

PRs to our libraries are always welcome and can be a quick way to get your fix or improvement slated for the next release. In general, PRs should:

- Only fix/add the functionality in question **OR** address wide-spread whitespace/style issues, not both.
- Add unit or integration tests for fixed or changed functionality (if a test suite already exists).
- Address a single concern in the least number of changed lines as possible.
- Include documentation
- Be accompanied by a complete Pull Request template (loaded automatically when a PR is created).

> It's best to open an Issue to discuss your proposal first.

In general, we follow the ["fork-and-pull" Git workflow](https://github.com/susam/gitpr)

1. Fork the repository to your own Github account
2. Clone the project to your machine
3. Create a branch locally with a descriptive name
4. Commit changes to the branch
5. Following any formatting and testing guidelines specific to this repo
6. Push changes to your fork
7. Open a PR in our repository and follow the PR template so that we can efficiently review the changes.

## Committing

Please run `npm run commit` after staging your changes to start committing
changes after using git add. This will ensure you use proper formatting using an
interactive commit creator, and will activate the pre-commit hook to lint,
prettify, and run the available tests against your code.

If you know what the Angular commit format is and have used it before then by
all means feel free to commit as you usually do after running `npm run
precommit`. Note though that your commit messages will be checked by husky to
make sure they're compliant either way.

> Make sure to sign your commits. This guarantees ownership of your contributions.
