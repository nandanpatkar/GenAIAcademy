**Make your integration available to the community.**


> [!WARNING]
>
> **Do not submit integration PRs to the LangChain or Deep Agents repositories.**
>
> New integrations should be published as **standalone PyPI packages** under your own GitHub organization or account (e.g., `langchain-yourservice`), not as PRs to the [`langchain-ai/langchain`](https://github.com/langchain-ai/langchain) repository.
>
> The main repository only contains a small subset of first-party integrations (like OpenAI, Anthropic, and Ollama) maintained by the LangChain team.


Now that your package is implemented and tested, you can publish it and list it so the community can discover it.

## Publishing your package


> [!NOTE]
>
> This guide assumes you have already implemented your package and written tests for it. If you haven't, please refer to the [implementation guide](lc:oss/python/contributing/implement-langchain) and [testing guide](lc:oss/python/contributing/standard-tests-langchain).


For the purposes of this guide, we'll be using PyPI as the package registry. You may choose to publish to other registries if you prefer; instructions will vary.

### Setup credentials

First, make sure you have a PyPI account:

    ### How to create a PyPI Token

        
            #### Step: Create account

                Go to the [PyPI website](https://pypi.org/) and create an account
            

            #### Step: Verify email

                Verify your email address by clicking the link that PyPI emails to you
            

            #### Step: Enable 2FA

                Go to your account settings and click "Generate Recovery Codes" to enable 2FA. To generate an API token, you **must** have 2FA enabled
            

            #### Step: Generate token

                Go to your account settings and [generate a new API token](https://pypi.org/manage/account/token/)
            
        
    

### Build and publish

### [How to publish a package](#)
Helpful guide from `uv` on how to build and publish a package to PyPI.


## Make your integration discoverable

After publishing, open a PR in the [LangChain docs repository](https://github.com/langchain-ai/docs) so your package appears under the [integrations tab](lc:oss/python/integrations/providers/overview). Which PR you open depends on eligibility for a hosted guide.

### Eligibility for hosted guides

LangChain hosts full integration guides in this docs repo only when **either**:

- The package has at least **50,000 monthly downloads** on PyPI (or npm for TypeScript), **or**
- Maintainers mark the integration as **featured**

If you do not meet either criterion, do **not** open a PR that adds a new docs page. Instead, add a YAML listing so the package appears in the component download table with a link to your own docs.

### List in the download table (default)

Open a PR that adds an entry to [`scripts/data/integration_external_docs.yaml`](https://github.com/langchain-ai/docs/blob/main/scripts/data/integration_external_docs.yaml).

Each entry needs at least:

- **`name`**: LangChain class or display name (for example, `ChatAI21`).
- **`pypi`** or **`npm`**: Registry package name used for the downloads badge.
- **`docs_url`**: Link for the name column. Prefer partner docs, then the GitHub repo, then the PyPI or npm page.

Optionally include component-specific fields (for example, chat capability flags such as `stream` and `tool_calling`) so the table columns stay accurate. Follow existing entries in the same language and component section.

After merge, the refresh job regenerates the component table snippets so your row appears alongside hosted integrations.


> [!NOTE]
>
> This PR is for **listing metadata only**. Host your usage docs on your site or GitHub README. Your integration package itself should live in its own repository under your GitHub organization or account, published as a standalone package.


### Hosted guide (50K+ or featured)

If your package meets the [eligibility criteria](#eligibility-for-hosted-guides), create a documentation page from one of the following templates and open a PR in the docs repo.

Depending on the type of integration you have built, you will need to create different types of documentation pages. LangChain provides templates for different types of integrations to help you get started.


    ### [Chat models](#)

    
    


> [!TIP]
>
> To reference existing documentation, you can look at the [list of integrations](lc:oss/python/integrations/providers/overview) and find similar ones to yours.
>
>     To view a given documentation page in raw markdown, use the dropdown button next to "Copy page" on the top right of the page and select "View as Markdown".


Make a fork of the [LangChain docs repository](https://github.com/langchain-ai/docs) (not the main `langchain` repo) under a personal GitHub account, and clone it locally. Create a new branch for your integration. Copy the template and modify it using your favorite markdown text editor. Make sure to refer to and follow the [documentation guide](lc:oss/python/contributing/documentation) when writing your documentation.

If your package was previously listed in [`integration_external_docs.yaml`](https://github.com/langchain-ai/docs/blob/main/scripts/data/integration_external_docs.yaml), remove that YAML entry in the same PR so the table does not show a duplicate row.

Do not set `featured: true` in frontmatter unless a maintainer asks you to. Featured status is a maintainer decision.


> [!NOTE]
>
> This PR is for **documentation only**. Your integration package itself should live in its own repository under your GitHub organization or account, published as a standalone package.


> [!WARNING]
>
> We may reject PRs or ask for modification if:
>     - The package does not meet the [hosted-guide eligibility criteria](#eligibility-for-hosted-guides)
>     - CI checks fail
>     - Severe grammatical errors or typos are present
>     - [Mintlify components](lc:oss/python/contributing/documentation#mintlify-components) are used incorrectly
>     - Pages are missing a [frontmatter](lc:oss/python/contributing/documentation#page-structure)
>     - [Localization](lc:oss/python/contributing/documentation#localization) is missing (where applicable)
>     - [Code examples](lc:oss/python/contributing/documentation#in-code-documentation) do not run or have errors
>     - [Quality standards](lc:oss/python/contributing/documentation#quality-standards) are not met


Please be patient as we handle a large volume of PRs. We will review your PR as soon as possible and provide feedback or merge it. **Do not repeatedly tag maintainers about your PR.**


> [!NOTE]
>
> If your PR includes AI-generated content, you must follow our [acceptable uses of LLMs](lc:oss/python/contributing/overview#acceptable-uses-of-llms) policy.


## Next steps

**Congratulations!** Your integration is published and listed for the LangChain community.

<Card title="Co-marketing" icon="speakerphone" href="/oss/contributing/comarketing" arrow>
    Get in touch with the LangChain marketing team to explore co-marketing opportunities.
