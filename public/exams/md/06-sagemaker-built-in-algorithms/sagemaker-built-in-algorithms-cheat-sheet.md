## Algorithm Decision Table

| Data/problem type | Strong candidates | Notes |
| --- | --- | --- |
| Tabular classification/regression | [Xgboost](ex:06-sagemaker-built-in-algorithms/xgboost), [Light Gbm](ex:06-sagemaker-built-in-algorithms/light-gbm), [CatBoost](ex:06-sagemaker-built-in-algorithms/catboost), [AutoGluon-Tabular](ex:06-sagemaker-built-in-algorithms/autogluon-tabular), [TabTransformer](ex:06-sagemaker-built-in-algorithms/tabtransformer), [Linear Learner](ex:06-sagemaker-built-in-algorithms/linear-learner) | Tree/boosting models are common defaults; AutoGluon is AutoML/ensembling; TabTransformer targets tabular categorical interactions |
| High-dimensional sparse features | [Factorization Machines](ex:06-sagemaker-built-in-algorithms/factorization-machines), [Linear Learner](ex:06-sagemaker-built-in-algorithms/linear-learner) | Common for recommendation-like or sparse encoded features |
| Clustering | [K Means](ex:06-sagemaker-built-in-algorithms/k-means) | Unsupervised grouping |
| Anomaly detection | [Random Cut Forest](ex:06-sagemaker-built-in-algorithms/random-cut-forest) | Streaming/time-series anomaly detection patterns |
| Dimensionality reduction | [Principal Component Analysis](ex:06-sagemaker-built-in-algorithms/principal-component-analysis) | Reduce feature dimensions before downstream modeling |
| Topic modeling | [Latent Dirichlet Allocation](ex:06-sagemaker-built-in-algorithms/latent-dirichlet-allocation), [Neural Topic Model](ex:06-sagemaker-built-in-algorithms/neural-topic-model) | Organize documents into latent topics |
| Text classification | [Blazing Text](ex:06-sagemaker-built-in-algorithms/blazing-text), [Text Classification - TensorFlow](ex:06-sagemaker-built-in-algorithms/text-classification-tensorflow) | BlazingText is classic supervised/Word2Vec; TensorFlow version supports transfer learning |
| Time-series forecasting | [Deep Ar](ex:06-sagemaker-built-in-algorithms/deep-ar) | Current exam-relevant replacement for old Forecast service emphasis |
| Image classification | [Image Classification](ex:06-sagemaker-built-in-algorithms/image-classification), [Image Classification - TensorFlow](ex:06-sagemaker-built-in-algorithms/image-classification-tensorflow) | TensorFlow version supports transfer learning with pretrained models |
| Object detection | [Object Detection](ex:06-sagemaker-built-in-algorithms/object-detection), [Object Detection - TensorFlow](ex:06-sagemaker-built-in-algorithms/object-detection-tensorflow) | MXNet and TensorFlow variants appear in SageMaker docs |
| Semantic segmentation | [Semantic Segmentation](ex:06-sagemaker-built-in-algorithms/semantic-segmentation) | Pixel-level image classification |
| Recommendation/embedding-like use cases | [Object2vec](ex:06-sagemaker-built-in-algorithms/object2vec), [Factorization Machines](ex:06-sagemaker-built-in-algorithms/factorization-machines) | Map inputs to dense embeddings or interaction scores |
| IP/entity behavior | [Ip Insights](ex:06-sagemaker-built-in-algorithms/ip-insights) | Learn usage patterns for IPv4 addresses |

## Current Gaps Closed

- [AutoGluon-Tabular](ex:06-sagemaker-built-in-algorithms/autogluon-tabular)
- [CatBoost](ex:06-sagemaker-built-in-algorithms/catboost)
- [TabTransformer](ex:06-sagemaker-built-in-algorithms/tabtransformer)
- [Text Classification - TensorFlow](ex:06-sagemaker-built-in-algorithms/text-classification-tensorflow)
- [Image Classification - TensorFlow](ex:06-sagemaker-built-in-algorithms/image-classification-tensorflow)
- [Object Detection - TensorFlow](ex:06-sagemaker-built-in-algorithms/object-detection-tensorflow)

## Decision Triggers

- If the question says tabular classification/regression, compare XGBoost, LightGBM, CatBoost, AutoGluon, TabTransformer, and Linear Learner.
- If the question says text transfer learning, consider Text Classification - TensorFlow.
- If the question says image transfer learning, consider Image Classification - TensorFlow or Object Detection - TensorFlow.
- If the question says no labels and grouping, choose K-Means.
- If the question says time-series forecast in current SageMaker context, choose DeepAR rather than Amazon Forecast.

## Sources

```ex-sources
[{"title": "https://docs.aws.amazon.com/sagemaker/latest/dg/algos.html", "href": "https://docs.aws.amazon.com/sagemaker/latest/dg/algos.html"}, {"title": "https://docs.aws.amazon.com/sagemaker/latest/dg/algorithms-tabular.html", "href": "https://docs.aws.amazon.com/sagemaker/latest/dg/algorithms-tabular.html"}, {"title": "https://docs.aws.amazon.com/sagemaker/latest/dg/text-classification-tensorflow.html", "href": "https://docs.aws.amazon.com/sagemaker/latest/dg/text-classification-tensorflow.html"}, {"title": "https://docs.aws.amazon.com/sagemaker/latest/dg/image-classification-tensorflow.html", "href": "https://docs.aws.amazon.com/sagemaker/latest/dg/image-classification-tensorflow.html"}, {"title": "https://docs.aws.amazon.com/sagemaker/latest/dg/object-detection-tensorflow.html", "href": "https://docs.aws.amazon.com/sagemaker/latest/dg/object-detection-tensorflow.html"}]
```
