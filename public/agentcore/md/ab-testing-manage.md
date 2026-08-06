# Manage an A/B test - Amazon Bedrock AgentCore

Source: https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/ab-testing-manage.html

---

# Manage an A/B test

Update an A/B test to start it, pause it, or stop it. You use the `UpdateABTest` operation to change execution status.

###### Note

The AgentCore CLI lifecycle commands (`view`, `pause`, `resume`, `stop`, `promote`, `archive`) identify a test by its **job ID** passed with `-i, --id`, not by name. Get the ID from `agentcore run ab-test --json` (the `id` field) or by listing tests with `agentcore view ab-test`. The job ID uses the format `name-suffix`. For example: `customerSupportTargetTest-Ab1Cd2Ef3G`. Job records are stored locally as JSON under `.cli/jobs/ab-tests/` in your project.

## Code samples

### View, pause, resume, and stop

###### Example

AgentCore CLI
    

List all A/B test jobs, or view one in detail (also surfaces the invocation URL and results):

```bash
agentcore view ab-test
agentcore view ab-test <ab-test-id>
```
Resume a paused test:

```bash
agentcore resume ab-test -i <ab-test-id>
```
Pause a running test. Traffic stops splitting and all requests route to the control variant. Can be resumed.

```bash
agentcore pause ab-test -i <ab-test-id>
```
Stop a test permanently. All traffic reverts to the control variant. This cannot be undone.

```bash
agentcore stop ab-test -i <ab-test-id>
```
AWS SDK (boto3)
    

Start a test (set execution status to `RUNNING`):

```python
import boto3
import uuid

client = boto3.client("bedrock-agentcore", region_name="us-west-2")

response = client.update_ab_test(
    abTestId="customerSupportPromptTest-Ab1Cd2Ef3G",
    executionStatus="RUNNING",
    clientToken=str(uuid.uuid4()),
)
print(f"Execution status: {response['executionStatus']}")
```
Pause a running test:

```python
response = client.update_ab_test(
    abTestId="customerSupportPromptTest-Ab1Cd2Ef3G",
    executionStatus="PAUSED",
    clientToken=str(uuid.uuid4()),
)
print(f"Execution status: {response['executionStatus']}")
```
Stop a running test permanently:

```python
response = client.update_ab_test(
    abTestId="customerSupportPromptTest-Ab1Cd2Ef3G",
    executionStatus="STOPPED",
    clientToken=str(uuid.uuid4()),
)
print(f"Execution status: {response['executionStatus']}")
```
### Promote the treatment variant

When the results are statistically significant, promote the treatment variant. `promote` stops the test and writes the treatment variant into `agentcore.json`; run `agentcore deploy` afterward to roll it out.

###### Example

AgentCore CLI
     ```bash
     agentcore promote ab-test -i <ab-test-id>
     agentcore deploy
     ```
AWS SDK (boto3)
    

The SDK has no single "promote" operation. Stop the test, then apply the winning variant to your resources yourself (for example, by updating the control configuration bundle or gateway target to match the treatment).

### Delete an A/B test

Delete an A/B test and its associated metadata. The test must be in `STOPPED` execution status before it can be deleted. Deleting a test does not affect the configuration bundles, AgentCore Gateway, or online evaluation configuration that the test referenced.

###### Example

AgentCore CLI
     ```bash
     agentcore archive ab-test -i <ab-test-id>
     ```
AWS SDK (boto3)
    

Stop and then delete:

```python
import boto3
import uuid

client = boto3.client("bedrock-agentcore", region_name="us-west-2")

# First stop the test if it's running
client.update_ab_test(
    abTestId="customerSupportPromptTest-Ab1Cd2Ef3G",
    executionStatus="STOPPED",
    clientToken=str(uuid.uuid4()),
)

# Then delete
response = client.delete_ab_test(
    abTestId="customerSupportPromptTest-Ab1Cd2Ef3G"
)
print(f"Deleted: {response['abTestId']}")
```
## Execution status transitions

From | To | Description  
---|---|---  
`NOT_STARTED` |  `RUNNING` |  Start the test. The AgentCore Gateway begins splitting traffic.  
`RUNNING` |  `PAUSED` |  Pause the test. Traffic stops splitting; all traffic routes to control.  
`PAUSED` |  `RUNNING` |  Resume a paused test.  
`RUNNING` |  `STOPPED` |  Stop the test permanently. Traffic routing ends immediately.  
`PAUSED` |  `STOPPED` |  Stop a paused test permanently.

