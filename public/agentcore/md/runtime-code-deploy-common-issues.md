# Troubleshooting direct code deployment - Amazon Bedrock AgentCore

Source: https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/runtime-code-deploy-common-issues.html

---

# Troubleshooting direct code deployment

Common issues and solutions when getting started with Amazon Bedrock AgentCore direct code deployment. For more troubleshooting information, see [Troubleshoot Amazon Bedrock AgentCore Runtime](<https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/runtime-troubleshooting.html>).

## AccessDenied: Insufficient S3 permissions

**When this occurs:** During agent creation or update with zipped artifact in S3 via console, SDK, or CLI

**Why this happens:** The role used to call Create/UpdateAgentRuntime does not have s3:GetObject permissions on S3 uri passed in the API input.

**Solution:** Add s3:GetObject permission in role used to call the Agentcore Runtime create/update API.

```json
{
"Version": "2012-10-17",
  "Statement": [
    {
        "Effect": "Allow",
        "Action": "s3:GetObject",
        "Resource": "arn:aws:s3:::your-bucket-name/*"
    }
  ]
}
```
## AccessDenied: CMK encrypted S3 object access

**When this occurs:** During agent creation with CMK-encrypted S3 objects when the execution role lacks KMS decrypt permissions.

**Why this happens:** The role used to call Create/UpdateAgentRuntime does not have kms:Decrypt permissions on the CMK used to encrypt the S3 object containing the agent code.

**Solution:** Add kms:Decrypt permission to the role for the specific CMK:

```json
{
"Version": "2012-10-17",
  "Statement": [
    {
        "Effect": "Allow",
        "Action": [
            "s3:GetObject",
            "kms:Decrypt"
        ],
        "Resource": [
            "arn:aws:s3:::your-bucket-name/*",
            "arn:aws:kms:us-west-2:your-account:key/your-cmk-key-id"
        ]
    }
  ]
}
```
## CREATE_FAILED: Code package compatibility

**When this occurs:** During agent creation or update with incompatible code packages (wrong architecture, language version, or package format).

**Why this happens:** The uploaded ZIP file contains binaries compiled for wrong architecture (ARM64 vs x86_64), incompatible language version, or incorrect package structure that doesn’t match AgentCore Runtime requirements.

**Solution:**

To resolve this issue:

  1. Ensure code is compiled for arm64.

  2. Use compatible language version (check AgentCore Runtime supported versions).

  3. Verify ZIP structure contains proper entry points and dependencies.

  4. Rebuild packages on compatible runtime environment.


**Error indicators:**

  * Agent status: CREATE_FAILED or runtime errors

  * Import errors or "cannot execute binary file" messages in cloudwatch logs

  * Architecture mismatch errors when you do getAgentRuntimeEndpoint.


## ARM64 Binary Incompatibility

**When this occurs:** During agent creation when your ZIP contains native binaries compiled for a non-ARM64 architecture.

**Why this happens:** AgentCore Runtime only supports the arm64 instruction set architecture. The service scans all native binary files in your deployment package — `.so` files for Python and both `.so` and `.node` files for Node.js — and validates their ELF headers for ARM64 compatibility. If any binary is compiled for x86_64, macOS (Mach-O), or another architecture, validation fails.

**Solution:**

  * **Python:** Use `uv pip install --python-platform aarch64-manylinux2014 --only-binary=:all:` to download arm64-compatible wheels.

  * **Node.js:** Install native modules on an arm64 machine or use `npm install --arch=arm64 --platform=linux` .

  * Alternatively, build your dependencies on an AWS Graviton-based Amazon EC2 instance to ensure arm64 compatibility.


**Error indicator:** `"Your artifact contains binary files that are incompatible with Linux ARM64."`

## Missing Entry Point

**When this occurs:** During agent creation when the specified entry point file does not exist in your ZIP.

**Why this happens:** The entry point file path you specified in the `entryPoint` configuration does not match any file in the deployment package. This can happen if the file was not included in the ZIP, the path is misspelled, or the ZIP structure differs from what you expected.

**Solution:**

  * Verify the entry point file exists in your ZIP: `unzip -l deployment_package.zip | grep app.js`

  * Ensure the path in `entryPoint` matches the file path within the ZIP (including any subdirectories like `src/app.js` or `dist/index.js` )

  * For Python agents, the entry point must end with `.py` ; for Node.js agents, it must end with `.js`


**Error indicator:** `"The specified entrypoint could not be found or accessed in your artifact."`

## Node.js Incompatible engines.node Declaration

**When this occurs:** During Node.js agent creation when your `package.json` or a common dependency declares an `engines.node` range that excludes the target Node.js version.

**Why this happens:** AgentCore Runtime checks the `engines.node` field in your root `package.json` and in common dependencies. If the version range excludes the target Node.js version (for example, `<18` or `>=14 <18` when deploying to Node.js 22), the agent creation fails.

**Solution:**

  * Update the `engines.node` field in your `package.json` to include the target Node.js version (for example, `">=18"` )

  * Update any incompatible dependencies to a version that supports the target Node.js version

  * Remove the `engines` field if it is not required


**Error indicator:** `"Your artifact contains dependencies with engines.node declarations incompatible with the target Node.js version."`

## Node.js Missing OTEL Package

**When this occurs:** During Node.js agent creation when you specify `opentelemetry-instrument` in the entry point but the ADOT package is not included in the ZIP.

**Why this happens:** When you use `"entryPoint": ["opentelemetry-instrument", "app.js"]` , AgentCore Runtime expects the `@aws/aws-distro-opentelemetry-node-autoinstrumentation` npm package to be present in `node_modules/` within your deployment package.

**Solution:**

Install the ADOT package before packaging your ZIP:

```bash
npm install @aws/aws-distro-opentelemetry-node-autoinstrumentation
zip -r deployment_package.zip app.js node_modules/ package.json
```
Alternatively, remove the `opentelemetry-instrument` prefix from your entry point if you don’t need auto-instrumentation.

**Error indicator:** `"OpenTelemetry instrumentation executable not found. The ZIP file requires open-telemetry dependencies, but none are present."`

