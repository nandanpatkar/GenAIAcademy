## 0. Before you start
- **Essential:** the idea of a secret key that scrambles data and can unscramble it; the difference between data **in transit** (moving) and **at rest** (stored).
- **Helpful:** IAM policies ([08/01](aip:08-security/01-least-privilege-iam-identity-center-and-data-masking)); S3 buckets and objects; Lambda.
- **Optional advanced:** HSMs; cryptographic algorithms; envelope encryption proofs.

## 1. Simple explanation
**Encryption** turns readable data into scrambled data that only someone with the right **key** can read. Two places matter: **in transit** (TLS protects data moving over a network) and **at rest** (the data on disk). **AWS KMS (Key Management Service)** creates and guards the keys. Your data is usually encrypted by a small, short-lived **data key**, and that data key is itself locked by a **KMS key** that never leaves KMS: this is **envelope encryption**. **Secrets Manager** stores passwords, API keys and tokens so they are not written in code, and can change them on a schedule (**rotation**). **Macie** looks through S3 buckets for sensitive data (card numbers, IDs, credentials) and for buckets that are too open. For GenAI you also decide **what Bedrock keeps**: Bedrock encrypts your customization data, agents and knowledge-base sources with your keys if you ask, never gives your prompts to model providers, and lets you set **data retention** modes.


```figure
flow envelope-encryption
```

## 2. Structured explanation
1. **Encryption 101** 🟡: symmetric (one key, fast, for data) vs asymmetric (key pair, for signing and key exchange); TLS in transit; encryption at rest; envelope encryption.
2. **KMS** ✅: FIPS 140-3 Security Level 3 HSMs; KMS keys never leave KMS unencrypted; three key types (customer managed, AWS managed, AWS owned); key policies are the primary access control; rotation; multi-Region keys; CloudTrail logs every use.
3. **Secrets Manager** ✅: store, retrieve and rotate database credentials, application credentials, OAuth tokens, API keys; rotation by Lambda function or managed rotation; secrets encrypted with KMS.
4. **Macie** ✅: ML and pattern matching to discover sensitive data in S3; bucket inventory and policy findings; findings to EventBridge and Security Hub CSPM.
5. **Bedrock data protection** ✅: TLS 1.2; customer-managed KMS keys for custom models, agents, knowledge-base ingestion, evaluation jobs, OpenSearch vector stores and S3 data; model deployment accounts that providers cannot access; retention modes.

## 3. Analogy
**A safe-deposit room.** Each document goes into its own small lockbox (data key). The lockbox keys are kept in a bank vault (KMS) that issues a sealed copy of each lockbox key and never lets the master key out. Changing the master key (rotation) does not re-lock every box; the bank just remembers which master key version sealed each lockbox key. Secrets Manager is the concierge who changes your hotel room code every month and tells the staff who need it. Macie is the inspector who walks through your storage rooms looking for passports left on shelves.

*Where it breaks:* the vault guards the master key, but whether *you* may ask the vault to open a box is decided by the key policy, IAM policies and grants together; a missing line in the key policy can lock out even the account administrators.

## 4. The seven questions

**WHAT?** The encryption, key, secret and sensitive-data services, plus Bedrock's own data-protection settings.

**WHY?** Protect confidentiality and meet compliance; avoid hard-coded secrets; find PII before it enters a knowledge base or a training set; control what is retained.

**WHEN?** Encrypt everything by default; use customer-managed keys when you must control, audit or revoke the key; rotate secrets regularly; scan S3 buckets before ingestion.

**WHERE?** KMS keys and key policies are **Regional** ✅ (multi-Region keys replicate); Secrets Manager secrets are Regional (replication across Regions exists 🟡); Macie works per Region; Bedrock retention is per Region ✅.

**HOW?** §5.

**WHAT IF?**
| Situation | Effect | Remedy |
|---|---|---|
| Key policy lacks the statement that enables IAM policies | IAM allows for that key have no effect ✅ | Add the account-root statement (default key policy has it) |
| You schedule a customer-managed key for deletion | Data protected only by it becomes unreadable after deletion 🟡 | Use the waiting period; disable first; check usage in CloudTrail |
| You rotate a KMS key | New encryptions use new material; old ciphertext still decrypts; data keys are **not** rotated or re-encrypted ✅ | Rotation is not a fix for a leaked data key |
| Bedrock job uses a customer key without grants in the key policy | Job fails with an access error 🟡 | Add the service principal statements shown in the Bedrock encryption pages (not read ❌) |
| A secret is hard-coded in a Lambda environment variable in plain text | Anyone with read access sees it | Store in Secrets Manager; fetch at runtime |
| Rotation Lambda cannot reach the database or Secrets Manager | Rotation fails and retries ✅ | Network path (VPC endpoint), permissions, [08/05](aip:08-security/05-vpc-privatelink-and-network-security) |
| Account retention mode is `none` and a model requires human review | Model unavailable (`ValidationException`) ✅ | Choose another model or change the mode deliberately |

**WHY NOT?** Do not use KMS to store large data (it encrypts small payloads and issues data keys). Do not store AWS credentials in Secrets Manager when a role works (AWS recommends IAM) ✅. Do not use Macie for non-S3 stores; it is S3 only ✅.

## 5. Technical depth

```figure
pii-redact
```


### 5.1 Encryption 101 (lesson 222) 🟡 + ✅ facts
- **In transit:** TLS; Bedrock requires **TLS 1.2** and recommends 1.3 ✅; VPC and Bedrock endpoints require TLS 1.2 and PFS cipher suites ✅.
- **At rest:** the service encrypts stored data. S3 default encryption (SSE-S3) and its options are in [02/09](aip:02-data-management/09-amazon-s3-storage-lifecycle-replication-and-security).
- **Envelope encryption** ✅ (KMS key hierarchy): a KMS key protects **data keys** (CDKs), which protect the data; KMS can return a data key in plaintext (to use now) and encrypted (to store); decryption of a wrapped data key happens only inside HSMs through a KMS call; ciphertext and decrypted payloads are never stored in KMS.

### 5.2 AWS KMS (lessons 223, 224) ✅ (`overview.html`, `concepts.html`, `rotate-keys.html`, `key-policies.html`)
| Topic | Facts |
|---|---|
| **Security** | KMS keys protected by FIPS 140-3 Security Level 3 validated HSMs; never leave KMS unencrypted; used only by calling KMS |
| **Customer managed keys** | You create, own, manage; key policies, IAM policies and grants; enable/disable; rotation; tags; aliases; schedule deletion; `DescribeKey` shows `KeyManager = CUSTOMER`; monthly fee (pro-rated hourly) plus usage |
| **AWS managed keys** | In your account, created by an integrated service; alias `aws/<service>`; usable only through that service by principals of your account; **automatic rotation every year** (changed from three years in May 2022) and you cannot change it; no monthly fee; RCPs do not apply to them |
| **AWS owned keys** | In a service-owned account, shared across customers; free; cannot be viewed, audited or deleted by you; rotation per service |
| **Key policy** | **Exactly one** per KMS key; primary access control; no principal (not even root or the creator) has permission unless allowed in a key policy, IAM policy or grant and not denied; **IAM policies can allow access only if the key policy enables them** (the default key policy has the statement); an IAM `Deny` works even without key-policy permission; key policies are **Regional** |
| **Rotation** | Automatic rotation is **optional** for customer managed **symmetric** keys with KMS-generated key material; default **365 days**, custom rotation period possible; **on-demand rotation** also for imported symmetric material; asymmetric, HMAC and custom key store keys need **manual rotation** (new key + alias change); rotation changes only current key material, **old material is kept to decrypt old ciphertext**; same key ID/ARN; does **not** re-encrypt data or rotate data keys; AWS charges extra monthly for the first and second rotation; events in CloudTrail and EventBridge |
| **Identifiers** | Key ARN `arn:aws:kms:region:account:key/id`; alias `alias/name` (the `aws/` prefix is reserved); multi-Region key IDs start `mrk-` |
| **Multi-Region keys** | Related keys share key material and rotation settings; rotation is managed on the primary; replicas get all prior material |
| **Logging** | Every use appears in CloudTrail as management events ([07/04](aip:07-governance-qa/04-cloudtrail-and-x-ray-for-genai)) |

**Which key type?** Use an AWS owned key for convenience, an AWS managed key for visibility, a customer managed key when you must control the policy, rotation, audit trail and deletion ✅.

```mermaid
flowchart LR
    APP[Application or AWS service] -->|1 GenerateDataKey| KMS[AWS KMS: KMS key in HSM]
    KMS -->|2 plaintext data key + encrypted data key| APP
    APP -->|3 encrypt data with plaintext key, then discard it| DATA[(Encrypted data + encrypted data key)]
    DATA -->|4 later: send encrypted data key| KMS
    KMS -->|5 Decrypt: key policy + IAM + grants checked| APP
    KMS -.->|every call| CT[CloudTrail]
```
*Reading the arrows:* the application asks KMS for a data key; KMS returns it twice (plain and wrapped); the app encrypts and throws the plaintext copy away; to read the data later the app sends the wrapped key back; KMS checks the key policy, IAM policies and grants, and returns the plain key; each call is logged.

### 5.3 AWS Secrets Manager (lessons 226, 227) ✅ (`intro.html`, `rotating-secrets.html`, `rotate-secrets_lambda.html`)
- **What:** manage, retrieve and **rotate** database credentials, application credentials, OAuth tokens, API keys and other secrets; replace hard-coded credentials with a runtime call.
- **Which secret where** ✅: AWS credentials → IAM; encryption keys → KMS; SSH keys → EC2 Instance Connect; private keys and certificates → AWS Certificate Manager.
- **Rotation forms** ✅: *managed rotation* (for secrets managed by another service; no Lambda); *managed external secrets* rotation for partner-held secrets (no Lambda); *rotation by Lambda function* for other types.
- **Lambda rotation** ✅: Secrets Manager calls the function several times with a `Step` of `create_secret`, `set_secret`, `test_secret`, `finish_secret`, plus `SecretId`, `ClientRequestToken` (idempotency) and `RotationToken` (needed for assumed-role and cross-account rotation); if a step fails the whole process is retried during open rotation windows; manually updating a secret while rotation is configured counts as a valid rotation.
- **Version labels** 🟡 (standard behavior, not on the pages read ❌): `AWSCURRENT` (used by apps), `AWSPENDING` (new version during rotation), `AWSPREVIOUS`.
- **Encryption** ✅: secrets are encrypted with KMS; the AWS managed key `aws/secretsmanager` is free, a customer managed key is billed at the KMS rate.
- **Cost model** ✅: pay for what you use; no charge for secrets marked for deletion; Lambda rotation functions are billed at Lambda rates (managed rotation has no Lambda); all events are CloudTrail management events.
- **GenAI uses:** third-party vector-store credentials for Knowledge Bases (Bedrock reads them through Secrets Manager ✅), API keys for external tools called by agents or MCP servers ([03/06](aip:03-agentic-ai/06-mcp-openapi-tools-and-human-in-the-loop)), database passwords for Aurora/pgvector ([02/07](aip:02-data-management/07-rds-aurora-and-pgvector)), signing keys for webhooks. Never put these in prompts or environment variables in clear text.
- **Network** 🟡: a Lambda in a VPC needs a route (NAT or an interface endpoint for Secrets Manager) to fetch a secret ([08/05](aip:08-security/05-vpc-privatelink-and-network-security)); size, quota and endpoint names ❌ not read.

### 5.4 Amazon Macie (lesson 225) ✅ (`what-is-macie.html`)
- **What:** a data security service that discovers sensitive data with **machine learning and pattern matching**, shows data-security risks, and helps automate protection; **S3 only** (it inventories S3 **general purpose** buckets).
- **Two discovery modes:** *automated sensitive data discovery* (continuous, sampling representative objects across the estate) and *sensitive data discovery jobs* (targeted: choose buckets, sampling depth and criteria; one-time or recurring).
- **Identifiers:** **managed data identifiers** (PII, financial data, credentials, many countries) and **custom data identifiers** (regex, optional keywords and proximity rule); **allow lists** to ignore known-safe text.
- **Findings:** *policy findings* (for example a bucket that becomes publicly accessible) and *sensitive data findings*; severity, resource, detail; viewable in the console and API; published to **EventBridge** and **AWS Security Hub CSPM**.
- **Multi-account:** Organizations integration or invitations with a Macie administrator.
- **Cost model:** evaluating buckets, automated discovery sampling, and analyzing objects; a **30-day free trial** per Region (jobs not included); extra costs for retrieving data and for customer-managed KMS keys used to decrypt objects ✅; prices ❌.
- **GenAI uses:** scan the S3 buckets that feed a Knowledge Base or fine-tuning *before* ingestion; alarm on a finding via EventBridge; compare with Comprehend ([02/04](aip:02-data-management/04-transcribe-comprehend-and-comprehend-medical): detects/redacts PII in text you send) and Guardrails (filters live prompts and responses). Bedrock's data-protection page itself recommends Macie ✅.

### 5.5 Bedrock encryption and data protection ✅ (`data-protection.html`, `data-encryption.html`)
| Resource | How to use your own KMS key |
|---|---|
| Model customization jobs and output custom models | `customModelKmsKeyId` in `CreateModelCustomizationJob` |
| Agents | `customerEncryptionKeyArn` in `CreateAgent` |
| Knowledge-base data-source ingestion jobs | `kmsKeyArn` in `CreateDataSource` / `UpdateDataSource` |
| OpenSearch vector stores | at collection/domain creation |
| Model evaluation jobs | `customerEncryptionKeyId` in `CreateEvaluationJob` |
| Training, validation, output data; KB data sources | S3 SSE-KMS |
| Third-party vector-store credentials | Secrets Manager (with KMS) |

- **In transit:** TLS 1.2 within AWS; API and console over SSL; **FIPS 140-3** endpoints exist (`bedrock-fips`, `bedrock-runtime-fips`) in a limited list of Regions ✅ ([08/05](aip:08-security/05-vpc-privatelink-and-network-security)).
- **Model Deployment Accounts** ✅: one per model provider per Region, owned and operated by the Bedrock service team; providers have **no access** to them, so they cannot see logs, prompts or completions.
- **Do not** put confidential data in tags or free-form name fields (they may reach billing or diagnostic logs) ✅; do not put credentials in URLs you give to external servers ✅.
- **Abuse detection** ✅: the data-protection page links an abuse-detection page for how data is processed (not read ❌).

### 5.6 Bedrock data retention ✅ (`data-retention.html`)
- You choose per Region (and, on the `bedrock-mantle` endpoint, per project) a **mode**: `none` (zero data retention; nothing written to durable storage by AWS or shared with the provider), `default` (the model's own policy; AWS may retain for safety and abuse prevention), `aws_review` (inputs and outputs retained inside AWS for up to 30 days and may be reviewed by AWS where the provider requires human review; **not shared with the provider**), `provider_data_share` (legacy; behaves like `aws_review` today), and `inherit` (defer to a broader scope).
- **Order** (least to most permissive): `none < default < aws_review < provider_data_share`. A model is available only if your **effective** mode is at or above what it requires; otherwise it shows `status: unavailable` on `bedrock-mantle` and returns a `ValidationException` on `bedrock-runtime`.
- **Effective mode** = first non-`inherit` of **project → account → model default**.
- **Models differ:** each model declares `allowed_modes`; most models do not require review; setting `aws_review` does not make every model retain data. Some models require retention; zero-data-retention access for those is arranged through your AWS account manager (and, for Claude models, Anthropic).
- **Cross-Region inference:** retained data is stored in the destination Region that processed the request.
- **Control with IAM/SCP:** condition keys `bedrock:DataRetentionMode` (control plane `PutAccountDataRetention`) and `bedrock-mantle:DataRetentionMode` (mantle write actions); the page's SCP example denies setting any mode other than `none`; another denies review modes only.
- At launch there is **no console UI** for retention; configure by API or SDK ✅.

## 6. Worked example
*Problem:* an insurer builds a claims assistant on a Knowledge Base fed from S3 and fine-tunes a model on past claims. Auditors demand customer-controlled keys, no secrets in code, PII discovery before ingestion, and zero retention of prompts.

| Need | Design | Why |
|---|---|---|
| Key control | One customer managed KMS key per environment; key policy limited to the app roles, the Bedrock service principal and key administrators; automatic rotation on (default 365 days) | Control, audit, rotation ✅ |
| Data at rest | S3 SSE-KMS for sources and training data; `kmsKeyArn` on the data source; `customModelKmsKeyId` on the job; customer key on the vector store | Full coverage ✅ |
| PII before ingestion | Macie discovery job on the source bucket; EventBridge rule routes sensitive findings to a quarantine workflow; Comprehend redaction for the text that must stay | Find then fix ✅ |
| Secrets | Third-party vector DB password and CRM API key in Secrets Manager, rotated with a Lambda; fetched at runtime | No hard-coded secrets ✅ |
| Retention | Account retention mode `none` in each Region; SCP denying other modes; choose models that allow `none` | Zero retention ✅ |
| Evidence | CloudTrail on KMS and Secrets Manager events; Macie findings in Security Hub | Audit ✅ |
| Network | Interface endpoints for KMS, Secrets Manager and Bedrock ([08/05](aip:08-security/05-vpc-privatelink-and-network-security)) | Private path ✅ |

## 7. Knowledge checkpoints
1. What is envelope encryption?
2. What happens to old ciphertext when a customer managed KMS key rotates?
3. When can an IAM policy allow use of a KMS key?
4. Which data stores can Macie scan?
5. What is the effective retention mode if the project is `inherit` and the account is `none`?

## 7b. Practice questions (exam-style, original) — answers in §14

**Q1.** A team must control the key policy, audit key usage and be able to disable access to the key for data stored by an AWS service. Which key type?
A. Customer managed KMS key
B. AWS owned key
C. AWS managed key
D. A key stored in the application source code

**Q2.** (Select TWO) Which statements about KMS rotation are correct?
A. Automatic rotation is optional for customer managed symmetric keys with KMS-generated material
B. Rotation changes the key ID
C. Old key material is kept so old ciphertext still decrypts
D. Rotation re-encrypts all data keys and data
E. AWS managed keys can have rotation disabled

**Q3.** An IAM policy allows `kms:Decrypt` on a key, but calls fail. The key policy has no statement for the account. What is the cause?
A. IAM policies can allow KMS access only if the key policy enables IAM policies
B. KMS does not support IAM
C. The key is an AWS owned key
D. Rotation is disabled

**Q4.** A Lambda function needs a database password that must change monthly without code changes. Which service?
A. AWS Secrets Manager with rotation
B. Hard-coded environment variable
C. Amazon Macie
D. AWS WAF

**Q5.** (Select TWO) Which are true about Amazon Macie?
A. It discovers sensitive data in S3
B. It supports managed and custom data identifiers
C. It scans RDS databases directly
D. It filters model responses at runtime
E. It only supports one account

**Q6.** A company wants to discover PII in S3 buckets that feed a Knowledge Base before ingestion. Which service?
A. Amazon Macie sensitive data discovery job
B. VPC Flow Logs
C. CloudFront
D. Route 53

**Q7.** An account's Bedrock retention mode is `default` and a model requires `aws_review`. What happens on `bedrock-runtime`?
A. A `ValidationException`: the model is unavailable under that mode
B. The call succeeds and is retained for ten years
C. The provider receives the data
D. It silently switches to `none`

**Q8.** Which statement about Bedrock model providers and customer data is correct?
A. Model providers have no access to the model deployment accounts, so they cannot see prompts, completions or Bedrock logs
B. Providers receive all prompts for training
C. Prompts are always public
D. Logs are visible to every customer

## 8. Hands-on lab: envelope encryption with rotation, key-policy checks, a secret rotation state machine, a Macie-style scan and retention modes

### 8.1 Objective
Offline: build a toy envelope-encryption flow and watch rotation keep old data readable; evaluate who can use a KMS key; run a four-step rotation with version labels; scan sample objects for sensitive data; resolve Bedrock retention modes.

### 8.2 Prerequisites
Python 3 (standard library). Optional AWS part: an AWS account with KMS, Secrets Manager and S3.

### 8.3 AWS services
Offline: none. Optional: KMS, Secrets Manager, Lambda, Macie, S3, Bedrock.

### 8.4 IAM permissions
Offline: none. Real: `kms:CreateKey`, `kms:GenerateDataKey`, `kms:Decrypt`, `kms:EnableKeyRotation` and key-policy edits; `secretsmanager:CreateSecret`, `GetSecretValue`, `RotateSecret`; Macie enablement; exact action lists were not read ❌ except the Bedrock retention actions (§5.6).

### 8.5 Region notes
Create keys and secrets in the same Region as the service that uses them; Macie is enabled per Region ✅.

### 8.6 Architecture
§5.2 diagram.

### 8.7 Cost
Offline: none. Real: KMS keys (monthly) and requests, Secrets Manager secrets and rotation Lambda, Macie after the 30-day trial; prices ❌ not read. Delete keys (schedule deletion) and secrets after the lab.

### 8.8 Code
**Teaching toy, not cryptography:** the "cipher" below is built from HMAC-SHA256 with fixed nonces only to show the *flow* of envelope encryption and rotation with the standard library. Never use it to protect real data; use KMS and a reviewed library. Everything else (names, objects, passwords) is made up.

```python lab-run
import hashlib, hmac, re

# ---------- 1. Toy envelope encryption with KMS-style key versions ----------
def stream(key, nonce, n):
    out, i = b"", 0
    while len(out) < n:
        out += hmac.new(key, nonce + i.to_bytes(4, "big"), hashlib.sha256).digest()
        i += 1
    return out[:n]
def seal(key, nonce, data):
    ct = bytes(a ^ b for a, b in zip(data, stream(key, nonce, len(data))))
    return nonce + ct + hmac.new(key, nonce + ct, hashlib.sha256).digest()[:8]
def unseal(key, blob):
    nonce, ct, tag = blob[:8], blob[8:-8], blob[-8:]
    if not hmac.compare_digest(tag, hmac.new(key, nonce + ct, hashlib.sha256).digest()[:8]):
        raise ValueError("tamper detected")
    return bytes(a ^ b for a, b in zip(ct, stream(key, nonce, len(ct))))

class Kms:
    def __init__(self):
        self.material, self.counter = {1: hashlib.sha256(b"material-1").digest()}, 0
    def rotate(self):
        v = max(self.material) + 1
        self.material[v] = hashlib.sha256(f"material-{v}".encode()).digest()
    def generate_data_key(self):
        self.counter += 1
        plain = hashlib.sha256(b"data-key-%d" % self.counter).digest()
        v = max(self.material)
        return plain, bytes([v]) + seal(self.material[v], self.counter.to_bytes(8, "big"), plain)
    def decrypt(self, wrapped):
        return unseal(self.material[wrapped[0]], wrapped[1:])
    def re_encrypt(self, wrapped):
        plain, v = self.decrypt(wrapped), max(self.material)
        self.counter += 1
        return bytes([v]) + seal(self.material[v], self.counter.to_bytes(8, "big"), plain)

kms = Kms()
plain_key, wrapped_1 = kms.generate_data_key()
stored_1 = seal(plain_key, b"doc-0001", b"claim 123: patient is allergic to penicillin")
del plain_key                                                        # the plaintext data key is discarded
print("1) envelope encryption")
print("   stored object is", len(stored_1), "bytes; wrapped data key uses KMS material version", wrapped_1[0])
kms.rotate()
print("   after rotation, old data still decrypts:", unseal(kms.decrypt(wrapped_1), stored_1).decode())
_, wrapped_2 = kms.generate_data_key()
print("   new data keys use version", wrapped_2[0], "| the old wrapped key still says version", wrapped_1[0], "(rotation does not re-wrap data keys)")
wrapped_1b = kms.re_encrypt(wrapped_1)
print("   after ReEncrypt the wrapped key says version", wrapped_1b[0], "and the data blob is unchanged:", unseal(kms.decrypt(wrapped_1b), stored_1) == b"claim 123: patient is allergic to penicillin")
tampered = bytearray(stored_1)
tampered[12] ^= 1
try:
    unseal(kms.decrypt(wrapped_1b), bytes(tampered))
except ValueError as e:
    print("   modified ciphertext:", e)

# ---------- 2. Who may use a KMS key? key policy + IAM + grants (rules from the KMS key-policy page) ----------
def key_access(key_policy_allows_principal, key_policy_enables_iam, iam_allows, iam_denies, grant):
    if iam_denies:
        return "DENY (explicit deny)"
    if key_policy_allows_principal or grant:
        return "ALLOW"
    if key_policy_enables_iam and iam_allows:
        return "ALLOW (via IAM policy, enabled by the key policy)"
    return "DENY (no permission)"
print("2) KMS access decisions")
for name, args in [("key policy names the role", (True, False, False, False, False)), ("IAM allows, key policy enables IAM", (False, True, True, False, False)),
                   ("IAM allows, key policy does NOT enable IAM", (False, False, True, False, False)), ("grant exists", (False, False, False, False, True)),
                   ("IAM deny beats key policy allow", (True, True, True, True, False)), ("nobody allowed", (False, True, False, False, False))]:
    print(f"   {name:<46}{key_access(*args)}")

# ---------- 3. Secret rotation: create_secret, set_secret, test_secret, finish_secret ----------
def rotate(secret, db, fail_at=None):
    token, new_pw = "token-%d" % (len(secret["versions"]) + 1), "pw-%d" % (len(secret["versions"]) + 1)
    log = []
    for step in ["create_secret", "set_secret", "test_secret", "finish_secret"]:
        if step == fail_at:
            log.append(f"{step}: FAILED")
            return log
        if step == "create_secret":
            secret["versions"][token] = new_pw
            secret["labels"]["AWSPENDING"] = token
        elif step == "set_secret":
            db["password"] = new_pw
        elif step == "test_secret":
            assert db["password"] == secret["versions"][secret["labels"]["AWSPENDING"]]
        else:
            secret["labels"]["AWSPREVIOUS"] = secret["labels"]["AWSCURRENT"]
            secret["labels"]["AWSCURRENT"] = secret["labels"].pop("AWSPENDING")
        log.append(f"{step}: ok")
    return log
secret = {"versions": {"token-1": "pw-1"}, "labels": {"AWSCURRENT": "token-1"}}
db = {"password": "pw-1"}
current = lambda: secret["versions"][secret["labels"]["AWSCURRENT"]]
print("3) rotation")
print("   before:", current(), "| application login works:", db["password"] == current())
print("   ", rotate(secret, db))
print("   after: ", current(), "| labels:", dict(sorted(secret["labels"].items())), "| login works:", db["password"] == current())
print("   failure in set_secret keeps AWSCURRENT:", rotate(secret, db, fail_at="set_secret")[-1], "| current:", current())

# ---------- 4. A Macie-style scan: managed identifiers, a custom identifier, an allow list, a bucket policy finding ----------
IDENTIFIERS = {"email": r"[\w.+-]+@[\w-]+\.[\w.]+", "us_phone": r"\b\d{3}-\d{3}-\d{4}\b", "aws_access_key": r"\bAKIA[0-9A-Z]{16}\b", "claim_number": r"\bCLM-\d{6}\b"}   # last one is the 'custom' identifier
ALLOW = {"support@example.com"}
OBJECTS = {"s3://kb-source/faq.txt": "Write to support@example.com for help.",
           "s3://kb-source/claim-77.txt": "Claim CLM-123456 for jo@example.com, call 415-555-0100.",
           "s3://kb-source/deploy-notes.txt": "temp key AKIAABCDEFGHIJKLMNOP left in notes"}
BUCKETS = {"kb-source": {"Statement": []}, "public-docs": {"Statement": [{"Effect": "Allow", "Principal": "*", "Action": "s3:GetObject"}]}}
print("4) sensitive data findings")
for uri, text in OBJECTS.items():
    hits = [(name, m) for name, rx in IDENTIFIERS.items() for m in re.findall(rx, text) if m not in ALLOW]
    print(f"   {uri:<34}", sorted({n for n, _ in hits}) or "clean")
for name, pol in BUCKETS.items():
    public = any(s.get("Principal") == "*" and s["Effect"] == "Allow" for s in pol["Statement"])
    print(f"   policy finding for bucket {name:<12}", "publicly accessible" if public else "no issue")

# ---------- 5. Bedrock retention: effective mode and model availability ----------
ORDER = {"none": 0, "default": 1, "aws_review": 2, "provider_data_share": 3}
def effective(project, account, model_default):
    return next(m for m in (project, account, model_default) if m != "inherit")
def available(mode, allowed_modes):                       # at or above the least permissive mode the model accepts
    return ORDER[mode] >= min(ORDER[a] for a in allowed_modes)
MODELS = {"model-x (needs review)": ["aws_review", "provider_data_share"], "model-y (allows none)": ["none", "default", "aws_review", "provider_data_share"]}
print("5) retention")
for project, account in [("inherit", "none"), ("aws_review", "none"), ("inherit", "aws_review"), ("inherit", "inherit")]:
    mode = effective(project, account, "default")
    print(f"   project={project:<11} account={account:<11} -> effective {mode:<11}", {m: ("available" if available(mode, a) else "unavailable") for m, a in MODELS.items()})
def scp_allows_set(mode, required="none"):
    return mode == required
print("   SCP 'only none': setting aws_review allowed?", scp_allows_set("aws_review"), "| setting none allowed?", scp_allows_set("none"))
```

### 8.9 Captured output
Generated on 2026-10-26 by extracting the block above from this file and running it (Python 3). It models documented behavior with made-up data and a **toy** cipher; it is **not** KMS, Secrets Manager, Macie or Bedrock output.
```text lab-out
1) envelope encryption
   stored object is 60 bytes; wrapped data key uses KMS material version 1
   after rotation, old data still decrypts: claim 123: patient is allergic to penicillin
   new data keys use version 2 | the old wrapped key still says version 1 (rotation does not re-wrap data keys)
   after ReEncrypt the wrapped key says version 2 and the data blob is unchanged: True
   modified ciphertext: tamper detected
2) KMS access decisions
   key policy names the role                     ALLOW
   IAM allows, key policy enables IAM            ALLOW (via IAM policy, enabled by the key policy)
   IAM allows, key policy does NOT enable IAM    DENY (no permission)
   grant exists                                  ALLOW
   IAM deny beats key policy allow               DENY (explicit deny)
   nobody allowed                                DENY (no permission)
3) rotation
   before: pw-1 | application login works: True
    ['create_secret: ok', 'set_secret: ok', 'test_secret: ok', 'finish_secret: ok']
   after:  pw-2 | labels: {'AWSCURRENT': 'token-2', 'AWSPREVIOUS': 'token-1'} | login works: True
   failure in set_secret keeps AWSCURRENT: set_secret: FAILED | current: pw-2
4) sensitive data findings
   s3://kb-source/faq.txt             clean
   s3://kb-source/claim-77.txt        ['claim_number', 'email', 'us_phone']
   s3://kb-source/deploy-notes.txt    ['aws_access_key']
   policy finding for bucket kb-source    no issue
   policy finding for bucket public-docs  publicly accessible
5) retention
   project=inherit     account=none        -> effective none        {'model-x (needs review)': 'unavailable', 'model-y (allows none)': 'available'}
   project=aws_review  account=none        -> effective aws_review  {'model-x (needs review)': 'available', 'model-y (allows none)': 'available'}
   project=inherit     account=aws_review  -> effective aws_review  {'model-x (needs review)': 'available', 'model-y (allows none)': 'available'}
   project=inherit     account=inherit     -> effective default     {'model-x (needs review)': 'unavailable', 'model-y (allows none)': 'available'}
   SCP 'only none': setting aws_review allowed? False | setting none allowed? True
```

### 8.10 Explanation
- Part 1: the data key is thrown away after use; rotation adds key material but does not touch stored ciphertext or already wrapped data keys; `ReEncrypt` re-wraps the data key without touching the data; a modified blob fails authentication.
- Part 2: the same rules as the key-policy page: the key policy is the gate; IAM policies work only if the key policy enables them; an explicit deny always wins.
- Part 3: during rotation the application's `AWSCURRENT` credential keeps working until the final step swaps labels; a failed step leaves the current secret untouched.
- Part 4: managed and custom identifiers, an allow list, and a bucket-policy finding.
- Part 5: retention resolution and availability follow the ordering rule; the project setting wins when it is not `inherit`.

### 8.11 Optional AWS lab (shown, not run against AWS ❌)
1. **KMS:** console → Key Management Service → **Create key** (symmetric, encrypt/decrypt), add an alias, note the default key policy statements, enable **automatic rotation**.
2. Use the CLI: `aws kms generate-data-key --key-id alias/<alias> --key-spec AES_256` and `aws kms decrypt --ciphertext-blob fileb://...` to see the two copies of the data key (shape of the commands ✅ from the KMS operations named on the pages; flags ❌ not verified).
3. Create an S3 bucket with **SSE-KMS** using the key; upload a file; remove the role's `kms:Decrypt` and confirm the download fails.
4. **Secrets Manager:** create a secret, read it from a Lambda with its role, then configure **rotation** with a template function (if the secret is for a database you own); watch the rotation steps in CloudWatch Logs ✅.
5. **Macie:** enable Macie in a sandbox Region; create a **sensitive data discovery job** for a bucket containing fake test data; review findings; send to EventBridge.
6. **Bedrock retention:** with the control-plane API `GET /data-retention` check the mode (shape on the page ✅; do not change production settings).
7. Schedule the key for deletion (with the minimum waiting period), delete the secret, disable Macie and delete the bucket.

### 8.12 Common errors
| Error | Cause | Fix |
|---|---|---|
| `AccessDeniedException` from KMS | Key policy does not allow the caller or enable IAM ✅ | Fix the key policy |
| Bedrock job fails with a KMS error | The service principal lacks permission on the customer key 🟡 | Add the key-policy statements from the Bedrock pages ❌ not read |
| Rotation never succeeds | Lambda cannot reach DB or Secrets Manager; wrong permissions ✅ | Network and permission fixes |
| Application broke after rotation | App cached an old secret | Refresh on failure; use `AWSCURRENT` |
| Macie finds nothing | Bucket or object type not analyzable; wrong Region | Check inventory settings and Region |
| Model "unavailable" | Retention mode below the model's requirement ✅ | Choose another model or change the mode on purpose |
| Region mismatch | Key and resource in different Regions ✅ | Same Region (or a multi-Region key) |

### 8.13 Security recommendations
Prefer customer managed keys for regulated data and write minimal key policies; separate key administrators from key users; keep deletion waiting periods; enable rotation; log KMS events; store secrets only in Secrets Manager and rotate them; use VPC endpoints for KMS and Secrets Manager; run Macie on ingestion buckets; mask before logging; set retention mode deliberately and enforce with SCPs ✅; never put credentials or sensitive data in tags, names or prompts ✅.

## 9. What can go wrong?
| Failure | Why | Symptoms | Investigate | Fix | Prevent |
|---|---|---|---|---|---|
| **Locked-out key** | Key policy removed account access | Nobody can use or manage the key | Key policy history, CloudTrail | Support/root recovery path 🟡 | Keep the default statement |
| **Deleted key** | Scheduled deletion completed | Data unreadable | CloudTrail | None after deletion | Waiting period, alarms on `ScheduleKeyDeletion` |
| **Secret leak** | Secret in code or logs | Unknown access | Macie, GuardDuty, logs | Rotate now | Secrets Manager + log masking ([07/03](aip:07-governance-qa/03-cloudwatch-logs-alarms-rum-and-genai-observability)) |
| **Rotation outage** | Lambda/DB mismatch | Auth errors | Rotation logs | Fix and retry | Test rotation in staging |
| **Unscanned source data** | No Macie before ingestion | PII in the knowledge base | Macie findings | Remove and re-ingest | Gate ingestion pipeline |
| **Model unavailable** | Retention mode too strict | `ValidationException` ✅ | Retention config | Pick compatible model | Check `allowed_modes` first |
| **Cost surprise** | Many keys and API calls | Higher bill | Cost Explorer | Consolidate | Use caching in apps, S3 bucket keys 🟡 |

## 10. Common misconceptions
1. **"Rotating a KMS key re-encrypts my data."** It does not ✅.
2. **"IAM alone controls KMS."** The key policy must allow or enable IAM ✅.
3. **"AWS owned keys can be audited."** They cannot ✅.
4. **"Macie scans databases."** S3 only ✅.
5. **"Model providers see my prompts on Bedrock."** They have no access to the deployment accounts ✅.
6. **"Zero retention is automatic for every model."** Models differ; some require retention ✅.
7. **"Secrets Manager stores AWS credentials best."** Use roles instead ✅.

## 11. Exam notes
- **Patterns:** "control and audit encryption keys" → customer managed KMS key; "rotate DB passwords automatically" → Secrets Manager rotation; "find PII in S3" → Macie; "encrypt a custom model/KB with my key" → KMS key on the job/data source; "providers must not see data" → deployment accounts; "restrict retention" → SCP on `DataRetentionMode`.
- **Keywords:** envelope encryption, data key, key policy, grant, alias, rotation, `AWSCURRENT`, managed data identifier, allow list, `aws_review`, `inherit`.
- **Traps:** IAM-only KMS access; assuming rotation re-encrypts; using Macie for non-S3; storing secrets in environment variables; thinking AWS managed keys can be customized.
- **Compare:** KMS vs Secrets Manager vs Parameter Store (not read ❌) vs ACM; Macie vs Comprehend vs Guardrails vs CloudWatch data protection; SSE-S3 vs SSE-KMS.

## 12. Summary and revision cards
- KMS: key policy is primary; rotation optional (365 days default) for customer managed symmetric keys; AWS managed keys rotate yearly; envelope encryption.
- Secrets Manager: rotation by Lambda (four steps) or managed; encrypted with KMS.
- Macie: S3 sensitive data + bucket policy findings; EventBridge/Security Hub.
- Bedrock: your KMS keys for custom models, agents, KB, evaluations; retention modes none < default < aws_review.

**Cards.** Q: Default automatic rotation period? A: 365 days. · Q: Rotation steps? A: create, set, test, finish. · Q: Retention order? A: none < default < aws_review < provider_data_share.

## 13. References
| Source | URL | Verified |
|---|---|---|
| KMS overview, concepts, rotation, key policies | https://docs.aws.amazon.com/kms/latest/developerguide/overview.html · .../concepts.html · .../rotate-keys.html · .../key-policies.html | 2026-10-26 |
| Secrets Manager intro, rotation | https://docs.aws.amazon.com/secretsmanager/latest/userguide/intro.html · .../rotating-secrets.html · .../rotate-secrets_lambda.html | 2026-10-26 |
| What is Macie | https://docs.aws.amazon.com/macie/latest/user/what-is-macie.html | 2026-10-26 |
| Bedrock data protection and encryption | https://docs.aws.amazon.com/bedrock/latest/userguide/data-protection.html · .../data-encryption.html | 2026-10-26 |
| Bedrock data retention | https://docs.aws.amazon.com/bedrock/latest/userguide/data-retention.html | 2026-10-26 |

**Unverified here:** KMS grants details, quotas, custom rotation-period range, key deletion waiting period, key-policy statements Bedrock requires, KMS and Macie IAM actions, Secrets Manager version labels and size limit, Parameter Store comparison, cross-Region secret replication, Macie Regions and prices, original encryption-101 course text.

## 14. Answers to checkpoints and practice questions
**Checkpoints.** 1) Data is encrypted with a data key, and that data key is encrypted by a KMS key; the encrypted data key is stored with the data ✅. 2) It still decrypts: KMS keeps old key material and uses the right version automatically ✅. 3) Only when the key policy enables IAM policies (as the default key policy does) ✅. 4) Amazon S3 (general purpose buckets) ✅. 5) `none` (first non-inherit value from project to account) ✅.

**Practice questions.**
- **Q1 → A.** Control, audit and disable are customer-managed key capabilities ✅.
- **Q2 → A, C.** B false (same key ID); D false; E false (cannot change) ✅.
- **Q3 → A.** ✅
- **Q4 → A.** Rotation without code changes ✅.
- **Q5 → A, B.** C, D, E false ✅.
- **Q6 → A.** ✅
- **Q7 → A.** ✅
- **Q8 → A.** ✅
