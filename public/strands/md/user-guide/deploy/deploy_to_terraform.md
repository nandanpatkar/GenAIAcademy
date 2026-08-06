This guide covers deploying Strands agents using Terraform infrastructure as code. Terraform enables consistent, repeatable deployments across AWS, Google Cloud, Azure, and other cloud providers.

Terraform supports multiple deployment targets. This deploy example illustates four deploy options from different Cloud Service Providers:

-   **[AWS App Runner](#step-2-cloud-deployment-setup)** - Simple containerized deployment with automatic scaling
-   **[AWS Lambda](#step-2-cloud-deployment-setup)** - Serverless functions for event-driven workloads
-   **[Google Cloud Run](#step-2-cloud-deployment-setup)** - Fully managed serverless containers
-   **[Azure Container Instances](#step-2-cloud-deployment-setup)** - Simple container deployment

## Prerequisites

-   **Docker deployment guide completed** - You must have a working containerized agent before proceeding:
    -   [Python Docker guide](lc:user-guide/deploy/deploy_to_docker/python)
    -   [TypeScript Docker guide](https://strandsagents.com/docs/user-guide/deploy/deploy_to_docker/typescript/)
-   [Terraform](https://www.terraform.io/downloads.html) installed
-   Cloud provider CLI configured:
    -   AWS: [AWS CLI credentials](https://docs.aws.amazon.com/cli/latest/userguide/cli-chap-getting-started.html)
    -   GCP: [gcloud CLI](https://cloud.google.com/sdk/docs/install)
    -   Azure: [Azure CLI](https://docs.microsoft.com/en-us/cli/azure/install-azure-cli)

## Step 1: Container Registry Deployment

Cloud deployment requires your containerized agent to be available in a container registry. The following assumes you have completed the [Docker deployment guide](lc:user-guide/deploy/deploy_to_docker) and pushed your image to the appropriate registry:

**Docker Tutorial Project Structure:**

Project Structure (Python):

```plaintext
my-python-app/
├── agent.py                # FastAPI application (from Docker tutorial)
├── Dockerfile              # Container configuration (from Docker tutorial)
├── pyproject.toml          # Created by uv init
├── uv.lock                 # Created automatically by uv
```

Project Structure (TypeScript):

```plaintext
my-typescript-app/
├── index.ts                # Express application (from Docker tutorial)
├── Dockerfile              # Container configuration (from Docker tutorial)
├── package.json            # Created by npm init
├── tsconfig.json           # TypeScript configuration
├── package-lock.json       # Created automatically by npm
```

**Deploy-specific Docker configurations**

```sa-tabs
[
 {
  "label": "AWS App Runner",
  "body": "**Image Requirements:**\n\n-   Standard Docker images supported\n\n**Container Registry Requirements:**\n\n-   Amazon Elastic Container Registry ([See documentation to push Docker image to ECR](https://docs.aws.amazon.com/AmazonECR/latest/userguide/docker-push-ecr-image.html))\n\n**Docker Deployment Guide Modifications:**\n\n-   No special base image required (standard Docker images work)\n-   Ensure your app listens on port 8080 (or configure port in terraform)\n-   Build with: `docker build --platform linux/amd64 -t my-agent .`"
 },
 {
  "label": "AWS Lambda",
  "body": "**Image Requirements:**\n\n-   Must use Lambda-compatible base images:\n    -   Python: `public.ecr.aws/lambda/python:3.11`\n    -   TypeScript/Node.js: `public.ecr.aws/lambda/nodejs:20`\n\n**Container Registry Requirements:**\n\n-   Amazon Elastic Container Registry ([See documentation to push Docker image to ECR](https://docs.aws.amazon.com/AmazonECR/latest/userguide/docker-push-ecr-image.html))\n\n**Docker Deployment Guide Modifications:**\n\n-   Update Dockerfile base image to Lambda-compatible version\n-   Change CMD to Lambda handler format: `CMD [\"index.handler\"]` or `CMD [\"app.lambda_handler\"]`\n-   Build with Lambda flags: `docker build --platform linux/amd64 --provenance=false --sbom=false -t my-agent .`\n-   Add Lambda handler to your code:\n    -   **Python FastAPI (Recommended):** Use [Mangum](https://mangum.io/): `lambda_handler = Mangum(app)`\n    -   **Manual handlers:** Accept `(event, context)` parameters and return Lambda-compatible responses\n\n**Lambda Handler Examples:**\n\nPython with Mangum:\n\n```python\nfrom mangum import Mangum\nfrom your_app import app  # Your existing FastAPI app\n\nlambda_handler = Mangum(app)\n```\n\nTypeScript:\n\n```typescript\nexport const handler = async (event: any, context: any) => {\n    // Your existing agent logic here\n    return {\n        statusCode: 200,\n        body: JSON.stringify({ message: \"Agent response\" })\n    };\n};\n```\n\nPython:\n\n```python\ndef lambda_handler(event, context):\n    # Your existing agent logic here\n    return {\n        'statusCode': 200,\n        'body': json.dumps({'message': 'Agent response'})\n    }\n```"
 },
 {
  "label": "Google Cloud Run",
  "body": "**Image Requirements:**\n\n-   Standard Docker images supported\n\n**Container Registry Requirements:**\n\n-   Google Artifact Registry ([See documentation to push Docker image to GAR](https://cloud.google.com/container-registry/docs/pushing-and-pulling))\n\n**Docker Deployment Guide Modifications:**\n\n-   No special base image required (standard Docker images work)\n-   Ensure your app listens on the port specified by `PORT` environment variable\n-   Build with: `docker build --platform linux/amd64 -t my-agent .`"
 },
 {
  "label": "Azure Container Instances",
  "body": "**Image Requirements:**\n\n-   Standard Docker images supported\n\n**Container Registry Requirements:**\n\n-   Azure Container Registry ([See documentation to push Docker image to ACR](https://docs.microsoft.com/en-us/azure/container-registry/container-registry-get-started-docker-cli))\n\n**Docker Deployment Guide Modifications:**\n\n-   No special base image required (standard Docker images work)\n-   Ensure your app exposes the correct port (typically 8080)\n-   Build with: `docker build --platform linux/amd64 -t my-agent .`"
 }
]
```

## Step 2: Cloud Deployment Setup

```sa-tabs
[
 {
  "label": "AWS App Runner",
  "body": "**Optional: Open AWS App Runner Setup All-in-One Bash Command**  \nCopy and paste this bash script to create all necessary terraform files and skip remaining \u201cCloud Deployment Setup\u201d steps below:\n\n```bash\ngenerate_aws_apprunner_terraform() {\n    mkdir -p terraform\n\n    # Generate main.tf\n    cat > terraform/main.tf << 'EOF'\nterraform {\n  required_providers {\n    aws = {\n      source  = \"hashicorp/aws\"\n      version = \"~> 5.0\"\n    }\n  }\n}\n\nprovider \"aws\" {\n  region = var.aws_region\n}\n\nresource \"aws_iam_role\" \"apprunner_ecr_access_role\" {\n  name = \"apprunner-ecr-access-role\"\n\n  assume_role_policy = jsonencode({\n    Version = \"2012-10-17\"\n    Statement = [\n      {\n        Action = \"sts:AssumeRole\"\n        Effect = \"Allow\"\n        Principal = {\n          Service = \"build.apprunner.amazonaws.com\"\n        }\n      }\n    ]\n  })\n}\n\nresource \"aws_iam_role_policy_attachment\" \"apprunner_ecr_access_policy\" {\n  role       = aws_iam_role.apprunner_ecr_access_role.name\n  policy_arn = \"arn:aws:iam::aws:policy/service-role/AWSAppRunnerServicePolicyForECRAccess\"\n}\n\nresource \"aws_apprunner_service\" \"agent\" {\n  service_name = \"strands-agent-v4\"\n\n  source_configuration {\n    image_repository {\n      image_identifier      = var.agent_image\n      image_configuration {\n        port = \"8080\"\n        runtime_environment_variables = {\n          OPENAI_API_KEY = var.openai_api_key\n        }\n      }\n      image_repository_type = \"ECR\"\n    }\n    auto_deployments_enabled = false\n    authentication_configuration {\n      access_role_arn = aws_iam_role.apprunner_ecr_access_role.arn\n    }\n  }\n\n  instance_configuration {\n    cpu    = \"0.25 vCPU\"\n    memory = \"0.5 GB\"\n  }\n}\nEOF\n\n    # Generate variables.tf\n    cat > terraform/variables.tf << 'EOF'\nvariable \"aws_region\" {\n  description = \"AWS region\"\n  type        = string\n  default     = \"us-east-1\"\n}\n\nvariable \"agent_image\" {\n  description = \"Container image for Strands agent\"\n  type        = string\n}\n\nvariable \"openai_api_key\" {\n  description = \"OpenAI API key\"\n  type        = string\n  sensitive   = true\n}\nEOF\n\n    # Generate outputs.tf\n    cat > terraform/outputs.tf << 'EOF'\noutput \"agent_url\" {\n  description = \"AWS App Runner service URL\"\n  value       = aws_apprunner_service.agent.service_url\n}\nEOF\n\n    # Generate terraform.tfvars template\n    cat > terraform/terraform.tfvars << 'EOF'\nagent_image = \"your-account.dkr.ecr.us-east-1.amazonaws.com/my-image:latest\"\nopenai_api_key = \"<your-openai-api-key>\"\nEOF\n\n    echo \"\u2705 AWS App Runner Terraform files generated in terraform/ directory\"\n}\n\ngenerate_aws_apprunner_terraform\n```\n\n**Step by Step Guide**\n\nCreate terraform directory\n\n```bash\nmkdir terraform\ncd terraform\n```\n\nCreate `main.tf`\n\n```hcl\nterraform {\n  required_providers {\n    aws = {\n      source  = \"hashicorp/aws\"\n      version = \"~> 5.0\"\n    }\n  }\n}\n\nprovider \"aws\" {\n  region = var.aws_region\n}\n\nresource \"aws_iam_role\" \"apprunner_ecr_access_role\" {\n  name = \"apprunner-ecr-access-role\"\n\n  assume_role_policy = jsonencode({\n    Version = \"2012-10-17\"\n    Statement = [\n      {\n        Action = \"sts:AssumeRole\"\n        Effect = \"Allow\"\n        Principal = {\n          Service = \"build.apprunner.amazonaws.com\"\n        }\n      }\n    ]\n  })\n}\n\nresource \"aws_iam_role_policy_attachment\" \"apprunner_ecr_access_policy\" {\n  role       = aws_iam_role.apprunner_ecr_access_role.name\n  policy_arn = \"arn:aws:iam::aws:policy/service-role/AWSAppRunnerServicePolicyForECRAccess\"\n}\n\nresource \"aws_apprunner_service\" \"agent\" {\n  service_name = \"strands-agent-v4\"\n\n  source_configuration {\n    image_repository {\n      image_identifier      = var.agent_image\n      image_configuration {\n        port = \"8080\"\n        runtime_environment_variables = {\n          OPENAI_API_KEY = var.openai_api_key\n        }\n      }\n      image_repository_type = \"ECR\"\n    }\n    auto_deployments_enabled = false\n    authentication_configuration {\n      access_role_arn = aws_iam_role.apprunner_ecr_access_role.arn\n    }\n  }\n\n  instance_configuration {\n    cpu    = \"0.25 vCPU\"\n    memory = \"0.5 GB\"\n  }\n}\n```\n\nCreate `variables.tf`\n\n```hcl\nvariable \"aws_region\" {\n  description = \"AWS region\"\n  type        = string\n  default     = \"us-east-1\"\n}\n\nvariable \"agent_image\" {\n  description = \"Container image for Strands agent\"\n  type        = string\n}\n\nvariable \"openai_api_key\" {\n  description = \"OpenAI API key\"\n  type        = string\n  sensitive   = true\n}\n```\n\nCreate `outputs.tf`\n\n```hcl\noutput \"agent_url\" {\n  description = \"AWS App Runner service URL\"\n  value       = aws_apprunner_service.agent.service_url\n}\n```"
 },
 {
  "label": "AWS Lambda",
  "body": "**Optional: Open AWS Lambda Setup All-in-One Bash Command**  \nCopy and paste this bash script to create all necessary terraform files and skip remaining \u201cCloud Deployment Setup\u201d steps below:\n\n```bash\ngenerate_aws_lambda_terraform() {\n    mkdir -p terraform\n\n    # Generate main.tf\n    cat > terraform/main.tf << 'EOF'\nterraform {\n  required_providers {\n    aws = {\n      source  = \"hashicorp/aws\"\n      version = \"~> 5.0\"\n    }\n  }\n}\n\nprovider \"aws\" {\n  region = var.aws_region\n}\n\nresource \"aws_lambda_function\" \"agent\" {\n  function_name = \"strands-agent\"\n  role          = aws_iam_role.lambda.arn\n  image_uri     = var.agent_image\n  package_type  = \"Image\"\n  architectures = [\"x86_64\"]\n  timeout       = 30\n  memory_size   = 512\n\n  environment {\n    variables = {\n      OPENAI_API_KEY = var.openai_api_key\n    }\n  }\n}\n\nresource \"aws_lambda_function_url\" \"agent\" {\n  function_name      = aws_lambda_function.agent.function_name\n  authorization_type = \"NONE\"\n}\n\nresource \"aws_iam_role\" \"lambda\" {\n  name = \"strands-agent-lambda-role\"\n  assume_role_policy = jsonencode({\n    Version = \"2012-10-17\"\n    Statement = [{\n      Action = \"sts:AssumeRole\"\n      Effect = \"Allow\"\n      Principal = {\n        Service = \"lambda.amazonaws.com\"\n      }\n    }]\n  })\n}\n\nresource \"aws_iam_role_policy_attachment\" \"lambda\" {\n  role       = aws_iam_role.lambda.name\n  policy_arn = \"arn:aws:iam::aws:policy/service-role/AWSLambdaBasicExecutionRole\"\n}\nEOF\n\n    # Generate variables.tf\n    cat > terraform/variables.tf << 'EOF'\nvariable \"aws_region\" {\n  description = \"AWS region\"\n  type        = string\n  default     = \"us-east-1\"\n}\n\nvariable \"agent_image\" {\n  description = \"Container image for Strands agent\"\n  type        = string\n}\n\nvariable \"openai_api_key\" {\n  description = \"OpenAI API key\"\n  type        = string\n  sensitive   = true\n}\nEOF\n\n    # Generate outputs.tf\n    cat > terraform/outputs.tf << 'EOF'\noutput \"agent_url\" {\n  description = \"AWS Lambda function URL\"\n  value       = aws_lambda_function_url.agent.function_url\n}\nEOF\n\n    # Generate terraform.tfvars template\n    cat > terraform/terraform.tfvars << 'EOF'\nagent_image = \"your-account.dkr.ecr.us-east-1.amazonaws.com/my-image:latest\"\nopenai_api_key = \"<your-openai-api-key>\"\nEOF\n\n    echo \"\u2705 AWS Lambda Terraform files generated in terraform/ directory\"\n}\n\ngenerate_aws_lambda_terraform\n```\n\n**Step by Step Guide**\n\nCreate terraform directory\n\n```bash\nmkdir terraform\ncd terraform\n```\n\nCreate `main.tf`\n\n```hcl\nterraform {\n  required_providers {\n    aws = {\n      source  = \"hashicorp/aws\"\n      version = \"~> 5.0\"\n    }\n  }\n}\n\nprovider \"aws\" {\n  region = var.aws_region\n}\n\nresource \"aws_lambda_function\" \"agent\" {\n  function_name = \"strands-agent\"\n  role          = aws_iam_role.lambda.arn\n  image_uri     = var.agent_image\n  package_type  = \"Image\"\n  architectures = [\"x86_64\"]\n  timeout       = 30\n  memory_size   = 512\n\n  environment {\n    variables = {\n      OPENAI_API_KEY = var.openai_api_key\n    }\n  }\n}\n\nresource \"aws_lambda_function_url\" \"agent\" {\n  function_name      = aws_lambda_function.agent.function_name\n  authorization_type = \"NONE\"\n}\n\nresource \"aws_iam_role\" \"lambda\" {\n  name = \"strands-agent-lambda-role\"\n  assume_role_policy = jsonencode({\n    Version = \"2012-10-17\"\n    Statement = [{\n      Action = \"sts:AssumeRole\"\n      Effect = \"Allow\"\n      Principal = {\n        Service = \"lambda.amazonaws.com\"\n      }\n    }]\n  })\n}\n\nresource \"aws_iam_role_policy_attachment\" \"lambda\" {\n  role       = aws_iam_role.lambda.name\n  policy_arn = \"arn:aws:iam::aws:policy/service-role/AWSLambdaBasicExecutionRole\"\n}\n```\n\nCreate `variables.tf`\n\n```hcl\nvariable \"aws_region\" {\n  description = \"AWS region\"\n  type        = string\n  default     = \"us-east-1\"\n}\n\nvariable \"agent_image\" {\n  description = \"Container image for Strands agent\"\n  type        = string\n}\n\nvariable \"openai_api_key\" {\n  description = \"OpenAI API key\"\n  type        = string\n  sensitive   = true\n}\n```\n\nCreate `outputs.tf`\n\n```hcl\noutput \"agent_url\" {\n  description = \"AWS Lambda function URL\"\n  value       = aws_lambda_function_url.agent.function_url\n}\n```"
 },
 {
  "label": "Google Cloud Run",
  "body": "**Optional: Open Google Cloud Run Setup All-in-One Bash Command**  \nCopy and paste this bash script to create all necessary terraform files and skip remaining \u201cCloud Deployment Setup\u201d steps below:\n\n```bash\ngenerate_google_cloud_run_terraform() {\n    mkdir -p terraform\n\n    # Generate main.tf\n    cat > terraform/main.tf << 'EOF'\nterraform {\n  required_providers {\n    google = {\n      source  = \"hashicorp/google\"\n      version = \"~> 4.0\"\n    }\n  }\n}\n\nprovider \"google\" {\n  project = var.gcp_project\n  region  = var.gcp_region\n}\n\nresource \"google_cloud_run_service\" \"agent\" {\n  name     = \"strands-agent\"\n  location = var.gcp_region\n\n  template {\n    spec {\n      containers {\n        image = var.agent_image\n        env {\n          name  = \"OPENAI_API_KEY\"\n          value = var.openai_api_key\n        }\n      }\n    }\n  }\n}\n\nresource \"google_cloud_run_service_iam_member\" \"public\" {\n  service  = google_cloud_run_service.agent.name\n  location = google_cloud_run_service.agent.location\n  role     = \"roles/run.invoker\"\n  member   = \"allUsers\"\n}\nEOF\n\n    # Generate variables.tf\n    cat > terraform/variables.tf << 'EOF'\nvariable \"gcp_project\" {\n  description = \"GCP project ID\"\n  type        = string\n}\n\nvariable \"gcp_region\" {\n  description = \"GCP region\"\n  type        = string\n  default     = \"us-central1\"\n}\n\nvariable \"agent_image\" {\n  description = \"Container image for Strands agent\"\n  type        = string\n}\n\nvariable \"openai_api_key\" {\n  description = \"OpenAI API key\"\n  type        = string\n  sensitive   = true\n}\nEOF\n\n    # Generate outputs.tf\n    cat > terraform/outputs.tf << 'EOF'\noutput \"agent_url\" {\n  description = \"Google Cloud Run service URL\"\n  value       = google_cloud_run_service.agent.status[0].url\n}\nEOF\n\n    # Generate terraform.tfvars template\n    cat > terraform/terraform.tfvars << 'EOF'\ngcp_project = \"<your-project-id>\"\nagent_image = \"gcr.io/your-project/my-image:latest\"\nopenai_api_key = \"<your-openai-api-key>\"\nEOF\n\n    echo \"\u2705 Google Cloud Run Terraform files generated in terraform/ directory\"\n}\n\ngenerate_google_cloud_run_terraform\n```\n\n**Step by Step Guide**\n\nCreate terraform directory\n\n```bash\nmkdir terraform\ncd terraform\n```\n\nCreate `main.tf`\n\n```hcl\nterraform {\n  required_providers {\n    google = {\n      source  = \"hashicorp/google\"\n      version = \"~> 4.0\"\n    }\n  }\n}\n\nprovider \"google\" {\n  project = var.gcp_project\n  region  = var.gcp_region\n}\n\nresource \"google_cloud_run_service\" \"agent\" {\n  name     = \"strands-agent\"\n  location = var.gcp_region\n\n  template {\n    spec {\n      containers {\n        image = var.agent_image\n        env {\n          name  = \"OPENAI_API_KEY\"\n          value = var.openai_api_key\n        }\n        env {\n          name  = \"GOOGLE_GENAI_USE_VERTEXAI\"\n          value = \"false\"\n        }\n        env {\n          name  = \"GOOGLE_API_KEY\"\n          value = var.google_api_key\n        }\n      }\n    }\n  }\n}\n\nresource \"google_cloud_run_service_iam_member\" \"public\" {\n  service  = google_cloud_run_service.agent.name\n  location = google_cloud_run_service.agent.location\n  role     = \"roles/run.invoker\"\n  member   = \"allUsers\"\n}\n```\n\nCreate `variables.tf`\n\n```hcl\nvariable \"gcp_project\" {\n  description = \"GCP project ID\"\n  type        = string\n}\n\nvariable \"gcp_region\" {\n  description = \"GCP region\"\n  type        = string\n  default     = \"us-central1\"\n}\n\nvariable \"agent_image\" {\n  description = \"Container image for Strands agent\"\n  type        = string\n}\n\nvariable \"openai_api_key\" {\n  description = \"OpenAI API key\"\n  type        = string\n  sensitive   = true\n}\n\nvariable \"google_api_key\" {\n  description = \"Google API key\"\n  type        = string\n  sensitive   = true\n}\n```\n\nCreate `outputs.tf`\n\n```hcl\noutput \"agent_url\" {\n  description = \"Google Cloud Run service URL\"\n  value       = google_cloud_run_service.agent.status[0].url\n}\n```"
 },
 {
  "label": "Azure Container Instances",
  "body": "**Optional: Open Azure Container Instances Setup All-in-One Bash Command**  \nCopy and paste this bash script to create all necessary terraform files and skip remaining \u201cCloud Deployment Setup\u201d steps below:\n\n```bash\ngenerate_azure_container_instance_terraform() {\n    mkdir -p terraform\n\n    # Generate main.tf\n    cat > terraform/main.tf << 'EOF'\nterraform {\n  required_providers {\n    azurerm = {\n      source  = \"hashicorp/azurerm\"\n      version = \"~> 3.0\"\n    }\n  }\n}\n\nprovider \"azurerm\" {\n  features {}\n}\n\ndata \"azurerm_container_registry\" \"acr\" {\n  name                = var.acr_name\n  resource_group_name = var.acr_resource_group\n}\n\nresource \"azurerm_resource_group\" \"main\" {\n  name     = \"strands-agent\"\n  location = var.azure_location\n}\n\nresource \"azurerm_container_group\" \"agent\" {\n  name                = \"strands-agent\"\n  location            = azurerm_resource_group.main.location\n  resource_group_name = azurerm_resource_group.main.name\n  ip_address_type     = \"Public\"\n  os_type             = \"Linux\"\n\n  image_registry_credential {\n    server   = \"${var.acr_name}.azurecr.io\"\n    username = var.acr_name\n    password = data.azurerm_container_registry.acr.admin_password\n  }\n\n  container {\n    name   = \"agent\"\n    image  = var.agent_image\n    cpu    = \"0.5\"\n    memory = \"1.5\"\n\n    ports {\n      port = 8080\n    }\n\n    environment_variables = {\n      OPENAI_API_KEY = var.openai_api_key\n    }\n  }\n}\nEOF\n\n    # Generate variables.tf\n    cat > terraform/variables.tf << 'EOF'\nvariable \"azure_location\" {\n  description = \"Azure location\"\n  type        = string\n  default     = \"East US\"\n}\n\nvariable \"agent_image\" {\n  description = \"Container image for Strands agent\"\n  type        = string\n}\n\nvariable \"openai_api_key\" {\n  description = \"OpenAI API key\"\n  type        = string\n  sensitive   = true\n}\n\nvariable \"acr_name\" {\n  description = \"Azure Container Registry name\"\n  type        = string\n}\n\nvariable \"acr_resource_group\" {\n  description = \"Azure Container Registry resource group\"\n  type        = string\n}\nEOF\n\n    # Generate outputs.tf\n    cat > terraform/outputs.tf << 'EOF'\noutput \"agent_url\" {\n  description = \"Azure Container Instance URL\"\n  value       = \"http://${azurerm_container_group.agent.ip_address}:8080\"\n}\nEOF\n\n    # Generate terraform.tfvars template\n    cat > terraform/terraform.tfvars << 'EOF'\nagent_image = \"your-registry.azurecr.io/my-image:latest\"\nopenai_api_key = \"<your-openai-api-key>\"\nacr_name = \"<your-acr-name>\"\nacr_resource_group = \"<your-resource-group>\"\nEOF\n\n    echo \"\u2705 Azure Container Instance Terraform files generated in terraform/ directory\"\n}\n\ngenerate_azure_container_instance_terraform\n```\n\n**Step by Step Guide**\n\nCreate terraform directory\n\n```bash\nmkdir terraform\ncd terraform\n```\n\nCreate `main.tf`\n\n```hcl\nterraform {\n  required_providers {\n    azurerm = {\n      source  = \"hashicorp/azurerm\"\n      version = \"~> 3.0\"\n    }\n  }\n}\n\nprovider \"azurerm\" {\n  features {}\n}\n\ndata \"azurerm_container_registry\" \"acr\" {\n  name                = var.acr_name\n  resource_group_name = var.acr_resource_group\n}\n\nresource \"azurerm_resource_group\" \"main\" {\n  name     = \"strands-agent\"\n  location = var.azure_location\n}\n\nresource \"azurerm_container_group\" \"agent\" {\n  name                = \"strands-agent\"\n  location            = azurerm_resource_group.main.location\n  resource_group_name = azurerm_resource_group.main.name\n  ip_address_type     = \"Public\"\n  os_type             = \"Linux\"\n\n  image_registry_credential {\n    server   = \"${var.acr_name}.azurecr.io\"\n    username = var.acr_name\n    password = data.azurerm_container_registry.acr.admin_password\n  }\n\n  container {\n    name   = \"agent\"\n    image  = var.agent_image\n    cpu    = \"0.5\"\n    memory = \"1.5\"\n\n    ports {\n      port = 8080\n    }\n\n    environment_variables = {\n      OPENAI_API_KEY = var.openai_api_key\n    }\n  }\n}\n```\n\nCreate `variables.tf`\n\n```hcl\nvariable \"azure_location\" {\n  description = \"Azure location\"\n  type        = string\n  default     = \"East US\"\n}\n\nvariable \"agent_image\" {\n  description = \"Container image for Strands agent\"\n  type        = string\n}\n\nvariable \"openai_api_key\" {\n  description = \"OpenAI API key\"\n  type        = string\n  sensitive   = true\n}\n\nvariable \"acr_name\" {\n  description = \"Azure Container Registry name\"\n  type        = string\n}\n\nvariable \"acr_resource_group\" {\n  description = \"Azure Container Registry resource group\"\n  type        = string\n}\n```\n\nCreate `output.tf`\n\n```hcl\noutput \"agent_url\" {\n  description = \"Azure Container Instance URL\"\n  value       = \"http://${azurerm_container_group.agent.ip_address}:8080\"\n}\n```"
 }
]
```

## Step 3: Configure Variables

Update `terraform/terraform.tfvars` based on your chosen provider:

```sa-tabs
[
 {
  "label": "AWS App Runner",
  "body": "```hcl\nagent_image = \"your-account.dkr.ecr.us-east-1.amazonaws.com/my-image:latest\"\nopenai_api_key = \"<your-openai-api-key>\"\n```\n\nThis example uses OpenAI, but any supported model provider can be configured. See the [Strands documentation](https://strandsagents.com/latest/documentation/docs/user-guide/concepts/model-providers) for all supported model providers.\n\n**Note:** Bedrock model provider credentials are automatically passed using App Runner\u2019s IAM role and do not need to be specified in Terraform."
 },
 {
  "label": "AWS Lambda",
  "body": "```hcl\nagent_image = \"your-account.dkr.ecr.us-east-1.amazonaws.com/my-image:latest\"\nopenai_api_key = \"<your-openai-api-key>\"\n```\n\nThis example uses OpenAI, but any supported model provider can be configured. See the [Strands documentation](https://strandsagents.com/latest/documentation/docs/user-guide/concepts/model-providers) for all supported model providers.\n\n**Note:** Bedrock model provider credentials are automatically passed using Lambda\u2019s IAM role and do not need to be specified in Terraform."
 },
 {
  "label": "Google Cloud Run",
  "body": "```hcl\ngcp_project = \"your-project-id\"\nagent_image = \"gcr.io/your-project/my-image:latest\"\nopenai_api_key = \"<your-openai-api-key>\"\n```\n\nThis example uses OpenAI, but any supported model provider can be configured. See the [Strands documentation](https://strandsagents.com/latest/documentation/docs/user-guide/concepts/model-providers) for all supported model providers. For instance, to use Bedrock model provider credentials:\n\n```hcl\naws_access_key_id = \"<your-aws-access-key-id>\"\naws_secret_access_key = \"<your-aws-secret-key>\"\n```"
 },
 {
  "label": "Azure Container Instances",
  "body": "```hcl\nagent_image = \"your-registry.azurecr.io/my-image:latest\"\nopenai_api_key = \"<your-openai-api-key>\"\nacr_name = \"<your-registry>\"\nacr_resource_group = \"<your-resource-group>\"\n```\n\nThis example uses OpenAI, but any supported model provider can be configured. See the [Strands documentation](https://strandsagents.com/latest/documentation/docs/user-guide/concepts/model-providers) for all supported model providers. For instance, to use Bedrock model provider credentials:\n\n```hcl\naws_access_key_id = \"<your-aws-access-key-id>\"\naws_secret_access_key = \"<your-aws-secret-key>\"\n```"
 }
]
```

## Step 4: Deploy Infrastructure

```bash
# Initialize Terraform
terraform init

# Review the deployment plan
terraform plan

# Deploy the infrastructure
terraform apply

# Get the endpoints
terraform output
```

## Step 5: Test Your Deployment

Test the endpoints using the output URLs:

```bash
# Health check
curl http://<your-service-url>/ping

# Test agent invocation
curl -X POST http://<your-service-url>/invocations \
  -H "Content-Type: application/json" \
  -d '{"input": {"prompt": "What is artificial intelligence?"}}'
```

## Step 6: Making Changes

When you modify your code, redeploy with:

```bash
# Rebuild and push image
docker build -t <your-registry>/my-image:latest .
docker push <your-registry>/my-image:latest

# Update infrastructure
terraform apply
```

## Cleanup

Remove the infrastructure when done:

```bash
terraform destroy
```

## Additional Resources

-   [Strands Docker Deploy Documentation](lc:user-guide/deploy/deploy_to_docker)
-   [Terraform Documentation](https://www.terraform.io/docs/)
-   [Terraform AWS Provider](https://registry.terraform.io/providers/hashicorp/aws/latest/docs)
-   [Terraform Google Provider](https://registry.terraform.io/providers/hashicorp/google/latest/docs)
-   [Terraform Azure Provider](https://registry.terraform.io/providers/hashicorp/azurerm/latest/docs)

## Related pages

- [Deploy to Kubernetes](lc:user-guide/deploy/deploy_to_kubernetes) (1 shared tag)
- [Deploy with Nx Plugin for AWS](lc:user-guide/deploy/deploy_with_nx_plugin_for_aws) (1 shared tag)
- [Deploying Strands Agents to Docker](lc:user-guide/deploy/deploy_to_docker) (1 shared tag)
- [Python Deployment to Docker](lc:user-guide/deploy/deploy_to_docker/python) (1 shared tag)
- [TypeScript Deployment to Docker](https://strandsagents.com/docs/user-guide/deploy/deploy_to_docker/typescript/) (1 shared tag)
- [Deploying Strands Agents SDK Agents to Amazon EC2](lc:user-guide/deploy/deploy_to_amazon_ec2) (1 shared tag)
- [Deploying Strands Agents SDK Agents to Amazon EKS](lc:user-guide/deploy/deploy_to_amazon_eks) (1 shared tag)
- [Deploying Strands Agents SDK Agents to AWS App Runner](lc:user-guide/deploy/deploy_to_aws_apprunner) (1 shared tag)
- [Deploying Strands Agents SDK Agents to AWS Fargate](lc:user-guide/deploy/deploy_to_aws_fargate) (1 shared tag)
- [Deploying Strands Agents SDK Agents to AWS Lambda](lc:user-guide/deploy/deploy_to_aws_lambda) (1 shared tag)
