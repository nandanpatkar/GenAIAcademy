# Deploy Strands Travel Agent to Amazon EKS and use AgentCore Observability and Evaluations

This notebook automates the deployment of a Travel Agent built with [Strands Agents SDK](https://github.com/strands-agents/sdk-python) to Amazon EKS.

## Prerequisites

- [AWS CLI](https://aws.amazon.com/cli/) installed and configured
- [eksctl](https://eksctl.io/installation/) (v0.208.x or later) installed
- [Helm](https://helm.sh/) (v3 or later) installed
- [kubectl](https://docs.aws.amazon.com/eks/latest/userguide/install-kubectl.html) installed
- [Docker](https://www.docker.com/) installed and running
- Amazon Bedrock Claude model enabled in your AWS account

```python
# Uncomment and run to install prerequisites on macOS
# !brew tap weaveworks/tap
# !brew install weaveworks/tap/eksctl
# !brew install helm
# !brew install kubectl

# Verify installations
!echo "=== Checking installed versions ==="
!aws --version
!eksctl version
!helm version --short
!kubectl version --client
!docker --version
```

## 1. Configuration

Set environment variables for the deployment. Modify these values as needed.

```python
import os

# Auto-detect AWS Account ID
account_id = !aws sts get-caller-identity --query 'Account' --output text
os.environ["AWS_ACCOUNT_ID"] = account_id[0]

# User-configurable settings (reads from environment or uses defaults)
# Set these environment variables before running to customize deployment
os.environ["AWS_REGION"] = os.getenv("AWS_REGION", "us-east-1")
os.environ["CLUSTER_NAME"] = os.getenv("CLUSTER_NAME", "eks-strands-agents-demo")
os.environ["SERVICE_NAME"] = os.getenv("SERVICE_NAME", "strands-agents-travel")

# CloudWatch configuration
os.environ["LOG_GROUP_NAME"] = os.getenv("LOG_GROUP_NAME", "/strands-agents/travel")
os.environ["LOG_STREAM_NAME"] = os.getenv("LOG_STREAM_NAME", "agent-logs")
os.environ["METRIC_NAMESPACE"] = os.getenv("METRIC_NAMESPACE", "StrandsAgents/Travel")

# Port configuration
os.environ["LOCAL_PORT"] = os.getenv("LOCAL_PORT", "8080")
os.environ["SERVICE_PORT"] = os.getenv("SERVICE_PORT", "80")

# Display configuration
print("=== Deployment Configuration ===")
print(f"AWS Account ID: {os.environ['AWS_ACCOUNT_ID']}")
print(f"AWS Region: {os.environ['AWS_REGION']}")
print(f"Cluster Name: {os.environ['CLUSTER_NAME']}")
print(f"Service Name: {os.environ['SERVICE_NAME']}")
print(f"Log Group: {os.environ['LOG_GROUP_NAME']}")
print(f"Log Stream: {os.environ['LOG_STREAM_NAME']}")
print(f"Metric Namespace: {os.environ['METRIC_NAMESPACE']}")
print(f"Local Port: {os.environ['LOCAL_PORT']}")
print(f"Service Port: {os.environ['SERVICE_PORT']}")
```

## 2. Create CloudWatch Log Group

Create the CloudWatch log group and stream for OpenTelemetry logs.

```python
%%bash
echo "Creating CloudWatch log group and stream..."
aws logs create-log-group --log-group-name ${LOG_GROUP_NAME} --region ${AWS_REGION} 2>/dev/null || echo "Log group already exists"
aws logs create-log-stream --log-group-name ${LOG_GROUP_NAME} --log-stream-name ${LOG_STREAM_NAME} --region ${AWS_REGION} 2>/dev/null || echo "Log stream already exists"
echo "CloudWatch resources ready!"
```

## 3. Update Dockerfile with CloudWatch Config

Replace the placeholder values in the Dockerfile with actual CloudWatch configuration.

```python
import os
import shutil

dockerfile_path = "docker/Dockerfile"
dockerfile_backup = "docker/Dockerfile.backup"

# Validate file exists
if not os.path.exists(dockerfile_path):
    raise FileNotFoundError(
        f"Dockerfile not found at {dockerfile_path}. Make sure you're running from the correct directory."
    )

# Read Dockerfile
with open(dockerfile_path, "r") as f:
    content = f.read()

# Check if placeholders exist
if "<YOUR_LOG_GROUP>" in content or "<YOUR_SERVICE_NAME>" in content:
    # Create backup before modifying
    shutil.copy(dockerfile_path, dockerfile_backup)
    print(f"Backup created: {dockerfile_backup}")

    # Replace placeholders with actual values
    content = content.replace("<YOUR_SERVICE_NAME>", os.environ["SERVICE_NAME"])
    content = content.replace("<YOUR_LOG_GROUP>", os.environ["LOG_GROUP_NAME"])
    content = content.replace("<YOUR_LOG_STREAM>", os.environ["LOG_STREAM_NAME"])
    content = content.replace("<YOUR_METRIC_NAMESPACE>", os.environ["METRIC_NAMESPACE"])

    # Write back
    with open(dockerfile_path, "w") as f:
        f.write(content)
    print("Dockerfile updated with configuration values")
else:
    print("Dockerfile already configured (no placeholders found)")
    print("To restore placeholders, copy Dockerfile.backup to Dockerfile")

# Show the updated OTEL lines
print("\\nCurrent OTEL configuration:")
for line in content.split("\\n"):
    if "OTEL_RESOURCE_ATTRIBUTES" in line or "OTEL_EXPORTER_OTLP_LOGS_HEADERS" in line:
        print(f"  {line}")
```

## 4. Create EKS Cluster

Create an EKS Auto Mode cluster. This step takes approximately 15-20 minutes.

```python
%%bash
echo "Creating EKS Auto Mode cluster: $CLUSTER_NAME"
echo "This will take approximately 15-20 minutes..."

eksctl create cluster --name $CLUSTER_NAME --region $AWS_REGION --enable-auto-mode
```

```python
%%bash
# Configure kubeconfig context
aws eks update-kubeconfig --name $CLUSTER_NAME --region $AWS_REGION

# Verify cluster access
echo "Cluster nodes:"
kubectl get nodes
```

## 5. Build and Push Docker Image to ECR

Build the Travel Agent Docker image and push it to Amazon ECR.

`Important note` - Make sure you have a local docker instance running

```python
%%bash
# Authenticate to Amazon ECR
echo "Authenticating to ECR..."
aws ecr get-login-password --region ${AWS_REGION} | docker login --username AWS --password-stdin ${AWS_ACCOUNT_ID}.dkr.ecr.${AWS_REGION}.amazonaws.com

# Create ECR repository (ignore error if already exists)
echo "Creating ECR repository..."
aws ecr create-repository --repository-name ${SERVICE_NAME} --region ${AWS_REGION} 2>/dev/null || echo "Repository already exists"
```

```python
%%bash
# Build the Docker image
echo "Building Docker image..."
docker build --platform linux/amd64 -t ${SERVICE_NAME}:latest docker/

# Tag the image for ECR
docker tag ${SERVICE_NAME}:latest ${AWS_ACCOUNT_ID}.dkr.ecr.${AWS_REGION}.amazonaws.com/${SERVICE_NAME}:latest

# Push the image to ECR
echo "Pushing image to ECR..."
docker push ${AWS_ACCOUNT_ID}.dkr.ecr.${AWS_REGION}.amazonaws.com/${SERVICE_NAME}:latest

echo "Docker image pushed successfully!"
```

## 6. Configure IAM Policy

Create IAM policy with permissions for Amazon Bedrock and CloudWatch Logs.

```python
%%bash
# Create IAM policy with Bedrock and CloudWatch Logs permissions
cat > /tmp/travel-agent-policy.json << 'EOF'
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": [
        "bedrock:InvokeModel",
        "bedrock:InvokeModelWithResponseStream"
      ],
      "Resource": "*"
    },
    {
      "Effect": "Allow",
      "Action": [
        "logs:CreateLogGroup",
        "logs:CreateLogStream",
        "logs:PutLogEvents",
        "logs:DescribeLogGroups",
        "logs:DescribeLogStreams"
      ],
      "Resource": "*"
    }
  ]
}
EOF

# Create the IAM policy (ignore error if already exists)
aws iam create-policy \
  --policy-name ${SERVICE_NAME}-policy \
  --policy-document file:///tmp/travel-agent-policy.json 2>/dev/null || echo "Policy already exists"

rm -f /tmp/travel-agent-policy.json
echo "IAM policy ready!"
```

## 7. Create EKS Pod Identity

Create the EKS Pod Identity association for the service account.

```python
%%bash
# Create EKS Pod Identity association
echo "Creating Pod Identity association..."
eksctl create podidentityassociation --cluster $CLUSTER_NAME \
  --namespace default \
  --service-account-name ${SERVICE_NAME} \
  --permission-policy-arns arn:aws:iam::${AWS_ACCOUNT_ID}:policy/${SERVICE_NAME}-policy \
  --role-name eks-${SERVICE_NAME} \
  --region $AWS_REGION

echo "Pod Identity association created!"
```

## 8. Install CloudWatch Observability Addon (Optional)

> **Note:** This step is **optional**. The CloudWatch Observability addon is NOT required for Bedrock AgentCore Observability. AgentCore sends telemetry directly to CloudWatch using the OTEL configuration in the Dockerfile. Skip this section if you only need AgentCore observability.

Install the CloudWatch Observability addon to collect additional Kubernetes-level metrics and logs (beyond AgentCore telemetry).

```python
%%bash
# Create Pod Identity for CloudWatch agent
echo "Creating CloudWatch agent Pod Identity..."
eksctl create podidentityassociation --cluster $CLUSTER_NAME \
  --namespace amazon-cloudwatch \
  --service-account-name cloudwatch-agent \
  --permission-policy-arns arn:aws:iam::aws:policy/CloudWatchAgentServerPolicy \
  --role-name eks-cloudwatch-agent \
  --region $AWS_REGION

echo "CloudWatch agent Pod Identity created!"
```

```python
%%bash
# Install CloudWatch Observability addon
echo "Installing CloudWatch Observability addon..."
aws eks create-addon \
  --addon-name amazon-cloudwatch-observability \
  --cluster-name $CLUSTER_NAME \
  --region $AWS_REGION

echo "Waiting for addon to be active..."
aws eks wait addon-active --cluster-name $CLUSTER_NAME --addon-name amazon-cloudwatch-observability --region $AWS_REGION
echo "CloudWatch Observability addon installed!"
```

## 9. Deploy Helm Chart

Deploy the Travel Agent application using the Helm chart.

```python
%%bash
# Validate chart directory exists
if [ ! -d "./chart" ]; then
    echo "Error: Helm chart directory './chart' not found"
    echo "Make sure you're running from the strands-travel-agent-eks directory"
    exit 1
fi

# Deploy with Helm (upgrade --install for idempotency)
echo "Deploying Travel Agent with Helm..."
helm upgrade --install ${SERVICE_NAME} ./chart \
  --set image.repository=${AWS_ACCOUNT_ID}.dkr.ecr.${AWS_REGION}.amazonaws.com/${SERVICE_NAME} \
  --set image.tag=latest

echo "Helm deployment initiated!"
```

```python
%%bash
# Wait for deployment to be available
echo "Waiting for deployment to be ready..."
kubectl wait --for=condition=available deployments ${SERVICE_NAME} --timeout=300s

# Check pod status
echo "\nPod status:"
kubectl get pods -l app.kubernetes.io/name=${SERVICE_NAME}
```

## 10. Start Port Forward

Start port-forwarding in the background to access the Travel Agent locally.

```python
import subprocess
import time
import os

local_port = os.environ.get("LOCAL_PORT", "8080")
service_port = os.environ.get("SERVICE_PORT", "80")
service_name = os.environ["SERVICE_NAME"]

# Start port-forward in background
port_forward = subprocess.Popen(
    [
        "kubectl",
        "--namespace",
        "default",
        "port-forward",
        f"service/{service_name}",
        f"{local_port}:{service_port}",
    ],
    stdout=subprocess.PIPE,
    stderr=subprocess.PIPE,
)
print(f"Port-forward started (PID: {port_forward.pid})")
print(f"Agent will be available at: http://localhost:{local_port}/travel")
print("\\nNote: Run the 'Stop Port Forward' cell below when done testing")
time.sleep(5)  # Wait for port-forward to establish
```

## 11. Test the Agent

Invoke the Travel Agent with a test query.

```python
import requests
import os

local_port = os.environ.get("LOCAL_PORT", "8080")
url = f"http://localhost:{local_port}/travel"
payload = {"prompt": "What are the best places to visit in Tokyo in March?"}

print(f"Sending request to: {url}")
print(f"Prompt: {payload['prompt']}")
print("\\nWaiting for response (this may take a minute)...\\n")

try:
    response = requests.post(url, json=payload, timeout=120)
    print(f"Status: {response.status_code}")
    print(f"\\nResponse:\\n{response.text}")
except requests.exceptions.ConnectionError as e:
    print(f"Connection failed: {e}")
    print("\\nMake sure port-forward is running (run the cell above)")
```

## 12. Stop Port Forward

Stop the port-forward process when done testing.

```python
# Stop the port-forward process
if "port_forward" in dir() and port_forward.poll() is None:
    port_forward.terminate()
    print("Port-forward stopped")
else:
    print("Port-forward not running")
```

## 13. Cleanup (Optional)

Uncomment and run the cells below to remove all resources created by this notebook.

```python
# %%bash
# # Uninstall helm chart
# echo "Uninstalling helm chart..."
# helm uninstall ${SERVICE_NAME}
```

```python
# %%bash
# # Delete EKS cluster (this takes several minutes)
# echo "Deleting EKS cluster: $CLUSTER_NAME"
# echo "This will take several minutes..."
# eksctl delete cluster --name $CLUSTER_NAME --region $AWS_REGION --wait
```

```python
# %%bash
# # Delete IAM policy
# echo "Deleting IAM policy..."
# aws iam delete-policy --policy-arn arn:aws:iam::${AWS_ACCOUNT_ID}:policy/${SERVICE_NAME}-policy
```

```python
# %%bash
# # Delete ECR repository
# echo "Deleting ECR repository..."
# aws ecr delete-repository --repository-name ${SERVICE_NAME} --region ${AWS_REGION} --force
```

```python
# %%bash
# # Delete CloudWatch log group
# echo "Deleting CloudWatch log group..."
# aws logs delete-log-group --log-group-name ${LOG_GROUP_NAME} --region ${AWS_REGION}
```
