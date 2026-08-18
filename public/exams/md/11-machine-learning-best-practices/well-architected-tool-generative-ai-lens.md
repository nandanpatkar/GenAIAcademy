## Overview
- The AWS Well-Architected Tool (WA Tool) lets you assess workloads against best‑practice questions called **lenses**.
- The **Generative AI Lens** extends the Well‑Architected Framework for GenAI workloads on Bedrock or SageMaker and is distributed as a **custom lens** that you import. 

## Lens Basics in WA Tool
- The **AWS Well‑Architected Framework lens** is automatically applied to every workload.
- You can add additional lenses to a workload (up to 20 total; up to 5 at a time).
- Lenses come from:
  - **Lens Catalog** (AWS‑maintained official lenses).
  - **Custom lenses** (user‑defined or imported).

## Generative AI Lens: How It’s Used in WA Tool
- The Generative AI Lens is **not pre‑installed**. You **download and import** it into WA Tool from the public AWS custom lens GitHub repository (per the lens documentation).
- After import, the lens is available under **Custom lenses** and can be attached to workloads.

## Typical Workflow
1. **Import the lens** into WA Tool (console or API).
2. **Publish** the lens version (custom lenses are DRAFT until published).
3. **Add the lens** to a workload.
4. **Answer lens questions** and record notes.
5. Review the **Improvement Plan** for prioritized recommendations.

## Viewing Results
- WA Tool provides a **Lens details** view with:
  - Overview tab (progress and notes)
  - Improvement plan tab (recommended actions)
  - Shares tab (for custom lenses)

## Why It Matters
- The Generative AI Lens aligns GenAI architectures with Well‑Architected pillars.
- It provides structured guidance across the GenAI lifecycle (scoping → deployment → continuous improvement).

## Exam Tips
- The Generative AI Lens is imported as a **custom lens** into WA Tool.
- Custom lenses must be **published** before they can be applied to workloads.
- WA Tool keeps lens data even if you remove a lens and re‑add it later.

## Sources

```ex-sources
[{"title": "https://docs.aws.amazon.com/wellarchitected/latest/generative-ai-lens/generative-ai-lens.html", "href": "https://docs.aws.amazon.com/wellarchitected/latest/generative-ai-lens/generative-ai-lens.html"}, {"title": "https://docs.aws.amazon.com/wellarchitected/latest/userguide/lenses.html", "href": "https://docs.aws.amazon.com/wellarchitected/latest/userguide/lenses.html"}, {"title": "https://docs.aws.amazon.com/wellarchitected/latest/userguide/lenses-details.html", "href": "https://docs.aws.amazon.com/wellarchitected/latest/userguide/lenses-details.html"}, {"title": "https://docs.aws.amazon.com/wellarchitected/latest/APIReference/API_ImportLens.html", "href": "https://docs.aws.amazon.com/wellarchitected/latest/APIReference/API_ImportLens.html"}, {"title": "https://docs.aws.amazon.com/wellarchitected/latest/userguide/lens-catalog.html", "href": "https://docs.aws.amazon.com/wellarchitected/latest/userguide/lens-catalog.html"}]
```
