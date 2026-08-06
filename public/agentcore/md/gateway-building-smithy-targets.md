# Smithy model targets - Amazon Bedrock AgentCore

Source: https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/gateway-building-smithy-targets.html

---

# Smithy model targets

Smithy is a language for defining services and software development kits (SDKs). Smithy models provide a more structured approach to defining APIs compared to OpenAPI, and are particularly useful for connecting to AWS services, such as AgentCore Gateway.

Smithy model targets connect your AgentCore gateway to services that are defined using Smithy API models. When you invoke a Smithy model gateway target, the gateway translates incoming MCP requests into API calls that are sent to these services. The gateway also handles the response formatting.

Review the key considerations and limitations, including feature support, to help you decide whether a Smithy target is applicable to your use case. If it is, you can create a schema that follows the specifications and then set up permissions for the gateway to be able to access the target. Select a topic to learn more:

###### Topics

  * Key considerations and limitations

  * Smithy model specification


## Key considerations and limitations

When using Smithy models with AgentCore Gateway, be aware of the following limitations:

  * Maximum model size: 10MB

  * Only JSON protocol bindings are fully supported

  * Only RestJson protocol is supported


In considering using Smithy models with AgentCore Gateway, review the following feature support table.

### Security best practices for endpoint configuration

###### Warning

When defining endpoint rules and server URLs in your Smithy models, avoid using overly permissive URL parameter patterns that could expose your gateway to security risks.

Smithy models support dynamic endpoint configuration through endpoint rules and URL parameters. However, certain patterns can introduce security vulnerabilities if not properly constrained. Specifically, avoid using fully dynamic patterns such as:

  * Unrestricted host or domain parameters in endpoint URLs: `https://{host}/api/v1` or `https://{domain}.example.com`

  * Multiple unconstrained placeholders in server URLs: `https://{subdomain}.{env}.{domain}.com`

  * Endpoint rules that allow arbitrary URL construction without validation


These patterns can potentially be exploited to:

  * Redirect requests to unintended or malicious endpoints

  * Access internal network resources or instance metadata services (Server-Side Request Forgery)

  * Exfiltrate IAM credentials or sensitive data


**Recommended practices:**

  * Use static, fully qualified endpoint URLs whenever possible

  * For AWS services, rely on standard endpoint resolution with validated region parameters. Gateway enforces AWS region validation for AWS services

  * If custom endpoint rules are required, constrain parameters to specific, validated values

  * Avoid exposing raw host or domain parameters in your Smithy model’s endpoint configuration


For AWS service integrations, AgentCore Gateway automatically validates region parameters and blocks requests to private IP ranges.

### Smithy feature support for AgentCore Gateway

The following table outlines the Smithy features that are supported and unsupported by Gateway:

Supported Features | Unsupported Features  
---|---  
**Service Definitions** Service structure definitions based on Smithy specifications Operation definitions with input/output shapes Resource definitions Trait shapes **Protocol Support** RestJson protocol Standard HTTP request/response patterns **Data Types** Primitive types (string, integer, boolean, float, double) Complex types (structures, lists, maps) Timestamp handling Blob data types **HTTP Bindings** Basic HTTP method bindings Simple path parameter bindings Query parameter bindings Header bindings for simple cases **Endpoint Rules** Endpoint rule sets Runtime endpoint determination based on conditions |  **Protocol Support** RestXml protocol JsonRpc protocol AwsQuery protocol Ec2Query protocol Custom protocols **Authentication** Multiple egress authentication types for specific APIs Complex authentication schemes requiring runtime decisions **Operations** Streaming operations Operations requiring custom protocol implementations  
  
## Smithy model specification

AgentCore Gateway provides built-in Smithy models for common AWS services. To see Smithy models for AWS services, see the [AWS API Models repository](<https://github.com/aws/api-models-aws>).

###### Note

AgentCore Gateway doesn’t support custom Smithy models for non-AWS services.

After you define your Smithy model, you can do one of the following:

  * Upload it to an Amazon S3 bucket and refer to the S3 location when you add the target to your gateway.

  * Paste the definition inline when you add the target to your gateway.


Expand a section to see examples of supported and unsupported Smithy model specifications:

The following example shows a valid Smithy model specification for a weather service:

```json
{
  "smithy": "2.0",
  "metadata": {
    "suppressions": []
  },
  "shapes": {
    "example.weather#WeatherService": {
      "type": "service",
      "version": "1.0.0",
      "operations": [
        {
          "target": "example.weather#GetCurrentWeather"
        }
      ],
      "traits": {
        "aws.protocols#restJson1": {},
        "smithy.api#documentation": "Weather service for retrieving weather information"
      }
    },
    "example.weather#GetCurrentWeather": {
      "type": "operation",
      "input": {
        "target": "example.weather#GetCurrentWeatherInput"
      },
      "output": {
        "target": "example.weather#GetCurrentWeatherOutput"
      },
      "errors": [
        {
          "target": "smithy.framework#ValidationException"
        }
      ],
      "traits": {
        "smithy.api#http": {
          "method": "GET",
          "uri": "/weather"
        },
        "smithy.api#documentation": "Get current weather for a location"
      }
    },
    "example.weather#GetCurrentWeatherInput": {
      "type": "structure",
      "members": {
        "location": {
          "target": "smithy.api#String",
          "traits": {
            "smithy.api#required": {},
            "smithy.api#httpQuery": "location",
            "smithy.api#documentation": "City name or coordinates"
          }
        },
        "units": {
          "target": "example.weather#Units",
          "traits": {
            "smithy.api#httpQuery": "units",
            "smithy.api#default": "metric",
            "smithy.api#documentation": "Units of measurement (metric or imperial)"
          }
        }
      }
    },
    "example.weather#GetCurrentWeatherOutput": {
      "type": "structure",
      "members": {
        "location": {
          "target": "smithy.api#String",
          "traits": {
            "smithy.api#documentation": "Location name"
          }
        },
        "temperature": {
          "target": "smithy.api#Float",
          "traits": {
            "smithy.api#documentation": "Current temperature"
          }
        },
        "conditions": {
          "target": "smithy.api#String",
          "traits": {
            "smithy.api#documentation": "Weather conditions description"
          }
        },
        "humidity": {
          "target": "smithy.api#Float",
          "traits": {
            "smithy.api#documentation": "Humidity percentage"
          }
        }
      }
    },
    "example.weather#Units": {
      "type": "enum",
      "members": {
        "metric": {
          "target": "smithy.api#Unit",
          "traits": {
            "smithy.api#enumValue": "metric"
          }
        },
        "imperial": {
          "target": "smithy.api#Unit",
          "traits": {
            "smithy.api#enumValue": "imperial"
          }
        }
      }
    }
  }
}
```
The following example shows an invalid endpoint rules configuration using Smithy:

```text
@endpointRuleSet({
  "rules": [
    {
      "conditions": [{"fn": "booleanEquals", "argv": [{"ref": "UseFIPS"}, true]}],
      "endpoint": {"url": "https://weather-fips.{Region}.example.com"}
    },
    {
      "endpoint": {"url": "https://weather.{Region}.example.com"}
    }
  ]
})
```
