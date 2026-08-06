LangSmith supports deploying agents from monorepo setups where your agent code may depend on shared packages located elsewhere in the repository. This guide shows how to structure your monorepo and configure your `langgraph.json` file to work with shared dependencies.

## Repository structure

For complete working examples, see:
- [Python monorepo example](https://github.com/langchain-ai/python-langraph-monorepo-example)
- [JS monorepo example](https://github.com/langchain-ai/js-langgraph-monorepo-example)

```lc-tabs
[
 {
  "label": "Python",
  "lang": "plaintext",
  "code": "my-monorepo/\n\u251c\u2500\u2500 shared-utils/           # Shared Python package\n\u2502   \u251c\u2500\u2500 __init__.py\n\u2502   \u251c\u2500\u2500 common.py\n\u2502   \u2514\u2500\u2500 pyproject.toml      # Or setup.py\n\u251c\u2500\u2500 agents/\n\u2502   \u2514\u2500\u2500 customer-support/   # Agent directory\n\u2502       \u251c\u2500\u2500 agent/\n\u2502       \u2502   \u251c\u2500\u2500 __init__.py\n\u2502       \u2502   \u2514\u2500\u2500 graph.py\n\u2502       \u251c\u2500\u2500 langgraph.json  # Config file in agent directory\n\u2502       \u251c\u2500\u2500 .env\n\u2502       \u2514\u2500\u2500 pyproject.toml  # Agent dependencies\n\u2514\u2500\u2500 other-service/\n    \u2514\u2500\u2500 ..."
 },
 {
  "label": "JS",
  "lang": "plaintext",
  "code": "my-monorepo/\n\u251c\u2500\u2500 package.json            # Root package.json with workspaces\n\u251c\u2500\u2500 shared-utils/           # Shared TypeScript package\n\u2502   \u251c\u2500\u2500 package.json\n\u2502   \u251c\u2500\u2500 src/\n\u2502   \u2502   \u2514\u2500\u2500 index.ts\n\u2502   \u2514\u2500\u2500 tsconfig.json\n\u251c\u2500\u2500 agents/\n\u2502   \u2514\u2500\u2500 customer-support/   # Agent directory\n\u2502       \u251c\u2500\u2500 src/\n\u2502       \u2502   \u2514\u2500\u2500 agent.ts\n\u2502       \u251c\u2500\u2500 langgraph.json  # Config file in agent directory\n\u2502       \u251c\u2500\u2500 package.json    # Agent dependencies\n\u2502       \u251c\u2500\u2500 .env\n\u2502       \u2514\u2500\u2500 tsconfig.json\n\u2514\u2500\u2500 other-service/\n    \u2514\u2500\u2500 ..."
 }
]
```

## LangGraph.json configuration

Place the langgraph.json file in your agent’s directory (not in the monorepo root). Ensure the file follows the required structure:

```lc-tabs
[
 {
  "label": "Python",
  "lang": "json",
  "code": "{\n  \"dependencies\": [\n    \".\",                    # Current agent package\n    \"../../shared-utils\"    # Relative path to shared package\n  ],\n  \"graphs\": {\n    \"customer_support\": \"./agent/graph.py:graph\"\n  },\n  \"env\": \".env\"\n}"
 },
 {
  "label": "JS",
  "lang": "json",
  "code": "{\n  \"node_version\": \"20\",\n  \"graphs\": {\n    \"customer_support\": \"./src/agent.ts:graph\"\n  },\n  \"env\": \".env\"\n}"
 }
]
```

The Python implementation automatically handles packages in parent directories by:
- Detecting relative paths that start with `"."`.
- Adding parent directories to the Docker build context as needed.
- Supporting both real packages (with `pyproject.toml`/`setup.py`) and simple Python modules.

For JavaScript monorepos:
- Shared workspace dependencies are resolved automatically by your package manager.
- Your `package.json` should reference shared packages using workspace syntax.

Example `package.json` in the agent directory:
```json
{
  "name": "customer-support-agent",
  "dependencies": {
    "@company/shared-utils": "workspace:*",
    "@langchain/langgraph": "^0.2.0"
  }
}
```

## Building the application

Run `langgraph build`:

```lc-tabs
[
 {
  "label": "Python",
  "lang": "bash",
  "code": "cd agents/customer-support\nlanggraph build -t my-customer-support-agent"
 },
 {
  "label": "JS",
  "lang": "bash",
  "code": "# Run from the root of the monorepo\nlanggraph build -t my-customer-support-agent -c agents/customer-support/langgraph.json"
 }
]
```

The Python build process:
1. Automatically detects relative dependency paths.
2. Copies shared packages into the Docker build context.
3. Installs all dependencies in the correct order.
4. No special flags or commands required.

The JavaScript build process:
1. Uses the directory you called `langgraph build` from (the monorepo root in this case) as the build context.
2. Automatically detects your package manager (yarn, npm, pnpm, bun).
3. Runs the appropriate install flow based on your project configuration.
4. Uses the directory containing `langgraph.json` to locate the app being built.

## Tips and best practices

1. **Keep agent configs in agent directories**: Place `langgraph.json` files in the specific agent directories, not at the monorepo root. This allows you to support multiple agents in the same monorepo, without having to deploy them all in the same LangSmith deployment.

2. **Use relative paths for Python**: For Python monorepos, use relative paths like `"../../shared-package"` in the `dependencies` array.

3. **Leverage workspace features for JS**: For JavaScript/TypeScript, use your package manager's workspace features to manage dependencies between packages.

4. **Test locally first**: Always test your build locally before deploying to ensure all dependencies are correctly resolved.

5. **Environment variables**: Keep environment files (`.env`) in your agent directories for environment-specific configuration.
