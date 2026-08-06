# Handling Large Multi-Modal Payloads in AgentCore Runtime

## Overview

This tutorial demonstrates how Amazon Bedrock AgentCore Runtime handles large payloads up to 100MB, including multi-modal content such as Excel files and images. AgentCore Runtime is designed to process rich media content and large datasets seamlessly.

### Tutorial Details

|Information| Details|
|:--------------------|:---------------------------------------------------------------------------------|
| Tutorial type       | Large Payload & Multi-Modal Processing|
| Agent type          | Single         |
| Agentic Framework   | Strands Agents |
| LLM model           | Anthropic Claude Haiku 4.5 |
| Tutorial components | Large File Processing, Image Analysis, Excel Data Processing |
| Tutorial vertical   | Data Analysis & Multi-Modal AI                                                   |
| Example complexity  | Intermediate                                                                     |
| SDK used            | Amazon BedrockAgentCore Python SDK|

### Key Features

* **Large Payload Support**: Process files up to 100MB in size
* **Multi-Modal Processing**: Handle Excel files, images, and text simultaneously
* **Data Analysis**: Extract insights from structured data and visual content
* **Base64 Encoding**: Secure transmission of binary data through JSON payloads

## Prerequisites

* Python 3.10+
* AWS credentials configured
* Docker running
* Sample Excel file and image for testing

```python
!pip install --force-reinstall -U -r requirements.txt --quiet
```

## Create Sample Data Files

Let's create sample Excel and image files to demonstrate large payload handling:

```python
import pandas as pd
import numpy as np
from PIL import Image, ImageDraw
import os

# Create a large Excel file with sample sales data
np.random.seed(42)
data = {
    "Date": pd.date_range("2023-01-01", periods=1000, freq="h"),
    "Product": np.random.choice(["Widget A", "Widget B", "Widget C", "Gadget X", "Gadget Y"], 1000),
    "Sales": np.random.randint(1, 1000, 1000),
    "Revenue": np.random.uniform(10.0, 5000.0, 1000),
    "Region": np.random.choice(["North", "South", "East", "West"], 1000),
    "Customer_ID": np.random.randint(1000, 9999, 1000),
}

df = pd.DataFrame(data)
df.to_excel("large_sales_data.xlsx", index=False)

# Create a sample chart image
img = Image.new("RGB", (600, 500), color="white")
draw = ImageDraw.Draw(img)

# Draw a simple bar chart
products = ["Widget A", "Widget B", "Widget C", "Gadget X", "Gadget Y"]
values = [250, 180, 320, 150, 280]
colors = ["#FF6B6B", "#4ECDC4", "#45B7D1", "#96CEB4", "#FFEAA7"]

max_value = max(values)
bar_width = 120
start_x = 100

for i, (product, value, color) in enumerate(zip(products, values, colors)):
    x = start_x + i * (bar_width + 20)
    height = int((value / max_value) * 400)
    y = 500 - height

    # Draw bar
    draw.rectangle([x, y, x + bar_width, 500], fill=color)

    # Add labels (simplified without font)
    draw.text((x + 10, 510), product[:8], fill="black")
    draw.text((x + 10, y - 20), str(value), fill="black")

draw.text((300, 50), "Sales Performance by Product", fill="black")
img.save("sales_chart.png")

# Check file sizes
excel_size = os.path.getsize("large_sales_data.xlsx") / (1024 * 1024)  # MB
image_size = os.path.getsize("sales_chart.png") / (1024 * 1024)  # MB

print(f"Excel file size: {excel_size:.2f} MB")
print(f"Image file size: {image_size:.2f} MB")
print(f"Total payload size: {excel_size + image_size:.2f} MB")
```

## Create Multi-Modal Agent

Let's create an agent that can process both Excel files and images from large payloads:

```python
%%writefile multimodal_data_agent.py
from strands import Agent, tool
from strands.models import BedrockModel
import pandas as pd
import base64
import io
import json
from bedrock_agentcore.runtime import BedrockAgentCoreApp

app = BedrockAgentCoreApp()

# Initialize the model and agent
model_id = "global.anthropic.claude-haiku-4-5-20251001-v1:0"
model = BedrockModel(
    model_id=model_id,
    max_tokens=16000
)

agent = Agent(
    model=model,
    system_prompt="""
    You are a data analysis assistant that can process large Excel files and images.
    When given multi-modal data, analyze both the structured data and visual content,
    then provide comprehensive insights combining both data sources.
    """
)

@app.entrypoint
def multimodal_data_processor(payload, context):
    """
    Process large multi-modal payloads containing Excel data and images.
    
    Args:
        payload: Contains prompt, excel_data (base64), image_data (base64)
        context: Runtime context information
    
    Returns:
        str: Analysis results from both data sources
    """
    prompt = payload.get("prompt", "Analyze the provided data.")
    excel_data = payload.get("excel_data", "")
    image_data = payload.get("image_data", "")
    
    print(f"=== Large Payload Processing ===")
    print(f"Session ID: {context.session_id}")
    
    if excel_data:
        print(f"Excel data size: {len(excel_data) / 1024 / 1024:.2f} MB")
    if image_data:
        print(f"Image data size: {len(image_data) / 1024 / 1024:.2f} MB")
    print(f"Excel data {excel_data}")
    print(f"Image data {image_data}")
    print(f"=== Processing Started ===")
    # Decode base64 to bytes
    excel_bytes = base64.b64decode(excel_data)
    # Decode base64 to bytes
    image_bytes = base64.b64decode(image_data)
    
    # Enhanced prompt with data context
    enhanced_prompt = f"""{prompt}
    Please analyze both data sources and provide insights.
    """
    
    response = agent(
        [{
            "document": {
                "format": "xlsx",
                "name": "excel_data",
                "source": {
                    "bytes": excel_bytes
                }
            }
        },
        {
            "image": {
                "format": "png",
                "source": {
                    "bytes": image_bytes
                }
            }
        },
        {
            "text": enhanced_prompt
        }]
    )
    return response.message['content'][0]['text']

if __name__ == "__main__":
    app.run()
```

## Setup Infrastructure and Deploy Agent

```python
from bedrock_agentcore_starter_toolkit import Runtime
from boto3.session import Session

boto_session = Session()
region = boto_session.region_name

agentcore_runtime = Runtime()

response = agentcore_runtime.configure(
    entrypoint="multimodal_data_agent.py",
    auto_create_execution_role=True,
    auto_create_ecr=True,
    requirements_file="requirements.txt",
    region=region,
    agent_name="multimodal_data_agent",
)

launch_result = agentcore_runtime.launch()
```

```python
import time

status_response = agentcore_runtime.status()
status = status_response.endpoint["status"]
end_status = ["READY", "CREATE_FAILED", "DELETE_FAILED", "UPDATE_FAILED"]

while status not in end_status:
    time.sleep(10)
    status_response = agentcore_runtime.status()
    status = status_response.endpoint["status"]
    print(f"Deployment status: {status}")

print(f"Final status: {status}")
```

## Test Large Multi-Modal Payloads

Now let's test the agent with large payloads containing both Excel data and images:

```python
import base64
import uuid
import json
from IPython.display import Markdown, display

# Encode files to base64
with open("large_sales_data.xlsx", "rb") as f:
    excel_base64 = base64.b64encode(f.read()).decode("utf-8")

with open("sales_chart.png", "rb") as f:
    image_base64 = base64.b64encode(f.read()).decode("utf-8")

# Create large payload
large_payload = {
    "prompt": "Analyze the sales data from the Excel file and correlate it with the chart image. Provide insights on sales performance and trends.",
    "excel_data": excel_base64,
    "image_data": image_base64,
}

session_id = str(uuid.uuid4())
print("📊 Processing large multi-modal payload...")
print(f"📋 Session ID: {session_id}")
print(f"📄 Excel size: {len(excel_base64) / 1024 / 1024:.2f} MB")
print(f"🖼️ Image size: {len(image_base64) / 1024 / 1024:.2f} MB")
print(f"📦 Total payload: {len(json.dumps(large_payload)) / 1024 / 1024:.2f} MB\n")

# Invoke agent with large payload
invoke_response = agentcore_runtime.invoke(large_payload, session_id=session_id)
final_response = ""
for r in invoke_response["response"]:
    final_response += r
response_data = final_response
display(Markdown(response_data))
```

## Cleanup Resources

```python
import boto3

# Clean up AWS resources
agentcore_control_client = boto3.client("bedrock-agentcore-control", region_name=region)
ecr_client = boto3.client("ecr", region_name=region)

# Delete AgentCore Runtime
runtime_delete_response = agentcore_control_client.delete_agent_runtime(agentRuntimeId=launch_result.agent_id)

# Delete ECR repository
ecr_client.delete_repository(repositoryName=launch_result.ecr_uri.split("/")[1], force=True)

# Clean up local files
os.remove("large_sales_data.xlsx")
os.remove("sales_chart.png")

print("✅ Cleanup completed!")
```

# Congratulations!

You have successfully demonstrated handling large multi-modal payloads with Amazon Bedrock AgentCore Runtime!

## What you've learned:

### Large Payload Processing
* **100MB Support**: AgentCore Runtime can handle payloads up to 100MB
* **Base64 Encoding**: Secure transmission of binary data through JSON payloads
* **Efficient Processing**: Runtime optimized for large data processing

### Multi-Modal Capabilities
* **Excel Analysis**: Processing structured data from spreadsheets
* **Image Processing**: Analyzing visual content and charts
* **Combined Analysis**: Correlating insights from multiple data types

### Key Benefits
* **Rich Data Processing**: Handle complex, multi-format datasets
* **Scalable Architecture**: Runtime designed for large workloads
* **Tool Integration**: Custom tools for specialized data processing
* **Enterprise Ready**: Secure handling of sensitive business data

This demonstrates AgentCore Runtime's capability to handle enterprise-scale data processing tasks with multiple data modalities, making it ideal for complex business intelligence and data analysis applications.
