# Embed Browser Live View in Your Frontend

## Overview

Learn how to integrate real-time browser streaming and human take-over of Browser in your web application using Amazon DCV (NICE DCV) and AWS Bedrock AgentCore Browser.

### Tutorial Details

| Information         | Details                                                                          |
|:--------------------|:---------------------------------------------------------------------------------|
| Tutorial type       | Integration Guide                                                                |
| Agent type          | Single                                                                           |
| Agentic Framework   | Nova Act                                                                         |
| LLM model           | Amazon Nova Act model                                                            |
| Tutorial components | DCV live streaming, AgentCore Browser, WebSocket authentication                 |
| Tutorial vertical   | Web Development                                                                  |
| Example complexity  | Medium                                                                           |
| SDK used            | Amazon BedrockAgentCore Python SDK, Nova Act, Amazon DCV Web Client SDK          |

### Tutorial Architecture

This tutorial demonstrates how to stream live browser sessions using AWS Bedrock AgentCore Browser with Amazon DCV protocol for real-time viewing.

### Tutorial Key Features

* Using browser tool in a headless way
* Using Nova Act with browser tool
* Embed browser live view in React application

## Prerequisites

To execute this tutorial you will need:

* Python 3.10+
* AWS credentials configured. Your IAM role/user should have these permissions https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/browser-onboarding.html#browser-credentials-config
* Amazon Bedrock AgentCore SDK
* Basic knowledge of HTML/JavaScript

### Install Required Python Packages

```python
# Install required packages
!pip install bedrock-agentcore boto3 -q
```

## Download and Setup DCVjs SDK

The DCVjs SDK enables real-time browser streaming in your application.

### What we'll do:

1. **Automatically download** the latest DCVjs SDK from AWS CloudFront
2. **Extract and organize** files in the correct directory structure
3. **Verify installation** to ensure everything is ready

The SDK will be organized as:

```
dcv-sdk/
├── dcvjs-umd/          # ← We'll use this version
│   ├── dcv.js
│   └── dcv/            # Worker files for video decoding
├── dcvjs-esm/          # ES Module version
└── dcv-ui/             # Optional UI components
```

### Important Notes:

- The SDK must be served as static files (not imported as npm package)
- Worker files must be accessible at runtime for video decoding
- We'll verify the installation automatically

**Run the cell below to download and setup the SDK automatically.**

```python
import urllib.request
import zipfile
import os
import shutil
from pathlib import Path

# DCV SDK Configuration
DCV_SDK_URL = "https://d1uj6qtbmh3dt5.cloudfront.net/webclientsdk/nice-dcv-web-client-sdk-1.9.100-952.zip"
DCV_SDK_DIR = "dcv-sdk"
ZIP_FILE = "dcv-sdk.zip"


def download_dcv_sdk():
    """Download DCV SDK from CloudFront"""
    print("📦 Downloading DCV SDK...")
    print(f"   Source: {DCV_SDK_URL}")

    # Download with progress
    def report_progress(block_num, block_size, total_size):
        downloaded = block_num * block_size
        percent = min(downloaded * 100 / total_size, 100)
        print(f"\r   Progress: {percent:.1f}%", end="", flush=True)

    urllib.request.urlretrieve(DCV_SDK_URL, ZIP_FILE, report_progress)
    print()  # New line after progress
    print("✅ Download complete!")


def extract_dcv_sdk():
    """Extract DCV SDK to dcv-sdk directory"""
    print("\n📂 Extracting DCV SDK...")

    # Remove old directory if exists
    if os.path.exists(DCV_SDK_DIR):
        shutil.rmtree(DCV_SDK_DIR)
        print("   Removed old dcv-sdk directory")

    # Create temporary extraction directory
    temp_dir = "dcv-sdk-temp"
    if os.path.exists(temp_dir):
        shutil.rmtree(temp_dir)

    # Extract zip file to temp directory
    with zipfile.ZipFile(ZIP_FILE, "r") as zip_ref:
        zip_ref.extractall(temp_dir)

    print("   Extracted to temporary directory")

    # Find the actual SDK directory (it's nested inside)
    # Structure is: dcv-sdk-temp/nice-dcv-web-client-sdk/[actual files]
    nested_dir = os.path.join(temp_dir, "nice-dcv-web-client-sdk")

    if os.path.exists(nested_dir):
        # Move the nested directory to our target location
        shutil.move(nested_dir, DCV_SDK_DIR)
        print("   Moved SDK files to dcv-sdk/")
    else:
        # If structure is different, just rename temp to target
        shutil.move(temp_dir, DCV_SDK_DIR)
        print("   Organized SDK files")

    # Clean up
    if os.path.exists(temp_dir):
        shutil.rmtree(temp_dir)

    os.remove(ZIP_FILE)
    print("✅ Extraction complete!")
    print("   Cleaned up temporary files")


def verify_installation():
    """Verify that all required files are in place"""
    print("\n🔍 Verifying installation...")

    required_files = [
        "dcv-sdk/dcvjs-umd/dcv.js",
        "dcv-sdk/dcvjs-umd/dcv",  # Directory
        "dcv-sdk/dcvjs-esm/dcv.js",
    ]

    all_good = True
    for file_path in required_files:
        if os.path.exists(file_path):
            file_type = "📁" if os.path.isdir(file_path) else "📄"
            print(f"   {file_type} {file_path} ✓")
        else:
            print(f"   ❌ {file_path} - NOT FOUND")
            all_good = False

    if all_good:
        print("\n✅ All required files are in place!")

        # Count worker files
        worker_dir = Path("dcv-sdk/dcvjs-umd/dcv")
        if worker_dir.exists():
            worker_files = list(worker_dir.glob("*.js")) + list(worker_dir.glob("*.wasm"))
            print(f"   Found {len(worker_files)} worker files for video decoding")

        # Show file sizes
        dcv_js = Path("dcv-sdk/dcvjs-umd/dcv.js")
        if dcv_js.exists():
            size_mb = dcv_js.stat().st_size / (1024 * 1024)
            print(f"   Main SDK file size: {size_mb:.2f} MB")

        return True
    else:
        print("\n❌ Some files are missing. Please check the extraction.")

        # Show what we actually have
        print("\n🔍 Debugging - Current structure:")
        if os.path.exists(DCV_SDK_DIR):
            for root, dirs, files in os.walk(DCV_SDK_DIR):
                level = root.replace(DCV_SDK_DIR, "").count(os.sep)
                indent = " " * 2 * level
                print(f"{indent}{os.path.basename(root)}/")
                sub_indent = " " * 2 * (level + 1)
                for file in files[:5]:  # Show first 5 files
                    print(f"{sub_indent}{file}")
                if len(files) > 5:
                    print(f"{sub_indent}... and {len(files) - 5} more files")
                if level > 2:  # Limit depth
                    break
        return False


def show_directory_structure():
    """Display the directory structure"""
    print("\n📋 Directory Structure:")
    print("=" * 60)

    def print_tree(directory, prefix="", max_depth=3, current_depth=0):
        if current_depth >= max_depth:
            return

        try:
            contents = sorted(Path(directory).iterdir(), key=lambda x: (not x.is_dir(), x.name))
            for i, path in enumerate(contents):
                is_last = i == len(contents) - 1
                current_prefix = "└── " if is_last else "├── "

                # Show file size for important files
                size_info = ""
                if path.is_file() and path.suffix in [".js", ".wasm"]:
                    size_mb = path.stat().st_size / (1024 * 1024)
                    if size_mb > 0.1:
                        size_info = f" ({size_mb:.1f}MB)"

                print(f"{prefix}{current_prefix}{path.name}{'/' if path.is_dir() else ''}{size_info}")

                if path.is_dir() and current_depth < max_depth - 1:
                    extension = "    " if is_last else "│   "
                    print_tree(path, prefix + extension, max_depth, current_depth + 1)
        except PermissionError:
            pass

    print_tree(DCV_SDK_DIR)
    print("=" * 60)


# Main execution
try:
    # Check if already installed
    if os.path.exists("dcv-sdk/dcvjs-umd/dcv.js"):
        print("⚠️  DCV SDK already exists!")
        print("   Current installation is valid.")

        # Quick verification
        if verify_installation():
            show_directory_structure()
            print("\n✅ Existing DCV SDK is ready to use!")
            print("\nℹ️  To re-download, delete the 'dcv-sdk' directory first.")
    else:
        # Download and setup
        download_dcv_sdk()
        extract_dcv_sdk()

    if verify_installation():
        show_directory_structure()
        print("\n🎉 DCV SDK is ready to use!")
        print("\nℹ️  The SDK is now available at: ./dcv-sdk/")
        print("   - UMD version: dcv-sdk/dcvjs-umd/dcv.js")
        print("   - ESM version: dcv-sdk/dcvjs-esm/dcv.js")
        print("   - UI components: dcv-sdk/dcv-ui/")
    else:
        print("\n⚠️  Installation incomplete. Please check for errors above.")

except KeyboardInterrupt:
    print("\n\n⚠️  Download cancelled by user")
except Exception as e:
    print(f"\n❌ Error during installation: {e}")
    import traceback

    traceback.print_exc()
```

## Architecture Flow

Here's how DCVjs client SDK helps us stream the live browser:

```
┌──────────────────────┐
│   Python Backend     │
│ (AgentCore Browser)  │
└──────────┬───────────┘
           │
           │ 1. Create browser session
           │ 2. Generate presigned URL
           ↓
┌──────────────────────┐
│  DCV Streaming       │
│  Server              │
└──────────┬───────────┘
           │
           │ 3. Stream via DCV protocol
           ↓
┌──────────────────────┐
│   Frontend           │
│ (DCVjs SDK)          │
│ - Authenticates      │
│ - Renders stream     │
└──────────────────────┘
```

**Flow Steps:**

1. AgentCore Browser Tool (Backend) creates browser session
2. DCV Streaming Server generates streaming URL & auth tokens
3. Create an API server to handle human take-over. Human take-over uses teh update_browser_stream API (https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/browser-update-stream.html).
4. DCVjs SDK (Frontend) connects and renders stream
5. Frontend implements human-take over. This is useful when you want humans to handle Browser operations and not the Agent. You can then give back control to the Agent. 
4. HTML displays real-time browser view

## Step 0: Environment Setup

First, let's import required libraries and set up AWS configuration.

```python
from bedrock_agentcore.tools.browser_client import BrowserClient
import boto3

# Get AWS region from boto3 session
session = boto3.Session()
region = session.region_name

print(f"Using AWS Region: {region}")
print("Environment setup complete!")
```

## Step 1: Create Browser Control API Server

To support the Human Take Over functionality, we need to create a simple API server that will handle the browser control API calls. This server will provide endpoints for enabling and disabling automation mode.

Let's implement this API server using FastAPI:

```python
from fastapi import FastAPI
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware  # Add this import
from pydantic import BaseModel
import uvicorn
import threading


class AutomationStreamUpdate(BaseModel):
    streamStatus: str  # 'enabled' or 'disabled'


class BrowserStreamUpdateRequest(BaseModel):
    automationStreamUpdate: AutomationStreamUpdate


class BrowserControlServer:
    """Server for handling browser control API endpoints."""

    def __init__(self, browser_client, port=8081):
        """Initialize the control server."""
        self.browser_client = browser_client
        self.port = port
        self.app = FastAPI(title="Browser Control API")
        self.server_thread = None
        self.is_running = False

        # Add CORS middleware to allow cross-origin requests
        self.app.add_middleware(
            CORSMiddleware,
            allow_origins=["*"],  # Allow all origins for demo purposes
            allow_credentials=True,
            allow_methods=["*"],  # Allow all methods
            allow_headers=["*"],  # Allow all headers
        )

        # Setup routes
        self._setup_routes()

    def _setup_routes(self):
        """Setup FastAPI routes."""

        @self.app.get("/")
        async def root():
            """Root endpoint."""
            return {"message": "Browser Control API is running."}

        @self.app.post("/api/update_browser_stream")
        async def update_browser_stream(request: BrowserStreamUpdateRequest):
            """Update browser stream automation status."""
            try:
                stream_status = request.automationStreamUpdate.streamStatus
                print(f"Updating browser stream status to: {stream_status}")

                if stream_status == "disabled":
                    # Take control (disable automation)
                    self.browser_client.take_control()
                    print("✅ Human control enabled (automation disabled)")
                    return {"status": "success", "message": "Human control enabled"}

                elif stream_status == "enabled":
                    # Give back control (enable automation)
                    self.browser_client.release_control()
                    print("✅ Automation enabled")
                    return {"status": "success", "message": "Automation enabled"}

                else:
                    print(f"❌ Invalid stream status: {stream_status}")
                    return JSONResponse(
                        status_code=400,
                        content={
                            "status": "error",
                            "message": f"Invalid stream status: {stream_status}. Must be 'enabled' or 'disabled'",
                        },
                    )

            except Exception as e:
                print(f"❌ Error updating browser stream: {e}")
                return JSONResponse(status_code=500, content={"status": "error", "message": str(e)})

    def start(self):
        """Start the API server."""

        # Run server in a thread
        def run_server():
            uvicorn.run(self.app, host="0.0.0.0", port=self.port, log_level="error")

        self.server_thread = threading.Thread(target=run_server, daemon=True)
        self.server_thread.start()
        self.is_running = True

        print(f"🌐 Browser Control API server running at: http://localhost:{self.port}")
        print("🔓 CORS enabled: Allowing requests from all origins")
        return f"http://localhost:{self.port}"


# NOTE: The control server will be initialized in Step 1 after the browser_client is created
print("✅ Browser Control Server class defined")
print("The server will be initialized after the browser client is created.")
```

## Step 2: Create Browser Session and Get Streaming URLs

Initialize the AgentCore Browser client and generate the necessary URLs for frontend streaming.

```python
# Create a BrowserClient and start a session
browser_client = BrowserClient(region)
browser_client.start()

print("✅ Browser session started")
```

### Step 2.1 Get streaming URL

Run the code below to fetch the live streaming presigned URL.

```python
# Get the automation endpoint websocket URL and signed headers for the Agent to connect to
ws_url, headers = browser_client.generate_ws_headers()
print(f"\n📡 WebSocket URL: {ws_url[:60]}...")
print(f"🔐 Headers configured: {list(headers.keys())}")

# Get presigned live-view URL that expires in 5 minutes
live_view_url = browser_client.generate_live_view_url(expires=300)
print("\n🔗 Live View URL generated (expires in 300 seconds)")
print(f"   URL: {live_view_url[:80]}...")

# Create and start the browser control server
control_server = BrowserControlServer(browser_client, port=8081)
control_api_url = control_server.start()
print(f"\n🌐 Control API server running at: {control_api_url}")
print(f"   API endpoint: {control_api_url}/api/update_browser_stream")

# Store these for the frontend
session_data = {
    "presignedUrl": live_view_url,
    "sessionId": "demo-session",
    "authToken": "demo-session",
}

print("\n✅ Ready to connect from frontend!")
```

## Step 3: Create and Launch Live View

This step will automatically:

✅ Create HTML page with DCV integration

✅ Inject your presigned URL automatically

✅ Add Human Take Over button for browser control

✅ Add resolution selection controls (720p, 900p, 1080p, 1440p)

✅ Verify all required files are in place

✅ Start local web server (port 8080)

✅ Open browser automatically

### What you'll see:

1. HTML file created with your actual presigned URL
2. File structure verified
3. Web server starts
4. Browser opens showing live browser stream

### Features of the viewer:

- Real-time browser streaming via DCV
- Human Take Over button to control the browser manually
- Resolution controls to adjust display size (720p to 1440p)
- Status indicators (Loading → Authenticating → Connected)
- Automatic error handling
- Clean UI with information panel

**Note:** The web server will keep running. To stop it, click the stop button (■) or restart the kernel.

```python
import http.server
import socketserver
import webbrowser
import time
import os

# Configuration
HTML_FILE = "browser_live_view.html"
SERVER_PORT = 8080
SERVER_URL = f"http://localhost:{SERVER_PORT}/{HTML_FILE}"
CONTROL_API_URL = "http://localhost:8081"  # URL of the control API server


def create_html_with_url(presigned_url, session_id="demo-session"):
    """Create HTML file with presigned URL already injected"""
    print("📝 Creating HTML file with live view integration...")

    html_content = f"""<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Browser Live View - AWS AgentCore</title>
    <style>
        * {{
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }}
        body {{
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            min-height: 100vh;
            padding: 20px;
        }}
        .container {{
            max-width: 1600px;
            margin: 0 auto;
        }}
        .header {{
            background: white;
            padding: 20px 30px;
            border-radius: 10px;
            margin-bottom: 20px;
            box-shadow: 0 4px 6px rgba(0,0,0,0.1);
        }}
        h1 {{
            color: #333;
            font-size: 28px;
            margin-bottom: 10px;
        }}
        .subtitle {{
            color: #666;
            font-size: 14px;
        }}
        .status {{
            padding: 15px 20px;
            margin-bottom: 20px;
            border-radius: 8px;
            font-weight: 600;
            display: flex;
            align-items: center;
            gap: 10px;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
            transition: all 0.3s ease;
        }}
        .status.loading {{
            background: #fff3cd;
            color: #856404;
            border-left: 4px solid #ffc107;
        }}
        .status.connected {{
            background: #d4edda;
            color: #155724;
            border-left: 4px solid #28a745;
        }}
        .status.error {{
            background: #f8d7da;
            color: #721c24;
            border-left: 4px solid #dc3545;
        }}
        .spinner {{
            width: 20px;
            height: 20px;
            border: 3px solid #f3f3f3;
            border-top: 3px solid #856404;
            border-radius: 50%;
            animation: spin 1s linear infinite;
        }}
        @keyframes spin {{
            0% {{ transform: rotate(0deg); }}
            100% {{ transform: rotate(360deg); }}
        }}
        .viewer-container {{
            background: white;
            border-radius: 10px;
            padding: 20px;
            box-shadow: 0 4px 6px rgba(0,0,0,0.1);
            margin-bottom: 20px;
        }}
        #dcv-display {{
            width: 100%;
            height: 800px;
            border: 2px solid #e0e0e0;
            border-radius: 8px;
            background: #000;
            /* Changed from overflow: hidden to overflow: auto to enable scrolling */
            overflow: auto;
            position: relative;
        }}
        .info-panel {{
            background: white;
            padding: 20px;
            border-radius: 10px;
            box-shadow: 0 4px 6px rgba(0,0,0,0.1);
        }}
        .info-panel h3 {{
            color: #333;
            margin-bottom: 15px;
            font-size: 18px;
        }}
        .info-item {{
            display: flex;
            align-items: center;
            gap: 10px;
            padding: 10px;
            background: #f8f9fa;
            border-radius: 5px;
            margin-bottom: 10px;
        }}
        .info-item strong {{
            color: #667eea;
            min-width: 120px;
        }}
        .badge {{
            display: inline-block;
            padding: 4px 12px;
            border-radius: 12px;
            font-size: 12px;
            font-weight: 600;
            background: #667eea;
            color: white;
        }}
        .resolution-control {{
            display: flex;
            align-items: center;
            gap: 15px;
            padding: 10px 15px;
            background-color: #f9f9f9;
            border-radius: 8px;
            border: 1px solid #e1e1e1;
            margin-bottom: 15px;
        }}
        .resolution-label {{
            font-size: 14px;
            font-weight: 500;
            color: #333;
            white-space: nowrap;
        }}
        .resolution-options {{
            display: flex;
            gap: 8px;
            flex-wrap: wrap;
        }}
        .resolution-button {{
            padding: 6px 12px;
            border-radius: 4px;
            font-size: 13px;
            font-weight: 500;
            cursor: pointer;
            border: 1px solid #ccc;
            background: #fff;
            transition: all 0.2s ease;
        }}
        .resolution-button:hover {{
            border-color: #667eea;
        }}
        .resolution-button.active {{
            background: #667eea;
            color: white;
            border-color: #667eea;
        }}
        .resolution-info {{
            font-size: 12px;
            color: #666;
            margin-left: auto;
            white-space: nowrap;
        }}
        .control-panel {{
            display: flex;
            align-items: center;
            gap: 15px;
            padding: 10px 15px;
            background-color: #f9f9f9;
            border-radius: 8px;
            border: 1px solid #e1e1e1;
            margin-bottom: 15px;
        }}
        .control-label {{
            font-size: 14px;
            font-weight: 500;
            color: #333;
            white-space: nowrap;
        }}
        .control-button {{
            padding: 6px 16px;
            border-radius: 4px;
            font-size: 13px;
            font-weight: 500;
            cursor: pointer;
            border: 1px solid #ccc;
            transition: all 0.2s ease;
        }}
        .btn-take-control {{
            background: #28a745;
            color: white;
            border-color: #28a745;
        }}
        .btn-take-control:hover {{
            background: #218838;
            border-color: #1e7e34;
        }}
        .btn-give-control {{
            background: #dc3545;
            color: white;
            border-color: #dc3545;
        }}
        .btn-give-control:hover {{
            background: #c82333;
            border-color: #bd2130;
        }}
        .control-status {{
            font-size: 12px;
            color: #666;
            margin-left: auto;
        }}
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>🖥️ Browser Live View</h1>
            <div class="subtitle">
                Real-time streaming powered by AWS AgentCore & Amazon DCV
            </div>
        </div>

        <div id="status" class="status loading">
            <div class="spinner"></div>
            <span>Loading DCV SDK and connecting...</span>
        </div>

        <div class="viewer-container">
            <!-- Control Panel -->
            <div class="control-panel">
                <span class="control-label">Browser Control:</span>
                <button id="take-control-btn" class="control-button btn-take-control">
                    🎮 Human Take Over
                </button>
                <button id="give-control-btn" class="control-button btn-give-control" style="display:none">
                    🤖 Give Back Control
                </button>
                <span class="control-status" id="control-status">Automation Active</span>
            </div>
            
            <!-- Resolution Control -->
            <div class="resolution-control">
                <span class="resolution-label">Display Size:</span>
                <div class="resolution-options" id="resolution-buttons">
                    <button class="resolution-button" data-resolution="720p" title="1280×720">720p</button>
                    <button class="resolution-button active" data-resolution="900p" title="1600×900">900p</button>
                    <button class="resolution-button" data-resolution="1080p" title="1920×1080">1080p</button>
                    <button class="resolution-button" data-resolution="1440p" title="2560×1440">1440p</button>
                </div>
                <span class="resolution-info" id="current-resolution">Current: 1600×900</span>
            </div>

            <div id="dcv-display"></div>
        </div>

        <div class="info-panel">
            <h3>ℹ️ Session Information</h3>
            <div class="info-item">
                <strong>Session ID:</strong>
                <span>{session_id}</span>
            </div>
            <div class="info-item">
                <strong>Streaming Protocol:</strong>
                <span>Amazon DCV (NICE DCV)</span>
            </div>
            <div class="info-item">
                <strong>Browser Backend:</strong>
                <span>AWS Bedrock AgentCore</span>
            </div>
            <div class="info-item">
                <strong>Status:</strong>
                <span id="connection-status" class="badge">Connecting...</span>
            </div>
        </div>
    </div>

    <script>
        // Auto-injected configuration
        const CONFIG = {{
            presignedUrl: '{presigned_url}',
            sessionId: '{session_id}',
            authToken: '{session_id}',
            controlApiUrl: '{CONTROL_API_URL}'  // Injected control API URL
        }};

        // Resolution settings
        const RESOLUTIONS = {{
            '720p': {{ width: 1280, height: 720 }},
            '900p': {{ width: 1600, height: 900 }},
            '1080p': {{ width: 1920, height: 1080 }},
            '1440p': {{ width: 2560, height: 1440 }}
        }};
        let currentResolution = '900p'; // Default resolution
        let hasControl = false; // Track control state

        const statusDiv = document.getElementById('status');
        const statusBadge = document.getElementById('connection-status');
        const spinnerDiv = statusDiv.querySelector('.spinner');
        const resolutionInfo = document.getElementById('current-resolution');
        const resolutionButtons = document.getElementById('resolution-buttons').querySelectorAll('.resolution-button');
        const takeControlBtn = document.getElementById('take-control-btn');
        const giveControlBtn = document.getElementById('give-control-btn');
        const controlStatus = document.getElementById('control-status');
        let dcvConnection = null;

        // Initialize resolution buttons
        resolutionButtons.forEach(button => {{
            button.addEventListener('click', () => {{
                const resolution = button.dataset.resolution;
                changeResolution(resolution);
            }});
        }});

        // Initialize control buttons
        takeControlBtn.addEventListener('click', takeControl);
        giveControlBtn.addEventListener('click', giveBackControl);

        // Take control function
        async function takeControl() {{
            try {{
                updateStatus('Taking control of browser...', 'loading', 'Taking Control');
                
                const response = await fetch(`${{CONFIG.controlApiUrl}}/api/update_browser_stream`, {{
                    method: 'POST',
                    headers: {{
                        'Content-Type': 'application/json'
                    }},
                    body: JSON.stringify({{
                        automationStreamUpdate: {{
                            streamStatus: 'disabled'
                        }}
                    }})
                }});
                
                if (response.ok) {{
                    const result = await response.json();
                    hasControl = true;
                    takeControlBtn.style.display = 'none';
                    giveControlBtn.style.display = 'inline-block';
                    controlStatus.textContent = '🎮 Human Control Active';
                    updateStatus('✅ You now have control of the browser', 'connected', 'Human Control');
                    console.log('Successfully took control of browser:', result);
                }} else {{
                    const errorText = await response.text();
                    updateStatus('❌ Failed to take control of browser', 'error', 'Error');
                    console.error('Failed to take control:', errorText);
                }}
            }} catch (error) {{
                console.error('Error taking control:', error);
                updateStatus(`❌ Error: ${{error.message}}`, 'error', 'Error');
            }}
        }}

        // Give back control function
        async function giveBackControl() {{
            try {{
                updateStatus('Giving back control...', 'loading', 'Releasing Control');
                
                const response = await fetch(`${{CONFIG.controlApiUrl}}/api/update_browser_stream`, {{
                    method: 'POST',
                    headers: {{
                        'Content-Type': 'application/json'
                    }},
                    body: JSON.stringify({{
                        automationStreamUpdate: {{
                            streamStatus: 'enabled'
                        }}
                    }})
                }});
                
                if (response.ok) {{
                    const result = await response.json();
                    hasControl = false;
                    takeControlBtn.style.display = 'inline-block';
                    giveControlBtn.style.display = 'none';
                    controlStatus.textContent = 'Automation Active';
                    updateStatus('✅ Returned control to automation', 'connected', 'Automation Active');
                    console.log('Successfully gave back control:', result);
                }} else {{
                    const errorText = await response.text();
                    updateStatus('❌ Failed to give back control', 'error', 'Error');
                    console.error('Failed to give back control:', errorText);
                }}
            }} catch (error) {{
                console.error('Error giving back control:', error);
                updateStatus(`❌ Error: ${{error.message}}`, 'error', 'Error');
            }}
        }}

        function changeResolution(resolutionId) {{
            // Update UI first
            currentResolution = resolutionId;

            // Update buttons
            resolutionButtons.forEach(btn => {{
                btn.classList.toggle('active', btn.dataset.resolution === resolutionId);
            }});

            // Update info text
            const resolution = RESOLUTIONS[resolutionId];
            resolutionInfo.textContent = `Current: ${{resolution.width}}×${{resolution.height}}`;

            // Update DCV display layout if connection is established
            if (dcvConnection && dcvConnection.requestDisplayLayout) {{
                console.log(`Changing resolution to: ${{resolution.width}}×${{resolution.height}}`);

                dcvConnection.requestDisplayLayout([{{
                    name: "Main Display",
                    rect: {{
                        x: 0,
                        y: 0,
                        width: resolution.width,
                        height: resolution.height
                    }},
                    primary: true
                }}]);

                // Adjust container aspect ratio for better viewing
                const container = document.getElementById('dcv-display');
                if (container) {{
                    const aspectRatio = resolution.height / resolution.width;
                    const containerWidth = container.clientWidth;
                    const newHeight = Math.min(containerWidth * aspectRatio, 800);
                    container.style.height = `${{newHeight}}px`;
                }}
            }}
        }}

        function updateStatus(message, type = 'loading', badgeText = null) {{
            const span = statusDiv.querySelector('span');
            span.textContent = message;
            statusDiv.className = `status ${{type}}`;

            if (type === 'loading') {{
                spinnerDiv.style.display = 'block';
            }} else {{
                spinnerDiv.style.display = 'none';
            }}

            if (badgeText && statusBadge) {{
                statusBadge.textContent = badgeText;
                statusBadge.style.background = type === 'connected' ? '#28a745' :
                                              type === 'error' ? '#dc3545' : '#ffc107';
            }}
        }}

        function loadDCVSDK() {{
            return new Promise((resolve, reject) => {{
                updateStatus('📦 Loading DCV SDK...', 'loading', 'Loading SDK');

                const script = document.createElement('script');
                script.src = '/dcv-sdk/dcvjs-umd/dcv.js';

                script.onload = () => {{
                    if (!window.dcv) {{
                        reject(new Error('DCV SDK loaded but window.dcv not available'));
                        return;
                    }}

                    // HOTFIX: Check if setWorkerPath exists before calling
                    // Some DCV SDK versions might not have this function
                    if (typeof window.dcv.setWorkerPath === 'function') {{
                        try {{
                            window.dcv.setWorkerPath(
                                window.location.origin + '/dcv-sdk/dcvjs-umd/dcv/'
                            );
                            console.log('✅ Worker path configured');
                        }} catch (e) {{
                            console.warn('⚠️ Could not set worker path:', e);
                            // Continue anyway, baseUrl in connect() should handle it
                        }}
                    }} else {{
                        console.log('ℹ️ setWorkerPath not available, will use baseUrl in connect()');
                    }}

                    console.log('✅ DCV SDK loaded successfully');
                    resolve();
                }};

                script.onerror = () => {{
                    reject(new Error('Failed to load DCV SDK. Check if dcv-sdk files exist.'));
                }};

                document.head.appendChild(script);
            }});
        }}

        function authenticateWithDCV() {{
            return new Promise((resolve, reject) => {{
                updateStatus('🔐 Authenticating with DCV server...', 'loading', 'Authenticating');

                window.dcv.authenticate(CONFIG.presignedUrl, {{
                    promptCredentials: (authType, callback) => {{
                        // For presigned URLs, credentials are embedded in the URL
                        // No need to prompt user for credentials
                        console.log('📝 Credentials prompt (using presigned URL)');
                        callback(null, null);
                    }},
                    httpExtraSearchParams: (method, url, body) => {{
                        // Extract query parameters from presigned URL and pass them to WebSocket
                        try {{
                            const parsedUrl = new URL(CONFIG.presignedUrl);
                            const searchParams = parsedUrl.searchParams;
                            console.log('📡 Adding auth params to WebSocket request');
                            return searchParams;
                        }} catch (e) {{
                            console.error('Failed to parse presigned URL:', e);
                            return new URLSearchParams();
                        }}
                    }},
                    success: (auth, result) => {{
                        console.log('✅ Authentication successful');
                        const credentials = result[0];
                        resolve({{
                            presignedUrl: CONFIG.presignedUrl,
                            sessionId: credentials.sessionId,
                            authToken: credentials.authToken
                        }});
                    }},
                    error: (auth, error) => {{
                        console.error('❌ Authentication failed:', error);
                        reject(new Error('Authentication failed: ' + JSON.stringify(error)));
                    }}
                }});
            }});
        }}

        function connectToDCV(credentials) {{
            updateStatus('🔌 Connecting to browser session...', 'loading', 'Connecting');

            const resolution = RESOLUTIONS[currentResolution];
            console.log(`Initial resolution: ${{resolution.width}}×${{resolution.height}}`);

            const dcvConfig = {{
                url: credentials.presignedUrl,
                sessionId: credentials.sessionId,
                authToken: credentials.authToken,
                divId: 'dcv-display',
                baseUrl: window.location.origin + '/dcv-sdk/dcvjs-umd',
                observers: {{
                    httpExtraSearchParams: (method, url, body) => {{
                        // Extract query parameters from presigned URL for streaming connection
                        try {{
                            const parsedUrl = new URL(credentials.presignedUrl);
                            const searchParams = parsedUrl.searchParams;
                            console.log('📡 Adding auth params to streaming connection');
                            return searchParams;
                        }} catch (e) {{
                            console.error('Failed to parse presigned URL:', e);
                            return new URLSearchParams();
                        }}
                    }},
                    firstFrame: () => {{
                        console.log('✅ First frame received');
                        updateStatus('✅ Connected! Streaming browser view...', 'connected', 'Live');

                        // Apply initial resolution after connection is established
                        setTimeout(() => {{
                            if (dcvConnection && dcvConnection.requestDisplayLayout) {{
                                dcvConnection.requestDisplayLayout([{{
                                    name: "Main Display",
                                    rect: {{
                                        x: 0,
                                        y: 0,
                                        width: resolution.width,
                                        height: resolution.height
                                    }},
                                    primary: true
                                }}]);
                                console.log(`Applied initial resolution: ${{resolution.width}}×${{resolution.height}}`);
                            }}
                        }}, 1000);
                    }},
                    displayLayout: (serverWidth, serverHeight, heads) => {{
                        console.log(`Display layout changed: ${{serverWidth}}×${{serverHeight}}`);
                    }},
                    error: (error) => {{
                        console.error('❌ Connection error:', error);
                        updateStatus('❌ Connection error: ' + JSON.stringify(error), 'error', 'Error');
                    }},
                    close: (closeInfo) => {{
                        console.log('Connection closed:', closeInfo);
                        updateStatus('⚠️ Connection closed', 'error', 'Disconnected');
                    }}
                }}
            }};

            window.dcv.connect(dcvConfig)
                .then(connection => {{
                    console.log('Connection established');
                    dcvConnection = connection;

                    // Apply initial resolution
                    setTimeout(() => {{
                        if (connection.requestDisplayLayout) {{
                            connection.requestDisplayLayout([{{
                                name: "Main Display",
                                rect: {{
                                    x: 0,
                                    y: 0,
                                    width: resolution.width,
                                    height: resolution.height
                                }},
                                primary: true
                            }}]);
                            console.log(`Applied initial resolution: ${{resolution.width}}×${{resolution.height}}`);
                        }}
                    }}, 500);
                }})
                .catch(error => {{
                    console.error('Connection failed:', error);
                    updateStatus('❌ Connection error: ' + JSON.stringify(error), 'error', 'Error');
                }});
        }}

        async function initialize() {{
            try {{
                console.log('🚀 Starting live view initialization...');
                console.log('Session ID:', CONFIG.sessionId);

                await loadDCVSDK();
                const credentials = await authenticateWithDCV();
                connectToDCV(credentials);

            }} catch (error) {{
                console.error('Initialization failed:', error);
                updateStatus('❌ Error: ' + error.message, 'error', 'Failed');
            }}
        }}

        window.addEventListener('load', initialize);

        window.addEventListener('beforeunload', () => {{
            if (window.dcv && typeof window.dcv.disconnect === 'function') {{
                window.dcv.disconnect();
            }}
        }});
    </script>
</body>
</html>"""

    with open(HTML_FILE, "w", encoding="utf-8") as f:
        f.write(html_content)

    print(f"   ✅ Created {HTML_FILE}")
    print("   📍 Presigned URL injected (expires in 5 minutes)")
    print(f"   🔌 Control API URL configured: {CONTROL_API_URL}")
    return True


def verify_file_structure():
    """Verify all required files are in place"""
    print("\n🔍 Verifying file structure...")

    required = [
        (HTML_FILE, "HTML page"),
        ("dcv-sdk/dcvjs-umd/dcv.js", "DCV SDK (UMD)"),
        ("dcv-sdk/dcvjs-umd/dcv", "DCV workers directory"),
    ]

    all_good = True
    for path, description in required:
        exists = os.path.exists(path)
        icon = "✓" if exists else "✗"
        status = "Found" if exists else "MISSING"
        print(f"   {icon} {description}: {status}")
        if not exists:
            all_good = False

    return all_good


def start_web_server():
    """Start HTTP server in background thread"""

    class QuietHandler(http.server.SimpleHTTPRequestHandler):
        def log_message(self, format, *args):
            # Only log errors
            if args[1] != "200":
                super().log_message(format, *args)

    handler = QuietHandler

    try:
        httpd = socketserver.TCPServer(("", SERVER_PORT), handler)

        # Start server in background thread
        server_thread = threading.Thread(target=httpd.serve_forever, daemon=True)
        server_thread.start()

        return httpd, server_thread
    except OSError as e:
        if e.errno == 48 or e.errno == 98:  # Address already in use
            print(f"   ⚠️  Port {SERVER_PORT} already in use")
            print("   ℹ️  Server might already be running")
            return None, None
        raise


# ============================================================================
# Main Execution
# ============================================================================

print("=" * 70)
print("🚀 AUTOMATIC LIVE VIEW SETUP")
print("=" * 70)

try:
    # Step 1: Create HTML with presigned URL
    if not create_html_with_url(live_view_url, session_data["sessionId"]):
        raise Exception("Failed to create HTML file")

    # Step 2: Verify file structure
    if not verify_file_structure():
        print("\n❌ Missing required files!")
        print("   Please make sure you ran the DCV SDK download step first.")
        print("\n⚠️  Skipping web server setup due to missing files.")
    else:
        print("\n✅ All files ready!")

        # Step 3: Start web server
        print("\n🌐 Starting web server...")
        httpd, server_thread = start_web_server()

        if httpd:
            print(f"   ✅ Server running on port {SERVER_PORT}")
            print(f"   📍 URL: {SERVER_URL}")

            # Step 4: Open browser
            print("\n🌐 Opening browser...")
            time.sleep(1)  # Give server time to start

            try:
                webbrowser.open(SERVER_URL)
                print("   ✅ Browser opened!")
            except Exception as e:
                print(f"   ⚠️  Could not auto-open browser: {e}")
                print(f"   ℹ️  Please manually open: {SERVER_URL}")

            # Success message
            print("\n" + "=" * 70)
            print("✅ LIVE VIEW IS READY!")
            print("=" * 70)
            print("\n📺 What you should see in the browser:")
            print("   1. Status: Loading... → Authenticating... → Connected!")
            print("   2. Live browser stream appears in the black area")
            print("   3. Human Take Over button to control the browser")
            print("   4. Resolution controls to adjust the display size")
            print("   5. Session information displayed below")
            print("   6. You can scroll within the browser view using mouse wheel")
            print("\n⚠️  IMPORTANT:")
            print("   - Server is running in background")
            print("   - Presigned URL expires in 5 minutes")
            print("   - Control API running on port 8081")
            print("   - To stop server: Click ■ (stop) button or restart kernel")
            print("\n🔗 Access URL: " + SERVER_URL)
            print("=" * 70)

            # Keep server info accessible
            print("\n💡 Tip: Leave this cell running to keep the server active.")

        else:
            print("\n⚠️  Server might already be running")
            print(f"   Try opening: {SERVER_URL}")

except Exception as e:
    print(f"\n❌ Setup failed: {e}")
    import traceback

    traceback.print_exc()
    print("\n💡 Troubleshooting:")
    print("   1. Make sure you ran Step 0 and Step 1 first")
    print("   2. Verify DCV SDK is downloaded (check previous cells)")
    print("   3. Check if port 8080 is available")
```

## Cleanup: Stop the Browser Session

When you're done testing, remember to stop the browser session to avoid unnecessary charges.

```python
# # Stop the browser session
if browser_client:
    browser_client.stop()
    print("✅ Browser session stopped")
else:
    print("⚠️ No active browser session to stop")
```

## Troubleshooting

### Common Issues

#### 1. "Failed to load DCV SDK"

**Problem:** The HTML page can't find the DCV SDK files.

**Solution:**
- Verify `dcv-sdk/dcvjs-umd/dcv.js` exists in your project
- Check that you're serving files via HTTP (not opening HTML directly)
- Use `python -m http.server 8080` to serve files

#### 2. "Authentication failed"

**Problem:** The presigned URL is invalid or expired.

**Solution:**
- Presigned URLs expire in 5 minutes by default
- Re-run Step 2.1 to generate a fresh URL and Step 3 to embed the new URL in the webapp. Refresh your local browser page and you should reconnect to the existing AgentCore browser session
- Make sure you copied the entire URL (it's very long!)

#### 3. Black screen / no video

**Problem:** DCV connects but doesn't show the browser.

**Solution:**
- Check browser console for errors
- Verify `setWorkerPath` is correct
- Ensure `baseUrl` parameter is set in `dcv.connect()`

#### 4. CORS errors

**Problem:** Browser blocks requests due to CORS policy.

**Solution:**
- Don't open HTML files directly (file:// protocol)
- Use a local web server: `python -m http.server 8080`
- If using backend API, ensure Flask CORS is configured

### Getting Help

If you're still stuck:

1. Check browser console (F12) for error messages
2. Verify all file paths are correct
3. Ensure AWS credentials are configured
4. Check that AgentCore Browser service is available in your region

## Complete Implementation Example

For a complete implementation example with React, WebSocket updates, and production features, check out:

**GitHub Repository:**
https://github.com/aws-samples/sample-browser-order-automation-agentcore

This sample includes:
- Full React application
- FastAPI backend
- Real-time status updates
- Session recording
- Multi-agent orchestration

### Key Files to Review

- `frontend/src/components/LiveBrowserViewer.js` - React component implementation
- `backend/services/browser_service.py` - Browser session management
- `backend/app.py` - API endpoints

## Summary

In this tutorial, you learned how to:

✅ Set up AgentCore Browser client in Python

✅ Generate presigned URLs for secure streaming

✅ Download and configure the DCVjs SDK

✅ Create an HTML page that streams browser view in real-time

✅ Add a Human Take Over button to control the browser manually

✅ Add resolution controls to adjust display size (720p, 900p, 1080p, 1440p)

✅ Handle authentication and connection properly

✅ Implement a control API for toggling automation mode

✅ Troubleshoot common issues

### Next Steps

- Add more interactive controls to your HTML page
- Integrate with AI agents (Nova Act, Strands)
- Build a production backend with FastAPI
- Implement session recording
- Add user authentication

**Happy building! 🚀**
