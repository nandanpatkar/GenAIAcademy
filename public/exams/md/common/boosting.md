## Adaptive Boosting (AdaBoost)

- AdaBoost was one of the earliest boosting algorithms.
- It assigns equal weights to all data points initially, then increases the weights of incorrectly classified items after each iteration.
- The model focuses more on hard-to-classify examples in subsequent rounds.
- The process repeats until the residual error falls below a threshold or a set number of iterations is reached.
- Works well for classification problems but is less effective with highly correlated features or high-dimensional data.

## Gradient Boosting

- Gradient Boosting (GB) is a sequential technique like AdaBoost, but instead of reweighting misclassified items, it optimizes a loss function.
- Each new base learner is trained to correct the errors (residuals) of the previous ensemble.
- This approach can be used for both classification and regression tasks.
- GB often achieves higher accuracy than AdaBoost, especially on complex datasets.

## Extreme Gradient Boosting (XGBoost)

- XGBoost is an advanced implementation of gradient boosting designed for speed and performance.
- It supports parallel and distributed computing, cache optimization, and out-of-core processing.
- XGBoost is highly scalable and suitable for large datasets and big data applications.
- It is widely used in machine learning competitions and industry due to its efficiency and predictive power.

---

**References:**  
- [AWS: What is Boosting?](https://aws.amazon.com/what-is/boosting/)

## Sources

```ex-sources
[{"title": "https://docs.aws.amazon.com/aws-certification/latest/machine-learning-engineer-associate-01/machine-learning-engineer-associate-01-domain1.html", "href": "https://docs.aws.amazon.com/aws-certification/latest/machine-learning-engineer-associate-01/machine-learning-engineer-associate-01-domain1.html"}, {"title": "https://docs.aws.amazon.com/aws-certification/latest/machine-learning-engineer-associate-01/machine-learning-engineer-associate-01-domain2.html", "href": "https://docs.aws.amazon.com/aws-certification/latest/machine-learning-engineer-associate-01/machine-learning-engineer-associate-01-domain2.html"}, {"title": "https://docs.aws.amazon.com/aws-certification/latest/machine-learning-engineer-associate-01/machine-learning-engineer-associate-01-domain4.html", "href": "https://docs.aws.amazon.com/aws-certification/latest/machine-learning-engineer-associate-01/machine-learning-engineer-associate-01-domain4.html"}]
```
