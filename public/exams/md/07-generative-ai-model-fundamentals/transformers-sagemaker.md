```python
!pip install torch git+https://github.com/huggingface/transformers
```

```python
!pip install jupyterlab ipywidgets bertviz evaluate matplotlib
```

# Tokenizers

```python
from transformers import BertModel, BertTokenizer

modelName = "bert-base-uncased"

tokenizer = BertTokenizer.from_pretrained(modelName)
model = BertModel.from_pretrained(modelName)
```

```python
tokenized = tokenizer("I read a good novel.")
print(tokenized)
```

```python
tokens = tokenizer.convert_ids_to_tokens(tokenized["input_ids"])
print(tokens)
```

# Positional Encoding

```python
import numpy as np
import matplotlib.pyplot as plt

def encodePositions(num_tokens, depth, n=10000):
    positionalMatrix = np.zeros((num_tokens, depth))
    for row in range(num_tokens):
        for col in np.arange(int(depth/2)):
            denominator = np.power(n, 2*col/depth)
            positionalMatrix[row, 2*col] = np.sin(row/denominator)
            positionalMatrix[row, 2*col+1] = np.cos(row/denominator)
    return positionalMatrix
```

```python
positionalMatrix = encodePositions(50, 256)
fig = plt.matshow(positionalMatrix)
plt.gcf().colorbar(fig)
```

# Self-Attention

```python
from bertviz.transformers_neuron_view import BertModel, BertTokenizer
from bertviz.neuron_view import show

tokenizer_viz = BertTokenizer.from_pretrained(modelName)
model_viz = BertModel.from_pretrained(modelName)
show(model_viz, "bert", tokenizer_viz, "I read a good novel.", display_mode="light", head=11)
```

```python
show(model_viz, "bert", tokenizer_viz, "Attention is a novel idea.", display_mode="light", head=11)
```

Also play with https://huggingface.co/spaces/exbert-project/exbert

# GPT2 model (137M parameters)

```python
from transformers import pipeline
generator = pipeline('text-generation', model='gpt2')
generator("I read a good novel.", max_length=30, num_return_sequences=5)
```

```python
generator("This movie seemed really long.", max_length=300, num_return_sequences=5)
```

```python
generator("Star Trek" , max_length=100, num_return_sequences=5)
```
