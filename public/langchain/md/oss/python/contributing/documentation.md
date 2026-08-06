We welcome contributions to LangChain documentation, including new features, [integrations](lc:oss/python/contributing/publish-langchain), and improvements to existing docs.

## Quick start - local development

To run a local preview of the documentation:

```bash
git clone https://github.com/langchain-ai/docs.git
```

```bash
cd docs
```

```bash
make install
```

```bash
make dev
```

This starts a development server with hot reload at `http://localhost:3000`. Edit files in `src/` and see changes immediately.


> [!TIP]
>
> **Using an AI coding agent?** Install [LangChain Skills](https://github.com/langchain-ai/langchain-skills) to improve your agent's performance on LangChain ecosystem tasks, then click the "Copy page" button on the top right of this page and paste the raw content into your agent to have it set up your environment automatically.


> [!TIP]
>
> If you are having issues with you local preview, try running `mint update` to ensure you're using the latest Mintlify version.


### Prerequisites

    **Required:**
    - Python 3.13+
    - [uv](https://docs.astral.sh/uv/) - Python package manager
    - [Node.js](https://nodejs.org/en) and npm
    - [Make](https://www.gnu.org/software/make/)
    - [Git](https://git-scm.com/)

    **Optional:**
    - [markdownlint-cli](https://github.com/igorshubovych/markdownlint-cli) - `npm install -g markdownlint-cli`
    - [Mintlify MDX VSCode extension](https://www.mintlify.com/blog/mdx-vscode-extension)

## Edit documentation

### Quick edits on GitHub

    For typos or small changes, edit directly on GitHub without local setup:

    1. Click **Edit this page on GitHub** at the bottom of any page.
    1. Fork to your personal account.
    1. Make changes in GitHub's web editor.
    1. Create a pull request.


> [!NOTE]
>
> **Only edit files in `src/`**-- The `build/` directory is automatically generated.


1. Edit files in `src/` following our [writing standards](#writing-standards).
1. Run [quality checks](#run-quality-checks) before submitting.
1. Create a pull request for review.


> [!NOTE]
>
> All pull requests must link to an issue or discussion where a solution has been approved by a maintainer. See our [pull request requirements](lc:oss/python/contributing/overview#pull-request-requirements).


### Create a sharable preview build (LangChain team only)

    When you create or update a PR, a [preview branch/ID](https://github.com/langchain-ai/docs/actions/workflows/create-preview-branch.yml) is automatically generated. A comment will be left on the PR with the ID.

    1. Copy the preview branch's ID from the comment
    2. In the [Mintlify dashboard](https://dashboard.mintlify.com/langchain-5e9cc07a/langchain-5e9cc07a?section=previews), click **Create preview deployment**
    3. Enter the preview branch's ID and click **Create deployment**
    4. Select the preview and click **Visit** to view

    To redeploy with latest changes, click **Redeploy** on the dashboard.

### Run quality checks

Before submitting changes, ensure your code passes formatting and linting checks:

```bash
# Check broken links
make broken-links

# Format code automatically
make format

# Check for linting issues
make lint

# Fix markdown issues
make lint_md_fix

# Run tests to ensure your changes don't break existing functionality
make test
```

For more details, see the [available commands](https://github.com/langchain-ai/docs?tab=readme-ov-file#available-commands) section in the `README`.


> [!WARNING]
>
> All pull requests are automatically checked by CI/CD. The same linting and formatting standards will be enforced, and PRs cannot be merged if these checks fail.


## Documentation types

All documentation falls under one of four categories:

    ### [How-to guides](#)
Task-oriented instructions for users who know what they want to accomplish.

    ### [Conceptual guides](#)
Explanations that provide deeper understanding and insights.

    ### [Reference](#)
Technical descriptions of APIs and implementation details.

    ### [Tutorials](#)
Lessons that guide users through practical activities to build understanding.


> [!NOTE]
>
> Where applicable, all documentation must have both Python and JavaScript/TypeScript content. For more details, see the [co-locate Python and JavaScript/TypeScript content](#co-locate-python-and-javascript%2Ftypescript-content) section.


### How-to guides

How-to guides are task-oriented instructions for users who know what they want to accomplish. Examples of how-to guides are on the [LangChain](lc:oss/python/langchain/overview) and [LangGraph](lc:oss/python/langgraph/overview) tabs.

    ### Characteristics

        - **Task-focused**: Focus on a specific task or problem
        - **Step-by-step**: Break down the task into smaller steps
        - **Hands-on**: Provide concrete examples and code snippets
    

    ### Tips

        - Focus on the **how** rather than the **why**
        - Use concrete examples and code snippets
        - Break down the task into smaller steps
        - Link to related conceptual guides and references
    

    ### Examples

        - [Messages](lc:oss/python/langchain/messages)
        - [Tools](lc:oss/python/langchain/tools)
        - [Streaming](lc:oss/python/langgraph/streaming)
    

### Conceptual guides

Conceptual guide cover core concepts abstractly, providing deep understanding.

    ### Characteristics

        - **Understanding-focused**: Explain why things work as they do
        - **Broad perspective**: Higher and wider view than other types
        - **Design-oriented**: Explain decisions and trade-offs
        - **Context-rich**: Use analogies and comparisons
    

    ### Tips

        - Focus on the **"why"** rather than the "how"
        - Provides supplementary information not necessarily required for feature usage
        - Can use analogies and reference alternatives
        - Avoid blending in too much reference content
        - Link to related tutorials and how-to guides
    

    ### Examples

        - [Memory](lc:oss/python/concepts/memory)
        - [Context](lc:oss/python/concepts/context)
        - [Graph API](lc:oss/python/langgraph/graph-api)
        - [Functional API](lc:oss/python/langgraph/functional-api)
    

### Reference

Reference documentation contains detailed, low-level information describing exactly what functionality exists and how to use it.

    
    

A good reference should:
- Describe what exists (all parameters, options, return values)
- Be comprehensive and structured for easy lookup
- Serve as the authoritative source for technical details

    ### Contributing to references

        The generated API reference at [reference.langchain.com](https://reference.langchain.com/python/) is built and deployed outside this repository. To report bugs, missing packages, or broken pages there, [open a reference documentation issue](https://github.com/langchain-ai/docs/issues/new?template=04-reference-docs.yml).
    

    ### LangChain reference best practices

        - **Be consistent**; follow existing patterns for provider-specific documentation
        - Include both basic usage (code snippets) and common edge cases/failure modes
        - Note when features require specific versions
    

    ### When to create new reference documentation

        - New integrations that meet the [hosted-guide eligibility criteria](lc:oss/python/contributing/publish-langchain#eligibility-for-hosted-guides) (50,000+ monthly downloads or featured)
        - Complex configuration options require detailed explanation
        - API changes introduce new parameters or behavior
        - Community frequently asks questions about specific functionality
    

### Tutorials

Tutorials are longer form step-by-step guides that builds upon itself and takes users through a specific practical activity to build understanding. Tutorials are typically found on the [Learn](lc:oss/python/learn) tab.


> [!NOTE]
>
> We generally do not merge new tutorials from outside contributors without an acute need. If you feel that a certain topic is missing from docs or is not sufficiently covered, please [open a new issue](https://github.com/langchain-ai/docs/issues).


    ### Characteristics

        - **Practical**: Focus on practical activities to build understanding.
        - **Step-by-step**: Break down the activity into smaller steps.
        - **Hands-on**: Provide sequential, working code snippets.
        - **Supplementary**: Provide additional context and information not necessarily required for feature usage.
    

    ### Tips

        - Code snippets should be sequential and working if the user follows the steps in order.
        - Provide some context for the activity, but link to related conceptual guides and references for more detailed information.
    

    ### Examples

        - [Semantic search](lc:oss/python/langchain/knowledge-base)
        - [RAG agent](lc:oss/python/deepagents/rag)
    

## Writing standards


> [!NOTE]
>
> Standards for pages on [reference.langchain.com](https://reference.langchain.com/python/) live with that site’s build pipeline, not in this repo. Use the [reference documentation issue template](https://github.com/langchain-ai/docs/issues/new?template=04-reference-docs.yml) for questions or fixes about generated API reference content.


### Mintlify components

Use [Mintlify components](https://mintlify.com/docs/text) to enhance readability:

    #### Tab: Callouts

    - `

> [!NOTE]
>
> ` for helpful supplementary information
>     - `` for important cautions and breaking changes
>     - `` for best practices and advice
>     - `` for neutral contextual information
>     - `` for success confirmations
>
> #### Tab: Structure
>
>     - `` for an overview of sequential procedures. **Not** for long lists of steps or tutorials.
>     - `` for platform-specific content.
>     - `` and `` for nice-to-have information that can be collapsed by default (e.g., full code examples).
>     - `` and `<Card>` for highlighting content.
>
> #### Tab: Code
>
>     - `` for multiple language examples.
>     - Always specify language tags on code blocks (e.g., ` ```python`, ` ```javascript`).
>     - Titles for code blocks (e.g. `Success`, `Error Response`)
>
>
> ### Mermaid diagrams
>
> When adding mermaid diagrams, use the LangChain brand color palette for node styling. Copy `classDef` lines from any existing diagram, or use the reference table in [`CLAUDE.md`](https://github.com/langchain-ai/docs/blob/main/CLAUDE.md#mermaid-diagram-styling).
>
> | Role | Fill | Stroke | Text |
> |------|------|--------|------|
> | process | `#E5F4FF` | `#006DDD` | `#030710` |
> | trigger | `#F6FFDB` | `#6E8900` | `#2E3900` |
> | decision | `#FDF3FF` | `#7E65AE` | `#504B5F` |
> | output | `#EBD0F0` | `#885270` | `#441E33` |
> | alert | `#F8E8E6` | `#B27D75` | `#634643` |
> | neutral | `#F2FAFF` | `#40668D` | `#2F4B68` |
>
> Do not use Tailwind defaults, Material Design colors, or other off-brand palettes.
>
> ### Page structure
>
> Every documentation page must begin with YAML frontmatter:
>
> ```yaml
> ---
> title: "Clear, specific title"
> sidebarTitle: "Short title for the sidebar (optional)"
> ---
> ```
>
> ### Co-locate Python and JavaScript/TypeScript content
>
> All documentation must be written in both Python and JavaScript/TypeScript when possible. To do so, we use a custom in-line syntax to differentiate between sections that should appear in one or both languages:
>
> ```mdx
> \:::python
> Python-specific content. In real docs, the preceding backslash (before `python`) is omitted.
> \:::
>
> \:::js
> JavaScript/TypeScript-specific content. In real docs, the preceding backslash (before `js`) is omitted.
> \:::
>
> Content for both languages (not wrapped)
> ```
>
> This will generate two outputs (one for each language) at `/oss/python/concepts/foo.mdx` and `/oss/javascript/concepts/foo.mdx`. Each outputted page will need to be added to the `/src/docs.json` file to be included in the navigation.
>
> 
>     We don't want a lack of parity to block contributions. If a feature is only available in one language, it's okay to have documentation only in that language until the other language catches up. In such cases, please include a note indicating that the feature is not yet available in the other language.
>
>     If you need help translating content between Python and JavaScript/TypeScript, please ask in the [community slack](https://www.langchain.com/join-community) or tag a maintainer in your PR.


## Quality standards

### General guidelines

    ### Avoid duplication

        Multiple pages covering the same material are difficult to maintain and cause confusion. There should be only one canonical page for each concept or feature. Link to other guides instead of re-explaining.
    

    ### Link frequently

        Documentation sections don't exist in a vacuum. Link to other sections frequently to allow users to learn about unfamiliar topics. This includes linking to API references and conceptual sections.
    

    ### Be concise

        Take a less-is-more approach. If another section with a good explanation exists, link to it rather than re-explain, unless your content presents a new angle.
    

### Accessibility requirements

Ensure documentation is accessible to all users:

- Structure content for easy scanning with headers and lists
- Use specific, actionable link text instead of "click here"
- Include descriptive alt text for all images and diagrams

### Cross-referencing

Use consistent cross-references to connect docs with API reference documentation.

**From docs to API reference:**

Use the `@[]` syntax to link to API reference pages:

```mdx
See \`ChatAnthropic` for all configuration options.

The \`bind_tools`[ChatAnthropic.bind_tools] method accepts...
```

The build pipeline transforms these into proper markdown links based on the current language scope (Python or JavaScript). For example, `\`ChatAnthropic`` becomes a link to the Python or JS API reference page depending on which version of the docs is being built, **but only if an entry exists in the `link_map.py` file!** See below for details.

### How autolinks work

The `@[]` syntax is processed by [`handle_auto_links.py`](https://github.com/langchain-ai/docs/blob/main/pipeline/preprocessors/handle_auto_links.py). It looks up link keys in [`link_map.py`](https://github.com/langchain-ai/docs/blob/main/pipeline/preprocessors/link_map.py), which contains dictionary mappings for both Python and JavaScript scopes.

**Supported formats:**

| Syntax | Result |
|--------|--------|
| `\`ChatAnthropic`` | Link with "ChatAnthropic" as the displayed text |
| `` \`ChatAnthropic` `` | Link with `` `ChatAnthropic` `` (code formatted) as text |
| `\`text`[ChatAnthropic]` | Link with "text" as text and `ChatAnthropic` as the key in the link map |
| `\\`ChatAnthropic`` | Escaped: renders as literal `\`ChatAnthropic`` (no link – what's being used on this page!) |

**Adding new links:**

If a link isn't found in the map, it will be left unchanged in the output. To add a new autolink:

1. Open `pipeline/preprocessors/link_map.py`
2. Add an entry to the appropriate scope (`python` or `js`) in `LINK_MAPS`
3. The key is the link name used in `\`key`` or `\`text`[key]`, the value is the path relative to the reference host

**From API reference stubs to OSS docs:**

Cross-links and deep anchors in the published Python API reference are generated outside this repository. If a link from reference.langchain.com to docs.langchain.com is wrong or outdated, [open an issue](https://github.com/langchain-ai/docs/issues/new?template=04-reference-docs.yml) with the source and destination URLs.

### Localization

Where a feature exists in both SDKs, document it for [Python and JavaScript/TypeScript together](#co-locate-python-and-javascript%2Ftypescript-content). If only one language is supported yet, ensure the feature and references to it are only visible for that language.

### In-code documentation

Examples must be correct, copy-pasteable where possible, and **tested** before you open a pull request. Mark non-runnable snippets clearly (for example, pseudocode or illustrative fragments).

## Get help

Our goal is to have the simplest developer setup possible. Should you experience any difficulty getting setup, please ask in the [community slack](https://www.langchain.com/join-community) or open a [forum post](https://forum.langchain.com/). Internal team members can reach out in the [#documentation](https://langchain.slack.com/archives/C04GWPE38LV) Slack channel.
