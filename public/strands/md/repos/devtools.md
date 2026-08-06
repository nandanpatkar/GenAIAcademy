[![License](https://img.shields.io/badge/License-Apache%202.0-blue.svg)](LICENSE)

This repository contains common GitHub workflows, actions, and shared tooling used across the [Strands Agents](https://strandsagents.com) organization.

## Overview

This repo serves as a central location for:

- **GitHub Actions & Workflows**: Reusable CI/CD workflows for building, testing, and releasing Strands Agents projects
- **Shared Tooling**: Common scripts and utilities used across multiple repositories

## Actions

| Action | Description |
|--------|-------------|
| [`issue-labeler`](https://github.com/strands-agents/devtools/tree/main/issue-labeler) | Classify issues using an LLM and apply labels from a configurable allowlist |
| [`authorization-check`](https://github.com/strands-agents/devtools/tree/main/authorization-check) | Check user authorization for workflow triggers |
| [`strands-command`](https://github.com/strands-agents/devtools/tree/main/strands-command) | Run a Strands agent in GitHub Actions |

## Documentation

For more information about Strands Agents, visit our [documentation](https://strandsagents.com/latest/documentation/docs/).

## Security

See [CONTRIBUTING](https://github.com/strands-agents/devtools/tree/main/CONTRIBUTING.md#security-issue-notifications) for more information.

## License

This project is licensed under the Apache-2.0 License - see the [LICENSE](https://github.com/strands-agents/devtools/tree/main/LICENSE) file for details.
