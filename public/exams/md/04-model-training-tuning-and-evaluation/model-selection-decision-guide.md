## When To Use

- Use AWS AI services when a managed API solves the task.
- Use SageMaker built-in algorithms for common tabular/text/image/time-series tasks with managed training.
- Use custom SageMaker training for specialized architectures or full control.
- Use Bedrock for foundation-model inference and generative AI applications.

## Core Concepts

- Selection depends on data type, labels, explainability, latency, customization, and operational ownership.
- Built-in algorithms reduce implementation burden but have input-format constraints.
- Foundation models solve prompt/RAG/generation tasks rather than classic supervised ML alone.

## AWS Services And Features

- Amazon SageMaker AI
- Amazon Bedrock
- AWS AI Services
- SageMaker JumpStart

## Implementation Patterns

- Problem statement -> data type/task -> managed AI API vs built-in algorithm vs custom model vs foundation model.

## Tradeoffs And Pitfalls

- Do not overbuild with custom training when a managed AI service fits.
- Do not use Bedrock for classic structured-data regression/classification unless the task is actually generative or language-centric.
- Lifecycle caveats matter for older high-level AI services.

## Decision Triggers

- Need prebuilt text/image/speech API points to AI services.
- Tabular supervised ML points to SageMaker built-in algorithms such as XGBoost/LightGBM/CatBoost/AutoGluon.
- RAG/chat/summarization points to Bedrock.

## Related Notes

```ex-cards
[{"title": "SageMaker Built-In Algorithms Cheat Sheet", "href": "ex:06-sagemaker-built-in-algorithms/sagemaker-built-in-algorithms-cheat-sheet", "body": ""}, {"title": "Amazon Bedrock (deep dive notes)", "href": "ex:13-bedrock/amazon-bedrock", "body": ""}, {"title": "SageMaker AI Current Capabilities", "href": "ex:05-sagemaker-ai/sagemaker-ai-current-capabilities", "body": ""}]
```

## Sources

```ex-sources
[{"title": "https://docs.aws.amazon.com/aws-certification/latest/machine-learning-engineer-associate-01/machine-learning-engineer-associate-01-domain2.html", "href": "https://docs.aws.amazon.com/aws-certification/latest/machine-learning-engineer-associate-01/machine-learning-engineer-associate-01-domain2.html"}, {"title": "https://docs.aws.amazon.com/sagemaker/latest/dg/algos.html", "href": "https://docs.aws.amazon.com/sagemaker/latest/dg/algos.html"}, {"title": "https://docs.aws.amazon.com/bedrock/latest/userguide/what-is-bedrock.html", "href": "https://docs.aws.amazon.com/bedrock/latest/userguide/what-is-bedrock.html"}]
```
