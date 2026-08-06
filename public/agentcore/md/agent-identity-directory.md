# Understanding the agent identity directory - Amazon Bedrock AgentCore

Source: https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/agent-identity-directory.html

---

# Understanding the agent identity directory

The agent identity directory is a centralized collection of all workload identities within your AWS account. It serves as the authoritative registry for managing and organizing agent identities, providing a unified view of all identities whether they were created automatically by AgentCore Runtime and Gateway or manually through the AWS CLI and SDK. For information about creating workload identities, see [Create and manage workload identities](<https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/./creating-agent-identities.html>).

###### Topics

  * Directory concepts and structure

  * Directory management best practices

  * Listing and viewing directory contents

  * Directory access control and permissions


## Directory concepts and structure

Understanding the fundamental concepts and organizational structure of the agent identity directory helps you effectively manage workload identities at scale.

**Key characteristics**

  * **Single directory per account** – Each AWS account has exactly one agent identity directory

  * **Automatic creation** – The directory is automatically created when the first workload identity is created in your account

  * **Centralized management** – All workload identities, regardless of how they were created, are stored in this directory

  * **Cross-service visibility** – The directory provides visibility into identities created by Runtime, Gateway, and manual processes


**Directory structure**

```text
arn:aws:bedrock-agentcore:region:account-id:workload-identity-directory/default
├── workload-identity/runtime-created-agent-1
├── workload-identity/runtime-created-agent-2
├── workload-identity/gateway-created-agent-1
├── workload-identity/manually-created-agent-1
└── workload-identity/manually-created-agent-2
```
## Directory management best practices

Following established best practices for directory management helps maintain organization, security, and operational efficiency as your workload identity usage grows.

**Naming conventions**

  * Use descriptive names that indicate the agent’s purpose (such as "customer-support-agent", "data-analysis-agent")

  * Include environment indicators for multi-environment deployments (such as "prod-chatbot", "dev-chatbot")

  * Consider team or project prefixes for large organizations (such as "marketing-content-agent")


**Organization strategies**

  * Regularly audit your directory to identify unused or obsolete workload identities

  * Document the purpose and ownership of each workload identity

  * Implement consistent tagging strategies for workload identities when available. For more information, see [Tagging AgentCore Identity resources](<https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/./identity-tagging.html>).

  * Monitor directory growth and establish governance processes for identity creation


**Security considerations**

  * Regularly review IAM policies that grant access to the directory

  * Use least-privilege principles when granting directory access

  * Monitor directory access through AWS CloudTrail logs

  * Implement automated alerts for unauthorized directory modifications


## Listing and viewing directory contents

You can view all workload identities in your directory using the AWS CLI:

**List all workload identities**

```bash
aws bedrock-agentcore-control list-workload-identities
```
This command returns information about all workload identities in your account, including:

  * Workload identity names and ARNs

  * Creation timestamps

  * Associated metadata

  * Creation source (Runtime, Gateway, or manual)


**Example output**

```json
{
  "workloadIdentities": [
    {
      "workloadIdentityArn": "arn:aws:bedrock-agentcore:us-east-1:123456789012:workload-identity-directory/default/workload-identity/my-runtime-agent",
      "workloadIdentityName": "my-runtime-agent",
      "createdAt": "2024-01-15T10:30:00Z",
      "createdBy": "AgentCore Runtime"
    },
    {
      "workloadIdentityArn": "arn:aws:bedrock-agentcore:us-east-1:123456789012:workload-identity-directory/default/workload-identity/my-custom-agent",
      "workloadIdentityName": "my-custom-agent",
      "createdAt": "2024-01-16T14:20:00Z",
      "createdBy": "Manual"
    }
  ]
}
```
**Get details about a specific workload identity**

```bash
aws bedrock-agentcore-control get-workload-identity \
    --workload-identity-name my-agent-name
```
## Directory access control and permissions

The agent identity directory integrates with IAM to provide fine-grained access control over workload identities and their associated resources. For information about using workload identities to control access to credential providers, see [Scope down access to credential providers by workload identity](<https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/./scope-credential-provider-access.html>).

**Directory-level permissions**

  * **List permissions** – Control who can view the directory contents

  * **Create permissions** – Control who can create new workload identities

  * **Read permissions** – Control who can view specific workload identity details

  * **Delete permissions** – Control who can remove workload identities


**Example IAM policy for directory access**

```json
{
"Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "ListWorkloadIdentities",
      "Effect": "Allow",
      "Action": [
        "bedrock-agentcore:ListWorkloadIdentities"
      ],
      "Resource": [
        "arn:aws:bedrock-agentcore:*:*:workload-identity-directory/default"
      ]
    },
    {
      "Sid": "ManageSpecificWorkloadIdentity",
      "Effect": "Allow",
      "Action": [
        "bedrock-agentcore:GetWorkloadIdentity",
        "bedrock-agentcore:CreateWorkloadIdentity",
        "bedrock-agentcore:DeleteWorkloadIdentity"
      ],
      "Resource": [
        "arn:aws:bedrock-agentcore:*:*:workload-identity-directory/default/workload-identity/my-agent-*"
      ]
    }
  ]
}
```
