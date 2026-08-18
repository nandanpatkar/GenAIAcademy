## When To Use

- Use only to understand historical computer-vision quality inspection references.
- For current visual inspection, prefer SageMaker AI image models, Rekognition Custom Labels if appropriate, or custom CV pipelines.

## Core Concepts

- Was a managed computer vision service for visual defect/anomaly detection.
- No longer accessible after the shutdown date.

## AWS Services And Features

- Amazon Lookout for Vision
- Amazon SageMaker AI
- Amazon Rekognition

## Implementation Patterns

- Historical: images -> project/dataset -> model -> defect detection.
- Current: labeled image dataset -> SageMaker image classification/object detection or Rekognition Custom Labels pattern.

## Tradeoffs And Pitfalls

- Full shutdown means it is not a current service choice.
- Do not confuse with Amazon Rekognition, which remains in scope.

## Decision Triggers

- Visual defect detection with shutdown caveat points to Lookout for Vision only historically.
- Face/object/text/image analysis APIs point to Rekognition.

## Related Notes

```ex-cards
[{"title": "Amazon Rekognition", "href": "ex:01-ai-services/rekognition", "body": ""}, {"title": "Image Classification - TensorFlow", "href": "ex:06-sagemaker-built-in-algorithms/image-classification-tensorflow", "body": ""}, {"title": "Object Detection - TensorFlow", "href": "ex:06-sagemaker-built-in-algorithms/object-detection-tensorflow", "body": ""}]
```

## Sources

```ex-sources
[{"title": "https://docs.aws.amazon.com/general/latest/gr/full_shutdown_services.html", "href": "https://docs.aws.amazon.com/general/latest/gr/full_shutdown_services.html"}, {"title": "https://docs.aws.amazon.com/lookout-for-vision/latest/APIReference/API_DeleteDataset.html", "href": "https://docs.aws.amazon.com/lookout-for-vision/latest/APIReference/API_DeleteDataset.html"}, {"title": "https://docs.aws.amazon.com/aws-certification/latest/machine-learning-engineer-associate-01/mla-01-in-scope-services.html", "href": "https://docs.aws.amazon.com/aws-certification/latest/machine-learning-engineer-associate-01/mla-01-in-scope-services.html"}]
```
