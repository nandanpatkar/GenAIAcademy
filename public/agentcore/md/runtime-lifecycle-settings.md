# Configure Amazon Bedrock AgentCore lifecycle settings - Amazon Bedrock AgentCore

Source: https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/runtime-lifecycle-settings.html

---

# Configure Amazon Bedrock AgentCore lifecycle settings

The `LifecycleConfiguration` input parameter to [CreateAgentRuntime](<https://docs.aws.amazon.com/bedrock-agentcore-control/latest/APIReference/API_CreateAgentRuntime.html>) lets you manage the lifecycle of runtime sessions and resources in Amazon Bedrock AgentCore Runtime. This configuration helps optimize resource utilization by automatically cleaning up idle sessions and preventing long-running instances from consuming resources indefinitely.

You can also configure lifecycle settings for an existing AgentCore Runtime with the [UpdateAgentRuntime](<https://docs.aws.amazon.com/bedrock-agentcore-control/latest/APIReference/API_UpdateAgentRuntime.html>) operation.

###### Topics

  * Configuration attributes

  * Default behavior

  * Create an AgentCore Runtime with lifecycle configuration

  * Update the lifecycle configuration for an AgentCore Runtime

  * Get the lifecycle configuration for an AgentCore Runtime

  * Validation and constraints

  * Lifecycle settings and runtime sessions

  * Best practices


## Configuration attributes

Attribute | Type | Range (seconds) | Required | Description  
---|---|---|---|---  
`idleRuntimeSessionTimeout` |  Integer |  60-28800 |  No |  Timeout in seconds for idle runtime sessions. When a session remains idle for this duration, it will trigger termination. Termination can last up to 15 seconds due to logging and other process completion. Default: 900 seconds (15 minutes)  
`maxLifetime` |  Integer |  60-28800 |  No |  Maximum lifetime for the instance in seconds. Once reached, instances will initialize termination. Termination can last up to 15 seconds due to logging and other process completion. Default: 28800 seconds (8 hours). The session itself can persist beyond this with a new instance provisioned.  
  
### Constraints

  * `idleRuntimeSessionTimeout` must be less than or equal to `maxLifetime`

  * Both values are measured in seconds

  * Valid range: 60 to 28800 seconds (up to 8 hours)


## Default behavior

When `LifecycleConfiguration` is not provided or contains null values, the platform applies the following logic:

Customer Input | idleRuntimeSessionTimeout | maxLifetime | Result  
---|---|---|---  
**No configuration** |  900 sec |  28800s |  Uses defaults: 900s and 28800s  
**Only maxLifetime provided** |  900 sec |  Customer value |  If maxLifetime ≤ 900s: uses maxLifetime for both If maxLifetime > 900s: uses 900s for idle, customer value for max  
**Only idleTimeout provided** |  Customer value |  28800s |  Uses customer value for idle, 28800s for max  
**Both values provided** |  Customer value |  Customer value |  Uses customer values as-is  
  
### Default values

  * `idleRuntimeSessionTimeout` : **900 seconds** (15 minutes)

  * `maxLifetime` : **28800 seconds** (8 hours)


## Create an AgentCore Runtime with lifecycle configuration

You can specify a lifecycle configuration when you create an AgentCore Runtime.

```python
import boto3

client = boto3.client('bedrock-agentcore-control', region_name='us-west-2')

try:
    response = client.create_agent_runtime(
        agentRuntimeName='my_agent_runtime',
        agentRuntimeArtifact={
            'containerConfiguration': {
                'containerUri': '123456789012.dkr.ecr.us-west-2.amazonaws.com/my-agent:latest'
            }
        },
        lifecycleConfiguration={
            'idleRuntimeSessionTimeout': 1800,  # 30 minutes, configurable
            'maxLifetime': 14400  # 4 hours
        },
        networkConfiguration={'networkMode': 'PUBLIC'},
        roleArn='arn:aws:iam::123456789012:role/AgentRuntimeRole'
    )

    print(f"Agent runtime created: {response['agentRuntimeArn']}")
except client.exceptions.ValidationException as e:
    print(f"Validation error: {e}")
except Exception as e:
    print(f"Error creating agent runtime: {e}")
```
## Update the lifecycle configuration for an AgentCore Runtime

You can update lifecycle configuration for an existing AgentCore Runtime.

```python
import boto3

client = boto3.client('bedrock-agentcore-control', region_name='us-west-2')

agent_runtime_id = 'my_agent_runtime'

try:
    response = client.update_agent_runtime(
        agentRuntimeId=agent_runtime_id,
        agentRuntimeArtifact={
            'containerConfiguration': {
                'containerUri': '123456789012.dkr.ecr.us-west-2.amazonaws.com/my-agent:latest'
            }
        },
        networkConfiguration={'networkMode': 'PUBLIC'},
        roleArn='arn:aws:iam::123456789012:role/AgentRuntimeRole',
        lifecycleConfiguration={
            'idleRuntimeSessionTimeout': 600,   # 10 minutes
            'maxLifetime': 7200                 # 2 hours
        }
    )

    print("Lifecycle configuration updated successfully")
except client.exceptions.ValidationException as e:
    print(f"Validation error: {e}")
except client.exceptions.ResourceNotFoundException:
    print("Agent runtime not found")
except Exception as e:
    print(f"Error updating configuration: {e}")
```
## Get the lifecycle configuration for an AgentCore Runtime

You can get lifecycle configuration for an existing AgentCore Runtime.

```python
import boto3

client = boto3.client('bedrock-agentcore-control', region_name='us-west-2')

def get_lifecycle_config():
    try:
        response = client.get_agent_runtime(agentRuntimeId="my_agent_runtime")

        lifecycle_config = response.get('lifecycleConfiguration', {})
        idle_timeout = lifecycle_config.get('idleRuntimeSessionTimeout', 900)
        max_lifetime = lifecycle_config.get('maxLifetime', 28800)

        print(f"Current configuration:")
        print(f"  Idle timeout: {idle_timeout}s ({idle_timeout//60} minutes)")
        print(f"  Max lifetime: {max_lifetime}s ({max_lifetime//3600} hours)")

        return lifecycle_config

    except Exception as e:
        print(f"Error retrieving configuration: {e}")
        return None

# Usage
config = get_lifecycle_config()
print(config)
```
## Validation and constraints

The lifecycle configuration includes validation rules and constraints to prevent invalid configurations.

### Common validation errors

```python
import boto3

client = boto3.client('bedrock-agentcore-control', region_name='us-west-2')

try:
    client.create_agent_runtime(
        agentRuntimeName='invalid_config_agent',
        agentRuntimeArtifact={
            'containerConfiguration': {
                'containerUri': '123456789012.dkr.ecr.us-west-2.amazonaws.com/my-agent:latest'
            }
        },
        lifecycleConfiguration={
            'idleRuntimeSessionTimeout': 3600,  # 1 hour, configurable
            'maxLifetime': 1800                 # 30 minutes - INVALID!
        },
        networkConfiguration={'networkMode': 'PUBLIC'},
        roleArn='arn:aws:iam::123456789012:role/AgentRuntimeRole',
        )
except client.exceptions.ValidationException as e:
    print(f"Validation failed: {e}")
    # Output: idleRuntimeSessionTimeout must be less than or equal to maxLifetime
```
### Validation helper function

```python
def validate_lifecycle_config(idle_timeout, max_lifetime):
    """Validate lifecycle configuration before API call"""
    errors = []

    # Check range constraints
    if not (1 <= idle_timeout <= 28800):
        errors.append(f"idleRuntimeSessionTimeout must be between 1 and 28800 seconds")

    if not (1 <= max_lifetime <= 28800):
        errors.append(f"maxLifetime must be between 1 and 28800 seconds")

    # Check relationship constraint
    if idle_timeout > max_lifetime:
        errors.append(f"idleRuntimeSessionTimeout ({idle_timeout}s) must be ≤ maxLifetime ({max_lifetime}s)")

    return errors

# Usage
errors = validate_lifecycle_config(3600, 1800)
if errors:
    for error in errors:
        print(f"Validation error: {error}")
else:
    print("Configuration is valid")
```
## Lifecycle settings and runtime sessions

The lifecycle configuration settings you define are applied to each individual runtime session. When you invoke an agent with a specific `runtimeSessionId` , AgentCore Runtime provisions a dedicated microVM for that session. The lifecycle timeouts ( `idleRuntimeSessionTimeout` and `maxLifetime` ) govern the lifecycle of that specific microVM instance.

```python
import boto3
import json
import uuid

client = boto3.client('bedrock-agentcore', region_name='us-west-2')

# Each unique runtimeSessionId gets its own microVM with lifecycle settings applied
session_id_user_1 = str(uuid.uuid4())  # User 1's session
session_id_user_2 = str(uuid.uuid4())  # User 2's session

# First invocation for User 1 - creates new microVM with lifecycle timers
response1 = client.invoke_agent_runtime(
    agentRuntimeArn='arn:aws:bedrock-agentcore:us-west-2:123456789012:runtime/my-agent',
    runtimeSessionId=session_id_user_1,  # Dedicated microVM for this session
    payload=json.dumps({"prompt": "Hello from User 1"}).encode()
)

# First invocation for User 2 - creates separate microVM with its own lifecycle timers
response2 = client.invoke_agent_runtime(
    agentRuntimeArn='arn:aws:bedrock-agentcore:us-west-2:123456789012:runtime/my-agent',
    runtimeSessionId=session_id_user_2,  # Different microVM for this session
    payload=json.dumps({"prompt": "Hello from User 2"}).encode()
)

# Subsequent invocations to same session reuse the existing microVM
# The idle timeout resets with each invocation to the same session
response3 = client.invoke_agent_runtime(
    agentRuntimeArn='arn:aws:bedrock-agentcore:us-west-2:123456789012:runtime/my-agent',
    runtimeSessionId=session_id_user_1,  # Reuses User 1's existing microVM
    payload=json.dumps({"prompt": "Follow-up from User 1"}).encode()
)
```
Key points about lifecycle settings and sessions:

  * **Per-session isolation** : Each `runtimeSessionId` gets its own microVM with independent lifecycle timers

  * **Idle timer reset** : The `idleRuntimeSessionTimeout` resets each time you invoke the same session

  * **Maximum lifetime enforcement** : The `maxLifetime` timer starts when the microVM is first created and cannot be reset

  * **Session termination** : When either timeout is reached, only that specific session’s microVM is terminated. The session can be resumed with a new microVM provisioned.


###### Tip

Each microVM session uses the code assets ( `agentRuntimeArtifact` ) that were deployed at the time of microVM creation. If you update your agent runtime with new code, existing sessions will continue using the previous version until they terminate and new sessions are created.

## Best practices

Follow these best practices when configuring lifecycle settings for optimal resource utilization and user experience.

### Recommendations

  * **Start with defaults** (900s idle, 28800s max) and adjust based on usage patterns

  * **Monitor session duration** to optimize timeout values

  * **Use shorter timeouts** for development environments to save costs

  * **Consider user experience** \- too short timeouts may interrupt active users

  * **Test configuration changes** in non-production environments first

  * **Document timeout rationale** for your specific use case


### Common patterns

Use Case | Idle Timeout | Max Lifetime | Rationale  
---|---|---|---  
**Interactive Chat** |  10-15 minutes |  2-4 hours |  Balance responsiveness with resource usage  
**Batch Processing** |  30 minutes |  8 hours |  Allow for long-running operations  
**Development** |  5 minutes |  30 minutes |  Quick cleanup for cost optimization  
**Production API** |  15 minutes |  4 hours |  Standard production workload  
**Demo/Testing** |  2 minutes |  15 minutes |  Aggressive cleanup for temporary usage

