## When To Use

- Use to expose HTTP/REST/WebSocket APIs for inference applications.
- Use with Lambda as an integration layer before SageMaker endpoints.
- Use authorizers, throttling, stages, and logging for API governance.

## Core Concepts

- API Gateway creates, publishes, maintains, monitors, and secures APIs.
- Common ML path is API Gateway -> Lambda -> SageMaker endpoint.
- Use CloudWatch/X-Ray for API observability.

## AWS Services And Features

- Amazon API Gateway
- AWS Lambda
- Amazon SageMaker AI
- Amazon CloudWatch
- AWS X-Ray

## Implementation Patterns

- Client -> API Gateway -> Lambda -> SageMaker endpoint -> response.
- Private integration or VPC link patterns for internal services.

## Tradeoffs And Pitfalls

- API Gateway is not the model hosting layer.
- Throttling and payload limits matter for inference API design.
- Authentication/authorization must be explicit.

## Decision Triggers

- Secure public API front door points to API Gateway.
- Model hosting endpoint points to SageMaker endpoint.

## Related Notes

```ex-cards
[{"title": "AWS Lambda For ML Workflows", "href": "ex:09-machine-learning-operations/lambda-for-ml-workflows", "body": ""}, {"title": "SageMaker Model Endpoints", "href": "ex:05-sagemaker-ai/sagemaker-model-endpoints", "body": ""}, {"title": "AWS X-Ray", "href": "ex:09-machine-learning-operations/x-ray", "body": ""}]
```

## Sources

```ex-sources
[{"title": "https://docs.aws.amazon.com/apigateway/latest/developerguide/welcome.html", "href": "https://docs.aws.amazon.com/apigateway/latest/developerguide/welcome.html"}, {"title": "https://docs.aws.amazon.com/aws-certification/latest/machine-learning-engineer-associate-01/machine-learning-engineer-associate-01-domain3.html", "href": "https://docs.aws.amazon.com/aws-certification/latest/machine-learning-engineer-associate-01/machine-learning-engineer-associate-01-domain3.html"}]
```
