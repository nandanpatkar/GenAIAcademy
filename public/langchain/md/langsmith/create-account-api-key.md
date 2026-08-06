{/* Pass `prefix` to change the hostname before ".langchain.com" (default: "api.smith").
    Pass `suffix` to append a path (e.g. "/mcp") to each URL.
    Pass `protocol={false}` to render hostnames without "https://". */}

<table>
  <thead>
    <tr>
      <th>Region</th>
      <th>{protocol === false ? "Host" : "URL"}</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>GCP US</td>
      <td><code>{`${protocol === false ? "" : "https://"}${prefix || "api.smith"}.langchain.com${suffix || ""}`}</code></td>
    </tr>
    <tr>
      <td>GCP EU</td>
      <td><code>{`${protocol === false ? "" : "https://"}eu.${prefix || "api.smith"}.langchain.com${suffix || ""}`}</code></td>
    </tr>
    <tr>
      <td>GCP APAC</td>
      <td><code>{`${protocol === false ? "" : "https://"}apac.${prefix || "api.smith"}.langchain.com${suffix || ""}`}</code></td>
    </tr>
    <tr>
      <td>AWS US</td>
      <td><code>{`${protocol === false ? "" : "https://"}aws.${prefix || "api.smith"}.langchain.com${suffix || ""}`}</code></td>
    </tr>
  </tbody>
</table>


To get started with LangSmith, you need to create an account. You can sign up for a free account in the [LangSmith UI](https://smith.langchain.com). LangSmith supports sign in with Google, GitHub, and email.

## API keys

LangSmith supports two types of API keys. You can use both types of token to authenticate requests to the LangSmith API, but they have different use cases:

- [**Personal Access Tokens (PATs)**](lc:langsmith/administration-overview#personal-access-tokens-pats) inherit the permissions of the user who created them. Use PATs for personal scripts or tools.
- [**Service keys**](lc:langsmith/administration-overview#service-keys) scope to specific [workspaces](lc:langsmith/administration-overview#workspaces) or the entire [organization](lc:langsmith/administration-overview#organizations). Use service keys for applications and production services.

To log [traces](lc:langsmith/observability-concepts#traces) and run [evaluations](lc:langsmith/evaluation) with LangSmith, create an API key to authenticate your requests.

  #### Step: Open API Keys settings

    Navigate to the [**Settings** page](https://smith.langchain.com/settings) and select the **API Keys** section.
  
  #### Step: Configure the key type

    For service keys, choose between an organization-scoped and workspace-scoped key. If the key is workspace-scoped, you must specify the workspaces.

    [Enterprise](lc:langsmith/pricing-plans) users can also [assign specific workspace roles](lc:langsmith/administration-overview#workspace-roles-rbac) to service keys, which adjusts their permissions independently of any user.
  
  #### Step: Set expiration

    Set the key's expiration. The key becomes unusable after the number of days chosen, or never, if that is selected.
  
  #### Step: Create the key

    Click **Create API Key.** LangSmith will display the API key only once, so make sure to copy it and store it in a safe place.
  


> [!TIP]
>
> To delete an API key, navigate to the [**Settings** page](https://smith.langchain.com/settings), find the key in the **API Keys** section, and select the trash icon  in the **Actions** column.


> [!TIP]
>
> [Enterprise](lc:langsmith/pricing-plans) Organization Admins can edit the [role](lc:langsmith/administration-overview#workspace-roles-rbac) on an existing service key without rotating the key. On the [**Settings** page](https://smith.langchain.com/settings) **API Keys** section, switch to the **Service** tab and click any service key row to open the edit dialog. Update the workspace role (and, for organization-scoped keys, the org role) and click **Save**. The key string itself is unchanged.


## Configure the SDK

Install the SDK for your language:

  #### Tab: Python

    
      ```lc-tabs
      [
       {
        "label": "pip",
        "lang": "bash",
        "code": "pip install langsmith"
       },
       {
        "label": "uv",
        "lang": "bash",
        "code": "uv add langsmith"
       }
      ]
      ```
    
  
  #### Tab: TypeScript

    ```bash
    npm install langsmith
    ```
  

For full details, refer to the [Python SDK](lc:langsmith/smith-python-sdk) or [JS/TS SDK](lc:langsmith/smith-js-ts-sdk) reference.

Then, set your API key and enable tracing:

```bash
export LANGSMITH_API_KEY=<your-api-key>
export LANGSMITH_TRACING=true
```

You may also need the following additional environment variables:

- `LANGSMITH_ENDPOINT` controls which LangSmith server the SDK sends data to. It defaults to `https://api.smith.langchain.com` (GCP US). Set it only if you are on a different deployment. For regional SaaS, set it to the API URL for your region:

    
{/* Pass `prefix` to change the hostname before ".langchain.com" (default: "api.smith").
    Pass `suffix` to append a path (e.g. "/mcp") to each URL.
    Pass `protocol={false}` to render hostnames without "https://". */}

<table>
  <thead>
    <tr>
      <th>Region</th>
      <th>{protocol === false ? "Host" : "URL"}</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>GCP US</td>
      <td><code>{`${protocol === false ? "" : "https://"}${prefix || "api.smith"}.langchain.com${suffix || ""}`}</code></td>
    </tr>
    <tr>
      <td>GCP EU</td>
      <td><code>{`${protocol === false ? "" : "https://"}eu.${prefix || "api.smith"}.langchain.com${suffix || ""}`}</code></td>
    </tr>
    <tr>
      <td>GCP APAC</td>
      <td><code>{`${protocol === false ? "" : "https://"}apac.${prefix || "api.smith"}.langchain.com${suffix || ""}`}</code></td>
    </tr>
    <tr>
      <td>AWS US</td>
      <td><code>{`${protocol === false ? "" : "https://"}aws.${prefix || "api.smith"}.langchain.com${suffix || ""}`}</code></td>
    </tr>
  </tbody>
</table>


- `LANGSMITH_WORKSPACE_ID` is required only if your API key is scoped to more than one [workspace](lc:langsmith/administration-overview#workspaces). Find your Workspace ID on the [**Settings** page](https://smith.langchain.com/settings) under **General**:

    `LANGSMITH_WORKSPACE_ID=<Workspace ID>`

To reuse endpoint, API key, and workspace settings across local shells or remote runtimes, refer to [Profile configuration](lc:langsmith/profile-configuration).

## Use API keys outside of the SDK

See [instructions for managing your organization via API](lc:langsmith/manage-organization-by-api).
