### 📈 Characteristics of Gaussian (Normal) Distribution:

- Symmetrical around the **mean**
- Most data points are clustered around the mean
- Fewer data points exist in the tails (extreme values)
- Defined by two parameters: **mean (μ)** and **standard deviation (σ)**

---

### 📌 Why It Matters:

Some algorithms assume or perform better when input features follow a **normal distribution** because:

- It improves convergence in **linear models** and **gradient descent**
- It aligns with assumptions behind statistical tests and **regularization**
- It gives better performance for models like:

  - **Linear Regression**
  - **Logistic Regression**
  - **LDA (Linear Discriminant Analysis)**
  - **Gaussian Naive Bayes**
  - **PCA (Principal Component Analysis)**

---

### 🔧 Pro Tip:

If your data is far from Gaussian (e.g., skewed or multimodal), you might consider:

- **Log transforms**
- **Box-Cox / Yeo-Johnson transforms**
- **QuantileTransformer** from `sklearn`

---

## Sources

```ex-sources
[{"title": "https://docs.aws.amazon.com/aws-certification/latest/machine-learning-engineer-associate-01/machine-learning-engineer-associate-01-domain1.html", "href": "https://docs.aws.amazon.com/aws-certification/latest/machine-learning-engineer-associate-01/machine-learning-engineer-associate-01-domain1.html"}, {"title": "https://docs.aws.amazon.com/aws-certification/latest/machine-learning-engineer-associate-01/machine-learning-engineer-associate-01-domain2.html", "href": "https://docs.aws.amazon.com/aws-certification/latest/machine-learning-engineer-associate-01/machine-learning-engineer-associate-01-domain2.html"}, {"title": "https://docs.aws.amazon.com/aws-certification/latest/machine-learning-engineer-associate-01/machine-learning-engineer-associate-01-domain4.html", "href": "https://docs.aws.amazon.com/aws-certification/latest/machine-learning-engineer-associate-01/machine-learning-engineer-associate-01-domain4.html"}]
```
