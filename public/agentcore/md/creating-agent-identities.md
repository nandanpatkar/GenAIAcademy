# Create and manage workload identities - Amazon Bedrock AgentCore

Source: https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/creating-agent-identities.html

---

# Create and manage workload identities

You can create agent identities using several methods, including the AWS CLI and the AgentCore SDK, depending on your workflow and integration requirements. AgentCore Identity provides multiple interfaces for identity creation including command-line tools for automation and scripting and programmatic APIs for integration with existing systems. Each creation method supports the full range of identity properties while providing appropriate interfaces for different use cases and user preferences.

###### Topics

  * Manage identities with AWS CLI

  * Create identities with the AgentCore SDK


## Manage identities with AWS CLI

The AWS CLI provides a straightforward way to create and delete agent identities.

**Create an identity**

The following command creates a workload identity named `my-agent`.

```bash
aws bedrock-agentcore-control create-workload-identity \
    --name "my-agent"
```
**List all identities**

The following command lists all workload identities in your account.

```bash
aws bedrock-agentcore-control list-workload-identities
```
**Delete an identity**

The following command deletes the workload identity named `my-agent`.

```bash
aws bedrock-agentcore-control delete-workload-identity \
    --name "my-agent"
```
## Create identities with the AgentCore SDK

The AgentCore SDK provides support for creating workload identities in Python.

**Python example**

The following Python code creates a workload identity using the AgentCore SDK.

```python
from bedrock_agentcore.services.identity import IdentityClient

# Initialize the client
identity_client = IdentityClient("us-east-1")

# Create a new workload identity for agent
response = identity_client.create_workload_identity(name='my-python-agent')
agentArn = response['workloadIdentityArn']

print(f"Created agent identity with ARN: {agentArn}")
```
