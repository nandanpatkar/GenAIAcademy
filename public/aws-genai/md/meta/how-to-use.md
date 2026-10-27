## Who it is for
A junior developer with basic Python who is new to AWS and wants to reach professional-level GenAI skills for **AIP-C01**.

## Suggested path

| Phase | What to do | Where |
|---|---|---|
| 1. Set up (1 day) | Create an AWS account safely, set a billing alarm, install the CLI, create an IAM identity, make one Bedrock call. | `00-foundations/01` |
| 2. Build concepts (2–3 days) | LLMs, tokens, embeddings, vector search. Run the no-AWS lab first. | `00-foundations/02–03` |
| 3. Core Bedrock (1–2 weeks) | Follow `01-bedrock-genai-fundamentals/` in numeric order. | folder 01 |
| 4. Deepen by domain | Data → Agents → Optimization → SageMaker → Tools → Governance → Security. | folders 02–08 |
| 5. Cover the wide net | Skim `09-other-services` using the in-scope list. | folder 09 |
| 6. Integrate | Architecture capstone and trade-off drills. | folder 10 |
| 7. Exam | Weak-area review, original practice questions, test-taking notes. | folder 11 |

## Study loop for each topic
1. Read **Simple explanation** and **Analogy** only. Close the file and explain it aloud.
2. Read the **Seven questions** and **Technical depth**.
3. Do the **lab**. Break something on purpose using "What can go wrong?".
4. Answer the **checkpoints** without looking.
5. Next day: answer only the **revision cards**.

## Cost safety (read before any lab)
- Create a **billing alarm** first (`00-foundations/01`).
- Labs that create OpenSearch Serverless collections, Aurora clusters, SageMaker endpoints, NAT gateways, ElastiCache, EKS or Provisioned Throughput **cost money while idle**. Each such lab ends with a **Cleanup** section. Do the cleanup the same day.
- Never put access keys in code or Git. Use `aws configure sso` or short-lived credentials.

## Conventions
- ✅ verified against an official page · 🟡 secondary source · ❌ unverified.
- `<PLACEHOLDER>` in code means "replace with your own value".
- Region examples use `us-east-1` for convenience. Always confirm model availability in *your* Region.
- Windows PowerShell commands are shown where setup differs from macOS/Linux.
