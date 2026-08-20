# Agents

Nine destinations. Eight of them are documentation archives for external agent frameworks, read inside the app; the ninth is a catalogue of agents built in this project.

This section is the clearest example of the repository's content strategy: none of this prose lives in the bundle, and most of it does not live in the repository either.

## One viewer, several products

The five LangChain-family entries share a single panel. The nav id doubles as the product id, so no extra mapping is needed:

```javascript
case "langchain":
case "langgraph":
case "deepagents":
case "langsmith":
case "langchain_samples":
  if (p.setLangChainProduct) p.setLangChainProduct(id);
  if (p.setShowLangChainDocs) p.setShowLangChainDocs(true);
  break;
```

`getActiveNavId` reverses it with `p.langChainProduct || "langchain"`.

### LangChain

![LangChain documentation.](/docs-shots/sections/langchain.jpg)

### LangGraph

![LangGraph documentation.](/docs-shots/sections/langgraph.jpg)

### Deep Agents

![Deep Agents documentation.](/docs-shots/sections/deep-agents.jpg)

### LangSmith

![LangSmith documentation.](/docs-shots/sections/langsmith.jpg)

### LangChain Samples

![LangChain samples.](/docs-shots/sections/langchain-samples.jpg)

All five render through `src/components/LangChainDocs.jsx`, using the shared renderer in `src/components/LangChainMarkdown.jsx` and the stylesheet in `src/styles/LangChainDocs.css`. Content is produced by `npm run build:langchain` and served through the `/langchain/*` rewrite to `docs-cdn-worker`.

## Strands Agents

![Strands Agents documentation.](/docs-shots/sections/strands-agents.jpg)

Sets `showStrandsDocs`; the panel is `src/components/StrandsDocs.jsx`.

One nav item over five in-viewer products — user guide, API reference, examples, community catalogue and samples cookbook — with a switcher at the top of the rail, because the prose cross-references across all five constantly. `getActiveNavId` therefore maps all of them back to the single `strands` id.

The viewer's own header explains the arrangement: `scripts/build_strands_docs.py` lowers the Strands archive onto the exact contract `LangChainMarkdown` already renders, so this file reuses that renderer and stylesheet and only overrides the palette and one construct Strands adds — `(( tab "Python" ))` language tabs, whose bodies are markdown and so render through a nested pass.

431 pages, fetched from `public/strands/md/` on demand and cached for the session.

## AWS Agent Core

![AWS Agent Core documentation.](/docs-shots/sections/aws-agent-core.jpg)

## Amazon Connect

![Amazon Connect documentation.](/docs-shots/sections/amazon-connect.jpg)

These two are the same panel — `src/components/AgentCoreViewer.jsx` — entered in different modes:

```javascript
case "aws_agentcore": setAgentCoreMode("docs"); setShowAgentCore(true); break;
case "amazon_connect": setAgentCoreMode("connect"); setShowAgentCore(true); break;
```

`getActiveNavId` reads the mode back to decide which of the two highlights. Content comes from `scripts/build_agentcore_samples.py` and the `/agentcore/*` and `/agentcore-samples/*` rewrites.

## Agent Library

![Agent Library.](/docs-shots/sections/agent-library.jpg)

Sets `showAgentLibrary`; the panel is `src/components/AgentLibrary.jsx`, backed by `src/services/agentLibraryService.js`.

The one entry in this section that is not an external archive — a catalogue of agents rather than documentation about a framework.

## Section migration

All nine ids are listed in `AGENT_ITEM_IDS` and re-homed together by `resolveEffectiveLayout()`. The source comment is specific about why: without it, anyone with a saved layout — which is everyone who has ever customised the sidebar — would get the LangChain entries appended to "More tools" as orphans while `aws_agentcore` and `agent_library` stayed in their old groups, so the section would look right on a fresh profile and wrong everywhere else.
