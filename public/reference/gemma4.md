---
title: Gemma 4
date: 2026-04-03 10:00:00
background: bg-[#4285f4]
tags:
  - gemma
  - google
  - llm
  - multimodal
  - ai
categories:
  - AI
intro: |
  [Gemma 4](https://deepmind.google/models/gemma/gemma-4/) is Google DeepMind's Apache 2.0 open-weights multimodal LLM family with frontier intelligence across four sizes, from mobile-edge to server-grade deployment.
plugins:
  - copyCode
---

## Getting Started

### Quick Start {.row-span-2}

```python
from transformers import AutoProcessor, AutoModelForCausalLM
import torch

MODEL_ID = "google/gemma-4-E4B-it"

processor = AutoProcessor.from_pretrained(MODEL_ID)
model = AutoModelForCausalLM.from_pretrained(
    MODEL_ID,
    dtype=torch.bfloat16,
    device_map="auto"
)

messages = [
    {"role": "system", "content": "You are helpful."},
    {"role": "user",   "content": "Explain MoE briefly."},
]

text = processor.apply_chat_template(
    messages,
    tokenize=False,
    add_generation_prompt=True,
    enable_thinking=False
)
inputs = processor(
    text=text, return_tensors="pt"
).to(model.device)
input_len = inputs["input_ids"].shape[-1]

outputs = model.generate(**inputs, max_new_tokens=512)
response = processor.decode(
    outputs[0][input_len:], skip_special_tokens=False
)
result = processor.parse_response(response)
# result["thinking"]  → internal reasoning chain
# result["response"] → final answer shown to user
```

### Introduction

- [Docs](https://ai.google.dev/gemma/docs/core) _(ai.google.dev)_
- [Model Card](https://ai.google.dev/gemma/docs/core/model_card_4) _(ai.google.dev)_
- [HuggingFace](https://huggingface.co/google) _(huggingface.co)_
- [Cookbook](https://github.com/google-gemma/gemma-cookbook) _(github.com)_

Released 2026-03-31 · Apache 2.0 · Built from Gemini 3 research · 140+ languages

### Install

```bash
$ pip install -U transformers torch accelerate
```

All models: `google/<model-id>` on HuggingFace

| Size    | Model ID             |
| ------- | -------------------- |
| E2B     | `gemma-4-E2B-it`     |
| E4B     | `gemma-4-E4B-it`     |
| 31B     | `gemma-4-31b-it`     |
| 26B A4B | `gemma-4-26b-a4b-it` |

### Sampling Params

| Parameter     | Value  |
| ------------- | ------ |
| `temperature` | `1.0`  |
| `top_p`       | `0.95` |
| `top_k`       | `64`   |

{.bold-first}

### Best Practices

- Place images/audio **before** text in any prompt
- Multi-turn: omit thought blocks from conversation history
- Include 75%+ CoT data to preserve reasoning capability
- Freeze vision layers when text-only fine-tuning

## Model Family {.cols-2}

### Model Specs {.col-span-2}

| Model   | Arch      | Total Params    | Active/Token | Layers | Context | Modalities       |
| ------- | --------- | --------------- | ------------ | ------ | ------- | ---------------- |
| E2B     | Dense+PLE | 5.1B (2.3B eff) | 2.3B         | 35     | 128K    | Text+Image+Audio |
| E4B     | Dense+PLE | 8B (4.5B eff)   | 4.5B         | 42     | 128K    | Text+Image+Audio |
| 31B     | Dense     | 30.7B           | 30.7B        | 60     | 256K    | Text+Image       |
| 26B A4B | MoE       | 25.2B           | 3.8B         | 30     | 256K    | Text+Image       |

{.show-header}

Sliding window: 512 tokens (E2B/E4B) · 1024 tokens (31B/26B) · Vocab: 262K (all models)

### Architecture Features {.row-span-2}

#### Hybrid Attention

- **Local** layers: sliding window (512 or 1024 tokens)
- **Global** layers: full context, interleaved with local
- Final layer is always a global attention layer

#### PLE — Edge Models (E2B/E4B)

- Per-Layer Embeddings: each decoder layer has its own small embedding table
- Large static tables use fast lookups — not dense matrix multiply
- Effective compute parameters ≪ total loaded parameters
- Enables inference under 1.5 GB VRAM (with 4-bit quantization)

#### p-RoPE & Shared KV Cache

- Proportional RoPE (p-RoPE) on global layers for long-range coherence
- Shared KV Cache across global layers reduces peak memory usage
- Supports stable 256K context without performance degradation

#### MoE — 26B A4B

- 128 total experts + 1 always-active shared expert
- 8 experts activated per token at inference time
- Speed similar to a 4B dense model, quality near 30B
- Vision encoder: ~550M params (same as 31B)

### Memory Requirements

| Model   | BF16 (16-bit) | 8-bit   | 4-bit   |
| ------- | ------------- | ------- | ------- |
| E2B     | 9.6 GB        | 4.6 GB  | 3.2 GB  |
| E4B     | 15 GB         | 7.5 GB  | 5 GB    |
| 31B     | 58.3 GB       | 30.4 GB | 17.4 GB |
| 26B A4B | 48 GB         | 25 GB   | 15.6 GB |

{.show-header}

Base weights only — add VRAM for KV cache.

### Pick a Model

| Available VRAM  | Recommended |
| --------------- | ----------- |
| < 5 GB          | E2B (4-bit) |
| 5–8 GB          | E4B (4-bit) |
| 15–20 GB        | E4B (BF16)  |
| 24–32 GB        | 31B (4-bit) |
| 48–80 GB        | 31B (BF16)  |
| High throughput | 26B A4B     |

## Benchmarks {.cols-2}

### Core Benchmarks {.col-span-2 .row-span-2}

| Benchmark            | 31B   | 26B A4B | E4B   | E2B   | Gemma 3 27B |
| -------------------- | ----- | ------- | ----- | ----- | ----------- |
| MMLU Pro             | 85.2% | 82.6%   | 69.4% | 60.0% | 67.6%       |
| MMMLU (multilingual) | 88.4% | 86.3%   | 76.6% | 67.4% | 70.7%       |
| AIME 2026 (math)     | 89.2% | 88.3%   | 42.5% | 37.5% | 20.8%       |
| GPQA Diamond         | 84.3% | 82.3%   | 58.6% | 43.4% | 42.4%       |
| LiveCodeBench v6     | 80.0% | 77.1%   | 52.0% | 44.0% | 29.1%       |
| Codeforces ELO       | 2150  | 1718    | 940   | 633   | 110         |
| BigBench Extra Hard  | 74.4% | 64.8%   | 33.1% | 21.9% | 19.3%       |
| Tau2 avg (agentic)   | 76.9% | 68.2%   | 42.2% | 24.5% | 16.2%       |
| HLE no tools         | 19.5% | 8.7%    | —     | —     | —           |
| HLE with search      | 26.5% | 17.2%   | —     | —     | —           |

{.show-header}

All results for instruction-tuned models with thinking mode enabled.

### Vision Benchmarks

| Benchmark     | 31B   | 26B A4B | E4B   | E2B   |
| ------------- | ----- | ------- | ----- | ----- |
| MMMU Pro      | 76.9% | 73.8%   | 52.6% | 44.2% |
| MATH-Vision   | 85.6% | 82.4%   | 59.5% | 52.4% |
| MedXPertQA MM | 61.3% | 58.1%   | 28.7% | 23.5% |
| OmniDocBench↓ | 0.131 | 0.149   | 0.181 | 0.290 |

{.show-header}

OmniDocBench = document edit distance (lower is better).

### Long Context

| Benchmark    | 31B   | 26B A4B | E4B   | E2B   |
| ------------ | ----- | ------- | ----- | ----- |
| MRCR v2 128K | 66.4% | 44.1%   | 25.4% | 19.1% |

{.show-header}

#### Arena AI (LMSYS ELO)

| Model           | ELO  | Open Rank |
| --------------- | ---- | --------- |
| Gemma 4 31B     | 1452 | #3        |
| Gemma 4 26B A4B | 1441 | #6        |

## Thinking Mode {.cols-2}

### Thinking Control {.row-span-2}

Add `<|think|>` to the **start** of the system prompt:

```python
messages = [
    {
        "role": "system",
        "content": "<|think|>You are a math expert."
    },
    {"role": "user", "content": "Solve: 3x + 7 = 22"}
]

text = processor.apply_chat_template(
    messages,
    tokenize=False,
    add_generation_prompt=True,
    enable_thinking=True
)
outputs = model.generate(**inputs, max_new_tokens=2048)
response = processor.decode(
    outputs[0][input_len:], skip_special_tokens=False
)
result = processor.parse_response(response)
# result["thinking"]  → step-by-step reasoning
# result["response"] → final answer
```

#### Thinking output structure

```
<|channel>thought
[Internal step-by-step reasoning — hidden from user]
<channel|>
[Final answer visible to user]
```

#### Disabled thinking behavior

For 31B/26B A4B with `enable_thinking=False`, empty tags still emitted:

```
<|channel>thought
<channel|>
[Final answer]
```

E2B/E4B variants skip empty tags entirely when disabled.

### Control Tokens

| Token                  | Purpose                          |
| ---------------------- | -------------------------------- |
| `<\|think\|>`          | Enable thinking in system prompt |
| `<\|channel>thought\n` | Open internal thought block      |
| `<channel\|>`          | Close thought block              |
| `<\|turn>`             | Open conversation turn           |
| `<turn\|>`             | Close conversation turn          |

{.bold-first}

### Multi-turn Rules

- **Do not** include thought content in conversation history
- Pass only `result["response"]` as the model turn
- Longer `max_new_tokens` for complex reasoning tasks
- Use `enable_thinking=True` for AIME, proofs, debugging

## Multimodal {.cols-3}

### Image Inputs {.row-span-2}

Variable aspect ratio + configurable **visual token budget**:

| Budget | Best For                          |
| ------ | --------------------------------- |
| 70     | Fast classification, video frames |
| 140    | Captions, thumbnails              |
| 280    | General image understanding       |
| 560    | Charts, diagrams                  |
| 1120   | OCR, PDF parsing, fine detail     |

```python
# Image MUST come before text (required)
messages = [{"role": "user", "content": [
    {"type": "image", "image": image},
    {"type": "text",  "text": "Describe this chart."},
]}]
inputs = processor(
    text=text,
    images=image,
    return_tensors="pt"
).to(model.device)
```

Vision encoder: ~150M params (E2B/E4B) · ~550M params (31B/26B)

### Audio Inputs

**E2B and E4B only** (~300M audio encoder)

- Max audio: **30 seconds**
- Tasks: ASR and speech translation

#### ASR prompt

```
Transcribe the following speech in
{LANGUAGE} into {LANGUAGE} text.
```

#### Translation prompt

```
Transcribe in {SRC_LANG}, then
translate to {TARGET_LANG}.
```

### Video Inputs

Processed as **sequential image frames**:

- Max: **60 seconds** at 1 fps = 60 frames
- Use **low token budget** (70–140) per frame
- E2B/E4B: also processes audio track simultaneously

```python
# Pass frames as list of images
inputs = processor(
    text=text,
    images=[frame1, frame2, ..., frame60],
    return_tensors="pt"
)
```

### Modality Order {.secondary}

Always place **image/audio before text** in content:

```python
# ✅ Correct order
content = [
    {"type": "image", "image": img},
    {"type": "text",  "text": "Describe it."},
]

# ❌ Text-first breaks alignment
content = [
    {"type": "text",  "text": "Describe it."},
    {"type": "image", "image": img},
]
```

## Deployment {.cols-3}

### HuggingFace {.row-span-2}

```bash
$ pip install -U transformers accelerate
```

#### BF16 (default)

```python
from transformers import (
    AutoProcessor, AutoModelForCausalLM
)
import torch

mid = "google/gemma-4-31b-it"
processor = AutoProcessor.from_pretrained(mid)
model = AutoModelForCausalLM.from_pretrained(
    mid,
    torch_dtype=torch.bfloat16,
    device_map="auto"
)
```

#### 4-bit quantized

```python
from transformers import BitsAndBytesConfig

bnb = BitsAndBytesConfig(load_in_4bit=True)
model = AutoModelForCausalLM.from_pretrained(
    mid,
    quantization_config=bnb,
    device_map="auto"
)
```

### Ollama

```bash
$ ollama pull gemma4           # 31B (default)
$ ollama pull gemma4:e4b       # edge 4B variant
$ ollama pull gemma4:e2b       # edge 2B variant
$ ollama run  gemma4           # interactive chat
```

#### Custom GGUF (Modelfile)

```bash
FROM /path/to/fine-tuned.gguf
SYSTEM "You are a coding assistant."
```

```bash
$ ollama create mygemma -f Modelfile
$ ollama run mygemma
```

### vLLM Server

```bash
$ vllm serve google/gemma-4-31B-it \
  --max-model-len 8192 \
  --enable-auto-tool-choice \
  --tool-call-parser gemma4 \
  --reasoning-parser gemma4
```

OpenAI-compatible API at `http://localhost:8000/v1`

### Cloud & API

| Platform   | Notes              |
| ---------- | ------------------ |
| Gemini API | `gemma-4-31b-it`   |
| AI Studio  | Browser playground |
| Vertex AI  | Custom endpoint    |
| Cloud Run  | Serverless GPU     |
| GKE + vLLM | Auto-scale         |

{.bold-first}

### Edge & Mobile

| Runtime          | Best For          |
| ---------------- | ----------------- |
| AICore (Android) | System-level API  |
| LiteRT-LM        | IoT, Raspberry Pi |
| AI Edge Gallery  | On-device eval    |
| LM Studio        | Desktop GUI       |
| llama.cpp        | CPU/GPU hybrid    |

{.bold-first}

## Fine-Tuning {.cols-2}

### QLoRA Setup {.row-span-2}

Single **16 GB GPU** (T4/free Colab or Kaggle):

```python
from unsloth import FastModel

model, tokenizer = FastModel.from_pretrained(
    "google/gemma-4-E4B-it",
    load_in_4bit=True,
    max_seq_length=4096
)

model = FastModel.get_peft_model(
    model,
    r=16,
    lora_alpha=16,
    lora_dropout=0,
    target_modules=[
        "q_proj", "k_proj",
        "v_proj", "o_proj",
        "gate_proj", "up_proj", "down_proj"
    ],
)
```

#### Vision fine-tuning (E2B / E4B)

```python
from unsloth import FastVisionModel

model, tokenizer = FastVisionModel.from_pretrained(
    "google/gemma-4-E4B-it",
    finetune_vision_layers=False,   # freeze encoder
    finetune_language_layers=True,
    load_in_4bit=True,
)
```

### MoE Fine-tuning

For **26B A4B** — full fine-tune breaks expert routing:

- Use **LoRA bf16** only (never FFT)
- Start with `r=16`, `lora_alpha=16`
- Increase context length gradually after loss converges
- Avoid targeting expert router weight matrices

### Data Requirements

| Requirement      | Value                         |
| ---------------- | ----------------------------- |
| CoT data ratio   | ≥ 75% of training set         |
| Thinking format  | Include `<\|think\|>` trigger |
| Multimodal order | Images/audio before text      |
| Chat template    | ShareGPT or OpenAI format     |
| RL reward        | Verifiable final answer       |

{.bold-first}

### Vision Fine-tune Tips

1. **Freeze vision first** — `finetune_vision_layers=False`
2. Fine-tune LLM + attention + MLP projectors only
3. Validate text-domain quality before unfreezing
4. Unfreeze vision only for domain-specific images
5. Low token budget (70–280) saves VRAM during training

## Gemmaverse {.cols-3}

### Specialist Models {.col-span-2}

| Model         | Domain          | Description                         |
| ------------- | --------------- | ----------------------------------- |
| MedGemma 4B   | Medical imaging | Multimodal X-ray/MRI analysis       |
| MedGemma 27B  | Clinical text   | EHR + medical report reasoning      |
| CodeGemma     | Coding          | Code completion & refactoring       |
| PaliGemma 2   | Visual-language | Fine-grained VLM & visual reasoning |
| ShieldGemma   | Safety          | LLM output safety classifier        |
| DataGemma     | Factual data    | Grounded via Google Data Commons    |
| FunctionGemma | Tool calling    | Low-resource function call parsing  |

{.show-header}

### Ecosystem

**Libraries & Frameworks**

- ADK (Agent Development Kit)
- JAX Gemma Library (`google-deepmind/gemma`)
- Gemma Cookbook (`google-gemma/gemma-cookbook`)
- `google/adk-samples` starter agents

**Community Variants**

- 100K+ community fine-tuned derivatives
- RecurrentGemma (Griffin architecture)
- EmbeddingGemma, T5Gemma 2
- VaultGemma (differential privacy)

## Also see {.cols-1}

- [Official Docs](https://ai.google.dev/gemma/docs/core) _(ai.google.dev)_
- [Model Card](https://ai.google.dev/gemma/docs/core/model_card_4) _(ai.google.dev)_
- [DeepMind Models Page](https://deepmind.google/models/gemma/gemma-4/) _(deepmind.google)_
- [HuggingFace](https://huggingface.co/google) _(huggingface.co)_
- [Gemma Cookbook](https://github.com/google-gemma/gemma-cookbook) _(github.com)_
- [JAX Gemma Library](https://github.com/google-deepmind/gemma) _(github.com)_
- [vLLM Usage Guide](https://docs.vllm.ai/projects/recipes/en/latest/Google/Gemma4.html) _(docs.vllm.ai)_
- [Ollama Library](https://ollama.com/library/gemma4) _(ollama.com)_
