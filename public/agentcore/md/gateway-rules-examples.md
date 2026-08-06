# Gateway rules API examples - Amazon Bedrock AgentCore

Source: https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/gateway-rules-examples.html

---

# Gateway rules API examples

The following examples show how to manage gateway rules using the AWS CLI and AWS Python SDK (Boto3).

## Create a rule with a static configuration bundle override

The following example creates a rule that pins a specific IAM principal to a configuration bundle version. Use this approach for QA or debugging.

###### Example

AWS CLI
    

  1. Run the following command:

```bash
aws bedrock-agentcore-control create-gateway-rule \
    --gateway-identifier my-gateway-abc1234567 \
    --priority 100 \
    --description "Pin QA role to bundle version" \
    --conditions '[
        {
            "matchPrincipals": {
                "anyOf": [
                    {
                        "iamPrincipal": {
                            "arn": "arn:aws:iam::123456789012:role/QARole",
                            "operator": "StringEquals"
                        }
                    }
                ]
            }
        }
    ]' \
    --actions '[
        {
            "configurationBundle": {
                "staticOverride": {
                    "bundleArn": "arn:aws:bedrock-agentcore:us-west-2:123456789012:configuration-bundle/myBundle-abc1234567",
                    "bundleVersion": "1234abcd-12ab-34cd-56ef-1234567890ab"
                }
            }
        }
    ]'
```
AWS Python SDK (Boto3)
    

  1. 
```python
import boto3

client = boto3.client("bedrock-agentcore-control", region_name="us-west-2")

response = client.create_gateway_rule(
    gatewayIdentifier="my-gateway-abc1234567",
    priority=100,
    description="Pin QA role to bundle version",
    conditions=[
        {
            "matchPrincipals": {
                "anyOf": [
                    {
                        "iamPrincipal": {
                            "arn": "arn:aws:iam::123456789012:role/QARole",
                            "operator": "StringEquals",
                        }
                    }
                ]
            }
        }
    ],
    actions=[
        {
            "configurationBundle": {
                "staticOverride": {
                    "bundleArn": "arn:aws:bedrock-agentcore:us-west-2:123456789012:configuration-bundle/myBundle-abc1234567",
                    "bundleVersion": "1234abcd-12ab-34cd-56ef-1234567890ab",
                }
            }
        }
    ],
)

print(f"Rule ID: {response['ruleId']}")
```
 


## Create a catch-all default rule

The following example creates a rule with no conditions. This rule matches all traffic and serves as a default. Assign a high priority number so that more specific rules take precedence.

###### Example

AWS CLI
    

  1. Run the following command:

```bash
aws bedrock-agentcore-control create-gateway-rule \
    --gateway-identifier my-gateway-abc1234567 \
    --priority 1000000 \
    --description "Default configuration bundle for all traffic" \
    --actions '[
        {
            "configurationBundle": {
                "staticOverride": {
                    "bundleArn": "arn:aws:bedrock-agentcore:us-west-2:123456789012:configuration-bundle/myBundle-abc1234567",
                    "bundleVersion": "1234abcd-12ab-34cd-56ef-1234567890ab"
                }
            }
        }
    ]'
```
AWS Python SDK (Boto3)
    

  1. 
```python
import boto3

client = boto3.client("bedrock-agentcore-control", region_name="us-west-2")

response = client.create_gateway_rule(
    gatewayIdentifier="my-gateway-abc1234567",
    priority=1000000,
    description="Default configuration bundle for all traffic",
    actions=[
        {
            "configurationBundle": {
                "staticOverride": {
                    "bundleArn": "arn:aws:bedrock-agentcore:us-west-2:123456789012:configuration-bundle/myBundle-abc1234567",
                    "bundleVersion": "1234abcd-12ab-34cd-56ef-1234567890ab",
                }
            }
        }
    ],
)

print(f"Rule ID: {response['ruleId']}")
```
 


## Create a rule with weighted configuration bundle split

The following example creates a rule that splits traffic between two configuration bundle versions for A/B testing. In this example, 80% of traffic uses variant A and 20% uses variant B.

###### Example

AWS CLI
    

  1. Run the following command:

```bash
aws bedrock-agentcore-control create-gateway-rule \
    --gateway-identifier my-gateway-abc1234567 \
    --priority 500 \
    --description "A/B test: 80/20 traffic split" \
    --actions '[
        {
            "configurationBundle": {
                "weightedOverride": {
                    "trafficSplit": [
                        {
                            "name": "variant-a",
                            "weight": 80,
                            "configurationBundle": {
                                "bundleArn": "arn:aws:bedrock-agentcore:us-west-2:123456789012:configuration-bundle/myBundle-abc1234567",
                                "bundleVersion": "1234abcd-12ab-34cd-56ef-1234567890ab"
                            },
                            "description": "Control variant"
                        },
                        {
                            "name": "variant-b",
                            "weight": 20,
                            "configurationBundle": {
                                "bundleArn": "arn:aws:bedrock-agentcore:us-west-2:123456789012:configuration-bundle/myBundle-abc1234567",
                                "bundleVersion": "12345678-1234-5678-9abc-123456789012"
                            },
                            "description": "Treatment variant"
                        }
                    ]
                }
            }
        }
    ]'
```
AWS Python SDK (Boto3)
    

  1. 
```python
import boto3

client = boto3.client("bedrock-agentcore-control", region_name="us-west-2")

response = client.create_gateway_rule(
    gatewayIdentifier="my-gateway-abc1234567",
    priority=500,
    description="A/B test: 80/20 traffic split",
    actions=[
        {
            "configurationBundle": {
                "weightedOverride": {
                    "trafficSplit": [
                        {
                            "name": "variant-a",
                            "weight": 80,
                            "configurationBundle": {
                                "bundleArn": "arn:aws:bedrock-agentcore:us-west-2:123456789012:configuration-bundle/myBundle-abc1234567",
                                "bundleVersion": "1234abcd-12ab-34cd-56ef-1234567890ab",
                            },
                            "description": "Control variant",
                        },
                        {
                            "name": "variant-b",
                            "weight": 20,
                            "configurationBundle": {
                                "bundleArn": "arn:aws:bedrock-agentcore:us-west-2:123456789012:configuration-bundle/myBundle-abc1234567",
                                "bundleVersion": "12345678-1234-5678-9abc-123456789012",
                            },
                            "description": "Treatment variant",
                        },
                    ]
                }
            }
        }
    ],
)

print(f"Rule ID: {response['ruleId']}")
```
 


###### Note

To maintain a consistent user experience during A/B testing, include the `X-Amzn-Bedrock-AgentCore-Runtime-Session-Id` header in your gateway invoke requests. For more information, see [Session stickiness for weighted rules](<https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/./gateway-rules-session-stickiness.html>).

## Create a rule with target routing

The following example creates a rule that routes requests matching a specific path pattern to a target.

###### Example

AWS CLI
    

  1. Run the following command:

```bash
aws bedrock-agentcore-control create-gateway-rule \
    --gateway-identifier my-gateway-abc1234567 \
    --priority 150 \
    --description "Route /my-target-canary requests to canary target" \
    --conditions '[
        {
            "matchPaths": {
                "anyOf": [
                    "/my-target-canary/*"
                ]
            }
        }
    ]' \
    --actions '[
        {
            "routeToTarget": {
                "staticRoute": {
                    "targetName": "my-target-canary"
                }
            }
        }
    ]'
```
AWS Python SDK (Boto3)
    

  1. 
```python
import boto3

client = boto3.client("bedrock-agentcore-control", region_name="us-west-2")

response = client.create_gateway_rule(
    gatewayIdentifier="my-gateway-abc1234567",
    priority=150,
    description="Route /my-target-canary requests to canary target",
    conditions=[
        {
            "matchPaths": {
                "anyOf": ["/my-target-canary/*"]
            }
        }
    ],
    actions=[
        {
            "routeToTarget": {
                "staticRoute": {
                    "targetName": "my-target-canary",
                }
            }
        }
    ],
)

print(f"Rule ID: {response['ruleId']}")
```
 


## Create a rule with weighted target routing

The following example creates a rule that splits traffic between two targets. In this example, 90% of traffic routes to the primary target and 10% routes to the canary target.

###### Example

AWS CLI
    

  1. Run the following command:

```bash
aws bedrock-agentcore-control create-gateway-rule \
    --gateway-identifier my-gateway-abc1234567 \
    --priority 300 \
    --description "Canary deployment: 90/10 target split" \
    --actions '[
        {
            "routeToTarget": {
                "weightedRoute": {
                    "trafficSplit": [
                        {
                            "name": "primary",
                            "weight": 90,
                            "targetName": "my-target-primary",
                            "description": "Primary target"
                        },
                        {
                            "name": "canary",
                            "weight": 10,
                            "targetName": "my-target-canary",
                            "description": "Canary target"
                        }
                    ]
                }
            }
        }
    ]'
```
AWS Python SDK (Boto3)
    

  1. 
```python
import boto3

client = boto3.client("bedrock-agentcore-control", region_name="us-west-2")

response = client.create_gateway_rule(
    gatewayIdentifier="my-gateway-abc1234567",
    priority=300,
    description="Canary deployment: 90/10 target split",
    actions=[
        {
            "routeToTarget": {
                "weightedRoute": {
                    "trafficSplit": [
                        {
                            "name": "primary",
                            "weight": 90,
                            "targetName": "my-target-primary",
                            "description": "Primary target",
                        },
                        {
                            "name": "canary",
                            "weight": 10,
                            "targetName": "my-target-canary",
                            "description": "Canary target",
                        },
                    ]
                }
            }
        }
    ],
)

print(f"Rule ID: {response['ruleId']}")
```
 


## Create a rule with combined conditions and actions

The following example creates a rule with both condition types and both action types. The request must match at least one entry from each condition type (AND logic across types).

###### Example

AWS CLI
    

  1. Run the following command:

```bash
aws bedrock-agentcore-control create-gateway-rule \
    --gateway-identifier my-gateway-abc1234567 \
    --priority 50 \
    --description "QA role on /my-target-canary paths: pin bundle and route to canary" \
    --conditions '[
        {
            "matchPrincipals": {
                "anyOf": [
                    {
                        "iamPrincipal": {
                            "arn": "arn:aws:iam::123456789012:role/QARole",
                            "operator": "StringEquals"
                        }
                    }
                ]
            }
        },
        {
            "matchPaths": {
                "anyOf": [
                    "/my-target-canary/*"
                ]
            }
        }
    ]' \
    --actions '[
        {
            "configurationBundle": {
                "staticOverride": {
                    "bundleArn": "arn:aws:bedrock-agentcore:us-west-2:123456789012:configuration-bundle/myBundle-abc1234567",
                    "bundleVersion": "1234abcd-12ab-34cd-56ef-1234567890ab"
                }
            }
        },
        {
            "routeToTarget": {
                "staticRoute": {
                    "targetName": "my-target-canary"
                }
            }
        }
    ]'
```
AWS Python SDK (Boto3)
    

  1. 
```python
import boto3

client = boto3.client("bedrock-agentcore-control", region_name="us-west-2")

response = client.create_gateway_rule(
    gatewayIdentifier="my-gateway-abc1234567",
    priority=50,
    description="QA role on /my-target-canary paths: pin bundle and route to canary",
    conditions=[
        {
            "matchPrincipals": {
                "anyOf": [
                    {
                        "iamPrincipal": {
                            "arn": "arn:aws:iam::123456789012:role/QARole",
                            "operator": "StringEquals",
                        }
                    }
                ]
            }
        },
        {
            "matchPaths": {
                "anyOf": ["/my-target-canary/*"]
            },
        },
    ],
    actions=[
        {
            "configurationBundle": {
                "staticOverride": {
                    "bundleArn": "arn:aws:bedrock-agentcore:us-west-2:123456789012:configuration-bundle/myBundle-abc1234567",
                    "bundleVersion": "1234abcd-12ab-34cd-56ef-1234567890ab",
                }
            }
        },
        {
            "routeToTarget": {
                "staticRoute": {
                    "targetName": "my-target-canary",
                }
            }
        },
    ],
)

print(f"Rule ID: {response['ruleId']}")
```
 


###### Note

This rule matches only when the caller is the QA role AND the request path matches `/my-target-canary/*`. Both conditions must be satisfied.

## Get a gateway rule

The following example retrieves the details of a specific gateway rule.

###### Example

AWS CLI
    

  1. Run the following command:

```bash
aws bedrock-agentcore-control get-gateway-rule \
    --gateway-identifier my-gateway-abc1234567 \
    --rule-id 12345678-1234-1234-1234-123456789012
```
AWS Python SDK (Boto3)
    

  1. 
```python
import boto3

client = boto3.client("bedrock-agentcore-control", region_name="us-west-2")

response = client.get_gateway_rule(
    gatewayIdentifier="my-gateway-abc1234567",
    ruleId="12345678-1234-1234-1234-123456789012",
)

print(f"Priority: {response['priority']}")
print(f"Status: {response['status']}")
print(f"Actions: {response['actions']}")
```
 


## Update a gateway rule

The following example updates the priority and description of an existing gateway rule.

###### Example

AWS CLI
    

  1. Run the following command:

```bash
aws bedrock-agentcore-control update-gateway-rule \
    --gateway-identifier my-gateway-abc1234567 \
    --rule-id 12345678-1234-1234-1234-123456789012 \
    --priority 200 \
    --description "Updated priority for QA rule"
```
AWS Python SDK (Boto3)
    

  1. 
```python
import boto3

client = boto3.client("bedrock-agentcore-control", region_name="us-west-2")

response = client.update_gateway_rule(
    gatewayIdentifier="my-gateway-abc1234567",
    ruleId="12345678-1234-1234-1234-123456789012",
    priority=200,
    description="Updated priority for QA rule",
)

print(f"Status: {response['status']}")
```
 


## List gateway rules

The following example lists all rules for a gateway. Results are sorted by priority in ascending order.

###### Example

AWS CLI
    

  1. Run the following command:

```bash
aws bedrock-agentcore-control list-gateway-rules \
    --gateway-identifier my-gateway-abc1234567
```
AWS Python SDK (Boto3)
    

  1. 
```python
import boto3

client = boto3.client("bedrock-agentcore-control", region_name="us-west-2")

response = client.list_gateway_rules(
    gatewayIdentifier="my-gateway-abc1234567"
)

for rule in response["gatewayRules"]:
    print(f"Rule: {rule['ruleId']}, Priority: {rule['priority']}, Status: {rule['status']}")
```
 


## Delete a gateway rule

The following example deletes a gateway rule.

###### Example

AWS CLI
    

  1. Run the following command:

```bash
aws bedrock-agentcore-control delete-gateway-rule \
    --gateway-identifier my-gateway-abc1234567 \
    --rule-id 12345678-1234-1234-1234-123456789012
```
AWS Python SDK (Boto3)
    

  1. 
```python
import boto3

client = boto3.client("bedrock-agentcore-control", region_name="us-west-2")

response = client.delete_gateway_rule(
    gatewayIdentifier="my-gateway-abc1234567",
    ruleId="12345678-1234-1234-1234-123456789012",
)

print(f"Status: {response['status']}")
```
 



