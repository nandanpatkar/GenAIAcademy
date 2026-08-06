// Auto-generated index of the Amazon Bedrock AgentCore samples.
//
// Source: awslabs/amazon-bedrock-agentcore-samples (Apache-2.0). The sample
// bodies live under public/agentcore-samples/, mirroring the upstream layout,
// and are fetched on demand by SampleViewer. Notebooks are flattened to
// Markdown at build time (outputs stripped).
//
// Regenerate with: python3 scripts/build_agentcore_samples.py — do not hand-edit.

export const AGENTCORE_SAMPLES_TOTAL = 455;

export const AGENTCORE_SAMPLES = [
  {
    "slug": "00-getting-started",
    "title": "Getting Started with Amazon Bedrock AgentCore",
    "desc": "Build, test, and deploy an AI agent to AgentCore in under 10 minutes.",
    "sectionId": null,
    "kind": "getting-started",
    "frameworks": [
      "Strands",
      "LangGraph",
      "CrewAI",
      "OpenAI Agents"
    ],
    "languages": [
      "python"
    ],
    "hasNotebook": false,
    "readme": "/agentcore-samples/00-getting-started/README.md",
    "base": "/agentcore-samples/00-getting-started",
    "files": [
      {
        "path": "main.py",
        "lang": "python",
        "bytes": 5650
      }
    ]
  },
  {
    "slug": "01-features/01-harness/00-getting-started",
    "title": "Getting Started with AgentCore harness",
    "desc": "This tutorial walks through the complete harness workflow: creating an IAM execution role, creating a harness agent, invoking it with two different Claude models in the same session, and using...",
    "sectionId": "harness",
    "kind": "feature",
    "frameworks": [],
    "languages": [
      "python"
    ],
    "hasNotebook": false,
    "readme": "/agentcore-samples/01-features/01-harness/00-getting-started/README.md",
    "base": "/agentcore-samples/01-features/01-harness/00-getting-started",
    "files": [
      {
        "path": "getting_started.py",
        "lang": "python",
        "bytes": 8215
      }
    ]
  },
  {
    "slug": "01-features/01-harness/01-advanced-examples/01-custom-containers",
    "title": "Custom Containers",
    "desc": "Attach any custom container image to a harness so the agent runs in your own environment. Demonstrates Node.js, Go, and Python container presets, plus cross-compilation on Go.",
    "sectionId": "harness",
    "kind": "feature",
    "frameworks": [],
    "languages": [
      "python"
    ],
    "hasNotebook": false,
    "readme": "/agentcore-samples/01-features/01-harness/01-advanced-examples/01-custom-containers/README.md",
    "base": "/agentcore-samples/01-features/01-harness/01-advanced-examples/01-custom-containers",
    "files": [
      {
        "path": "custom_container.py",
        "lang": "python",
        "bytes": 14668
      }
    ]
  },
  {
    "slug": "01-features/01-harness/01-advanced-examples/02-gateway-integration",
    "title": "gateway Integration",
    "desc": "Demonstrates the full AgentCore gateway lifecycle: create a gateway with MCP protocol, add an MCP target (Exa search), wire it to a harness, and invoke the agent so it discovers and calls tools...",
    "sectionId": "harness",
    "kind": "feature",
    "frameworks": [],
    "languages": [
      "python"
    ],
    "hasNotebook": false,
    "readme": "/agentcore-samples/01-features/01-harness/01-advanced-examples/02-gateway-integration/README.md",
    "base": "/agentcore-samples/01-features/01-harness/01-advanced-examples/02-gateway-integration",
    "files": [
      {
        "path": "gateway_integration.py",
        "lang": "python",
        "bytes": 16360
      }
    ]
  },
  {
    "slug": "01-features/01-harness/01-advanced-examples/03-execution-limits",
    "title": "Execution Limits",
    "desc": "Control how much work a harness agent can do per invocation using three limit parameters. Each limit is demonstrated with before/after comparisons showing the difference.",
    "sectionId": "harness",
    "kind": "feature",
    "frameworks": [],
    "languages": [
      "python"
    ],
    "hasNotebook": false,
    "readme": "/agentcore-samples/01-features/01-harness/01-advanced-examples/03-execution-limits/README.md",
    "base": "/agentcore-samples/01-features/01-harness/01-advanced-examples/03-execution-limits",
    "files": [
      {
        "path": "execution_limits.py",
        "lang": "python",
        "bytes": 10007
      }
    ]
  },
  {
    "slug": "01-features/01-harness/01-advanced-examples/04-mcp-integration",
    "title": "MCP Integration",
    "desc": "Connect harness agents to external MCP servers for web search, APIs, and custom tools. Covers single MCP tool, multiple tools, authenticated servers, error handling, and a full research assistant...",
    "sectionId": "harness",
    "kind": "feature",
    "frameworks": [],
    "languages": [
      "python"
    ],
    "hasNotebook": false,
    "readme": "/agentcore-samples/01-features/01-harness/01-advanced-examples/04-mcp-integration/README.md",
    "base": "/agentcore-samples/01-features/01-harness/01-advanced-examples/04-mcp-integration",
    "files": [
      {
        "path": "mcp_integration.py",
        "lang": "python",
        "bytes": 16348
      }
    ]
  },
  {
    "slug": "01-features/01-harness/01-advanced-examples/05-agent-skills",
    "title": "Agent Skills",
    "desc": "Extend agent capabilities with pre-built skill bundles that provide specialized instructions, code templates, and domain knowledge. Demonstrates the xlsx skill to create professional Excel...",
    "sectionId": "harness",
    "kind": "feature",
    "frameworks": [],
    "languages": [
      "python"
    ],
    "hasNotebook": false,
    "readme": "/agentcore-samples/01-features/01-harness/01-advanced-examples/05-agent-skills/README.md",
    "base": "/agentcore-samples/01-features/01-harness/01-advanced-examples/05-agent-skills",
    "files": [
      {
        "path": "agent_skills.py",
        "lang": "python",
        "bytes": 16450
      }
    ]
  },
  {
    "slug": "01-features/01-harness/01-advanced-examples/06-async-step-function",
    "title": "Async Step Functions with AgentCore Harness",
    "desc": "Build serverless, event-driven AI workflows using AWS Step Functions to orchestrate AgentCore harness invocations.",
    "sectionId": "harness",
    "kind": "feature",
    "frameworks": [],
    "languages": [],
    "hasNotebook": false,
    "readme": "/agentcore-samples/01-features/01-harness/01-advanced-examples/06-async-step-function/README.md",
    "base": "/agentcore-samples/01-features/01-harness/01-advanced-examples/06-async-step-function",
    "files": [
      {
        "path": "cleanup.sh",
        "lang": "bash",
        "bytes": 3191
      },
      {
        "path": "cloudformation.yaml",
        "lang": "yaml",
        "bytes": 20140
      },
      {
        "path": "deploy.sh",
        "lang": "bash",
        "bytes": 2926
      },
      {
        "path": "example_inputs.json",
        "lang": "json",
        "bytes": 1128
      },
      {
        "path": "test_workflow.sh",
        "lang": "bash",
        "bytes": 6610
      }
    ]
  },
  {
    "slug": "01-features/01-harness/01-advanced-examples/07-oauth",
    "title": "OAuth + JWT Auth (Inbound + Outbound)",
    "desc": "Production agents need both inbound authentication (who can call your agent) and outbound authentication (how the agent calls tools). This tutorial provisions two Cognito pools, an AgentCore...",
    "sectionId": "harness",
    "kind": "feature",
    "frameworks": [],
    "languages": [
      "python"
    ],
    "hasNotebook": false,
    "readme": "/agentcore-samples/01-features/01-harness/01-advanced-examples/07-oauth/README.md",
    "base": "/agentcore-samples/01-features/01-harness/01-advanced-examples/07-oauth",
    "files": [
      {
        "path": "oauth_gateway.py",
        "lang": "python",
        "bytes": 14911
      },
      {
        "path": "utils/__init__.py",
        "lang": "python",
        "bytes": 63
      },
      {
        "path": "utils/lambda_function_code.py",
        "lang": "python",
        "bytes": 2971
      },
      {
        "path": "utils/setup_helpers.py",
        "lang": "python",
        "bytes": 41112
      }
    ]
  },
  {
    "slug": "01-features/01-harness/01-advanced-examples/08-gemini-model-provider",
    "title": "Gemini Harness (AgentCore CLI)",
    "desc": "Run an AgentCore Harness on a Google Gemini model, built entirely with the AgentCore CLI.",
    "sectionId": "harness",
    "kind": "feature",
    "frameworks": [],
    "languages": [],
    "hasNotebook": false,
    "readme": "/agentcore-samples/01-features/01-harness/01-advanced-examples/08-gemini-model-provider/README.md",
    "base": "/agentcore-samples/01-features/01-harness/01-advanced-examples/08-gemini-model-provider",
    "files": [
      {
        "path": "demo.sh",
        "lang": "bash",
        "bytes": 7111
      }
    ]
  },
  {
    "slug": "01-features/01-harness/01-advanced-examples/09-openai-model-provider",
    "title": "OpenAI Harness (AgentCore CLI)",
    "desc": "Run an AgentCore Harness on an OpenAI model hosted in Amazon Bedrock (GPT-OSS), built entirely with the AgentCore CLI.",
    "sectionId": "harness",
    "kind": "feature",
    "frameworks": [
      "OpenAI Agents"
    ],
    "languages": [],
    "hasNotebook": false,
    "readme": "/agentcore-samples/01-features/01-harness/01-advanced-examples/09-openai-model-provider/README.md",
    "base": "/agentcore-samples/01-features/01-harness/01-advanced-examples/09-openai-model-provider",
    "files": [
      {
        "path": "demo.sh",
        "lang": "bash",
        "bytes": 6108
      }
    ]
  },
  {
    "slug": "01-features/01-harness/01-advanced-examples/10-getting-started-with-agent-inspector",
    "title": "Getting started with the Agent Inspector",
    "desc": "Deploy a harness from scratch with the AgentCore CLI, then open the Agent Inspector — the local web UI launched by agentcore dev — to chat with the agent and watch its sessions, traces, and spans...",
    "sectionId": "harness",
    "kind": "feature",
    "frameworks": [],
    "languages": [],
    "hasNotebook": false,
    "readme": "/agentcore-samples/01-features/01-harness/01-advanced-examples/10-getting-started-with-agent-inspector/README.md",
    "base": "/agentcore-samples/01-features/01-harness/01-advanced-examples/10-getting-started-with-agent-inspector",
    "files": [
      {
        "path": "cleanup.sh",
        "lang": "bash",
        "bytes": 3386
      },
      {
        "path": "demo.sh",
        "lang": "bash",
        "bytes": 15251
      },
      {
        "path": "system-prompt.md",
        "lang": "markdown",
        "bytes": 373
      }
    ]
  },
  {
    "slug": "01-features/01-harness/01-advanced-examples/11-mantle/endpoint",
    "title": "Run a harness model through the Mantle (OpenAI-compatible) endpoint",
    "desc": "A Bedrock harness can call its model two ways, chosen by one config field, apiFormat. This example uses the OpenAI-compatible Mantle path to run OpenAI's open-weight gpt-oss-120b through Amazon...",
    "sectionId": "harness",
    "kind": "feature",
    "frameworks": [
      "OpenAI Agents"
    ],
    "languages": [],
    "hasNotebook": false,
    "readme": "/agentcore-samples/01-features/01-harness/01-advanced-examples/11-mantle/endpoint/README.md",
    "base": "/agentcore-samples/01-features/01-harness/01-advanced-examples/11-mantle/endpoint",
    "files": [
      {
        "path": "cleanup.sh",
        "lang": "bash",
        "bytes": 3386
      },
      {
        "path": "demo.sh",
        "lang": "bash",
        "bytes": 13342
      },
      {
        "path": "system-prompt.md",
        "lang": "markdown",
        "bytes": 373
      }
    ]
  },
  {
    "slug": "01-features/01-harness/01-advanced-examples/11-mantle/gpt5",
    "title": "Run GPT-5.4 on a harness via the Mantle (OpenAI Responses) endpoint",
    "desc": "This example runs OpenAI's GPT-5.4 on an AgentCore harness by routing inference through the OpenAI-compatible Mantle endpoint. It builds on the endpoint example (which uses the open-weight...",
    "sectionId": "harness",
    "kind": "feature",
    "frameworks": [
      "OpenAI Agents"
    ],
    "languages": [],
    "hasNotebook": false,
    "readme": "/agentcore-samples/01-features/01-harness/01-advanced-examples/11-mantle/gpt5/README.md",
    "base": "/agentcore-samples/01-features/01-harness/01-advanced-examples/11-mantle/gpt5",
    "files": [
      {
        "path": "cleanup.sh",
        "lang": "bash",
        "bytes": 3386
      },
      {
        "path": "demo.sh",
        "lang": "bash",
        "bytes": 12901
      },
      {
        "path": "system-prompt.md",
        "lang": "markdown",
        "bytes": 373
      }
    ]
  },
  {
    "slug": "01-features/01-harness/01-advanced-examples/12-litellm-mantle",
    "title": "Run GPT-5.4 on a harness with a LiteLLM model configuration (routing to Mantle)",
    "desc": "This example runs OpenAI's GPT-5.4 on an AgentCore harness using a LiteLLM model configuration, with LiteLLM routing inference to the OpenAI-compatible Mantle endpoint on Amazon Bedrock.",
    "sectionId": "harness",
    "kind": "feature",
    "frameworks": [
      "OpenAI Agents"
    ],
    "languages": [],
    "hasNotebook": false,
    "readme": "/agentcore-samples/01-features/01-harness/01-advanced-examples/12-litellm-mantle/README.md",
    "base": "/agentcore-samples/01-features/01-harness/01-advanced-examples/12-litellm-mantle",
    "files": [
      {
        "path": "cleanup.sh",
        "lang": "bash",
        "bytes": 3940
      },
      {
        "path": "demo.sh",
        "lang": "bash",
        "bytes": 17244
      },
      {
        "path": "system-prompt.md",
        "lang": "markdown",
        "bytes": 462
      }
    ]
  },
  {
    "slug": "01-features/01-harness/01-advanced-examples/13-aws-skills",
    "title": "AWS Skills",
    "desc": "Give a harness agent native AWS Skills — curated capability bundles from the AWS Agent Toolkit that are baked into the harness runtime image. You enable them declaratively in the skills parameter;...",
    "sectionId": "harness",
    "kind": "feature",
    "frameworks": [],
    "languages": [
      "python"
    ],
    "hasNotebook": false,
    "readme": "/agentcore-samples/01-features/01-harness/01-advanced-examples/13-aws-skills/README.md",
    "base": "/agentcore-samples/01-features/01-harness/01-advanced-examples/13-aws-skills",
    "files": [
      {
        "path": "aws_skills.py",
        "lang": "python",
        "bytes": 12133
      }
    ]
  },
  {
    "slug": "01-features/01-harness/01-advanced-examples/14-s3-filesystem",
    "title": "S3 Filesystem Mount",
    "desc": "A harness session runs in an isolated microVM with an ephemeral disk — when the session ends, anything written to the VM is gone. Mount an S3 Files access point into the VM and the agent gets a...",
    "sectionId": "harness",
    "kind": "feature",
    "frameworks": [],
    "languages": [
      "python"
    ],
    "hasNotebook": false,
    "readme": "/agentcore-samples/01-features/01-harness/01-advanced-examples/14-s3-filesystem/README.md",
    "base": "/agentcore-samples/01-features/01-harness/01-advanced-examples/14-s3-filesystem",
    "files": [
      {
        "path": "provision_s3_filesystem.py",
        "lang": "python",
        "bytes": 52216
      },
      {
        "path": "s3_filesystem.py",
        "lang": "python",
        "bytes": 15600
      },
      {
        "path": "s3_llm_wiki.py",
        "lang": "python",
        "bytes": 20672
      }
    ]
  },
  {
    "slug": "01-features/01-harness/02-use-cases/01-travel-agent",
    "title": "Travel Guide Agent",
    "desc": "A complete travel guide agent that showcases all core harness features working together: HTML generation, AgentCore memory for multi-turn conversations, the browser tool for live web data, and...",
    "sectionId": "harness",
    "kind": "feature",
    "frameworks": [],
    "languages": [
      "python"
    ],
    "hasNotebook": false,
    "readme": "/agentcore-samples/01-features/01-harness/02-use-cases/01-travel-agent/README.md",
    "base": "/agentcore-samples/01-features/01-harness/02-use-cases/01-travel-agent",
    "files": [
      {
        "path": "travel_agent.py",
        "lang": "python",
        "bytes": 17071
      },
      {
        "path": "travel_chat/index.html",
        "lang": "html",
        "bytes": 2962
      },
      {
        "path": "travel_chat/server.py",
        "lang": "python",
        "bytes": 2865
      }
    ]
  },
  {
    "slug": "01-features/01-harness/02-use-cases/02-webapp-visual-testing",
    "title": "Automated Visual QA with harness",
    "desc": "Use the harness microVM as a complete CI/CD test environment. The agent builds a TodoMVC web app, serves it on localhost:3000, writes Puppeteer test scripts in natural language, runs headless...",
    "sectionId": "harness",
    "kind": "feature",
    "frameworks": [],
    "languages": [
      "python"
    ],
    "hasNotebook": false,
    "readme": "/agentcore-samples/01-features/01-harness/02-use-cases/02-webapp-visual-testing/README.md",
    "base": "/agentcore-samples/01-features/01-harness/02-use-cases/02-webapp-visual-testing",
    "files": [
      {
        "path": "webapp_visual_testing.py",
        "lang": "python",
        "bytes": 12042
      }
    ]
  },
  {
    "slug": "01-features/01-harness/02-use-cases/03-aws-builder-agent",
    "title": "AWS Builder Agent — Harness + AWS Skills",
    "desc": "This is the \"how do you build an agent with the harness?\" example — and the answer is harness + AWS Skills. The harness is the agent: you declare the model, the tools, and the skills in one...",
    "sectionId": "harness",
    "kind": "feature",
    "frameworks": [],
    "languages": [
      "python"
    ],
    "hasNotebook": false,
    "readme": "/agentcore-samples/01-features/01-harness/02-use-cases/03-aws-builder-agent/README.md",
    "base": "/agentcore-samples/01-features/01-harness/02-use-cases/03-aws-builder-agent",
    "files": [
      {
        "path": "aws_builder_agent.py",
        "lang": "python",
        "bytes": 11243
      }
    ]
  },
  {
    "slug": "01-features/01-harness/02-use-cases/04-weather-agent",
    "title": "Weather Agent — Harness + Evaluations + Gateway + Observability",
    "desc": "A full-stack weather agent web app that integrates six AgentCore capabilities in a single demo:",
    "sectionId": "harness",
    "kind": "feature",
    "frameworks": [],
    "languages": [
      "javascript",
      "python"
    ],
    "hasNotebook": false,
    "readme": "/agentcore-samples/01-features/01-harness/02-use-cases/04-weather-agent/README.md",
    "base": "/agentcore-samples/01-features/01-harness/02-use-cases/04-weather-agent",
    "files": [
      {
        "path": "backend/agent.py",
        "lang": "python",
        "bytes": 2565
      },
      {
        "path": "backend/evaluation.py",
        "lang": "python",
        "bytes": 5402
      },
      {
        "path": "backend/main.py",
        "lang": "python",
        "bytes": 4500
      },
      {
        "path": "backend/observability.py",
        "lang": "python",
        "bytes": 2104
      },
      {
        "path": "backend/optimization.py",
        "lang": "python",
        "bytes": 4068
      },
      {
        "path": "backend/requirements.txt",
        "lang": "text",
        "bytes": 91
      },
      {
        "path": "backend/resources.py",
        "lang": "python",
        "bytes": 9195
      },
      {
        "path": "backend/skills.py",
        "lang": "python",
        "bytes": 8591
      },
      {
        "path": "cleanup.sh",
        "lang": "bash",
        "bytes": 1741
      },
      {
        "path": "frontend/index.html",
        "lang": "html",
        "bytes": 304
      },
      {
        "path": "frontend/package.json",
        "lang": "json",
        "bytes": 321
      },
      {
        "path": "frontend/src/App.css",
        "lang": "css",
        "bytes": 7479
      },
      {
        "path": "frontend/src/App.jsx",
        "lang": "jsx",
        "bytes": 25756
      },
      {
        "path": "frontend/src/api.js",
        "lang": "javascript",
        "bytes": 1804
      },
      {
        "path": "frontend/src/main.jsx",
        "lang": "jsx",
        "bytes": 232
      },
      {
        "path": "frontend/vite.config.js",
        "lang": "javascript",
        "bytes": 329
      },
      {
        "path": "optimize.py",
        "lang": "python",
        "bytes": 10444
      },
      {
        "path": "run.sh",
        "lang": "bash",
        "bytes": 5570
      },
      {
        "path": "start.sh",
        "lang": "bash",
        "bytes": 5966
      },
      {
        "path": "weather_agent.py",
        "lang": "python",
        "bytes": 20596
      }
    ]
  },
  {
    "slug": "01-features/02-host-your-agent/01-runtime/01-hosting-agents/01-http-protocol/01-strands-bedrock",
    "title": "Strands Agents with Amazon Bedrock on AgentCore runtime",
    "desc": "Deploy a Strands Agents agent using an Amazon Bedrock model (Claude) to AgentCore runtime. This is the simplest path to hosting an agent — write your agent logic, zip it, and deploy with boto3.",
    "sectionId": "runtime",
    "kind": "feature",
    "frameworks": [
      "Strands"
    ],
    "languages": [
      "python"
    ],
    "hasNotebook": false,
    "readme": "/agentcore-samples/01-features/02-host-your-agent/01-runtime/01-hosting-agents/01-http-protocol/01-strands-bedrock/README.md",
    "base": "/agentcore-samples/01-features/02-host-your-agent/01-runtime/01-hosting-agents/01-http-protocol/01-strands-bedrock",
    "files": [
      {
        "path": "agent.py",
        "lang": "python",
        "bytes": 1173
      },
      {
        "path": "cleanup.py",
        "lang": "python",
        "bytes": 2972
      },
      {
        "path": "deploy.py",
        "lang": "python",
        "bytes": 12936
      },
      {
        "path": "invoke.py",
        "lang": "python",
        "bytes": 1927
      },
      {
        "path": "requirements.txt",
        "lang": "text",
        "bytes": 89
      }
    ]
  },
  {
    "slug": "01-features/02-host-your-agent/01-runtime/01-hosting-agents/01-http-protocol/02-langgraph-bedrock",
    "title": "LangGraph with Amazon Bedrock on AgentCore runtime",
    "desc": "Deploy a LangGraph agent using an Amazon Bedrock model (Claude) to AgentCore runtime. This example shows that AgentCore runtime is framework-agnostic — the deployment process is identical...",
    "sectionId": "runtime",
    "kind": "feature",
    "frameworks": [
      "Strands",
      "LangGraph",
      "LangChain"
    ],
    "languages": [
      "python"
    ],
    "hasNotebook": false,
    "readme": "/agentcore-samples/01-features/02-host-your-agent/01-runtime/01-hosting-agents/01-http-protocol/02-langgraph-bedrock/README.md",
    "base": "/agentcore-samples/01-features/02-host-your-agent/01-runtime/01-hosting-agents/01-http-protocol/02-langgraph-bedrock",
    "files": [
      {
        "path": "agent.py",
        "lang": "python",
        "bytes": 4052
      },
      {
        "path": "cleanup.py",
        "lang": "python",
        "bytes": 2891
      },
      {
        "path": "deploy.py",
        "lang": "python",
        "bytes": 12934
      },
      {
        "path": "invoke.py",
        "lang": "python",
        "bytes": 1465
      },
      {
        "path": "requirements.txt",
        "lang": "text",
        "bytes": 99
      }
    ]
  },
  {
    "slug": "01-features/02-host-your-agent/01-runtime/01-hosting-agents/01-http-protocol/03-strands-openai",
    "title": "Strands Agents with Azure OpenAI on AgentCore runtime",
    "desc": "Deploy a Strands Agents agent using Azure OpenAI (GPT-4.1-mini via LiteLLM) to AgentCore runtime. This demonstrates that AgentCore runtime is model-agnostic — you can use any LLM provider, not...",
    "sectionId": "runtime",
    "kind": "feature",
    "frameworks": [
      "Strands",
      "OpenAI Agents"
    ],
    "languages": [
      "python"
    ],
    "hasNotebook": false,
    "readme": "/agentcore-samples/01-features/02-host-your-agent/01-runtime/01-hosting-agents/01-http-protocol/03-strands-openai/README.md",
    "base": "/agentcore-samples/01-features/02-host-your-agent/01-runtime/01-hosting-agents/01-http-protocol/03-strands-openai",
    "files": [
      {
        "path": "agent.py",
        "lang": "python",
        "bytes": 1088
      },
      {
        "path": "cleanup.py",
        "lang": "python",
        "bytes": 2515
      },
      {
        "path": "deploy.py",
        "lang": "python",
        "bytes": 11146
      },
      {
        "path": "invoke.py",
        "lang": "python",
        "bytes": 1152
      },
      {
        "path": "requirements.txt",
        "lang": "text",
        "bytes": 104
      }
    ]
  },
  {
    "slug": "01-features/02-host-your-agent/01-runtime/01-hosting-agents/02-a2a-protocol",
    "title": "Hosting Agents with A2A Protocol",
    "desc": "The Agent-to-Agent (A2A) protocol enables agents to discover and communicate with each other through standardized agent cards and task-based orchestration. AgentCore runtime supports A2A natively...",
    "sectionId": "runtime",
    "kind": "feature",
    "frameworks": [
      "Strands"
    ],
    "languages": [
      "python"
    ],
    "hasNotebook": false,
    "readme": "/agentcore-samples/01-features/02-host-your-agent/01-runtime/01-hosting-agents/02-a2a-protocol/README.md",
    "base": "/agentcore-samples/01-features/02-host-your-agent/01-runtime/01-hosting-agents/02-a2a-protocol",
    "files": [
      {
        "path": "agent.py",
        "lang": "python",
        "bytes": 4209
      },
      {
        "path": "cleanup.py",
        "lang": "python",
        "bytes": 1995
      },
      {
        "path": "deploy.py",
        "lang": "python",
        "bytes": 6814
      },
      {
        "path": "invoke.py",
        "lang": "python",
        "bytes": 1916
      },
      {
        "path": "requirements.txt",
        "lang": "text",
        "bytes": 122
      }
    ]
  },
  {
    "slug": "01-features/02-host-your-agent/01-runtime/01-hosting-agents/03-ag-ui-protocol",
    "title": "Hosting Agents with AG-UI Protocol",
    "desc": "AG-UI (Agent-User Interface) is an open, event-based protocol for connecting AI agents to user-facing applications. Unlike request-response protocols, AG-UI streams events as the agent works —...",
    "sectionId": "runtime",
    "kind": "feature",
    "frameworks": [
      "Strands"
    ],
    "languages": [
      "python"
    ],
    "hasNotebook": false,
    "readme": "/agentcore-samples/01-features/02-host-your-agent/01-runtime/01-hosting-agents/03-ag-ui-protocol/README.md",
    "base": "/agentcore-samples/01-features/02-host-your-agent/01-runtime/01-hosting-agents/03-ag-ui-protocol",
    "files": [
      {
        "path": "agent.py",
        "lang": "python",
        "bytes": 6330
      },
      {
        "path": "cleanup.py",
        "lang": "python",
        "bytes": 1997
      },
      {
        "path": "deploy.py",
        "lang": "python",
        "bytes": 6652
      },
      {
        "path": "invoke.py",
        "lang": "python",
        "bytes": 2572
      },
      {
        "path": "requirements.txt",
        "lang": "text",
        "bytes": 155
      }
    ]
  },
  {
    "slug": "01-features/02-host-your-agent/01-runtime/01-hosting-agents/04-observability-with-strands",
    "title": "Hosting a Strands Agent on AgentCore runtime with CloudWatch observability",
    "desc": "Deploy a Strands travel agent to Amazon Bedrock AgentCore runtime and observe its full execution — LLM calls, tool invocations, decision traces — in the Amazon CloudWatch GenAI observability...",
    "sectionId": "observability",
    "kind": "feature",
    "frameworks": [
      "Strands"
    ],
    "languages": [
      "python"
    ],
    "hasNotebook": false,
    "readme": "/agentcore-samples/01-features/02-host-your-agent/01-runtime/01-hosting-agents/04-observability-with-strands/README.md",
    "base": "/agentcore-samples/01-features/02-host-your-agent/01-runtime/01-hosting-agents/04-observability-with-strands",
    "files": [
      {
        "path": "cleanup.py",
        "lang": "python",
        "bytes": 2892
      },
      {
        "path": "deploy.py",
        "lang": "python",
        "bytes": 11217
      },
      {
        "path": "invoke.py",
        "lang": "python",
        "bytes": 3075
      },
      {
        "path": "requirements.txt",
        "lang": "text",
        "bytes": 136
      },
      {
        "path": "utils/travel_agent.py",
        "lang": "python",
        "bytes": 3538
      }
    ]
  },
  {
    "slug": "01-features/02-host-your-agent/01-runtime/01-hosting-agents/07-typescript-agents/07-direct-code-deploy-typescript",
    "title": "Getting Started — TypeScript Agent on Amazon Bedrock AgentCore",
    "desc": "Deploy a TypeScript agent to AgentCore runtime using Direct Code Deploy with Node.js 22.",
    "sectionId": "runtime",
    "kind": "feature",
    "frameworks": [
      "Strands"
    ],
    "languages": [
      "typescript"
    ],
    "hasNotebook": false,
    "readme": "/agentcore-samples/01-features/02-host-your-agent/01-runtime/01-hosting-agents/07-typescript-agents/07-direct-code-deploy-typescript/README.md",
    "base": "/agentcore-samples/01-features/02-host-your-agent/01-runtime/01-hosting-agents/07-typescript-agents/07-direct-code-deploy-typescript",
    "files": [
      {
        "path": "app.ts",
        "lang": "typescript",
        "bytes": 2210
      },
      {
        "path": "iam.sh",
        "lang": "bash",
        "bytes": 3342
      },
      {
        "path": "package.json",
        "lang": "json",
        "bytes": 495
      },
      {
        "path": "runtime.sh",
        "lang": "bash",
        "bytes": 5031
      },
      {
        "path": "tsconfig.json",
        "lang": "json",
        "bytes": 250
      }
    ]
  },
  {
    "slug": "01-features/02-host-your-agent/01-runtime/02-hosting-tools/01-mcp-server-basics",
    "title": "MCP Server Basics",
    "desc": "Create and deploy a basic MCP server with tools to AgentCore runtime. Once deployed, any MCP-compatible client (Claude Desktop, Cursor, Kiro, or your own agent) can discover and call your tools.",
    "sectionId": "runtime",
    "kind": "feature",
    "frameworks": [],
    "languages": [
      "python"
    ],
    "hasNotebook": false,
    "readme": "/agentcore-samples/01-features/02-host-your-agent/01-runtime/02-hosting-tools/01-mcp-server-basics/README.md",
    "base": "/agentcore-samples/01-features/02-host-your-agent/01-runtime/02-hosting-tools/01-mcp-server-basics",
    "files": [
      {
        "path": "cleanup.py",
        "lang": "python",
        "bytes": 1996
      },
      {
        "path": "deploy.py",
        "lang": "python",
        "bytes": 6570
      },
      {
        "path": "invoke.py",
        "lang": "python",
        "bytes": 3174
      },
      {
        "path": "mcp_server.py",
        "lang": "python",
        "bytes": 1605
      },
      {
        "path": "requirements.txt",
        "lang": "text",
        "bytes": 26
      }
    ]
  },
  {
    "slug": "01-features/02-host-your-agent/01-runtime/02-hosting-tools/02-mcp-server-features",
    "title": "MCP Server Advanced Features",
    "desc": "Beyond basic tools, MCP servers can expose resources (data sources), prompts (reusable templates), and support sampling (server-initiated LLM calls). This example demonstrates all three on...",
    "sectionId": "runtime",
    "kind": "feature",
    "frameworks": [],
    "languages": [
      "python"
    ],
    "hasNotebook": false,
    "readme": "/agentcore-samples/01-features/02-host-your-agent/01-runtime/02-hosting-tools/02-mcp-server-features/README.md",
    "base": "/agentcore-samples/01-features/02-host-your-agent/01-runtime/02-hosting-tools/02-mcp-server-features",
    "files": [
      {
        "path": "cleanup.py",
        "lang": "python",
        "bytes": 1844
      },
      {
        "path": "deploy.py",
        "lang": "python",
        "bytes": 5599
      },
      {
        "path": "invoke.py",
        "lang": "python",
        "bytes": 4095
      },
      {
        "path": "mcp_server.py",
        "lang": "python",
        "bytes": 4086
      },
      {
        "path": "requirements.txt",
        "lang": "text",
        "bytes": 26
      }
    ]
  },
  {
    "slug": "01-features/02-host-your-agent/01-runtime/03-advanced/01-streaming-responses",
    "title": "Streaming Agent Responses",
    "desc": "Stream partial results from your agent in real time using Server-Sent Events (SSE). Instead of waiting for the complete response, clients receive text chunks as the agent generates them —...",
    "sectionId": "runtime",
    "kind": "feature",
    "frameworks": [
      "Strands"
    ],
    "languages": [
      "python"
    ],
    "hasNotebook": false,
    "readme": "/agentcore-samples/01-features/02-host-your-agent/01-runtime/03-advanced/01-streaming-responses/README.md",
    "base": "/agentcore-samples/01-features/02-host-your-agent/01-runtime/03-advanced/01-streaming-responses",
    "files": [
      {
        "path": "agent.py",
        "lang": "python",
        "bytes": 1249
      },
      {
        "path": "cleanup.py",
        "lang": "python",
        "bytes": 1865
      },
      {
        "path": "deploy.py",
        "lang": "python",
        "bytes": 6432
      },
      {
        "path": "invoke.py",
        "lang": "python",
        "bytes": 2040
      },
      {
        "path": "requirements.txt",
        "lang": "text",
        "bytes": 89
      }
    ]
  },
  {
    "slug": "01-features/02-host-your-agent/01-runtime/03-advanced/02-session-management",
    "title": "Session Management",
    "desc": "AgentCore runtime provides session-based isolation — each session runs in a dedicated microVM. By reusing the same runtimeSessionId, you maintain agent state, conversation history, and filesystem...",
    "sectionId": "runtime",
    "kind": "feature",
    "frameworks": [
      "Strands"
    ],
    "languages": [
      "python"
    ],
    "hasNotebook": false,
    "readme": "/agentcore-samples/01-features/02-host-your-agent/01-runtime/03-advanced/02-session-management/README.md",
    "base": "/agentcore-samples/01-features/02-host-your-agent/01-runtime/03-advanced/02-session-management",
    "files": [
      {
        "path": "agent.py",
        "lang": "python",
        "bytes": 1028
      },
      {
        "path": "cleanup.py",
        "lang": "python",
        "bytes": 1865
      },
      {
        "path": "deploy.py",
        "lang": "python",
        "bytes": 6679
      },
      {
        "path": "invoke.py",
        "lang": "python",
        "bytes": 3390
      },
      {
        "path": "requirements.txt",
        "lang": "text",
        "bytes": 61
      }
    ]
  },
  {
    "slug": "01-features/02-host-your-agent/01-runtime/03-advanced/04-async-agents/02_async_data_analysis",
    "title": "Asynchronous Data Analysis Agent with Amazon Bedrock AgentCore",
    "desc": "In this tutorial we will learn how to build an asynchronous data analysis agent that can perform long-running analysis tasks in the background while maintaining a responsive conversation with the...",
    "sectionId": "runtime",
    "kind": "feature",
    "frameworks": [
      "Strands"
    ],
    "languages": [
      "python"
    ],
    "hasNotebook": false,
    "readme": "/agentcore-samples/01-features/02-host-your-agent/01-runtime/03-advanced/04-async-agents/02_async_data_analysis/README.md",
    "base": "/agentcore-samples/01-features/02-host-your-agent/01-runtime/03-advanced/04-async-agents/02_async_data_analysis",
    "files": [
      {
        "path": "async_data_analysis_agent.py",
        "lang": "python",
        "bytes": 31464
      },
      {
        "path": "cleanup.py",
        "lang": "python",
        "bytes": 1865
      },
      {
        "path": "deploy.py",
        "lang": "python",
        "bytes": 7380
      },
      {
        "path": "invoke.py",
        "lang": "python",
        "bytes": 2100
      },
      {
        "path": "requirements.txt",
        "lang": "text",
        "bytes": 366
      },
      {
        "path": "utils.py",
        "lang": "python",
        "bytes": 17063
      }
    ]
  },
  {
    "slug": "01-features/02-host-your-agent/01-runtime/03-advanced/05-execute-commands",
    "title": "Execute Commands in runtime Sessions",
    "desc": "The invokeagentruntimecommand API lets you run shell commands directly inside an AgentCore runtime session's microVM. This is useful for debugging, inspecting the environment, installing packages,...",
    "sectionId": "runtime",
    "kind": "feature",
    "frameworks": [
      "Strands"
    ],
    "languages": [
      "python"
    ],
    "hasNotebook": false,
    "readme": "/agentcore-samples/01-features/02-host-your-agent/01-runtime/03-advanced/05-execute-commands/README.md",
    "base": "/agentcore-samples/01-features/02-host-your-agent/01-runtime/03-advanced/05-execute-commands",
    "files": [
      {
        "path": "agent.py",
        "lang": "python",
        "bytes": 716
      },
      {
        "path": "cleanup.py",
        "lang": "python",
        "bytes": 1865
      },
      {
        "path": "deploy.py",
        "lang": "python",
        "bytes": 6346
      },
      {
        "path": "invoke.py",
        "lang": "python",
        "bytes": 3874
      },
      {
        "path": "requirements.txt",
        "lang": "text",
        "bytes": 61
      }
    ]
  },
  {
    "slug": "01-features/02-host-your-agent/01-runtime/03-advanced/06-multi-agent",
    "title": "Multi-Agent Orchestration",
    "desc": "Deploy multiple agents to separate AgentCore Runtimes and orchestrate them from a supervisor agent. Each agent runs in its own isolated environment with its own tools and system prompt.",
    "sectionId": "runtime",
    "kind": "feature",
    "frameworks": [
      "Strands"
    ],
    "languages": [
      "python"
    ],
    "hasNotebook": false,
    "readme": "/agentcore-samples/01-features/02-host-your-agent/01-runtime/03-advanced/06-multi-agent/README.md",
    "base": "/agentcore-samples/01-features/02-host-your-agent/01-runtime/03-advanced/06-multi-agent",
    "files": [
      {
        "path": "cleanup.py",
        "lang": "python",
        "bytes": 2366
      },
      {
        "path": "deploy.py",
        "lang": "python",
        "bytes": 9674
      },
      {
        "path": "hr_agent.py",
        "lang": "python",
        "bytes": 2450
      },
      {
        "path": "invoke.py",
        "lang": "python",
        "bytes": 2165
      },
      {
        "path": "orchestrator_agent.py",
        "lang": "python",
        "bytes": 2629
      },
      {
        "path": "requirements.txt",
        "lang": "text",
        "bytes": 61
      },
      {
        "path": "tech_agent.py",
        "lang": "python",
        "bytes": 1993
      }
    ]
  },
  {
    "slug": "01-features/02-host-your-agent/01-runtime/03-advanced/07-persistent-filesystems",
    "title": "Persistent Filesystems",
    "desc": "AgentCore runtime supports persisting filesystem state across session stop/resume cycles. Files, installed packages, and build artifacts survive session stops without needing external storage like...",
    "sectionId": "runtime",
    "kind": "feature",
    "frameworks": [
      "Strands"
    ],
    "languages": [
      "python"
    ],
    "hasNotebook": false,
    "readme": "/agentcore-samples/01-features/02-host-your-agent/01-runtime/03-advanced/07-persistent-filesystems/README.md",
    "base": "/agentcore-samples/01-features/02-host-your-agent/01-runtime/03-advanced/07-persistent-filesystems",
    "files": [
      {
        "path": "agent.py",
        "lang": "python",
        "bytes": 2823
      },
      {
        "path": "cleanup.py",
        "lang": "python",
        "bytes": 1865
      },
      {
        "path": "deploy.py",
        "lang": "python",
        "bytes": 6745
      },
      {
        "path": "invoke.py",
        "lang": "python",
        "bytes": 3640
      },
      {
        "path": "requirements.txt",
        "lang": "text",
        "bytes": 61
      }
    ]
  },
  {
    "slug": "01-features/02-host-your-agent/01-runtime/03-advanced/08-connect-to-vpc-resources",
    "title": "Connect to VPC Resources",
    "desc": "By default, AgentCore runtime deploys agents with PUBLIC network mode — the agent runs in AWS-managed infrastructure with internet access. VPC mode lets you deploy agents into your own VPC, giving...",
    "sectionId": "runtime",
    "kind": "feature",
    "frameworks": [],
    "languages": [
      "python",
      "typescript"
    ],
    "hasNotebook": false,
    "readme": "/agentcore-samples/01-features/02-host-your-agent/01-runtime/03-advanced/08-connect-to-vpc-resources/README.md",
    "base": "/agentcore-samples/01-features/02-host-your-agent/01-runtime/03-advanced/08-connect-to-vpc-resources",
    "files": [
      {
        "path": "agent/main.py",
        "lang": "python",
        "bytes": 457
      },
      {
        "path": "agent/requirements.txt",
        "lang": "text",
        "bytes": 23
      },
      {
        "path": "bin/app.ts",
        "lang": "typescript",
        "bytes": 434
      },
      {
        "path": "cdk.json",
        "lang": "json",
        "bytes": 3839
      },
      {
        "path": "cleanup.py",
        "lang": "python",
        "bytes": 3528
      },
      {
        "path": "deploy.py",
        "lang": "python",
        "bytes": 12134
      },
      {
        "path": "invoke.py",
        "lang": "python",
        "bytes": 1820
      },
      {
        "path": "lib/vpc-fargate-stack.ts",
        "lang": "typescript",
        "bytes": 6446
      },
      {
        "path": "package.json",
        "lang": "json",
        "bytes": 790
      },
      {
        "path": "resource-code/app.py",
        "lang": "python",
        "bytes": 1969
      },
      {
        "path": "resource-code/requirements.txt",
        "lang": "text",
        "bytes": 5
      }
    ]
  },
  {
    "slug": "01-features/02-host-your-agent/01-runtime/03-advanced/09-mcp-e2e/01-server-e2e",
    "title": "Full Example of MCP Stateless Server",
    "desc": "This tutorial demonstrates how to build a complete MCP (Model Context Protocol) server with all three core capabilities and deploy it to Amazon Bedrock AgentCore runtime.",
    "sectionId": "runtime",
    "kind": "feature",
    "frameworks": [],
    "languages": [
      "python"
    ],
    "hasNotebook": false,
    "readme": "/agentcore-samples/01-features/02-host-your-agent/01-runtime/03-advanced/09-mcp-e2e/01-server-e2e/README.md",
    "base": "/agentcore-samples/01-features/02-host-your-agent/01-runtime/03-advanced/09-mcp-e2e/01-server-e2e",
    "files": [
      {
        "path": "agents/dynamo_utils.py",
        "lang": "python",
        "bytes": 4511
      },
      {
        "path": "agents/mcp_e2e_stateless_server.py",
        "lang": "python",
        "bytes": 8443
      },
      {
        "path": "cleanup.py",
        "lang": "python",
        "bytes": 2299
      },
      {
        "path": "deploy.py",
        "lang": "python",
        "bytes": 8902
      },
      {
        "path": "expenses.txt",
        "lang": "text",
        "bytes": 174
      },
      {
        "path": "invoke.py",
        "lang": "python",
        "bytes": 3562
      },
      {
        "path": "requirements.txt",
        "lang": "text",
        "bytes": 37
      }
    ]
  },
  {
    "slug": "01-features/02-host-your-agent/01-runtime/03-advanced/10-mcp-dynamic-client-registration",
    "title": "MCP Dynamic Client Registration with Auth0",
    "desc": "Dynamic Client Registration (DCR) allows MCP clients to register themselves with an OAuth authorization server at runtime, without pre-configured client credentials. This eliminates the need to...",
    "sectionId": "runtime",
    "kind": "feature",
    "frameworks": [],
    "languages": [
      "python"
    ],
    "hasNotebook": false,
    "readme": "/agentcore-samples/01-features/02-host-your-agent/01-runtime/03-advanced/10-mcp-dynamic-client-registration/README.md",
    "base": "/agentcore-samples/01-features/02-host-your-agent/01-runtime/03-advanced/10-mcp-dynamic-client-registration",
    "files": [
      {
        "path": "cleanup.py",
        "lang": "python",
        "bytes": 1865
      },
      {
        "path": "deploy.py",
        "lang": "python",
        "bytes": 7624
      },
      {
        "path": "invoke.py",
        "lang": "python",
        "bytes": 1878
      },
      {
        "path": "mcp_auth0_client.py",
        "lang": "python",
        "bytes": 15592
      },
      {
        "path": "requirements.txt",
        "lang": "text",
        "bytes": 22
      },
      {
        "path": "server.py",
        "lang": "python",
        "bytes": 523
      }
    ]
  },
  {
    "slug": "01-features/02-host-your-agent/01-runtime/03-advanced/11-middleware-support",
    "title": "Middleware Support",
    "desc": "AgentCore runtime supports Starlette middleware for intercepting and processing HTTP requests and responses. Middleware lets you add cross-cutting concerns like logging, metrics, error handling,...",
    "sectionId": "runtime",
    "kind": "feature",
    "frameworks": [
      "Strands"
    ],
    "languages": [
      "python"
    ],
    "hasNotebook": false,
    "readme": "/agentcore-samples/01-features/02-host-your-agent/01-runtime/03-advanced/11-middleware-support/README.md",
    "base": "/agentcore-samples/01-features/02-host-your-agent/01-runtime/03-advanced/11-middleware-support",
    "files": [
      {
        "path": "cleanup.py",
        "lang": "python",
        "bytes": 1865
      },
      {
        "path": "deploy.py",
        "lang": "python",
        "bytes": 6483
      },
      {
        "path": "invoke.py",
        "lang": "python",
        "bytes": 2867
      },
      {
        "path": "middleware_agent.py",
        "lang": "python",
        "bytes": 4125
      },
      {
        "path": "requirements.txt",
        "lang": "text",
        "bytes": 128
      }
    ]
  },
  {
    "slug": "01-features/02-host-your-agent/01-runtime/03-advanced/12-egress-coding-execution",
    "title": "Egress-Controlled Code Execution",
    "desc": "This sample demonstrates how to run untrusted code securely inside an Amazon Bedrock AgentCore Runtime microVM. Three independently deployable containers collaborate so that customer code never...",
    "sectionId": "runtime",
    "kind": "feature",
    "frameworks": [],
    "languages": [
      "python"
    ],
    "hasNotebook": false,
    "readme": "/agentcore-samples/01-features/02-host-your-agent/01-runtime/03-advanced/12-egress-coding-execution/README.md",
    "base": "/agentcore-samples/01-features/02-host-your-agent/01-runtime/03-advanced/12-egress-coding-execution",
    "files": [
      {
        "path": "agent/src/__init__.py",
        "lang": "python",
        "bytes": 0
      },
      {
        "path": "agent/src/agent_main.py",
        "lang": "python",
        "bytes": 3035
      },
      {
        "path": "agent/src/ipc_client.py",
        "lang": "python",
        "bytes": 1625
      },
      {
        "path": "broker/src/__init__.py",
        "lang": "python",
        "bytes": 0
      },
      {
        "path": "broker/src/config.py",
        "lang": "python",
        "bytes": 1361
      },
      {
        "path": "broker/src/handlers/__init__.py",
        "lang": "python",
        "bytes": 0
      },
      {
        "path": "broker/src/handlers/http.py",
        "lang": "python",
        "bytes": 287
      },
      {
        "path": "broker/src/handlers/ping.py",
        "lang": "python",
        "bytes": 1811
      },
      {
        "path": "broker/src/ipc_server.py",
        "lang": "python",
        "bytes": 3625
      },
      {
        "path": "broker/src/main.py",
        "lang": "python",
        "bytes": 543
      },
      {
        "path": "cleanup.py",
        "lang": "python",
        "bytes": 3597
      },
      {
        "path": "deploy.py",
        "lang": "python",
        "bytes": 8281
      },
      {
        "path": "invoke.py",
        "lang": "python",
        "bytes": 5188
      },
      {
        "path": "requirements-dev.txt",
        "lang": "text",
        "bytes": 32
      },
      {
        "path": "requirements.txt",
        "lang": "text",
        "bytes": 14
      },
      {
        "path": "shared/ipc.py",
        "lang": "python",
        "bytes": 906
      },
      {
        "path": "supervisor/requirements.txt",
        "lang": "text",
        "bytes": 39
      },
      {
        "path": "supervisor/src/__init__.py",
        "lang": "python",
        "bytes": 0
      },
      {
        "path": "supervisor/src/containerd.py",
        "lang": "python",
        "bytes": 3147
      },
      {
        "path": "supervisor/src/ecr.py",
        "lang": "python",
        "bytes": 437
      },
      {
        "path": "supervisor/src/main.py",
        "lang": "python",
        "bytes": 6044
      },
      {
        "path": "supervisor/src/profiles.py",
        "lang": "python",
        "bytes": 1538
      },
      {
        "path": "supervisor/src/task_dispatch.py",
        "lang": "python",
        "bytes": 3619
      },
      {
        "path": "tests/conftest.py",
        "lang": "python",
        "bytes": 545
      },
      {
        "path": "tests/unit/test_broker_config.py",
        "lang": "python",
        "bytes": 1756
      },
      {
        "path": "tests/unit/test_ipc.py",
        "lang": "python",
        "bytes": 1596
      }
    ]
  },
  {
    "slug": "01-features/02-host-your-agent/01-runtime/04-coding-agents/01-claude-code-with-s3-files",
    "title": "Claude Code on AgentCore runtime with S3 Files",
    "desc": "Deploys Claude Code as an HTTP agent on AWS Bedrock AgentCore runtime, with an S3 Files file system mounted at /mnt/s3files for persistent storage shared across sessions.",
    "sectionId": "runtime",
    "kind": "feature",
    "frameworks": [],
    "languages": [
      "javascript",
      "python"
    ],
    "hasNotebook": false,
    "readme": "/agentcore-samples/01-features/02-host-your-agent/01-runtime/04-coding-agents/01-claude-code-with-s3-files/README.md",
    "base": "/agentcore-samples/01-features/02-host-your-agent/01-runtime/04-coding-agents/01-claude-code-with-s3-files",
    "files": [
      {
        "path": "cfn-vpc.yaml",
        "lang": "yaml",
        "bytes": 13135
      },
      {
        "path": "cleanup.py",
        "lang": "python",
        "bytes": 3959
      },
      {
        "path": "cleanup.sh",
        "lang": "bash",
        "bytes": 314
      },
      {
        "path": "deploy.py",
        "lang": "python",
        "bytes": 13393
      },
      {
        "path": "exec_cmd.py",
        "lang": "python",
        "bytes": 3308
      },
      {
        "path": "invoke.py",
        "lang": "python",
        "bytes": 4105
      },
      {
        "path": "server.js",
        "lang": "javascript",
        "bytes": 2330
      },
      {
        "path": "setup.sh",
        "lang": "bash",
        "bytes": 4679
      },
      {
        "path": "update.py",
        "lang": "python",
        "bytes": 5011
      }
    ]
  },
  {
    "slug": "01-features/02-host-your-agent/01-runtime/04-coding-agents/02-claude-code-with-efs",
    "title": "Claude Code on AgentCore runtime with EFS",
    "desc": "Deploys Claude Code as an HTTP agent on AWS Bedrock AgentCore runtime, with an EFS file system mounted at /mnt/efs for persistent storage shared across sessions.",
    "sectionId": "runtime",
    "kind": "feature",
    "frameworks": [],
    "languages": [
      "javascript",
      "python"
    ],
    "hasNotebook": false,
    "readme": "/agentcore-samples/01-features/02-host-your-agent/01-runtime/04-coding-agents/02-claude-code-with-efs/README.md",
    "base": "/agentcore-samples/01-features/02-host-your-agent/01-runtime/04-coding-agents/02-claude-code-with-efs",
    "files": [
      {
        "path": "cfn-vpc.yaml",
        "lang": "yaml",
        "bytes": 9093
      },
      {
        "path": "cleanup.py",
        "lang": "python",
        "bytes": 3748
      },
      {
        "path": "cleanup.sh",
        "lang": "bash",
        "bytes": 314
      },
      {
        "path": "deploy.py",
        "lang": "python",
        "bytes": 10242
      },
      {
        "path": "exec_cmd.py",
        "lang": "python",
        "bytes": 3304
      },
      {
        "path": "invoke.py",
        "lang": "python",
        "bytes": 4105
      },
      {
        "path": "server.js",
        "lang": "javascript",
        "bytes": 2843
      },
      {
        "path": "setup.sh",
        "lang": "bash",
        "bytes": 3543
      },
      {
        "path": "update.py",
        "lang": "python",
        "bytes": 4942
      }
    ]
  },
  {
    "slug": "01-features/02-host-your-agent/01-runtime/04-coding-agents/03-code-agents-competition-e2e/coding_agents",
    "title": "Coding Agents on AgentCore",
    "desc": "Deploy coding agents (Claude Code, Kiro, Codex, Cursor, Hermes, OpenCode) on AWS Bedrock AgentCore with native MCP tool access via a shared gateway proxy.",
    "sectionId": "runtime",
    "kind": "feature",
    "frameworks": [
      "OpenAI Agents"
    ],
    "languages": [
      "javascript",
      "python"
    ],
    "hasNotebook": false,
    "readme": "/agentcore-samples/01-features/02-host-your-agent/01-runtime/04-coding-agents/03-code-agents-competition-e2e/coding_agents/README.md",
    "base": "/agentcore-samples/01-features/02-host-your-agent/01-runtime/04-coding-agents/03-code-agents-competition-e2e/coding_agents",
    "files": [
      {
        "path": "cleanup_all.sh",
        "lang": "bash",
        "bytes": 1357
      },
      {
        "path": "deploy_all.sh",
        "lang": "bash",
        "bytes": 1499
      },
      {
        "path": "frontend/app.py",
        "lang": "python",
        "bytes": 12442
      },
      {
        "path": "frontend/requirements.txt",
        "lang": "text",
        "bytes": 101
      },
      {
        "path": "frontend/static/app.js",
        "lang": "javascript",
        "bytes": 13843
      },
      {
        "path": "frontend/static/style.css",
        "lang": "css",
        "bytes": 5964
      },
      {
        "path": "frontend/templates/index.html",
        "lang": "html",
        "bytes": 3870
      },
      {
        "path": "infra/cfn-vpc.yaml",
        "lang": "yaml",
        "bytes": 8448
      },
      {
        "path": "infra/cleanup.sh",
        "lang": "bash",
        "bytes": 714
      },
      {
        "path": "infra/setup.sh",
        "lang": "bash",
        "bytes": 5553
      },
      {
        "path": "requirements.txt",
        "lang": "text",
        "bytes": 26
      }
    ]
  },
  {
    "slug": "01-features/02-host-your-agent/01-runtime/04-coding-agents/03-code-agents-competition-e2e/coding_agents/claude-code",
    "title": "Claude Code — AgentCore Runtime",
    "desc": "Claude Code deployed as an AgentCore Runtime with interactive WebSocket PTY access, powered by Amazon Bedrock for inference.",
    "sectionId": "runtime",
    "kind": "feature",
    "frameworks": [],
    "languages": [
      "python"
    ],
    "hasNotebook": false,
    "readme": "/agentcore-samples/01-features/02-host-your-agent/01-runtime/04-coding-agents/03-code-agents-competition-e2e/coding_agents/claude-code/README.md",
    "base": "/agentcore-samples/01-features/02-host-your-agent/01-runtime/04-coding-agents/03-code-agents-competition-e2e/coding_agents/claude-code",
    "files": [
      {
        "path": "CLAUDE.md",
        "lang": "markdown",
        "bytes": 1298
      },
      {
        "path": "cleanup.py",
        "lang": "python",
        "bytes": 2089
      },
      {
        "path": "connect.py",
        "lang": "python",
        "bytes": 5186
      },
      {
        "path": "deploy.py",
        "lang": "python",
        "bytes": 11858
      },
      {
        "path": "healthcheck.py",
        "lang": "python",
        "bytes": 1367
      },
      {
        "path": "run.sh",
        "lang": "bash",
        "bytes": 2802
      },
      {
        "path": "settings.json",
        "lang": "json",
        "bytes": 368
      },
      {
        "path": "setup.sh",
        "lang": "bash",
        "bytes": 2216
      }
    ]
  },
  {
    "slug": "01-features/02-host-your-agent/01-runtime/04-coding-agents/03-code-agents-competition-e2e/coding_agents/codex",
    "title": "Codex — AgentCore Runtime",
    "desc": "OpenAI Codex deployed as an AgentCore Runtime with interactive WebSocket PTY access, powered by Amazon Bedrock Mantle for inference.",
    "sectionId": "runtime",
    "kind": "feature",
    "frameworks": [
      "OpenAI Agents"
    ],
    "languages": [
      "python"
    ],
    "hasNotebook": false,
    "readme": "/agentcore-samples/01-features/02-host-your-agent/01-runtime/04-coding-agents/03-code-agents-competition-e2e/coding_agents/codex/README.md",
    "base": "/agentcore-samples/01-features/02-host-your-agent/01-runtime/04-coding-agents/03-code-agents-competition-e2e/coding_agents/codex",
    "files": [
      {
        "path": "AGENTS.md",
        "lang": "markdown",
        "bytes": 1253
      },
      {
        "path": "cleanup.py",
        "lang": "python",
        "bytes": 3666
      },
      {
        "path": "codex-config.toml",
        "lang": "toml",
        "bytes": 118
      },
      {
        "path": "connect.py",
        "lang": "python",
        "bytes": 5095
      },
      {
        "path": "deploy.py",
        "lang": "python",
        "bytes": 13327
      },
      {
        "path": "healthcheck.py",
        "lang": "python",
        "bytes": 1361
      },
      {
        "path": "run.sh",
        "lang": "bash",
        "bytes": 3604
      },
      {
        "path": "setup.sh",
        "lang": "bash",
        "bytes": 2192
      }
    ]
  },
  {
    "slug": "01-features/02-host-your-agent/01-runtime/04-coding-agents/03-code-agents-competition-e2e/coding_agents/cursor",
    "title": "Cursor — AgentCore Runtime",
    "desc": "Cursor Agent deployed as an AgentCore Runtime with interactive WebSocket PTY access and secure API key management via AgentCore Identity Token Vault.",
    "sectionId": "runtime",
    "kind": "feature",
    "frameworks": [],
    "languages": [
      "python"
    ],
    "hasNotebook": false,
    "readme": "/agentcore-samples/01-features/02-host-your-agent/01-runtime/04-coding-agents/03-code-agents-competition-e2e/coding_agents/cursor/README.md",
    "base": "/agentcore-samples/01-features/02-host-your-agent/01-runtime/04-coding-agents/03-code-agents-competition-e2e/coding_agents/cursor",
    "files": [
      {
        "path": "cleanup.py",
        "lang": "python",
        "bytes": 3669
      },
      {
        "path": "connect.py",
        "lang": "python",
        "bytes": 5117
      },
      {
        "path": "deploy.py",
        "lang": "python",
        "bytes": 12474
      },
      {
        "path": "healthcheck.py",
        "lang": "python",
        "bytes": 1446
      },
      {
        "path": "run.sh",
        "lang": "bash",
        "bytes": 3821
      },
      {
        "path": "setup.sh",
        "lang": "bash",
        "bytes": 6874
      }
    ]
  },
  {
    "slug": "01-features/02-host-your-agent/01-runtime/04-coding-agents/03-code-agents-competition-e2e/coding_agents/hermes",
    "title": "Hermes — AgentCore Runtime",
    "desc": "Hermes Agent deployed as an AgentCore Runtime with interactive WebSocket PTY access, powered by Amazon Bedrock for inference.",
    "sectionId": "runtime",
    "kind": "feature",
    "frameworks": [],
    "languages": [
      "python"
    ],
    "hasNotebook": false,
    "readme": "/agentcore-samples/01-features/02-host-your-agent/01-runtime/04-coding-agents/03-code-agents-competition-e2e/coding_agents/hermes/README.md",
    "base": "/agentcore-samples/01-features/02-host-your-agent/01-runtime/04-coding-agents/03-code-agents-competition-e2e/coding_agents/hermes",
    "files": [
      {
        "path": "cleanup.py",
        "lang": "python",
        "bytes": 2004
      },
      {
        "path": "connect.py",
        "lang": "python",
        "bytes": 5126
      },
      {
        "path": "deploy.py",
        "lang": "python",
        "bytes": 11968
      },
      {
        "path": "healthcheck.py",
        "lang": "python",
        "bytes": 1531
      },
      {
        "path": "run.sh",
        "lang": "bash",
        "bytes": 2774
      },
      {
        "path": "setup.sh",
        "lang": "bash",
        "bytes": 2515
      },
      {
        "path": "steering/agent.md",
        "lang": "markdown",
        "bytes": 1255
      }
    ]
  },
  {
    "slug": "01-features/02-host-your-agent/01-runtime/04-coding-agents/03-code-agents-competition-e2e/coding_agents/kiro",
    "title": "Kiro — AgentCore Runtime",
    "desc": "Kiro CLI deployed as an AgentCore Runtime with interactive WebSocket PTY access and secure API key management via AgentCore Identity.",
    "sectionId": "runtime",
    "kind": "feature",
    "frameworks": [],
    "languages": [
      "python"
    ],
    "hasNotebook": false,
    "readme": "/agentcore-samples/01-features/02-host-your-agent/01-runtime/04-coding-agents/03-code-agents-competition-e2e/coding_agents/kiro/README.md",
    "base": "/agentcore-samples/01-features/02-host-your-agent/01-runtime/04-coding-agents/03-code-agents-competition-e2e/coding_agents/kiro",
    "files": [
      {
        "path": "cleanup.py",
        "lang": "python",
        "bytes": 4274
      },
      {
        "path": "connect.py",
        "lang": "python",
        "bytes": 5108
      },
      {
        "path": "deploy.py",
        "lang": "python",
        "bytes": 13011
      },
      {
        "path": "exec_cmd.py",
        "lang": "python",
        "bytes": 2387
      },
      {
        "path": "healthcheck.py",
        "lang": "python",
        "bytes": 1489
      },
      {
        "path": "invoke.py",
        "lang": "python",
        "bytes": 2581
      },
      {
        "path": "run.sh",
        "lang": "bash",
        "bytes": 5262
      },
      {
        "path": "setup.sh",
        "lang": "bash",
        "bytes": 6925
      },
      {
        "path": "steering/agent.md",
        "lang": "markdown",
        "bytes": 1278
      }
    ]
  },
  {
    "slug": "01-features/02-host-your-agent/01-runtime/04-coding-agents/03-code-agents-competition-e2e/coding_agents/open-code",
    "title": "OpenCode — AgentCore Runtime",
    "desc": "OpenCode deployed as an AgentCore Runtime with interactive WebSocket PTY access, powered by Amazon Bedrock for inference.",
    "sectionId": "runtime",
    "kind": "feature",
    "frameworks": [],
    "languages": [
      "python"
    ],
    "hasNotebook": false,
    "readme": "/agentcore-samples/01-features/02-host-your-agent/01-runtime/04-coding-agents/03-code-agents-competition-e2e/coding_agents/open-code/README.md",
    "base": "/agentcore-samples/01-features/02-host-your-agent/01-runtime/04-coding-agents/03-code-agents-competition-e2e/coding_agents/open-code",
    "files": [
      {
        "path": "AGENTS.md",
        "lang": "markdown",
        "bytes": 1260
      },
      {
        "path": "cleanup.py",
        "lang": "python",
        "bytes": 2006
      },
      {
        "path": "connect.py",
        "lang": "python",
        "bytes": 5136
      },
      {
        "path": "deploy.py",
        "lang": "python",
        "bytes": 11986
      },
      {
        "path": "healthcheck.py",
        "lang": "python",
        "bytes": 1536
      },
      {
        "path": "opencode.json",
        "lang": "json",
        "bytes": 306
      },
      {
        "path": "run.sh",
        "lang": "bash",
        "bytes": 4268
      },
      {
        "path": "setup.sh",
        "lang": "bash",
        "bytes": 2520
      }
    ]
  },
  {
    "slug": "01-features/02-host-your-agent/01-runtime/04-coding-agents/03-code-agents-competition-e2e/gateway_mcp",
    "title": "Gateway MCP — GitHub MCP on AgentCore",
    "desc": "Standalone deployment of a GitHub MCP server on Amazon Bedrock AgentCore, fronted by an IAM-authenticated AgentCore Gateway. Includes a sample project with intentional bugs to demonstrate the full...",
    "sectionId": "gateway",
    "kind": "feature",
    "frameworks": [],
    "languages": [
      "javascript",
      "python"
    ],
    "hasNotebook": false,
    "readme": "/agentcore-samples/01-features/02-host-your-agent/01-runtime/04-coding-agents/03-code-agents-competition-e2e/gateway_mcp/README.md",
    "base": "/agentcore-samples/01-features/02-host-your-agent/01-runtime/04-coding-agents/03-code-agents-competition-e2e/gateway_mcp",
    "files": [
      {
        "path": "config.sh",
        "lang": "bash",
        "bytes": 1741
      },
      {
        "path": "delete-all.sh",
        "lang": "bash",
        "bytes": 821
      },
      {
        "path": "delete-credential.sh",
        "lang": "bash",
        "bytes": 667
      },
      {
        "path": "delete-gateway.sh",
        "lang": "bash",
        "bytes": 2133
      },
      {
        "path": "delete-runtime.sh",
        "lang": "bash",
        "bytes": 2597
      },
      {
        "path": "deploy-all.sh",
        "lang": "bash",
        "bytes": 777
      },
      {
        "path": "deploy-credential.sh",
        "lang": "bash",
        "bytes": 2184
      },
      {
        "path": "deploy-gateway.sh",
        "lang": "bash",
        "bytes": 5944
      },
      {
        "path": "deploy-runtime.sh",
        "lang": "bash",
        "bytes": 8001
      },
      {
        "path": "sample-project/README.md",
        "lang": "markdown",
        "bytes": 1965
      },
      {
        "path": "sample-project/backend/app.py",
        "lang": "python",
        "bytes": 3070
      },
      {
        "path": "sample-project/backend/requirements.txt",
        "lang": "text",
        "bytes": 31
      },
      {
        "path": "sample-project/frontend/app.js",
        "lang": "javascript",
        "bytes": 3023
      },
      {
        "path": "sample-project/frontend/index.html",
        "lang": "html",
        "bytes": 2101
      },
      {
        "path": "seed-issues.sh",
        "lang": "bash",
        "bytes": 3154
      }
    ]
  },
  {
    "slug": "01-features/02-host-your-agent/01-runtime/04-coding-agents/03-code-agents-competition-e2e/gateway_mcp/app",
    "title": "GitHubMCP — MCP Server",
    "desc": "An MCP server deployed on Amazon Bedrock AgentCore that provides GitHub API access (issues, branches, PRs, labels) to coding agents via the AgentCore Gateway.",
    "sectionId": "gateway",
    "kind": "feature",
    "frameworks": [],
    "languages": [
      "python"
    ],
    "hasNotebook": false,
    "readme": "/agentcore-samples/01-features/02-host-your-agent/01-runtime/04-coding-agents/03-code-agents-competition-e2e/gateway_mcp/app/README.md",
    "base": "/agentcore-samples/01-features/02-host-your-agent/01-runtime/04-coding-agents/03-code-agents-competition-e2e/gateway_mcp/app",
    "files": [
      {
        "path": "main.py",
        "lang": "python",
        "bytes": 11338
      },
      {
        "path": "pyproject.toml",
        "lang": "toml",
        "bytes": 479
      }
    ]
  },
  {
    "slug": "01-features/02-host-your-agent/01-runtime/04-coding-agents/04-claude-managed-agents-self-hosted-sandbox",
    "title": "Claude Managed Agents — self-hosted sandbox on AgentCore runtime",
    "desc": "Runs the Anthropic Claude Managed Agents (CMA) self-hosted sandbox on Amazon Bedrock AgentCore Runtime. Anthropic CMA owns the agent loop and the conversation; AgentCore Runtime is the per-session...",
    "sectionId": "runtime",
    "kind": "feature",
    "frameworks": [],
    "languages": [
      "python"
    ],
    "hasNotebook": false,
    "readme": "/agentcore-samples/01-features/02-host-your-agent/01-runtime/04-coding-agents/04-claude-managed-agents-self-hosted-sandbox/README.md",
    "base": "/agentcore-samples/01-features/02-host-your-agent/01-runtime/04-coding-agents/04-claude-managed-agents-self-hosted-sandbox",
    "files": [
      {
        "path": "bootstrap.py",
        "lang": "python",
        "bytes": 3711
      },
      {
        "path": "cleanup.py",
        "lang": "python",
        "bytes": 3441
      },
      {
        "path": "deploy.py",
        "lang": "python",
        "bytes": 7350
      },
      {
        "path": "on-work.py",
        "lang": "python",
        "bytes": 3043
      },
      {
        "path": "on-work.sh",
        "lang": "bash",
        "bytes": 377
      },
      {
        "path": "requirements-host.txt",
        "lang": "text",
        "bytes": 51
      },
      {
        "path": "requirements.txt",
        "lang": "text",
        "bytes": 18
      },
      {
        "path": "server.py",
        "lang": "python",
        "bytes": 2358
      },
      {
        "path": "setup.sh",
        "lang": "bash",
        "bytes": 2734
      },
      {
        "path": "start.sh",
        "lang": "bash",
        "bytes": 1685
      },
      {
        "path": "tui_exec.py",
        "lang": "python",
        "bytes": 2881
      },
      {
        "path": "tui_shell.py",
        "lang": "python",
        "bytes": 7111
      }
    ]
  },
  {
    "slug": "01-features/02-host-your-agent/01-runtime/04-coding-agents/05-autonomous-coding-agent-durable/cdk",
    "title": "CDK deployment — autonomous AgentCore coding agent",
    "desc": "This cdk/ directory stands up the entire system on a fresh AWS account with cdk deploy --all. It is the CDK equivalent of the deploy/.sh scripts, kept in lock-step with them (notably the...",
    "sectionId": "runtime",
    "kind": "feature",
    "frameworks": [],
    "languages": [
      "python"
    ],
    "hasNotebook": false,
    "readme": "/agentcore-samples/01-features/02-host-your-agent/01-runtime/04-coding-agents/05-autonomous-coding-agent-durable/cdk/README.md",
    "base": "/agentcore-samples/01-features/02-host-your-agent/01-runtime/04-coding-agents/05-autonomous-coding-agent-durable/cdk",
    "files": [
      {
        "path": "app.py",
        "lang": "python",
        "bytes": 3523
      },
      {
        "path": "assets/tickets-source/RAINBOW-1.json",
        "lang": "json",
        "bytes": 838
      },
      {
        "path": "assets/tickets-source/TICKET-1.json",
        "lang": "json",
        "bytes": 209
      },
      {
        "path": "assets/tickets-source/_template-feature.json",
        "lang": "json",
        "bytes": 549
      },
      {
        "path": "assets/tickets-source/_template-memory.json",
        "lang": "json",
        "bytes": 538
      },
      {
        "path": "cdk.json",
        "lang": "json",
        "bytes": 316
      },
      {
        "path": "requirements.txt",
        "lang": "text",
        "bytes": 40
      },
      {
        "path": "stacks/__init__.py",
        "lang": "python",
        "bytes": 57
      },
      {
        "path": "stacks/build_stack.py",
        "lang": "python",
        "bytes": 7859
      },
      {
        "path": "stacks/gateway_policy_stack.py",
        "lang": "python",
        "bytes": 3763
      },
      {
        "path": "stacks/memory_stack.py",
        "lang": "python",
        "bytes": 2392
      },
      {
        "path": "stacks/monitoring_stack.py",
        "lang": "python",
        "bytes": 5542
      },
      {
        "path": "stacks/network_stack.py",
        "lang": "python",
        "bytes": 5401
      },
      {
        "path": "stacks/orchestrator_stack.py",
        "lang": "python",
        "bytes": 9890
      },
      {
        "path": "stacks/runtime_stack.py",
        "lang": "python",
        "bytes": 18173
      },
      {
        "path": "stacks/storage_stack.py",
        "lang": "python",
        "bytes": 13028
      }
    ]
  },
  {
    "slug": "01-features/02-host-your-agent/01-runtime/04-coding-agents/05-autonomous-coding-agent-durable/demo",
    "title": "Demo Console",
    "desc": "Live visualization of the autonomous coding-agent workflow on AgentCore. Architecture diagram + stage timeline + per-component CloudWatch logs + live coding-agent reasoning, all driven off the...",
    "sectionId": "runtime",
    "kind": "feature",
    "frameworks": [],
    "languages": [
      "python"
    ],
    "hasNotebook": false,
    "readme": "/agentcore-samples/01-features/02-host-your-agent/01-runtime/04-coding-agents/05-autonomous-coding-agent-durable/demo/README.md",
    "base": "/agentcore-samples/01-features/02-host-your-agent/01-runtime/04-coding-agents/05-autonomous-coding-agent-durable/demo",
    "files": [
      {
        "path": "clear_memory.py",
        "lang": "python",
        "bytes": 4664
      },
      {
        "path": "index.html",
        "lang": "html",
        "bytes": 18718
      },
      {
        "path": "serve.py",
        "lang": "python",
        "bytes": 14380
      },
      {
        "path": "start_demo.sh",
        "lang": "bash",
        "bytes": 3842
      }
    ]
  },
  {
    "slug": "01-features/03-connect-your-agent-to-anything/01-code-interpreter/01-file-operations",
    "title": "File Operations with AgentCore Code Interpreter",
    "desc": "This demo shows the core Code Interpreter API — no agent framework, just direct SDK calls. You'll learn how to start a session, write files into the sandbox, list the filesystem, execute a Python...",
    "sectionId": "code-interpreter",
    "kind": "feature",
    "frameworks": [],
    "languages": [
      "python"
    ],
    "hasNotebook": false,
    "readme": "/agentcore-samples/01-features/03-connect-your-agent-to-anything/01-code-interpreter/01-file-operations/README.md",
    "base": "/agentcore-samples/01-features/03-connect-your-agent-to-anything/01-code-interpreter/01-file-operations",
    "files": [
      {
        "path": "file_operations.py",
        "lang": "python",
        "bytes": 5098
      },
      {
        "path": "samples/stats.py",
        "lang": "python",
        "bytes": 71
      }
    ]
  },
  {
    "slug": "01-features/03-connect-your-agent-to-anything/01-code-interpreter/02-code-execution",
    "title": "Agent-Based Code Execution with AgentCore Code Interpreter",
    "desc": "This demo shows how to give a Strands agent the ability to write and run Python code to verify its answers. The agent receives a natural language question, generates code to solve it, executes...",
    "sectionId": "code-interpreter",
    "kind": "feature",
    "frameworks": [
      "Strands",
      "LangChain"
    ],
    "languages": [
      "python"
    ],
    "hasNotebook": false,
    "readme": "/agentcore-samples/01-features/03-connect-your-agent-to-anything/01-code-interpreter/02-code-execution/README.md",
    "base": "/agentcore-samples/01-features/03-connect-your-agent-to-anything/01-code-interpreter/02-code-execution",
    "files": [
      {
        "path": "code_execution.py",
        "lang": "python",
        "bytes": 3098
      }
    ]
  },
  {
    "slug": "01-features/03-connect-your-agent-to-anything/01-code-interpreter/03-data-analysis",
    "title": "Advanced Data Analysis with AgentCore Code Interpreter",
    "desc": "This demo shows how to combine a persistent file upload with an agent that reuses the same session, enabling multi-step analysis of large datasets. The agent can load, transform, and query a...",
    "sectionId": "code-interpreter",
    "kind": "feature",
    "frameworks": [
      "Strands"
    ],
    "languages": [
      "python"
    ],
    "hasNotebook": false,
    "readme": "/agentcore-samples/01-features/03-connect-your-agent-to-anything/01-code-interpreter/03-data-analysis/README.md",
    "base": "/agentcore-samples/01-features/03-connect-your-agent-to-anything/01-code-interpreter/03-data-analysis",
    "files": [
      {
        "path": "data_analysis.py",
        "lang": "python",
        "bytes": 6729
      }
    ]
  },
  {
    "slug": "01-features/03-connect-your-agent-to-anything/01-code-interpreter/04-run-commands",
    "title": "Shell and AWS CLI Commands via AgentCore Code Interpreter",
    "desc": "The AgentCore Code Interpreter sandbox includes a full shell environment and the AWS CLI — not just Python. This demo shows how to use the executeCommand tool to run arbitrary shell commands and...",
    "sectionId": "code-interpreter",
    "kind": "feature",
    "frameworks": [],
    "languages": [
      "python"
    ],
    "hasNotebook": false,
    "readme": "/agentcore-samples/01-features/03-connect-your-agent-to-anything/01-code-interpreter/04-run-commands/README.md",
    "base": "/agentcore-samples/01-features/03-connect-your-agent-to-anything/01-code-interpreter/04-run-commands",
    "files": [
      {
        "path": "run_commands.py",
        "lang": "python",
        "bytes": 10396
      },
      {
        "path": "samples/stats.py",
        "lang": "python",
        "bytes": 71
      }
    ]
  },
  {
    "slug": "01-features/03-connect-your-agent-to-anything/02-browser/01-nova-act",
    "title": "Headless Browser Automation with Nova Act",
    "desc": "This demo shows how to connect the Amazon Nova Act SDK to an AgentCore Browser session. Nova Act is Amazon's native browser automation agent — you give it a natural language prompt and a starting...",
    "sectionId": "browser",
    "kind": "feature",
    "frameworks": [],
    "languages": [
      "python"
    ],
    "hasNotebook": false,
    "readme": "/agentcore-samples/01-features/03-connect-your-agent-to-anything/02-browser/01-nova-act/README.md",
    "base": "/agentcore-samples/01-features/03-connect-your-agent-to-anything/02-browser/01-nova-act",
    "files": [
      {
        "path": "getting_started.py",
        "lang": "python",
        "bytes": 3468
      },
      {
        "path": "live_view.py",
        "lang": "python",
        "bytes": 8511
      }
    ]
  },
  {
    "slug": "01-features/03-connect-your-agent-to-anything/02-browser/02-browser-use",
    "title": "Headless Browser Automation with Browser-Use SDK",
    "desc": "Browser-Use is a popular open-source browser automation framework that wraps LLMs into agentic browser loops. This demo shows how to connect Browser-Use to an AgentCore Browser session, so the...",
    "sectionId": "browser",
    "kind": "feature",
    "frameworks": [],
    "languages": [
      "python"
    ],
    "hasNotebook": false,
    "readme": "/agentcore-samples/01-features/03-connect-your-agent-to-anything/02-browser/02-browser-use/README.md",
    "base": "/agentcore-samples/01-features/03-connect-your-agent-to-anything/02-browser/02-browser-use",
    "files": [
      {
        "path": "getting_started.py",
        "lang": "python",
        "bytes": 4986
      },
      {
        "path": "patch_browser_use.py",
        "lang": "python",
        "bytes": 3824
      }
    ]
  },
  {
    "slug": "01-features/03-connect-your-agent-to-anything/02-browser/03-observability",
    "title": "Browser Session Recording and observability",
    "desc": "AgentCore Browser Tool can record everything that happens in a browser session — every page navigation, click, network request, and console message — and store the recording in Amazon S3. You can...",
    "sectionId": "browser",
    "kind": "feature",
    "frameworks": [],
    "languages": [
      "python"
    ],
    "hasNotebook": false,
    "readme": "/agentcore-samples/01-features/03-connect-your-agent-to-anything/02-browser/03-observability/README.md",
    "base": "/agentcore-samples/01-features/03-connect-your-agent-to-anything/02-browser/03-observability",
    "files": [
      {
        "path": "browser_observability.py",
        "lang": "python",
        "bytes": 11564
      }
    ]
  },
  {
    "slug": "01-features/03-connect-your-agent-to-anything/02-browser/04-strands",
    "title": "Intelligent Web Analysis with Strands and AgentCoreBrowser",
    "desc": "This demo shows how to give a Strands agent the ability to browse the web by adding AgentCoreBrowser as a tool. The agent receives a natural language question, autonomously navigates to the...",
    "sectionId": "browser",
    "kind": "feature",
    "frameworks": [
      "Strands"
    ],
    "languages": [
      "python"
    ],
    "hasNotebook": false,
    "readme": "/agentcore-samples/01-features/03-connect-your-agent-to-anything/02-browser/04-strands/README.md",
    "base": "/agentcore-samples/01-features/03-connect-your-agent-to-anything/02-browser/04-strands",
    "files": [
      {
        "path": "demo.py",
        "lang": "python",
        "bytes": 3574
      }
    ]
  },
  {
    "slug": "01-features/03-connect-your-agent-to-anything/02-browser/05-domain-filtering",
    "title": "Browser Domain Filtering with AWS Network Firewall",
    "desc": "By default, an AgentCore Browser session can navigate to any URL on the internet. For production agents — especially those handling sensitive data or operating in regulated environments — you need...",
    "sectionId": "browser",
    "kind": "feature",
    "frameworks": [],
    "languages": [
      "python"
    ],
    "hasNotebook": false,
    "readme": "/agentcore-samples/01-features/03-connect-your-agent-to-anything/02-browser/05-domain-filtering/README.md",
    "base": "/agentcore-samples/01-features/03-connect-your-agent-to-anything/02-browser/05-domain-filtering",
    "files": [
      {
        "path": "agentcore-browser-firewall.yaml",
        "lang": "yaml",
        "bytes": 17095
      },
      {
        "path": "verify_domain_filtering.py",
        "lang": "python",
        "bytes": 3812
      }
    ]
  },
  {
    "slug": "01-features/03-connect-your-agent-to-anything/02-browser/06-web-bot-auth",
    "title": "AgentCore Browser — Web Bot Auth Signing",
    "desc": "Web Bot Auth (WBA) is a Cloudflare standard that lets browsers prove they are legitimate AI agents by attaching cryptographic signatures to every outgoing HTTP request. When browserSigning is...",
    "sectionId": "browser",
    "kind": "feature",
    "frameworks": [
      "Strands"
    ],
    "languages": [
      "python"
    ],
    "hasNotebook": false,
    "readme": "/agentcore-samples/01-features/03-connect-your-agent-to-anything/02-browser/06-web-bot-auth/README.md",
    "base": "/agentcore-samples/01-features/03-connect-your-agent-to-anything/02-browser/06-web-bot-auth",
    "files": [
      {
        "path": "web_bot_auth.py",
        "lang": "python",
        "bytes": 10785
      }
    ]
  },
  {
    "slug": "01-features/03-connect-your-agent-to-anything/02-browser/07-public-browser-private-vpc",
    "title": "AgentCore Browser — Public Browser + Private VPC Runtime",
    "desc": "This sample deploys a hybrid architecture where the AgentCore Browser runs in a public subnet with direct internet access, while the AgentCore Runtime runs in a private subnet with no internet...",
    "sectionId": "browser",
    "kind": "feature",
    "frameworks": [],
    "languages": [
      "python"
    ],
    "hasNotebook": false,
    "readme": "/agentcore-samples/01-features/03-connect-your-agent-to-anything/02-browser/07-public-browser-private-vpc/README.md",
    "base": "/agentcore-samples/01-features/03-connect-your-agent-to-anything/02-browser/07-public-browser-private-vpc",
    "files": [
      {
        "path": "cfn-browser.yaml",
        "lang": "yaml",
        "bytes": 49662
      },
      {
        "path": "deploy.py",
        "lang": "python",
        "bytes": 5363
      }
    ]
  },
  {
    "slug": "01-features/03-connect-your-agent-to-anything/02-browser/08-vpc-browser-from-vpc",
    "title": "AgentCore Browser — VPC Browser from VPC Runtime (Fully Private)",
    "desc": "This sample deploys a fully private architecture where both the AgentCore Browser and Runtime operate inside a VPC with no public internet egress. The browser is limited to internal resources — an...",
    "sectionId": "browser",
    "kind": "feature",
    "frameworks": [],
    "languages": [
      "python"
    ],
    "hasNotebook": false,
    "readme": "/agentcore-samples/01-features/03-connect-your-agent-to-anything/02-browser/08-vpc-browser-from-vpc/README.md",
    "base": "/agentcore-samples/01-features/03-connect-your-agent-to-anything/02-browser/08-vpc-browser-from-vpc",
    "files": [
      {
        "path": "cfn-vpc-browser.yaml",
        "lang": "yaml",
        "bytes": 54281
      },
      {
        "path": "deploy.py",
        "lang": "python",
        "bytes": 6500
      }
    ]
  },
  {
    "slug": "01-features/03-connect-your-agent-to-anything/02-browser/09-browser-profile",
    "title": "AgentCore Browser — Browser Profile Persistence",
    "desc": "A Browser Profile stores browser session state — cookies, localStorage, and session storage — so that data set in one session is available in a subsequent session. This is useful when agents need...",
    "sectionId": "browser",
    "kind": "feature",
    "frameworks": [],
    "languages": [
      "python"
    ],
    "hasNotebook": false,
    "readme": "/agentcore-samples/01-features/03-connect-your-agent-to-anything/02-browser/09-browser-profile/README.md",
    "base": "/agentcore-samples/01-features/03-connect-your-agent-to-anything/02-browser/09-browser-profile",
    "files": [
      {
        "path": "browser_profile.py",
        "lang": "python",
        "bytes": 13434
      }
    ]
  },
  {
    "slug": "01-features/03-connect-your-agent-to-anything/02-browser/09-browser-profile/sample-ecommerce",
    "title": "Sample E-Commerce",
    "desc": "Simple static e-commerce site for t-shirts with persistent shopping cart using localStorage.",
    "sectionId": "browser",
    "kind": "feature",
    "frameworks": [],
    "languages": [
      "javascript"
    ],
    "hasNotebook": false,
    "readme": "/agentcore-samples/01-features/03-connect-your-agent-to-anything/02-browser/09-browser-profile/sample-ecommerce/README.md",
    "base": "/agentcore-samples/01-features/03-connect-your-agent-to-anything/02-browser/09-browser-profile/sample-ecommerce",
    "files": [
      {
        "path": "cloudformation.yaml",
        "lang": "yaml",
        "bytes": 3258
      },
      {
        "path": "delete.sh",
        "lang": "bash",
        "bytes": 527
      },
      {
        "path": "deploy.sh",
        "lang": "bash",
        "bytes": 2217
      },
      {
        "path": "index.html",
        "lang": "html",
        "bytes": 849
      },
      {
        "path": "script.js",
        "lang": "javascript",
        "bytes": 2876
      },
      {
        "path": "style.css",
        "lang": "css",
        "bytes": 1870
      },
      {
        "path": "update.sh",
        "lang": "bash",
        "bytes": 1245
      }
    ]
  },
  {
    "slug": "01-features/03-connect-your-agent-to-anything/02-browser/10-proxy",
    "title": "AgentCore Browser — Squid Proxy Routing",
    "desc": "This sample routes all AgentCore Browser web traffic through an authenticated Squid forward proxy running on EC2. Every URL the browser visits appears in Squid's access log, which is synced to S3...",
    "sectionId": "browser",
    "kind": "feature",
    "frameworks": [],
    "languages": [
      "python"
    ],
    "hasNotebook": false,
    "readme": "/agentcore-samples/01-features/03-connect-your-agent-to-anything/02-browser/10-proxy/README.md",
    "base": "/agentcore-samples/01-features/03-connect-your-agent-to-anything/02-browser/10-proxy",
    "files": [
      {
        "path": "agentcore-browser-proxy.yaml",
        "lang": "yaml",
        "bytes": 17045
      },
      {
        "path": "requirements.txt",
        "lang": "text",
        "bytes": 26
      },
      {
        "path": "verify_proxy.py",
        "lang": "python",
        "bytes": 3507
      }
    ]
  },
  {
    "slug": "01-features/03-connect-your-agent-to-anything/02-browser/11-extensions",
    "title": "AgentCore Browser — Browser Extensions",
    "desc": "AgentCore Browser supports loading custom Chrome extensions into browser sessions at session-creation time. Extensions are stored in S3 as zip files and loaded via the extensions parameter of...",
    "sectionId": "browser",
    "kind": "feature",
    "frameworks": [],
    "languages": [
      "python"
    ],
    "hasNotebook": false,
    "readme": "/agentcore-samples/01-features/03-connect-your-agent-to-anything/02-browser/11-extensions/README.md",
    "base": "/agentcore-samples/01-features/03-connect-your-agent-to-anything/02-browser/11-extensions",
    "files": [
      {
        "path": "browser_extensions.py",
        "lang": "python",
        "bytes": 9904
      },
      {
        "path": "extension/manifest.json",
        "lang": "json",
        "bytes": 271
      },
      {
        "path": "extension/popup.html",
        "lang": "html",
        "bytes": 378
      }
    ]
  },
  {
    "slug": "01-features/03-connect-your-agent-to-anything/02-browser/12-chrome-policies",
    "title": "AgentCore Browser — Chrome Enterprise Policies and Custom Root CAs",
    "desc": "Two complementary browser security features demonstrated together:",
    "sectionId": "browser",
    "kind": "feature",
    "frameworks": [
      "Strands"
    ],
    "languages": [
      "python"
    ],
    "hasNotebook": false,
    "readme": "/agentcore-samples/01-features/03-connect-your-agent-to-anything/02-browser/12-chrome-policies/README.md",
    "base": "/agentcore-samples/01-features/03-connect-your-agent-to-anything/02-browser/12-chrome-policies",
    "files": [
      {
        "path": "chrome_policies.py",
        "lang": "python",
        "bytes": 20853
      }
    ]
  },
  {
    "slug": "01-features/03-connect-your-agent-to-anything/02-browser/13-os-actions",
    "title": "AgentCore Browser — OS-Level Actions (InvokeBrowser API)",
    "desc": "The InvokeBrowser API lets you send raw OS-level input events directly to the browser sandbox VM — bypassing the CDP/Playwright automation layer entirely. This is the lowest-level interface to the...",
    "sectionId": "browser",
    "kind": "feature",
    "frameworks": [],
    "languages": [
      "python"
    ],
    "hasNotebook": false,
    "readme": "/agentcore-samples/01-features/03-connect-your-agent-to-anything/02-browser/13-os-actions/README.md",
    "base": "/agentcore-samples/01-features/03-connect-your-agent-to-anything/02-browser/13-os-actions",
    "files": [
      {
        "path": "os_actions.py",
        "lang": "python",
        "bytes": 12718
      }
    ]
  },
  {
    "slug": "01-features/03-connect-your-agent-to-anything/03-web-search/01-raw-mcp",
    "title": "Raw MCP Tool Discovery and Invocation",
    "desc": "This example calls the AgentCore gateway directly over the MCP protocol — no agent framework involved. It's the simplest way to verify your Gateway and Web Search Tool target are working correctly.",
    "sectionId": null,
    "kind": "feature",
    "frameworks": [
      "Strands"
    ],
    "languages": [
      "python"
    ],
    "hasNotebook": false,
    "readme": "/agentcore-samples/01-features/03-connect-your-agent-to-anything/03-web-search/01-raw-mcp/README.md",
    "base": "/agentcore-samples/01-features/03-connect-your-agent-to-anything/03-web-search/01-raw-mcp",
    "files": [
      {
        "path": "cleanup.py",
        "lang": "python",
        "bytes": 4000
      },
      {
        "path": "raw_mcp_call.py",
        "lang": "python",
        "bytes": 4174
      },
      {
        "path": "setup_gateway.py",
        "lang": "python",
        "bytes": 505
      }
    ]
  },
  {
    "slug": "01-features/03-connect-your-agent-to-anything/03-web-search/02-strands-agent",
    "title": "Web Search with a Strands AI Agent",
    "desc": "This example shows the complete agent integration: a Strands agent automatically discovers and invokes the Web Search Tool to answer real-time questions with cited sources.",
    "sectionId": null,
    "kind": "feature",
    "frameworks": [
      "Strands"
    ],
    "languages": [
      "python"
    ],
    "hasNotebook": false,
    "readme": "/agentcore-samples/01-features/03-connect-your-agent-to-anything/03-web-search/02-strands-agent/README.md",
    "base": "/agentcore-samples/01-features/03-connect-your-agent-to-anything/03-web-search/02-strands-agent",
    "files": [
      {
        "path": "cleanup.py",
        "lang": "python",
        "bytes": 4000
      },
      {
        "path": "setup_gateway.py",
        "lang": "python",
        "bytes": 505
      },
      {
        "path": "web_search_strands.py",
        "lang": "python",
        "bytes": 3323
      }
    ]
  },
  {
    "slug": "01-features/03-connect-your-agent-to-anything/03-web-search/03-langchain-agent",
    "title": "Web Search with a LangChain Agent",
    "desc": "This demo shows the same Web Search Tool integration using LangChain and LangGraph instead of Strands. It uses langchain-mcp-adapters to connect to the AgentCore gateway and createreactagent from...",
    "sectionId": null,
    "kind": "feature",
    "frameworks": [
      "Strands",
      "LangGraph",
      "LangChain"
    ],
    "languages": [
      "python"
    ],
    "hasNotebook": false,
    "readme": "/agentcore-samples/01-features/03-connect-your-agent-to-anything/03-web-search/03-langchain-agent/README.md",
    "base": "/agentcore-samples/01-features/03-connect-your-agent-to-anything/03-web-search/03-langchain-agent",
    "files": [
      {
        "path": "cleanup.py",
        "lang": "python",
        "bytes": 4000
      },
      {
        "path": "setup_gateway.py",
        "lang": "python",
        "bytes": 376
      },
      {
        "path": "web_search_langchain.py",
        "lang": "python",
        "bytes": 4349
      }
    ]
  },
  {
    "slug": "01-features/03-connect-your-agent-to-anything/04-fmkb-managed-kb/01-raw-mcp",
    "title": "01-raw-mcp — verify the gateway path without an agent",
    "desc": "The smallest possible test of the FMKB-as-MCP-tool plumbing. Run this first when something's broken — it isolates the gateway/IAM layer from the agent layer.",
    "sectionId": null,
    "kind": "feature",
    "frameworks": [
      "Strands"
    ],
    "languages": [
      "python"
    ],
    "hasNotebook": false,
    "readme": "/agentcore-samples/01-features/03-connect-your-agent-to-anything/04-fmkb-managed-kb/01-raw-mcp/README.md",
    "base": "/agentcore-samples/01-features/03-connect-your-agent-to-anything/04-fmkb-managed-kb/01-raw-mcp",
    "files": [
      {
        "path": "cleanup.py",
        "lang": "python",
        "bytes": 2533
      },
      {
        "path": "raw_mcp_call.py",
        "lang": "python",
        "bytes": 2903
      },
      {
        "path": "setup_gateway.py",
        "lang": "python",
        "bytes": 4976
      }
    ]
  },
  {
    "slug": "01-features/03-connect-your-agent-to-anything/04-fmkb-managed-kb/02-strands-agent",
    "title": "02-strands-agent — Strands agent on AgentCore Runtime",
    "desc": "Same shape as the upstream bedrock-samples / managed-knowledge-bases / 03-use-case-example notebook, but the agent runs on AgentCore Runtime instead of locally. Uses the agentcore CLI from...",
    "sectionId": null,
    "kind": "feature",
    "frameworks": [
      "Strands"
    ],
    "languages": [
      "python"
    ],
    "hasNotebook": false,
    "readme": "/agentcore-samples/01-features/03-connect-your-agent-to-anything/04-fmkb-managed-kb/02-strands-agent/README.md",
    "base": "/agentcore-samples/01-features/03-connect-your-agent-to-anything/04-fmkb-managed-kb/02-strands-agent",
    "files": [
      {
        "path": "fmkb_gateway_strands.py",
        "lang": "python",
        "bytes": 2268
      },
      {
        "path": "iam/runtime-execution-policy.json",
        "lang": "json",
        "bytes": 2574
      },
      {
        "path": "iam/runtime-trust-policy.json",
        "lang": "json",
        "bytes": 464
      },
      {
        "path": "requirements.txt",
        "lang": "text",
        "bytes": 371
      }
    ]
  },
  {
    "slug": "01-features/04-manage-context-of-your-agent/memory/00-getting-started",
    "title": "Getting started with AgentCore memory",
    "desc": "The agent writes events to short-term memory and reads back memory records extracted into long-term memory. Both layers share the same memory resource and namespace hierarchy.",
    "sectionId": "memory",
    "kind": "feature",
    "frameworks": [
      "Strands",
      "LangGraph",
      "LlamaIndex"
    ],
    "languages": [
      "python"
    ],
    "hasNotebook": false,
    "readme": "/agentcore-samples/01-features/04-manage-context-of-your-agent/memory/00-getting-started/README.md",
    "base": "/agentcore-samples/01-features/04-manage-context-of-your-agent/memory/00-getting-started",
    "files": [
      {
        "path": "01-memory-concepts.md",
        "lang": "markdown",
        "bytes": 2778
      },
      {
        "path": "02-choosing-your-surface.md",
        "lang": "markdown",
        "bytes": 2766
      },
      {
        "path": "03-quickstart-cli.md",
        "lang": "markdown",
        "bytes": 3827
      },
      {
        "path": "04-quickstart-boto3.py",
        "lang": "python",
        "bytes": 4418
      },
      {
        "path": "05-quickstart-agentcore-sdk.py",
        "lang": "python",
        "bytes": 1620
      }
    ]
  },
  {
    "slug": "01-features/04-manage-context-of-your-agent/memory/01-short-term-memory",
    "title": "Short-term memory",
    "desc": "Short-term memory stores raw conversation turns (events) scoped to an actorId and a sessionId. It gives the agent immediate, low-latency access to the current conversation — no extraction, no...",
    "sectionId": "memory",
    "kind": "feature",
    "frameworks": [
      "Strands",
      "LangGraph",
      "LlamaIndex"
    ],
    "languages": [
      "python"
    ],
    "hasNotebook": false,
    "readme": "/agentcore-samples/01-features/04-manage-context-of-your-agent/memory/01-short-term-memory/README.md",
    "base": "/agentcore-samples/01-features/04-manage-context-of-your-agent/memory/01-short-term-memory",
    "files": [
      {
        "path": "examples/README.md",
        "lang": "markdown",
        "bytes": 864
      },
      {
        "path": "examples/multi-agent/README.md",
        "lang": "markdown",
        "bytes": 692
      },
      {
        "path": "examples/single-agent/README.md",
        "lang": "markdown",
        "bytes": 1049
      },
      {
        "path": "standard-usage.py",
        "lang": "python",
        "bytes": 5604
      }
    ]
  },
  {
    "slug": "01-features/04-manage-context-of-your-agent/memory/01-short-term-memory/01-events-and-sessions",
    "title": "Events and sessions",
    "desc": "Events are the atomic unit of short-term memory. Each event is immutable, timestamped, and scoped to an actorId + sessionId. A session is just a chronologically ordered group of events — there is...",
    "sectionId": "memory",
    "kind": "feature",
    "frameworks": [],
    "languages": [
      "python"
    ],
    "hasNotebook": false,
    "readme": "/agentcore-samples/01-features/04-manage-context-of-your-agent/memory/01-short-term-memory/01-events-and-sessions/README.md",
    "base": "/agentcore-samples/01-features/04-manage-context-of-your-agent/memory/01-short-term-memory/01-events-and-sessions",
    "files": [
      {
        "path": "events-and-sessions.py",
        "lang": "python",
        "bytes": 6837
      }
    ]
  },
  {
    "slug": "01-features/04-manage-context-of-your-agent/memory/01-short-term-memory/02-event-metadata",
    "title": "Event metadata and filtering",
    "desc": "Attach key-value metadata to each event so you can filter ListEvents later without scanning the whole session. Examples: tag events by topic, channel, priority, or downstream-pipeline routing key.",
    "sectionId": "memory",
    "kind": "feature",
    "frameworks": [],
    "languages": [
      "python"
    ],
    "hasNotebook": false,
    "readme": "/agentcore-samples/01-features/04-manage-context-of-your-agent/memory/01-short-term-memory/02-event-metadata/README.md",
    "base": "/agentcore-samples/01-features/04-manage-context-of-your-agent/memory/01-short-term-memory/02-event-metadata",
    "files": [
      {
        "path": "event-metadata-filtering.py",
        "lang": "python",
        "bytes": 6954
      }
    ]
  },
  {
    "slug": "01-features/04-manage-context-of-your-agent/memory/01-short-term-memory/03-actor-session-isolation",
    "title": "Actor and session isolation",
    "desc": "actorId + sessionId are the only required scoping keys for short-term memory. A single memory resource can serve every user in your application — events are isolated by these two keys at the API...",
    "sectionId": "memory",
    "kind": "feature",
    "frameworks": [],
    "languages": [
      "python"
    ],
    "hasNotebook": false,
    "readme": "/agentcore-samples/01-features/04-manage-context-of-your-agent/memory/01-short-term-memory/03-actor-session-isolation/README.md",
    "base": "/agentcore-samples/01-features/04-manage-context-of-your-agent/memory/01-short-term-memory/03-actor-session-isolation",
    "files": [
      {
        "path": "actor-session-isolation.py",
        "lang": "python",
        "bytes": 8240
      }
    ]
  },
  {
    "slug": "01-features/04-manage-context-of-your-agent/memory/01-short-term-memory/04-branching",
    "title": "Event branching",
    "desc": "Branches let you fork a session at a chosen event and continue down divergent paths. Each branch is identified by a name and a rootEventId (the parent event it forks from). Branches share the...",
    "sectionId": "memory",
    "kind": "feature",
    "frameworks": [
      "Strands"
    ],
    "languages": [
      "python"
    ],
    "hasNotebook": false,
    "readme": "/agentcore-samples/01-features/04-manage-context-of-your-agent/memory/01-short-term-memory/04-branching/README.md",
    "base": "/agentcore-samples/01-features/04-manage-context-of-your-agent/memory/01-short-term-memory/04-branching",
    "files": [
      {
        "path": "event-branching.py",
        "lang": "python",
        "bytes": 7401
      }
    ]
  },
  {
    "slug": "01-features/04-manage-context-of-your-agent/memory/01-short-term-memory/examples/multi-agent/with-strands-agent",
    "title": "Short-term memory — Strands multi-agent",
    "desc": "A travel-planning system where a coordinator agent delegates to specialized flight and hotel booking assistants, all sharing one AgentCore short-term memory resource. Each specialist has its own...",
    "sectionId": "memory",
    "kind": "feature",
    "frameworks": [
      "Strands"
    ],
    "languages": [
      "python"
    ],
    "hasNotebook": false,
    "readme": "/agentcore-samples/01-features/04-manage-context-of-your-agent/memory/01-short-term-memory/examples/multi-agent/with-strands-agent/README.md",
    "base": "/agentcore-samples/01-features/04-manage-context-of-your-agent/memory/01-short-term-memory/examples/multi-agent/with-strands-agent",
    "files": [
      {
        "path": "requirements.txt",
        "lang": "text",
        "bytes": 38
      },
      {
        "path": "travel-planning-agent-memory-manager.py",
        "lang": "python",
        "bytes": 17945
      },
      {
        "path": "travel-planning-agent.py",
        "lang": "python",
        "bytes": 15600
      }
    ]
  },
  {
    "slug": "01-features/04-manage-context-of-your-agent/memory/01-short-term-memory/examples/multi-agent/with-strands-agent/multi-agent-parallel-branches",
    "title": "Short-term memory — multi-agent parallel branches",
    "desc": "A travel-planning system built on a Strands Agent Graph where each agent runs in its own AgentCore Memory branch. Branching gives every agent an isolated conversation context within a single...",
    "sectionId": "memory",
    "kind": "feature",
    "frameworks": [
      "Strands"
    ],
    "languages": [
      "python"
    ],
    "hasNotebook": false,
    "readme": "/agentcore-samples/01-features/04-manage-context-of-your-agent/memory/01-short-term-memory/examples/multi-agent/with-strands-agent/multi-agent-parallel-branches/README.md",
    "base": "/agentcore-samples/01-features/04-manage-context-of-your-agent/memory/01-short-term-memory/examples/multi-agent/with-strands-agent/multi-agent-parallel-branches",
    "files": [
      {
        "path": "multi-agent-parallel-execution-with-memory-branching.py",
        "lang": "python",
        "bytes": 34091
      },
      {
        "path": "requirements.txt",
        "lang": "text",
        "bytes": 46
      }
    ]
  },
  {
    "slug": "01-features/04-manage-context-of-your-agent/memory/01-short-term-memory/examples/single-agent/with-claude-sdk",
    "title": "Short-term memory — Claude SDK single-agent",
    "desc": "A conversation loop built directly on the Anthropic Claude SDK (via Amazon Bedrock), wired to AgentCore short-term memory.",
    "sectionId": "memory",
    "kind": "feature",
    "frameworks": [
      "Strands",
      "LangGraph",
      "LlamaIndex"
    ],
    "languages": [
      "python"
    ],
    "hasNotebook": false,
    "readme": "/agentcore-samples/01-features/04-manage-context-of-your-agent/memory/01-short-term-memory/examples/single-agent/with-claude-sdk/README.md",
    "base": "/agentcore-samples/01-features/04-manage-context-of-your-agent/memory/01-short-term-memory/examples/single-agent/with-claude-sdk",
    "files": [
      {
        "path": "claude-sdk-stm-conversation.py",
        "lang": "python",
        "bytes": 14389
      },
      {
        "path": "requirements.txt",
        "lang": "text",
        "bytes": 350
      }
    ]
  },
  {
    "slug": "01-features/04-manage-context-of-your-agent/memory/01-short-term-memory/examples/single-agent/with-langgraph-agent",
    "title": "Short-term memory — LangGraph single-agent",
    "desc": "Three LangGraph examples that use Amazon Bedrock AgentCore Memory for short-term memory — running context within a conversation, persisted and resumed across turns. The common thread is the...",
    "sectionId": "memory",
    "kind": "feature",
    "frameworks": [
      "LangGraph",
      "LangChain"
    ],
    "languages": [
      "python"
    ],
    "hasNotebook": false,
    "readme": "/agentcore-samples/01-features/04-manage-context-of-your-agent/memory/01-short-term-memory/examples/single-agent/with-langgraph-agent/README.md",
    "base": "/agentcore-samples/01-features/04-manage-context-of-your-agent/memory/01-short-term-memory/examples/single-agent/with-langgraph-agent",
    "files": [
      {
        "path": "math-agent-with-checkpointing.py",
        "lang": "python",
        "bytes": 9033
      },
      {
        "path": "personal-fitness-coach.py",
        "lang": "python",
        "bytes": 12361
      },
      {
        "path": "requirements.txt",
        "lang": "text",
        "bytes": 87
      },
      {
        "path": "support-agent-human-in-the-loop.py",
        "lang": "python",
        "bytes": 9994
      }
    ]
  },
  {
    "slug": "01-features/04-manage-context-of-your-agent/memory/01-short-term-memory/examples/single-agent/with-llamaindex-agent",
    "title": "LlamaIndex + AgentCore memory — short-term",
    "desc": "Four domain-specific notebooks showing how to wire LlamaIndex's AgentCoreMemory context into a FunctionAgent for session-scoped conversation memory.",
    "sectionId": "memory",
    "kind": "feature",
    "frameworks": [
      "LlamaIndex"
    ],
    "languages": [
      "python"
    ],
    "hasNotebook": false,
    "readme": "/agentcore-samples/01-features/04-manage-context-of-your-agent/memory/01-short-term-memory/examples/single-agent/with-llamaindex-agent/README.md",
    "base": "/agentcore-samples/01-features/04-manage-context-of-your-agent/memory/01-short-term-memory/examples/single-agent/with-llamaindex-agent",
    "files": [
      {
        "path": "academic-research-assistant-short-term-memory-tutorial.py",
        "lang": "python",
        "bytes": 15118
      },
      {
        "path": "investment-portfolio-advisor-short-term-memory-tutorial.py",
        "lang": "python",
        "bytes": 22112
      },
      {
        "path": "legal-document-analyzer-short-term-memory-tutorial.py",
        "lang": "python",
        "bytes": 19767
      },
      {
        "path": "medical-knowledge-assistant-short-term-memory-tutorial.py",
        "lang": "python",
        "bytes": 20990
      },
      {
        "path": "requirements.txt",
        "lang": "text",
        "bytes": 191
      }
    ]
  },
  {
    "slug": "01-features/04-manage-context-of-your-agent/memory/01-short-term-memory/examples/single-agent/with-strands-agent",
    "title": "Short-term memory — Strands single-agent",
    "desc": "A personal assistant built with Strands Agents, wired to AgentCore short-term memory through lifecycle hooks. The agent loads recent turns on startup (getlastkturns) and stores each new message as...",
    "sectionId": "memory",
    "kind": "feature",
    "frameworks": [
      "Strands"
    ],
    "languages": [
      "python"
    ],
    "hasNotebook": false,
    "readme": "/agentcore-samples/01-features/04-manage-context-of-your-agent/memory/01-short-term-memory/examples/single-agent/with-strands-agent/README.md",
    "base": "/agentcore-samples/01-features/04-manage-context-of-your-agent/memory/01-short-term-memory/examples/single-agent/with-strands-agent",
    "files": [
      {
        "path": "personal-agent-memory-manager.py",
        "lang": "python",
        "bytes": 15157
      },
      {
        "path": "personal-agent.py",
        "lang": "python",
        "bytes": 11825
      },
      {
        "path": "requirements.txt",
        "lang": "text",
        "bytes": 61
      }
    ]
  },
  {
    "slug": "01-features/04-manage-context-of-your-agent/memory/01-short-term-memory/examples/single-agent/with-strands-agent/travel-planning-branching",
    "title": "Short-term memory — Strands branching",
    "desc": "A travel-planning assistant that uses AgentCore Memory branching to fork conversation history. Branches let the agent explore alternative \"what-if\" paths (e.g. separate flight and hotel threads)...",
    "sectionId": "memory",
    "kind": "feature",
    "frameworks": [
      "Strands"
    ],
    "languages": [
      "python"
    ],
    "hasNotebook": false,
    "readme": "/agentcore-samples/01-features/04-manage-context-of-your-agent/memory/01-short-term-memory/examples/single-agent/with-strands-agent/travel-planning-branching/README.md",
    "base": "/agentcore-samples/01-features/04-manage-context-of-your-agent/memory/01-short-term-memory/examples/single-agent/with-strands-agent/travel-planning-branching",
    "files": [
      {
        "path": "requirements.txt",
        "lang": "text",
        "bytes": 45
      },
      {
        "path": "travel-planning-agent-with-memory-branching.py",
        "lang": "python",
        "bytes": 29925
      }
    ]
  },
  {
    "slug": "01-features/04-manage-context-of-your-agent/memory/02-long-term-memory",
    "title": "Long-term memory",
    "desc": "Long-term memory turns raw conversation events into structured, reusable records — facts, summaries, preferences, and episodes — organised in namespaces and retrieved by semantic search.",
    "sectionId": "memory",
    "kind": "feature",
    "frameworks": [
      "Strands",
      "LangGraph",
      "LlamaIndex"
    ],
    "languages": [
      "python"
    ],
    "hasNotebook": false,
    "readme": "/agentcore-samples/01-features/04-manage-context-of-your-agent/memory/02-long-term-memory/README.md",
    "base": "/agentcore-samples/01-features/04-manage-context-of-your-agent/memory/02-long-term-memory",
    "files": [
      {
        "path": "examples/README.md",
        "lang": "markdown",
        "bytes": 1329
      },
      {
        "path": "examples/multi-agent/README.md",
        "lang": "markdown",
        "bytes": 974
      },
      {
        "path": "examples/multi-agent/with-strands-agent/README.md",
        "lang": "markdown",
        "bytes": 1070
      },
      {
        "path": "examples/single-agent/README.md",
        "lang": "markdown",
        "bytes": 1092
      },
      {
        "path": "examples/single-agent/with-claude-sdk/README.md",
        "lang": "markdown",
        "bytes": 5468
      },
      {
        "path": "examples/single-agent/with-langgraph-agent/README.md",
        "lang": "markdown",
        "bytes": 2808
      },
      {
        "path": "examples/single-agent/with-llamaindex-agent/README.md",
        "lang": "markdown",
        "bytes": 1981
      },
      {
        "path": "examples/single-agent/with-strands-agent/README.md",
        "lang": "markdown",
        "bytes": 1289
      },
      {
        "path": "requirements.txt",
        "lang": "text",
        "bytes": 39
      },
      {
        "path": "standard-usage.py",
        "lang": "python",
        "bytes": 6865
      }
    ]
  },
  {
    "slug": "01-features/04-manage-context-of-your-agent/memory/02-long-term-memory/01-built-in-strategies",
    "title": "Built-in memory strategies",
    "desc": "Built-in strategies are managed extraction pipelines that turn raw events into structured long-term memory records. AgentCore handles the prompt, the model, and the schema — you only pick which...",
    "sectionId": "memory",
    "kind": "feature",
    "frameworks": [],
    "languages": [
      "python"
    ],
    "hasNotebook": false,
    "readme": "/agentcore-samples/01-features/04-manage-context-of-your-agent/memory/02-long-term-memory/01-built-in-strategies/README.md",
    "base": "/agentcore-samples/01-features/04-manage-context-of-your-agent/memory/02-long-term-memory/01-built-in-strategies",
    "files": [
      {
        "path": "episodic.py",
        "lang": "python",
        "bytes": 13496
      },
      {
        "path": "semantic.py",
        "lang": "python",
        "bytes": 6978
      },
      {
        "path": "summary.py",
        "lang": "python",
        "bytes": 7337
      },
      {
        "path": "user-preference.py",
        "lang": "python",
        "bytes": 6880
      }
    ]
  },
  {
    "slug": "01-features/04-manage-context-of-your-agent/memory/02-long-term-memory/02-strategy-overrides",
    "title": "Built-in strategies with prompt overrides",
    "desc": "Built-in overrides keep the AgentCore-managed extraction pipeline but let you customise:",
    "sectionId": "memory",
    "kind": "feature",
    "frameworks": [],
    "languages": [
      "python"
    ],
    "hasNotebook": false,
    "readme": "/agentcore-samples/01-features/04-manage-context-of-your-agent/memory/02-long-term-memory/02-strategy-overrides/README.md",
    "base": "/agentcore-samples/01-features/04-manage-context-of-your-agent/memory/02-long-term-memory/02-strategy-overrides",
    "files": [
      {
        "path": "strategies-with-overrides.py",
        "lang": "python",
        "bytes": 6903
      }
    ]
  },
  {
    "slug": "01-features/04-manage-context-of-your-agent/memory/02-long-term-memory/03-self-managed-strategy",
    "title": "Self-managed memory strategy",
    "desc": "You own the extraction pipeline end-to-end. AgentCore handles only storage and retrieval; the what to extract and how to consolidate logic lives in your code.",
    "sectionId": "memory",
    "kind": "feature",
    "frameworks": [
      "Strands"
    ],
    "languages": [
      "python"
    ],
    "hasNotebook": false,
    "readme": "/agentcore-samples/01-features/04-manage-context-of-your-agent/memory/02-long-term-memory/03-self-managed-strategy/README.md",
    "base": "/agentcore-samples/01-features/04-manage-context-of-your-agent/memory/02-long-term-memory/03-self-managed-strategy",
    "files": [
      {
        "path": "self-managed-strategy.py",
        "lang": "python",
        "bytes": 5950
      }
    ]
  },
  {
    "slug": "01-features/04-manage-context-of-your-agent/memory/02-long-term-memory/04-namespaces",
    "title": "Namespaces and organisation",
    "desc": "Namespaces are hierarchical paths that scope long-term memory records. They drive both retrieval (where the agent reads from) and IAM scoping (which records a principal is allowed to touch). Get...",
    "sectionId": "memory",
    "kind": "feature",
    "frameworks": [],
    "languages": [
      "python"
    ],
    "hasNotebook": false,
    "readme": "/agentcore-samples/01-features/04-manage-context-of-your-agent/memory/02-long-term-memory/04-namespaces/README.md",
    "base": "/agentcore-samples/01-features/04-manage-context-of-your-agent/memory/02-long-term-memory/04-namespaces",
    "files": [
      {
        "path": "namespaces-and-organization.py",
        "lang": "python",
        "bytes": 7557
      }
    ]
  },
  {
    "slug": "01-features/04-manage-context-of-your-agent/memory/02-long-term-memory/05-retrieval",
    "title": "Retrieving long-term memory records",
    "desc": "Three retrieval primitives, picked by the question you're asking:",
    "sectionId": "memory",
    "kind": "feature",
    "frameworks": [],
    "languages": [
      "python"
    ],
    "hasNotebook": false,
    "readme": "/agentcore-samples/01-features/04-manage-context-of-your-agent/memory/02-long-term-memory/05-retrieval/README.md",
    "base": "/agentcore-samples/01-features/04-manage-context-of-your-agent/memory/02-long-term-memory/05-retrieval",
    "files": [
      {
        "path": "retrieve-records-and-citations.py",
        "lang": "python",
        "bytes": 8165
      }
    ]
  },
  {
    "slug": "01-features/04-manage-context-of-your-agent/memory/02-long-term-memory/06-record-metadata",
    "title": "Record metadata",
    "desc": "Memory records can carry structured metadata (key → value) so retrieval can apply hard filters at the index instead of in the prompt. Typical uses: region, tier, source system, language, retention...",
    "sectionId": "memory",
    "kind": "feature",
    "frameworks": [],
    "languages": [
      "python"
    ],
    "hasNotebook": false,
    "readme": "/agentcore-samples/01-features/04-manage-context-of-your-agent/memory/02-long-term-memory/06-record-metadata/README.md",
    "base": "/agentcore-samples/01-features/04-manage-context-of-your-agent/memory/02-long-term-memory/06-record-metadata",
    "files": [
      {
        "path": "structured-metadata.py",
        "lang": "python",
        "bytes": 8558
      }
    ]
  },
  {
    "slug": "01-features/04-manage-context-of-your-agent/memory/02-long-term-memory/07-batch-apis",
    "title": "Batch APIs for memory records",
    "desc": "Three data-plane APIs for direct CRUD on memory records, bypassing the strategy extraction pipeline:",
    "sectionId": "memory",
    "kind": "feature",
    "frameworks": [],
    "languages": [
      "python"
    ],
    "hasNotebook": false,
    "readme": "/agentcore-samples/01-features/04-manage-context-of-your-agent/memory/02-long-term-memory/07-batch-apis/README.md",
    "base": "/agentcore-samples/01-features/04-manage-context-of-your-agent/memory/02-long-term-memory/07-batch-apis",
    "files": [
      {
        "path": "batch-create-update-delete.py",
        "lang": "python",
        "bytes": 10781
      }
    ]
  },
  {
    "slug": "01-features/04-manage-context-of-your-agent/memory/02-long-term-memory/08-manage-extraction",
    "title": "Managing extraction",
    "desc": "This folder covers the two controls you have over the extraction lifecycle:",
    "sectionId": "memory",
    "kind": "feature",
    "frameworks": [],
    "languages": [
      "python"
    ],
    "hasNotebook": false,
    "readme": "/agentcore-samples/01-features/04-manage-context-of-your-agent/memory/02-long-term-memory/08-manage-extraction/README.md",
    "base": "/agentcore-samples/01-features/04-manage-context-of-your-agent/memory/02-long-term-memory/08-manage-extraction",
    "files": [
      {
        "path": "redrive-failed-extractions.py",
        "lang": "python",
        "bytes": 3967
      },
      {
        "path": "skip-extraction.py",
        "lang": "python",
        "bytes": 5199
      }
    ]
  },
  {
    "slug": "01-features/04-manage-context-of-your-agent/memory/02-long-term-memory/09-record-streaming",
    "title": "Memory record streaming",
    "desc": "Push-based delivery of memory record lifecycle events to an Amazon Kinesis Data Stream. Subscribe to changes instead of polling — sync memory to a data lake, trigger downstream workflows, or build...",
    "sectionId": "memory",
    "kind": "feature",
    "frameworks": [],
    "languages": [
      "python"
    ],
    "hasNotebook": false,
    "readme": "/agentcore-samples/01-features/04-manage-context-of-your-agent/memory/02-long-term-memory/09-record-streaming/README.md",
    "base": "/agentcore-samples/01-features/04-manage-context-of-your-agent/memory/02-long-term-memory/09-record-streaming",
    "files": [
      {
        "path": "record-streaming.py",
        "lang": "python",
        "bytes": 11330
      }
    ]
  },
  {
    "slug": "01-features/04-manage-context-of-your-agent/memory/02-long-term-memory/09-record-streaming/examples",
    "title": "Streaming use cases",
    "desc": "Each example here composes the memory record streaming primitive with another AWS service or analytics pipeline. Read ../record-streaming.py first — it covers how to enable streaming, pick...",
    "sectionId": "memory",
    "kind": "feature",
    "frameworks": [
      "Strands"
    ],
    "languages": [
      "python"
    ],
    "hasNotebook": false,
    "readme": "/agentcore-samples/01-features/04-manage-context-of-your-agent/memory/02-long-term-memory/09-record-streaming/examples/README.md",
    "base": "/agentcore-samples/01-features/04-manage-context-of-your-agent/memory/02-long-term-memory/09-record-streaming/examples",
    "files": [
      {
        "path": "cross-customer-analytics.py",
        "lang": "python",
        "bytes": 16439
      },
      {
        "path": "personalised-recommendations.py",
        "lang": "python",
        "bytes": 20352
      }
    ]
  },
  {
    "slug": "01-features/04-manage-context-of-your-agent/memory/02-long-term-memory/09-record-streaming/examples/cross-region-replication",
    "title": "AgentCore memory Cross-Region Replication",
    "desc": "Active-passive cross-region replication for Amazon Bedrock AgentCore memory using the memory record streaming feature.",
    "sectionId": "memory",
    "kind": "feature",
    "frameworks": [],
    "languages": [
      "python"
    ],
    "hasNotebook": false,
    "readme": "/agentcore-samples/01-features/04-manage-context-of-your-agent/memory/02-long-term-memory/09-record-streaming/examples/cross-region-replication/README.md",
    "base": "/agentcore-samples/01-features/04-manage-context-of-your-agent/memory/02-long-term-memory/09-record-streaming/examples/cross-region-replication",
    "files": [
      {
        "path": "06-memory-cross-region-replication.py",
        "lang": "python",
        "bytes": 10802
      },
      {
        "path": "requirements.txt",
        "lang": "text",
        "bytes": 15
      }
    ]
  },
  {
    "slug": "01-features/04-manage-context-of-your-agent/memory/02-long-term-memory/09-record-streaming/examples/cross-region-replication/scripts",
    "title": "Cross-region replication — scripts",
    "desc": "Deployment and runtime scripts backing the cross-region replication tutorial. You don't run these directly — the notebook invokes them — but they're documented here for reference.",
    "sectionId": "memory",
    "kind": "feature",
    "frameworks": [],
    "languages": [
      "python"
    ],
    "hasNotebook": false,
    "readme": "/agentcore-samples/01-features/04-manage-context-of-your-agent/memory/02-long-term-memory/09-record-streaming/examples/cross-region-replication/scripts/README.md",
    "base": "/agentcore-samples/01-features/04-manage-context-of-your-agent/memory/02-long-term-memory/09-record-streaming/examples/cross-region-replication/scripts",
    "files": [
      {
        "path": "deploy.sh",
        "lang": "bash",
        "bytes": 6368
      },
      {
        "path": "global-stack.yaml",
        "lang": "yaml",
        "bytes": 859
      },
      {
        "path": "handler.py",
        "lang": "python",
        "bytes": 6308
      },
      {
        "path": "regional-stack.yaml",
        "lang": "yaml",
        "bytes": 5907
      },
      {
        "path": "toggle-streaming.sh",
        "lang": "bash",
        "bytes": 1516
      }
    ]
  },
  {
    "slug": "01-features/04-manage-context-of-your-agent/memory/02-long-term-memory/examples/multi-agent/with-claude-sdk",
    "title": "Long-term memory — Claude SDK multi-agent (shared memory)",
    "desc": "A multi-agent research team built directly on the Anthropic Claude SDK (via Amazon Bedrock), with no agent framework, where several specialized agents collaborate through a single shared AgentCore...",
    "sectionId": "memory",
    "kind": "feature",
    "frameworks": [],
    "languages": [
      "python"
    ],
    "hasNotebook": false,
    "readme": "/agentcore-samples/01-features/04-manage-context-of-your-agent/memory/02-long-term-memory/examples/multi-agent/with-claude-sdk/README.md",
    "base": "/agentcore-samples/01-features/04-manage-context-of-your-agent/memory/02-long-term-memory/examples/multi-agent/with-claude-sdk",
    "files": [
      {
        "path": "claude-sdk-multi-agent-shared-memory.py",
        "lang": "python",
        "bytes": 27005
      },
      {
        "path": "requirements.txt",
        "lang": "text",
        "bytes": 383
      }
    ]
  },
  {
    "slug": "01-features/04-manage-context-of-your-agent/memory/02-long-term-memory/examples/multi-agent/with-langgraph-agent",
    "title": "Long-term memory — LangGraph, multi-agent shared memory",
    "desc": "A multi-agent system built with LangGraph (createagent) where several specialized agents collaborate through a single shared AgentCore Memory resource. One agent writes, the next reads what it...",
    "sectionId": "memory",
    "kind": "feature",
    "frameworks": [
      "LangGraph",
      "LangChain"
    ],
    "languages": [
      "python"
    ],
    "hasNotebook": false,
    "readme": "/agentcore-samples/01-features/04-manage-context-of-your-agent/memory/02-long-term-memory/examples/multi-agent/with-langgraph-agent/README.md",
    "base": "/agentcore-samples/01-features/04-manage-context-of-your-agent/memory/02-long-term-memory/examples/multi-agent/with-langgraph-agent",
    "files": [
      {
        "path": "langgraph-multi-agent-shared-memory.py",
        "lang": "python",
        "bytes": 25022
      },
      {
        "path": "requirements.txt",
        "lang": "text",
        "bytes": 198
      }
    ]
  },
  {
    "slug": "01-features/04-manage-context-of-your-agent/memory/02-long-term-memory/examples/multi-agent/with-llamaindex-agent",
    "title": "Long-term memory — LlamaIndex, multi-agent shared memory",
    "desc": "A multi-agent system built with LlamaIndex (FunctionAgent) where several specialized agents collaborate through a single shared AgentCore Memory resource. One agent writes, the next reads what it...",
    "sectionId": "memory",
    "kind": "feature",
    "frameworks": [
      "LangGraph",
      "LlamaIndex"
    ],
    "languages": [
      "python"
    ],
    "hasNotebook": false,
    "readme": "/agentcore-samples/01-features/04-manage-context-of-your-agent/memory/02-long-term-memory/examples/multi-agent/with-llamaindex-agent/README.md",
    "base": "/agentcore-samples/01-features/04-manage-context-of-your-agent/memory/02-long-term-memory/examples/multi-agent/with-llamaindex-agent",
    "files": [
      {
        "path": "llamaindex-multi-agent-shared-memory.py",
        "lang": "python",
        "bytes": 27101
      },
      {
        "path": "requirements.txt",
        "lang": "text",
        "bytes": 368
      }
    ]
  },
  {
    "slug": "01-features/04-manage-context-of-your-agent/memory/02-long-term-memory/examples/multi-agent/with-strands-agent/01-built-in-hook/travel-booking-agent",
    "title": "Long-term memory — Strands multi-agent travel booking",
    "desc": "A travel-planning system where a coordinator delegates to specialized flight and hotel booking agents, all sharing one AgentCore long-term memory resource. Each specialist reads and writes its own...",
    "sectionId": "memory",
    "kind": "feature",
    "frameworks": [
      "Strands"
    ],
    "languages": [
      "python"
    ],
    "hasNotebook": false,
    "readme": "/agentcore-samples/01-features/04-manage-context-of-your-agent/memory/02-long-term-memory/examples/multi-agent/with-strands-agent/01-built-in-hook/travel-booking-agent/README.md",
    "base": "/agentcore-samples/01-features/04-manage-context-of-your-agent/memory/02-long-term-memory/examples/multi-agent/with-strands-agent/01-built-in-hook/travel-booking-agent",
    "files": [
      {
        "path": "requirements.txt",
        "lang": "text",
        "bytes": 59
      },
      {
        "path": "travel-booking-assistant.py",
        "lang": "python",
        "bytes": 17841
      }
    ]
  },
  {
    "slug": "01-features/04-manage-context-of-your-agent/memory/02-long-term-memory/examples/multi-agent/with-strands-agent/02-custom-hook/healthcare-assistant-using-episodic",
    "title": "Multi-Agent Healthcare System with Episodic memory",
    "desc": "Episodic memory captures meaningful interaction slices, identifying important moments and summarizing them into compact, organized records for focused retrieval without noise.",
    "sectionId": "memory",
    "kind": "feature",
    "frameworks": [
      "Strands"
    ],
    "languages": [
      "python"
    ],
    "hasNotebook": false,
    "readme": "/agentcore-samples/01-features/04-manage-context-of-your-agent/memory/02-long-term-memory/examples/multi-agent/with-strands-agent/02-custom-hook/healthcare-assistant-using-episodic/README.md",
    "base": "/agentcore-samples/01-features/04-manage-context-of-your-agent/memory/02-long-term-memory/examples/multi-agent/with-strands-agent/02-custom-hook/healthcare-assistant-using-episodic",
    "files": [
      {
        "path": "healthcare-data-assistant.py",
        "lang": "python",
        "bytes": 36682
      },
      {
        "path": "requirements.txt",
        "lang": "text",
        "bytes": 53
      }
    ]
  },
  {
    "slug": "01-features/04-manage-context-of-your-agent/memory/02-long-term-memory/examples/single-agent/with-claude-sdk/01-built-in-strategies",
    "title": "Long-term memory — Claude SDK, built-in strategies",
    "desc": "A conversation loop built directly on the Anthropic Claude SDK (via Amazon Bedrock), wired to AgentCore long-term memory using built-in strategies.",
    "sectionId": "memory",
    "kind": "feature",
    "frameworks": [],
    "languages": [
      "python"
    ],
    "hasNotebook": false,
    "readme": "/agentcore-samples/01-features/04-manage-context-of-your-agent/memory/02-long-term-memory/examples/single-agent/with-claude-sdk/01-built-in-strategies/README.md",
    "base": "/agentcore-samples/01-features/04-manage-context-of-your-agent/memory/02-long-term-memory/examples/single-agent/with-claude-sdk/01-built-in-strategies",
    "files": [
      {
        "path": "claude-sdk-ltm-semantic.py",
        "lang": "python",
        "bytes": 19424
      },
      {
        "path": "requirements.txt",
        "lang": "text",
        "bytes": 375
      }
    ]
  },
  {
    "slug": "01-features/04-manage-context-of-your-agent/memory/02-long-term-memory/examples/single-agent/with-claude-sdk/02-custom-strategy-override",
    "title": "Long-term memory — Claude SDK, custom strategy override",
    "desc": "A conversation loop built directly on the Anthropic Claude SDK (via Amazon Bedrock), wired to AgentCore long-term memory using a built-in strategy with overrides (also called a custom strategy...",
    "sectionId": "memory",
    "kind": "feature",
    "frameworks": [],
    "languages": [
      "python"
    ],
    "hasNotebook": false,
    "readme": "/agentcore-samples/01-features/04-manage-context-of-your-agent/memory/02-long-term-memory/examples/single-agent/with-claude-sdk/02-custom-strategy-override/README.md",
    "base": "/agentcore-samples/01-features/04-manage-context-of-your-agent/memory/02-long-term-memory/examples/single-agent/with-claude-sdk/02-custom-strategy-override",
    "files": [
      {
        "path": "claude-sdk-ltm-custom-override.py",
        "lang": "python",
        "bytes": 30326
      },
      {
        "path": "requirements.txt",
        "lang": "text",
        "bytes": 694
      }
    ]
  },
  {
    "slug": "01-features/04-manage-context-of-your-agent/memory/02-long-term-memory/examples/single-agent/with-claude-sdk/03-memory-as-tool",
    "title": "Long-term memory — Claude SDK, memory as a tool",
    "desc": "A conversation loop built directly on the Anthropic Claude SDK (via Amazon Bedrock), where AgentCore long-term memory is exposed as tools the model decides to call.",
    "sectionId": "memory",
    "kind": "feature",
    "frameworks": [],
    "languages": [
      "python"
    ],
    "hasNotebook": false,
    "readme": "/agentcore-samples/01-features/04-manage-context-of-your-agent/memory/02-long-term-memory/examples/single-agent/with-claude-sdk/03-memory-as-tool/README.md",
    "base": "/agentcore-samples/01-features/04-manage-context-of-your-agent/memory/02-long-term-memory/examples/single-agent/with-claude-sdk/03-memory-as-tool",
    "files": [
      {
        "path": "claude-sdk-ltm-memory-tool.py",
        "lang": "python",
        "bytes": 26967
      },
      {
        "path": "requirements.txt",
        "lang": "text",
        "bytes": 375
      }
    ]
  },
  {
    "slug": "01-features/04-manage-context-of-your-agent/memory/02-long-term-memory/examples/single-agent/with-claude-sdk/04-episodic-memory",
    "title": "Long-term memory — Claude SDK, Episodic strategy",
    "desc": "A debugging assistant built directly on the Anthropic Claude SDK (via Amazon Bedrock), wired to AgentCore long-term memory using the built-in Episodic strategy.",
    "sectionId": "memory",
    "kind": "feature",
    "frameworks": [],
    "languages": [
      "python"
    ],
    "hasNotebook": false,
    "readme": "/agentcore-samples/01-features/04-manage-context-of-your-agent/memory/02-long-term-memory/examples/single-agent/with-claude-sdk/04-episodic-memory/README.md",
    "base": "/agentcore-samples/01-features/04-manage-context-of-your-agent/memory/02-long-term-memory/examples/single-agent/with-claude-sdk/04-episodic-memory",
    "files": [
      {
        "path": "claude-sdk-ltm-episodic.py",
        "lang": "python",
        "bytes": 34189
      },
      {
        "path": "requirements.txt",
        "lang": "text",
        "bytes": 391
      }
    ]
  },
  {
    "slug": "01-features/04-manage-context-of-your-agent/memory/02-long-term-memory/examples/single-agent/with-langgraph-agent/01-built-in-callback",
    "title": "Long-term memory — LangGraph, built-in callback",
    "desc": "A LangGraph agent whose long-term memory is wired in by the framework, using the langgraph-checkpoint-aws package's two AgentCore integrations:",
    "sectionId": "memory",
    "kind": "feature",
    "frameworks": [
      "LangGraph",
      "LangChain"
    ],
    "languages": [
      "python"
    ],
    "hasNotebook": false,
    "readme": "/agentcore-samples/01-features/04-manage-context-of-your-agent/memory/02-long-term-memory/examples/single-agent/with-langgraph-agent/01-built-in-callback/README.md",
    "base": "/agentcore-samples/01-features/04-manage-context-of-your-agent/memory/02-long-term-memory/examples/single-agent/with-langgraph-agent/01-built-in-callback",
    "files": [
      {
        "path": "langgraph-ltm-built-in-callback.py",
        "lang": "python",
        "bytes": 22136
      },
      {
        "path": "requirements.txt",
        "lang": "text",
        "bytes": 370
      }
    ]
  },
  {
    "slug": "01-features/04-manage-context-of-your-agent/memory/02-long-term-memory/examples/single-agent/with-langgraph-agent/02-custom-callback/custom-user-preferences",
    "title": "Long-term memory — LangGraph custom user-preference callback",
    "desc": "A nutrition assistant built with LangGraph that uses a custom-override UserPreference strategy plus pre/post model hooks to automatically extract, store, and recall user preferences across...",
    "sectionId": "memory",
    "kind": "feature",
    "frameworks": [
      "LangGraph",
      "LangChain"
    ],
    "languages": [
      "python"
    ],
    "hasNotebook": false,
    "readme": "/agentcore-samples/01-features/04-manage-context-of-your-agent/memory/02-long-term-memory/examples/single-agent/with-langgraph-agent/02-custom-callback/custom-user-preferences/README.md",
    "base": "/agentcore-samples/01-features/04-manage-context-of-your-agent/memory/02-long-term-memory/examples/single-agent/with-langgraph-agent/02-custom-callback/custom-user-preferences",
    "files": [
      {
        "path": "custom_memory_prompts.py",
        "lang": "python",
        "bytes": 2048
      },
      {
        "path": "nutrition-assistant-with-user-preference-saving.py",
        "lang": "python",
        "bytes": 16411
      },
      {
        "path": "requirements.txt",
        "lang": "text",
        "bytes": 88
      }
    ]
  },
  {
    "slug": "01-features/04-manage-context-of-your-agent/memory/02-long-term-memory/examples/single-agent/with-langgraph-agent/02-custom-callback/episodic-memory",
    "title": "Long-term memory — LangGraph episodic callback",
    "desc": "A nutrition assistant built with LangGraph that uses the episodic memory strategy to capture complete meal-planning sessions as structured episodes. Unlike preference extraction, episodic memory...",
    "sectionId": "memory",
    "kind": "feature",
    "frameworks": [
      "LangGraph"
    ],
    "languages": [
      "python"
    ],
    "hasNotebook": false,
    "readme": "/agentcore-samples/01-features/04-manage-context-of-your-agent/memory/02-long-term-memory/examples/single-agent/with-langgraph-agent/02-custom-callback/episodic-memory/README.md",
    "base": "/agentcore-samples/01-features/04-manage-context-of-your-agent/memory/02-long-term-memory/examples/single-agent/with-langgraph-agent/02-custom-callback/episodic-memory",
    "files": [
      {
        "path": "custom_memory_prompts.py",
        "lang": "python",
        "bytes": 3368
      },
      {
        "path": "nutrition-assistant-with-episodic-memory.py",
        "lang": "python",
        "bytes": 19875
      },
      {
        "path": "requirements.txt",
        "lang": "text",
        "bytes": 96
      }
    ]
  },
  {
    "slug": "01-features/04-manage-context-of-your-agent/memory/02-long-term-memory/examples/single-agent/with-langgraph-agent/03-memory-as-tool",
    "title": "Long-term memory — LangGraph, memory as a tool",
    "desc": "A LangGraph agent where AgentCore long-term memory is exposed as tools the model decides to call. We define storememory and recallmemory as LangGraph @tools and pass them to createagent; the agent...",
    "sectionId": "memory",
    "kind": "feature",
    "frameworks": [
      "LangGraph",
      "LangChain"
    ],
    "languages": [
      "python"
    ],
    "hasNotebook": false,
    "readme": "/agentcore-samples/01-features/04-manage-context-of-your-agent/memory/02-long-term-memory/examples/single-agent/with-langgraph-agent/03-memory-as-tool/README.md",
    "base": "/agentcore-samples/01-features/04-manage-context-of-your-agent/memory/02-long-term-memory/examples/single-agent/with-langgraph-agent/03-memory-as-tool",
    "files": [
      {
        "path": "langgraph-ltm-memory-tool.py",
        "lang": "python",
        "bytes": 19671
      },
      {
        "path": "requirements.txt",
        "lang": "text",
        "bytes": 198
      }
    ]
  },
  {
    "slug": "01-features/04-manage-context-of-your-agent/memory/02-long-term-memory/examples/single-agent/with-llamaindex-agent/01-built-in-memory-block",
    "title": "LlamaIndex + AgentCore memory — built-in memory block (long-term)",
    "desc": "The idiomatic way to give a LlamaIndex agent long-term memory: a custom BaseMemoryBlock wired into LlamaIndex's Memory class, backed by Amazon Bedrock AgentCore. Instead of exposing memory as a...",
    "sectionId": "memory",
    "kind": "feature",
    "frameworks": [
      "LlamaIndex"
    ],
    "languages": [
      "python"
    ],
    "hasNotebook": false,
    "readme": "/agentcore-samples/01-features/04-manage-context-of-your-agent/memory/02-long-term-memory/examples/single-agent/with-llamaindex-agent/01-built-in-memory-block/README.md",
    "base": "/agentcore-samples/01-features/04-manage-context-of-your-agent/memory/02-long-term-memory/examples/single-agent/with-llamaindex-agent/01-built-in-memory-block",
    "files": [
      {
        "path": "llamaindex-ltm-built-in-memory-block.py",
        "lang": "python",
        "bytes": 24877
      },
      {
        "path": "requirements.txt",
        "lang": "text",
        "bytes": 293
      }
    ]
  },
  {
    "slug": "01-features/04-manage-context-of-your-agent/memory/02-long-term-memory/examples/single-agent/with-llamaindex-agent/02-custom-memory-block",
    "title": "LlamaIndex + AgentCore memory — custom memory block (self-managed extraction)",
    "desc": "A more sophisticated custom BaseMemoryBlock than ../01-built-in-memory-block/: this one owns its extraction logic. It decides what is worth storing, distills it before writing, and score-filters...",
    "sectionId": "memory",
    "kind": "feature",
    "frameworks": [
      "LlamaIndex"
    ],
    "languages": [
      "python"
    ],
    "hasNotebook": false,
    "readme": "/agentcore-samples/01-features/04-manage-context-of-your-agent/memory/02-long-term-memory/examples/single-agent/with-llamaindex-agent/02-custom-memory-block/README.md",
    "base": "/agentcore-samples/01-features/04-manage-context-of-your-agent/memory/02-long-term-memory/examples/single-agent/with-llamaindex-agent/02-custom-memory-block",
    "files": [
      {
        "path": "llamaindex-ltm-custom-memory-block.py",
        "lang": "python",
        "bytes": 24618
      },
      {
        "path": "requirements.txt",
        "lang": "text",
        "bytes": 293
      }
    ]
  },
  {
    "slug": "01-features/04-manage-context-of-your-agent/memory/02-long-term-memory/examples/single-agent/with-llamaindex-agent/03-memory-tool",
    "title": "LlamaIndex + AgentCore memory — long-term (memory-as-tool)",
    "desc": "Four domain-specific notebooks showing how to expose AgentCore's long-term memory search as a LlamaIndex FunctionTool the LLM can call. Cross-session persistence is achieved by reusing actorid +...",
    "sectionId": "memory",
    "kind": "feature",
    "frameworks": [
      "LlamaIndex"
    ],
    "languages": [
      "python"
    ],
    "hasNotebook": false,
    "readme": "/agentcore-samples/01-features/04-manage-context-of-your-agent/memory/02-long-term-memory/examples/single-agent/with-llamaindex-agent/03-memory-tool/README.md",
    "base": "/agentcore-samples/01-features/04-manage-context-of-your-agent/memory/02-long-term-memory/examples/single-agent/with-llamaindex-agent/03-memory-tool",
    "files": [
      {
        "path": "academic-research-assistant-long-term-memory-tutorial.py",
        "lang": "python",
        "bytes": 32274
      },
      {
        "path": "investment-portfolio-advisor-long-term-memory-tutorial.py",
        "lang": "python",
        "bytes": 34692
      },
      {
        "path": "legal-document-analyzer-long-term-memory-tutorial.py",
        "lang": "python",
        "bytes": 34830
      },
      {
        "path": "medical-knowledge-assistant-long-term-memory-tutorial.py",
        "lang": "python",
        "bytes": 35146
      },
      {
        "path": "requirements.txt",
        "lang": "text",
        "bytes": 191
      }
    ]
  },
  {
    "slug": "01-features/04-manage-context-of-your-agent/memory/02-long-term-memory/examples/single-agent/with-strands-agent/01-built-in-hook/customer-support",
    "title": "Long-term memory — Strands customer support (built-in strategies)",
    "desc": "A customer-support agent built with Strands Agents that uses AgentCore's built-in Semantic and User Preference strategies via memory hooks. The agent remembers order history, preferences, and past...",
    "sectionId": "memory",
    "kind": "feature",
    "frameworks": [
      "Strands"
    ],
    "languages": [
      "python"
    ],
    "hasNotebook": false,
    "readme": "/agentcore-samples/01-features/04-manage-context-of-your-agent/memory/02-long-term-memory/examples/single-agent/with-strands-agent/01-built-in-hook/customer-support/README.md",
    "base": "/agentcore-samples/01-features/04-manage-context-of-your-agent/memory/02-long-term-memory/examples/single-agent/with-strands-agent/01-built-in-hook/customer-support",
    "files": [
      {
        "path": "customer-support-inbuilt-strategy.py",
        "lang": "python",
        "bytes": 29786
      },
      {
        "path": "requirements.txt",
        "lang": "text",
        "bytes": 64
      }
    ]
  },
  {
    "slug": "01-features/04-manage-context-of-your-agent/memory/02-long-term-memory/examples/single-agent/with-strands-agent/01-built-in-hook/meeting-notes-assistant-using-episodic",
    "title": "AgentCore memory: Episodic memory Strategy",
    "desc": "Episodic memory captures meaningful slices of user and system interactions so applications can recall context in a way that feels focused and relevant. Instead of storing every raw event, it...",
    "sectionId": "memory",
    "kind": "feature",
    "frameworks": [
      "Strands"
    ],
    "languages": [
      "python"
    ],
    "hasNotebook": false,
    "readme": "/agentcore-samples/01-features/04-manage-context-of-your-agent/memory/02-long-term-memory/examples/single-agent/with-strands-agent/01-built-in-hook/meeting-notes-assistant-using-episodic/README.md",
    "base": "/agentcore-samples/01-features/04-manage-context-of-your-agent/memory/02-long-term-memory/examples/single-agent/with-strands-agent/01-built-in-hook/meeting-notes-assistant-using-episodic",
    "files": [
      {
        "path": "meeting-notes-assistant.py",
        "lang": "python",
        "bytes": 16978
      },
      {
        "path": "requirements.txt",
        "lang": "text",
        "bytes": 58
      }
    ]
  },
  {
    "slug": "01-features/04-manage-context-of-your-agent/memory/02-long-term-memory/examples/single-agent/with-strands-agent/01-built-in-hook/simple-math-assistant",
    "title": "Long-term memory — Strands math assistant (Summary strategy)",
    "desc": "A math tutor built with Strands Agents that stores conversation summaries as long-term memory via hooks. It demonstrates the Summary strategy alongside a calculator tool, conversation branching...",
    "sectionId": "memory",
    "kind": "feature",
    "frameworks": [
      "Strands"
    ],
    "languages": [
      "python"
    ],
    "hasNotebook": false,
    "readme": "/agentcore-samples/01-features/04-manage-context-of-your-agent/memory/02-long-term-memory/examples/single-agent/with-strands-agent/01-built-in-hook/simple-math-assistant/README.md",
    "base": "/agentcore-samples/01-features/04-manage-context-of-your-agent/memory/02-long-term-memory/examples/single-agent/with-strands-agent/01-built-in-hook/simple-math-assistant",
    "files": [
      {
        "path": "math-assistant.py",
        "lang": "python",
        "bytes": 21297
      },
      {
        "path": "requirements.txt",
        "lang": "text",
        "bytes": 59
      }
    ]
  },
  {
    "slug": "01-features/04-manage-context-of-your-agent/memory/02-long-term-memory/examples/single-agent/with-strands-agent/02-custom-hook/culinary-assistant-self-managed-strategy",
    "title": "Long-term memory — Strands self-managed strategy",
    "desc": "A culinary assistant demonstrating AgentCore's self-managed memory strategy — you replace AgentCore's built-in extraction with your own pipeline. Trigger conditions (message count, idle timeout,...",
    "sectionId": "memory",
    "kind": "feature",
    "frameworks": [
      "Strands"
    ],
    "languages": [
      "python"
    ],
    "hasNotebook": false,
    "readme": "/agentcore-samples/01-features/04-manage-context-of-your-agent/memory/02-long-term-memory/examples/single-agent/with-strands-agent/02-custom-hook/culinary-assistant-self-managed-strategy/README.md",
    "base": "/agentcore-samples/01-features/04-manage-context-of-your-agent/memory/02-long-term-memory/examples/single-agent/with-strands-agent/02-custom-hook/culinary-assistant-self-managed-strategy",
    "files": [
      {
        "path": "agentcore_self_managed_memory_demo.py",
        "lang": "python",
        "bytes": 19886
      },
      {
        "path": "aws_utils.py",
        "lang": "python",
        "bytes": 29073
      },
      {
        "path": "lambda_function.py",
        "lang": "python",
        "bytes": 10382
      },
      {
        "path": "requirements.txt",
        "lang": "text",
        "bytes": 65
      }
    ]
  },
  {
    "slug": "01-features/04-manage-context-of-your-agent/memory/02-long-term-memory/examples/single-agent/with-strands-agent/02-custom-hook/culinary-assistant-self-managed-strategy-with-citations",
    "title": "Culinary Assistant with Self-Managed memory Strategy (With Citations)",
    "desc": "This sample demonstrates Amazon Bedrock AgentCore's self-managed memory strategy with enhanced citation tracking. This version extends the base culinary assistant example by adding comprehensive...",
    "sectionId": "memory",
    "kind": "feature",
    "frameworks": [],
    "languages": [
      "python"
    ],
    "hasNotebook": false,
    "readme": "/agentcore-samples/01-features/04-manage-context-of-your-agent/memory/02-long-term-memory/examples/single-agent/with-strands-agent/02-custom-hook/culinary-assistant-self-managed-strategy-with-citations/README.md",
    "base": "/agentcore-samples/01-features/04-manage-context-of-your-agent/memory/02-long-term-memory/examples/single-agent/with-strands-agent/02-custom-hook/culinary-assistant-self-managed-strategy-with-citations",
    "files": [
      {
        "path": "agentcore_self_managed_memory_demo.py",
        "lang": "python",
        "bytes": 19907
      },
      {
        "path": "aws_utils.py",
        "lang": "python",
        "bytes": 29073
      },
      {
        "path": "lambda_function.py",
        "lang": "python",
        "bytes": 12101
      },
      {
        "path": "requirements.txt",
        "lang": "text",
        "bytes": 65
      }
    ]
  },
  {
    "slug": "01-features/04-manage-context-of-your-agent/memory/02-long-term-memory/examples/single-agent/with-strands-agent/02-custom-hook/customer-support",
    "title": "Long-term memory — Strands customer support (custom strategy override)",
    "desc": "The same customer-support agent as the built-in version, but using custom-override Semantic and User Preference strategies. Custom strategies let you specify your own Bedrock models for extraction...",
    "sectionId": "memory",
    "kind": "feature",
    "frameworks": [
      "Strands"
    ],
    "languages": [
      "python"
    ],
    "hasNotebook": false,
    "readme": "/agentcore-samples/01-features/04-manage-context-of-your-agent/memory/02-long-term-memory/examples/single-agent/with-strands-agent/02-custom-hook/customer-support/README.md",
    "base": "/agentcore-samples/01-features/04-manage-context-of-your-agent/memory/02-long-term-memory/examples/single-agent/with-strands-agent/02-custom-hook/customer-support",
    "files": [
      {
        "path": "customer-support-override-strategy.py",
        "lang": "python",
        "bytes": 35456
      },
      {
        "path": "requirements.txt",
        "lang": "text",
        "bytes": 64
      }
    ]
  },
  {
    "slug": "01-features/04-manage-context-of-your-agent/memory/02-long-term-memory/examples/single-agent/with-strands-agent/03-memory-tool",
    "title": "Long-term memory — Strands, memory as a tool",
    "desc": "Long-term memory exposed as tools the agent decides to call. Instead of hooks that save/recall on the lifecycle, the Strands agent itself chooses when to store a durable fact and when to search...",
    "sectionId": "memory",
    "kind": "feature",
    "frameworks": [
      "Strands"
    ],
    "languages": [
      "python"
    ],
    "hasNotebook": false,
    "readme": "/agentcore-samples/01-features/04-manage-context-of-your-agent/memory/02-long-term-memory/examples/single-agent/with-strands-agent/03-memory-tool/README.md",
    "base": "/agentcore-samples/01-features/04-manage-context-of-your-agent/memory/02-long-term-memory/examples/single-agent/with-strands-agent/03-memory-tool",
    "files": [
      {
        "path": "culinary-assistant.py",
        "lang": "python",
        "bytes": 13059
      },
      {
        "path": "requirements.txt",
        "lang": "text",
        "bytes": 59
      }
    ]
  },
  {
    "slug": "01-features/04-manage-context-of-your-agent/memory/02-long-term-memory/examples/single-agent/with-strands-agent/03-memory-tool/debugging-agent",
    "title": "Long-term memory — Strands debugging assistant (episodic)",
    "desc": "A debugging assistant built with Strands Agents that uses episodic memory with reflections. It captures complete debugging sessions — problem statement, actions taken, and outcome — then learns...",
    "sectionId": "memory",
    "kind": "feature",
    "frameworks": [
      "Strands"
    ],
    "languages": [
      "python"
    ],
    "hasNotebook": false,
    "readme": "/agentcore-samples/01-features/04-manage-context-of-your-agent/memory/02-long-term-memory/examples/single-agent/with-strands-agent/03-memory-tool/debugging-agent/README.md",
    "base": "/agentcore-samples/01-features/04-manage-context-of-your-agent/memory/02-long-term-memory/examples/single-agent/with-strands-agent/03-memory-tool/debugging-agent",
    "files": [
      {
        "path": "data/session1_memory_leak.json",
        "lang": "json",
        "bytes": 6864
      },
      {
        "path": "data/session2_race_condition.json",
        "lang": "json",
        "bytes": 7387
      },
      {
        "path": "data/session3_api_timeout.json",
        "lang": "json",
        "bytes": 7622
      },
      {
        "path": "debugging_assistant_episodic_memory.py",
        "lang": "python",
        "bytes": 23545
      },
      {
        "path": "requirements.txt",
        "lang": "text",
        "bytes": 171
      }
    ]
  },
  {
    "slug": "01-features/04-manage-context-of-your-agent/memory/03-integrations/01-runtime-integration",
    "title": "Runtime + Memory integration",
    "desc": "Deploy a memory-enabled Strands agent behind an AgentCore Runtime endpoint. The runtime hosts the agent process; AgentCore Memory persists conversation turns so each invocation continues where the...",
    "sectionId": "memory",
    "kind": "feature",
    "frameworks": [
      "Strands"
    ],
    "languages": [
      "python"
    ],
    "hasNotebook": false,
    "readme": "/agentcore-samples/01-features/04-manage-context-of-your-agent/memory/03-integrations/01-runtime-integration/README.md",
    "base": "/agentcore-samples/01-features/04-manage-context-of-your-agent/memory/03-integrations/01-runtime-integration",
    "files": [
      {
        "path": "requirements.txt",
        "lang": "text",
        "bytes": 47
      },
      {
        "path": "runtime_memory_agent.py",
        "lang": "python",
        "bytes": 3851
      },
      {
        "path": "runtime_memory_integration.py",
        "lang": "python",
        "bytes": 19950
      }
    ]
  },
  {
    "slug": "01-features/04-manage-context-of-your-agent/memory/03-integrations/02-identity-integration",
    "title": "Runtime + Memory + Cognito identity",
    "desc": "Adds a Cognito JWT authorizer to the runtime endpoint so memory operations are scoped to the authenticated user. The user's Cognito sub becomes the actorId, giving each user an isolated slice of...",
    "sectionId": "memory",
    "kind": "feature",
    "frameworks": [
      "Strands"
    ],
    "languages": [
      "python"
    ],
    "hasNotebook": false,
    "readme": "/agentcore-samples/01-features/04-manage-context-of-your-agent/memory/03-integrations/02-identity-integration/README.md",
    "base": "/agentcore-samples/01-features/04-manage-context-of-your-agent/memory/03-integrations/02-identity-integration",
    "files": [
      {
        "path": "requirements.txt",
        "lang": "text",
        "bytes": 67
      },
      {
        "path": "runtime_identity_memory_agent.py",
        "lang": "python",
        "bytes": 10109
      },
      {
        "path": "runtime_memory_identity_integration.py",
        "lang": "python",
        "bytes": 27189
      },
      {
        "path": "utils.py",
        "lang": "python",
        "bytes": 10165
      }
    ]
  },
  {
    "slug": "01-features/04-manage-context-of-your-agent/memory/03-integrations/03-guardrails-integration",
    "title": "Memory + Bedrock Guardrails",
    "desc": "Run a Bedrock guardrail over the model's output in a memory-enabled agent, so unsafe responses are replaced before the user sees them. Useful as a starting point for layering content policies onto...",
    "sectionId": "memory",
    "kind": "feature",
    "frameworks": [
      "Strands"
    ],
    "languages": [
      "python"
    ],
    "hasNotebook": false,
    "readme": "/agentcore-samples/01-features/04-manage-context-of-your-agent/memory/03-integrations/03-guardrails-integration/README.md",
    "base": "/agentcore-samples/01-features/04-manage-context-of-your-agent/memory/03-integrations/03-guardrails-integration",
    "files": [
      {
        "path": "guardrails-memory.py",
        "lang": "python",
        "bytes": 20980
      },
      {
        "path": "requirements.txt",
        "lang": "text",
        "bytes": 39
      }
    ]
  },
  {
    "slug": "01-features/04-manage-context-of-your-agent/memory/03-integrations/04-memory-browser",
    "title": "AgentCore memory Dashboard",
    "desc": "A React + FastAPI dashboard for browsing AgentCore memory resources (events, turns, long-term records) through a UI.",
    "sectionId": "browser",
    "kind": "feature",
    "frameworks": [],
    "languages": [
      "javascript"
    ],
    "hasNotebook": false,
    "readme": "/agentcore-samples/01-features/04-manage-context-of-your-agent/memory/03-integrations/04-memory-browser/README.md",
    "base": "/agentcore-samples/01-features/04-manage-context-of-your-agent/memory/03-integrations/04-memory-browser",
    "files": [
      {
        "path": "package.json",
        "lang": "json",
        "bytes": 1240
      },
      {
        "path": "public/index.html",
        "lang": "html",
        "bytes": 557
      },
      {
        "path": "scripts/get-aws-credentials.js",
        "lang": "javascript",
        "bytes": 2964
      },
      {
        "path": "src/App.js",
        "lang": "javascript",
        "bytes": 22067
      },
      {
        "path": "src/components/LongTermMemoryForm.js",
        "lang": "javascript",
        "bytes": 16151
      },
      {
        "path": "src/components/ShortTermMemoryForm.js",
        "lang": "javascript",
        "bytes": 7036
      },
      {
        "path": "src/index.css",
        "lang": "css",
        "bytes": 18929
      },
      {
        "path": "src/index.js",
        "lang": "javascript",
        "bytes": 253
      },
      {
        "path": "start-backend.sh",
        "lang": "bash",
        "bytes": 1830
      }
    ]
  },
  {
    "slug": "01-features/04-manage-context-of-your-agent/memory/03-integrations/04-memory-browser/backend",
    "title": "Memory Browser — backend",
    "desc": "The FastAPI backend for the AgentCore Memory Dashboard. It wraps MemoryClient and exposes REST endpoints the React frontend calls to browse short-term events/turns and query long-term records by...",
    "sectionId": "browser",
    "kind": "feature",
    "frameworks": [],
    "languages": [
      "python"
    ],
    "hasNotebook": false,
    "readme": "/agentcore-samples/01-features/04-manage-context-of-your-agent/memory/03-integrations/04-memory-browser/backend/README.md",
    "base": "/agentcore-samples/01-features/04-manage-context-of-your-agent/memory/03-integrations/04-memory-browser/backend",
    "files": [
      {
        "path": "app.py",
        "lang": "python",
        "bytes": 60155
      },
      {
        "path": "requirements.txt",
        "lang": "text",
        "bytes": 135
      }
    ]
  },
  {
    "slug": "01-features/04-manage-context-of-your-agent/memory/04-observability",
    "title": "Observability",
    "desc": "AgentCore Memory emits CloudWatch metrics and logs to your account so you can monitor data-plane usage, ingestion health, and stream delivery.",
    "sectionId": "memory",
    "kind": "feature",
    "frameworks": [],
    "languages": [
      "python"
    ],
    "hasNotebook": false,
    "readme": "/agentcore-samples/01-features/04-manage-context-of-your-agent/memory/04-observability/README.md",
    "base": "/agentcore-samples/01-features/04-manage-context-of-your-agent/memory/04-observability",
    "files": [
      {
        "path": "observability.py",
        "lang": "python",
        "bytes": 3873
      }
    ]
  },
  {
    "slug": "01-features/04-manage-context-of-your-agent/memory/05-security/01-iam-scoped-access",
    "title": "IAM-scoped actor isolation",
    "desc": "Restrict memory access at the IAM layer so a runtime execution role can only touch one user's data. The agent extracts the authenticated user's Cognito sub from the JWT, sets it as actorId on...",
    "sectionId": "memory",
    "kind": "feature",
    "frameworks": [
      "Strands"
    ],
    "languages": [
      "python"
    ],
    "hasNotebook": false,
    "readme": "/agentcore-samples/01-features/04-manage-context-of-your-agent/memory/05-security/01-iam-scoped-access/README.md",
    "base": "/agentcore-samples/01-features/04-manage-context-of-your-agent/memory/05-security/01-iam-scoped-access",
    "files": [
      {
        "path": "requirements.txt",
        "lang": "text",
        "bytes": 67
      },
      {
        "path": "runtime_identity_memory_agent.py",
        "lang": "python",
        "bytes": 9097
      },
      {
        "path": "runtime_memory_identity_integration.py",
        "lang": "python",
        "bytes": 28052
      },
      {
        "path": "utils.py",
        "lang": "python",
        "bytes": 11272
      }
    ]
  },
  {
    "slug": "01-features/04-manage-context-of-your-agent/memory/05-security/02-cognito-federated-identity",
    "title": "Cognito federated-identity isolation",
    "desc": "Exchange a Cognito ID token for short-lived AWS credentials via a Cognito Identity Pool, then call AgentCore Memory with those per-user credentials. The user's identityId is the actorId, and the...",
    "sectionId": "memory",
    "kind": "feature",
    "frameworks": [
      "Strands"
    ],
    "languages": [
      "python"
    ],
    "hasNotebook": false,
    "readme": "/agentcore-samples/01-features/04-manage-context-of-your-agent/memory/05-security/02-cognito-federated-identity/README.md",
    "base": "/agentcore-samples/01-features/04-manage-context-of-your-agent/memory/05-security/02-cognito-federated-identity",
    "files": [
      {
        "path": "requirements.txt",
        "lang": "text",
        "bytes": 67
      },
      {
        "path": "runtime_identity_memory_agent.py",
        "lang": "python",
        "bytes": 11362
      },
      {
        "path": "runtime_memory_federated_identity_integration.py",
        "lang": "python",
        "bytes": 24006
      },
      {
        "path": "utils.py",
        "lang": "python",
        "bytes": 18733
      }
    ]
  },
  {
    "slug": "01-features/04-manage-context-of-your-agent/memory/05-security/03-kms-encryption",
    "title": "Customer-managed KMS encryption",
    "desc": "By default, AgentCore Memory encrypts data with AWS-owned keys. Pass encryptionKeyArn to CreateMemory to use a customer-managed key (CMK) instead.",
    "sectionId": "memory",
    "kind": "feature",
    "frameworks": [],
    "languages": [
      "python"
    ],
    "hasNotebook": false,
    "readme": "/agentcore-samples/01-features/04-manage-context-of-your-agent/memory/05-security/03-kms-encryption/README.md",
    "base": "/agentcore-samples/01-features/04-manage-context-of-your-agent/memory/05-security/03-kms-encryption",
    "files": [
      {
        "path": "kms-encryption.py",
        "lang": "python",
        "bytes": 3896
      }
    ]
  },
  {
    "slug": "01-features/04-manage-context-of-your-agent/memory/06-production-patterns",
    "title": "Production patterns",
    "desc": "Most tutorials in this tree show the happy path — create a memory, write an event, retrieve a record, and assume every call succeeds. That's the right shape for learning a primitive, but it's not...",
    "sectionId": "memory",
    "kind": "feature",
    "frameworks": [],
    "languages": [
      "python"
    ],
    "hasNotebook": false,
    "readme": "/agentcore-samples/01-features/04-manage-context-of-your-agent/memory/06-production-patterns/README.md",
    "base": "/agentcore-samples/01-features/04-manage-context-of-your-agent/memory/06-production-patterns",
    "files": [
      {
        "path": "00-multi-region-replication/README.md",
        "lang": "markdown",
        "bytes": 8664
      },
      {
        "path": "00-multi-region-replication/agentcore_replication/__init__.py",
        "lang": "python",
        "bytes": 1671
      },
      {
        "path": "00-multi-region-replication/agentcore_replication/dual_writer.py",
        "lang": "python",
        "bytes": 5887
      },
      {
        "path": "00-multi-region-replication/agentcore_replication/stream_consumer.py",
        "lang": "python",
        "bytes": 8757
      },
      {
        "path": "00-multi-region-replication/infra/streaming-stack.yaml",
        "lang": "yaml",
        "bytes": 6745
      },
      {
        "path": "00-multi-region-replication/lambda/stream_handler.py",
        "lang": "python",
        "bytes": 2122
      },
      {
        "path": "00-multi-region-replication/requirements.txt",
        "lang": "text",
        "bytes": 15
      },
      {
        "path": "00-multi-region-replication/scripts/create_memories.py",
        "lang": "python",
        "bytes": 3086
      },
      {
        "path": "00-multi-region-replication/scripts/deploy_streaming.sh",
        "lang": "bash",
        "bytes": 4992
      },
      {
        "path": "00-multi-region-replication/scripts/enable_streaming.py",
        "lang": "python",
        "bytes": 2637
      },
      {
        "path": "00-multi-region-replication/scripts/full_demo.py",
        "lang": "python",
        "bytes": 18372
      },
      {
        "path": "01-error-handling.md",
        "lang": "markdown",
        "bytes": 10510
      },
      {
        "path": "02-cost-optimization.md",
        "lang": "markdown",
        "bytes": 8722
      },
      {
        "path": "03-production-checklist.md",
        "lang": "markdown",
        "bytes": 10027
      },
      {
        "path": "production-patterns.py",
        "lang": "python",
        "bytes": 13602
      }
    ]
  },
  {
    "slug": "01-features/05-authenticate-and-authorize/01-inbound-auth/01-inbound-auth-cognito",
    "title": "Inbound Auth with Amazon Cognito",
    "desc": "This tutorial demonstrates how to configure an Amazon Bedrock AgentCore runtime to require JWT bearer token authentication using Amazon Cognito as the identity provider.",
    "sectionId": "identity",
    "kind": "feature",
    "frameworks": [
      "Strands"
    ],
    "languages": [
      "python"
    ],
    "hasNotebook": false,
    "readme": "/agentcore-samples/01-features/05-authenticate-and-authorize/01-inbound-auth/01-inbound-auth-cognito/README.md",
    "base": "/agentcore-samples/01-features/05-authenticate-and-authorize/01-inbound-auth/01-inbound-auth-cognito",
    "files": [
      {
        "path": "inbound_auth_runtime.py",
        "lang": "python",
        "bytes": 23457
      },
      {
        "path": "requirements.txt",
        "lang": "text",
        "bytes": 60
      }
    ]
  },
  {
    "slug": "01-features/05-authenticate-and-authorize/01-inbound-auth/02-inbound-auth-EntraID",
    "title": "Inbound Auth with Microsoft Entra ID",
    "desc": "Microsoft Entra ID is Microsoft's cloud-based identity and access management service that serves as the central identity provider for Microsoft 365, Azure, and other SaaS applications.",
    "sectionId": "identity",
    "kind": "feature",
    "frameworks": [
      "Strands"
    ],
    "languages": [
      "python"
    ],
    "hasNotebook": false,
    "readme": "/agentcore-samples/01-features/05-authenticate-and-authorize/01-inbound-auth/02-inbound-auth-EntraID/README.md",
    "base": "/agentcore-samples/01-features/05-authenticate-and-authorize/01-inbound-auth/02-inbound-auth-EntraID",
    "files": [
      {
        "path": "entra_gateway_auth_code.py",
        "lang": "python",
        "bytes": 20295
      },
      {
        "path": "entra_gateway_m2m.py",
        "lang": "python",
        "bytes": 18555
      },
      {
        "path": "entra_id_inbound_auth.py",
        "lang": "python",
        "bytes": 20608
      },
      {
        "path": "images/test.txt",
        "lang": "text",
        "bytes": 1
      },
      {
        "path": "oauth2_callback_server.py",
        "lang": "python",
        "bytes": 14712
      },
      {
        "path": "requirements.txt",
        "lang": "text",
        "bytes": 182
      },
      {
        "path": "strands_entraid_onenote.py",
        "lang": "python",
        "bytes": 7863
      }
    ]
  },
  {
    "slug": "01-features/05-authenticate-and-authorize/01-inbound-auth/03-inbound-auth-okta",
    "title": "Inbound Auth with Okta",
    "desc": "Okta is a cloud-based identity and access management service that provides secure identity solutions for enterprises, enabling seamless authentication and authorization across applications and...",
    "sectionId": "identity",
    "kind": "feature",
    "frameworks": [
      "Strands"
    ],
    "languages": [
      "python"
    ],
    "hasNotebook": false,
    "readme": "/agentcore-samples/01-features/05-authenticate-and-authorize/01-inbound-auth/03-inbound-auth-okta/README.md",
    "base": "/agentcore-samples/01-features/05-authenticate-and-authorize/01-inbound-auth/03-inbound-auth-okta",
    "files": [
      {
        "path": "okta_gateway_auth.py",
        "lang": "python",
        "bytes": 34001
      },
      {
        "path": "okta_inbound_auth.py",
        "lang": "python",
        "bytes": 21564
      },
      {
        "path": "requirements.txt",
        "lang": "text",
        "bytes": 37
      }
    ]
  },
  {
    "slug": "01-features/05-authenticate-and-authorize/01-inbound-auth/04-inbound-auth-pingfederate",
    "title": "Private IdP Connectivity: PingFederate with AgentCore identity via VPC Lattice",
    "desc": "This sample demonstrates how to connect Amazon Bedrock AgentCore identity to a privately hosted PingFederate identity Provider (IdP) using Amazon VPC Lattice, eliminating the need for the IdP to...",
    "sectionId": "identity",
    "kind": "feature",
    "frameworks": [],
    "languages": [
      "python"
    ],
    "hasNotebook": false,
    "readme": "/agentcore-samples/01-features/05-authenticate-and-authorize/01-inbound-auth/04-inbound-auth-pingfederate/README.md",
    "base": "/agentcore-samples/01-features/05-authenticate-and-authorize/01-inbound-auth/04-inbound-auth-pingfederate",
    "files": [
      {
        "path": "agent/private-idp-ping-agent/AGENTS.md",
        "lang": "markdown",
        "bytes": 6467
      },
      {
        "path": "agent/private-idp-ping-agent/README.md",
        "lang": "markdown",
        "bytes": 4120
      },
      {
        "path": "agent/private-idp-ping-agent/agentcore/agentcore.json",
        "lang": "json",
        "bytes": 966
      },
      {
        "path": "agent/private-idp-ping-agent/app/private-idp-ping-agent/main.py",
        "lang": "python",
        "bytes": 3528
      },
      {
        "path": "agent/private-idp-ping-agent/app/private-idp-ping-agent/pyproject.toml",
        "lang": "toml",
        "bytes": 440
      },
      {
        "path": "app.py",
        "lang": "python",
        "bytes": 1554
      },
      {
        "path": "cdk.json",
        "lang": "json",
        "bytes": 100
      },
      {
        "path": "cleanup_sample.sh",
        "lang": "bash",
        "bytes": 3898
      },
      {
        "path": "config.py",
        "lang": "python",
        "bytes": 1960
      },
      {
        "path": "deploy_sample.sh",
        "lang": "bash",
        "bytes": 12525
      },
      {
        "path": "lambda/configure_pingfed/index.py",
        "lang": "python",
        "bytes": 20193
      },
      {
        "path": "lambda/mcp_echo/index.py",
        "lang": "python",
        "bytes": 2929
      },
      {
        "path": "pyproject.toml",
        "lang": "toml",
        "bytes": 629
      },
      {
        "path": "stacks/__init__.py",
        "lang": "python",
        "bytes": 102
      },
      {
        "path": "stacks/gateway_infra_stack.py",
        "lang": "python",
        "bytes": 1939
      },
      {
        "path": "stacks/lattice_stack.py",
        "lang": "python",
        "bytes": 3808
      },
      {
        "path": "stacks/ping_federate_stack.py",
        "lang": "python",
        "bytes": 12343
      },
      {
        "path": "stacks/vpc_stack.py",
        "lang": "python",
        "bytes": 1732
      }
    ]
  },
  {
    "slug": "01-features/05-authenticate-and-authorize/01-inbound-auth/04-inbound-auth-pingfederate/agent/private-idp-ping-agent/agentcore/.llm-context",
    "title": "LLM Context Files",
    "desc": "DO NOT EDIT THESE FILES - They are read-only reference for AI coding assistants.",
    "sectionId": "identity",
    "kind": "feature",
    "frameworks": [
      "OpenAI Agents"
    ],
    "languages": [
      "typescript"
    ],
    "hasNotebook": false,
    "readme": "/agentcore-samples/01-features/05-authenticate-and-authorize/01-inbound-auth/04-inbound-auth-pingfederate/agent/private-idp-ping-agent/agentcore/.llm-context/README.md",
    "base": "/agentcore-samples/01-features/05-authenticate-and-authorize/01-inbound-auth/04-inbound-auth-pingfederate/agent/private-idp-ping-agent/agentcore/.llm-context",
    "files": [
      {
        "path": "agentcore.ts",
        "lang": "typescript",
        "bytes": 5263
      },
      {
        "path": "aws-targets.ts",
        "lang": "typescript",
        "bytes": 2039
      }
    ]
  },
  {
    "slug": "01-features/05-authenticate-and-authorize/01-inbound-auth/04-inbound-auth-pingfederate/agent/private-idp-ping-agent/agentcore/cdk",
    "title": "AgentCore CDK Project",
    "desc": "This CDK project is managed by the AgentCore CLI. It deploys your agent infrastructure into AWS using the @aws/agentcore-cdk L3 constructs.",
    "sectionId": "identity",
    "kind": "feature",
    "frameworks": [],
    "languages": [
      "javascript",
      "typescript"
    ],
    "hasNotebook": false,
    "readme": "/agentcore-samples/01-features/05-authenticate-and-authorize/01-inbound-auth/04-inbound-auth-pingfederate/agent/private-idp-ping-agent/agentcore/cdk/README.md",
    "base": "/agentcore-samples/01-features/05-authenticate-and-authorize/01-inbound-auth/04-inbound-auth-pingfederate/agent/private-idp-ping-agent/agentcore/cdk",
    "files": [
      {
        "path": "bin/cdk.ts",
        "lang": "typescript",
        "bytes": 3166
      },
      {
        "path": "cdk.json",
        "lang": "json",
        "bytes": 5487
      },
      {
        "path": "jest.config.js",
        "lang": "javascript",
        "bytes": 225
      },
      {
        "path": "package.json",
        "lang": "json",
        "bytes": 727
      },
      {
        "path": "test/cdk.test.ts",
        "lang": "typescript",
        "bytes": 785
      },
      {
        "path": "tsconfig.json",
        "lang": "json",
        "bytes": 770
      }
    ]
  },
  {
    "slug": "01-features/05-authenticate-and-authorize/02-outbound-auth/01-outbound-auth-openai",
    "title": "Outbound Auth with API Key Credential Provider (OpenAI / Azure OpenAI)",
    "desc": "This tutorial demonstrates how to configure an AgentCore agent to securely retrieve an API key at runtime using the AgentCore identity API Key credential provider, rather than hardcoding secrets...",
    "sectionId": "identity",
    "kind": "feature",
    "frameworks": [
      "Strands",
      "OpenAI Agents"
    ],
    "languages": [
      "python"
    ],
    "hasNotebook": false,
    "readme": "/agentcore-samples/01-features/05-authenticate-and-authorize/02-outbound-auth/01-outbound-auth-openai/README.md",
    "base": "/agentcore-samples/01-features/05-authenticate-and-authorize/02-outbound-auth/01-outbound-auth-openai",
    "files": [
      {
        "path": "outbound_auth_runtime.py",
        "lang": "python",
        "bytes": 9373
      },
      {
        "path": "requirements.txt",
        "lang": "text",
        "bytes": 75
      }
    ]
  },
  {
    "slug": "01-features/05-authenticate-and-authorize/02-outbound-auth/02-outbound-auth-3lo",
    "title": "Outbound Auth with Google OAuth2 3-Legged OAuth (3LO)",
    "desc": "This tutorial demonstrates how to configure a Strands agent on AgentCore runtime to access Google Calendar on behalf of a user using the 3-Legged OAuth (3LO) flow with AgentCore Identity's...",
    "sectionId": "identity",
    "kind": "feature",
    "frameworks": [
      "Strands"
    ],
    "languages": [
      "python"
    ],
    "hasNotebook": false,
    "readme": "/agentcore-samples/01-features/05-authenticate-and-authorize/02-outbound-auth/02-outbound-auth-3lo/README.md",
    "base": "/agentcore-samples/01-features/05-authenticate-and-authorize/02-outbound-auth/02-outbound-auth-3lo",
    "files": [
      {
        "path": "chatbot_app_cognito.py",
        "lang": "python",
        "bytes": 35297
      },
      {
        "path": "oauth2_callback_server.py",
        "lang": "python",
        "bytes": 17800
      },
      {
        "path": "outbound_auth_3lo.py",
        "lang": "python",
        "bytes": 12658
      },
      {
        "path": "requirements.txt",
        "lang": "text",
        "bytes": 229
      },
      {
        "path": "strands_claude_google_3lo.py",
        "lang": "python",
        "bytes": 5329
      }
    ]
  },
  {
    "slug": "01-features/05-authenticate-and-authorize/02-outbound-auth/03-outbound-auth-github",
    "title": "Outbound Auth with GitHub OAuth2 3-Legged OAuth (3LO)",
    "desc": "This tutorial demonstrates how to configure a Strands agent on AgentCore runtime to access a user's private GitHub repositories using the GithubOauth2 credential provider with the USERFEDERATION...",
    "sectionId": "identity",
    "kind": "feature",
    "frameworks": [
      "Strands"
    ],
    "languages": [
      "python"
    ],
    "hasNotebook": false,
    "readme": "/agentcore-samples/01-features/05-authenticate-and-authorize/02-outbound-auth/03-outbound-auth-github/README.md",
    "base": "/agentcore-samples/01-features/05-authenticate-and-authorize/02-outbound-auth/03-outbound-auth-github",
    "files": [
      {
        "path": "chatbot_app_cognito.py",
        "lang": "python",
        "bytes": 35298
      },
      {
        "path": "github_agent.py",
        "lang": "python",
        "bytes": 5894
      },
      {
        "path": "oauth2_callback_server.py",
        "lang": "python",
        "bytes": 17800
      },
      {
        "path": "outbound_auth_github.py",
        "lang": "python",
        "bytes": 9151
      },
      {
        "path": "requirements.txt",
        "lang": "text",
        "bytes": 167
      }
    ]
  },
  {
    "slug": "01-features/05-authenticate-and-authorize/02-outbound-auth/04-outbound-auth-self-hosted",
    "title": "Self-Hosted Agent with AgentCore identity OAuth Token Management",
    "desc": "This tutorial demonstrates how to build a self-hosted Python agent that uses Amazon Bedrock AgentCore identity to manage OAuth 2.0 token flows — without deploying to AgentCore runtime.",
    "sectionId": "identity",
    "kind": "feature",
    "frameworks": [],
    "languages": [
      "python"
    ],
    "hasNotebook": false,
    "readme": "/agentcore-samples/01-features/05-authenticate-and-authorize/02-outbound-auth/04-outbound-auth-self-hosted/README.md",
    "base": "/agentcore-samples/01-features/05-authenticate-and-authorize/02-outbound-auth/04-outbound-auth-self-hosted",
    "files": [
      {
        "path": "agent.py",
        "lang": "python",
        "bytes": 8677
      },
      {
        "path": "create_cognito.sh",
        "lang": "bash",
        "bytes": 2357
      },
      {
        "path": "requirements.txt",
        "lang": "text",
        "bytes": 91
      },
      {
        "path": "self_hosted_agent_oauth.py",
        "lang": "python",
        "bytes": 14049
      }
    ]
  },
  {
    "slug": "01-features/05-authenticate-and-authorize/03-m2m-3lo",
    "title": "AgentCore identity: M2M and Auth Code Flows with runtime (Cognito)",
    "desc": "This sample demonstrates two outbound OAuth2 flows in a single AgentCore runtime agent:",
    "sectionId": "identity",
    "kind": "feature",
    "frameworks": [
      "Strands"
    ],
    "languages": [
      "python"
    ],
    "hasNotebook": false,
    "readme": "/agentcore-samples/01-features/05-authenticate-and-authorize/03-m2m-3lo/README.md",
    "base": "/agentcore-samples/01-features/05-authenticate-and-authorize/03-m2m-3lo",
    "files": [
      {
        "path": "app/MyAgent/main.py",
        "lang": "python",
        "bytes": 11196
      },
      {
        "path": "app/MyAgent/pyproject.toml",
        "lang": "toml",
        "bytes": 195
      },
      {
        "path": "configure_inbound_auth.py",
        "lang": "python",
        "bytes": 5307
      },
      {
        "path": "invoke.py",
        "lang": "python",
        "bytes": 9688
      },
      {
        "path": "oauth2_callback_server.py",
        "lang": "python",
        "bytes": 17829
      },
      {
        "path": "requirements.txt",
        "lang": "text",
        "bytes": 142
      },
      {
        "path": "setup_cognito.py",
        "lang": "python",
        "bytes": 4430
      },
      {
        "path": "setup_oauth_providers.py",
        "lang": "python",
        "bytes": 8029
      },
      {
        "path": "streamlit_app.py",
        "lang": "python",
        "bytes": 24489
      }
    ]
  },
  {
    "slug": "01-features/05-authenticate-and-authorize/04-entra-obo-mcp-runtime",
    "title": "Microsoft Entra ID On-Behalf-Of (OBO) with AgentCore runtime + MCP Server",
    "desc": "This tutorial demonstrates the On-Behalf-Of (OBO) token exchange pattern for agents that call downstream resources (Microsoft Graph) through a dedicated MCP server — while preserving the...",
    "sectionId": "identity",
    "kind": "feature",
    "frameworks": [
      "Strands"
    ],
    "languages": [
      "python"
    ],
    "hasNotebook": false,
    "readme": "/agentcore-samples/01-features/05-authenticate-and-authorize/04-entra-obo-mcp-runtime/README.md",
    "base": "/agentcore-samples/01-features/05-authenticate-and-authorize/04-entra-obo-mcp-runtime",
    "files": [
      {
        "path": "ENTRA_SETUP.md",
        "lang": "markdown",
        "bytes": 14030
      },
      {
        "path": "agent/agent_obo.py",
        "lang": "python",
        "bytes": 3945
      },
      {
        "path": "agent/requirements.txt",
        "lang": "text",
        "bytes": 147
      },
      {
        "path": "entra_obo_mcp_runtime.py",
        "lang": "python",
        "bytes": 26122
      },
      {
        "path": "mcp/mcp_server_obo.py",
        "lang": "python",
        "bytes": 2674
      },
      {
        "path": "mcp/requirements.txt",
        "lang": "text",
        "bytes": 135
      },
      {
        "path": "requirements.txt",
        "lang": "text",
        "bytes": 273
      }
    ]
  },
  {
    "slug": "01-features/05-authenticate-and-authorize/05-certificate-based-auth/entra",
    "title": "PRIVATE_KEY_JWT with Microsoft Entra ID",
    "desc": "End-to-end walkthrough for AgentCore Identity's PRIVATEKEYJWT client authentication against Microsoft Entra ID, covering both:",
    "sectionId": "identity",
    "kind": "feature",
    "frameworks": [],
    "languages": [
      "python"
    ],
    "hasNotebook": false,
    "readme": "/agentcore-samples/01-features/05-authenticate-and-authorize/05-certificate-based-auth/entra/README.md",
    "base": "/agentcore-samples/01-features/05-authenticate-and-authorize/05-certificate-based-auth/entra",
    "files": [
      {
        "path": "cleanup.py",
        "lang": "python",
        "bytes": 12337
      },
      {
        "path": "diagnose_entra_apps.py",
        "lang": "python",
        "bytes": 8400
      },
      {
        "path": "get_entra_user_jwt.py",
        "lang": "python",
        "bytes": 13607
      },
      {
        "path": "outbound_private_key_jwt_m2m.py",
        "lang": "python",
        "bytes": 6640
      },
      {
        "path": "outbound_private_key_jwt_obo.py",
        "lang": "python",
        "bytes": 8915
      },
      {
        "path": "requirements.txt",
        "lang": "text",
        "bytes": 92
      },
      {
        "path": "setup/00_provision_signing_key.py",
        "lang": "python",
        "bytes": 8496
      },
      {
        "path": "setup/01_build_certificate.py",
        "lang": "python",
        "bytes": 11363
      },
      {
        "path": "setup/02_create_entra_service_app.py",
        "lang": "python",
        "bytes": 10202
      },
      {
        "path": "setup/02a_configure_entra_permissions.py",
        "lang": "python",
        "bytes": 18815
      },
      {
        "path": "setup/02b_create_entra_login_web_app.py",
        "lang": "python",
        "bytes": 19440
      },
      {
        "path": "setup/03_create_provider_m2m.py",
        "lang": "python",
        "bytes": 6952
      },
      {
        "path": "setup/04_create_provider_obo.py",
        "lang": "python",
        "bytes": 8197
      },
      {
        "path": "setup/04b_create_provider_client.py",
        "lang": "python",
        "bytes": 13296
      },
      {
        "path": "setup/_entra_graph.py",
        "lang": "python",
        "bytes": 7119
      },
      {
        "path": "setup/print_manual_entra_instructions.py",
        "lang": "python",
        "bytes": 14716
      },
      {
        "path": "tests/__init__.py",
        "lang": "python",
        "bytes": 0
      },
      {
        "path": "tests/test_provider_config.py",
        "lang": "python",
        "bytes": 15744
      }
    ]
  },
  {
    "slug": "01-features/05-authenticate-and-authorize/05-certificate-based-auth/okta",
    "title": "PRIVATE_KEY_JWT with Okta",
    "desc": "End-to-end walkthrough for AgentCore Identity's PRIVATEKEYJWT client authentication against Okta, covering both:",
    "sectionId": "identity",
    "kind": "feature",
    "frameworks": [],
    "languages": [
      "python"
    ],
    "hasNotebook": false,
    "readme": "/agentcore-samples/01-features/05-authenticate-and-authorize/05-certificate-based-auth/okta/README.md",
    "base": "/agentcore-samples/01-features/05-authenticate-and-authorize/05-certificate-based-auth/okta",
    "files": [
      {
        "path": "cleanup.py",
        "lang": "python",
        "bytes": 19201
      },
      {
        "path": "diagnose_login_app.py",
        "lang": "python",
        "bytes": 5941
      },
      {
        "path": "get_okta_user_jwt.py",
        "lang": "python",
        "bytes": 12133
      },
      {
        "path": "outbound_private_key_jwt_m2m.py",
        "lang": "python",
        "bytes": 6584
      },
      {
        "path": "outbound_private_key_jwt_obo.py",
        "lang": "python",
        "bytes": 9116
      },
      {
        "path": "requirements.txt",
        "lang": "text",
        "bytes": 74
      },
      {
        "path": "setup/00_provision_signing_key.py",
        "lang": "python",
        "bytes": 7247
      },
      {
        "path": "setup/01_create_okta_service_app.py",
        "lang": "python",
        "bytes": 11871
      },
      {
        "path": "setup/01a_configure_okta_auth_server.py",
        "lang": "python",
        "bytes": 15445
      },
      {
        "path": "setup/01b_create_okta_login_web_app.py",
        "lang": "python",
        "bytes": 21476
      },
      {
        "path": "setup/02_create_provider_m2m.py",
        "lang": "python",
        "bytes": 6361
      },
      {
        "path": "setup/03_create_provider_obo.py",
        "lang": "python",
        "bytes": 7066
      },
      {
        "path": "setup/03b_create_provider_client.py",
        "lang": "python",
        "bytes": 13588
      },
      {
        "path": "setup/print_manual_okta_instructions.py",
        "lang": "python",
        "bytes": 15989
      },
      {
        "path": "tests/__init__.py",
        "lang": "python",
        "bytes": 0
      },
      {
        "path": "tests/test_provider_config.py",
        "lang": "python",
        "bytes": 8232
      }
    ]
  },
  {
    "slug": "01-features/05-authenticate-and-authorize/auth0-multi-agent-obo",
    "title": "Identity-Aware Multi-Agent Financial Assistant",
    "desc": "A reference implementation demonstrating RFC 8693 Token Exchange in a multi-agent system on AWS Bedrock AgentCore Runtime. The coordinator agent does not forward the user's JWT — it exchanges it...",
    "sectionId": "identity",
    "kind": "feature",
    "frameworks": [
      "Strands"
    ],
    "languages": [
      "javascript",
      "python"
    ],
    "hasNotebook": false,
    "readme": "/agentcore-samples/01-features/05-authenticate-and-authorize/auth0-multi-agent-obo/README.md",
    "base": "/agentcore-samples/01-features/05-authenticate-and-authorize/auth0-multi-agent-obo",
    "files": [
      {
        "path": "agents/accounts/__init__.py",
        "lang": "python",
        "bytes": 388
      },
      {
        "path": "agents/accounts/agent.py",
        "lang": "python",
        "bytes": 7232
      },
      {
        "path": "agents/accounts/auth_validator.py",
        "lang": "python",
        "bytes": 8477
      },
      {
        "path": "agents/accounts/main.py",
        "lang": "python",
        "bytes": 10244
      },
      {
        "path": "agents/accounts/requirements.txt",
        "lang": "text",
        "bytes": 456
      },
      {
        "path": "agents/accounts/tools/__init__.py",
        "lang": "python",
        "bytes": 333
      },
      {
        "path": "agents/accounts/tools/account_tools.py",
        "lang": "python",
        "bytes": 20737
      },
      {
        "path": "agents/customer_profile/__init__.py",
        "lang": "python",
        "bytes": 520
      },
      {
        "path": "agents/customer_profile/agent.py",
        "lang": "python",
        "bytes": 8599
      },
      {
        "path": "agents/customer_profile/auth_validator.py",
        "lang": "python",
        "bytes": 9945
      },
      {
        "path": "agents/customer_profile/main.py",
        "lang": "python",
        "bytes": 10336
      },
      {
        "path": "agents/customer_profile/profile_service.py",
        "lang": "python",
        "bytes": 13261
      },
      {
        "path": "agents/customer_profile/requirements.txt",
        "lang": "text",
        "bytes": 472
      },
      {
        "path": "agents/customer_profile/tools/__init__.py",
        "lang": "python",
        "bytes": 304
      },
      {
        "path": "agents/customer_profile/tools/get_profile.py",
        "lang": "python",
        "bytes": 2471
      },
      {
        "path": "agents/customer_profile/tools/update_phone.py",
        "lang": "python",
        "bytes": 3240
      },
      {
        "path": "cleanup_all.sh",
        "lang": "bash",
        "bytes": 8629
      },
      {
        "path": "debug.sh",
        "lang": "bash",
        "bytes": 7612
      },
      {
        "path": "deploy_all.sh",
        "lang": "bash",
        "bytes": 14839
      },
      {
        "path": "docs/README.md",
        "lang": "markdown",
        "bytes": 12581
      },
      {
        "path": "docs/api_reference.md",
        "lang": "markdown",
        "bytes": 11231
      },
      {
        "path": "docs/architecture.md",
        "lang": "markdown",
        "bytes": 42605
      },
      {
        "path": "docs/auth0_configuration.md",
        "lang": "markdown",
        "bytes": 17196
      },
      {
        "path": "docs/rfc8693_token_exchange.md",
        "lang": "markdown",
        "bytes": 12495
      },
      {
        "path": "docs/setup.md",
        "lang": "markdown",
        "bytes": 11042
      },
      {
        "path": "infrastructure/auth0/README.md",
        "lang": "markdown",
        "bytes": 9973
      },
      {
        "path": "infrastructure/auth0/actions/post_login_action.js",
        "lang": "javascript",
        "bytes": 3711
      },
      {
        "path": "infrastructure/auth0/rules/add_custom_claims.js",
        "lang": "javascript",
        "bytes": 2931
      },
      {
        "path": "pyproject.toml",
        "lang": "toml",
        "bytes": 5705
      },
      {
        "path": "requirements.txt",
        "lang": "text",
        "bytes": 827
      },
      {
        "path": "shared/__init__.py",
        "lang": "python",
        "bytes": 169
      },
      {
        "path": "shared/auth/__init__.py",
        "lang": "python",
        "bytes": 1567
      },
      {
        "path": "shared/auth/claims_extractor.py",
        "lang": "python",
        "bytes": 8242
      },
      {
        "path": "shared/auth/token_exchange.py",
        "lang": "python",
        "bytes": 23557
      },
      {
        "path": "shared/auth/token_forwarder.py",
        "lang": "python",
        "bytes": 8501
      },
      {
        "path": "shared/config/__init__.py",
        "lang": "python",
        "bytes": 5196
      },
      {
        "path": "shared/config/secrets_provider.py",
        "lang": "python",
        "bytes": 17229
      },
      {
        "path": "shared/config/settings.py",
        "lang": "python",
        "bytes": 7868
      },
      {
        "path": "shared/http/__init__.py",
        "lang": "python",
        "bytes": 287
      },
      {
        "path": "shared/http/agent_http_client.py",
        "lang": "python",
        "bytes": 15512
      },
      {
        "path": "shared/models/__init__.py",
        "lang": "python",
        "bytes": 813
      },
      {
        "path": "shared/models/profile.py",
        "lang": "python",
        "bytes": 1850
      },
      {
        "path": "shared/models/requests.py",
        "lang": "python",
        "bytes": 6022
      },
      {
        "path": "shared/models/user_context.py",
        "lang": "python",
        "bytes": 3859
      },
      {
        "path": "tests/__init__.py",
        "lang": "python",
        "bytes": 327
      },
      {
        "path": "tests/conftest.py",
        "lang": "python",
        "bytes": 23167
      },
      {
        "path": "tests/unit/__init__.py",
        "lang": "python",
        "bytes": 226
      },
      {
        "path": "tests/unit/agents/__init__.py",
        "lang": "python",
        "bytes": 143
      },
      {
        "path": "tests/unit/agents/test_accounts_agent.py",
        "lang": "python",
        "bytes": 7206
      },
      {
        "path": "tests/unit/agents/test_accounts_auth_validator.py",
        "lang": "python",
        "bytes": 4863
      },
      {
        "path": "tests/unit/agents/test_coordinator_agent.py",
        "lang": "python",
        "bytes": 25237
      },
      {
        "path": "tests/unit/agents/test_coordinator_main.py",
        "lang": "python",
        "bytes": 14990
      },
      {
        "path": "tests/unit/agents/test_customer_profile_agent.py",
        "lang": "python",
        "bytes": 8149
      },
      {
        "path": "tests/unit/agents/test_profile_auth_validator.py",
        "lang": "python",
        "bytes": 8746
      },
      {
        "path": "tests/unit/agents/test_profile_main.py",
        "lang": "python",
        "bytes": 7704
      },
      {
        "path": "tests/unit/test_auth_validator.py",
        "lang": "python",
        "bytes": 15275
      },
      {
        "path": "tests/unit/test_claims_extractor.py",
        "lang": "python",
        "bytes": 12315
      },
      {
        "path": "tests/unit/test_profile_model.py",
        "lang": "python",
        "bytes": 3679
      },
      {
        "path": "tests/unit/test_profile_service.py",
        "lang": "python",
        "bytes": 5066
      },
      {
        "path": "tests/unit/test_secrets_provider.py",
        "lang": "python",
        "bytes": 26123
      },
      {
        "path": "tests/unit/test_token_exchange.py",
        "lang": "python",
        "bytes": 29095
      },
      {
        "path": "tests/unit/test_token_forwarding.py",
        "lang": "python",
        "bytes": 9086
      },
      {
        "path": "tests/unit/test_user_context.py",
        "lang": "python",
        "bytes": 9829
      }
    ]
  },
  {
    "slug": "01-features/05-authenticate-and-authorize/auth0-multi-agent-obo/agents/coordinator",
    "title": "Coordinator Agent - AgentCore Identity Sample",
    "desc": "The Coordinator Agent is the supervisor/orchestrator agent in the AgentCore Identity financial services multi-agent system. It receives authenticated requests and intelligently routes them to...",
    "sectionId": "identity",
    "kind": "feature",
    "frameworks": [],
    "languages": [
      "python"
    ],
    "hasNotebook": false,
    "readme": "/agentcore-samples/01-features/05-authenticate-and-authorize/auth0-multi-agent-obo/agents/coordinator/README.md",
    "base": "/agentcore-samples/01-features/05-authenticate-and-authorize/auth0-multi-agent-obo/agents/coordinator",
    "files": [
      {
        "path": "QUICKSTART.md",
        "lang": "markdown",
        "bytes": 7867
      },
      {
        "path": "__init__.py",
        "lang": "python",
        "bytes": 714
      },
      {
        "path": "agent.py",
        "lang": "python",
        "bytes": 20434
      },
      {
        "path": "auth_context.py",
        "lang": "python",
        "bytes": 10258
      },
      {
        "path": "main.py",
        "lang": "python",
        "bytes": 13422
      },
      {
        "path": "requirements.txt",
        "lang": "text",
        "bytes": 496
      },
      {
        "path": "subagent_router.py",
        "lang": "python",
        "bytes": 12604
      },
      {
        "path": "tools/__init__.py",
        "lang": "python",
        "bytes": 432
      },
      {
        "path": "tools/profile_tools.py",
        "lang": "python",
        "bytes": 13436
      },
      {
        "path": "tools/routing_tools.py",
        "lang": "python",
        "bytes": 7291
      }
    ]
  },
  {
    "slug": "01-features/05-authenticate-and-authorize/auth0-multi-agent-obo/client/streamlit_app",
    "title": "AgentCore Identity - Streamlit Client Application",
    "desc": "A Streamlit-based client application demonstrating 3-legged OAuth authentication with Auth0 and integration with AWS AgentCore Runtime.",
    "sectionId": "identity",
    "kind": "feature",
    "frameworks": [],
    "languages": [
      "python"
    ],
    "hasNotebook": false,
    "readme": "/agentcore-samples/01-features/05-authenticate-and-authorize/auth0-multi-agent-obo/client/streamlit_app/README.md",
    "base": "/agentcore-samples/01-features/05-authenticate-and-authorize/auth0-multi-agent-obo/client/streamlit_app",
    "files": [
      {
        "path": "ARCHITECTURE.md",
        "lang": "markdown",
        "bytes": 26078
      },
      {
        "path": "QUICKSTART.md",
        "lang": "markdown",
        "bytes": 3047
      },
      {
        "path": "__init__.py",
        "lang": "python",
        "bytes": 272
      },
      {
        "path": "agent_trace.py",
        "lang": "python",
        "bytes": 12060
      },
      {
        "path": "agentcore_client.py",
        "lang": "python",
        "bytes": 19472
      },
      {
        "path": "app.py",
        "lang": "python",
        "bytes": 6988
      },
      {
        "path": "auth0_handler.py",
        "lang": "python",
        "bytes": 11630
      },
      {
        "path": "components/__init__.py",
        "lang": "python",
        "bytes": 174
      },
      {
        "path": "components/api_call_log.py",
        "lang": "python",
        "bytes": 16085
      },
      {
        "path": "components/chat.py",
        "lang": "python",
        "bytes": 9974
      },
      {
        "path": "components/jwt_viewer.py",
        "lang": "python",
        "bytes": 26777
      },
      {
        "path": "components/login.py",
        "lang": "python",
        "bytes": 7660
      },
      {
        "path": "components/sidebar.py",
        "lang": "python",
        "bytes": 7361
      },
      {
        "path": "components/state_viewer.py",
        "lang": "python",
        "bytes": 18894
      },
      {
        "path": "logging_config.py",
        "lang": "python",
        "bytes": 1591
      },
      {
        "path": "oauth2_callback.py",
        "lang": "python",
        "bytes": 10310
      },
      {
        "path": "pkce_store.py",
        "lang": "python",
        "bytes": 2800
      },
      {
        "path": "requirements.txt",
        "lang": "text",
        "bytes": 435
      },
      {
        "path": "run.sh",
        "lang": "bash",
        "bytes": 3834
      },
      {
        "path": "session_manager.py",
        "lang": "python",
        "bytes": 12764
      }
    ]
  },
  {
    "slug": "01-features/05-authenticate-and-authorize/auth0-multi-agent-obo/infrastructure/cdk",
    "title": "AgentCore CDK Infrastructure - Template / Reference",
    "desc": "This directory contains AWS CDK (Cloud Development Kit) infrastructure definitions for the AgentCore Financial Services platform.",
    "sectionId": "identity",
    "kind": "feature",
    "frameworks": [],
    "languages": [
      "python"
    ],
    "hasNotebook": false,
    "readme": "/agentcore-samples/01-features/05-authenticate-and-authorize/auth0-multi-agent-obo/infrastructure/cdk/README.md",
    "base": "/agentcore-samples/01-features/05-authenticate-and-authorize/auth0-multi-agent-obo/infrastructure/cdk",
    "files": [
      {
        "path": "__init__.py",
        "lang": "python",
        "bytes": 452
      },
      {
        "path": "agentcore_identity_stack.py",
        "lang": "python",
        "bytes": 13598
      },
      {
        "path": "agentcore_runtime_stack.py",
        "lang": "python",
        "bytes": 19133
      },
      {
        "path": "app.py",
        "lang": "python",
        "bytes": 6670
      },
      {
        "path": "cdk.json",
        "lang": "json",
        "bytes": 3729
      },
      {
        "path": "requirements.txt",
        "lang": "text",
        "bytes": 840
      }
    ]
  },
  {
    "slug": "01-features/05-authenticate-and-authorize/obo-training/3-examples/01-agent-to-downstream/entra/local",
    "title": "Use Case 1 — Entra ID flavor",
    "desc": "User → Frontend → Agent on Runtime → Microsoft Graph /me, all under Microsoft Entra ID.",
    "sectionId": "identity",
    "kind": "feature",
    "frameworks": [],
    "languages": [
      "python"
    ],
    "hasNotebook": false,
    "readme": "/agentcore-samples/01-features/05-authenticate-and-authorize/obo-training/3-examples/01-agent-to-downstream/entra/local/README.md",
    "base": "/agentcore-samples/01-features/05-authenticate-and-authorize/obo-training/3-examples/01-agent-to-downstream/entra/local",
    "files": [
      {
        "path": "01_create_providers.py",
        "lang": "python",
        "bytes": 5009
      },
      {
        "path": "02_run_example.py",
        "lang": "python",
        "bytes": 13852
      },
      {
        "path": "IDP_SETUP.md",
        "lang": "markdown",
        "bytes": 6499
      },
      {
        "path": "callback_server.py",
        "lang": "python",
        "bytes": 2630
      },
      {
        "path": "diagnose_obo.py",
        "lang": "python",
        "bytes": 5181
      },
      {
        "path": "generate_user_jwt.py",
        "lang": "python",
        "bytes": 3201
      },
      {
        "path": "interactive.py",
        "lang": "python",
        "bytes": 4222
      },
      {
        "path": "pytest.ini",
        "lang": "text",
        "bytes": 187
      },
      {
        "path": "requirements-dev.txt",
        "lang": "text",
        "bytes": 71
      },
      {
        "path": "requirements.txt",
        "lang": "text",
        "bytes": 52
      }
    ]
  },
  {
    "slug": "01-features/05-authenticate-and-authorize/obo-training/3-examples/01-agent-to-downstream/entra/local/tests",
    "title": "Tests — Use Case 1 (Entra)",
    "desc": "pip install -r requirements-dev.txt pytest tests/ -v",
    "sectionId": "identity",
    "kind": "feature",
    "frameworks": [],
    "languages": [
      "python"
    ],
    "hasNotebook": false,
    "readme": "/agentcore-samples/01-features/05-authenticate-and-authorize/obo-training/3-examples/01-agent-to-downstream/entra/local/tests/README.md",
    "base": "/agentcore-samples/01-features/05-authenticate-and-authorize/obo-training/3-examples/01-agent-to-downstream/entra/local/tests",
    "files": [
      {
        "path": "conftest.py",
        "lang": "python",
        "bytes": 2316
      },
      {
        "path": "test_integration_obo.py",
        "lang": "python",
        "bytes": 4417
      },
      {
        "path": "test_unit_callback_server.py",
        "lang": "python",
        "bytes": 1744
      },
      {
        "path": "test_unit_create_providers.py",
        "lang": "python",
        "bytes": 4262
      },
      {
        "path": "test_unit_decode_jwt.py",
        "lang": "python",
        "bytes": 1596
      },
      {
        "path": "test_unit_run_example.py",
        "lang": "python",
        "bytes": 6045
      }
    ]
  },
  {
    "slug": "01-features/05-authenticate-and-authorize/obo-training/3-examples/01-agent-to-downstream/entra/real-world/agent",
    "title": "Agent — deployed on AgentCore Runtime",
    "desc": "A minimal Strands agent that performs OBO inside its request handler.",
    "sectionId": "identity",
    "kind": "feature",
    "frameworks": [
      "Strands"
    ],
    "languages": [
      "python"
    ],
    "hasNotebook": false,
    "readme": "/agentcore-samples/01-features/05-authenticate-and-authorize/obo-training/3-examples/01-agent-to-downstream/entra/real-world/agent/README.md",
    "base": "/agentcore-samples/01-features/05-authenticate-and-authorize/obo-training/3-examples/01-agent-to-downstream/entra/real-world/agent",
    "files": [
      {
        "path": "agent.py",
        "lang": "python",
        "bytes": 5554
      },
      {
        "path": "requirements.txt",
        "lang": "text",
        "bytes": 78
      }
    ]
  },
  {
    "slug": "01-features/05-authenticate-and-authorize/obo-training/3-examples/01-agent-to-downstream/entra/real-world/frontend",
    "title": "Frontend — FastAPI BFF",
    "desc": "",
    "sectionId": "identity",
    "kind": "feature",
    "frameworks": [],
    "languages": [
      "python"
    ],
    "hasNotebook": false,
    "readme": "/agentcore-samples/01-features/05-authenticate-and-authorize/obo-training/3-examples/01-agent-to-downstream/entra/real-world/frontend/README.md",
    "base": "/agentcore-samples/01-features/05-authenticate-and-authorize/obo-training/3-examples/01-agent-to-downstream/entra/real-world/frontend",
    "files": [
      {
        "path": "app.py",
        "lang": "python",
        "bytes": 7447
      },
      {
        "path": "templates/home.html",
        "lang": "html",
        "bytes": 2769
      },
      {
        "path": "templates/result.html",
        "lang": "html",
        "bytes": 1478
      }
    ]
  },
  {
    "slug": "01-features/05-authenticate-and-authorize/obo-training/3-examples/01-agent-to-downstream/okta/local",
    "title": "Use Case 1 — Okta flavor (local)",
    "desc": "Start here. This is the front door of the Okta local example. Read through the design below, then follow the step-by-step path at the bottom.",
    "sectionId": "identity",
    "kind": "feature",
    "frameworks": [],
    "languages": [
      "python"
    ],
    "hasNotebook": false,
    "readme": "/agentcore-samples/01-features/05-authenticate-and-authorize/obo-training/3-examples/01-agent-to-downstream/okta/local/README.md",
    "base": "/agentcore-samples/01-features/05-authenticate-and-authorize/obo-training/3-examples/01-agent-to-downstream/okta/local",
    "files": [
      {
        "path": "01_create_providers.py",
        "lang": "python",
        "bytes": 10133
      },
      {
        "path": "02_run_example.py",
        "lang": "python",
        "bytes": 18943
      },
      {
        "path": "IDP_SETUP.md",
        "lang": "markdown",
        "bytes": 28117
      },
      {
        "path": "callback_server.py",
        "lang": "python",
        "bytes": 2630
      },
      {
        "path": "generate_user_jwt.py",
        "lang": "python",
        "bytes": 3560
      },
      {
        "path": "interactive.py",
        "lang": "python",
        "bytes": 4222
      },
      {
        "path": "pytest.ini",
        "lang": "text",
        "bytes": 183
      },
      {
        "path": "requirements-dev.txt",
        "lang": "text",
        "bytes": 71
      },
      {
        "path": "requirements.txt",
        "lang": "text",
        "bytes": 52
      },
      {
        "path": "teardown.py",
        "lang": "python",
        "bytes": 2266
      }
    ]
  },
  {
    "slug": "01-features/05-authenticate-and-authorize/obo-training/3-examples/01-agent-to-downstream/okta/local/tests",
    "title": "Tests — Use Case 1 (Okta)",
    "desc": "Same two-tier approach as the Entra tests:",
    "sectionId": "identity",
    "kind": "feature",
    "frameworks": [],
    "languages": [
      "python"
    ],
    "hasNotebook": false,
    "readme": "/agentcore-samples/01-features/05-authenticate-and-authorize/obo-training/3-examples/01-agent-to-downstream/okta/local/tests/README.md",
    "base": "/agentcore-samples/01-features/05-authenticate-and-authorize/obo-training/3-examples/01-agent-to-downstream/okta/local/tests",
    "files": [
      {
        "path": "conftest.py",
        "lang": "python",
        "bytes": 1410
      },
      {
        "path": "test_integration_obo.py",
        "lang": "python",
        "bytes": 3600
      },
      {
        "path": "test_unit_callback_server.py",
        "lang": "python",
        "bytes": 1744
      },
      {
        "path": "test_unit_create_providers.py",
        "lang": "python",
        "bytes": 3859
      },
      {
        "path": "test_unit_run_example.py",
        "lang": "python",
        "bytes": 4571
      }
    ]
  },
  {
    "slug": "01-features/05-authenticate-and-authorize/obo-training/3-examples/01-agent-to-downstream/okta/real-world/agent",
    "title": "Agent — deployed on AgentCore Runtime (Okta flavor)",
    "desc": "A minimal Strands agent that performs the Okta OBO exchange inside its request handler.",
    "sectionId": "identity",
    "kind": "feature",
    "frameworks": [
      "Strands"
    ],
    "languages": [
      "python"
    ],
    "hasNotebook": false,
    "readme": "/agentcore-samples/01-features/05-authenticate-and-authorize/obo-training/3-examples/01-agent-to-downstream/okta/real-world/agent/README.md",
    "base": "/agentcore-samples/01-features/05-authenticate-and-authorize/obo-training/3-examples/01-agent-to-downstream/okta/real-world/agent",
    "files": [
      {
        "path": "agent.py",
        "lang": "python",
        "bytes": 9259
      },
      {
        "path": "requirements.txt",
        "lang": "text",
        "bytes": 78
      }
    ]
  },
  {
    "slug": "01-features/05-authenticate-and-authorize/obo-training/3-examples/01-agent-to-downstream/okta/real-world/frontend",
    "title": "Frontend — FastAPI BFF (Okta)",
    "desc": "",
    "sectionId": "identity",
    "kind": "feature",
    "frameworks": [],
    "languages": [
      "python"
    ],
    "hasNotebook": false,
    "readme": "/agentcore-samples/01-features/05-authenticate-and-authorize/obo-training/3-examples/01-agent-to-downstream/okta/real-world/frontend/README.md",
    "base": "/agentcore-samples/01-features/05-authenticate-and-authorize/obo-training/3-examples/01-agent-to-downstream/okta/real-world/frontend",
    "files": [
      {
        "path": "app.py",
        "lang": "python",
        "bytes": 7572
      },
      {
        "path": "templates/home.html",
        "lang": "html",
        "bytes": 2827
      },
      {
        "path": "templates/result.html",
        "lang": "html",
        "bytes": 1485
      }
    ]
  },
  {
    "slug": "01-features/05-authenticate-and-authorize/obo-training/3-examples/02-agent-via-gateway/entra/real-world/agent",
    "title": "Agent — Strands on AgentCore Runtime",
    "desc": "The Strands agent for Use Case 2. Performs OBO #1 (Tuser → Tgateway) and then talks to the AgentCore Gateway over MCP.",
    "sectionId": "gateway",
    "kind": "feature",
    "frameworks": [
      "Strands"
    ],
    "languages": [
      "python"
    ],
    "hasNotebook": false,
    "readme": "/agentcore-samples/01-features/05-authenticate-and-authorize/obo-training/3-examples/02-agent-via-gateway/entra/real-world/agent/README.md",
    "base": "/agentcore-samples/01-features/05-authenticate-and-authorize/obo-training/3-examples/02-agent-via-gateway/entra/real-world/agent",
    "files": [
      {
        "path": "agent.py",
        "lang": "python",
        "bytes": 9767
      },
      {
        "path": "requirements.txt",
        "lang": "text",
        "bytes": 267
      }
    ]
  },
  {
    "slug": "01-features/05-authenticate-and-authorize/obo-training/3-examples/02-agent-via-gateway/entra/real-world/frontend",
    "title": "Frontend — FastAPI BFF",
    "desc": "Same shape as Use Case 1's frontend. The only difference is what happens behind the agent invoke — UC2 has two OBO hops downstream where UC1 had one. This file just sends the user's JWT and...",
    "sectionId": "gateway",
    "kind": "feature",
    "frameworks": [],
    "languages": [
      "python"
    ],
    "hasNotebook": false,
    "readme": "/agentcore-samples/01-features/05-authenticate-and-authorize/obo-training/3-examples/02-agent-via-gateway/entra/real-world/frontend/README.md",
    "base": "/agentcore-samples/01-features/05-authenticate-and-authorize/obo-training/3-examples/02-agent-via-gateway/entra/real-world/frontend",
    "files": [
      {
        "path": "app.py",
        "lang": "python",
        "bytes": 10911
      },
      {
        "path": "templates/home.html",
        "lang": "html",
        "bytes": 3252
      },
      {
        "path": "templates/result.html",
        "lang": "html",
        "bytes": 1478
      }
    ]
  },
  {
    "slug": "01-features/05-authenticate-and-authorize/obo-training/3-examples/02-agent-via-gateway/okta/real-world/agent",
    "title": "Agent — Strands on AgentCore Runtime (Okta)",
    "desc": "The Strands agent for Use Case 2 (Okta variant). Performs OBO #1 (Tuser -> Tgateway) using Okta's RFC 8693 Token Exchange grant, then talks to the AgentCore Gateway over MCP.",
    "sectionId": "gateway",
    "kind": "feature",
    "frameworks": [
      "Strands"
    ],
    "languages": [
      "python"
    ],
    "hasNotebook": false,
    "readme": "/agentcore-samples/01-features/05-authenticate-and-authorize/obo-training/3-examples/02-agent-via-gateway/okta/real-world/agent/README.md",
    "base": "/agentcore-samples/01-features/05-authenticate-and-authorize/obo-training/3-examples/02-agent-via-gateway/okta/real-world/agent",
    "files": [
      {
        "path": "agent.py",
        "lang": "python",
        "bytes": 12224
      },
      {
        "path": "requirements.txt",
        "lang": "text",
        "bytes": 267
      }
    ]
  },
  {
    "slug": "01-features/05-authenticate-and-authorize/obo-training/3-examples/02-agent-via-gateway/okta/real-world/frontend",
    "title": "Frontend — FastAPI BFF (Okta)",
    "desc": "Same shape as UC2 Entra's frontend — the only difference is the OAuth library (authlib for Okta instead of MSAL for Entra) and the scope requested at sign-in. Everything downstream of \"send Tuser...",
    "sectionId": "gateway",
    "kind": "feature",
    "frameworks": [],
    "languages": [
      "python"
    ],
    "hasNotebook": false,
    "readme": "/agentcore-samples/01-features/05-authenticate-and-authorize/obo-training/3-examples/02-agent-via-gateway/okta/real-world/frontend/README.md",
    "base": "/agentcore-samples/01-features/05-authenticate-and-authorize/obo-training/3-examples/02-agent-via-gateway/okta/real-world/frontend",
    "files": [
      {
        "path": "app.py",
        "lang": "python",
        "bytes": 11449
      },
      {
        "path": "templates/home.html",
        "lang": "html",
        "bytes": 3352
      },
      {
        "path": "templates/result.html",
        "lang": "html",
        "bytes": 1485
      }
    ]
  },
  {
    "slug": "01-features/05-authenticate-and-authorize/okta-auth-three-tier-end-to-end-demo",
    "title": "Okta OAuth2 Three-Tier Authentication with Amazon Bedrock AgentCore",
    "desc": "Per-tier token isolation with pure Okta OAuth2 authentication and RBAC-based access control.",
    "sectionId": "identity",
    "kind": "feature",
    "frameworks": [],
    "languages": [],
    "hasNotebook": true,
    "readme": "/agentcore-samples/01-features/05-authenticate-and-authorize/okta-auth-three-tier-end-to-end-demo/README.md",
    "base": "/agentcore-samples/01-features/05-authenticate-and-authorize/okta-auth-three-tier-end-to-end-demo",
    "files": [
      {
        "path": "okta-auth-three-tier-end-to-end-demo.md",
        "lang": "markdown",
        "bytes": 56611,
        "fromNotebook": true
      },
      {
        "path": "requirements.txt",
        "lang": "text",
        "bytes": 121
      }
    ]
  },
  {
    "slug": "01-features/06-observe-evaluate-optimize-your-agent/01-observe",
    "title": "Observe — Advanced AgentCore observability Concepts",
    "desc": "AgentCore Observability helps you trace, debug, and monitor agent performance in production environments. It offers detailed visualizations of each step in the agent workflow, enabling you to...",
    "sectionId": "evaluations",
    "kind": "feature",
    "frameworks": [
      "Strands"
    ],
    "languages": [
      "python"
    ],
    "hasNotebook": false,
    "readme": "/agentcore-samples/01-features/06-observe-evaluate-optimize-your-agent/01-observe/README.md",
    "base": "/agentcore-samples/01-features/06-observe-evaluate-optimize-your-agent/01-observe",
    "files": [
      {
        "path": "_dp_agent/requirements.txt",
        "lang": "text",
        "bytes": 65
      },
      {
        "path": "_dp_agent/travel_support_agent.py",
        "lang": "python",
        "bytes": 1789
      },
      {
        "path": "attribute_redaction.py",
        "lang": "python",
        "bytes": 9212
      },
      {
        "path": "baggage_context.py",
        "lang": "python",
        "bytes": 8730
      },
      {
        "path": "custom_span_creation.py",
        "lang": "python",
        "bytes": 7835
      },
      {
        "path": "data_protection.py",
        "lang": "python",
        "bytes": 17463
      },
      {
        "path": "requirements.txt",
        "lang": "text",
        "bytes": 200
      },
      {
        "path": "span_filters.py",
        "lang": "python",
        "bytes": 10004
      }
    ]
  },
  {
    "slug": "01-features/06-observe-evaluate-optimize-your-agent/02-evaluate/custom-code-based-evaluation",
    "title": "Custom Code-Based evaluation",
    "desc": "Evaluate your Amazon Bedrock AgentCore agent using deterministic Lambda-backed evaluators. Code-based evaluators run your own Python logic — regex checks, business rule validation, statistical...",
    "sectionId": "evaluations",
    "kind": "feature",
    "frameworks": [
      "Strands"
    ],
    "languages": [
      "python"
    ],
    "hasNotebook": false,
    "readme": "/agentcore-samples/01-features/06-observe-evaluate-optimize-your-agent/02-evaluate/custom-code-based-evaluation/README.md",
    "base": "/agentcore-samples/01-features/06-observe-evaluate-optimize-your-agent/02-evaluate/custom-code-based-evaluation",
    "files": [
      {
        "path": "evaluate.py",
        "lang": "python",
        "bytes": 26906
      },
      {
        "path": "lambdas/hr_fact_checker/lambda_function.py",
        "lang": "python",
        "bytes": 8646
      },
      {
        "path": "lambdas/hr_response_length/lambda_function.py",
        "lang": "python",
        "bytes": 4238
      },
      {
        "path": "requirements.txt",
        "lang": "text",
        "bytes": 39
      }
    ]
  },
  {
    "slug": "01-features/06-observe-evaluate-optimize-your-agent/02-evaluate/ground-truth-based-evaluation",
    "title": "Ground Truth evaluation with Amazon Bedrock AgentCore",
    "desc": "Evaluate an agent using Amazon Bedrock AgentCore evaluations with ground-truth reference inputs. Ground truth evaluation lets you supply the correct answer, expected tool calls, and session-level...",
    "sectionId": "evaluations",
    "kind": "feature",
    "frameworks": [
      "Strands"
    ],
    "languages": [
      "python"
    ],
    "hasNotebook": false,
    "readme": "/agentcore-samples/01-features/06-observe-evaluate-optimize-your-agent/02-evaluate/ground-truth-based-evaluation/README.md",
    "base": "/agentcore-samples/01-features/06-observe-evaluate-optimize-your-agent/02-evaluate/ground-truth-based-evaluation",
    "files": [
      {
        "path": "evaluate.py",
        "lang": "python",
        "bytes": 40011
      },
      {
        "path": "requirements.txt",
        "lang": "text",
        "bytes": 39
      }
    ]
  },
  {
    "slug": "01-features/06-observe-evaluate-optimize-your-agent/02-evaluate/ground-truth-based-evaluation/dataset-construction",
    "title": "Dataset Construction via Actor Simulation",
    "desc": "Build an evaluation dataset by simulating realistic multi-turn employee conversations. An LLM \"actor\" drives each conversation as an employee with a specific HR request, interacting with the...",
    "sectionId": "evaluations",
    "kind": "feature",
    "frameworks": [],
    "languages": [
      "python"
    ],
    "hasNotebook": false,
    "readme": "/agentcore-samples/01-features/06-observe-evaluate-optimize-your-agent/02-evaluate/ground-truth-based-evaluation/dataset-construction/README.md",
    "base": "/agentcore-samples/01-features/06-observe-evaluate-optimize-your-agent/02-evaluate/ground-truth-based-evaluation/dataset-construction",
    "files": [
      {
        "path": "requirements.txt",
        "lang": "text",
        "bytes": 106
      },
      {
        "path": "simulate.py",
        "lang": "python",
        "bytes": 19095
      }
    ]
  },
  {
    "slug": "01-features/06-observe-evaluate-optimize-your-agent/02-evaluate/ground-truth-based-evaluation/dataset-management",
    "title": "Dataset Management with Amazon Bedrock AgentCore",
    "desc": "AgentCore Dataset Management lets you create, version, and manage evaluation datasets entirely within Amazon Bedrock AgentCore. A dataset is a named, account-scoped collection of typed examples...",
    "sectionId": "evaluations",
    "kind": "feature",
    "frameworks": [],
    "languages": [
      "python"
    ],
    "hasNotebook": false,
    "readme": "/agentcore-samples/01-features/06-observe-evaluate-optimize-your-agent/02-evaluate/ground-truth-based-evaluation/dataset-management/README.md",
    "base": "/agentcore-samples/01-features/06-observe-evaluate-optimize-your-agent/02-evaluate/ground-truth-based-evaluation/dataset-management",
    "files": [
      {
        "path": "manage_datasets.py",
        "lang": "python",
        "bytes": 38097
      },
      {
        "path": "requirements.txt",
        "lang": "text",
        "bytes": 39
      }
    ]
  },
  {
    "slug": "01-features/06-observe-evaluate-optimize-your-agent/02-evaluate/llm-as-a-judge-evaluation",
    "title": "LLM-as-a-Judge evaluation",
    "desc": "Evaluate your Amazon Bedrock AgentCore agent using LLM-based scoring. This sample shows how to author custom domain-specific evaluators in natural language and run them alongside built-in...",
    "sectionId": "evaluations",
    "kind": "feature",
    "frameworks": [],
    "languages": [
      "python"
    ],
    "hasNotebook": false,
    "readme": "/agentcore-samples/01-features/06-observe-evaluate-optimize-your-agent/02-evaluate/llm-as-a-judge-evaluation/README.md",
    "base": "/agentcore-samples/01-features/06-observe-evaluate-optimize-your-agent/02-evaluate/llm-as-a-judge-evaluation",
    "files": [
      {
        "path": "evaluate.py",
        "lang": "python",
        "bytes": 22574
      },
      {
        "path": "requirements.txt",
        "lang": "text",
        "bytes": 39
      }
    ]
  },
  {
    "slug": "01-features/06-observe-evaluate-optimize-your-agent/02-evaluate/supported-frameworks/claude-agent-sdk",
    "title": "Evaluate a Claude Agent SDK Agent with AgentCore Evaluations",
    "desc": "This sample demonstrates how to evaluate an agent built with the Claude Agent SDK using Amazon Bedrock AgentCore Evaluations.",
    "sectionId": "evaluations",
    "kind": "feature",
    "frameworks": [
      "Claude Agent SDK"
    ],
    "languages": [
      "python"
    ],
    "hasNotebook": false,
    "readme": "/agentcore-samples/01-features/06-observe-evaluate-optimize-your-agent/02-evaluate/supported-frameworks/claude-agent-sdk/README.md",
    "base": "/agentcore-samples/01-features/06-observe-evaluate-optimize-your-agent/02-evaluate/supported-frameworks/claude-agent-sdk",
    "files": [
      {
        "path": "agent.py",
        "lang": "python",
        "bytes": 7422
      },
      {
        "path": "cleanup.py",
        "lang": "python",
        "bytes": 4153
      },
      {
        "path": "deploy.py",
        "lang": "python",
        "bytes": 3254
      },
      {
        "path": "evaluate.py",
        "lang": "python",
        "bytes": 12228
      },
      {
        "path": "requirements.txt",
        "lang": "text",
        "bytes": 295
      }
    ]
  },
  {
    "slug": "01-features/06-observe-evaluate-optimize-your-agent/02-evaluate/supported-frameworks/google-adk",
    "title": "Evaluate a Google ADK Agent with AgentCore Evaluations",
    "desc": "This sample demonstrates how to evaluate an agent built with the Google Agent Development Kit (ADK) using Amazon Bedrock AgentCore Evaluations.",
    "sectionId": "evaluations",
    "kind": "feature",
    "frameworks": [
      "Google ADK"
    ],
    "languages": [
      "python"
    ],
    "hasNotebook": false,
    "readme": "/agentcore-samples/01-features/06-observe-evaluate-optimize-your-agent/02-evaluate/supported-frameworks/google-adk/README.md",
    "base": "/agentcore-samples/01-features/06-observe-evaluate-optimize-your-agent/02-evaluate/supported-frameworks/google-adk",
    "files": [
      {
        "path": "agent.py",
        "lang": "python",
        "bytes": 7287
      },
      {
        "path": "cleanup.py",
        "lang": "python",
        "bytes": 4087
      },
      {
        "path": "deploy.py",
        "lang": "python",
        "bytes": 3158
      },
      {
        "path": "evaluate.py",
        "lang": "python",
        "bytes": 12186
      },
      {
        "path": "requirements.txt",
        "lang": "text",
        "bytes": 372
      }
    ]
  },
  {
    "slug": "01-features/06-observe-evaluate-optimize-your-agent/02-evaluate/supported-frameworks/llamaindex",
    "title": "Evaluate a LlamaIndex agent",
    "desc": "Evaluate a LlamaIndex agent with Amazon Bedrock AgentCore Evaluations. This sample deploys the shared HR Assistant, re-implemented as a LlamaIndex FunctionAgent workflow, to AgentCore Runtime. It...",
    "sectionId": "evaluations",
    "kind": "feature",
    "frameworks": [
      "Strands",
      "LlamaIndex"
    ],
    "languages": [
      "python"
    ],
    "hasNotebook": false,
    "readme": "/agentcore-samples/01-features/06-observe-evaluate-optimize-your-agent/02-evaluate/supported-frameworks/llamaindex/README.md",
    "base": "/agentcore-samples/01-features/06-observe-evaluate-optimize-your-agent/02-evaluate/supported-frameworks/llamaindex",
    "files": [
      {
        "path": "cleanup.py",
        "lang": "python",
        "bytes": 16325
      },
      {
        "path": "deploy.py",
        "lang": "python",
        "bytes": 10430
      },
      {
        "path": "evaluate.py",
        "lang": "python",
        "bytes": 22676
      },
      {
        "path": "llamaindex_hr_assistant.py",
        "lang": "python",
        "bytes": 14958
      },
      {
        "path": "requirements.txt",
        "lang": "text",
        "bytes": 39
      }
    ]
  },
  {
    "slug": "01-features/06-observe-evaluate-optimize-your-agent/02-evaluate/supported-frameworks/openai-agents",
    "title": "Evaluate an OpenAI Agents SDK agent",
    "desc": "Evaluate an OpenAI Agents SDK agent with Amazon Bedrock AgentCore Evaluations. This sample deploys the shared HR Assistant, re-implemented with the OpenAI Agents SDK, to AgentCore Runtime. It then...",
    "sectionId": "evaluations",
    "kind": "feature",
    "frameworks": [
      "Strands",
      "OpenAI Agents"
    ],
    "languages": [
      "python"
    ],
    "hasNotebook": false,
    "readme": "/agentcore-samples/01-features/06-observe-evaluate-optimize-your-agent/02-evaluate/supported-frameworks/openai-agents/README.md",
    "base": "/agentcore-samples/01-features/06-observe-evaluate-optimize-your-agent/02-evaluate/supported-frameworks/openai-agents",
    "files": [
      {
        "path": "cleanup.py",
        "lang": "python",
        "bytes": 16331
      },
      {
        "path": "deploy.py",
        "lang": "python",
        "bytes": 10926
      },
      {
        "path": "evaluate.py",
        "lang": "python",
        "bytes": 22670
      },
      {
        "path": "openai_hr_assistant.py",
        "lang": "python",
        "bytes": 16669
      },
      {
        "path": "requirements.txt",
        "lang": "text",
        "bytes": 39
      }
    ]
  },
  {
    "slug": "01-features/06-observe-evaluate-optimize-your-agent/03-optimize",
    "title": "AgentCore optimization",
    "desc": "End-to-end optimization workflow for an HR Assistant agent on Amazon Bedrock AgentCore runtime. Covers automated insights to detect agent failures, run baseline evaluation, get recommendations to...",
    "sectionId": "evaluations",
    "kind": "feature",
    "frameworks": [
      "Strands"
    ],
    "languages": [
      "python"
    ],
    "hasNotebook": false,
    "readme": "/agentcore-samples/01-features/06-observe-evaluate-optimize-your-agent/03-optimize/README.md",
    "base": "/agentcore-samples/01-features/06-observe-evaluate-optimize-your-agent/03-optimize",
    "files": [
      {
        "path": "cleanup.py",
        "lang": "python",
        "bytes": 7302
      },
      {
        "path": "deploy.py",
        "lang": "python",
        "bytes": 13000
      },
      {
        "path": "insights.py",
        "lang": "python",
        "bytes": 20357
      },
      {
        "path": "invoke.py",
        "lang": "python",
        "bytes": 2690
      },
      {
        "path": "optimize.py",
        "lang": "python",
        "bytes": 45808
      },
      {
        "path": "requirements.txt",
        "lang": "text",
        "bytes": 96
      },
      {
        "path": "utils/hr_assistant_agent.py",
        "lang": "python",
        "bytes": 12069
      }
    ]
  },
  {
    "slug": "01-features/07-centralize-and-govern-your-ai-infrastructure/01-gateway/01-attach-targets/mcp/mcp-servers",
    "title": "Integrate your MCP Server with AgentCore gateway",
    "desc": "AgentCore gateway supports all three MCP primitives, tools, prompts, and resources. Tool definitions in MCP include an optional outputSchema for defining expected output structure and annotations...",
    "sectionId": "gateway",
    "kind": "feature",
    "frameworks": [],
    "languages": [
      "python"
    ],
    "hasNotebook": false,
    "readme": "/agentcore-samples/01-features/07-centralize-and-govern-your-ai-infrastructure/01-gateway/01-attach-targets/mcp/mcp-servers/README.md",
    "base": "/agentcore-samples/01-features/07-centralize-and-govern-your-ai-infrastructure/01-gateway/01-attach-targets/mcp/mcp-servers",
    "files": [
      {
        "path": "01-configure-auth/README.md",
        "lang": "markdown",
        "bytes": 1008
      },
      {
        "path": "01-configure-auth/authorization-code-flow/README.md",
        "lang": "markdown",
        "bytes": 8874
      },
      {
        "path": "01-configure-auth/authorization-code-flow/flows/implicit-sync-diagram.md",
        "lang": "markdown",
        "bytes": 1498
      },
      {
        "path": "01-configure-auth/authorization-code-flow/flows/invoke-tool-diagram.md",
        "lang": "markdown",
        "bytes": 2062
      },
      {
        "path": "01-configure-auth/authorization-code-flow/flows/schema-upfront-diagram.md",
        "lang": "markdown",
        "bytes": 677
      },
      {
        "path": "01-configure-auth/authorization-code-flow/github/README.md",
        "lang": "markdown",
        "bytes": 6482
      },
      {
        "path": "01-configure-auth/authorization-code-flow/github/github.json",
        "lang": "json",
        "bytes": 2594
      },
      {
        "path": "01-configure-auth/client-credentials/README.md",
        "lang": "markdown",
        "bytes": 9062
      },
      {
        "path": "01-configure-auth/token-exchange/README.md",
        "lang": "markdown",
        "bytes": 1006
      },
      {
        "path": "02-mcp-target-synchronization/README.md",
        "lang": "markdown",
        "bytes": 17795
      },
      {
        "path": "03-streaming/README.md",
        "lang": "markdown",
        "bytes": 11599
      },
      {
        "path": "04-session-management/README.md",
        "lang": "markdown",
        "bytes": 12659
      },
      {
        "path": "05-elicitation/README.md",
        "lang": "markdown",
        "bytes": 11723
      },
      {
        "path": "lambda-intercept.py",
        "lang": "python",
        "bytes": 4113
      }
    ]
  },
  {
    "slug": "01-features/07-centralize-and-govern-your-ai-infrastructure/01-gateway/03-private-connectivity/connect-gateway-to-private-resources",
    "title": "Configure Amazon Bedrock AgentCore gateway VPC Egress for gateway Targets using VPC Lattice",
    "desc": "Learn about connecting private resources in your VPC using Amazon VPC Lattice and configuring Amazon Bedrock AgentCore gateway VPC Egress for gateway Targets.",
    "sectionId": "gateway",
    "kind": "feature",
    "frameworks": [],
    "languages": [
      "javascript",
      "python",
      "typescript"
    ],
    "hasNotebook": false,
    "readme": "/agentcore-samples/01-features/07-centralize-and-govern-your-ai-infrastructure/01-gateway/03-private-connectivity/connect-gateway-to-private-resources/README.md",
    "base": "/agentcore-samples/01-features/07-centralize-and-govern-your-ai-infrastructure/01-gateway/03-private-connectivity/connect-gateway-to-private-resources",
    "files": [
      {
        "path": "00-prerequisites/README.md",
        "lang": "markdown",
        "bytes": 10056
      },
      {
        "path": "00-prerequisites/concepts/create-acm-public-certificate.md",
        "lang": "markdown",
        "bytes": 2640
      },
      {
        "path": "00-prerequisites/concepts/create-private-hosted-zone.md",
        "lang": "markdown",
        "bytes": 2545
      },
      {
        "path": "00-prerequisites/concepts/create-public-dns-record.md",
        "lang": "markdown",
        "bytes": 1445
      },
      {
        "path": "00-prerequisites/concepts/private-certificate-private-domain.md",
        "lang": "markdown",
        "bytes": 2987
      },
      {
        "path": "00-prerequisites/concepts/private-certificate-public-domain.md",
        "lang": "markdown",
        "bytes": 2475
      },
      {
        "path": "00-prerequisites/concepts/public-certificate-private-domain.md",
        "lang": "markdown",
        "bytes": 2842
      },
      {
        "path": "00-prerequisites/concepts/public-certificate-public-domain.md",
        "lang": "markdown",
        "bytes": 1701
      },
      {
        "path": "01-managed-vpc-resource/01-getting-started.md",
        "lang": "markdown",
        "bytes": 7451
      },
      {
        "path": "01-managed-vpc-resource/02-peering.md",
        "lang": "markdown",
        "bytes": 8663
      },
      {
        "path": "01-managed-vpc-resource/README.md",
        "lang": "markdown",
        "bytes": 6145
      },
      {
        "path": "02-self-managed-lattice/01-getting-started.md",
        "lang": "markdown",
        "bytes": 9573
      },
      {
        "path": "02-self-managed-lattice/02-cross-account.md",
        "lang": "markdown",
        "bytes": 8038
      },
      {
        "path": "02-self-managed-lattice/README.md",
        "lang": "markdown",
        "bytes": 5608
      },
      {
        "path": "03-advanced-concepts/01-private-domain.md",
        "lang": "markdown",
        "bytes": 7928
      },
      {
        "path": "03-advanced-concepts/02-private-certificate-authority.md",
        "lang": "markdown",
        "bytes": 9337
      },
      {
        "path": "03-advanced-concepts/03-self-signed-certificate.md",
        "lang": "markdown",
        "bytes": 4902
      },
      {
        "path": "03-advanced-concepts/04-static-gateway-ip.md",
        "lang": "markdown",
        "bytes": 4521
      },
      {
        "path": "03-advanced-concepts/README.md",
        "lang": "markdown",
        "bytes": 5228
      },
      {
        "path": "04-ecs-deployment/README.md",
        "lang": "markdown",
        "bytes": 1528
      },
      {
        "path": "04-ecs-deployment/fargate-mcp-gateway-managed.md",
        "lang": "markdown",
        "bytes": 5966
      },
      {
        "path": "05-eks-deployment/README.md",
        "lang": "markdown",
        "bytes": 2851
      },
      {
        "path": "05-eks-deployment/api-server-gateway-managed.md",
        "lang": "markdown",
        "bytes": 6845
      },
      {
        "path": "05-eks-deployment/mcp-server-gateway-managed.md",
        "lang": "markdown",
        "bytes": 5882
      },
      {
        "path": "LICENSE.txt",
        "lang": "text",
        "bytes": 10142
      },
      {
        "path": "bin/vpcegress.ts",
        "lang": "typescript",
        "bytes": 6548
      },
      {
        "path": "cdk.json",
        "lang": "json",
        "bytes": 5595
      },
      {
        "path": "docker/fastmcp-mock/requirements.txt",
        "lang": "text",
        "bytes": 13
      },
      {
        "path": "docker/fastmcp-mock/server.py",
        "lang": "python",
        "bytes": 539
      },
      {
        "path": "docker/simple-api/app.py",
        "lang": "python",
        "bytes": 279
      },
      {
        "path": "docker/simple-api/openapi.json",
        "lang": "json",
        "bytes": 2581
      },
      {
        "path": "docker/simple-api/requirements.txt",
        "lang": "text",
        "bytes": 33
      },
      {
        "path": "docker/stock-mcp-mock/requirements.txt",
        "lang": "text",
        "bytes": 29
      },
      {
        "path": "docker/stock-mcp-mock/server.py",
        "lang": "python",
        "bytes": 2012
      },
      {
        "path": "jest.config.js",
        "lang": "javascript",
        "bytes": 224
      },
      {
        "path": "package.json",
        "lang": "json",
        "bytes": 632
      },
      {
        "path": "requirements.txt",
        "lang": "text",
        "bytes": 23
      },
      {
        "path": "tsconfig.json",
        "lang": "json",
        "bytes": 712
      },
      {
        "path": "vpcegress/agentcore/.cli/deployed-state.json",
        "lang": "json",
        "bytes": 19
      },
      {
        "path": "vpcegress/agentcore/agentcore.json",
        "lang": "json",
        "bytes": 450
      },
      {
        "path": "vpcegress/agentcore/aws-targets.json",
        "lang": "json",
        "bytes": 2
      },
      {
        "path": "vpcegress/cloudformation/cognito-signup-stack.yaml",
        "lang": "yaml",
        "bytes": 11845
      },
      {
        "path": "vpcegress/openapi-schemas/openapi-eks-api.json",
        "lang": "json",
        "bytes": 2581
      },
      {
        "path": "vpcegress/openapi-schemas/openapi-private-apigw.json",
        "lang": "json",
        "bytes": 2448
      },
      {
        "path": "vpcegress/openapi-schemas/openapi-private.json",
        "lang": "json",
        "bytes": 2448
      },
      {
        "path": "vpcegress/scripts/create_credential.py",
        "lang": "python",
        "bytes": 3816
      },
      {
        "path": "vpcegress/scripts/create_target.py",
        "lang": "python",
        "bytes": 7502
      },
      {
        "path": "vpcegress/scripts/delete_credential.py",
        "lang": "python",
        "bytes": 1380
      },
      {
        "path": "vpcegress/scripts/delete_target.py",
        "lang": "python",
        "bytes": 1760
      }
    ]
  },
  {
    "slug": "01-features/07-centralize-and-govern-your-ai-infrastructure/01-gateway/03-private-connectivity/connect-gateway-to-private-resources/vpcegress/agentcore/.llm-context",
    "title": "LLM Context Files",
    "desc": "DO NOT EDIT THESE FILES - They are read-only reference for AI coding assistants.",
    "sectionId": "gateway",
    "kind": "feature",
    "frameworks": [
      "OpenAI Agents"
    ],
    "languages": [
      "typescript"
    ],
    "hasNotebook": false,
    "readme": "/agentcore-samples/01-features/07-centralize-and-govern-your-ai-infrastructure/01-gateway/03-private-connectivity/connect-gateway-to-private-resources/vpcegress/agentcore/.llm-context/README.md",
    "base": "/agentcore-samples/01-features/07-centralize-and-govern-your-ai-infrastructure/01-gateway/03-private-connectivity/connect-gateway-to-private-resources/vpcegress/agentcore/.llm-context",
    "files": [
      {
        "path": "agentcore.ts",
        "lang": "typescript",
        "bytes": 19614
      },
      {
        "path": "aws-targets.ts",
        "lang": "typescript",
        "bytes": 2039
      }
    ]
  },
  {
    "slug": "01-features/07-centralize-and-govern-your-ai-infrastructure/01-gateway/03-private-connectivity/connect-gateway-to-private-resources/vpcegress/agentcore/cdk",
    "title": "AgentCore CDK Project",
    "desc": "This CDK project is managed by the AgentCore CLI. It deploys your agent infrastructure into AWS using the @aws/agentcore-cdk L3 constructs.",
    "sectionId": "gateway",
    "kind": "feature",
    "frameworks": [],
    "languages": [
      "javascript",
      "typescript"
    ],
    "hasNotebook": false,
    "readme": "/agentcore-samples/01-features/07-centralize-and-govern-your-ai-infrastructure/01-gateway/03-private-connectivity/connect-gateway-to-private-resources/vpcegress/agentcore/cdk/README.md",
    "base": "/agentcore-samples/01-features/07-centralize-and-govern-your-ai-infrastructure/01-gateway/03-private-connectivity/connect-gateway-to-private-resources/vpcegress/agentcore/cdk",
    "files": [
      {
        "path": "bin/cdk.ts",
        "lang": "typescript",
        "bytes": 3166
      },
      {
        "path": "cdk.json",
        "lang": "json",
        "bytes": 5487
      },
      {
        "path": "jest.config.js",
        "lang": "javascript",
        "bytes": 225
      },
      {
        "path": "package.json",
        "lang": "json",
        "bytes": 672
      },
      {
        "path": "test/cdk.test.ts",
        "lang": "typescript",
        "bytes": 785
      },
      {
        "path": "tsconfig.json",
        "lang": "json",
        "bytes": 770
      }
    ]
  },
  {
    "slug": "01-features/07-centralize-and-govern-your-ai-infrastructure/01-gateway/gatewaylabproject",
    "title": "AgentCore Project",
    "desc": "This project was created with the AgentCore CLI.",
    "sectionId": "gateway",
    "kind": "feature",
    "frameworks": [
      "Strands",
      "LangGraph",
      "LangChain",
      "OpenAI Agents"
    ],
    "languages": [
      "python"
    ],
    "hasNotebook": false,
    "readme": "/agentcore-samples/01-features/07-centralize-and-govern-your-ai-infrastructure/01-gateway/gatewaylabproject/README.md",
    "base": "/agentcore-samples/01-features/07-centralize-and-govern-your-ai-infrastructure/01-gateway/gatewaylabproject",
    "files": [
      {
        "path": "agentcore/.cli/deployed-state.json",
        "lang": "json",
        "bytes": 19
      },
      {
        "path": "agentcore/agentcore.json",
        "lang": "json",
        "bytes": 523
      },
      {
        "path": "agentcore/aws-targets.json",
        "lang": "json",
        "bytes": 2
      },
      {
        "path": "agentcore/mcp-defs.json",
        "lang": "json",
        "bytes": 17
      },
      {
        "path": "app/aws_docs_agent/main.py",
        "lang": "python",
        "bytes": 2998
      },
      {
        "path": "app/aws_docs_agent/pyproject.toml",
        "lang": "toml",
        "bytes": 332
      },
      {
        "path": "app/data-masking/employee_data_tool.py",
        "lang": "python",
        "bytes": 6006
      },
      {
        "path": "app/data-masking/interceptor.py",
        "lang": "python",
        "bytes": 13909
      },
      {
        "path": "app/databricks_currency_agent/app.py",
        "lang": "python",
        "bytes": 5038
      },
      {
        "path": "app/databricks_currency_agent/app.yaml",
        "lang": "yaml",
        "bytes": 127
      },
      {
        "path": "app/databricks_currency_agent/requirements.txt",
        "lang": "text",
        "bytes": 153
      },
      {
        "path": "app/fine-grain-access-control/main.py",
        "lang": "python",
        "bytes": 547
      },
      {
        "path": "app/header-query-propagation/main.py",
        "lang": "python",
        "bytes": 486
      },
      {
        "path": "app/labelicitation/main.py",
        "lang": "python",
        "bytes": 8785
      },
      {
        "path": "app/labelicitation/pyproject.toml",
        "lang": "toml",
        "bytes": 306
      },
      {
        "path": "app/labmcp/main.py",
        "lang": "python",
        "bytes": 2379
      },
      {
        "path": "app/labmcp/pyproject.toml",
        "lang": "toml",
        "bytes": 295
      },
      {
        "path": "app/labstateful/main.py",
        "lang": "python",
        "bytes": 16638
      },
      {
        "path": "app/labstateful/pyproject.toml",
        "lang": "toml",
        "bytes": 303
      },
      {
        "path": "app/labstream/main.py",
        "lang": "python",
        "bytes": 2962
      },
      {
        "path": "app/labstream/pyproject.toml",
        "lang": "toml",
        "bytes": 301
      },
      {
        "path": "app/labsync/main.py",
        "lang": "python",
        "bytes": 411
      },
      {
        "path": "app/labsync/main1.py",
        "lang": "python",
        "bytes": 510
      },
      {
        "path": "app/labsync/main2.py",
        "lang": "python",
        "bytes": 609
      },
      {
        "path": "app/labsync/main3.py",
        "lang": "python",
        "bytes": 1464
      },
      {
        "path": "app/labsync/pyproject.toml",
        "lang": "toml",
        "bytes": 296
      },
      {
        "path": "app/monitoring_a2a_agent/agent_executor.py",
        "lang": "python",
        "bytes": 2828
      },
      {
        "path": "app/monitoring_a2a_agent/main.py",
        "lang": "python",
        "bytes": 3092
      },
      {
        "path": "app/monitoring_a2a_agent/prompt.py",
        "lang": "python",
        "bytes": 809
      },
      {
        "path": "app/monitoring_a2a_agent/pyproject.toml",
        "lang": "toml",
        "bytes": 316
      },
      {
        "path": "app/monitoring_a2a_agent/tools.py",
        "lang": "python",
        "bytes": 6058
      },
      {
        "path": "app/semantic-search/calc-api.json",
        "lang": "json",
        "bytes": 59108
      },
      {
        "path": "app/semantic-search/calc_lambda.py",
        "lang": "python",
        "bytes": 1751
      },
      {
        "path": "app/semantic-search/restaurant-api.json",
        "lang": "json",
        "bytes": 1258
      },
      {
        "path": "app/semantic-search/restaurant_lambda.py",
        "lang": "python",
        "bytes": 1060
      },
      {
        "path": "app/token-passthrough/main.py",
        "lang": "python",
        "bytes": 547
      },
      {
        "path": "cloudformation/api-gateway/petstore-api-stack.yaml",
        "lang": "yaml",
        "bytes": 6636
      },
      {
        "path": "cloudformation/cognito/cognito-signup-stack.yaml",
        "lang": "yaml",
        "bytes": 11845
      },
      {
        "path": "cloudformation/data-masking/data-masking-stack.yaml",
        "lang": "yaml",
        "bytes": 6232
      },
      {
        "path": "cloudformation/fine-grain-access-control/fgac-cognito-stack.yaml",
        "lang": "yaml",
        "bytes": 2026
      },
      {
        "path": "cloudformation/fine-grain-access-control/fgac-interceptors-stack.yaml",
        "lang": "yaml",
        "bytes": 10398
      },
      {
        "path": "cloudformation/header-query-propagation/custom-header-query-stack.yaml",
        "lang": "yaml",
        "bytes": 5303
      },
      {
        "path": "cloudformation/header-query-propagation/token-passthrough-stack.yaml",
        "lang": "yaml",
        "bytes": 5201
      },
      {
        "path": "cloudformation/lambda/lambda-sample-stack.yaml",
        "lang": "yaml",
        "bytes": 2323
      },
      {
        "path": "cloudformation/semantic-search/semantic-search-stack.yaml",
        "lang": "yaml",
        "bytes": 3157
      },
      {
        "path": "cloudformation/sql-injection/sql-injection-stack.yaml",
        "lang": "yaml",
        "bytes": 11739
      },
      {
        "path": "env_utils.py",
        "lang": "python",
        "bytes": 1447
      },
      {
        "path": "gateway_admin.py",
        "lang": "python",
        "bytes": 20235
      },
      {
        "path": "gateway_mcp_client.py",
        "lang": "python",
        "bytes": 16093
      },
      {
        "path": "inference_demo.py",
        "lang": "python",
        "bytes": 4856
      },
      {
        "path": "openapi-specs/Zendesk-support-apis.yaml",
        "lang": "yaml",
        "bytes": 1178664
      },
      {
        "path": "openapi-specs/google-calendar-open-api.json",
        "lang": "json",
        "bytes": 42026
      },
      {
        "path": "openapi-specs/nasa_mars_insights_openapi.json",
        "lang": "json",
        "bytes": 4756
      },
      {
        "path": "pyproject.toml",
        "lang": "toml",
        "bytes": 271
      },
      {
        "path": "scripts/a2a-runtime-target/cleanup.py",
        "lang": "python",
        "bytes": 3717
      },
      {
        "path": "scripts/a2a-runtime-target/deploy_credential.py",
        "lang": "python",
        "bytes": 3390
      },
      {
        "path": "scripts/a2a-runtime-target/deploy_gateway.py",
        "lang": "python",
        "bytes": 5187
      },
      {
        "path": "scripts/a2a-runtime-target/deploy_target.py",
        "lang": "python",
        "bytes": 4247
      },
      {
        "path": "scripts/a2a-runtime-target/harden_runtime.py",
        "lang": "python",
        "bytes": 6483
      },
      {
        "path": "scripts/api-gateway/cleanup.py",
        "lang": "python",
        "bytes": 2734
      },
      {
        "path": "scripts/api-gateway/deploy_targets.py",
        "lang": "python",
        "bytes": 8112
      },
      {
        "path": "scripts/api-gateway/invoke.py",
        "lang": "python",
        "bytes": 3887
      },
      {
        "path": "scripts/cleanup_gateway.py",
        "lang": "python",
        "bytes": 3054
      },
      {
        "path": "scripts/client-credentials/invoke.py",
        "lang": "python",
        "bytes": 4082
      },
      {
        "path": "scripts/client-credentials/mcp_invoke.py",
        "lang": "python",
        "bytes": 3612
      },
      {
        "path": "scripts/client-credentials/strands_demo.py",
        "lang": "python",
        "bytes": 2970
      },
      {
        "path": "scripts/context7-passthrough/cleanup.py",
        "lang": "python",
        "bytes": 3312
      },
      {
        "path": "scripts/context7-passthrough/deploy.py",
        "lang": "python",
        "bytes": 4089
      },
      {
        "path": "scripts/context7-passthrough/deploy_gateway.py",
        "lang": "python",
        "bytes": 3885
      },
      {
        "path": "scripts/context7-passthrough/invoke.py",
        "lang": "python",
        "bytes": 4780
      },
      {
        "path": "scripts/data-masking/cleanup.py",
        "lang": "python",
        "bytes": 1980
      },
      {
        "path": "scripts/data-masking/deploy.py",
        "lang": "python",
        "bytes": 4981
      },
      {
        "path": "scripts/data-masking/invoke.py",
        "lang": "python",
        "bytes": 4197
      },
      {
        "path": "scripts/databricks-a2a-target/cleanup.py",
        "lang": "python",
        "bytes": 3733
      },
      {
        "path": "scripts/databricks-a2a-target/deploy_credential.py",
        "lang": "python",
        "bytes": 3904
      },
      {
        "path": "scripts/databricks-a2a-target/deploy_gateway.py",
        "lang": "python",
        "bytes": 5375
      },
      {
        "path": "scripts/databricks-a2a-target/deploy_target.py",
        "lang": "python",
        "bytes": 4200
      },
      {
        "path": "scripts/deploy_gateway.py",
        "lang": "python",
        "bytes": 7581
      },
      {
        "path": "scripts/deploy_target.py",
        "lang": "python",
        "bytes": 4545
      },
      {
        "path": "scripts/fine-grain-access-control/cleanup.py",
        "lang": "python",
        "bytes": 2357
      },
      {
        "path": "scripts/fine-grain-access-control/deploy.py",
        "lang": "python",
        "bytes": 6800
      },
      {
        "path": "scripts/fine-grain-access-control/invoke.py",
        "lang": "python",
        "bytes": 6785
      },
      {
        "path": "scripts/github-auth-code/callback_server.py",
        "lang": "python",
        "bytes": 3459
      },
      {
        "path": "scripts/github-auth-code/cleanup.py",
        "lang": "python",
        "bytes": 2248
      },
      {
        "path": "scripts/github-auth-code/complete_auth.py",
        "lang": "python",
        "bytes": 1632
      },
      {
        "path": "scripts/github-auth-code/deploy_credential.py",
        "lang": "python",
        "bytes": 2694
      },
      {
        "path": "scripts/github-auth-code/deploy_gateway.py",
        "lang": "python",
        "bytes": 3502
      },
      {
        "path": "scripts/github-auth-code/deploy_target_implicit.py",
        "lang": "python",
        "bytes": 4348
      },
      {
        "path": "scripts/github-auth-code/deploy_target_schema.py",
        "lang": "python",
        "bytes": 3318
      },
      {
        "path": "scripts/github-auth-code/github-tools.json",
        "lang": "json",
        "bytes": 2594
      },
      {
        "path": "scripts/github-auth-code/invoke.py",
        "lang": "python",
        "bytes": 4460
      },
      {
        "path": "scripts/github-mcp-passthrough/cleanup.py",
        "lang": "python",
        "bytes": 3314
      },
      {
        "path": "scripts/github-mcp-passthrough/deploy.py",
        "lang": "python",
        "bytes": 4057
      },
      {
        "path": "scripts/github-mcp-passthrough/deploy_gateway.py",
        "lang": "python",
        "bytes": 4062
      },
      {
        "path": "scripts/github-mcp-passthrough/invoke.py",
        "lang": "python",
        "bytes": 4604
      },
      {
        "path": "scripts/header-query-propagation/custom-header-query/cleanup.py",
        "lang": "python",
        "bytes": 2161
      },
      {
        "path": "scripts/header-query-propagation/custom-header-query/deploy.py",
        "lang": "python",
        "bytes": 7540
      },
      {
        "path": "scripts/header-query-propagation/custom-header-query/invoke.py",
        "lang": "python",
        "bytes": 6887
      },
      {
        "path": "scripts/header-query-propagation/token-passthrough/cleanup.py",
        "lang": "python",
        "bytes": 2165
      },
      {
        "path": "scripts/header-query-propagation/token-passthrough/deploy.py",
        "lang": "python",
        "bytes": 8041
      },
      {
        "path": "scripts/header-query-propagation/token-passthrough/invoke.py",
        "lang": "python",
        "bytes": 5529
      },
      {
        "path": "scripts/http-runtime-target/agent-schema.yaml",
        "lang": "yaml",
        "bytes": 1991
      },
      {
        "path": "scripts/http-runtime-target/cleanup.py",
        "lang": "python",
        "bytes": 3720
      },
      {
        "path": "scripts/http-runtime-target/deploy_credential.py",
        "lang": "python",
        "bytes": 3394
      },
      {
        "path": "scripts/http-runtime-target/deploy_gateway.py",
        "lang": "python",
        "bytes": 5187
      },
      {
        "path": "scripts/http-runtime-target/deploy_target.py",
        "lang": "python",
        "bytes": 5011
      },
      {
        "path": "scripts/inference-iam-inbound/cleanup.py",
        "lang": "python",
        "bytes": 1855
      },
      {
        "path": "scripts/inference-iam-inbound/deploy.py",
        "lang": "python",
        "bytes": 4610
      },
      {
        "path": "scripts/lambda-iam/invoke.py",
        "lang": "python",
        "bytes": 3459
      },
      {
        "path": "scripts/lambda-oauth/invoke.py",
        "lang": "python",
        "bytes": 3432
      },
      {
        "path": "scripts/lambda-oauth/mcp-invoke.py",
        "lang": "python",
        "bytes": 4231
      },
      {
        "path": "scripts/lambda-oauth/strands_demo.py",
        "lang": "python",
        "bytes": 3097
      },
      {
        "path": "scripts/linkedin-auth-code/callback_server.py",
        "lang": "python",
        "bytes": 3459
      },
      {
        "path": "scripts/linkedin-auth-code/cleanup.py",
        "lang": "python",
        "bytes": 2254
      },
      {
        "path": "scripts/linkedin-auth-code/deploy_credential.py",
        "lang": "python",
        "bytes": 2590
      },
      {
        "path": "scripts/linkedin-auth-code/deploy_gateway.py",
        "lang": "python",
        "bytes": 3504
      },
      {
        "path": "scripts/linkedin-auth-code/deploy_target.py",
        "lang": "python",
        "bytes": 4515
      },
      {
        "path": "scripts/linkedin-auth-code/invoke.py",
        "lang": "python",
        "bytes": 3863
      },
      {
        "path": "scripts/managed-agents-custom/cleanup.py",
        "lang": "python",
        "bytes": 3410
      },
      {
        "path": "scripts/managed-agents-custom/deploy.py",
        "lang": "python",
        "bytes": 4530
      },
      {
        "path": "scripts/managed-agents-custom/deploy_gateway.py",
        "lang": "python",
        "bytes": 5346
      },
      {
        "path": "scripts/managed-agents-custom/invoke.py",
        "lang": "python",
        "bytes": 4921
      },
      {
        "path": "scripts/managed-agents-custom/managed-agents-schema.yaml",
        "lang": "yaml",
        "bytes": 3897
      },
      {
        "path": "scripts/managed-agents-custom/sdk_demo.py",
        "lang": "python",
        "bytes": 3985
      },
      {
        "path": "scripts/model-governance/cleanup.py",
        "lang": "python",
        "bytes": 1922
      },
      {
        "path": "scripts/model-governance/deploy.py",
        "lang": "python",
        "bytes": 8493
      },
      {
        "path": "scripts/model-governance/invoke.py",
        "lang": "python",
        "bytes": 4455
      },
      {
        "path": "scripts/obo-token-exchange/cleanup.py",
        "lang": "python",
        "bytes": 1628
      },
      {
        "path": "scripts/obo-token-exchange/compare_tokens.py",
        "lang": "python",
        "bytes": 5310
      },
      {
        "path": "scripts/obo-token-exchange/deploy.py",
        "lang": "python",
        "bytes": 9996
      },
      {
        "path": "scripts/obo-token-exchange/invoke.py",
        "lang": "python",
        "bytes": 4604
      },
      {
        "path": "scripts/obo-token-exchange/token_callback_server.py",
        "lang": "python",
        "bytes": 6702
      },
      {
        "path": "scripts/observability/deploy.py",
        "lang": "python",
        "bytes": 5071
      },
      {
        "path": "scripts/observability/invoke.py",
        "lang": "python",
        "bytes": 3556
      },
      {
        "path": "scripts/openapi-apikey/cleanup.py",
        "lang": "python",
        "bytes": 3095
      },
      {
        "path": "scripts/openapi-apikey/deploy_target.py",
        "lang": "python",
        "bytes": 5480
      },
      {
        "path": "scripts/openapi-apikey/invoke.py",
        "lang": "python",
        "bytes": 3413
      },
      {
        "path": "scripts/openapi-apikey/mcp_invoke.py",
        "lang": "python",
        "bytes": 3810
      },
      {
        "path": "scripts/openapi-apikey/strands_demo.py",
        "lang": "python",
        "bytes": 3043
      },
      {
        "path": "scripts/openapi-oauth/cleanup.py",
        "lang": "python",
        "bytes": 2808
      },
      {
        "path": "scripts/openapi-oauth/deploy_target.py",
        "lang": "python",
        "bytes": 6544
      },
      {
        "path": "scripts/openapi-oauth/invoke.py",
        "lang": "python",
        "bytes": 3039
      },
      {
        "path": "scripts/prevent-sql-injection/cleanup.py",
        "lang": "python",
        "bytes": 2547
      },
      {
        "path": "scripts/prevent-sql-injection/deploy.py",
        "lang": "python",
        "bytes": 7553
      },
      {
        "path": "scripts/prevent-sql-injection/invoke.py",
        "lang": "python",
        "bytes": 6196
      },
      {
        "path": "scripts/runtime-mcp-passthrough/cleanup.py",
        "lang": "python",
        "bytes": 3385
      },
      {
        "path": "scripts/runtime-mcp-passthrough/deploy.py",
        "lang": "python",
        "bytes": 4821
      },
      {
        "path": "scripts/runtime-mcp-passthrough/deploy_gateway.py",
        "lang": "python",
        "bytes": 4072
      },
      {
        "path": "scripts/runtime-mcp-passthrough/invoke.py",
        "lang": "python",
        "bytes": 4752
      },
      {
        "path": "scripts/semantic-search/cleanup.py",
        "lang": "python",
        "bytes": 2257
      },
      {
        "path": "scripts/semantic-search/deploy.py",
        "lang": "python",
        "bytes": 14423
      },
      {
        "path": "scripts/semantic-search/invoke.py",
        "lang": "python",
        "bytes": 5436
      },
      {
        "path": "scripts/semantic-search/strands_demo.py",
        "lang": "python",
        "bytes": 4915
      },
      {
        "path": "scripts/sessions/demo.py",
        "lang": "python",
        "bytes": 7536
      },
      {
        "path": "scripts/smithy-iam/cleanup.py",
        "lang": "python",
        "bytes": 1457
      },
      {
        "path": "scripts/smithy-iam/grant_s3_permissions.py",
        "lang": "python",
        "bytes": 1923
      },
      {
        "path": "scripts/smithy-iam/invoke.py",
        "lang": "python",
        "bytes": 2896
      },
      {
        "path": "scripts/smithy-iam/strands_demo.py",
        "lang": "python",
        "bytes": 3037
      },
      {
        "path": "scripts/streaming/demo.py",
        "lang": "python",
        "bytes": 7192
      },
      {
        "path": "scripts/sync/demo.py",
        "lang": "python",
        "bytes": 4790
      },
      {
        "path": "scripts/unified-multi-provider/cleanup.py",
        "lang": "python",
        "bytes": 2189
      },
      {
        "path": "scripts/unified-multi-provider/deploy.py",
        "lang": "python",
        "bytes": 6426
      },
      {
        "path": "scripts/unified-multi-provider/invoke.py",
        "lang": "python",
        "bytes": 5699
      },
      {
        "path": "scripts/unified-multi-provider/invoke_direct.py",
        "lang": "python",
        "bytes": 2548
      },
      {
        "path": "scripts/unified-multi-provider/invoke_litellm.py",
        "lang": "python",
        "bytes": 4037
      },
      {
        "path": "scripts/unified-multi-provider/invoke_litellm_streaming.py",
        "lang": "python",
        "bytes": 3118
      },
      {
        "path": "scripts/unified-multi-provider/invoke_native_sdk.py",
        "lang": "python",
        "bytes": 2400
      },
      {
        "path": "scripts/unified-multi-provider/invoke_streaming.py",
        "lang": "python",
        "bytes": 3252
      },
      {
        "path": "scripts/waf/cleanup.py",
        "lang": "python",
        "bytes": 3624
      },
      {
        "path": "scripts/waf/deploy.py",
        "lang": "python",
        "bytes": 6918
      },
      {
        "path": "scripts/waf/invoke.py",
        "lang": "python",
        "bytes": 4276
      },
      {
        "path": "scripts/websearch/cleanup.py",
        "lang": "python",
        "bytes": 1687
      },
      {
        "path": "scripts/websearch/deploy.py",
        "lang": "python",
        "bytes": 3089
      },
      {
        "path": "scripts/websearch/invoke.py",
        "lang": "python",
        "bytes": 4501
      },
      {
        "path": "scripts/websearch/set_domain_filter.py",
        "lang": "python",
        "bytes": 3022
      },
      {
        "path": "scripts/websearch/strands_demo.py",
        "lang": "python",
        "bytes": 3633
      },
      {
        "path": "smithy-specs/s3-apis.json",
        "lang": "json",
        "bytes": 1981559
      },
      {
        "path": "streamable_http_sigv4.py",
        "lang": "python",
        "bytes": 5011
      },
      {
        "path": "tool-schemas/lambda-order-tools.json",
        "lang": "json",
        "bytes": 447
      }
    ]
  },
  {
    "slug": "01-features/07-centralize-and-govern-your-ai-infrastructure/01-gateway/gatewaylabproject/agentcore/.llm-context",
    "title": "LLM Context Files",
    "desc": "DO NOT EDIT THESE FILES - They are read-only reference for AI coding assistants.",
    "sectionId": "gateway",
    "kind": "feature",
    "frameworks": [
      "OpenAI Agents"
    ],
    "languages": [
      "typescript"
    ],
    "hasNotebook": false,
    "readme": "/agentcore-samples/01-features/07-centralize-and-govern-your-ai-infrastructure/01-gateway/gatewaylabproject/agentcore/.llm-context/README.md",
    "base": "/agentcore-samples/01-features/07-centralize-and-govern-your-ai-infrastructure/01-gateway/gatewaylabproject/agentcore/.llm-context",
    "files": [
      {
        "path": "agentcore.ts",
        "lang": "typescript",
        "bytes": 19614
      },
      {
        "path": "aws-targets.ts",
        "lang": "typescript",
        "bytes": 2039
      }
    ]
  },
  {
    "slug": "01-features/07-centralize-and-govern-your-ai-infrastructure/01-gateway/gatewaylabproject/agentcore/cdk",
    "title": "AgentCore CDK Project",
    "desc": "This CDK project is managed by the AgentCore CLI. It deploys your agent infrastructure into AWS using the @aws/agentcore-cdk L3 constructs.",
    "sectionId": "gateway",
    "kind": "feature",
    "frameworks": [],
    "languages": [
      "javascript",
      "typescript"
    ],
    "hasNotebook": false,
    "readme": "/agentcore-samples/01-features/07-centralize-and-govern-your-ai-infrastructure/01-gateway/gatewaylabproject/agentcore/cdk/README.md",
    "base": "/agentcore-samples/01-features/07-centralize-and-govern-your-ai-infrastructure/01-gateway/gatewaylabproject/agentcore/cdk",
    "files": [
      {
        "path": "bin/cdk.ts",
        "lang": "typescript",
        "bytes": 3166
      },
      {
        "path": "cdk.json",
        "lang": "json",
        "bytes": 5487
      },
      {
        "path": "jest.config.js",
        "lang": "javascript",
        "bytes": 225
      },
      {
        "path": "package.json",
        "lang": "json",
        "bytes": 672
      },
      {
        "path": "test/cdk.test.ts",
        "lang": "typescript",
        "bytes": 785
      },
      {
        "path": "tsconfig.json",
        "lang": "json",
        "bytes": 770
      }
    ]
  },
  {
    "slug": "01-features/07-centralize-and-govern-your-ai-infrastructure/01-gateway/gatewaylabproject/app/labsession",
    "title": "lab1",
    "desc": "An MCP (Model Context Protocol) server deployed on Amazon Bedrock AgentCore.",
    "sectionId": "gateway",
    "kind": "feature",
    "frameworks": [],
    "languages": [
      "python"
    ],
    "hasNotebook": false,
    "readme": "/agentcore-samples/01-features/07-centralize-and-govern-your-ai-infrastructure/01-gateway/gatewaylabproject/app/labsession/README.md",
    "base": "/agentcore-samples/01-features/07-centralize-and-govern-your-ai-infrastructure/01-gateway/gatewaylabproject/app/labsession",
    "files": [
      {
        "path": "main.py",
        "lang": "python",
        "bytes": 2043
      },
      {
        "path": "pyproject.toml",
        "lang": "toml",
        "bytes": 302
      }
    ]
  },
  {
    "slug": "01-features/07-centralize-and-govern-your-ai-infrastructure/02-policy",
    "title": "Policy in Amazon Bedrock AgentCore — Fine-Grained Access Control",
    "desc": "Enforce Cedar policies on AI agent-to-tool interactions through an AgentCore MCP gateway. Covers NL2Cedar (natural language → Cedar) and hand-authored attribute-based access control (ABAC) using...",
    "sectionId": "identity",
    "kind": "feature",
    "frameworks": [
      "Strands"
    ],
    "languages": [
      "javascript",
      "python"
    ],
    "hasNotebook": false,
    "readme": "/agentcore-samples/01-features/07-centralize-and-govern-your-ai-infrastructure/02-policy/README.md",
    "base": "/agentcore-samples/01-features/07-centralize-and-govern-your-ai-infrastructure/02-policy",
    "files": [
      {
        "path": "cleanup.py",
        "lang": "python",
        "bytes": 7018
      },
      {
        "path": "deploy.py",
        "lang": "python",
        "bytes": 21301
      },
      {
        "path": "policy_demo.py",
        "lang": "python",
        "bytes": 35257
      },
      {
        "path": "requirements.txt",
        "lang": "text",
        "bytes": 439
      },
      {
        "path": "utils/agent_with_tools.py",
        "lang": "python",
        "bytes": 5253
      },
      {
        "path": "utils/application_tool.js",
        "lang": "javascript",
        "bytes": 2264
      },
      {
        "path": "utils/approval_tool.js",
        "lang": "javascript",
        "bytes": 2232
      },
      {
        "path": "utils/risk_model_tool.js",
        "lang": "javascript",
        "bytes": 2425
      }
    ]
  },
  {
    "slug": "01-features/07-centralize-and-govern-your-ai-infrastructure/02-policy/01-tool-access-with-policy",
    "title": "Policy in Amazon Bedrock AgentCore — Fine-Grained Access Control",
    "desc": "Enforce Cedar policies on AI agent-to-tool interactions through an AgentCore MCP gateway. Covers NL2Cedar (natural language → Cedar) and hand-authored attribute-based access control (ABAC) using...",
    "sectionId": "identity",
    "kind": "feature",
    "frameworks": [
      "Strands"
    ],
    "languages": [
      "javascript",
      "python"
    ],
    "hasNotebook": false,
    "readme": "/agentcore-samples/01-features/07-centralize-and-govern-your-ai-infrastructure/02-policy/01-tool-access-with-policy/README.md",
    "base": "/agentcore-samples/01-features/07-centralize-and-govern-your-ai-infrastructure/02-policy/01-tool-access-with-policy",
    "files": [
      {
        "path": "cleanup.py",
        "lang": "python",
        "bytes": 7036
      },
      {
        "path": "deploy.py",
        "lang": "python",
        "bytes": 21409
      },
      {
        "path": "policy_demo.py",
        "lang": "python",
        "bytes": 35329
      },
      {
        "path": "requirements.txt",
        "lang": "text",
        "bytes": 439
      },
      {
        "path": "utils/agent_with_tools.py",
        "lang": "python",
        "bytes": 5253
      },
      {
        "path": "utils/application_tool.js",
        "lang": "javascript",
        "bytes": 2264
      },
      {
        "path": "utils/approval_tool.js",
        "lang": "javascript",
        "bytes": 2232
      },
      {
        "path": "utils/risk_model_tool.js",
        "lang": "javascript",
        "bytes": 2425
      }
    ]
  },
  {
    "slug": "01-features/07-centralize-and-govern-your-ai-infrastructure/02-policy/02-guardrails-in-policy",
    "title": "Policy in Amazon Bedrock AgentCore: Guardrails in Policies",
    "desc": "Guardrails in policies lets you attach Bedrock Guardrails content-safety classifiers directly to an AgentCore gateway as policy rules. No separate Bedrock Guardrail resource is needed. When an...",
    "sectionId": "identity",
    "kind": "feature",
    "frameworks": [
      "Strands"
    ],
    "languages": [
      "javascript",
      "python"
    ],
    "hasNotebook": false,
    "readme": "/agentcore-samples/01-features/07-centralize-and-govern-your-ai-infrastructure/02-policy/02-guardrails-in-policy/README.md",
    "base": "/agentcore-samples/01-features/07-centralize-and-govern-your-ai-infrastructure/02-policy/02-guardrails-in-policy",
    "files": [
      {
        "path": "cleanup.py",
        "lang": "python",
        "bytes": 6518
      },
      {
        "path": "deploy.py",
        "lang": "python",
        "bytes": 26164
      },
      {
        "path": "guardrail_demo.py",
        "lang": "python",
        "bytes": 11612
      },
      {
        "path": "requirements.txt",
        "lang": "text",
        "bytes": 207
      },
      {
        "path": "utils/agent_with_tools.py",
        "lang": "python",
        "bytes": 5658
      },
      {
        "path": "utils/application_tool.js",
        "lang": "javascript",
        "bytes": 1355
      },
      {
        "path": "utils/approval_tool.js",
        "lang": "javascript",
        "bytes": 972
      },
      {
        "path": "utils/risk_model_tool.js",
        "lang": "javascript",
        "bytes": 1142
      }
    ]
  },
  {
    "slug": "01-features/07-centralize-and-govern-your-ai-infrastructure/03-registry/01-registry-end-to-end",
    "title": "Zero to registry in 10 Minutes — Admin Setup & IAM Governance Guide",
    "desc": "When organizations adopt AI agents at scale — MCP tool servers, A2A agents, and custom skills across dozens of teams — they need a centralized, governed registry to prevent unvetted agents from...",
    "sectionId": "identity",
    "kind": "feature",
    "frameworks": [],
    "languages": [
      "python"
    ],
    "hasNotebook": false,
    "readme": "/agentcore-samples/01-features/07-centralize-and-govern-your-ai-infrastructure/03-registry/01-registry-end-to-end/README.md",
    "base": "/agentcore-samples/01-features/07-centralize-and-govern-your-ai-infrastructure/03-registry/01-registry-end-to-end",
    "files": [
      {
        "path": "getting_started_registry_end_to_end.py",
        "lang": "python",
        "bytes": 20565
      }
    ]
  },
  {
    "slug": "01-features/07-centralize-and-govern-your-ai-infrastructure/03-registry/02-registry-end-to-end-oauth",
    "title": "AWS Agent registry with OAuth Authentication",
    "desc": "AWS Agent registry is a fully managed discovery service that provides a centralized catalog for organizing, curating, and discovering AI agents, MCP servers, agent skills, and custom resources...",
    "sectionId": "identity",
    "kind": "feature",
    "frameworks": [],
    "languages": [
      "python"
    ],
    "hasNotebook": false,
    "readme": "/agentcore-samples/01-features/07-centralize-and-govern-your-ai-infrastructure/03-registry/02-registry-end-to-end-oauth/README.md",
    "base": "/agentcore-samples/01-features/07-centralize-and-govern-your-ai-infrastructure/03-registry/02-registry-end-to-end-oauth",
    "files": [
      {
        "path": "registry_end_to_end_oauth.py",
        "lang": "python",
        "bytes": 16688
      },
      {
        "path": "requirements.txt",
        "lang": "text",
        "bytes": 51
      }
    ]
  },
  {
    "slug": "01-features/07-centralize-and-govern-your-ai-infrastructure/03-registry/03-advanced/admin-approval-workflow",
    "title": "Admin CI/CD and Approval Workflow for AWS Agent registry",
    "desc": "Enterprise AI agent platforms require governance controls to ensure that only vetted, secure agents and tools are deployed into production. When multiple teams publish A2A Agents, MCP servers, and...",
    "sectionId": "identity",
    "kind": "feature",
    "frameworks": [],
    "languages": [
      "python"
    ],
    "hasNotebook": false,
    "readme": "/agentcore-samples/01-features/07-centralize-and-govern-your-ai-infrastructure/03-registry/03-advanced/admin-approval-workflow/README.md",
    "base": "/agentcore-samples/01-features/07-centralize-and-govern-your-ai-infrastructure/03-registry/03-advanced/admin-approval-workflow",
    "files": [
      {
        "path": "IAM_PERMISSIONS.md",
        "lang": "markdown",
        "bytes": 9072
      },
      {
        "path": "admin_approval_workflow.py",
        "lang": "python",
        "bytes": 13435
      },
      {
        "path": "cfn_eventbridge.yaml",
        "lang": "yaml",
        "bytes": 23667
      },
      {
        "path": "deploy.sh",
        "lang": "bash",
        "bytes": 6092
      },
      {
        "path": "destroy.sh",
        "lang": "bash",
        "bytes": 1824
      },
      {
        "path": "requirements.txt",
        "lang": "text",
        "bytes": 6
      },
      {
        "path": "utils.py",
        "lang": "python",
        "bytes": 1475
      }
    ]
  },
  {
    "slug": "01-features/07-centralize-and-govern-your-ai-infrastructure/03-registry/03-advanced/consumer-discovery-semantic-search",
    "title": "Consumer Discovery: Semantic Search",
    "desc": "Demonstrates the consumer role in AWS Agent registry — discovering tools and agents via semantic search, filtered search, and detailed descriptor inspection.",
    "sectionId": "identity",
    "kind": "feature",
    "frameworks": [],
    "languages": [
      "python"
    ],
    "hasNotebook": false,
    "readme": "/agentcore-samples/01-features/07-centralize-and-govern-your-ai-infrastructure/03-registry/03-advanced/consumer-discovery-semantic-search/README.md",
    "base": "/agentcore-samples/01-features/07-centralize-and-govern-your-ai-infrastructure/03-registry/03-advanced/consumer-discovery-semantic-search",
    "files": [
      {
        "path": "consumer_discovery_semantic_search.py",
        "lang": "python",
        "bytes": 12175
      },
      {
        "path": "registry-records.json",
        "lang": "json",
        "bytes": 21940
      }
    ]
  },
  {
    "slug": "01-features/07-centralize-and-govern-your-ai-infrastructure/03-registry/03-advanced/discovery-and-invocation-at-runtime",
    "title": "Discovering Tools and Agents at runtime Using AWS Agent registry",
    "desc": "This tutorial demonstrates an autonomous agent that discovers tools and agents at runtime via AWS Agent registry semantic search and invokes them dynamically — zero hardcoded integrations.",
    "sectionId": "identity",
    "kind": "feature",
    "frameworks": [
      "Strands"
    ],
    "languages": [
      "python"
    ],
    "hasNotebook": false,
    "readme": "/agentcore-samples/01-features/07-centralize-and-govern-your-ai-infrastructure/03-registry/03-advanced/discovery-and-invocation-at-runtime/README.md",
    "base": "/agentcore-samples/01-features/07-centralize-and-govern-your-ai-infrastructure/03-registry/03-advanced/discovery-and-invocation-at-runtime",
    "files": [
      {
        "path": "a2a_requirements.txt",
        "lang": "text",
        "bytes": 36
      },
      {
        "path": "cleanup.py",
        "lang": "python",
        "bytes": 7045
      },
      {
        "path": "customer_support_agent.py",
        "lang": "python",
        "bytes": 1712
      },
      {
        "path": "discovery_and_invocation_at_runtime.py",
        "lang": "python",
        "bytes": 26749
      },
      {
        "path": "orchestrator_agent.py",
        "lang": "python",
        "bytes": 4604
      },
      {
        "path": "orchestrator_requirements.txt",
        "lang": "text",
        "bytes": 49
      },
      {
        "path": "pricing_agent.py",
        "lang": "python",
        "bytes": 1562
      },
      {
        "path": "utils.py",
        "lang": "python",
        "bytes": 17186
      }
    ]
  },
  {
    "slug": "01-features/07-centralize-and-govern-your-ai-infrastructure/03-registry/03-advanced/kiro-registry-dcr-auth0",
    "title": "Calling registry as an MCP Tool from Kiro",
    "desc": "Discover agentic capabilities from the AWS Agent registry across your organization directly from your Kiro IDE, without writing a single line of code.",
    "sectionId": "identity",
    "kind": "feature",
    "frameworks": [],
    "languages": [
      "python"
    ],
    "hasNotebook": false,
    "readme": "/agentcore-samples/01-features/07-centralize-and-govern-your-ai-infrastructure/03-registry/03-advanced/kiro-registry-dcr-auth0/README.md",
    "base": "/agentcore-samples/01-features/07-centralize-and-govern-your-ai-infrastructure/03-registry/03-advanced/kiro-registry-dcr-auth0",
    "files": [
      {
        "path": "dcr_registry_search_mcp_in_kiro.py",
        "lang": "python",
        "bytes": 5694
      },
      {
        "path": "seed_records.py",
        "lang": "python",
        "bytes": 10333
      }
    ]
  },
  {
    "slug": "01-features/07-centralize-and-govern-your-ai-infrastructure/03-registry/03-advanced/publish-agentcore-tools-in-registry",
    "title": "Publishing AgentCore Tools in AWS Agent registry",
    "desc": "When organizations operate dozens or hundreds of AI agents, MCP servers, and tools, keeping track of what exists, who owns it, and whether it's approved for use becomes a real problem. Teams end...",
    "sectionId": "identity",
    "kind": "feature",
    "frameworks": [
      "Strands"
    ],
    "languages": [
      "python"
    ],
    "hasNotebook": false,
    "readme": "/agentcore-samples/01-features/07-centralize-and-govern-your-ai-infrastructure/03-registry/03-advanced/publish-agentcore-tools-in-registry/README.md",
    "base": "/agentcore-samples/01-features/07-centralize-and-govern-your-ai-infrastructure/03-registry/03-advanced/publish-agentcore-tools-in-registry",
    "files": [
      {
        "path": "agents/a2a/a2a_order_agent.py",
        "lang": "python",
        "bytes": 2990
      },
      {
        "path": "agents/a2a/requirements.txt",
        "lang": "text",
        "bytes": 135
      },
      {
        "path": "agents/mcp/mcp_order_server.py",
        "lang": "python",
        "bytes": 2405
      },
      {
        "path": "agents/mcp/requirements.txt",
        "lang": "text",
        "bytes": 88
      },
      {
        "path": "publish_agentcore_a2a_mcp_in_registry.py",
        "lang": "python",
        "bytes": 24051
      },
      {
        "path": "requirements.txt",
        "lang": "text",
        "bytes": 141
      }
    ]
  },
  {
    "slug": "01-features/07-centralize-and-govern-your-ai-infrastructure/03-registry/03-advanced/registry-push-sync-lambda",
    "title": "Synchronizing Metadata with the AWS Agent registry",
    "desc": "There are two ways to keep MCP and A2A server metadata in sync with the AWS Agent registry: pull-based and push-based.",
    "sectionId": "identity",
    "kind": "feature",
    "frameworks": [],
    "languages": [
      "python"
    ],
    "hasNotebook": false,
    "readme": "/agentcore-samples/01-features/07-centralize-and-govern-your-ai-infrastructure/03-registry/03-advanced/registry-push-sync-lambda/README.md",
    "base": "/agentcore-samples/01-features/07-centralize-and-govern-your-ai-infrastructure/03-registry/03-advanced/registry-push-sync-lambda",
    "files": [
      {
        "path": "deploy_lambda_push_sync.py",
        "lang": "python",
        "bytes": 22742
      },
      {
        "path": "handler.py",
        "lang": "python",
        "bytes": 15098
      },
      {
        "path": "requirements.txt",
        "lang": "text",
        "bytes": 50
      }
    ]
  },
  {
    "slug": "01-features/07-centralize-and-govern-your-ai-infrastructure/03-registry/03-advanced/registry-skills-dynamic-discovery",
    "title": "Publishing and Discovering Agent Skills with AWS Agent registry",
    "desc": "AWS Agent registry is a fully managed discovery service that provides a centralized catalog for organizing, curating, and discovering AI agents, MCP servers, agent skills, and custom resources...",
    "sectionId": "identity",
    "kind": "feature",
    "frameworks": [
      "Strands"
    ],
    "languages": [
      "python"
    ],
    "hasNotebook": false,
    "readme": "/agentcore-samples/01-features/07-centralize-and-govern-your-ai-infrastructure/03-registry/03-advanced/registry-skills-dynamic-discovery/README.md",
    "base": "/agentcore-samples/01-features/07-centralize-and-govern-your-ai-infrastructure/03-registry/03-advanced/registry-skills-dynamic-discovery",
    "files": [
      {
        "path": "registry_skills_dynamic_discovery.py",
        "lang": "python",
        "bytes": 11455
      },
      {
        "path": "requirements.txt",
        "lang": "text",
        "bytes": 87
      },
      {
        "path": "skill_registry/pdf_SKILL.md",
        "lang": "markdown",
        "bytes": 8072
      },
      {
        "path": "skills/pdf/LICENSE.txt",
        "lang": "text",
        "bytes": 1467
      },
      {
        "path": "skills/pdf/SKILL.md",
        "lang": "markdown",
        "bytes": 8072
      },
      {
        "path": "skills/pdf/forms.md",
        "lang": "markdown",
        "bytes": 11854
      },
      {
        "path": "skills/pdf/reference.md",
        "lang": "markdown",
        "bytes": 16692
      },
      {
        "path": "skills/pdf/scripts/check_bounding_boxes.py",
        "lang": "python",
        "bytes": 2911
      },
      {
        "path": "skills/pdf/scripts/check_fillable_fields.py",
        "lang": "python",
        "bytes": 264
      },
      {
        "path": "skills/pdf/scripts/convert_pdf_to_images.py",
        "lang": "python",
        "bytes": 1002
      },
      {
        "path": "skills/pdf/scripts/create_validation_image.py",
        "lang": "python",
        "bytes": 1262
      },
      {
        "path": "skills/pdf/scripts/extract_form_field_info.py",
        "lang": "python",
        "bytes": 4433
      },
      {
        "path": "skills/pdf/scripts/extract_form_structure.py",
        "lang": "python",
        "bytes": 4256
      },
      {
        "path": "skills/pdf/scripts/fill_fillable_fields.py",
        "lang": "python",
        "bytes": 3868
      },
      {
        "path": "skills/pdf/scripts/fill_pdf_form_with_annotations.py",
        "lang": "python",
        "bytes": 3158
      },
      {
        "path": "utils/python_exec_tool.py",
        "lang": "python",
        "bytes": 2632
      },
      {
        "path": "utils/skill_loader.py",
        "lang": "python",
        "bytes": 7104
      }
    ]
  },
  {
    "slug": "01-features/07-centralize-and-govern-your-ai-infrastructure/03-registry/03-advanced/registry-synchronize-mcpserver",
    "title": "Synchronize MCP Server Metadata to AWS Agent registry",
    "desc": "This tutorial demonstrates how to use AWS Agent registry's URL-based synchronization to automatically extract and register MCP server metadata (server schema, tools, descriptions, and versions)...",
    "sectionId": "identity",
    "kind": "feature",
    "frameworks": [],
    "languages": [
      "python"
    ],
    "hasNotebook": false,
    "readme": "/agentcore-samples/01-features/07-centralize-and-govern-your-ai-infrastructure/03-registry/03-advanced/registry-synchronize-mcpserver/README.md",
    "base": "/agentcore-samples/01-features/07-centralize-and-govern-your-ai-infrastructure/03-registry/03-advanced/registry-synchronize-mcpserver",
    "files": [
      {
        "path": "registry_synchronize_mcpserver.py",
        "lang": "python",
        "bytes": 23884
      },
      {
        "path": "requirements.txt",
        "lang": "text",
        "bytes": 113
      }
    ]
  },
  {
    "slug": "01-features/08-agents-that-transact/00-getting-started",
    "title": "AgentCore payments — Getting Started Tutorials",
    "desc": "Step-by-step Python tutorials for building payment-enabled AI agents with Amazon Bedrock AgentCore payments — x402 protocol orchestration, configurable spend limits, and third-party wallet...",
    "sectionId": "payments",
    "kind": "feature",
    "frameworks": [
      "Strands",
      "LangGraph"
    ],
    "languages": [
      "python"
    ],
    "hasNotebook": false,
    "readme": "/agentcore-samples/01-features/08-agents-that-transact/00-getting-started/README.md",
    "base": "/agentcore-samples/01-features/08-agents-that-transact/00-getting-started",
    "files": [
      {
        "path": "utils.py",
        "lang": "python",
        "bytes": 43014
      }
    ]
  },
  {
    "slug": "01-features/08-agents-that-transact/00-getting-started/00-setup-agentcore-payments",
    "title": "Tutorial 00 — Set Up AgentCore payments",
    "desc": "This is the one-time setup that Tutorials 01–07 build on. You provision one PaymentManager, one PaymentConnector (Coinbase CDP or Stripe/Privy), a PaymentCredentialProvider, and the runtime...",
    "sectionId": "payments",
    "kind": "feature",
    "frameworks": [
      "Strands"
    ],
    "languages": [
      "python"
    ],
    "hasNotebook": false,
    "readme": "/agentcore-samples/01-features/08-agents-that-transact/00-getting-started/00-setup-agentcore-payments/README.md",
    "base": "/agentcore-samples/01-features/08-agents-that-transact/00-getting-started/00-setup-agentcore-payments",
    "files": [
      {
        "path": "multi_provider_setup.py",
        "lang": "python",
        "bytes": 9410
      },
      {
        "path": "requirements.txt",
        "lang": "text",
        "bytes": 117
      },
      {
        "path": "setup_agentcore_payments.py",
        "lang": "python",
        "bytes": 25499
      }
    ]
  },
  {
    "slug": "01-features/08-agents-that-transact/00-getting-started/00-setup-agentcore-payments/providers",
    "title": "Wallet Provider Setup",
    "desc": "Before running Tutorial 00, choose a wallet provider and run its setup script to save credentials to .env.",
    "sectionId": "payments",
    "kind": "feature",
    "frameworks": [],
    "languages": [
      "python"
    ],
    "hasNotebook": false,
    "readme": "/agentcore-samples/01-features/08-agents-that-transact/00-getting-started/00-setup-agentcore-payments/providers/README.md",
    "base": "/agentcore-samples/01-features/08-agents-that-transact/00-getting-started/00-setup-agentcore-payments/providers",
    "files": [
      {
        "path": "coinbase_cdp_account_setup.py",
        "lang": "python",
        "bytes": 7837
      },
      {
        "path": "requirements.txt",
        "lang": "text",
        "bytes": 117
      },
      {
        "path": "stripe_privy_account_setup.py",
        "lang": "python",
        "bytes": 11256
      }
    ]
  },
  {
    "slug": "01-features/08-agents-that-transact/00-getting-started/01-agents-payments-and-limits",
    "title": "Tutorial 01 — Agents, Payments, and Limits",
    "desc": "The shared payment stack — payment manager, connector, IAM roles, and a funded wallet (instrument) — is already provisioned from Tutorial 00. Here your agent code uses the AgentCore SDK to open a...",
    "sectionId": "payments",
    "kind": "feature",
    "frameworks": [
      "Strands",
      "LangGraph",
      "LangChain"
    ],
    "languages": [
      "python"
    ],
    "hasNotebook": false,
    "readme": "/agentcore-samples/01-features/08-agents-that-transact/00-getting-started/01-agents-payments-and-limits/README.md",
    "base": "/agentcore-samples/01-features/08-agents-that-transact/00-getting-started/01-agents-payments-and-limits",
    "files": [
      {
        "path": "langgraph_payment_agent.py",
        "lang": "python",
        "bytes": 8147
      },
      {
        "path": "requirements.txt",
        "lang": "text",
        "bytes": 495
      },
      {
        "path": "strands_payment_agent.py",
        "lang": "python",
        "bytes": 9128
      }
    ]
  },
  {
    "slug": "01-features/08-agents-that-transact/00-getting-started/02-deploy-to-agentcore-runtime",
    "title": "Tutorial 02 — Deploy a Payment Agent to AgentCore Runtime",
    "desc": "Tutorial 01 ran a payment-enabled Strands agent locally. Here you deploy the same agent to AgentCore Runtime with the AgentCore CLI so it can be invoked over HTTPS with SigV4 auth from any...",
    "sectionId": "payments",
    "kind": "feature",
    "frameworks": [
      "Strands"
    ],
    "languages": [
      "python"
    ],
    "hasNotebook": false,
    "readme": "/agentcore-samples/01-features/08-agents-that-transact/00-getting-started/02-deploy-to-agentcore-runtime/README.md",
    "base": "/agentcore-samples/01-features/08-agents-that-transact/00-getting-started/02-deploy-to-agentcore-runtime",
    "files": [
      {
        "path": "payment_agent.py",
        "lang": "python",
        "bytes": 4566
      },
      {
        "path": "requirements.txt",
        "lang": "text",
        "bytes": 275
      }
    ]
  },
  {
    "slug": "01-features/08-agents-that-transact/00-getting-started/03-user-onboarding-wallet-funding",
    "title": "Tutorial 03 — User Onboarding and Backend Wallet Operations",
    "desc": "Tutorial 00 provisioned your shared payment infrastructure — the payment manager, connector, and IAM roles — with the AgentCore CLI, and created one wallet for you as the developer. In a real...",
    "sectionId": "payments",
    "kind": "feature",
    "frameworks": [],
    "languages": [
      "python"
    ],
    "hasNotebook": false,
    "readme": "/agentcore-samples/01-features/08-agents-that-transact/00-getting-started/03-user-onboarding-wallet-funding/README.md",
    "base": "/agentcore-samples/01-features/08-agents-that-transact/00-getting-started/03-user-onboarding-wallet-funding",
    "files": [
      {
        "path": "requirements.txt",
        "lang": "text",
        "bytes": 77
      },
      {
        "path": "user_onboarding.py",
        "lang": "python",
        "bytes": 13183
      }
    ]
  },
  {
    "slug": "01-features/08-agents-that-transact/00-getting-started/04-agent-with-coinbase-bazaar-via-gateway",
    "title": "Tutorial 04 — Agent with Coinbase Bazaar via AgentCore Gateway",
    "desc": "The Coinbase x402 Bazaar is an MCP marketplace where paid tools are listed with semantic descriptions, pricing, and input/output schemas. In this tutorial you use the AgentCore CLI to provision...",
    "sectionId": "gateway",
    "kind": "feature",
    "frameworks": [
      "Strands"
    ],
    "languages": [
      "python"
    ],
    "hasNotebook": false,
    "readme": "/agentcore-samples/01-features/08-agents-that-transact/00-getting-started/04-agent-with-coinbase-bazaar-via-gateway/README.md",
    "base": "/agentcore-samples/01-features/08-agents-that-transact/00-getting-started/04-agent-with-coinbase-bazaar-via-gateway",
    "files": [
      {
        "path": "bazaar_gateway_agent.py",
        "lang": "python",
        "bytes": 12917
      },
      {
        "path": "requirements.txt",
        "lang": "text",
        "bytes": 203
      }
    ]
  },
  {
    "slug": "01-features/08-agents-that-transact/00-getting-started/05-agent-with-browser-tool-pay-for-content",
    "title": "Tutorial 05 — Agent with Browser Tool Pays for Content",
    "desc": "In this tutorial your agent drives a managed cloud browser and pays x402 paywalls inside the browser session. You build a custom Strands tool, browsewithpayment, that reuses the PaymentManager and...",
    "sectionId": "browser",
    "kind": "feature",
    "frameworks": [
      "Strands"
    ],
    "languages": [
      "python"
    ],
    "hasNotebook": false,
    "readme": "/agentcore-samples/01-features/08-agents-that-transact/00-getting-started/05-agent-with-browser-tool-pay-for-content/README.md",
    "base": "/agentcore-samples/01-features/08-agents-that-transact/00-getting-started/05-agent-with-browser-tool-pay-for-content",
    "files": [
      {
        "path": "browser_paywall_payments.py",
        "lang": "python",
        "bytes": 11198
      },
      {
        "path": "requirements.txt",
        "lang": "text",
        "bytes": 145
      }
    ]
  },
  {
    "slug": "01-features/08-agents-that-transact/00-getting-started/06-research-agent-with-payment-memory",
    "title": "Tutorial 06 — Research Agent with Payment Memory",
    "desc": "In earlier tutorials the agent is stateless — every session starts from scratch and pays from scratch. This tutorial adds AgentCore Memory so a Strands agent builds intelligence across sessions:...",
    "sectionId": "memory",
    "kind": "feature",
    "frameworks": [
      "Strands"
    ],
    "languages": [
      "python"
    ],
    "hasNotebook": false,
    "readme": "/agentcore-samples/01-features/08-agents-that-transact/00-getting-started/06-research-agent-with-payment-memory/README.md",
    "base": "/agentcore-samples/01-features/08-agents-that-transact/00-getting-started/06-research-agent-with-payment-memory",
    "files": [
      {
        "path": "requirements.txt",
        "lang": "text",
        "bytes": 126
      },
      {
        "path": "research_agent_with_memory.py",
        "lang": "python",
        "bytes": 24219
      }
    ]
  },
  {
    "slug": "01-features/08-agents-that-transact/00-getting-started/07-multi-agent-payment-orchestrator",
    "title": "Tutorial 07 — Multi-Agent Payment Orchestrator",
    "desc": "Build a multi-agent system with per-agent budgets, multi-wallet support, and full spend attribution — then watch the orchestrator route work between specialists and fail over when one agent's...",
    "sectionId": "payments",
    "kind": "feature",
    "frameworks": [
      "Strands"
    ],
    "languages": [
      "python"
    ],
    "hasNotebook": false,
    "readme": "/agentcore-samples/01-features/08-agents-that-transact/00-getting-started/07-multi-agent-payment-orchestrator/README.md",
    "base": "/agentcore-samples/01-features/08-agents-that-transact/00-getting-started/07-multi-agent-payment-orchestrator",
    "files": [
      {
        "path": "multi_agent_payments.py",
        "lang": "python",
        "bytes": 17784
      },
      {
        "path": "payment_orchestrator.py",
        "lang": "python",
        "bytes": 7361
      },
      {
        "path": "requirements.txt",
        "lang": "text",
        "bytes": 158
      }
    ]
  },
  {
    "slug": "01-features/08-agents-that-transact/02-use-cases/pay-for-api-agent",
    "title": "Pay-For-API",
    "desc": "Amazon Bedrock AgentCore Payments enables AI agents to make autonomous payments for digital services. Agents never hold private keys or require human approval for each transaction.",
    "sectionId": "payments",
    "kind": "feature",
    "frameworks": [
      "Strands"
    ],
    "languages": [
      "javascript",
      "python"
    ],
    "hasNotebook": false,
    "readme": "/agentcore-samples/01-features/08-agents-that-transact/02-use-cases/pay-for-api-agent/README.md",
    "base": "/agentcore-samples/01-features/08-agents-that-transact/02-use-cases/pay-for-api-agent",
    "files": [
      {
        "path": "agent/README.md",
        "lang": "markdown",
        "bytes": 5388
      },
      {
        "path": "agent/cdk/agent_stack.py",
        "lang": "python",
        "bytes": 24280
      },
      {
        "path": "agent/cdk/app.py",
        "lang": "python",
        "bytes": 676
      },
      {
        "path": "agent/cdk/cdk.json",
        "lang": "json",
        "bytes": 315
      },
      {
        "path": "agent/cdk/requirements.txt",
        "lang": "text",
        "bytes": 48
      },
      {
        "path": "agent/container/agent.py",
        "lang": "python",
        "bytes": 19658
      },
      {
        "path": "agent/container/requirements.txt",
        "lang": "text",
        "bytes": 942
      },
      {
        "path": "env-sample.txt",
        "lang": "text",
        "bytes": 7311
      },
      {
        "path": "pay_for_api.py",
        "lang": "python",
        "bytes": 67892
      },
      {
        "path": "requirements.txt",
        "lang": "text",
        "bytes": 145
      },
      {
        "path": "seller/cdk/app.py",
        "lang": "python",
        "bytes": 782
      },
      {
        "path": "seller/cdk/cdk.json",
        "lang": "json",
        "bytes": 438
      },
      {
        "path": "seller/cdk/requirements.txt",
        "lang": "text",
        "bytes": 48
      },
      {
        "path": "seller/cdk/seller_stack.py",
        "lang": "python",
        "bytes": 6611
      },
      {
        "path": "seller/lambda/index.js",
        "lang": "javascript",
        "bytes": 10767
      },
      {
        "path": "seller/lambda/package.json",
        "lang": "json",
        "bytes": 337
      },
      {
        "path": "utils.py",
        "lang": "python",
        "bytes": 5684
      }
    ]
  },
  {
    "slug": "01-features/08-agents-that-transact/02-use-cases/pay-for-api-agent/test/integration",
    "title": "test/integration/",
    "desc": "Operational scripts for the Pay-For-API use case. Run them from the use-case root (02-use-cases/01-pay-for-api/); each script resolves its paths relative to this folder, so it does not matter...",
    "sectionId": "payments",
    "kind": "feature",
    "frameworks": [],
    "languages": [
      "python"
    ],
    "hasNotebook": false,
    "readme": "/agentcore-samples/01-features/08-agents-that-transact/02-use-cases/pay-for-api-agent/test/integration/README.md",
    "base": "/agentcore-samples/01-features/08-agents-that-transact/02-use-cases/pay-for-api-agent/test/integration",
    "files": [
      {
        "path": "deploy-agent.sh",
        "lang": "bash",
        "bytes": 3732
      },
      {
        "path": "deploy-seller.sh",
        "lang": "bash",
        "bytes": 6116
      },
      {
        "path": "destroy-agent.sh",
        "lang": "bash",
        "bytes": 1250
      },
      {
        "path": "destroy-seller.sh",
        "lang": "bash",
        "bytes": 645
      },
      {
        "path": "setup-env.sh",
        "lang": "bash",
        "bytes": 303
      },
      {
        "path": "setup-roles.sh",
        "lang": "bash",
        "bytes": 14710
      },
      {
        "path": "setup_env.py",
        "lang": "python",
        "bytes": 5042
      }
    ]
  },
  {
    "slug": "01-features/08-agents-that-transact/02-use-cases/pay-for-content-browser-use",
    "title": "Pay for Content — Browser Use Case (AgentCore runtime)",
    "desc": "Without AgentCore payments, an agent that needs to pay for content must either hold a private key (exposing credentials to the model) or interrupt the user to complete the payment manually. This...",
    "sectionId": "browser",
    "kind": "feature",
    "frameworks": [
      "Strands"
    ],
    "languages": [
      "python"
    ],
    "hasNotebook": false,
    "readme": "/agentcore-samples/01-features/08-agents-that-transact/02-use-cases/pay-for-content-browser-use/README.md",
    "base": "/agentcore-samples/01-features/08-agents-that-transact/02-use-cases/pay-for-content-browser-use",
    "files": [
      {
        "path": "agent/payment_agent.py",
        "lang": "python",
        "bytes": 8064
      },
      {
        "path": "agent/requirements.txt",
        "lang": "text",
        "bytes": 213
      },
      {
        "path": "pay_for_content_browser.py",
        "lang": "python",
        "bytes": 24484
      },
      {
        "path": "requirements.txt",
        "lang": "text",
        "bytes": 167
      },
      {
        "path": "setup_roles.sh",
        "lang": "bash",
        "bytes": 16765
      }
    ]
  },
  {
    "slug": "01-features/08-agents-that-transact/02-use-cases/pay-for-content-browser-use/content-provider",
    "title": "Demo Content Provider — x402 Paywall",
    "desc": "A CloudFront + Lambda@Edge deployment that serves paywalled content using the x402 v2 protocol. Used as the \"seller\" side of the Pay for Content (Browser) use case.",
    "sectionId": "browser",
    "kind": "feature",
    "frameworks": [],
    "languages": [
      "javascript",
      "typescript"
    ],
    "hasNotebook": false,
    "readme": "/agentcore-samples/01-features/08-agents-that-transact/02-use-cases/pay-for-content-browser-use/content-provider/README.md",
    "base": "/agentcore-samples/01-features/08-agents-that-transact/02-use-cases/pay-for-content-browser-use/content-provider",
    "files": [
      {
        "path": "cdk/bin/app.ts",
        "lang": "typescript",
        "bytes": 860
      },
      {
        "path": "cdk/cdk.json",
        "lang": "json",
        "bytes": 433
      },
      {
        "path": "cdk/package.json",
        "lang": "json",
        "bytes": 479
      },
      {
        "path": "cdk/tsconfig.json",
        "lang": "json",
        "bytes": 388
      },
      {
        "path": "deploy.sh",
        "lang": "bash",
        "bytes": 4006
      },
      {
        "path": "index.js",
        "lang": "javascript",
        "bytes": 9780
      },
      {
        "path": "lambda/x402-verify/index.ts",
        "lang": "typescript",
        "bytes": 12375
      },
      {
        "path": "lambda/x402-verify/package.json",
        "lang": "json",
        "bytes": 201
      },
      {
        "path": "package.json",
        "lang": "json",
        "bytes": 383
      },
      {
        "path": "site/article/paywall-demo.html",
        "lang": "html",
        "bytes": 468
      },
      {
        "path": "site/index.html",
        "lang": "html",
        "bytes": 2447
      }
    ]
  },
  {
    "slug": "01-features/08-agents-that-transact/02-use-cases/pay-for-data",
    "title": "Pay for Data — Heurist Finance Agent (AgentCore Runtime)",
    "desc": "A finance research agent that calls paid Heurist x402 endpoints for live market prices, SEC filings, and macro indicators. The AgentCorePaymentsPlugin intercepts HTTP 402 responses, generates a...",
    "sectionId": "payments",
    "kind": "feature",
    "frameworks": [
      "Strands"
    ],
    "languages": [
      "python"
    ],
    "hasNotebook": false,
    "readme": "/agentcore-samples/01-features/08-agents-that-transact/02-use-cases/pay-for-data/README.md",
    "base": "/agentcore-samples/01-features/08-agents-that-transact/02-use-cases/pay-for-data",
    "files": [
      {
        "path": "agent/catalog.py",
        "lang": "python",
        "bytes": 8950
      },
      {
        "path": "agent/config.py",
        "lang": "python",
        "bytes": 3927
      },
      {
        "path": "agent/main.py",
        "lang": "python",
        "bytes": 23011
      },
      {
        "path": "agent/requirements.txt",
        "lang": "text",
        "bytes": 191
      },
      {
        "path": "agent/sync_registry.py",
        "lang": "python",
        "bytes": 1140
      },
      {
        "path": "pay_for_data.py",
        "lang": "python",
        "bytes": 20241
      },
      {
        "path": "requirements.txt",
        "lang": "text",
        "bytes": 110
      }
    ]
  },
  {
    "slug": "02-use-cases/01-conversational-agents/A2A-multi-agent-incident-response",
    "title": "Agent-to-Agent (A2A) Multi-Agent System on Amazon Bedrock AgentCore for Incident Response Logging",
    "desc": "A comprehensive implementation of the Agent-to-Agent (A2A) protocol using specialized agents running on Amazon Bedrock AgentCore runtime, demonstrating intelligent coordination for AWS...",
    "sectionId": null,
    "kind": "use-case",
    "frameworks": [
      "Strands",
      "Google ADK",
      "OpenAI Agents"
    ],
    "languages": [
      "python"
    ],
    "hasNotebook": false,
    "readme": "/agentcore-samples/02-use-cases/01-conversational-agents/A2A-multi-agent-incident-response/README.md",
    "base": "/agentcore-samples/02-use-cases/01-conversational-agents/A2A-multi-agent-incident-response",
    "files": [
      {
        "path": "cleanup.py",
        "lang": "python",
        "bytes": 18489
      },
      {
        "path": "cloudformation/cognito.yaml",
        "lang": "yaml",
        "bytes": 22902
      },
      {
        "path": "cloudformation/host_agent.yaml",
        "lang": "yaml",
        "bytes": 40332
      },
      {
        "path": "cloudformation/monitoring_agent.yaml",
        "lang": "yaml",
        "bytes": 72365
      },
      {
        "path": "cloudformation/smithy-models/monitoring-service.json",
        "lang": "json",
        "bytes": 46942
      },
      {
        "path": "cloudformation/web_search_agent.yaml",
        "lang": "yaml",
        "bytes": 48951
      },
      {
        "path": "deploy.py",
        "lang": "python",
        "bytes": 41614
      },
      {
        "path": "host_adk_agent/__init__.py",
        "lang": "python",
        "bytes": 595
      },
      {
        "path": "host_adk_agent/agent.py",
        "lang": "python",
        "bytes": 7089
      },
      {
        "path": "host_adk_agent/main.py",
        "lang": "python",
        "bytes": 2599
      },
      {
        "path": "host_adk_agent/prompt/__init__.py",
        "lang": "python",
        "bytes": 1583
      },
      {
        "path": "host_adk_agent/pyproject.toml",
        "lang": "toml",
        "bytes": 326
      },
      {
        "path": "host_adk_agent/requirements.txt",
        "lang": "text",
        "bytes": 12059
      },
      {
        "path": "host_adk_agent/scripts/get_m2m_token.py",
        "lang": "python",
        "bytes": 4700
      },
      {
        "path": "host_adk_agent/utils.py",
        "lang": "python",
        "bytes": 1201
      },
      {
        "path": "monitoring_strands_agent/__init__.py",
        "lang": "python",
        "bytes": 4089
      },
      {
        "path": "monitoring_strands_agent/agent.py",
        "lang": "python",
        "bytes": 2511
      },
      {
        "path": "monitoring_strands_agent/agent_executor.py",
        "lang": "python",
        "bytes": 7230
      },
      {
        "path": "monitoring_strands_agent/main.py",
        "lang": "python",
        "bytes": 4153
      },
      {
        "path": "monitoring_strands_agent/memory_hook.py",
        "lang": "python",
        "bytes": 7795
      },
      {
        "path": "monitoring_strands_agent/prompt/__init__.py",
        "lang": "python",
        "bytes": 1107
      },
      {
        "path": "monitoring_strands_agent/pyproject.toml",
        "lang": "toml",
        "bytes": 309
      },
      {
        "path": "monitoring_strands_agent/requirements.txt",
        "lang": "text",
        "bytes": 4147
      },
      {
        "path": "monitoring_strands_agent/scripts/get_m2m_token.py",
        "lang": "python",
        "bytes": 314
      },
      {
        "path": "monitoring_strands_agent/scripts/utils.py",
        "lang": "python",
        "bytes": 441
      },
      {
        "path": "monitoring_strands_agent/utils.py",
        "lang": "python",
        "bytes": 1455
      },
      {
        "path": "pyproject.toml",
        "lang": "toml",
        "bytes": 232
      },
      {
        "path": "requirements.txt",
        "lang": "text",
        "bytes": 2197
      },
      {
        "path": "scripts/shared_utils.py",
        "lang": "python",
        "bytes": 5894
      },
      {
        "path": "test/connect_agent.py",
        "lang": "python",
        "bytes": 13757
      },
      {
        "path": "test/utils.py",
        "lang": "python",
        "bytes": 434
      }
    ]
  },
  {
    "slug": "02-use-cases/01-conversational-agents/A2A-multi-agent-incident-response/frontend",
    "title": "A2A on Amzon Bedrock AgentCore Runtime Frontend",
    "desc": "This is a single-page application that provides a chat interface for interacting with Host Google ADK Agent. The app handles OAuth authentication via AWS Cognito, streams responses from the agent...",
    "sectionId": null,
    "kind": "use-case",
    "frameworks": [
      "Strands",
      "OpenAI Agents"
    ],
    "languages": [
      "javascript",
      "tsx",
      "typescript"
    ],
    "hasNotebook": false,
    "readme": "/agentcore-samples/02-use-cases/01-conversational-agents/A2A-multi-agent-incident-response/frontend/README.md",
    "base": "/agentcore-samples/02-use-cases/01-conversational-agents/A2A-multi-agent-incident-response/frontend",
    "files": [
      {
        "path": "index.html",
        "lang": "html",
        "bytes": 370
      },
      {
        "path": "package.json",
        "lang": "json",
        "bytes": 998
      },
      {
        "path": "postcss.config.js",
        "lang": "javascript",
        "bytes": 80
      },
      {
        "path": "setup-env.sh",
        "lang": "bash",
        "bytes": 3202
      },
      {
        "path": "src/App.jsx",
        "lang": "jsx",
        "bytes": 591
      },
      {
        "path": "src/amplifyconfiguration.ts",
        "lang": "typescript",
        "bytes": 731
      },
      {
        "path": "src/components/ChatContainer.tsx",
        "lang": "tsx",
        "bytes": 3931
      },
      {
        "path": "src/components/ChatInput.tsx",
        "lang": "tsx",
        "bytes": 1933
      },
      {
        "path": "src/components/ChatMessage.tsx",
        "lang": "tsx",
        "bytes": 9576
      },
      {
        "path": "src/components/ChatPage.tsx",
        "lang": "tsx",
        "bytes": 2564
      },
      {
        "path": "src/components/MarkdownRenderer.tsx",
        "lang": "tsx",
        "bytes": 5073
      },
      {
        "path": "src/components/Sidebar.tsx",
        "lang": "tsx",
        "bytes": 4318
      },
      {
        "path": "src/components/ToolUseBlock.tsx",
        "lang": "tsx",
        "bytes": 4162
      },
      {
        "path": "src/components/ui/button.tsx",
        "lang": "tsx",
        "bytes": 1831
      },
      {
        "path": "src/components/ui/scroll-area.tsx",
        "lang": "tsx",
        "bytes": 1638
      },
      {
        "path": "src/hooks/useChat.tsx",
        "lang": "tsx",
        "bytes": 23954
      },
      {
        "path": "src/index.css",
        "lang": "css",
        "bytes": 1521
      },
      {
        "path": "src/main.jsx",
        "lang": "jsx",
        "bytes": 229
      },
      {
        "path": "src/services/chatService.ts",
        "lang": "typescript",
        "bytes": 3828
      },
      {
        "path": "src/types/index.ts",
        "lang": "typescript",
        "bytes": 4868
      },
      {
        "path": "src/utils.ts",
        "lang": "typescript",
        "bytes": 1225
      },
      {
        "path": "tailwind.config.js",
        "lang": "javascript",
        "bytes": 2653
      },
      {
        "path": "vite.config.js",
        "lang": "javascript",
        "bytes": 357
      }
    ]
  },
  {
    "slug": "02-use-cases/01-conversational-agents/A2A-multi-agent-incident-response/web_search_openai_agents",
    "title": "Web Search Openai Agents",
    "desc": "",
    "sectionId": null,
    "kind": "use-case",
    "frameworks": [
      "OpenAI Agents"
    ],
    "languages": [
      "python"
    ],
    "hasNotebook": false,
    "readme": null,
    "base": "/agentcore-samples/02-use-cases/01-conversational-agents/A2A-multi-agent-incident-response/web_search_openai_agents",
    "files": [
      {
        "path": "agent.py",
        "lang": "python",
        "bytes": 2042
      },
      {
        "path": "agent_executor.py",
        "lang": "python",
        "bytes": 7014
      },
      {
        "path": "main.py",
        "lang": "python",
        "bytes": 2857
      },
      {
        "path": "memory_tool.py",
        "lang": "python",
        "bytes": 10664
      },
      {
        "path": "prompt/__init__.py",
        "lang": "python",
        "bytes": 1687
      },
      {
        "path": "pyproject.toml",
        "lang": "toml",
        "bytes": 419
      },
      {
        "path": "requirements.txt",
        "lang": "text",
        "bytes": 7335
      },
      {
        "path": "scripts/get_m2m_token.py",
        "lang": "python",
        "bytes": 316
      },
      {
        "path": "scripts/utils.py",
        "lang": "python",
        "bytes": 441
      },
      {
        "path": "tools.py",
        "lang": "python",
        "bytes": 2946
      }
    ]
  },
  {
    "slug": "02-use-cases/01-conversational-agents/AWS-operations-agent/agentcore-runtime/src/utils",
    "title": "AgentCore Memory Implementation",
    "desc": "This directory contains the memory management utilities for AgentCore agents, implementing short-term memory capabilities using Amazon Bedrock AgentCore Memory.",
    "sectionId": "runtime",
    "kind": "use-case",
    "frameworks": [],
    "languages": [
      "python"
    ],
    "hasNotebook": false,
    "readme": "/agentcore-samples/02-use-cases/01-conversational-agents/AWS-operations-agent/agentcore-runtime/src/utils/README.md",
    "base": "/agentcore-samples/02-use-cases/01-conversational-agents/AWS-operations-agent/agentcore-runtime/src/utils",
    "files": [
      {
        "path": "memory_manager.py",
        "lang": "python",
        "bytes": 8283
      }
    ]
  },
  {
    "slug": "02-use-cases/01-conversational-agents/SRE-agent",
    "title": "SRE Agent - Multi-Agent Site Reliability Engineering Assistant",
    "desc": "The SRE Agent is a multi-agent system for Site Reliability Engineers that helps investigate infrastructure issues. Built on the Model Context Protocol (MCP) and powered by Amazon Nova and...",
    "sectionId": null,
    "kind": "use-case",
    "frameworks": [
      "LangGraph",
      "LangChain"
    ],
    "languages": [
      "python"
    ],
    "hasNotebook": false,
    "readme": "/agentcore-samples/02-use-cases/01-conversational-agents/SRE-agent/README.md",
    "base": "/agentcore-samples/02-use-cases/01-conversational-agents/SRE-agent",
    "files": [
      {
        "path": "deployment/build_and_deploy.sh",
        "lang": "bash",
        "bytes": 7428
      },
      {
        "path": "deployment/deploy_agent_runtime.py",
        "lang": "python",
        "bytes": 10882
      },
      {
        "path": "deployment/invoke_agent_runtime.py",
        "lang": "python",
        "bytes": 6347
      },
      {
        "path": "deployment/setup_cognito.sh",
        "lang": "bash",
        "bytes": 6889
      },
      {
        "path": "docker-compose.yaml",
        "lang": "yaml",
        "bytes": 563
      },
      {
        "path": "docs/auth.md",
        "lang": "markdown",
        "bytes": 12499
      },
      {
        "path": "docs/blog_post.md",
        "lang": "markdown",
        "bytes": 41689
      },
      {
        "path": "docs/configuration.md",
        "lang": "markdown",
        "bytes": 10366
      },
      {
        "path": "docs/demo-environment.md",
        "lang": "markdown",
        "bytes": 3637
      },
      {
        "path": "docs/deployment-guide.md",
        "lang": "markdown",
        "bytes": 13111
      },
      {
        "path": "docs/development.md",
        "lang": "markdown",
        "bytes": 784
      },
      {
        "path": "docs/ec2-port-configuration.md",
        "lang": "markdown",
        "bytes": 2893
      },
      {
        "path": "docs/example-use-cases.md",
        "lang": "markdown",
        "bytes": 1305
      },
      {
        "path": "docs/examples/API_response_times_have_degraded_3x_in_the_last_hour_user_id_Alice_20250802_163136.md",
        "lang": "markdown",
        "bytes": 8013
      },
      {
        "path": "docs/examples/API_response_times_have_degraded_3x_in_the_last_hour_user_id_Carol_20250802_163547.md",
        "lang": "markdown",
        "bytes": 7875
      },
      {
        "path": "docs/examples/Memory_System_Analysis_User_Personalization_20250802_162648.md",
        "lang": "markdown",
        "bytes": 19057
      },
      {
        "path": "docs/examples/api-response-time-analysis.md",
        "lang": "markdown",
        "bytes": 6233
      },
      {
        "path": "docs/examples/flight-booking-analysis.md",
        "lang": "markdown",
        "bytes": 4782
      },
      {
        "path": "docs/memory-system.md",
        "lang": "markdown",
        "bytes": 30096
      },
      {
        "path": "docs/security.md",
        "lang": "markdown",
        "bytes": 2066
      },
      {
        "path": "docs/sre_agent_architecture.md",
        "lang": "markdown",
        "bytes": 819
      },
      {
        "path": "docs/system-components.md",
        "lang": "markdown",
        "bytes": 11780
      },
      {
        "path": "docs/verification.md",
        "lang": "markdown",
        "bytes": 1966
      },
      {
        "path": "mypy.ini",
        "lang": "text",
        "bytes": 690
      },
      {
        "path": "pyproject.toml",
        "lang": "toml",
        "bytes": 1858
      },
      {
        "path": "scripts/cleanup.sh",
        "lang": "bash",
        "bytes": 10881
      },
      {
        "path": "scripts/configure_gateway.sh",
        "lang": "bash",
        "bytes": 9391
      },
      {
        "path": "scripts/manage_memories.py",
        "lang": "python",
        "bytes": 25113
      },
      {
        "path": "scripts/user_config.yaml",
        "lang": "yaml",
        "bytes": 3096
      },
      {
        "path": "sre_agent/__init__.py",
        "lang": "python",
        "bytes": 58
      },
      {
        "path": "sre_agent/agent_nodes.py",
        "lang": "python",
        "bytes": 22288
      },
      {
        "path": "sre_agent/agent_runtime.py",
        "lang": "python",
        "bytes": 10512
      },
      {
        "path": "sre_agent/agent_state.py",
        "lang": "python",
        "bytes": 2129
      },
      {
        "path": "sre_agent/cli.py",
        "lang": "python",
        "bytes": 609
      },
      {
        "path": "sre_agent/config/agent_config.yaml",
        "lang": "yaml",
        "bytes": 1612
      },
      {
        "path": "sre_agent/config/prompts/agent_base_prompt.txt",
        "lang": "text",
        "bytes": 5402
      },
      {
        "path": "sre_agent/config/prompts/data_pattern_guide.txt",
        "lang": "text",
        "bytes": 1270
      },
      {
        "path": "sre_agent/config/prompts/executive_summary_system.txt",
        "lang": "text",
        "bytes": 2920
      },
      {
        "path": "sre_agent/config/prompts/executive_summary_user_template.txt",
        "lang": "text",
        "bytes": 284
      },
      {
        "path": "sre_agent/config/prompts/kubernetes_agent_prompt.txt",
        "lang": "text",
        "bytes": 616
      },
      {
        "path": "sre_agent/config/prompts/logs_agent_prompt.txt",
        "lang": "text",
        "bytes": 2769
      },
      {
        "path": "sre_agent/config/prompts/metrics_agent_prompt.txt",
        "lang": "text",
        "bytes": 2882
      },
      {
        "path": "sre_agent/config/prompts/runbooks_agent_prompt.txt",
        "lang": "text",
        "bytes": 1881
      },
      {
        "path": "sre_agent/config/prompts/supervisor_aggregation_system.txt",
        "lang": "text",
        "bytes": 979
      },
      {
        "path": "sre_agent/config/prompts/supervisor_fallback_prompt.txt",
        "lang": "text",
        "bytes": 1432
      },
      {
        "path": "sre_agent/config/prompts/supervisor_multi_agent_prompt.txt",
        "lang": "text",
        "bytes": 21916
      },
      {
        "path": "sre_agent/config/prompts/supervisor_plan_aggregation.txt",
        "lang": "text",
        "bytes": 746
      },
      {
        "path": "sre_agent/config/prompts/supervisor_planning_prompt.txt",
        "lang": "text",
        "bytes": 2035
      },
      {
        "path": "sre_agent/config/prompts/supervisor_standard_aggregation.txt",
        "lang": "text",
        "bytes": 1312
      },
      {
        "path": "sre_agent/constants.py",
        "lang": "python",
        "bytes": 12637
      },
      {
        "path": "sre_agent/graph_builder.py",
        "lang": "python",
        "bytes": 7040
      },
      {
        "path": "sre_agent/llm_utils.py",
        "lang": "python",
        "bytes": 8061
      },
      {
        "path": "sre_agent/logging_config.py",
        "lang": "python",
        "bytes": 1805
      },
      {
        "path": "sre_agent/memory/__init__.py",
        "lang": "python",
        "bytes": 850
      },
      {
        "path": "sre_agent/memory/client.py",
        "lang": "python",
        "bytes": 16655
      },
      {
        "path": "sre_agent/memory/config.py",
        "lang": "python",
        "bytes": 1792
      },
      {
        "path": "sre_agent/memory/conversation_manager.py",
        "lang": "python",
        "bytes": 6689
      },
      {
        "path": "sre_agent/memory/hooks.py",
        "lang": "python",
        "bytes": 22489
      },
      {
        "path": "sre_agent/memory/strategies.py",
        "lang": "python",
        "bytes": 17775
      },
      {
        "path": "sre_agent/memory/tools.py",
        "lang": "python",
        "bytes": 19349
      },
      {
        "path": "sre_agent/multi_agent_langgraph.py",
        "lang": "python",
        "bytes": 66320
      },
      {
        "path": "sre_agent/output_formatter.py",
        "lang": "python",
        "bytes": 10660
      },
      {
        "path": "sre_agent/prompt_loader.py",
        "lang": "python",
        "bytes": 8791
      },
      {
        "path": "sre_agent/supervisor.py",
        "lang": "python",
        "bytes": 37239
      },
      {
        "path": "tests/integration/test_memory_integration.py",
        "lang": "python",
        "bytes": 7495
      },
      {
        "path": "tests/unit/memory/__init__.py",
        "lang": "python",
        "bytes": 38
      },
      {
        "path": "tests/unit/memory/test_config.py",
        "lang": "python",
        "bytes": 2466
      },
      {
        "path": "tests/unit/memory/test_strategies.py",
        "lang": "python",
        "bytes": 6298
      },
      {
        "path": "tests/unit/memory/test_tools.py",
        "lang": "python",
        "bytes": 10886
      },
      {
        "path": "verify_report.py",
        "lang": "python",
        "bytes": 7889
      }
    ]
  },
  {
    "slug": "02-use-cases/01-conversational-agents/SRE-agent/backend",
    "title": "Backend Demo Infrastructure",
    "desc": "This directory contains the complete demo backend infrastructure for SRE Agent testing and development.",
    "sectionId": null,
    "kind": "use-case",
    "frameworks": [],
    "languages": [
      "python"
    ],
    "hasNotebook": false,
    "readme": "/agentcore-samples/02-use-cases/01-conversational-agents/SRE-agent/backend/README.md",
    "base": "/agentcore-samples/02-use-cases/01-conversational-agents/SRE-agent/backend",
    "files": [
      {
        "path": "__init__.py",
        "lang": "python",
        "bytes": 0
      },
      {
        "path": "config_utils.py",
        "lang": "python",
        "bytes": 2417
      },
      {
        "path": "data/__init__.py",
        "lang": "python",
        "bytes": 0
      },
      {
        "path": "data/all_data_dump.txt",
        "lang": "text",
        "bytes": 79864
      },
      {
        "path": "data/k8s_data/deployments.json",
        "lang": "json",
        "bytes": 2110
      },
      {
        "path": "data/k8s_data/events.json",
        "lang": "json",
        "bytes": 2511
      },
      {
        "path": "data/k8s_data/nodes.json",
        "lang": "json",
        "bytes": 2339
      },
      {
        "path": "data/k8s_data/pods.json",
        "lang": "json",
        "bytes": 4114
      },
      {
        "path": "data/k8s_data/resource_usage.json",
        "lang": "json",
        "bytes": 1051
      },
      {
        "path": "data/k8s_data/services.json",
        "lang": "json",
        "bytes": 2354
      },
      {
        "path": "data/logs_data/log_counts.json",
        "lang": "json",
        "bytes": 663
      },
      {
        "path": "data/logs_data/log_patterns.json",
        "lang": "json",
        "bytes": 1677
      },
      {
        "path": "data/metrics_data/availability.json",
        "lang": "json",
        "bytes": 4062
      },
      {
        "path": "data/metrics_data/error_rates.json",
        "lang": "json",
        "bytes": 4491
      },
      {
        "path": "data/metrics_data/resource_usage.json",
        "lang": "json",
        "bytes": 2068
      },
      {
        "path": "data/metrics_data/response_times.json",
        "lang": "json",
        "bytes": 2996
      },
      {
        "path": "data/metrics_data/throughput.json",
        "lang": "json",
        "bytes": 1355
      },
      {
        "path": "data/metrics_data/trends.json",
        "lang": "json",
        "bytes": 1130
      },
      {
        "path": "data/reports/sre_investigation_20250713_211725.md",
        "lang": "markdown",
        "bytes": 3719
      },
      {
        "path": "data/runbooks_data/common_resolutions.json",
        "lang": "json",
        "bytes": 4605
      },
      {
        "path": "data/runbooks_data/escalation_procedures.json",
        "lang": "json",
        "bytes": 3740
      },
      {
        "path": "data/runbooks_data/incident_playbooks.json",
        "lang": "json",
        "bytes": 6821
      },
      {
        "path": "data/runbooks_data/markdown/common_resolutions.md",
        "lang": "markdown",
        "bytes": 3808
      },
      {
        "path": "data/runbooks_data/markdown/escalation_procedures.md",
        "lang": "markdown",
        "bytes": 2975
      },
      {
        "path": "data/runbooks_data/markdown/incident_playbooks.md",
        "lang": "markdown",
        "bytes": 5838
      },
      {
        "path": "data/runbooks_data/markdown/service_recovery.md",
        "lang": "markdown",
        "bytes": 3404
      },
      {
        "path": "data/runbooks_data/markdown/troubleshooting_guides.md",
        "lang": "markdown",
        "bytes": 4934
      },
      {
        "path": "data/runbooks_data/service_recovery.json",
        "lang": "json",
        "bytes": 7154
      },
      {
        "path": "data/runbooks_data/troubleshooting_guides.json",
        "lang": "json",
        "bytes": 5706
      },
      {
        "path": "openapi_specs/generate_specs.sh",
        "lang": "bash",
        "bytes": 3059
      },
      {
        "path": "scripts/dump_data_contents.sh",
        "lang": "bash",
        "bytes": 2797
      },
      {
        "path": "scripts/start_demo_backend.sh",
        "lang": "bash",
        "bytes": 3843
      },
      {
        "path": "scripts/stop_demo_backend.sh",
        "lang": "bash",
        "bytes": 1184
      },
      {
        "path": "servers/__init__.py",
        "lang": "python",
        "bytes": 0
      },
      {
        "path": "servers/k8s_server.py",
        "lang": "python",
        "bytes": 16768
      },
      {
        "path": "servers/logs_server.py",
        "lang": "python",
        "bytes": 12145
      },
      {
        "path": "servers/metrics_server.py",
        "lang": "python",
        "bytes": 13805
      },
      {
        "path": "servers/retrieve_api_key.py",
        "lang": "python",
        "bytes": 8180
      },
      {
        "path": "servers/run_all_servers.py",
        "lang": "python",
        "bytes": 4113
      },
      {
        "path": "servers/runbooks_server.py",
        "lang": "python",
        "bytes": 14461
      },
      {
        "path": "servers/server.py",
        "lang": "python",
        "bytes": 12253
      },
      {
        "path": "servers/stop_servers.py",
        "lang": "python",
        "bytes": 2653
      }
    ]
  },
  {
    "slug": "02-use-cases/01-conversational-agents/SRE-agent/gateway",
    "title": "Gateway Component",
    "desc": "This directory contains the MCP (Model Context Protocol) gateway management tools for SRE Agent.",
    "sectionId": "gateway",
    "kind": "use-case",
    "frameworks": [],
    "languages": [
      "python"
    ],
    "hasNotebook": false,
    "readme": "/agentcore-samples/02-use-cases/01-conversational-agents/SRE-agent/gateway/README.md",
    "base": "/agentcore-samples/02-use-cases/01-conversational-agents/SRE-agent/gateway",
    "files": [
      {
        "path": "create_credentials_provider.py",
        "lang": "python",
        "bytes": 10196
      },
      {
        "path": "create_gateway.sh",
        "lang": "bash",
        "bytes": 11058
      },
      {
        "path": "generate_token.py",
        "lang": "python",
        "bytes": 5447
      },
      {
        "path": "generate_token.sh",
        "lang": "bash",
        "bytes": 1068
      },
      {
        "path": "main.py",
        "lang": "python",
        "bytes": 25699
      },
      {
        "path": "mcp_cmds.sh",
        "lang": "bash",
        "bytes": 6863
      },
      {
        "path": "observability.py",
        "lang": "python",
        "bytes": 2263
      }
    ]
  },
  {
    "slug": "02-use-cases/01-conversational-agents/customer-support-assistant-vpc",
    "title": "Customer Support Assistant - Private VPC",
    "desc": "This is a customer support agent implementation using Amazon Bedrock AgentCore deployed in a fully private VPC environment. The system provides an AI-powered customer support interface with...",
    "sectionId": null,
    "kind": "use-case",
    "frameworks": [
      "Strands"
    ],
    "languages": [
      "python"
    ],
    "hasNotebook": false,
    "readme": "/agentcore-samples/02-use-cases/01-conversational-agents/customer-support-assistant-vpc/README.md",
    "base": "/agentcore-samples/02-use-cases/01-conversational-agents/customer-support-assistant-vpc",
    "files": [
      {
        "path": "DATA.md",
        "lang": "markdown",
        "bytes": 9658
      },
      {
        "path": "agent/context.py",
        "lang": "python",
        "bytes": 4985
      },
      {
        "path": "agent/main.py",
        "lang": "python",
        "bytes": 8818
      },
      {
        "path": "agent/prompt/__init__.py",
        "lang": "python",
        "bytes": 2494
      },
      {
        "path": "agent/pyproject.toml",
        "lang": "toml",
        "bytes": 498
      },
      {
        "path": "agent/requirements.txt",
        "lang": "text",
        "bytes": 5572
      },
      {
        "path": "agent/utils.py",
        "lang": "python",
        "bytes": 1518
      },
      {
        "path": "cleanup.sh",
        "lang": "bash",
        "bytes": 11993
      },
      {
        "path": "cloudformation/agent-server-stack.yaml",
        "lang": "yaml",
        "bytes": 47479
      },
      {
        "path": "cloudformation/aurora-postgres-stack.yaml",
        "lang": "yaml",
        "bytes": 36462
      },
      {
        "path": "cloudformation/cognito-stack.yaml",
        "lang": "yaml",
        "bytes": 26830
      },
      {
        "path": "cloudformation/customer-support-stack.yaml",
        "lang": "yaml",
        "bytes": 7530
      },
      {
        "path": "cloudformation/dynamodb-stack.yaml",
        "lang": "yaml",
        "bytes": 16552
      },
      {
        "path": "cloudformation/gateway-stack.yaml",
        "lang": "yaml",
        "bytes": 57209
      },
      {
        "path": "cloudformation/mcp-server-stack.yaml",
        "lang": "yaml",
        "bytes": 46366
      },
      {
        "path": "cloudformation/vpc-stack.yaml",
        "lang": "yaml",
        "bytes": 23744
      },
      {
        "path": "deploy.sh",
        "lang": "bash",
        "bytes": 14907
      },
      {
        "path": "mcp_dynamodb/main.py",
        "lang": "python",
        "bytes": 4740
      },
      {
        "path": "mcp_dynamodb/pyproject.toml",
        "lang": "toml",
        "bytes": 274
      },
      {
        "path": "mcp_dynamodb/requirements.txt",
        "lang": "text",
        "bytes": 4310
      },
      {
        "path": "pyproject.toml",
        "lang": "toml",
        "bytes": 305
      },
      {
        "path": "test/__init__.py",
        "lang": "python",
        "bytes": 0
      },
      {
        "path": "test/connect_agent.py",
        "lang": "python",
        "bytes": 4844
      },
      {
        "path": "test/connect_gateway.py",
        "lang": "python",
        "bytes": 4564
      },
      {
        "path": "test/connect_mcp.py",
        "lang": "python",
        "bytes": 7364
      },
      {
        "path": "test/utils.py",
        "lang": "python",
        "bytes": 10601
      }
    ]
  },
  {
    "slug": "02-use-cases/01-conversational-agents/customer-support-assistant-vpc/frontend",
    "title": "Customer Support Assistant Frontend",
    "desc": "This is a single-page application that provides a chat interface for interacting with Customer Support Assistant. The app handles OAuth authentication via AWS Cognito, streams responses from the...",
    "sectionId": null,
    "kind": "use-case",
    "frameworks": [],
    "languages": [
      "javascript",
      "tsx",
      "typescript"
    ],
    "hasNotebook": false,
    "readme": "/agentcore-samples/02-use-cases/01-conversational-agents/customer-support-assistant-vpc/frontend/README.md",
    "base": "/agentcore-samples/02-use-cases/01-conversational-agents/customer-support-assistant-vpc/frontend",
    "files": [
      {
        "path": "index.html",
        "lang": "html",
        "bytes": 375
      },
      {
        "path": "package.json",
        "lang": "json",
        "bytes": 908
      },
      {
        "path": "postcss.config.js",
        "lang": "javascript",
        "bytes": 80
      },
      {
        "path": "setup-env.sh",
        "lang": "bash",
        "bytes": 2070
      },
      {
        "path": "src/App.jsx",
        "lang": "jsx",
        "bytes": 849
      },
      {
        "path": "src/amplifyconfiguration.ts",
        "lang": "typescript",
        "bytes": 731
      },
      {
        "path": "src/components/ChatContainer.tsx",
        "lang": "tsx",
        "bytes": 4034
      },
      {
        "path": "src/components/ChatInput.tsx",
        "lang": "tsx",
        "bytes": 1811
      },
      {
        "path": "src/components/ChatMessage.tsx",
        "lang": "tsx",
        "bytes": 8355
      },
      {
        "path": "src/components/ChatPage.tsx",
        "lang": "tsx",
        "bytes": 876
      },
      {
        "path": "src/components/Sidebar.tsx",
        "lang": "tsx",
        "bytes": 1566
      },
      {
        "path": "src/components/ToolUseBlock.tsx",
        "lang": "tsx",
        "bytes": 4162
      },
      {
        "path": "src/components/ui/button.tsx",
        "lang": "tsx",
        "bytes": 1831
      },
      {
        "path": "src/components/ui/scroll-area.tsx",
        "lang": "tsx",
        "bytes": 1638
      },
      {
        "path": "src/hooks/useChat.tsx",
        "lang": "tsx",
        "bytes": 18237
      },
      {
        "path": "src/index.css",
        "lang": "css",
        "bytes": 1521
      },
      {
        "path": "src/main.jsx",
        "lang": "jsx",
        "bytes": 229
      },
      {
        "path": "src/services/chatService.ts",
        "lang": "typescript",
        "bytes": 3882
      },
      {
        "path": "src/types/index.ts",
        "lang": "typescript",
        "bytes": 4506
      },
      {
        "path": "src/utils.ts",
        "lang": "typescript",
        "bytes": 1225
      },
      {
        "path": "tailwind.config.js",
        "lang": "javascript",
        "bytes": 2653
      },
      {
        "path": "vite.config.js",
        "lang": "javascript",
        "bytes": 357
      }
    ]
  },
  {
    "slug": "02-use-cases/01-conversational-agents/deep-research-agent",
    "title": "Deep Research Agent",
    "desc": "An intelligent research agent powered by Amazon Bedrock AgentCore and Claude Sonnet 4 that answers complex, multi-faceted questions through an iterative Plan → Search → Reflect → Synthesize loop.",
    "sectionId": null,
    "kind": "use-case",
    "frameworks": [
      "Strands"
    ],
    "languages": [
      "python"
    ],
    "hasNotebook": false,
    "readme": "/agentcore-samples/02-use-cases/01-conversational-agents/deep-research-agent/README.md",
    "base": "/agentcore-samples/02-use-cases/01-conversational-agents/deep-research-agent",
    "files": [
      {
        "path": "cleanup.py",
        "lang": "python",
        "bytes": 4282
      },
      {
        "path": "deep_research_agent.py",
        "lang": "python",
        "bytes": 14451
      },
      {
        "path": "gateway_setup.py",
        "lang": "python",
        "bytes": 23319
      },
      {
        "path": "requirements.txt",
        "lang": "text",
        "bytes": 74
      }
    ]
  },
  {
    "slug": "02-use-cases/01-conversational-agents/device-management-agent",
    "title": "Device Management System",
    "desc": "This use case implements a comprehensive Device Management System using Amazon Bedrock AgentCore. It provides a unified interface for managing IoT devices, WiFi networks, users, and activities...",
    "sectionId": null,
    "kind": "use-case",
    "frameworks": [],
    "languages": [],
    "hasNotebook": false,
    "readme": "/agentcore-samples/02-use-cases/01-conversational-agents/device-management-agent/README.md",
    "base": "/agentcore-samples/02-use-cases/01-conversational-agents/device-management-agent",
    "files": [
      {
        "path": "deploy_all.sh",
        "lang": "bash",
        "bytes": 13211
      },
      {
        "path": "requirements.txt",
        "lang": "text",
        "bytes": 687
      }
    ]
  },
  {
    "slug": "02-use-cases/01-conversational-agents/device-management-agent/agent-runtime",
    "title": "Agent Runtime Module",
    "desc": "The Agent Runtime module is the core conversational AI component of the Device Management System. It handles natural language processing, conversation management, and tool execution using Amazon...",
    "sectionId": "runtime",
    "kind": "use-case",
    "frameworks": [
      "Strands"
    ],
    "languages": [
      "python"
    ],
    "hasNotebook": false,
    "readme": "/agentcore-samples/02-use-cases/01-conversational-agents/device-management-agent/agent-runtime/README.md",
    "base": "/agentcore-samples/02-use-cases/01-conversational-agents/device-management-agent/agent-runtime",
    "files": [
      {
        "path": "access_token.py",
        "lang": "python",
        "bytes": 7242
      },
      {
        "path": "cognito_credentials_provider.py",
        "lang": "python",
        "bytes": 11972
      },
      {
        "path": "device_management_agent_exec.py",
        "lang": "python",
        "bytes": 7770
      },
      {
        "path": "requirements-runtime.txt",
        "lang": "text",
        "bytes": 198
      },
      {
        "path": "requirements.txt",
        "lang": "text",
        "bytes": 198
      },
      {
        "path": "setup.sh",
        "lang": "bash",
        "bytes": 4782
      },
      {
        "path": "strands_agent_runtime.py",
        "lang": "python",
        "bytes": 31384
      },
      {
        "path": "strands_agent_runtime_deploy.py",
        "lang": "python",
        "bytes": 13612
      },
      {
        "path": "utils.py",
        "lang": "python",
        "bytes": 6670
      }
    ]
  },
  {
    "slug": "02-use-cases/01-conversational-agents/device-management-agent/device-management",
    "title": "Device Management Module",
    "desc": "The Device Management Module is the core backend component that implements all device management operations. It consists of an AWS Lambda function that serves as the execution engine for MCP...",
    "sectionId": null,
    "kind": "use-case",
    "frameworks": [],
    "languages": [
      "python"
    ],
    "hasNotebook": false,
    "readme": "/agentcore-samples/02-use-cases/01-conversational-agents/device-management-agent/device-management/README.md",
    "base": "/agentcore-samples/02-use-cases/01-conversational-agents/device-management-agent/device-management",
    "files": [
      {
        "path": "deploy.sh",
        "lang": "bash",
        "bytes": 12818
      },
      {
        "path": "dynamodb_models.py",
        "lang": "python",
        "bytes": 12655
      },
      {
        "path": "lambda_arn.txt",
        "lang": "text",
        "bytes": 81
      },
      {
        "path": "lambda_function.py",
        "lang": "python",
        "bytes": 17128
      },
      {
        "path": "requirements.txt",
        "lang": "text",
        "bytes": 58
      },
      {
        "path": "synthetic_data.py",
        "lang": "python",
        "bytes": 28066
      },
      {
        "path": "test_lambda.py",
        "lang": "python",
        "bytes": 7781
      }
    ]
  },
  {
    "slug": "02-use-cases/01-conversational-agents/device-management-agent/frontend",
    "title": "Frontend Module",
    "desc": "The Frontend Module provides a web-based user interface for the Device Management System. Built with FastAPI and WebSockets, it offers a chat-like interface where users can interact with their IoT...",
    "sectionId": null,
    "kind": "use-case",
    "frameworks": [],
    "languages": [
      "python"
    ],
    "hasNotebook": false,
    "readme": "/agentcore-samples/02-use-cases/01-conversational-agents/device-management-agent/frontend/README.md",
    "base": "/agentcore-samples/02-use-cases/01-conversational-agents/device-management-agent/frontend",
    "files": [
      {
        "path": "auth.py",
        "lang": "python",
        "bytes": 9014
      },
      {
        "path": "deploy_all.sh",
        "lang": "bash",
        "bytes": 11468
      },
      {
        "path": "docker-compose.yml",
        "lang": "yaml",
        "bytes": 278
      },
      {
        "path": "main.py",
        "lang": "python",
        "bytes": 30259
      },
      {
        "path": "requirements.txt",
        "lang": "text",
        "bytes": 220
      },
      {
        "path": "setup_and_run.sh",
        "lang": "bash",
        "bytes": 6527
      },
      {
        "path": "static/css/styles.css",
        "lang": "css",
        "bytes": 9682
      },
      {
        "path": "templates/chat.html",
        "lang": "html",
        "bytes": 13588
      },
      {
        "path": "templates/login.html",
        "lang": "html",
        "bytes": 2598
      },
      {
        "path": "templates/simple_login.html",
        "lang": "html",
        "bytes": 3411
      }
    ]
  },
  {
    "slug": "02-use-cases/01-conversational-agents/device-management-agent/gateway",
    "title": "Gateway Module",
    "desc": "The Gateway Module creates and configures the Amazon Bedrock AgentCore Gateway, which serves as the secure entry point for all device management operations. It handles authentication via Amazon...",
    "sectionId": "gateway",
    "kind": "use-case",
    "frameworks": [],
    "languages": [
      "python"
    ],
    "hasNotebook": false,
    "readme": "/agentcore-samples/02-use-cases/01-conversational-agents/device-management-agent/gateway/README.md",
    "base": "/agentcore-samples/02-use-cases/01-conversational-agents/device-management-agent/gateway",
    "files": [
      {
        "path": "cognito_oauth_setup.py",
        "lang": "python",
        "bytes": 7362
      },
      {
        "path": "create_gateway.py",
        "lang": "python",
        "bytes": 4152
      },
      {
        "path": "device-management-target.py",
        "lang": "python",
        "bytes": 8434
      },
      {
        "path": "gateway_observability.py",
        "lang": "python",
        "bytes": 4794
      },
      {
        "path": "requirements.txt",
        "lang": "text",
        "bytes": 58
      }
    ]
  },
  {
    "slug": "02-use-cases/01-conversational-agents/finance-personal-assistant",
    "title": "Use agent strategies to streamline complex business tasks",
    "desc": "The workshop is a hands-on training program designed to empower developers and AI enthusiasts to build sophisticated, context-aware AI agents using cutting-edge technologies like Amazon Bedrock,...",
    "sectionId": null,
    "kind": "use-case",
    "frameworks": [
      "Strands"
    ],
    "languages": [
      "python"
    ],
    "hasNotebook": true,
    "readme": "/agentcore-samples/02-use-cases/01-conversational-agents/finance-personal-assistant/README.md",
    "base": "/agentcore-samples/02-use-cases/01-conversational-agents/finance-personal-assistant",
    "files": [
      {
        "path": "lab1-develop_a_personal_budget_assistant_strands_agent.md",
        "lang": "markdown",
        "bytes": 16898,
        "fromNotebook": true
      },
      {
        "path": "lab2-build_multi_agent_workflows_with_strands.md",
        "lang": "markdown",
        "bytes": 21811,
        "fromNotebook": true
      },
      {
        "path": "lab3-deploy_agents_on_amazon_bedrock_agentcore.md",
        "lang": "markdown",
        "bytes": 13459,
        "fromNotebook": true
      },
      {
        "path": "requirements.txt",
        "lang": "text",
        "bytes": 8186
      },
      {
        "path": "utils/__init__.py",
        "lang": "python",
        "bytes": 575
      },
      {
        "path": "utils/agentcore_utils.py",
        "lang": "python",
        "bytes": 4062
      },
      {
        "path": "utils/guardrail.py",
        "lang": "python",
        "bytes": 4881
      },
      {
        "path": "utils/message_formatter.py",
        "lang": "python",
        "bytes": 5453
      }
    ]
  },
  {
    "slug": "02-use-cases/01-conversational-agents/healthcare-appointment-agent",
    "title": "Healthcare Appointment Agent",
    "desc": "An AI agent for immunization related healthcare appointments built with Amazon Bedrock AgentCore Gateway using the Model Context Protocol (MCP) to expose the tools. This AI agent supports...",
    "sectionId": null,
    "kind": "use-case",
    "frameworks": [
      "Strands",
      "LangGraph",
      "LangChain"
    ],
    "languages": [
      "python"
    ],
    "hasNotebook": false,
    "readme": "/agentcore-samples/02-use-cases/01-conversational-agents/healthcare-appointment-agent/README.md",
    "base": "/agentcore-samples/02-use-cases/01-conversational-agents/healthcare-appointment-agent",
    "files": [
      {
        "path": "agentcore-policy-minimum-iam-policy.json",
        "lang": "json",
        "bytes": 587
      },
      {
        "path": "cloudformation/healthcare-cfn.yaml",
        "lang": "yaml",
        "bytes": 19745
      },
      {
        "path": "create_test_data.py",
        "lang": "python",
        "bytes": 1400
      },
      {
        "path": "fhir-openapi-spec.yaml",
        "lang": "yaml",
        "bytes": 3705
      },
      {
        "path": "init_env.py",
        "lang": "python",
        "bytes": 5578
      },
      {
        "path": "langgraph_agent.py",
        "lang": "python",
        "bytes": 4658
      },
      {
        "path": "requirements.txt",
        "lang": "text",
        "bytes": 275
      },
      {
        "path": "setup_fhir_mcp.py",
        "lang": "python",
        "bytes": 6855
      },
      {
        "path": "strands_agent.py",
        "lang": "python",
        "bytes": 4218
      },
      {
        "path": "test_agent.py",
        "lang": "python",
        "bytes": 2420
      },
      {
        "path": "test_data/immunization.json",
        "lang": "json",
        "bytes": 5881
      },
      {
        "path": "test_data/patient.json",
        "lang": "json",
        "bytes": 1365
      },
      {
        "path": "utils.py",
        "lang": "python",
        "bytes": 2181
      }
    ]
  },
  {
    "slug": "02-use-cases/01-conversational-agents/healthcare-appointment-agent/policy",
    "title": "AgentCore Policy for Healthcare Appointment Agent",
    "desc": "AI agents that call tools on behalf of users need deterministic access control — not just prompt-based guardrails that can be bypassed. Amazon Bedrock AgentCore Policy enforces tool-level...",
    "sectionId": "policy",
    "kind": "use-case",
    "frameworks": [
      "Strands"
    ],
    "languages": [
      "python"
    ],
    "hasNotebook": false,
    "readme": "/agentcore-samples/02-use-cases/01-conversational-agents/healthcare-appointment-agent/policy/README.md",
    "base": "/agentcore-samples/02-use-cases/01-conversational-agents/healthcare-appointment-agent/policy",
    "files": [
      {
        "path": "attach_policy.py",
        "lang": "python",
        "bytes": 2287
      },
      {
        "path": "detach_policy.py",
        "lang": "python",
        "bytes": 1951
      },
      {
        "path": "setup_cognito_claims.py",
        "lang": "python",
        "bytes": 15676
      },
      {
        "path": "setup_policy.py",
        "lang": "python",
        "bytes": 13159
      },
      {
        "path": "test_output.txt",
        "lang": "text",
        "bytes": 11110
      },
      {
        "path": "test_policy.py",
        "lang": "python",
        "bytes": 26186
      }
    ]
  },
  {
    "slug": "02-use-cases/01-conversational-agents/lakehouse-agent",
    "title": "Lakehouse Agent with OAuth Authentication",
    "desc": "A lakehouse data processing system demonstrating Amazon Bedrock AgentCore capabilities with end-to-end OAuth authentication, row-level security based on federated user identity, and conversational...",
    "sectionId": null,
    "kind": "use-case",
    "frameworks": [
      "Strands"
    ],
    "languages": [
      "python",
      "typescript"
    ],
    "hasNotebook": true,
    "readme": "/agentcore-samples/02-use-cases/01-conversational-agents/lakehouse-agent/README.md",
    "base": "/agentcore-samples/02-use-cases/01-conversational-agents/lakehouse-agent",
    "files": [
      {
        "path": "01-deploy-cognito.md",
        "lang": "markdown",
        "bytes": 6237,
        "fromNotebook": true
      },
      {
        "path": "02-deploy-iam-roles.md",
        "lang": "markdown",
        "bytes": 3446,
        "fromNotebook": true
      },
      {
        "path": "03-deploy-s3tables.md",
        "lang": "markdown",
        "bytes": 10331,
        "fromNotebook": true
      },
      {
        "path": "04-deploy-mcp-server.md",
        "lang": "markdown",
        "bytes": 2943,
        "fromNotebook": true
      },
      {
        "path": "05-deploy-gateway.md",
        "lang": "markdown",
        "bytes": 4933,
        "fromNotebook": true
      },
      {
        "path": "06-deploy-agent.md",
        "lang": "markdown",
        "bytes": 3407,
        "fromNotebook": true
      },
      {
        "path": "07-streamlit-ui.md",
        "lang": "markdown",
        "bytes": 11260,
        "fromNotebook": true
      },
      {
        "path": "08-optional-cleanup.md",
        "lang": "markdown",
        "bytes": 5774,
        "fromNotebook": true
      },
      {
        "path": "deployment/1-cognito-setup/POST_AUTH_SETUP.md",
        "lang": "markdown",
        "bytes": 6763
      },
      {
        "path": "deployment/1-cognito-setup/check_m2m_client.py",
        "lang": "python",
        "bytes": 6677
      },
      {
        "path": "deployment/1-cognito-setup/cleanup_cognito.py",
        "lang": "python",
        "bytes": 5705
      },
      {
        "path": "deployment/1-cognito-setup/decode_token.py",
        "lang": "python",
        "bytes": 4153
      },
      {
        "path": "deployment/1-cognito-setup/deploy_post_auth_lambda.sh",
        "lang": "bash",
        "bytes": 6348
      },
      {
        "path": "deployment/1-cognito-setup/post_auth_lambda.py",
        "lang": "python",
        "bytes": 2433
      },
      {
        "path": "deployment/1-cognito-setup/setup_cognito.py",
        "lang": "python",
        "bytes": 30754
      },
      {
        "path": "deployment/3-s3tables-setup/cleanup_s3tables.py",
        "lang": "python",
        "bytes": 7871
      },
      {
        "path": "deployment/3-s3tables-setup/integrate_s3tables_lakeformation.py",
        "lang": "python",
        "bytes": 13137
      },
      {
        "path": "deployment/3-s3tables-setup/load_sample_data.py",
        "lang": "python",
        "bytes": 11798
      },
      {
        "path": "deployment/3-s3tables-setup/requirements.txt",
        "lang": "text",
        "bytes": 47
      },
      {
        "path": "deployment/3-s3tables-setup/setup_lakeformation_permissions.py",
        "lang": "python",
        "bytes": 16119
      },
      {
        "path": "deployment/3-s3tables-setup/setup_s3tables.py",
        "lang": "python",
        "bytes": 10346
      },
      {
        "path": "deployment/3-s3tables-setup/verify_setup.py",
        "lang": "python",
        "bytes": 6748
      },
      {
        "path": "deployment/4-mcp-lakehouse-server/TENANT_CREDENTIALS_INTEGRATION.md",
        "lang": "markdown",
        "bytes": 4114
      },
      {
        "path": "deployment/4-mcp-lakehouse-server/athena_tools_secure.py",
        "lang": "python",
        "bytes": 24411
      },
      {
        "path": "deployment/4-mcp-lakehouse-server/check_logs.py",
        "lang": "python",
        "bytes": 6405
      },
      {
        "path": "deployment/4-mcp-lakehouse-server/cleanup_runtime.py",
        "lang": "python",
        "bytes": 5726
      },
      {
        "path": "deployment/4-mcp-lakehouse-server/deploy_runtime.py",
        "lang": "python",
        "bytes": 16737
      },
      {
        "path": "deployment/4-mcp-lakehouse-server/requirements.txt",
        "lang": "text",
        "bytes": 101
      },
      {
        "path": "deployment/4-mcp-lakehouse-server/server.py",
        "lang": "python",
        "bytes": 25072
      },
      {
        "path": "deployment/4-mcp-lakehouse-server/simple_mcp_test.py",
        "lang": "python",
        "bytes": 12382
      },
      {
        "path": "deployment/5-gateway-setup/check_users.py",
        "lang": "python",
        "bytes": 4680
      },
      {
        "path": "deployment/5-gateway-setup/cleanup_gateway.py",
        "lang": "python",
        "bytes": 8498
      },
      {
        "path": "deployment/5-gateway-setup/cleanup_test_users.py",
        "lang": "python",
        "bytes": 3012
      },
      {
        "path": "deployment/5-gateway-setup/create_gateway.py",
        "lang": "python",
        "bytes": 30572
      },
      {
        "path": "deployment/5-gateway-setup/create_lambda_role.py",
        "lang": "python",
        "bytes": 6415
      },
      {
        "path": "deployment/5-gateway-setup/decode_user_token.py",
        "lang": "python",
        "bytes": 8047
      },
      {
        "path": "deployment/5-gateway-setup/interceptor-request/deploy.sh",
        "lang": "bash",
        "bytes": 7470
      },
      {
        "path": "deployment/5-gateway-setup/interceptor-request/lambda_function.py",
        "lang": "python",
        "bytes": 16964
      },
      {
        "path": "deployment/5-gateway-setup/interceptor-request/requirements.txt",
        "lang": "text",
        "bytes": 54
      },
      {
        "path": "deployment/5-gateway-setup/interceptor-request/setup_dynamodb_tenant_role_maps.py",
        "lang": "python",
        "bytes": 15056
      },
      {
        "path": "deployment/5-gateway-setup/interceptor-request/token_exchange.py",
        "lang": "python",
        "bytes": 6052
      },
      {
        "path": "deployment/5-gateway-setup/interceptor-request/tool_validation.py",
        "lang": "python",
        "bytes": 8302
      },
      {
        "path": "deployment/5-gateway-setup/refresh_gateway_target.py",
        "lang": "python",
        "bytes": 4059
      },
      {
        "path": "deployment/5-gateway-setup/test_gateway.py",
        "lang": "python",
        "bytes": 17436
      },
      {
        "path": "deployment/5-gateway-setup/update_interceptor_env.py",
        "lang": "python",
        "bytes": 3612
      },
      {
        "path": "deployment/6-lakehouse-agent/cleanup_agent.py",
        "lang": "python",
        "bytes": 6483
      },
      {
        "path": "deployment/6-lakehouse-agent/deploy_lakehouse_agent.py",
        "lang": "python",
        "bytes": 14469
      },
      {
        "path": "deployment/6-lakehouse-agent/lakehouse_agent.py",
        "lang": "python",
        "bytes": 6304
      },
      {
        "path": "deployment/6-lakehouse-agent/requirements.txt",
        "lang": "text",
        "bytes": 72
      },
      {
        "path": "deployment/README.md",
        "lang": "markdown",
        "bytes": 17185
      },
      {
        "path": "deployment/advanced-agentcore-policy-gateway-interceptor/README.md",
        "lang": "markdown",
        "bytes": 23956
      },
      {
        "path": "deployment/advanced-agentcore-policy-gateway-interceptor/bin/app.ts",
        "lang": "typescript",
        "bytes": 458
      },
      {
        "path": "deployment/advanced-agentcore-policy-gateway-interceptor/lambda/interceptor-request/lambda_function.py",
        "lang": "python",
        "bytes": 19216
      },
      {
        "path": "deployment/advanced-agentcore-policy-gateway-interceptor/lib/policy-stack.ts",
        "lang": "typescript",
        "bytes": 10554
      },
      {
        "path": "deployment/advanced-agentcore-policy-gateway-interceptor/package.json",
        "lang": "json",
        "bytes": 380
      },
      {
        "path": "deployment/advanced-agentcore-policy-gateway-interceptor/scripts/detach-interceptors.py",
        "lang": "python",
        "bytes": 1686
      },
      {
        "path": "deployment/advanced-agentcore-policy-gateway-interceptor/scripts/generate-cdk-context.sh",
        "lang": "bash",
        "bytes": 2424
      },
      {
        "path": "deployment/advanced-agentcore-policy-gateway-interceptor/scripts/pre-deploy.sh",
        "lang": "bash",
        "bytes": 3861
      },
      {
        "path": "deployment/advanced-agentcore-policy-gateway-interceptor/tsconfig.json",
        "lang": "json",
        "bytes": 439
      },
      {
        "path": "deployment/advanced-agentcore-policy-gateway-interceptor/verification/verify_policy.py",
        "lang": "python",
        "bytes": 10877
      },
      {
        "path": "deployment/iam-policies/README.md",
        "lang": "markdown",
        "bytes": 9145
      },
      {
        "path": "deployment/iam-policies/lakehouse-ssm-admin-policy.json",
        "lang": "json",
        "bytes": 1232
      },
      {
        "path": "deployment/iam-policies/lakehouse-ssm-read-policy.json",
        "lang": "json",
        "bytes": 811
      },
      {
        "path": "requirements.txt",
        "lang": "text",
        "bytes": 393
      },
      {
        "path": "scenarios.md",
        "lang": "markdown",
        "bytes": 27742
      },
      {
        "path": "streamlit-ui/requirements.txt",
        "lang": "text",
        "bytes": 49
      },
      {
        "path": "streamlit-ui/streamlit_app.py",
        "lang": "python",
        "bytes": 20024
      },
      {
        "path": "test/check_agent_status.py",
        "lang": "python",
        "bytes": 9781
      },
      {
        "path": "test/check_logs.sh",
        "lang": "bash",
        "bytes": 1165
      },
      {
        "path": "test/test_agent_no_gateway.py",
        "lang": "python",
        "bytes": 3786
      },
      {
        "path": "test/test_agent_simple.py",
        "lang": "python",
        "bytes": 3942
      },
      {
        "path": "test/test_e2e_flow.py",
        "lang": "python",
        "bytes": 4350
      },
      {
        "path": "test/test_e2e_with_user.py",
        "lang": "python",
        "bytes": 6509
      },
      {
        "path": "test/test_ssm_validation.py",
        "lang": "python",
        "bytes": 20950
      },
      {
        "path": "utils/__init__.py",
        "lang": "python",
        "bytes": 0
      },
      {
        "path": "utils/aws_session_utils.py",
        "lang": "python",
        "bytes": 19883
      },
      {
        "path": "utils/check_runtime.py",
        "lang": "python",
        "bytes": 843
      },
      {
        "path": "utils/diagnose_auth_issue.py",
        "lang": "python",
        "bytes": 7885
      },
      {
        "path": "utils/find_all_runtimes.py",
        "lang": "python",
        "bytes": 6639
      },
      {
        "path": "utils/notebook_init.py",
        "lang": "python",
        "bytes": 2078
      }
    ]
  },
  {
    "slug": "02-use-cases/01-conversational-agents/lakehouse-agent/deployment/2-lakehouse-tenant-roles-setup",
    "title": "IAM Roles Setup for Lakehouse Agent",
    "desc": "This directory contains scripts to set up IAM roles for tenant-based access control in the lakehouse agent system.",
    "sectionId": null,
    "kind": "use-case",
    "frameworks": [],
    "languages": [
      "python"
    ],
    "hasNotebook": false,
    "readme": "/agentcore-samples/02-use-cases/01-conversational-agents/lakehouse-agent/deployment/2-lakehouse-tenant-roles-setup/README.md",
    "base": "/agentcore-samples/02-use-cases/01-conversational-agents/lakehouse-agent/deployment/2-lakehouse-tenant-roles-setup",
    "files": [
      {
        "path": "cleanup_iam_roles.py",
        "lang": "python",
        "bytes": 3785
      },
      {
        "path": "setup_iam_roles.py",
        "lang": "python",
        "bytes": 17546
      }
    ]
  },
  {
    "slug": "02-use-cases/01-conversational-agents/lakehouse-agent/deployment/5-gateway-setup/interceptor-response",
    "title": "Install dependencies",
    "desc": "aws logs tail /aws/lambda/lakehouse-gateway-response-interceptor --follow",
    "sectionId": "gateway",
    "kind": "use-case",
    "frameworks": [],
    "languages": [
      "python"
    ],
    "hasNotebook": false,
    "readme": "/agentcore-samples/02-use-cases/01-conversational-agents/lakehouse-agent/deployment/5-gateway-setup/interceptor-response/README.md",
    "base": "/agentcore-samples/02-use-cases/01-conversational-agents/lakehouse-agent/deployment/5-gateway-setup/interceptor-response",
    "files": [
      {
        "path": "deploy.sh",
        "lang": "bash",
        "bytes": 6889
      },
      {
        "path": "lambda_function.py",
        "lang": "python",
        "bytes": 17851
      },
      {
        "path": "requirements.txt",
        "lang": "text",
        "bytes": 55
      }
    ]
  },
  {
    "slug": "02-use-cases/01-conversational-agents/market-trends-agent",
    "title": "Market Trends Agent",
    "desc": "This use case implements an intelligent financial analysis agent using Amazon Bedrock AgentCore that provides real-time market intelligence, stock analysis, and personalized investment...",
    "sectionId": null,
    "kind": "use-case",
    "frameworks": [
      "Strands",
      "LangGraph",
      "LangChain"
    ],
    "languages": [
      "python"
    ],
    "hasNotebook": false,
    "readme": "/agentcore-samples/02-use-cases/01-conversational-agents/market-trends-agent/README.md",
    "base": "/agentcore-samples/02-use-cases/01-conversational-agents/market-trends-agent",
    "files": [
      {
        "path": "cleanup.py",
        "lang": "python",
        "bytes": 14923
      },
      {
        "path": "deploy.py",
        "lang": "python",
        "bytes": 27266
      },
      {
        "path": "evaluators/custom_evaluators.py",
        "lang": "python",
        "bytes": 21751
      },
      {
        "path": "evaluators/iam/permissions-policy.json",
        "lang": "json",
        "bytes": 893
      },
      {
        "path": "evaluators/iam/trust-policy.json",
        "lang": "json",
        "bytes": 255
      },
      {
        "path": "evaluators/pii_comprehend/lambda_function.py",
        "lang": "python",
        "bytes": 5563
      },
      {
        "path": "evaluators/pii_regex/lambda_function.py",
        "lang": "python",
        "bytes": 4118
      },
      {
        "path": "evaluators/schema_validator/lambda_function.py",
        "lang": "python",
        "bytes": 8313
      },
      {
        "path": "evaluators/scripts/deploy.py",
        "lang": "python",
        "bytes": 14522
      },
      {
        "path": "evaluators/scripts/invoke.py",
        "lang": "python",
        "bytes": 4722
      },
      {
        "path": "evaluators/scripts/results.py",
        "lang": "python",
        "bytes": 3550
      },
      {
        "path": "evaluators/stock_price_drift/lambda_function.py",
        "lang": "python",
        "bytes": 8036
      },
      {
        "path": "evaluators/workflow_contract_gsr/lambda_function.py",
        "lang": "python",
        "bytes": 6075
      },
      {
        "path": "market_trends_agent.py",
        "lang": "python",
        "bytes": 14395
      },
      {
        "path": "optimization/manage_dataset.py",
        "lang": "python",
        "bytes": 20665
      },
      {
        "path": "optimization/optimize_agent.py",
        "lang": "python",
        "bytes": 71918
      },
      {
        "path": "optimization/user_simulated_dataset.py",
        "lang": "python",
        "bytes": 21212
      },
      {
        "path": "pyproject.toml",
        "lang": "toml",
        "bytes": 2052
      },
      {
        "path": "requirements.txt",
        "lang": "text",
        "bytes": 100
      },
      {
        "path": "tools/__init__.py",
        "lang": "python",
        "bytes": 960
      },
      {
        "path": "tools/broker_card_tools.py",
        "lang": "python",
        "bytes": 9021
      },
      {
        "path": "tools/browser_tool.py",
        "lang": "python",
        "bytes": 10647
      },
      {
        "path": "tools/memory_tools.py",
        "lang": "python",
        "bytes": 15285
      }
    ]
  },
  {
    "slug": "02-use-cases/01-conversational-agents/video-games-sales-assistant/amplify-video-games-sales-assistant-agentcore-strands",
    "title": "Front-End Implementation - Integrating AgentCore with a Ready-to-Use Data Analyst Assistant Application (Next.js)",
    "desc": "This tutorial guides you through setting up a Next.js web application that integrates with your Amazon Bedrock AgentCore deployment, creating a Data Analyst Assistant for Video Game Sales.",
    "sectionId": null,
    "kind": "use-case",
    "frameworks": [
      "Strands"
    ],
    "languages": [
      "tsx",
      "typescript"
    ],
    "hasNotebook": false,
    "readme": "/agentcore-samples/02-use-cases/01-conversational-agents/video-games-sales-assistant/amplify-video-games-sales-assistant-agentcore-strands/README.md",
    "base": "/agentcore-samples/02-use-cases/01-conversational-agents/video-games-sales-assistant/amplify-video-games-sales-assistant-agentcore-strands",
    "files": [
      {
        "path": "amplify.yml",
        "lang": "yaml",
        "bytes": 843
      },
      {
        "path": "amplify/auth/resource.ts",
        "lang": "typescript",
        "bytes": 214
      },
      {
        "path": "amplify/backend.ts",
        "lang": "typescript",
        "bytes": 4602
      },
      {
        "path": "amplify/package.json",
        "lang": "json",
        "bytes": 23
      },
      {
        "path": "amplify/tsconfig.json",
        "lang": "json",
        "bytes": 270
      },
      {
        "path": "package.json",
        "lang": "json",
        "bytes": 1659
      },
      {
        "path": "pnpm-workspace.yaml",
        "lang": "yaml",
        "bytes": 54
      },
      {
        "path": "src/app/amplify-theme.css",
        "lang": "css",
        "bytes": 8379
      },
      {
        "path": "src/app/api/agent/query-results/route.ts",
        "lang": "typescript",
        "bytes": 1769
      },
      {
        "path": "src/app/app/AppPageClient.tsx",
        "lang": "tsx",
        "bytes": 704
      },
      {
        "path": "src/app/app/assistant/AssistantClient.tsx",
        "lang": "tsx",
        "bytes": 6091
      },
      {
        "path": "src/app/app/assistant/page.tsx",
        "lang": "tsx",
        "bytes": 957
      },
      {
        "path": "src/app/app/page.tsx",
        "lang": "tsx",
        "bytes": 288
      },
      {
        "path": "src/app/components/AmplifyProvider.tsx",
        "lang": "tsx",
        "bytes": 405
      },
      {
        "path": "src/app/components/AuthWrapper.tsx",
        "lang": "tsx",
        "bytes": 1490
      },
      {
        "path": "src/app/components/ProtectedRoute.tsx",
        "lang": "tsx",
        "bytes": 2571
      },
      {
        "path": "src/app/components/assistant/Assistant.tsx",
        "lang": "tsx",
        "bytes": 829
      },
      {
        "path": "src/app/components/assistant/index.ts",
        "lang": "typescript",
        "bytes": 100
      },
      {
        "path": "src/app/components/assistant/services/agent-core-call.ts",
        "lang": "typescript",
        "bytes": 10454
      },
      {
        "path": "src/app/components/assistant/services/aws-calls.ts",
        "lang": "typescript",
        "bytes": 6108
      },
      {
        "path": "src/app/components/assistant/types.ts",
        "lang": "typescript",
        "bytes": 1397
      },
      {
        "path": "src/app/components/assistant/ui/Chat.tsx",
        "lang": "tsx",
        "bytes": 23570
      },
      {
        "path": "src/app/components/assistant/ui/LoadingIndicator.tsx",
        "lang": "tsx",
        "bytes": 736
      },
      {
        "path": "src/app/components/assistant/ui/MarkdownRenderer.tsx",
        "lang": "tsx",
        "bytes": 2735
      },
      {
        "path": "src/app/components/assistant/ui/MyChart.tsx",
        "lang": "tsx",
        "bytes": 2639
      },
      {
        "path": "src/app/components/assistant/ui/QueryResultsDisplay.tsx",
        "lang": "tsx",
        "bytes": 5402
      },
      {
        "path": "src/app/components/assistant/ui/TableView.tsx",
        "lang": "tsx",
        "bytes": 4996
      },
      {
        "path": "src/app/components/assistant/ui/ToolBox.tsx",
        "lang": "tsx",
        "bytes": 2653
      },
      {
        "path": "src/app/components/assistant/utils.ts",
        "lang": "typescript",
        "bytes": 6044
      },
      {
        "path": "src/app/globals.css",
        "lang": "css",
        "bytes": 2620
      },
      {
        "path": "src/app/layout.tsx",
        "lang": "tsx",
        "bytes": 1098
      },
      {
        "path": "src/app/page.tsx",
        "lang": "tsx",
        "bytes": 161
      },
      {
        "path": "src/utils/aws-client.ts",
        "lang": "typescript",
        "bytes": 2034
      },
      {
        "path": "tsconfig.json",
        "lang": "json",
        "bytes": 717
      }
    ]
  },
  {
    "slug": "02-use-cases/01-conversational-agents/video-games-sales-assistant/cdk-data-analyst-assistant-agentcore-strands",
    "title": "Data Analyst Assistant - Amazon Bedrock AgentCore and Data Source Deployment with CDK",
    "desc": "Deploy the complete infrastructure for a Data Analyst Assistant for Video Game Sales using AWS Cloud Development Kit (CDK) and Amazon Bedrock AgentCore.",
    "sectionId": null,
    "kind": "use-case",
    "frameworks": [
      "Strands"
    ],
    "languages": [
      "javascript",
      "python",
      "typescript"
    ],
    "hasNotebook": false,
    "readme": "/agentcore-samples/02-use-cases/01-conversational-agents/video-games-sales-assistant/cdk-data-analyst-assistant-agentcore-strands/README.md",
    "base": "/agentcore-samples/02-use-cases/01-conversational-agents/video-games-sales-assistant/cdk-data-analyst-assistant-agentcore-strands",
    "files": [
      {
        "path": "bin/cdk-data-analyst-assistant-agentcore-strands.ts",
        "lang": "typescript",
        "bytes": 1052
      },
      {
        "path": "cdk.json",
        "lang": "json",
        "bytes": 5485
      },
      {
        "path": "cdklib/cdk-data-analyst-assistant-agentcore-strands-stack.ts",
        "lang": "typescript",
        "bytes": 22304
      },
      {
        "path": "jest.config.js",
        "lang": "javascript",
        "bytes": 157
      },
      {
        "path": "package.json",
        "lang": "json",
        "bytes": 692
      },
      {
        "path": "resources/create-readonly-user.py",
        "lang": "python",
        "bytes": 2713
      },
      {
        "path": "resources/create-sales-database.py",
        "lang": "python",
        "bytes": 4275
      },
      {
        "path": "test/cdk-data-analyst-assistant-agentcore-strands.test.ts",
        "lang": "typescript",
        "bytes": 748
      },
      {
        "path": "tsconfig.json",
        "lang": "json",
        "bytes": 712
      }
    ]
  },
  {
    "slug": "02-use-cases/01-conversational-agents/video-games-sales-assistant/cdk-data-analyst-assistant-agentcore-strands/data-analyst-assistant-agentcore-strands",
    "title": "Data Analyst Assistant - Strands Agent",
    "desc": "A video games sales data analyst assistant built with the Strands Agents SDK and powered by Amazon Bedrock AgentCore.",
    "sectionId": null,
    "kind": "use-case",
    "frameworks": [
      "Strands"
    ],
    "languages": [
      "python"
    ],
    "hasNotebook": false,
    "readme": "/agentcore-samples/02-use-cases/01-conversational-agents/video-games-sales-assistant/cdk-data-analyst-assistant-agentcore-strands/data-analyst-assistant-agentcore-strands/README.md",
    "base": "/agentcore-samples/02-use-cases/01-conversational-agents/video-games-sales-assistant/cdk-data-analyst-assistant-agentcore-strands/data-analyst-assistant-agentcore-strands",
    "files": [
      {
        "path": "app.py",
        "lang": "python",
        "bytes": 12256
      },
      {
        "path": "instructions.txt",
        "lang": "text",
        "bytes": 3298
      },
      {
        "path": "requirements.txt",
        "lang": "text",
        "bytes": 109
      },
      {
        "path": "resources/memory_manager.py",
        "lang": "python",
        "bytes": 5797
      },
      {
        "path": "src/tools/__init__.py",
        "lang": "python",
        "bytes": 154
      },
      {
        "path": "src/tools/get_tables_information.py",
        "lang": "python",
        "bytes": 1146
      },
      {
        "path": "src/tools/rds_data_api.py",
        "lang": "python",
        "bytes": 3477
      },
      {
        "path": "src/tools/tables_information.txt",
        "lang": "text",
        "bytes": 1673
      },
      {
        "path": "src/utils/__init__.py",
        "lang": "python",
        "bytes": 152
      },
      {
        "path": "src/utils/file_utils.py",
        "lang": "python",
        "bytes": 897
      },
      {
        "path": "src/utils/utils.py",
        "lang": "python",
        "bytes": 2039
      }
    ]
  },
  {
    "slug": "02-use-cases/02-workflow-automation-agents/event-driven-claims-agent",
    "title": "Event-Driven Claims Processing Agent",
    "desc": "An event-driven insurance claims processing system built on Amazon Bedrock AgentCore. Claims arrive via email, are processed by a dual-agent architecture (Claims Processor + Validation Agent), and...",
    "sectionId": null,
    "kind": "use-case",
    "frameworks": [
      "Strands"
    ],
    "languages": [
      "python",
      "typescript"
    ],
    "hasNotebook": false,
    "readme": "/agentcore-samples/02-use-cases/02-workflow-automation-agents/event-driven-claims-agent/README.md",
    "base": "/agentcore-samples/02-use-cases/02-workflow-automation-agents/event-driven-claims-agent",
    "files": [
      {
        "path": "AGENTS.md",
        "lang": "markdown",
        "bytes": 12822
      },
      {
        "path": "agentcore/agentcore.json",
        "lang": "json",
        "bytes": 7500
      },
      {
        "path": "agentcore/cdk/bin/cdk.ts",
        "lang": "typescript",
        "bytes": 3132
      },
      {
        "path": "agentcore/cdk/cdk.json",
        "lang": "json",
        "bytes": 637
      },
      {
        "path": "agentcore/cdk/lib/cdk-stack.ts",
        "lang": "typescript",
        "bytes": 9432
      },
      {
        "path": "agentcore/cdk/lib/infra-construct.ts",
        "lang": "typescript",
        "bytes": 11335
      },
      {
        "path": "agentcore/cdk/package.json",
        "lang": "json",
        "bytes": 494
      },
      {
        "path": "agentcore/cdk/tsconfig.json",
        "lang": "json",
        "bytes": 757
      },
      {
        "path": "deploy.sh",
        "lang": "bash",
        "bytes": 8121
      },
      {
        "path": "destroy.sh",
        "lang": "bash",
        "bytes": 1695
      },
      {
        "path": "docs/ARCHITECTURE.md",
        "lang": "markdown",
        "bytes": 11452
      },
      {
        "path": "docs/CONFIGURATION.md",
        "lang": "markdown",
        "bytes": 16542
      },
      {
        "path": "docs/README.md",
        "lang": "markdown",
        "bytes": 1738
      },
      {
        "path": "docs/decisions/0001-agentcore-cli-plus-cdk.md",
        "lang": "markdown",
        "bytes": 3346
      },
      {
        "path": "docs/decisions/0002-dual-agent-over-single-agent.md",
        "lang": "markdown",
        "bytes": 1251
      },
      {
        "path": "docs/decisions/0003-gateway-lambda-targets-over-co-located-tools.md",
        "lang": "markdown",
        "bytes": 2368
      },
      {
        "path": "docs/decisions/0004-cognito-m2m-over-iam-auth.md",
        "lang": "markdown",
        "bytes": 3123
      },
      {
        "path": "docs/decisions/0005-container-build-over-codezip.md",
        "lang": "markdown",
        "bytes": 1110
      },
      {
        "path": "docs/decisions/0006-s3-eventbridge-over-ses-lambda.md",
        "lang": "markdown",
        "bytes": 1025
      },
      {
        "path": "docs/decisions/0007-explicit-cognito-pool-for-gateway-auth.md",
        "lang": "markdown",
        "bytes": 1868
      },
      {
        "path": "docs/decisions/0008-semantic-summarization-memory.md",
        "lang": "markdown",
        "bytes": 995
      },
      {
        "path": "docs/decisions/0009-ignore-all-findings-policy-validation.md",
        "lang": "markdown",
        "bytes": 1918
      },
      {
        "path": "docs/decisions/0010-identity-token-vault-for-secrets.md",
        "lang": "markdown",
        "bytes": 3058
      },
      {
        "path": "docs/decisions/0011-externalized-configuration.md",
        "lang": "markdown",
        "bytes": 3730
      },
      {
        "path": "docs/decisions/0012-gsi-over-scan-for-status-queries.md",
        "lang": "markdown",
        "bytes": 1639
      },
      {
        "path": "docs/decisions/0013-cost-routing-fast-model-for-validator.md",
        "lang": "markdown",
        "bytes": 2240
      },
      {
        "path": "docs/decisions/0014-deterministic-phase3-no-llm.md",
        "lang": "markdown",
        "bytes": 3051
      },
      {
        "path": "docs/decisions/README.md",
        "lang": "markdown",
        "bytes": 2982
      },
      {
        "path": "docs/deployment.md",
        "lang": "markdown",
        "bytes": 17533
      },
      {
        "path": "docs/diagrams/architecture.py",
        "lang": "python",
        "bytes": 4374
      },
      {
        "path": "docs/tutorial.md",
        "lang": "markdown",
        "bytes": 16565
      },
      {
        "path": "lambdas/create_claim/handler.py",
        "lang": "python",
        "bytes": 1506
      },
      {
        "path": "lambdas/human_review/handler.py",
        "lang": "python",
        "bytes": 1230
      },
      {
        "path": "lambdas/list_pending_claims/handler.py",
        "lang": "python",
        "bytes": 1508
      },
      {
        "path": "lambdas/notification/handler.py",
        "lang": "python",
        "bytes": 2323
      },
      {
        "path": "lambdas/policy_lookup/handler.py",
        "lang": "python",
        "bytes": 556
      },
      {
        "path": "lambdas/resolve_claim/handler.py",
        "lang": "python",
        "bytes": 2574
      },
      {
        "path": "lambdas/schemas/create_claim.json",
        "lang": "json",
        "bytes": 858
      },
      {
        "path": "lambdas/schemas/human_review.json",
        "lang": "json",
        "bytes": 460
      },
      {
        "path": "lambdas/schemas/list_pending_claims.json",
        "lang": "json",
        "bytes": 179
      },
      {
        "path": "lambdas/schemas/notification.json",
        "lang": "json",
        "bytes": 425
      },
      {
        "path": "lambdas/schemas/policy_lookup.json",
        "lang": "json",
        "bytes": 276
      },
      {
        "path": "lambdas/schemas/resolve_claim.json",
        "lang": "json",
        "bytes": 497
      },
      {
        "path": "lambdas/trigger/handler.py",
        "lang": "python",
        "bytes": 5479
      },
      {
        "path": "scripts/analyze_traces.py",
        "lang": "python",
        "bytes": 6949
      },
      {
        "path": "scripts/cleanup_agentcore.py",
        "lang": "python",
        "bytes": 11031
      },
      {
        "path": "scripts/destroy.sh",
        "lang": "bash",
        "bytes": 1458
      },
      {
        "path": "scripts/disable_observability.py",
        "lang": "python",
        "bytes": 3815
      },
      {
        "path": "scripts/enable_observability.py",
        "lang": "python",
        "bytes": 10156
      },
      {
        "path": "scripts/fix_credential_region.sh",
        "lang": "bash",
        "bytes": 2017
      },
      {
        "path": "scripts/get_token.py",
        "lang": "python",
        "bytes": 2147
      },
      {
        "path": "scripts/lint.sh",
        "lang": "bash",
        "bytes": 781
      },
      {
        "path": "scripts/seed_dynamodb.py",
        "lang": "python",
        "bytes": 3165
      },
      {
        "path": "scripts/setup_cognito.sh",
        "lang": "bash",
        "bytes": 5494
      },
      {
        "path": "scripts/teardown_cognito.sh",
        "lang": "bash",
        "bytes": 1738
      },
      {
        "path": "scripts/test_auth.py",
        "lang": "python",
        "bytes": 15984
      },
      {
        "path": "scripts/test_cedar.py",
        "lang": "python",
        "bytes": 7333
      },
      {
        "path": "scripts/test_e2e.py",
        "lang": "python",
        "bytes": 20569
      },
      {
        "path": "scripts/test_invoke.py",
        "lang": "python",
        "bytes": 4085
      },
      {
        "path": "scripts/test_local.py",
        "lang": "python",
        "bytes": 3233
      },
      {
        "path": "tests/sample-claim-email.txt",
        "lang": "text",
        "bytes": 544
      },
      {
        "path": "tests/test_lambda_handlers.py",
        "lang": "python",
        "bytes": 5954
      },
      {
        "path": "tests/test_routing.py",
        "lang": "python",
        "bytes": 4758
      },
      {
        "path": "tests/test_structured_output.py",
        "lang": "python",
        "bytes": 5123
      },
      {
        "path": "tests/test_trigger.py",
        "lang": "python",
        "bytes": 2812
      }
    ]
  },
  {
    "slug": "02-use-cases/02-workflow-automation-agents/event-driven-claims-agent/app/claimsagent",
    "title": "Layout",
    "desc": "This is a project generated by the AgentCore CLI!",
    "sectionId": null,
    "kind": "use-case",
    "frameworks": [
      "Strands"
    ],
    "languages": [
      "python"
    ],
    "hasNotebook": false,
    "readme": "/agentcore-samples/02-use-cases/02-workflow-automation-agents/event-driven-claims-agent/app/claimsagent/README.md",
    "base": "/agentcore-samples/02-use-cases/02-workflow-automation-agents/event-driven-claims-agent/app/claimsagent",
    "files": [
      {
        "path": "config.py",
        "lang": "python",
        "bytes": 3295
      },
      {
        "path": "main.py",
        "lang": "python",
        "bytes": 19195
      },
      {
        "path": "memory/__init__.py",
        "lang": "python",
        "bytes": 0
      },
      {
        "path": "memory/session.py",
        "lang": "python",
        "bytes": 2188
      },
      {
        "path": "pyproject.toml",
        "lang": "toml",
        "bytes": 503
      },
      {
        "path": "requirements.txt",
        "lang": "text",
        "bytes": 296
      },
      {
        "path": "routing.py",
        "lang": "python",
        "bytes": 3095
      },
      {
        "path": "tools/__init__.py",
        "lang": "python",
        "bytes": 67
      },
      {
        "path": "tools/structured_output.py",
        "lang": "python",
        "bytes": 3325
      }
    ]
  },
  {
    "slug": "02-use-cases/02-workflow-automation-agents/it-incident-response-agent/agentcore/.llm-context",
    "title": "LLM Context Files",
    "desc": "DO NOT EDIT THESE FILES - They are read-only reference for AI coding assistants.",
    "sectionId": null,
    "kind": "use-case",
    "frameworks": [
      "OpenAI Agents"
    ],
    "languages": [
      "typescript"
    ],
    "hasNotebook": false,
    "readme": "/agentcore-samples/02-use-cases/02-workflow-automation-agents/it-incident-response-agent/agentcore/.llm-context/README.md",
    "base": "/agentcore-samples/02-use-cases/02-workflow-automation-agents/it-incident-response-agent/agentcore/.llm-context",
    "files": [
      {
        "path": "agentcore.ts",
        "lang": "typescript",
        "bytes": 5263
      },
      {
        "path": "aws-targets.ts",
        "lang": "typescript",
        "bytes": 2039
      }
    ]
  },
  {
    "slug": "02-use-cases/02-workflow-automation-agents/it-incident-response-agent/agentcore/cdk",
    "title": "AgentCore CDK Project",
    "desc": "This CDK project is managed by the AgentCore CLI. It deploys your agent infrastructure into AWS using the @aws/agentcore-cdk L3 constructs.",
    "sectionId": null,
    "kind": "use-case",
    "frameworks": [],
    "languages": [
      "javascript",
      "typescript"
    ],
    "hasNotebook": false,
    "readme": "/agentcore-samples/02-use-cases/02-workflow-automation-agents/it-incident-response-agent/agentcore/cdk/README.md",
    "base": "/agentcore-samples/02-use-cases/02-workflow-automation-agents/it-incident-response-agent/agentcore/cdk",
    "files": [
      {
        "path": "bin/cdk.ts",
        "lang": "typescript",
        "bytes": 6367
      },
      {
        "path": "cdk.json",
        "lang": "json",
        "bytes": 5487
      },
      {
        "path": "jest.config.js",
        "lang": "javascript",
        "bytes": 225
      },
      {
        "path": "lib/cdk-stack.ts",
        "lang": "typescript",
        "bytes": 24930
      },
      {
        "path": "lib/infra-construct.ts",
        "lang": "typescript",
        "bytes": 22998
      },
      {
        "path": "package.json",
        "lang": "json",
        "bytes": 912
      },
      {
        "path": "test/cdk.test.ts",
        "lang": "typescript",
        "bytes": 760
      },
      {
        "path": "tsconfig.json",
        "lang": "json",
        "bytes": 770
      }
    ]
  },
  {
    "slug": "02-use-cases/02-workflow-automation-agents/it-incident-response-agent/app/ITIncidentAgent",
    "title": "IT Incident Response Agent — Runtime Code",
    "desc": "This directory contains the agent code deployed to AgentCore Runtime as a container.",
    "sectionId": null,
    "kind": "use-case",
    "frameworks": [
      "Strands"
    ],
    "languages": [
      "python"
    ],
    "hasNotebook": false,
    "readme": "/agentcore-samples/02-use-cases/02-workflow-automation-agents/it-incident-response-agent/app/ITIncidentAgent/README.md",
    "base": "/agentcore-samples/02-use-cases/02-workflow-automation-agents/it-incident-response-agent/app/ITIncidentAgent",
    "files": [
      {
        "path": "config.py",
        "lang": "python",
        "bytes": 3413
      },
      {
        "path": "main.py",
        "lang": "python",
        "bytes": 27122
      },
      {
        "path": "mcp_client/__init__.py",
        "lang": "python",
        "bytes": 80
      },
      {
        "path": "mcp_client/client.py",
        "lang": "python",
        "bytes": 7726
      },
      {
        "path": "mcp_client/jira.py",
        "lang": "python",
        "bytes": 3276
      },
      {
        "path": "memory/__init__.py",
        "lang": "python",
        "bytes": 77
      },
      {
        "path": "memory/enrichment.py",
        "lang": "python",
        "bytes": 3815
      },
      {
        "path": "memory/session.py",
        "lang": "python",
        "bytes": 1301
      },
      {
        "path": "model/__init__.py",
        "lang": "python",
        "bytes": 73
      },
      {
        "path": "model/load.py",
        "lang": "python",
        "bytes": 1140
      },
      {
        "path": "pyproject.toml",
        "lang": "toml",
        "bytes": 504
      }
    ]
  },
  {
    "slug": "02-use-cases/02-workflow-automation-agents/multi-isv-orchestration",
    "title": "Amazon Bedrock AgentCore Gateway — Multi-ISV Orchestration (Salesforce + SAP)",
    "desc": "This tutorial series demonstrates how to connect multiple ISV SaaS platforms (Salesforce Lightning Platform and AWS for SAP MCP Server) to a single Amazon Bedrock AgentCore Gateway, enabling...",
    "sectionId": null,
    "kind": "use-case",
    "frameworks": [
      "Strands"
    ],
    "languages": [
      "python"
    ],
    "hasNotebook": true,
    "readme": "/agentcore-samples/02-use-cases/02-workflow-automation-agents/multi-isv-orchestration/README.md",
    "base": "/agentcore-samples/02-use-cases/02-workflow-automation-agents/multi-isv-orchestration",
    "files": [
      {
        "path": "01-salesforce-gateway-target.md",
        "lang": "markdown",
        "bytes": 22567,
        "fromNotebook": true
      },
      {
        "path": "02-sap-mcp-server-target.md",
        "lang": "markdown",
        "bytes": 15581,
        "fromNotebook": true
      },
      {
        "path": "03-cross-isv-queries.md",
        "lang": "markdown",
        "bytes": 12617,
        "fromNotebook": true
      },
      {
        "path": "diagrams.py",
        "lang": "python",
        "bytes": 3483
      },
      {
        "path": "gateway_mcp_client.py",
        "lang": "python",
        "bytes": 5013
      },
      {
        "path": "requirements.txt",
        "lang": "text",
        "bytes": 93
      },
      {
        "path": "ruff.toml",
        "lang": "toml",
        "bytes": 43
      }
    ]
  },
  {
    "slug": "02-use-cases/02-workflow-automation-agents/receipts-intelligent-document-processing-agent",
    "title": "Receipts IDP on Amazon Bedrock AgentCore",
    "desc": "An agentic Intelligent Document Processing sample: a dual-agent pipeline on AgentCore that turns a receipt into a validated, persisted expense record, and self-protects with a model degradation...",
    "sectionId": null,
    "kind": "use-case",
    "frameworks": [
      "Strands",
      "AutoGen"
    ],
    "languages": [
      "python",
      "typescript"
    ],
    "hasNotebook": false,
    "readme": "/agentcore-samples/02-use-cases/02-workflow-automation-agents/receipts-intelligent-document-processing-agent/README.md",
    "base": "/agentcore-samples/02-use-cases/02-workflow-automation-agents/receipts-intelligent-document-processing-agent",
    "files": [
      {
        "path": "AGENTS.md",
        "lang": "markdown",
        "bytes": 2143
      },
      {
        "path": "agentcore/agentcore.json",
        "lang": "json",
        "bytes": 7253
      },
      {
        "path": "agentcore/cdk/bin/cdk.ts",
        "lang": "typescript",
        "bytes": 2010
      },
      {
        "path": "agentcore/cdk/cdk.json",
        "lang": "json",
        "bytes": 637
      },
      {
        "path": "agentcore/cdk/package.json",
        "lang": "json",
        "bytes": 470
      },
      {
        "path": "agentcore/cdk/tsconfig.json",
        "lang": "json",
        "bytes": 757
      },
      {
        "path": "deploy.sh",
        "lang": "bash",
        "bytes": 2812
      },
      {
        "path": "destroy.sh",
        "lang": "bash",
        "bytes": 5275
      },
      {
        "path": "docs/ARCHITECTURE.md",
        "lang": "markdown",
        "bytes": 8253
      },
      {
        "path": "docs/CONFIGURATION.md",
        "lang": "markdown",
        "bytes": 5982
      },
      {
        "path": "docs/decisions/0001-agentcore-cli-plus-cdk.md",
        "lang": "markdown",
        "bytes": 3357
      },
      {
        "path": "docs/decisions/0002-dual-agent-over-single-agent.md",
        "lang": "markdown",
        "bytes": 1989
      },
      {
        "path": "docs/decisions/0003-gateway-lambda-targets-over-co-located-tools.md",
        "lang": "markdown",
        "bytes": 1877
      },
      {
        "path": "docs/decisions/0004-agent-as-principal-m2m-over-per-user-jwt.md",
        "lang": "markdown",
        "bytes": 2190
      },
      {
        "path": "docs/decisions/0005-container-build-over-codezip.md",
        "lang": "markdown",
        "bytes": 1410
      },
      {
        "path": "docs/decisions/0006-s3-eventbridge-over-direct-invoke.md",
        "lang": "markdown",
        "bytes": 1917
      },
      {
        "path": "docs/decisions/0007-degradation-ladder-on-503.md",
        "lang": "markdown",
        "bytes": 3685
      },
      {
        "path": "docs/decisions/0008-appconfig-over-hand-rolled-flags.md",
        "lang": "markdown",
        "bytes": 2462
      },
      {
        "path": "docs/decisions/0009-appconfigdata-not-lambda-extension.md",
        "lang": "markdown",
        "bytes": 2177
      },
      {
        "path": "docs/decisions/0010-two-rung-setting-paths.md",
        "lang": "markdown",
        "bytes": 3271
      },
      {
        "path": "docs/decisions/0011-l4-sqs-jittered-drain.md",
        "lang": "markdown",
        "bytes": 2532
      },
      {
        "path": "docs/decisions/0012-cedar-on-tool-input.md",
        "lang": "markdown",
        "bytes": 3295
      },
      {
        "path": "docs/decisions/0013-ignore-all-findings-policy-validation.md",
        "lang": "markdown",
        "bytes": 1947
      },
      {
        "path": "docs/decisions/0014-cognito-secret-via-cdk-injection.md",
        "lang": "markdown",
        "bytes": 1744
      },
      {
        "path": "docs/decisions/0015-processing-runs-ledger.md",
        "lang": "markdown",
        "bytes": 3873
      },
      {
        "path": "docs/decisions/0016-conversational-identity-no-idor.md",
        "lang": "markdown",
        "bytes": 5666
      },
      {
        "path": "docs/decisions/README.md",
        "lang": "markdown",
        "bytes": 3697
      },
      {
        "path": "docs/deployment.md",
        "lang": "markdown",
        "bytes": 5171
      },
      {
        "path": "docs/tutorial.md",
        "lang": "markdown",
        "bytes": 5404
      },
      {
        "path": "lambdas/controller/handler.py",
        "lang": "python",
        "bytes": 5861
      },
      {
        "path": "lambdas/drain/handler.py",
        "lang": "python",
        "bytes": 3207
      },
      {
        "path": "lambdas/get_recent_expenses/handler.py",
        "lang": "python",
        "bytes": 963
      },
      {
        "path": "lambdas/get_user_profile/handler.py",
        "lang": "python",
        "bytes": 737
      },
      {
        "path": "lambdas/human_review/handler.py",
        "lang": "python",
        "bytes": 2310
      },
      {
        "path": "lambdas/ledger_writer/handler.py",
        "lang": "python",
        "bytes": 2898
      },
      {
        "path": "lambdas/lookup_merchant/handler.py",
        "lang": "python",
        "bytes": 1278
      },
      {
        "path": "lambdas/save_expense/handler.py",
        "lang": "python",
        "bytes": 2771
      },
      {
        "path": "lambdas/schemas/get_recent_expenses.json",
        "lang": "json",
        "bytes": 438
      },
      {
        "path": "lambdas/schemas/get_user_profile.json",
        "lang": "json",
        "bytes": 328
      },
      {
        "path": "lambdas/schemas/human_review.json",
        "lang": "json",
        "bytes": 1204
      },
      {
        "path": "lambdas/schemas/lookup_merchant.json",
        "lang": "json",
        "bytes": 385
      },
      {
        "path": "lambdas/schemas/save_expense.json",
        "lang": "json",
        "bytes": 1628
      },
      {
        "path": "lambdas/trigger/handler.py",
        "lang": "python",
        "bytes": 3388
      },
      {
        "path": "pytest.ini",
        "lang": "text",
        "bytes": 166
      },
      {
        "path": "scripts/ask.py",
        "lang": "python",
        "bytes": 3117
      },
      {
        "path": "scripts/chat.py",
        "lang": "python",
        "bytes": 1308
      },
      {
        "path": "scripts/e2e.sh",
        "lang": "bash",
        "bytes": 1735
      },
      {
        "path": "scripts/receipt_status.py",
        "lang": "python",
        "bytes": 2623
      },
      {
        "path": "scripts/seed_dynamodb.py",
        "lang": "python",
        "bytes": 1072
      },
      {
        "path": "scripts/test_invoke.py",
        "lang": "python",
        "bytes": 1719
      },
      {
        "path": "scripts/upload_sample_receipt.py",
        "lang": "python",
        "bytes": 921
      },
      {
        "path": "scripts/user-demo.sh",
        "lang": "bash",
        "bytes": 11314
      },
      {
        "path": "tests/conftest.py",
        "lang": "python",
        "bytes": 580
      },
      {
        "path": "tests/test_config_seam.py",
        "lang": "python",
        "bytes": 1848
      },
      {
        "path": "tests/test_controller.py",
        "lang": "python",
        "bytes": 2070
      },
      {
        "path": "tests/test_e2e_cedar_live.py",
        "lang": "python",
        "bytes": 6000
      },
      {
        "path": "tests/test_e2e_chat_live.py",
        "lang": "python",
        "bytes": 4987
      },
      {
        "path": "tests/test_e2e_controller_live.py",
        "lang": "python",
        "bytes": 10455
      },
      {
        "path": "tests/test_e2e_drain_live.py",
        "lang": "python",
        "bytes": 2955
      },
      {
        "path": "tests/test_e2e_frontdoor_live.py",
        "lang": "python",
        "bytes": 2283
      },
      {
        "path": "tests/test_e2e_ladder_live.py",
        "lang": "python",
        "bytes": 5186
      },
      {
        "path": "tests/test_e2e_pipeline_live.py",
        "lang": "python",
        "bytes": 4403
      },
      {
        "path": "tests/test_e2e_runledger_live.py",
        "lang": "python",
        "bytes": 2764
      },
      {
        "path": "tests/test_e2e_stepdown_live.py",
        "lang": "python",
        "bytes": 3560
      },
      {
        "path": "tests/test_e2e_tools_live.py",
        "lang": "python",
        "bytes": 3751
      },
      {
        "path": "tests/test_identity.py",
        "lang": "python",
        "bytes": 2229
      },
      {
        "path": "tests/test_ladder.py",
        "lang": "python",
        "bytes": 3191
      },
      {
        "path": "tests/test_parsing.py",
        "lang": "python",
        "bytes": 1494
      },
      {
        "path": "tests/test_run_ledger.py",
        "lang": "python",
        "bytes": 2551
      },
      {
        "path": "tests/test_table_parser.py",
        "lang": "python",
        "bytes": 1757
      },
      {
        "path": "tests/test_trigger.py",
        "lang": "python",
        "bytes": 1876
      }
    ]
  },
  {
    "slug": "02-use-cases/02-workflow-automation-agents/receipts-intelligent-document-processing-agent/app/receiptsagent",
    "title": "receiptsagent",
    "desc": "The AgentCore Runtime application for the Receipts IDP sample. Phase 1 is a stub entrypoint (main.py) that proves the Runtime deploys and is invokable. The OCR",
    "sectionId": null,
    "kind": "use-case",
    "frameworks": [
      "Strands"
    ],
    "languages": [
      "python"
    ],
    "hasNotebook": false,
    "readme": "/agentcore-samples/02-use-cases/02-workflow-automation-agents/receipts-intelligent-document-processing-agent/app/receiptsagent/README.md",
    "base": "/agentcore-samples/02-use-cases/02-workflow-automation-agents/receipts-intelligent-document-processing-agent/app/receiptsagent",
    "files": [
      {
        "path": "config.py",
        "lang": "python",
        "bytes": 3943
      },
      {
        "path": "gateway_auth.py",
        "lang": "python",
        "bytes": 1582
      },
      {
        "path": "identity.py",
        "lang": "python",
        "bytes": 3900
      },
      {
        "path": "main.py",
        "lang": "python",
        "bytes": 25438
      },
      {
        "path": "mcp_client/__init__.py",
        "lang": "python",
        "bytes": 31
      },
      {
        "path": "memory/__init__.py",
        "lang": "python",
        "bytes": 27
      },
      {
        "path": "memory/session.py",
        "lang": "python",
        "bytes": 1314
      },
      {
        "path": "model/__init__.py",
        "lang": "python",
        "bytes": 26
      },
      {
        "path": "model/ladder.py",
        "lang": "python",
        "bytes": 6387
      },
      {
        "path": "model/load.py",
        "lang": "python",
        "bytes": 986
      },
      {
        "path": "parsing.py",
        "lang": "python",
        "bytes": 3193
      },
      {
        "path": "pyproject.toml",
        "lang": "toml",
        "bytes": 515
      },
      {
        "path": "requirements.txt",
        "lang": "text",
        "bytes": 422
      },
      {
        "path": "tools/__init__.py",
        "lang": "python",
        "bytes": 26
      },
      {
        "path": "tools/ocr.py",
        "lang": "python",
        "bytes": 3555
      },
      {
        "path": "tools/structured_output.py",
        "lang": "python",
        "bytes": 3965
      },
      {
        "path": "tools/table_parser.py",
        "lang": "python",
        "bytes": 2797
      }
    ]
  },
  {
    "slug": "02-use-cases/02-workflow-automation-agents/visa-b2b-account-payable-agent/infrastructure",
    "title": "RTP Overlay Infrastructure",
    "desc": "AWS CDK infrastructure for the RTP Overlay System with Lambda deployment.",
    "sectionId": null,
    "kind": "use-case",
    "frameworks": [],
    "languages": [
      "javascript",
      "python",
      "typescript"
    ],
    "hasNotebook": false,
    "readme": "/agentcore-samples/02-use-cases/02-workflow-automation-agents/visa-b2b-account-payable-agent/infrastructure/README.md",
    "base": "/agentcore-samples/02-use-cases/02-workflow-automation-agents/visa-b2b-account-payable-agent/infrastructure",
    "files": [
      {
        "path": "bin/deploy-agentcore-invoker.ts",
        "lang": "typescript",
        "bytes": 422
      },
      {
        "path": "bin/deploy-gr-processing.ts",
        "lang": "typescript",
        "bytes": 619
      },
      {
        "path": "bin/deploy-invoice-processing.ts",
        "lang": "typescript",
        "bytes": 649
      },
      {
        "path": "bin/deploy-lambda.ts",
        "lang": "typescript",
        "bytes": 860
      },
      {
        "path": "bin/deploy-visa-stub.ts",
        "lang": "typescript",
        "bytes": 395
      },
      {
        "path": "bin/infrastructure.ts",
        "lang": "typescript",
        "bytes": 545
      },
      {
        "path": "cdk.json",
        "lang": "json",
        "bytes": 5315
      },
      {
        "path": "configure-s3-notifications.sh",
        "lang": "bash",
        "bytes": 3229
      },
      {
        "path": "deploy-agentcore-gateway.sh",
        "lang": "bash",
        "bytes": 3483
      },
      {
        "path": "deploy-agentcore-invoker.sh",
        "lang": "bash",
        "bytes": 3570
      },
      {
        "path": "deploy-gr-processing.sh",
        "lang": "bash",
        "bytes": 797
      },
      {
        "path": "deploy-invoice-processing.sh",
        "lang": "bash",
        "bytes": 822
      },
      {
        "path": "deploy-lambda.sh",
        "lang": "bash",
        "bytes": 2028
      },
      {
        "path": "deploy-payment-agent.sh",
        "lang": "bash",
        "bytes": 8015
      },
      {
        "path": "deploy-visa-stub.sh",
        "lang": "bash",
        "bytes": 581
      },
      {
        "path": "deploy.sh",
        "lang": "bash",
        "bytes": 644
      },
      {
        "path": "jest.config.js",
        "lang": "javascript",
        "bytes": 157
      },
      {
        "path": "lambda/agentcore-invoker/agentcore_invoker.py",
        "lang": "python",
        "bytes": 2976
      },
      {
        "path": "lambda/agentcore-invoker/requirements.txt",
        "lang": "text",
        "bytes": 14
      },
      {
        "path": "lambda/visa-stubs/index.js",
        "lang": "javascript",
        "bytes": 3709
      },
      {
        "path": "lambda/visa-stubs/virtualCardRequisition.ts",
        "lang": "typescript",
        "bytes": 0
      },
      {
        "path": "package.json",
        "lang": "json",
        "bytes": 515
      },
      {
        "path": "rebuild-lambda-layer.sh",
        "lang": "bash",
        "bytes": 913
      },
      {
        "path": "run-migrations.sh",
        "lang": "bash",
        "bytes": 2358
      },
      {
        "path": "s3-notification-config-gr.json",
        "lang": "json",
        "bytes": 1973
      },
      {
        "path": "s3-notification-config.json",
        "lang": "json",
        "bytes": 2657
      },
      {
        "path": "scripts/generate-gateway-openapi-spec.sh",
        "lang": "bash",
        "bytes": 7347
      },
      {
        "path": "scripts/setup-agentcore-gateway.py",
        "lang": "python",
        "bytes": 14967
      },
      {
        "path": "scripts/test-gateway-tools.py",
        "lang": "python",
        "bytes": 4112
      },
      {
        "path": "setup-kms-encryption.sh",
        "lang": "bash",
        "bytes": 13113
      },
      {
        "path": "setup-python-env.sh",
        "lang": "bash",
        "bytes": 1283
      },
      {
        "path": "test/infrastructure.test.ts",
        "lang": "typescript",
        "bytes": 608
      },
      {
        "path": "tsconfig.json",
        "lang": "json",
        "bytes": 686
      }
    ]
  },
  {
    "slug": "02-use-cases/02-workflow-automation-agents/visa-b2b-account-payable-agent/infrastructure/lambda/payment-agents",
    "title": "Payment Agent - AgentCore Runtime",
    "desc": "AI-powered payment processing agent that intelligently decides between Visa B2B Virtual Cards and ISO20022 bank transfers.",
    "sectionId": "payments",
    "kind": "use-case",
    "frameworks": [
      "Strands"
    ],
    "languages": [
      "python"
    ],
    "hasNotebook": false,
    "readme": "/agentcore-samples/02-use-cases/02-workflow-automation-agents/visa-b2b-account-payable-agent/infrastructure/lambda/payment-agents/README.md",
    "base": "/agentcore-samples/02-use-cases/02-workflow-automation-agents/visa-b2b-account-payable-agent/infrastructure/lambda/payment-agents",
    "files": [
      {
        "path": "payment_agent.py",
        "lang": "python",
        "bytes": 20636
      },
      {
        "path": "requirements.txt",
        "lang": "text",
        "bytes": 135
      }
    ]
  },
  {
    "slug": "02-use-cases/02-workflow-automation-agents/visa-b2b-account-payable-agent/rtp-overlay",
    "title": "RTP Overlay - Real-Time Payments Overlay System",
    "desc": "A comprehensive accounts payable and procurement management application built with React, TypeScript, and Material-UI.",
    "sectionId": null,
    "kind": "use-case",
    "frameworks": [],
    "languages": [
      "javascript",
      "tsx",
      "typescript"
    ],
    "hasNotebook": false,
    "readme": "/agentcore-samples/02-use-cases/02-workflow-automation-agents/visa-b2b-account-payable-agent/rtp-overlay/README.md",
    "base": "/agentcore-samples/02-use-cases/02-workflow-automation-agents/visa-b2b-account-payable-agent/rtp-overlay",
    "files": [
      {
        "path": "amplify.yml",
        "lang": "yaml",
        "bytes": 238
      },
      {
        "path": "build-and-zip.sh",
        "lang": "bash",
        "bytes": 541
      },
      {
        "path": "eslint.config.js",
        "lang": "javascript",
        "bytes": 621
      },
      {
        "path": "index.html",
        "lang": "html",
        "bytes": 360
      },
      {
        "path": "package.json",
        "lang": "json",
        "bytes": 979
      },
      {
        "path": "src/App.css",
        "lang": "css",
        "bytes": 606
      },
      {
        "path": "src/App.tsx",
        "lang": "tsx",
        "bytes": 4502
      },
      {
        "path": "src/components/common/Button.tsx",
        "lang": "tsx",
        "bytes": 966
      },
      {
        "path": "src/components/common/Card.tsx",
        "lang": "tsx",
        "bytes": 546
      },
      {
        "path": "src/components/common/CurrencyDisplay.tsx",
        "lang": "tsx",
        "bytes": 822
      },
      {
        "path": "src/components/common/DataTable.tsx",
        "lang": "tsx",
        "bytes": 4112
      },
      {
        "path": "src/components/common/ErrorBoundary.tsx",
        "lang": "tsx",
        "bytes": 2401
      },
      {
        "path": "src/components/common/Header.tsx",
        "lang": "tsx",
        "bytes": 1802
      },
      {
        "path": "src/components/common/Layout.tsx",
        "lang": "tsx",
        "bytes": 347
      },
      {
        "path": "src/components/common/LoadingSpinner.tsx",
        "lang": "tsx",
        "bytes": 1097
      },
      {
        "path": "src/components/common/Login.tsx",
        "lang": "tsx",
        "bytes": 3444
      },
      {
        "path": "src/components/common/MatchStatusBadge.tsx",
        "lang": "tsx",
        "bytes": 1821
      },
      {
        "path": "src/components/common/Modal.tsx",
        "lang": "tsx",
        "bytes": 1217
      },
      {
        "path": "src/components/common/POStatusBadge.tsx",
        "lang": "tsx",
        "bytes": 1921
      },
      {
        "path": "src/components/common/PaymentStatusChip.tsx",
        "lang": "tsx",
        "bytes": 784
      },
      {
        "path": "src/components/common/ProtectedRoute.tsx",
        "lang": "tsx",
        "bytes": 1133
      },
      {
        "path": "src/components/common/QBBadge/QBBadge.tsx",
        "lang": "tsx",
        "bytes": 1248
      },
      {
        "path": "src/components/common/QBBadge/index.ts",
        "lang": "typescript",
        "bytes": 37
      },
      {
        "path": "src/components/common/QBButton/QBButton.tsx",
        "lang": "tsx",
        "bytes": 1505
      },
      {
        "path": "src/components/common/QBButton/index.ts",
        "lang": "typescript",
        "bytes": 39
      },
      {
        "path": "src/components/common/QBCard/QBCard.tsx",
        "lang": "tsx",
        "bytes": 1332
      },
      {
        "path": "src/components/common/QBCard/index.ts",
        "lang": "typescript",
        "bytes": 35
      },
      {
        "path": "src/components/common/QBInput/QBInput.tsx",
        "lang": "tsx",
        "bytes": 1848
      },
      {
        "path": "src/components/common/QBInput/index.ts",
        "lang": "typescript",
        "bytes": 37
      },
      {
        "path": "src/components/common/QBMetricCard/QBMetricCard.tsx",
        "lang": "tsx",
        "bytes": 3096
      },
      {
        "path": "src/components/common/QBMetricCard/index.ts",
        "lang": "typescript",
        "bytes": 47
      },
      {
        "path": "src/components/common/QBSidebar/QBSidebar.tsx",
        "lang": "tsx",
        "bytes": 5609
      },
      {
        "path": "src/components/common/QBSidebar/index.ts",
        "lang": "typescript",
        "bytes": 41
      },
      {
        "path": "src/components/common/QBTable/QBTable.tsx",
        "lang": "tsx",
        "bytes": 4062
      },
      {
        "path": "src/components/common/QBTable/index.ts",
        "lang": "typescript",
        "bytes": 85
      },
      {
        "path": "src/components/common/QCStatusBadge.tsx",
        "lang": "tsx",
        "bytes": 1469
      },
      {
        "path": "src/components/common/Sidebar.tsx",
        "lang": "tsx",
        "bytes": 3275
      },
      {
        "path": "src/components/common/StatusChip.tsx",
        "lang": "tsx",
        "bytes": 995
      },
      {
        "path": "src/components/common/VarianceIndicator.tsx",
        "lang": "tsx",
        "bytes": 1553
      },
      {
        "path": "src/components/common/index.ts",
        "lang": "typescript",
        "bytes": 522
      },
      {
        "path": "src/components/delivery/CreatePODialog.tsx",
        "lang": "tsx",
        "bytes": 10952
      },
      {
        "path": "src/components/delivery/GoodsReceiptCapture.tsx",
        "lang": "tsx",
        "bytes": 9186
      },
      {
        "path": "src/components/delivery/GoodsReceiptDashboard.tsx",
        "lang": "tsx",
        "bytes": 4838
      },
      {
        "path": "src/components/delivery/POActionMenu.tsx",
        "lang": "tsx",
        "bytes": 4610
      },
      {
        "path": "src/components/delivery/POFilterPanel.tsx",
        "lang": "tsx",
        "bytes": 8348
      },
      {
        "path": "src/components/delivery/PurchaseOrderList.tsx",
        "lang": "tsx",
        "bytes": 17616
      },
      {
        "path": "src/components/delivery/UploadInvoiceDialog.tsx",
        "lang": "tsx",
        "bytes": 11303
      },
      {
        "path": "src/components/delivery/UploadReceipt.tsx",
        "lang": "tsx",
        "bytes": 11928
      },
      {
        "path": "src/components/delivery/UploadReceiptDialog.tsx",
        "lang": "tsx",
        "bytes": 11477
      },
      {
        "path": "src/components/delivery/cells/AttachmentsCell.tsx",
        "lang": "tsx",
        "bytes": 1480
      },
      {
        "path": "src/components/delivery/cells/DueDateCell.tsx",
        "lang": "tsx",
        "bytes": 1093
      },
      {
        "path": "src/components/delivery/cells/FulfillmentCell.tsx",
        "lang": "tsx",
        "bytes": 1244
      },
      {
        "path": "src/components/delivery/cells/MatchStatusCell.tsx",
        "lang": "tsx",
        "bytes": 668
      },
      {
        "path": "src/components/delivery/cells/TotalRemainingCell.tsx",
        "lang": "tsx",
        "bytes": 962
      },
      {
        "path": "src/components/delivery/cells/index.ts",
        "lang": "typescript",
        "bytes": 263
      },
      {
        "path": "src/components/invoices/ExtractedDataSection.tsx",
        "lang": "tsx",
        "bytes": 10371
      },
      {
        "path": "src/components/invoices/FilterPanel.tsx",
        "lang": "tsx",
        "bytes": 5867
      },
      {
        "path": "src/components/invoices/GoodsReceiptCard.tsx",
        "lang": "tsx",
        "bytes": 3257
      },
      {
        "path": "src/components/invoices/InvoiceDashboard.tsx",
        "lang": "tsx",
        "bytes": 3404
      },
      {
        "path": "src/components/invoices/InvoiceDetail.tsx",
        "lang": "tsx",
        "bytes": 6780
      },
      {
        "path": "src/components/invoices/InvoiceHeader.tsx",
        "lang": "tsx",
        "bytes": 5760
      },
      {
        "path": "src/components/invoices/InvoiceTable.tsx",
        "lang": "tsx",
        "bytes": 2876
      },
      {
        "path": "src/components/invoices/MatchedPOCard.tsx",
        "lang": "tsx",
        "bytes": 5636
      },
      {
        "path": "src/components/invoices/PaymentStatusTimeline.tsx",
        "lang": "tsx",
        "bytes": 3874
      },
      {
        "path": "src/components/invoices/SummaryCards.tsx",
        "lang": "tsx",
        "bytes": 1697
      },
      {
        "path": "src/components/invoices/UploadInvoiceDialog.tsx",
        "lang": "tsx",
        "bytes": 6539
      },
      {
        "path": "src/components/layout/AppLayout/AppLayout.tsx",
        "lang": "tsx",
        "bytes": 2682
      },
      {
        "path": "src/components/layout/AppLayout/index.ts",
        "lang": "typescript",
        "bytes": 41
      },
      {
        "path": "src/components/layout/ContentArea/ContentArea.tsx",
        "lang": "tsx",
        "bytes": 572
      },
      {
        "path": "src/components/layout/ContentArea/index.ts",
        "lang": "typescript",
        "bytes": 45
      },
      {
        "path": "src/components/layout/MainLayout.tsx",
        "lang": "tsx",
        "bytes": 997
      },
      {
        "path": "src/components/layout/Navigation.tsx",
        "lang": "tsx",
        "bytes": 9580
      },
      {
        "path": "src/components/layout/PageHeader/PageHeader.tsx",
        "lang": "tsx",
        "bytes": 1490
      },
      {
        "path": "src/components/layout/PageHeader/index.ts",
        "lang": "typescript",
        "bytes": 43
      },
      {
        "path": "src/components/payments/PaymentCharts.tsx",
        "lang": "tsx",
        "bytes": 8819
      },
      {
        "path": "src/components/payments/PaymentDashboard.tsx",
        "lang": "tsx",
        "bytes": 3231
      },
      {
        "path": "src/components/payments/PaymentStatusBadge.tsx",
        "lang": "tsx",
        "bytes": 1978
      },
      {
        "path": "src/components/payments/PaymentSummaryCards.tsx",
        "lang": "tsx",
        "bytes": 5166
      },
      {
        "path": "src/components/payments/PaymentTable.tsx",
        "lang": "tsx",
        "bytes": 8635
      },
      {
        "path": "src/components/payments/VirtualCardDisplay.tsx",
        "lang": "tsx",
        "bytes": 11886
      },
      {
        "path": "src/components/qc/QCDashboard.tsx",
        "lang": "tsx",
        "bytes": 204
      },
      {
        "path": "src/components/treasury/AIInsightsPanel.tsx",
        "lang": "tsx",
        "bytes": 7459
      },
      {
        "path": "src/components/treasury/AISummaryCard.tsx",
        "lang": "tsx",
        "bytes": 5875
      },
      {
        "path": "src/components/treasury/AnomaliesCard.tsx",
        "lang": "tsx",
        "bytes": 7803
      },
      {
        "path": "src/components/treasury/PredictionsCard.tsx",
        "lang": "tsx",
        "bytes": 9014
      },
      {
        "path": "src/components/treasury/RecommendationsCard.tsx",
        "lang": "tsx",
        "bytes": 8833
      },
      {
        "path": "src/components/treasury/TreasuryDashboard.tsx",
        "lang": "tsx",
        "bytes": 16484
      },
      {
        "path": "src/contexts/AuthContext.tsx",
        "lang": "tsx",
        "bytes": 1980
      },
      {
        "path": "src/contexts/InvoiceContext.tsx",
        "lang": "tsx",
        "bytes": 8099
      },
      {
        "path": "src/contexts/MockAuthContext.tsx",
        "lang": "tsx",
        "bytes": 2767
      },
      {
        "path": "src/contexts/PaymentContext.tsx",
        "lang": "tsx",
        "bytes": 6074
      },
      {
        "path": "src/index.css",
        "lang": "css",
        "bytes": 1154
      },
      {
        "path": "src/main.tsx",
        "lang": "tsx",
        "bytes": 538
      },
      {
        "path": "src/pages/Dashboard/Dashboard.tsx",
        "lang": "tsx",
        "bytes": 18596
      },
      {
        "path": "src/pages/GoodsReceipts/GoodsReceiptDetail.tsx",
        "lang": "tsx",
        "bytes": 12609
      },
      {
        "path": "src/pages/GoodsReceipts/GoodsReceiptList.tsx",
        "lang": "tsx",
        "bytes": 9492
      },
      {
        "path": "src/pages/GoodsReceipts/UploadGoodsReceipt.tsx",
        "lang": "tsx",
        "bytes": 13636
      },
      {
        "path": "src/pages/Invoices/InvoiceList.tsx",
        "lang": "tsx",
        "bytes": 11982
      },
      {
        "path": "src/pages/Invoices/InvoiceMatchDetail.tsx",
        "lang": "tsx",
        "bytes": 32516
      },
      {
        "path": "src/pages/Invoices/UploadInvoice.tsx",
        "lang": "tsx",
        "bytes": 16027
      },
      {
        "path": "src/pages/Login/MockLogin.tsx",
        "lang": "tsx",
        "bytes": 10604
      },
      {
        "path": "src/pages/PurchaseOrders/CreatePurchaseOrder.tsx",
        "lang": "tsx",
        "bytes": 13522
      },
      {
        "path": "src/pages/PurchaseOrders/PurchaseOrderDetail.tsx",
        "lang": "tsx",
        "bytes": 11919
      },
      {
        "path": "src/pages/PurchaseOrders/PurchaseOrderList.tsx",
        "lang": "tsx",
        "bytes": 10050
      },
      {
        "path": "src/pages/QualityControl/CreateQCRecord.tsx",
        "lang": "tsx",
        "bytes": 12956
      },
      {
        "path": "src/pages/QualityControl/QCRecordDetail.tsx",
        "lang": "tsx",
        "bytes": 9189
      },
      {
        "path": "src/pages/QualityControl/QCRecordList.tsx",
        "lang": "tsx",
        "bytes": 7857
      },
      {
        "path": "src/pages/Supplier/SupplierLogin.tsx",
        "lang": "tsx",
        "bytes": 8965
      },
      {
        "path": "src/pages/Supplier/SupplierPaymentView.tsx",
        "lang": "tsx",
        "bytes": 15497
      },
      {
        "path": "src/services/aiInsightsService.ts",
        "lang": "typescript",
        "bytes": 3088
      },
      {
        "path": "src/services/api.service.ts",
        "lang": "typescript",
        "bytes": 16105
      },
      {
        "path": "src/services/auth.service.ts",
        "lang": "typescript",
        "bytes": 1334
      },
      {
        "path": "src/services/documentService.ts",
        "lang": "typescript",
        "bytes": 6687
      },
      {
        "path": "src/services/invoice.service.ts",
        "lang": "typescript",
        "bytes": 7899
      },
      {
        "path": "src/services/mockData.ts",
        "lang": "typescript",
        "bytes": 6602
      },
      {
        "path": "src/services/mockDataService.ts",
        "lang": "typescript",
        "bytes": 15449
      },
      {
        "path": "src/services/mockInvoiceData.ts",
        "lang": "typescript",
        "bytes": 4459
      },
      {
        "path": "src/services/mockUsers.ts",
        "lang": "typescript",
        "bytes": 793
      },
      {
        "path": "src/services/paymentService.ts",
        "lang": "typescript",
        "bytes": 5991
      },
      {
        "path": "src/styles/oilGasTheme.backup.ts",
        "lang": "typescript",
        "bytes": 6302
      },
      {
        "path": "src/styles/oilGasTheme.ts",
        "lang": "typescript",
        "bytes": 6580
      },
      {
        "path": "src/styles/visaTheme.ts",
        "lang": "typescript",
        "bytes": 8722
      },
      {
        "path": "src/theme/colors.ts",
        "lang": "typescript",
        "bytes": 1108
      },
      {
        "path": "src/theme/paymentColors.ts",
        "lang": "typescript",
        "bytes": 784
      },
      {
        "path": "src/theme/shadows.ts",
        "lang": "typescript",
        "bytes": 403
      },
      {
        "path": "src/theme/spacing.ts",
        "lang": "typescript",
        "bytes": 171
      },
      {
        "path": "src/theme/theme.ts",
        "lang": "typescript",
        "bytes": 4222
      },
      {
        "path": "src/theme/typography.ts",
        "lang": "typescript",
        "bytes": 1441
      },
      {
        "path": "src/types/aiInsights.types.ts",
        "lang": "typescript",
        "bytes": 1114
      },
      {
        "path": "src/types/data.types.ts",
        "lang": "typescript",
        "bytes": 4446
      },
      {
        "path": "src/types/invoice.types.ts",
        "lang": "typescript",
        "bytes": 3106
      },
      {
        "path": "src/types/payment.types.ts",
        "lang": "typescript",
        "bytes": 2536
      },
      {
        "path": "src/types/user.types.ts",
        "lang": "typescript",
        "bytes": 360
      },
      {
        "path": "src/utils/formatters.ts",
        "lang": "typescript",
        "bytes": 961
      },
      {
        "path": "src/utils/poCalculations.ts",
        "lang": "typescript",
        "bytes": 4907
      },
      {
        "path": "tsconfig.app.json",
        "lang": "json",
        "bytes": 732
      },
      {
        "path": "tsconfig.json",
        "lang": "json",
        "bytes": 119
      },
      {
        "path": "tsconfig.node.json",
        "lang": "json",
        "bytes": 653
      },
      {
        "path": "vite.config.ts",
        "lang": "typescript",
        "bytes": 352
      }
    ]
  },
  {
    "slug": "02-use-cases/03-coding-assistants/claude-code-gateway-mcp-server",
    "title": "Integrate Claude Code with MCP Server using AgentCore Gateway",
    "desc": "Claude Code is Anthropic's agentic coding tool that lives in your terminal. It connects to external capabilities through MCP servers, but as the number of connected servers grows, two problems emerge:",
    "sectionId": "gateway",
    "kind": "use-case",
    "frameworks": [],
    "languages": [
      "python"
    ],
    "hasNotebook": true,
    "readme": "/agentcore-samples/02-use-cases/03-coding-assistants/claude-code-gateway-mcp-server/README.md",
    "base": "/agentcore-samples/02-use-cases/03-coding-assistants/claude-code-gateway-mcp-server",
    "files": [
      {
        "path": "claude-code-gateway-mcp-server.md",
        "lang": "markdown",
        "bytes": 12166,
        "fromNotebook": true
      },
      {
        "path": "requirements.txt",
        "lang": "text",
        "bytes": 80
      },
      {
        "path": "utils.py",
        "lang": "python",
        "bytes": 41953
      }
    ]
  },
  {
    "slug": "02-use-cases/03-coding-assistants/text-to-python-ide",
    "title": "Text-to-Python IDE — AgentCore Demo",
    "desc": "A full-stack application demonstrating Amazon Bedrock AgentCore capabilities through a Python code generation and execution interface. Built with Strands Agents, FastAPI, and React (AWS Cloudscape).",
    "sectionId": null,
    "kind": "use-case",
    "frameworks": [
      "Strands"
    ],
    "languages": [
      "javascript",
      "python"
    ],
    "hasNotebook": false,
    "readme": "/agentcore-samples/02-use-cases/03-coding-assistants/text-to-python-ide/README.md",
    "base": "/agentcore-samples/02-use-cases/03-coding-assistants/text-to-python-ide",
    "files": [
      {
        "path": "PROJECT_STRUCTURE.md",
        "lang": "markdown",
        "bytes": 6044
      },
      {
        "path": "backend/agent_runtime.py",
        "lang": "python",
        "bytes": 10038
      },
      {
        "path": "backend/main.py",
        "lang": "python",
        "bytes": 73919
      },
      {
        "path": "backend/memory_manager.py",
        "lang": "python",
        "bytes": 13229
      },
      {
        "path": "backend/observability.py",
        "lang": "python",
        "bytes": 3537
      },
      {
        "path": "backend/runtime_proxy.py",
        "lang": "python",
        "bytes": 3846
      },
      {
        "path": "cleanup.sh",
        "lang": "bash",
        "bytes": 6068
      },
      {
        "path": "deploy_runtime.py",
        "lang": "python",
        "bytes": 13226
      },
      {
        "path": "docs/ARCHITECTURE.md",
        "lang": "markdown",
        "bytes": 8230
      },
      {
        "path": "docs/EDITEDCODE_FIX_SUMMARY.md",
        "lang": "markdown",
        "bytes": 4121
      },
      {
        "path": "docs/ESLINT_FIXES.md",
        "lang": "markdown",
        "bytes": 2913
      },
      {
        "path": "docs/EXECUTION_RESULT_FIX_SUMMARY.md",
        "lang": "markdown",
        "bytes": 4595
      },
      {
        "path": "docs/IMPLEMENTATION_SUMMARY.md",
        "lang": "markdown",
        "bytes": 8974
      },
      {
        "path": "docs/OVERVIEW.md",
        "lang": "markdown",
        "bytes": 5355
      },
      {
        "path": "docs/README.md",
        "lang": "markdown",
        "bytes": 12841
      },
      {
        "path": "docs/SETUP.md",
        "lang": "markdown",
        "bytes": 5450
      },
      {
        "path": "docs/STARTUP_FIXES.md",
        "lang": "markdown",
        "bytes": 2352
      },
      {
        "path": "frontend/index.html",
        "lang": "html",
        "bytes": 620
      },
      {
        "path": "frontend/package.json",
        "lang": "json",
        "bytes": 1204
      },
      {
        "path": "frontend/public/index.html",
        "lang": "html",
        "bytes": 575
      },
      {
        "path": "frontend/src/App.jsx",
        "lang": "jsx",
        "bytes": 25371
      },
      {
        "path": "frontend/src/components/CodeDisplay.js",
        "lang": "javascript",
        "bytes": 2454
      },
      {
        "path": "frontend/src/components/CodeDisplay.jsx",
        "lang": "jsx",
        "bytes": 2454
      },
      {
        "path": "frontend/src/components/CodeEditor.js",
        "lang": "javascript",
        "bytes": 1300
      },
      {
        "path": "frontend/src/components/CodeEditor.jsx",
        "lang": "jsx",
        "bytes": 1300
      },
      {
        "path": "frontend/src/components/CsvUploadModal.js",
        "lang": "javascript",
        "bytes": 3288
      },
      {
        "path": "frontend/src/components/CsvUploadModal.jsx",
        "lang": "jsx",
        "bytes": 3288
      },
      {
        "path": "frontend/src/components/ExecutionResults.js",
        "lang": "javascript",
        "bytes": 4407
      },
      {
        "path": "frontend/src/components/ExecutionResults.jsx",
        "lang": "jsx",
        "bytes": 4419
      },
      {
        "path": "frontend/src/components/ExecutionTimer.js",
        "lang": "javascript",
        "bytes": 2896
      },
      {
        "path": "frontend/src/components/ExecutionTimer.jsx",
        "lang": "jsx",
        "bytes": 2894
      },
      {
        "path": "frontend/src/components/ImageDisplay.js",
        "lang": "javascript",
        "bytes": 3712
      },
      {
        "path": "frontend/src/components/ImageDisplay.jsx",
        "lang": "jsx",
        "bytes": 3712
      },
      {
        "path": "frontend/src/components/InteractiveExecutionModal.js",
        "lang": "javascript",
        "bytes": 4468
      },
      {
        "path": "frontend/src/components/InteractiveExecutionModal.jsx",
        "lang": "jsx",
        "bytes": 4294
      },
      {
        "path": "frontend/src/components/SessionHistory.js",
        "lang": "javascript",
        "bytes": 11149
      },
      {
        "path": "frontend/src/components/SessionHistory.jsx",
        "lang": "jsx",
        "bytes": 13069
      },
      {
        "path": "frontend/src/index.jsx",
        "lang": "jsx",
        "bytes": 289
      },
      {
        "path": "frontend/src/services/api.js",
        "lang": "javascript",
        "bytes": 6996
      },
      {
        "path": "frontend/vite.config.js",
        "lang": "javascript",
        "bytes": 462
      },
      {
        "path": "invoke_runtime.py",
        "lang": "python",
        "bytes": 3453
      },
      {
        "path": "requirements.txt",
        "lang": "text",
        "bytes": 244
      },
      {
        "path": "setup.sh",
        "lang": "bash",
        "bytes": 2041
      },
      {
        "path": "setup_guardrails.py",
        "lang": "python",
        "bytes": 5484
      },
      {
        "path": "setup_memory.py",
        "lang": "python",
        "bytes": 4662
      },
      {
        "path": "start.sh",
        "lang": "bash",
        "bytes": 14700
      },
      {
        "path": "start_manual.sh",
        "lang": "bash",
        "bytes": 1126
      },
      {
        "path": "tests/automated_e2e_test.py",
        "lang": "python",
        "bytes": 11483
      },
      {
        "path": "tests/run_all_tests.py",
        "lang": "python",
        "bytes": 10854
      },
      {
        "path": "tests/test_agentcore.py",
        "lang": "python",
        "bytes": 4597
      },
      {
        "path": "tests/test_agentcore_integration.py",
        "lang": "python",
        "bytes": 7184
      },
      {
        "path": "tests/test_aws_auth.py",
        "lang": "python",
        "bytes": 6495
      },
      {
        "path": "tests/test_model_fallback.py",
        "lang": "python",
        "bytes": 4102
      },
      {
        "path": "tests/test_strands.py",
        "lang": "python",
        "bytes": 2747
      },
      {
        "path": "tests/verify_setup.py",
        "lang": "python",
        "bytes": 4454
      }
    ]
  },
  {
    "slug": "02-use-cases/data-analyst-conversational-assistant",
    "title": "Data Analyst Conversational Assistant",
    "desc": "A production-grade reference solution that lets users interact with a PostgreSQL database through natural language conversations, receive AI-generated SQL analysis, view results in tabular and...",
    "sectionId": null,
    "kind": "use-case",
    "frameworks": [
      "Strands"
    ],
    "languages": [
      "python"
    ],
    "hasNotebook": false,
    "readme": "/agentcore-samples/02-use-cases/data-analyst-conversational-assistant/README.md",
    "base": "/agentcore-samples/02-use-cases/data-analyst-conversational-assistant",
    "files": [
      {
        "path": "agentcore/agentcore.json",
        "lang": "json",
        "bytes": 1215
      },
      {
        "path": "agentcore/aws-targets.json",
        "lang": "json",
        "bytes": 107
      },
      {
        "path": "deploy.py",
        "lang": "python",
        "bytes": 23180
      },
      {
        "path": "evaluations/evaluate.py",
        "lang": "python",
        "bytes": 22489
      },
      {
        "path": "lambdas/db_tools/lambda_function.py",
        "lang": "python",
        "bytes": 6335
      },
      {
        "path": "lambdas/db_tools/tool_schema.json",
        "lang": "json",
        "bytes": 1073
      },
      {
        "path": "setup-frontend.sh",
        "lang": "bash",
        "bytes": 2989
      }
    ]
  },
  {
    "slug": "02-use-cases/data-analyst-conversational-assistant/amplify-data-analyst-conversational-assistant-agentcore-strands",
    "title": "Front-End Implementation - Integrating AgentCore with a Ready-to-Use Data Analyst Assistant Application (Next.js)",
    "desc": "This tutorial guides you through setting up a Next.js web application that integrates with your Amazon Bedrock AgentCore deployment, creating a Data Analyst Conversational Assistant.",
    "sectionId": null,
    "kind": "use-case",
    "frameworks": [
      "Strands"
    ],
    "languages": [
      "tsx",
      "typescript"
    ],
    "hasNotebook": false,
    "readme": "/agentcore-samples/02-use-cases/data-analyst-conversational-assistant/amplify-data-analyst-conversational-assistant-agentcore-strands/README.md",
    "base": "/agentcore-samples/02-use-cases/data-analyst-conversational-assistant/amplify-data-analyst-conversational-assistant-agentcore-strands",
    "files": [
      {
        "path": "amplify.yml",
        "lang": "yaml",
        "bytes": 1308
      },
      {
        "path": "amplify/auth/resource.ts",
        "lang": "typescript",
        "bytes": 214
      },
      {
        "path": "amplify/backend.ts",
        "lang": "typescript",
        "bytes": 4602
      },
      {
        "path": "amplify/package.json",
        "lang": "json",
        "bytes": 23
      },
      {
        "path": "amplify/tsconfig.json",
        "lang": "json",
        "bytes": 270
      },
      {
        "path": "package.json",
        "lang": "json",
        "bytes": 1707
      },
      {
        "path": "pnpm-workspace.yaml",
        "lang": "yaml",
        "bytes": 161
      },
      {
        "path": "src/app/amplify-theme.css",
        "lang": "css",
        "bytes": 8379
      },
      {
        "path": "src/app/api/agent/query-results/route.ts",
        "lang": "typescript",
        "bytes": 1769
      },
      {
        "path": "src/app/app/AppPageClient.tsx",
        "lang": "tsx",
        "bytes": 704
      },
      {
        "path": "src/app/app/assistant/AssistantClient.tsx",
        "lang": "tsx",
        "bytes": 6091
      },
      {
        "path": "src/app/app/assistant/page.tsx",
        "lang": "tsx",
        "bytes": 957
      },
      {
        "path": "src/app/app/page.tsx",
        "lang": "tsx",
        "bytes": 288
      },
      {
        "path": "src/app/components/AmplifyProvider.tsx",
        "lang": "tsx",
        "bytes": 405
      },
      {
        "path": "src/app/components/AuthWrapper.tsx",
        "lang": "tsx",
        "bytes": 1490
      },
      {
        "path": "src/app/components/ProtectedRoute.tsx",
        "lang": "tsx",
        "bytes": 2571
      },
      {
        "path": "src/app/components/assistant/Assistant.tsx",
        "lang": "tsx",
        "bytes": 829
      },
      {
        "path": "src/app/components/assistant/index.ts",
        "lang": "typescript",
        "bytes": 100
      },
      {
        "path": "src/app/components/assistant/services/agent-core-call.ts",
        "lang": "typescript",
        "bytes": 10454
      },
      {
        "path": "src/app/components/assistant/services/aws-calls.ts",
        "lang": "typescript",
        "bytes": 6108
      },
      {
        "path": "src/app/components/assistant/types.ts",
        "lang": "typescript",
        "bytes": 1397
      },
      {
        "path": "src/app/components/assistant/ui/Chat.tsx",
        "lang": "tsx",
        "bytes": 23570
      },
      {
        "path": "src/app/components/assistant/ui/LoadingIndicator.tsx",
        "lang": "tsx",
        "bytes": 736
      },
      {
        "path": "src/app/components/assistant/ui/MarkdownRenderer.tsx",
        "lang": "tsx",
        "bytes": 2735
      },
      {
        "path": "src/app/components/assistant/ui/MyChart.tsx",
        "lang": "tsx",
        "bytes": 2639
      },
      {
        "path": "src/app/components/assistant/ui/QueryResultsDisplay.tsx",
        "lang": "tsx",
        "bytes": 5402
      },
      {
        "path": "src/app/components/assistant/ui/TableView.tsx",
        "lang": "tsx",
        "bytes": 4996
      },
      {
        "path": "src/app/components/assistant/ui/ToolBox.tsx",
        "lang": "tsx",
        "bytes": 2653
      },
      {
        "path": "src/app/components/assistant/utils.ts",
        "lang": "typescript",
        "bytes": 6044
      },
      {
        "path": "src/app/globals.css",
        "lang": "css",
        "bytes": 2620
      },
      {
        "path": "src/app/layout.tsx",
        "lang": "tsx",
        "bytes": 1098
      },
      {
        "path": "src/app/page.tsx",
        "lang": "tsx",
        "bytes": 161
      },
      {
        "path": "src/utils/aws-client.ts",
        "lang": "typescript",
        "bytes": 2034
      },
      {
        "path": "tsconfig.json",
        "lang": "json",
        "bytes": 717
      }
    ]
  },
  {
    "slug": "02-use-cases/data-analyst-conversational-assistant/cdk-data-analyst-assistant-agentcore-strands",
    "title": "Data Analyst Assistant - Amazon Bedrock AgentCore and Data Source Deployment with CDK",
    "desc": "Deploy the complete infrastructure for a Data Analyst Conversational Assistant using AWS Cloud Development Kit (CDK) and Amazon Bedrock AgentCore.",
    "sectionId": null,
    "kind": "use-case",
    "frameworks": [
      "Strands"
    ],
    "languages": [
      "javascript",
      "python",
      "typescript"
    ],
    "hasNotebook": false,
    "readme": "/agentcore-samples/02-use-cases/data-analyst-conversational-assistant/cdk-data-analyst-assistant-agentcore-strands/README.md",
    "base": "/agentcore-samples/02-use-cases/data-analyst-conversational-assistant/cdk-data-analyst-assistant-agentcore-strands",
    "files": [
      {
        "path": "bin/cdk-data-analyst-assistant-agentcore-strands.ts",
        "lang": "typescript",
        "bytes": 415
      },
      {
        "path": "cdk.json",
        "lang": "json",
        "bytes": 5485
      },
      {
        "path": "cdklib/cdk-data-analyst-assistant-agentcore-strands-stack.ts",
        "lang": "typescript",
        "bytes": 41127
      },
      {
        "path": "jest.config.js",
        "lang": "javascript",
        "bytes": 157
      },
      {
        "path": "package.json",
        "lang": "json",
        "bytes": 692
      },
      {
        "path": "resources/create-readonly-user.py",
        "lang": "python",
        "bytes": 2713
      },
      {
        "path": "resources/create-sales-database.py",
        "lang": "python",
        "bytes": 4258
      },
      {
        "path": "resources/lambdas/data-loader/index.py",
        "lang": "python",
        "bytes": 5320
      },
      {
        "path": "test/cdk-data-analyst-assistant-agentcore-strands.test.ts",
        "lang": "typescript",
        "bytes": 748
      },
      {
        "path": "tsconfig.json",
        "lang": "json",
        "bytes": 712
      }
    ]
  },
  {
    "slug": "02-use-cases/data-analyst-conversational-assistant/cdk-data-analyst-assistant-agentcore-strands/data-analyst-assistant-agentcore-strands",
    "title": "Data Analyst Assistant - Strands Agent",
    "desc": "A conversational data analyst assistant built with the Strands Agents SDK and powered by Amazon Bedrock AgentCore.",
    "sectionId": null,
    "kind": "use-case",
    "frameworks": [
      "Strands"
    ],
    "languages": [
      "python"
    ],
    "hasNotebook": false,
    "readme": "/agentcore-samples/02-use-cases/data-analyst-conversational-assistant/cdk-data-analyst-assistant-agentcore-strands/data-analyst-assistant-agentcore-strands/README.md",
    "base": "/agentcore-samples/02-use-cases/data-analyst-conversational-assistant/cdk-data-analyst-assistant-agentcore-strands/data-analyst-assistant-agentcore-strands",
    "files": [
      {
        "path": "app.py",
        "lang": "python",
        "bytes": 10207
      },
      {
        "path": "instructions.txt",
        "lang": "text",
        "bytes": 3322
      },
      {
        "path": "requirements.txt",
        "lang": "text",
        "bytes": 113
      },
      {
        "path": "resources/memory_manager.py",
        "lang": "python",
        "bytes": 5797
      },
      {
        "path": "src/tools/__init__.py",
        "lang": "python",
        "bytes": 154
      },
      {
        "path": "src/tools/get_tables_information.py",
        "lang": "python",
        "bytes": 1146
      },
      {
        "path": "src/tools/rds_data_api.py",
        "lang": "python",
        "bytes": 3477
      },
      {
        "path": "src/tools/tables_information.txt",
        "lang": "text",
        "bytes": 1673
      },
      {
        "path": "src/utils/__init__.py",
        "lang": "python",
        "bytes": 152
      },
      {
        "path": "src/utils/file_utils.py",
        "lang": "python",
        "bytes": 897
      },
      {
        "path": "src/utils/utils.py",
        "lang": "python",
        "bytes": 2012
      }
    ]
  },
  {
    "slug": "03-integrations/3p-observability/arize",
    "title": "AgentCore + Arize observability",
    "desc": "Deploy a Strands travel agent to AgentCore runtime with traces sent to Arize via the OpenInference OTel bridge (gRPC OTLP).",
    "sectionId": "observability",
    "kind": "integration",
    "frameworks": [
      "Strands"
    ],
    "languages": [
      "python"
    ],
    "hasNotebook": false,
    "readme": "/agentcore-samples/03-integrations/3p-observability/arize/README.md",
    "base": "/agentcore-samples/03-integrations/3p-observability/arize",
    "files": [
      {
        "path": "cleanup.py",
        "lang": "python",
        "bytes": 1488
      },
      {
        "path": "deploy.py",
        "lang": "python",
        "bytes": 9520
      },
      {
        "path": "invoke.py",
        "lang": "python",
        "bytes": 893
      },
      {
        "path": "requirements.txt",
        "lang": "text",
        "bytes": 212
      },
      {
        "path": "utils/travel_agent.py",
        "lang": "python",
        "bytes": 4473
      }
    ]
  },
  {
    "slug": "03-integrations/3p-observability/braintrust",
    "title": "AgentCore + Braintrust observability",
    "desc": "Deploy a Strands travel agent to AgentCore runtime with traces sent to Braintrust via OTLP.",
    "sectionId": "observability",
    "kind": "integration",
    "frameworks": [
      "Strands"
    ],
    "languages": [
      "python"
    ],
    "hasNotebook": false,
    "readme": "/agentcore-samples/03-integrations/3p-observability/braintrust/README.md",
    "base": "/agentcore-samples/03-integrations/3p-observability/braintrust",
    "files": [
      {
        "path": "cleanup.py",
        "lang": "python",
        "bytes": 1488
      },
      {
        "path": "deploy.py",
        "lang": "python",
        "bytes": 8480
      },
      {
        "path": "invoke.py",
        "lang": "python",
        "bytes": 893
      },
      {
        "path": "requirements.txt",
        "lang": "text",
        "bytes": 92
      },
      {
        "path": "utils/travel_agent.py",
        "lang": "python",
        "bytes": 3529
      }
    ]
  },
  {
    "slug": "03-integrations/3p-observability/dash0",
    "title": "AgentCore + Dash0 observability",
    "desc": "Deploy a Strands travel agent to AgentCore Runtime with traces, metrics, and logs sent to Dash0 via OTLP HTTP.",
    "sectionId": "observability",
    "kind": "integration",
    "frameworks": [
      "Strands"
    ],
    "languages": [
      "python"
    ],
    "hasNotebook": false,
    "readme": "/agentcore-samples/03-integrations/3p-observability/dash0/README.md",
    "base": "/agentcore-samples/03-integrations/3p-observability/dash0",
    "files": [
      {
        "path": "cleanup.py",
        "lang": "python",
        "bytes": 1488
      },
      {
        "path": "deploy.py",
        "lang": "python",
        "bytes": 7957
      },
      {
        "path": "invoke.py",
        "lang": "python",
        "bytes": 893
      },
      {
        "path": "requirements.txt",
        "lang": "text",
        "bytes": 149
      },
      {
        "path": "utils/travel_agent.py",
        "lang": "python",
        "bytes": 5598
      }
    ]
  },
  {
    "slug": "03-integrations/3p-observability/datadog",
    "title": "AgentCore + Datadog LLM observability",
    "desc": "Deploy a Strands travel agent to AgentCore runtime with traces sent to Datadog LLM observability via OTLP HTTP.",
    "sectionId": "observability",
    "kind": "integration",
    "frameworks": [
      "Strands"
    ],
    "languages": [
      "python"
    ],
    "hasNotebook": false,
    "readme": "/agentcore-samples/03-integrations/3p-observability/datadog/README.md",
    "base": "/agentcore-samples/03-integrations/3p-observability/datadog",
    "files": [
      {
        "path": "cleanup.py",
        "lang": "python",
        "bytes": 1488
      },
      {
        "path": "deploy.py",
        "lang": "python",
        "bytes": 8454
      },
      {
        "path": "invoke.py",
        "lang": "python",
        "bytes": 893
      },
      {
        "path": "requirements.txt",
        "lang": "text",
        "bytes": 149
      },
      {
        "path": "utils/travel_agent.py",
        "lang": "python",
        "bytes": 4248
      }
    ]
  },
  {
    "slug": "03-integrations/3p-observability/dynatrace",
    "title": "Amazon Bedrock Agent Integration with Dynatrace",
    "desc": "This example contains a demo of a Personal Assistant Agent built on top of Bedrock AgentCore Agents.",
    "sectionId": "observability",
    "kind": "integration",
    "frameworks": [
      "Strands"
    ],
    "languages": [
      "python"
    ],
    "hasNotebook": false,
    "readme": "/agentcore-samples/03-integrations/3p-observability/dynatrace/README.md",
    "base": "/agentcore-samples/03-integrations/3p-observability/dynatrace",
    "files": [
      {
        "path": "dynatrace.py",
        "lang": "python",
        "bytes": 1804
      },
      {
        "path": "main.py",
        "lang": "python",
        "bytes": 107
      },
      {
        "path": "pyproject.toml",
        "lang": "toml",
        "bytes": 321
      },
      {
        "path": "travel_agent.py",
        "lang": "python",
        "bytes": 887
      }
    ]
  },
  {
    "slug": "03-integrations/3p-observability/honeycomb",
    "title": "AgentCore + Honeycomb observability",
    "desc": "Deploy a Strands travel agent to AgentCore runtime with traces sent to Honeycomb via OTLP HTTP.",
    "sectionId": "observability",
    "kind": "integration",
    "frameworks": [
      "Strands"
    ],
    "languages": [
      "python"
    ],
    "hasNotebook": false,
    "readme": "/agentcore-samples/03-integrations/3p-observability/honeycomb/README.md",
    "base": "/agentcore-samples/03-integrations/3p-observability/honeycomb",
    "files": [
      {
        "path": "cleanup.py",
        "lang": "python",
        "bytes": 1488
      },
      {
        "path": "deploy.py",
        "lang": "python",
        "bytes": 7893
      },
      {
        "path": "invoke.py",
        "lang": "python",
        "bytes": 893
      },
      {
        "path": "requirements.txt",
        "lang": "text",
        "bytes": 187
      },
      {
        "path": "utils/travel_agent.py",
        "lang": "python",
        "bytes": 4611
      }
    ]
  },
  {
    "slug": "03-integrations/3p-observability/instana",
    "title": "AgentCore + Instana observability",
    "desc": "Deploy a Strands travel agent to AgentCore runtime with traces sent to Instana via OTLP HTTP.",
    "sectionId": "observability",
    "kind": "integration",
    "frameworks": [
      "Strands"
    ],
    "languages": [
      "python"
    ],
    "hasNotebook": false,
    "readme": "/agentcore-samples/03-integrations/3p-observability/instana/README.md",
    "base": "/agentcore-samples/03-integrations/3p-observability/instana",
    "files": [
      {
        "path": "cleanup.py",
        "lang": "python",
        "bytes": 1488
      },
      {
        "path": "deploy.py",
        "lang": "python",
        "bytes": 8071
      },
      {
        "path": "invoke.py",
        "lang": "python",
        "bytes": 893
      },
      {
        "path": "requirements.txt",
        "lang": "text",
        "bytes": 92
      },
      {
        "path": "utils/travel_agent.py",
        "lang": "python",
        "bytes": 3534
      }
    ]
  },
  {
    "slug": "03-integrations/3p-observability/langfuse",
    "title": "Strands Agent with Langfuse Observability on Amazon Bedrock AgentCore runtime",
    "desc": "This tutorial demonstrates deploying a Strands agent to Amazon Bedrock AgentCore runtime with Langfuse observability integration. The implementation uses Amazon Bedrock Claude models and sends...",
    "sectionId": "observability",
    "kind": "integration",
    "frameworks": [
      "Strands"
    ],
    "languages": [
      "python"
    ],
    "hasNotebook": false,
    "readme": "/agentcore-samples/03-integrations/3p-observability/langfuse/README.md",
    "base": "/agentcore-samples/03-integrations/3p-observability/langfuse",
    "files": [
      {
        "path": "cleanup.py",
        "lang": "python",
        "bytes": 1488
      },
      {
        "path": "deploy.py",
        "lang": "python",
        "bytes": 7886
      },
      {
        "path": "invoke.py",
        "lang": "python",
        "bytes": 893
      },
      {
        "path": "requirements.txt",
        "lang": "text",
        "bytes": 92
      },
      {
        "path": "utils/travel_agent.py",
        "lang": "python",
        "bytes": 3748
      }
    ]
  },
  {
    "slug": "03-integrations/3p-observability/openlit",
    "title": "AgentCore + OpenLIT observability",
    "desc": "Deploy a Strands travel agent to AgentCore runtime with traces sent to a self-hosted OpenLIT instance via OTLP HTTP.",
    "sectionId": "observability",
    "kind": "integration",
    "frameworks": [
      "Strands"
    ],
    "languages": [
      "python"
    ],
    "hasNotebook": false,
    "readme": "/agentcore-samples/03-integrations/3p-observability/openlit/README.md",
    "base": "/agentcore-samples/03-integrations/3p-observability/openlit",
    "files": [
      {
        "path": "cleanup.py",
        "lang": "python",
        "bytes": 1488
      },
      {
        "path": "deploy.py",
        "lang": "python",
        "bytes": 7998
      },
      {
        "path": "invoke.py",
        "lang": "python",
        "bytes": 893
      },
      {
        "path": "requirements.txt",
        "lang": "text",
        "bytes": 100
      },
      {
        "path": "utils/travel_agent.py",
        "lang": "python",
        "bytes": 3404
      }
    ]
  },
  {
    "slug": "03-integrations/agentic-frameworks/adk",
    "title": "ADK Agent with Bedrock AgentCore Integration",
    "desc": "This example demonstrates how to integrate a Google ADK agent with Amazon Bedrock AgentCore, enabling you to deploy a search-capable agent as a managed service.",
    "sectionId": null,
    "kind": "integration",
    "frameworks": [
      "Google ADK",
      "OpenAI Agents"
    ],
    "languages": [
      "python"
    ],
    "hasNotebook": false,
    "readme": "/agentcore-samples/03-integrations/agentic-frameworks/adk/README.md",
    "base": "/agentcore-samples/03-integrations/agentic-frameworks/adk",
    "files": [
      {
        "path": "adk-agent-google-search.py",
        "lang": "python",
        "bytes": 2046
      },
      {
        "path": "adk_agent_google_search.py",
        "lang": "python",
        "bytes": 2046
      },
      {
        "path": "requirements.txt",
        "lang": "text",
        "bytes": 120
      }
    ]
  },
  {
    "slug": "03-integrations/agentic-frameworks/autogen",
    "title": "AutoGen Agent with Bedrock AgentCore Integration",
    "desc": "This example demonstrates how to integrate an AutoGen agent with AWS Bedrock AgentCore, enabling you to deploy a conversational agent with tool-using capabilities as a managed service.",
    "sectionId": null,
    "kind": "integration",
    "frameworks": [
      "OpenAI Agents",
      "AutoGen"
    ],
    "languages": [
      "python"
    ],
    "hasNotebook": false,
    "readme": "/agentcore-samples/03-integrations/agentic-frameworks/autogen/README.md",
    "base": "/agentcore-samples/03-integrations/agentic-frameworks/autogen",
    "files": [
      {
        "path": "autogen_agent_hello_world.py",
        "lang": "python",
        "bytes": 3195
      },
      {
        "path": "requirements.txt",
        "lang": "text",
        "bytes": 104
      }
    ]
  },
  {
    "slug": "03-integrations/agentic-frameworks/claude-agent/claude-hooks",
    "title": "Claude Agent SDK - Hooks for Tool Governance & Audit",
    "desc": "This example demonstrates hook-based tool governance using Claude Agent SDK's PreToolUse and PostToolUse hooks, deployed on AWS Bedrock AgentCore.",
    "sectionId": null,
    "kind": "integration",
    "frameworks": [
      "Claude Agent SDK"
    ],
    "languages": [
      "python"
    ],
    "hasNotebook": false,
    "readme": "/agentcore-samples/03-integrations/agentic-frameworks/claude-agent/claude-hooks/README.md",
    "base": "/agentcore-samples/03-integrations/agentic-frameworks/claude-agent/claude-hooks",
    "files": [
      {
        "path": "agent.py",
        "lang": "python",
        "bytes": 4785
      },
      {
        "path": "requirements.txt",
        "lang": "text",
        "bytes": 69
      }
    ]
  },
  {
    "slug": "03-integrations/agentic-frameworks/claude-agent/claude-sdk",
    "title": "Claude Agent SDK with Bedrock AgentCore Integration",
    "desc": "This example demonstrates how to integrate Claude Agent SDK with AWS Bedrock AgentCore, enabling you to deploy your Claude-powered agent as a managed service with streaming support. You can use...",
    "sectionId": null,
    "kind": "integration",
    "frameworks": [
      "Claude Agent SDK"
    ],
    "languages": [
      "python"
    ],
    "hasNotebook": false,
    "readme": "/agentcore-samples/03-integrations/agentic-frameworks/claude-agent/claude-sdk/README.md",
    "base": "/agentcore-samples/03-integrations/agentic-frameworks/claude-agent/claude-sdk",
    "files": [
      {
        "path": "agent.py",
        "lang": "python",
        "bytes": 2636
      },
      {
        "path": "requirements.txt",
        "lang": "text",
        "bytes": 69
      }
    ]
  },
  {
    "slug": "03-integrations/agentic-frameworks/claude-agent/claude-sub-agents",
    "title": "Claude Agent SDK - Orchestrator-Workers Pattern",
    "desc": "This example demonstrates the Orchestrator-Workers agentic pattern using Claude Agent SDK's native subagent support (AgentDefinition + Task tool), deployed on AWS Bedrock AgentCore.",
    "sectionId": null,
    "kind": "integration",
    "frameworks": [
      "Claude Agent SDK"
    ],
    "languages": [
      "python"
    ],
    "hasNotebook": false,
    "readme": "/agentcore-samples/03-integrations/agentic-frameworks/claude-agent/claude-sub-agents/README.md",
    "base": "/agentcore-samples/03-integrations/agentic-frameworks/claude-agent/claude-sub-agents",
    "files": [
      {
        "path": "agent.py",
        "lang": "python",
        "bytes": 3590
      },
      {
        "path": "requirements.txt",
        "lang": "text",
        "bytes": 69
      }
    ]
  },
  {
    "slug": "03-integrations/agentic-frameworks/claude-agent/claude-with-code-interpreter",
    "title": "Code execution in Code Interpreter using Claude Agent",
    "desc": "This project demonstrates a Claude agent deployed on AWS Bedrock AgentCore that creates Code Interpreter sessions to securely execute code.",
    "sectionId": "code-interpreter",
    "kind": "integration",
    "frameworks": [
      "Claude Agent SDK"
    ],
    "languages": [
      "python"
    ],
    "hasNotebook": false,
    "readme": "/agentcore-samples/03-integrations/agentic-frameworks/claude-agent/claude-with-code-interpreter/README.md",
    "base": "/agentcore-samples/03-integrations/agentic-frameworks/claude-agent/claude-with-code-interpreter",
    "files": [
      {
        "path": "__init__.py",
        "lang": "python",
        "bytes": 69
      },
      {
        "path": "agent.py",
        "lang": "python",
        "bytes": 5384
      },
      {
        "path": "code_int_mcp/__init__.py",
        "lang": "python",
        "bytes": 68
      },
      {
        "path": "code_int_mcp/client.py",
        "lang": "python",
        "bytes": 3416
      },
      {
        "path": "code_int_mcp/models.py",
        "lang": "python",
        "bytes": 375
      },
      {
        "path": "code_int_mcp/server.py",
        "lang": "python",
        "bytes": 2376
      },
      {
        "path": "pyproject.toml",
        "lang": "toml",
        "bytes": 394
      },
      {
        "path": "test_scripts/cleanup.py",
        "lang": "python",
        "bytes": 1672
      },
      {
        "path": "test_scripts/invoke_agent.py",
        "lang": "python",
        "bytes": 3981
      }
    ]
  },
  {
    "slug": "03-integrations/agentic-frameworks/crewai/observability",
    "title": "AgentCore observability — CrewAI Agent (Non-runtime Hosted)",
    "desc": "Instrument a CrewAI agent running outside AgentCore runtime so its traces appear in the CloudWatch GenAI observability dashboard.",
    "sectionId": "observability",
    "kind": "integration",
    "frameworks": [
      "CrewAI"
    ],
    "languages": [
      "python"
    ],
    "hasNotebook": false,
    "readme": "/agentcore-samples/03-integrations/agentic-frameworks/crewai/observability/README.md",
    "base": "/agentcore-samples/03-integrations/agentic-frameworks/crewai/observability",
    "files": [
      {
        "path": "crewai_travel_agent.py",
        "lang": "python",
        "bytes": 3298
      },
      {
        "path": "crewai_travel_agent_with_session.py",
        "lang": "python",
        "bytes": 3913
      },
      {
        "path": "requirements.txt",
        "lang": "text",
        "bytes": 163
      },
      {
        "path": "setup.py",
        "lang": "python",
        "bytes": 1909
      }
    ]
  },
  {
    "slug": "03-integrations/agentic-frameworks/langgraph",
    "title": "LangGraph Agent with Bedrock AgentCore Integration",
    "desc": "This example demonstrates how to integrate a LangGraph agent with AWS Bedrock AgentCore, enabling you to deploy a web search-capable agent as a managed service.",
    "sectionId": null,
    "kind": "integration",
    "frameworks": [
      "LangGraph",
      "LangChain"
    ],
    "languages": [
      "python"
    ],
    "hasNotebook": false,
    "readme": "/agentcore-samples/03-integrations/agentic-frameworks/langgraph/README.md",
    "base": "/agentcore-samples/03-integrations/agentic-frameworks/langgraph",
    "files": [
      {
        "path": "langgraph_agent_web_search.py",
        "lang": "python",
        "bytes": 2109
      },
      {
        "path": "requirements.txt",
        "lang": "text",
        "bytes": 195
      }
    ]
  },
  {
    "slug": "03-integrations/agentic-frameworks/langgraph/observability",
    "title": "AgentCore observability — LangGraph Agent (Non-runtime Hosted)",
    "desc": "Instrument a LangGraph agent running outside AgentCore runtime so its traces appear in the CloudWatch GenAI observability dashboard.",
    "sectionId": "observability",
    "kind": "integration",
    "frameworks": [
      "LangGraph",
      "LangChain"
    ],
    "languages": [
      "python"
    ],
    "hasNotebook": false,
    "readme": "/agentcore-samples/03-integrations/agentic-frameworks/langgraph/observability/README.md",
    "base": "/agentcore-samples/03-integrations/agentic-frameworks/langgraph/observability",
    "files": [
      {
        "path": "langgraph_travel_agent.py",
        "lang": "python",
        "bytes": 3318
      },
      {
        "path": "langgraph_travel_agent_with_session.py",
        "lang": "python",
        "bytes": 4438
      },
      {
        "path": "requirements.txt",
        "lang": "text",
        "bytes": 221
      },
      {
        "path": "setup.py",
        "lang": "python",
        "bytes": 1918
      }
    ]
  },
  {
    "slug": "03-integrations/agentic-frameworks/llamaindex",
    "title": "LlamaIndex Agent with Bedrock AgentCore Integration",
    "desc": "This example demonstrates how to integrate a LlamaIndex agent with AWS Bedrock AgentCore, enabling you to deploy a financial assistant with tool-using capabilities as a managed service.",
    "sectionId": null,
    "kind": "integration",
    "frameworks": [
      "LlamaIndex",
      "OpenAI Agents"
    ],
    "languages": [
      "python"
    ],
    "hasNotebook": false,
    "readme": "/agentcore-samples/03-integrations/agentic-frameworks/llamaindex/README.md",
    "base": "/agentcore-samples/03-integrations/agentic-frameworks/llamaindex",
    "files": [
      {
        "path": "llama_agent_hello_world.py",
        "lang": "python",
        "bytes": 1097
      },
      {
        "path": "requirements.txt",
        "lang": "text",
        "bytes": 61
      }
    ]
  },
  {
    "slug": "03-integrations/agentic-frameworks/llamaindex/observability",
    "title": "AgentCore observability — LlamaIndex Agent (Non-runtime Hosted)",
    "desc": "Instrument a LlamaIndex FunctionAgent running outside AgentCore runtime so its traces appear in the CloudWatch GenAI observability dashboard.",
    "sectionId": "observability",
    "kind": "integration",
    "frameworks": [
      "LlamaIndex"
    ],
    "languages": [
      "python"
    ],
    "hasNotebook": false,
    "readme": "/agentcore-samples/03-integrations/agentic-frameworks/llamaindex/observability/README.md",
    "base": "/agentcore-samples/03-integrations/agentic-frameworks/llamaindex/observability",
    "files": [
      {
        "path": "llama_index_agent.py",
        "lang": "python",
        "bytes": 1963
      },
      {
        "path": "llama_index_agent_with_session.py",
        "lang": "python",
        "bytes": 2664
      },
      {
        "path": "requirements.txt",
        "lang": "text",
        "bytes": 230
      },
      {
        "path": "setup.py",
        "lang": "python",
        "bytes": 1922
      }
    ]
  },
  {
    "slug": "03-integrations/agentic-frameworks/openai-agents",
    "title": "OpenAI Agents with Bedrock AgentCore Integration",
    "desc": "This example demonstrates how to integrate OpenAI Agents with AWS Bedrock AgentCore, showcasing agent handoffs for specialized tasks.",
    "sectionId": null,
    "kind": "integration",
    "frameworks": [
      "OpenAI Agents"
    ],
    "languages": [
      "python"
    ],
    "hasNotebook": false,
    "readme": "/agentcore-samples/03-integrations/agentic-frameworks/openai-agents/README.md",
    "base": "/agentcore-samples/03-integrations/agentic-frameworks/openai-agents",
    "files": [
      {
        "path": "openai_agents_handoff_example.py",
        "lang": "python",
        "bytes": 3646
      },
      {
        "path": "openai_agents_hello_world.py",
        "lang": "python",
        "bytes": 1753
      },
      {
        "path": "requirements.txt",
        "lang": "text",
        "bytes": 66
      }
    ]
  },
  {
    "slug": "03-integrations/agentic-frameworks/strands-agents",
    "title": "Strands Agent with Bedrock AgentCore Integration",
    "desc": "These example demonstrate how to integrate a Strands agents with AWS Bedrock AgentCore, enabling you to deploy your agent as a managed service. You can use the agentcore CLI to configure and...",
    "sectionId": null,
    "kind": "integration",
    "frameworks": [
      "Strands",
      "OpenAI Agents"
    ],
    "languages": [
      "python"
    ],
    "hasNotebook": false,
    "readme": "/agentcore-samples/03-integrations/agentic-frameworks/strands-agents/README.md",
    "base": "/agentcore-samples/03-integrations/agentic-frameworks/strands-agents",
    "files": [
      {
        "path": "input.json",
        "lang": "json",
        "bytes": 48
      },
      {
        "path": "requirements.txt",
        "lang": "text",
        "bytes": 129
      },
      {
        "path": "strands_agent_file_system.py",
        "lang": "python",
        "bytes": 728
      },
      {
        "path": "strands_agents_streaming.py",
        "lang": "python",
        "bytes": 878
      },
      {
        "path": "strands_openai_identity.py",
        "lang": "python",
        "bytes": 2022
      }
    ]
  },
  {
    "slug": "03-integrations/agentic-frameworks/strands-agents/observability",
    "title": "AgentCore observability — Strands Agent (Non-runtime Hosted)",
    "desc": "Instrument a Strands agent running outside AgentCore runtime (e.g., on EC2, Lambda, or your local machine) to surface traces in the CloudWatch GenAI observability dashboard.",
    "sectionId": "observability",
    "kind": "integration",
    "frameworks": [
      "Strands"
    ],
    "languages": [
      "python"
    ],
    "hasNotebook": false,
    "readme": "/agentcore-samples/03-integrations/agentic-frameworks/strands-agents/observability/README.md",
    "base": "/agentcore-samples/03-integrations/agentic-frameworks/strands-agents/observability",
    "files": [
      {
        "path": "requirements.txt",
        "lang": "text",
        "bytes": 148
      },
      {
        "path": "setup.py",
        "lang": "python",
        "bytes": 1959
      },
      {
        "path": "strands_travel_agent.py",
        "lang": "python",
        "bytes": 2752
      },
      {
        "path": "strands_travel_agent_with_session.py",
        "lang": "python",
        "bytes": 3404
      }
    ]
  },
  {
    "slug": "03-integrations/agents-hosted-outside-runtime/agents-on-aws-lambda/01-lambda-invokes-runtime",
    "title": "AgentCore runtime + AWS Lambda observability",
    "desc": "Invoke an AgentCore-hosted Strands MCP agent from an AWS Lambda function with end-to-end CloudWatch Gen AI observability via the AWS Distro for OpenTelemetry (ADOT) Lambda Layer.",
    "sectionId": "runtime",
    "kind": "integration",
    "frameworks": [
      "Strands"
    ],
    "languages": [
      "python"
    ],
    "hasNotebook": false,
    "readme": "/agentcore-samples/03-integrations/agents-hosted-outside-runtime/agents-on-aws-lambda/01-lambda-invokes-runtime/README.md",
    "base": "/agentcore-samples/03-integrations/agents-hosted-outside-runtime/agents-on-aws-lambda/01-lambda-invokes-runtime",
    "files": [
      {
        "path": "cleanup.py",
        "lang": "python",
        "bytes": 3084
      },
      {
        "path": "deploy.py",
        "lang": "python",
        "bytes": 16585
      },
      {
        "path": "invoke.py",
        "lang": "python",
        "bytes": 2013
      },
      {
        "path": "requirements.txt",
        "lang": "text",
        "bytes": 109
      },
      {
        "path": "utils/lambda_handler.py",
        "lang": "python",
        "bytes": 2955
      },
      {
        "path": "utils/mcp_agent.py",
        "lang": "python",
        "bytes": 2017
      }
    ]
  },
  {
    "slug": "03-integrations/agents-hosted-outside-runtime/agents-on-aws-lambda/02-agent-in-lambda",
    "title": "Agent in Lambda with AgentCore Observability",
    "desc": "This sample shows how to wrap a Strands agent inside AWS Lambda and emit Gen AI observability traces to CloudWatch Application Signals via the AWS Distro for OpenTelemetry (ADOT) managed Lambda layer.",
    "sectionId": "runtime",
    "kind": "integration",
    "frameworks": [
      "Strands"
    ],
    "languages": [
      "python"
    ],
    "hasNotebook": false,
    "readme": "/agentcore-samples/03-integrations/agents-hosted-outside-runtime/agents-on-aws-lambda/02-agent-in-lambda/README.md",
    "base": "/agentcore-samples/03-integrations/agents-hosted-outside-runtime/agents-on-aws-lambda/02-agent-in-lambda",
    "files": [
      {
        "path": "build.sh",
        "lang": "bash",
        "bytes": 1125
      },
      {
        "path": "cleanup.py",
        "lang": "python",
        "bytes": 2378
      },
      {
        "path": "deploy.py",
        "lang": "python",
        "bytes": 9847
      },
      {
        "path": "evaluate.py",
        "lang": "python",
        "bytes": 6466
      },
      {
        "path": "invoke.py",
        "lang": "python",
        "bytes": 2974
      },
      {
        "path": "lambda_agent.py",
        "lang": "python",
        "bytes": 4387
      },
      {
        "path": "requirements.txt",
        "lang": "text",
        "bytes": 40
      }
    ]
  },
  {
    "slug": "03-integrations/agents-hosted-outside-runtime/agents-on-ecs/agentic-sales-analyst",
    "title": "Agentic Sales Analyst",
    "desc": "An agentic sales analyst that combines data from a sales database, along with real-time web research to provide complete market context for business decisions. The agent is built with the Strands...",
    "sectionId": "runtime",
    "kind": "integration",
    "frameworks": [
      "Strands"
    ],
    "languages": [
      "python",
      "tsx"
    ],
    "hasNotebook": false,
    "readme": "/agentcore-samples/03-integrations/agents-hosted-outside-runtime/agents-on-ecs/agentic-sales-analyst/README.md",
    "base": "/agentcore-samples/03-integrations/agents-hosted-outside-runtime/agents-on-ecs/agentic-sales-analyst",
    "files": [
      {
        "path": "client/package.json",
        "lang": "json",
        "bytes": 878
      },
      {
        "path": "client/public/index.html",
        "lang": "html",
        "bytes": 599
      },
      {
        "path": "client/src/App.tsx",
        "lang": "tsx",
        "bytes": 8748
      },
      {
        "path": "client/src/index.css",
        "lang": "css",
        "bytes": 6332
      },
      {
        "path": "client/src/index.tsx",
        "lang": "tsx",
        "bytes": 272
      },
      {
        "path": "client/tsconfig.json",
        "lang": "json",
        "bytes": 582
      },
      {
        "path": "create_and_load_sales_data.sql",
        "lang": "sql",
        "bytes": 1071
      },
      {
        "path": "deployment/cleanup-infrastructure.sh",
        "lang": "bash",
        "bytes": 2902
      },
      {
        "path": "deployment/common/01-network.yaml",
        "lang": "yaml",
        "bytes": 2948
      },
      {
        "path": "deployment/common/02-iam.yaml",
        "lang": "yaml",
        "bytes": 2788
      },
      {
        "path": "deployment/common/03-ecr.yaml",
        "lang": "yaml",
        "bytes": 968
      },
      {
        "path": "deployment/deploy-infrastructure.sh",
        "lang": "bash",
        "bytes": 3775
      },
      {
        "path": "deployment/ecs/cleanup-ecs.sh",
        "lang": "bash",
        "bytes": 2024
      },
      {
        "path": "deployment/ecs/cluster.yaml",
        "lang": "yaml",
        "bytes": 6059
      },
      {
        "path": "deployment/ecs/deploy-ecs.sh",
        "lang": "bash",
        "bytes": 1867
      },
      {
        "path": "deployment/ecs/service.yaml",
        "lang": "yaml",
        "bytes": 8253
      },
      {
        "path": "docker-compose.local.yml",
        "lang": "yaml",
        "bytes": 2188
      },
      {
        "path": "local-dev-policy.json",
        "lang": "json",
        "bytes": 432
      },
      {
        "path": "requirements.txt",
        "lang": "text",
        "bytes": 156
      },
      {
        "path": "strands_agentcore_runtime.py",
        "lang": "python",
        "bytes": 33496
      }
    ]
  },
  {
    "slug": "03-integrations/agents-hosted-outside-runtime/agents-on-eks",
    "title": "AgentCore observability for EKS-Hosted Agent",
    "desc": "Deploy a Strands Travel Agent to Amazon EKS with CloudWatch Gen AI observability via the AWS Distro for OpenTelemetry (ADOT).",
    "sectionId": "runtime",
    "kind": "integration",
    "frameworks": [
      "Strands"
    ],
    "languages": [
      "python"
    ],
    "hasNotebook": false,
    "readme": "/agentcore-samples/03-integrations/agents-hosted-outside-runtime/agents-on-eks/README.md",
    "base": "/agentcore-samples/03-integrations/agents-hosted-outside-runtime/agents-on-eks",
    "files": [
      {
        "path": "chart/Chart.yaml",
        "lang": "yaml",
        "bytes": 170
      },
      {
        "path": "chart/templates/NOTES.txt",
        "lang": "text",
        "bytes": 1821
      },
      {
        "path": "chart/templates/deployment.yaml",
        "lang": "yaml",
        "bytes": 1949
      },
      {
        "path": "chart/templates/ingress.yaml",
        "lang": "yaml",
        "bytes": 1417
      },
      {
        "path": "chart/templates/poddisruptionbudget.yaml",
        "lang": "yaml",
        "bytes": 619
      },
      {
        "path": "chart/templates/service.yaml",
        "lang": "yaml",
        "bytes": 431
      },
      {
        "path": "chart/templates/serviceaccount.yaml",
        "lang": "yaml",
        "bytes": 348
      },
      {
        "path": "chart/values.yaml",
        "lang": "yaml",
        "bytes": 715
      },
      {
        "path": "cleanup.sh",
        "lang": "bash",
        "bytes": 2177
      },
      {
        "path": "deploy.sh",
        "lang": "bash",
        "bytes": 6079
      },
      {
        "path": "docker/app/app.py",
        "lang": "python",
        "bytes": 9423
      },
      {
        "path": "docker/requirements.txt",
        "lang": "text",
        "bytes": 137
      },
      {
        "path": "invoke.py",
        "lang": "python",
        "bytes": 1860
      }
    ]
  },
  {
    "slug": "03-integrations/bedrock-agent",
    "title": "Amazon Bedrock Agent Integration with Bedrock AgentCore Gateway",
    "desc": "This use case demonstrates a complete end-to-end integration between Amazon Bedrock Agents and Amazon Bedrock AgentCore Gateway using the Model Context Protocol (MCP) to connect with a practical...",
    "sectionId": null,
    "kind": "integration",
    "frameworks": [],
    "languages": [],
    "hasNotebook": true,
    "readme": "/agentcore-samples/03-integrations/bedrock-agent/README.md",
    "base": "/agentcore-samples/03-integrations/bedrock-agent",
    "files": [
      {
        "path": "Bedrock_Agent_Integration_with_Bedrock_Agent_Core_Gateway.md",
        "lang": "markdown",
        "bytes": 44276,
        "fromNotebook": true
      },
      {
        "path": "requirements.txt",
        "lang": "text",
        "bytes": 317
      }
    ]
  },
  {
    "slug": "03-integrations/data-platforms/databricks-dbsql-agentcore-gateway",
    "title": "Databricks SQL MCP Server with Amazon Bedrock AgentCore Gateway",
    "desc": "Connect your Databricks SQL MCP server to AgentCore Gateway. Zero custom code — Gateway handles both inbound and outbound auth.",
    "sectionId": "gateway",
    "kind": "integration",
    "frameworks": [
      "Strands"
    ],
    "languages": [],
    "hasNotebook": true,
    "readme": "/agentcore-samples/03-integrations/data-platforms/databricks-dbsql-agentcore-gateway/README.md",
    "base": "/agentcore-samples/03-integrations/data-platforms/databricks-dbsql-agentcore-gateway",
    "files": [
      {
        "path": "databricks_dbsql_agentcore_gateway.md",
        "lang": "markdown",
        "bytes": 22635,
        "fromNotebook": true
      }
    ]
  },
  {
    "slug": "03-integrations/data-platforms/databricks-dbsql-per-user-delegation",
    "title": "Databricks Per-User Delegation with AgentCore Gateway Interceptor",
    "desc": "Per-user identity propagation from Entra ID to Databricks via AgentCore Gateway REQUEST interceptor and RFC 8693 OAuth Token Exchange.",
    "sectionId": null,
    "kind": "integration",
    "frameworks": [
      "Strands"
    ],
    "languages": [],
    "hasNotebook": true,
    "readme": "/agentcore-samples/03-integrations/data-platforms/databricks-dbsql-per-user-delegation/README.md",
    "base": "/agentcore-samples/03-integrations/data-platforms/databricks-dbsql-per-user-delegation",
    "files": [
      {
        "path": "databricks_dbsql_per_user_delegation.md",
        "lang": "markdown",
        "bytes": 14918,
        "fromNotebook": true
      }
    ]
  },
  {
    "slug": "03-integrations/gateway/agentcore-tool-search-plugin",
    "title": "Semantic Tool Discovery with AgentCore Gateway Tool Search Plugin",
    "desc": "This sample demonstrates how to build a Strands agent that uses Amazon Bedrock AgentCore Gateway's semantic tool search to dynamically discover and invoke only the relevant tools for each user...",
    "sectionId": "gateway",
    "kind": "integration",
    "frameworks": [
      "Strands"
    ],
    "languages": [
      "python"
    ],
    "hasNotebook": false,
    "readme": "/agentcore-samples/03-integrations/gateway/agentcore-tool-search-plugin/README.md",
    "base": "/agentcore-samples/03-integrations/gateway/agentcore-tool-search-plugin",
    "files": [
      {
        "path": "cleanup.py",
        "lang": "python",
        "bytes": 2805
      },
      {
        "path": "config.py",
        "lang": "python",
        "bytes": 552
      },
      {
        "path": "deploy.py",
        "lang": "python",
        "bytes": 8817
      },
      {
        "path": "invoke.py",
        "lang": "python",
        "bytes": 3098
      },
      {
        "path": "lambda/tool_schemas.json",
        "lang": "json",
        "bytes": 10304
      },
      {
        "path": "lambda/travel_tools.py",
        "lang": "python",
        "bytes": 46163
      },
      {
        "path": "requirements.txt",
        "lang": "text",
        "bytes": 130
      }
    ]
  },
  {
    "slug": "03-integrations/gateway/agentcore-tool-search-plugin/benchmarks",
    "title": "AgentCore Tool Search Plugin — Benchmarks",
    "desc": "Two benchmarks evaluate the AgentCoreToolSearchPlugin from different angles:",
    "sectionId": "gateway",
    "kind": "integration",
    "frameworks": [
      "Strands"
    ],
    "languages": [
      "python"
    ],
    "hasNotebook": false,
    "readme": "/agentcore-samples/03-integrations/gateway/agentcore-tool-search-plugin/benchmarks/README.md",
    "base": "/agentcore-samples/03-integrations/gateway/agentcore-tool-search-plugin/benchmarks",
    "files": [
      {
        "path": "benchmark_results.json",
        "lang": "json",
        "bytes": 534
      },
      {
        "path": "intent_relevance_benchmark.py",
        "lang": "python",
        "bytes": 24140
      },
      {
        "path": "tool_search_scaling_benchmark.py",
        "lang": "python",
        "bytes": 22902
      }
    ]
  },
  {
    "slug": "03-integrations/gateway/bedrock-kb-auto-register",
    "title": "Auto-Register Bedrock Knowledge Bases on AgentCore Gateway",
    "desc": "This tutorial demonstrates how to build a self-registering Knowledge Base gateway using Amazon Bedrock AgentCore Gateway. When a new Bedrock Knowledge Base is created anywhere in the account, it...",
    "sectionId": "gateway",
    "kind": "integration",
    "frameworks": [
      "Strands"
    ],
    "languages": [],
    "hasNotebook": true,
    "readme": "/agentcore-samples/03-integrations/gateway/bedrock-kb-auto-register/README.md",
    "base": "/agentcore-samples/03-integrations/gateway/bedrock-kb-auto-register",
    "files": [
      {
        "path": "bedrock_kb_auto_register_gateway.md",
        "lang": "markdown",
        "bytes": 40570,
        "fromNotebook": true
      }
    ]
  },
  {
    "slug": "03-integrations/gateway/dynatrace",
    "title": "Integrate Dynatrace MCP Server with AgentCore Gateway",
    "desc": "This tutorial demonstrates how to integrate Dynatrace's MCP server with Amazon Bedrock AgentCore Gateway, providing centralized access to observability capabilities through a unified interface....",
    "sectionId": "gateway",
    "kind": "integration",
    "frameworks": [
      "Strands"
    ],
    "languages": [],
    "hasNotebook": true,
    "readme": "/agentcore-samples/03-integrations/gateway/dynatrace/README.md",
    "base": "/agentcore-samples/03-integrations/gateway/dynatrace",
    "files": [
      {
        "path": "01-dynatrace-mcp-server-target.md",
        "lang": "markdown",
        "bytes": 14192,
        "fromNotebook": true
      },
      {
        "path": "requirements.txt",
        "lang": "text",
        "bytes": 85
      }
    ]
  },
  {
    "slug": "03-integrations/ux-examples/streamlit-chat",
    "title": "Bedrock AgentCore Chat Interface",
    "desc": "A Streamlit web application for interacting with AI agents deployed on Amazon Bedrock AgentCore Runtime. This application provides an intuitive chat interface to communicate with your deployed...",
    "sectionId": null,
    "kind": "integration",
    "frameworks": [
      "Strands",
      "LangGraph",
      "CrewAI"
    ],
    "languages": [
      "python"
    ],
    "hasNotebook": false,
    "readme": "/agentcore-samples/03-integrations/ux-examples/streamlit-chat/README.md",
    "base": "/agentcore-samples/03-integrations/ux-examples/streamlit-chat",
    "files": [
      {
        "path": ".streamlit/config.toml",
        "lang": "toml",
        "bytes": 716
      },
      {
        "path": "app.py",
        "lang": "python",
        "bytes": 23083
      },
      {
        "path": "example/agent.py",
        "lang": "python",
        "bytes": 1424
      },
      {
        "path": "example/requirements.txt",
        "lang": "text",
        "bytes": 62
      },
      {
        "path": "pyproject.toml",
        "lang": "toml",
        "bytes": 437
      }
    ]
  },
  {
    "slug": "04-infrastructure-as-code/cdk/python",
    "title": "Python CDK Samples",
    "desc": "Deploy Amazon Bedrock AgentCore resources using AWS CDK with Python.",
    "sectionId": null,
    "kind": "iac",
    "frameworks": [],
    "languages": [
      "python"
    ],
    "hasNotebook": false,
    "readme": "/agentcore-samples/04-infrastructure-as-code/cdk/python/README.md",
    "base": "/agentcore-samples/04-infrastructure-as-code/cdk/python",
    "files": [
      {
        "path": "nag_suppressions.py",
        "lang": "python",
        "bytes": 2506
      }
    ]
  },
  {
    "slug": "04-infrastructure-as-code/cdk/python/basic-runtime",
    "title": "Basic AgentCore Runtime - CDK",
    "desc": "This CDK stack deploys a basic Amazon Bedrock AgentCore Runtime with a simple Strands agent. This is the simplest possible AgentCore deployment, perfect for getting started and understanding the...",
    "sectionId": "runtime",
    "kind": "iac",
    "frameworks": [
      "Strands"
    ],
    "languages": [
      "python"
    ],
    "hasNotebook": false,
    "readme": "/agentcore-samples/04-infrastructure-as-code/cdk/python/basic-runtime/README.md",
    "base": "/agentcore-samples/04-infrastructure-as-code/cdk/python/basic-runtime",
    "files": [
      {
        "path": "agent-code/basic_agent.py",
        "lang": "python",
        "bytes": 921
      },
      {
        "path": "agent-code/requirements.txt",
        "lang": "text",
        "bytes": 39
      },
      {
        "path": "app.py",
        "lang": "python",
        "bytes": 256
      },
      {
        "path": "basic_runtime_stack.py",
        "lang": "python",
        "bytes": 9340
      },
      {
        "path": "cdk.json",
        "lang": "json",
        "bytes": 2728
      },
      {
        "path": "infra_utils/__init__.py",
        "lang": "python",
        "bytes": 42
      },
      {
        "path": "infra_utils/agentcore_role.py",
        "lang": "python",
        "bytes": 4320
      },
      {
        "path": "infra_utils/build_trigger_lambda.py",
        "lang": "python",
        "bytes": 3547
      },
      {
        "path": "nag_suppressions.py",
        "lang": "python",
        "bytes": 2506
      },
      {
        "path": "requirements.txt",
        "lang": "text",
        "bytes": 49
      }
    ]
  },
  {
    "slug": "04-infrastructure-as-code/cdk/python/end-to-end-weather-agent",
    "title": "End-to-End Weather Agent with Tools and Memory - CDK",
    "desc": "This CDK stack deploys a complete Amazon Bedrock AgentCore Runtime with a sophisticated weather-based activity planning agent. This demonstrates the full power of AgentCore by integrating Browser...",
    "sectionId": null,
    "kind": "iac",
    "frameworks": [
      "Strands",
      "LangChain"
    ],
    "languages": [
      "python"
    ],
    "hasNotebook": false,
    "readme": "/agentcore-samples/04-infrastructure-as-code/cdk/python/end-to-end-weather-agent/README.md",
    "base": "/agentcore-samples/04-infrastructure-as-code/cdk/python/end-to-end-weather-agent",
    "files": [
      {
        "path": "agent-code/requirements.txt",
        "lang": "text",
        "bytes": 142
      },
      {
        "path": "agent-code/weather_agent.py",
        "lang": "python",
        "bytes": 11410
      },
      {
        "path": "app.py",
        "lang": "python",
        "bytes": 258
      },
      {
        "path": "cdk.json",
        "lang": "json",
        "bytes": 2728
      },
      {
        "path": "infra_utils/__init__.py",
        "lang": "python",
        "bytes": 55
      },
      {
        "path": "infra_utils/agentcore_role.py",
        "lang": "python",
        "bytes": 5894
      },
      {
        "path": "infra_utils/build_trigger_lambda.py",
        "lang": "python",
        "bytes": 3547
      },
      {
        "path": "infra_utils/memory_initializer_lambda.py",
        "lang": "python",
        "bytes": 4312
      },
      {
        "path": "nag_suppressions.py",
        "lang": "python",
        "bytes": 2506
      },
      {
        "path": "requirements.txt",
        "lang": "text",
        "bytes": 49
      },
      {
        "path": "weather_agent_stack.py",
        "lang": "python",
        "bytes": 13736
      }
    ]
  },
  {
    "slug": "04-infrastructure-as-code/cdk/python/mcp-server-agentcore-runtime",
    "title": "Hosting MCP Server on AgentCore Runtime - CDK",
    "desc": "This CDK stack deploys an MCP (Model Context Protocol) server on Amazon Bedrock AgentCore Runtime. It demonstrates how to host MCP tools on AgentCore Runtime using infrastructure as code, with...",
    "sectionId": "runtime",
    "kind": "iac",
    "frameworks": [],
    "languages": [
      "python"
    ],
    "hasNotebook": false,
    "readme": "/agentcore-samples/04-infrastructure-as-code/cdk/python/mcp-server-agentcore-runtime/README.md",
    "base": "/agentcore-samples/04-infrastructure-as-code/cdk/python/mcp-server-agentcore-runtime",
    "files": [
      {
        "path": "app.py",
        "lang": "python",
        "bytes": 246
      },
      {
        "path": "cdk.json",
        "lang": "json",
        "bytes": 2823
      },
      {
        "path": "explore_cdk.py",
        "lang": "python",
        "bytes": 2425
      },
      {
        "path": "get_token.py",
        "lang": "python",
        "bytes": 2230
      },
      {
        "path": "infra_utils/__init__.py",
        "lang": "python",
        "bytes": 71
      },
      {
        "path": "infra_utils/agentcore_role.py",
        "lang": "python",
        "bytes": 4320
      },
      {
        "path": "infra_utils/build_trigger_lambda.py",
        "lang": "python",
        "bytes": 3547
      },
      {
        "path": "mcp_server_stack.py",
        "lang": "python",
        "bytes": 20928
      },
      {
        "path": "nag_suppressions.py",
        "lang": "python",
        "bytes": 2506
      },
      {
        "path": "requirements.txt",
        "lang": "text",
        "bytes": 49
      },
      {
        "path": "test_mcp_server.py",
        "lang": "python",
        "bytes": 3027
      }
    ]
  },
  {
    "slug": "04-infrastructure-as-code/cdk/python/multi-agent-runtime",
    "title": "Multi-Agent AgentCore Runtime - CDK",
    "desc": "This CDK stack demonstrates a multi-agent architecture where one agent (orchestrator) can invoke another agent (specialist) to handle complex tasks. This pattern is useful for building...",
    "sectionId": "runtime",
    "kind": "iac",
    "frameworks": [],
    "languages": [
      "python"
    ],
    "hasNotebook": false,
    "readme": "/agentcore-samples/04-infrastructure-as-code/cdk/python/multi-agent-runtime/README.md",
    "base": "/agentcore-samples/04-infrastructure-as-code/cdk/python/multi-agent-runtime",
    "files": [
      {
        "path": "app.py",
        "lang": "python",
        "bytes": 250
      },
      {
        "path": "cdk.json",
        "lang": "json",
        "bytes": 2823
      },
      {
        "path": "infra_utils/__init__.py",
        "lang": "python",
        "bytes": 71
      },
      {
        "path": "infra_utils/agentcore_role.py",
        "lang": "python",
        "bytes": 4320
      },
      {
        "path": "infra_utils/build_trigger_lambda.py",
        "lang": "python",
        "bytes": 3547
      },
      {
        "path": "multi_agent_stack.py",
        "lang": "python",
        "bytes": 32045
      },
      {
        "path": "nag_suppressions.py",
        "lang": "python",
        "bytes": 2506
      },
      {
        "path": "requirements.txt",
        "lang": "text",
        "bytes": 49
      },
      {
        "path": "test_multi_agent.py",
        "lang": "python",
        "bytes": 4127
      }
    ]
  },
  {
    "slug": "04-infrastructure-as-code/cdk/typescript/knowledge-base-rag-agent",
    "title": "Knowledge Base RAG Agent",
    "desc": "An AWS CDK template for deploying AI agents using Amazon Bedrock AgentCore with Knowledge Base integration and web interface. This template demonstrates production-ready patterns for building...",
    "sectionId": null,
    "kind": "iac",
    "frameworks": [
      "Strands"
    ],
    "languages": [
      "javascript",
      "tsx",
      "typescript"
    ],
    "hasNotebook": false,
    "readme": "/agentcore-samples/04-infrastructure-as-code/cdk/typescript/knowledge-base-rag-agent/README.md",
    "base": "/agentcore-samples/04-infrastructure-as-code/cdk/typescript/knowledge-base-rag-agent",
    "files": [
      {
        "path": "docs/API_USAGE.md",
        "lang": "markdown",
        "bytes": 5358
      },
      {
        "path": "docs/ARCHITECTURE.md",
        "lang": "markdown",
        "bytes": 12974
      },
      {
        "path": "docs/DEPLOYMENT.md",
        "lang": "markdown",
        "bytes": 6387
      },
      {
        "path": "docs/GUIDANCE_PUBLICATION.md",
        "lang": "markdown",
        "bytes": 13370
      },
      {
        "path": "docs/MODEL_CONFIGURATION.md",
        "lang": "markdown",
        "bytes": 5320
      },
      {
        "path": "docs/SECURITY.md",
        "lang": "markdown",
        "bytes": 6671
      },
      {
        "path": "docs/TROUBLESHOOTING.md",
        "lang": "markdown",
        "bytes": 14265
      },
      {
        "path": "docs/knowledge-base-examples/README.md",
        "lang": "markdown",
        "bytes": 2824
      },
      {
        "path": "docs/knowledge-base-examples/bedrock-agentcore-guide.md",
        "lang": "markdown",
        "bytes": 4525
      },
      {
        "path": "docs/knowledge-base-examples/getting-started.md",
        "lang": "markdown",
        "bytes": 3363
      },
      {
        "path": "docs/knowledge-base-examples/test-kb-document.md",
        "lang": "markdown",
        "bytes": 1898
      },
      {
        "path": "eslint.config.js",
        "lang": "javascript",
        "bytes": 6599
      },
      {
        "path": "package.json",
        "lang": "json",
        "bytes": 2276
      },
      {
        "path": "scripts/check-prerequisites.sh",
        "lang": "bash",
        "bytes": 4900
      },
      {
        "path": "scripts/deploy.sh",
        "lang": "bash",
        "bytes": 8680
      },
      {
        "path": "scripts/upload-documents.sh",
        "lang": "bash",
        "bytes": 8112
      },
      {
        "path": "tsconfig.base.json",
        "lang": "json",
        "bytes": 1670
      },
      {
        "path": "tsconfig.json",
        "lang": "json",
        "bytes": 394
      },
      {
        "path": "web-console/__tests__/components/ErrorBoundary.test.tsx",
        "lang": "tsx",
        "bytes": 2156
      },
      {
        "path": "web-console/__tests__/components/Layout.test.tsx",
        "lang": "tsx",
        "bytes": 1529
      },
      {
        "path": "web-console/components/ErrorBoundary.tsx",
        "lang": "tsx",
        "bytes": 3186
      },
      {
        "path": "web-console/components/Layout.tsx",
        "lang": "tsx",
        "bytes": 6724
      },
      {
        "path": "web-console/contexts/AuthContext.tsx",
        "lang": "tsx",
        "bytes": 5812
      },
      {
        "path": "web-console/e2e/auth.spec.ts",
        "lang": "typescript",
        "bytes": 2247
      },
      {
        "path": "web-console/e2e/chat.spec.ts",
        "lang": "typescript",
        "bytes": 5298
      },
      {
        "path": "web-console/jest.config.js",
        "lang": "javascript",
        "bytes": 1038
      },
      {
        "path": "web-console/jest.setup.js",
        "lang": "javascript",
        "bytes": 1429
      },
      {
        "path": "web-console/next.config.js",
        "lang": "javascript",
        "bytes": 587
      },
      {
        "path": "web-console/package.json",
        "lang": "json",
        "bytes": 2077
      },
      {
        "path": "web-console/pages/_app.tsx",
        "lang": "tsx",
        "bytes": 5887
      },
      {
        "path": "web-console/pages/api/proxy.ts",
        "lang": "typescript",
        "bytes": 1039
      },
      {
        "path": "web-console/pages/chat.tsx",
        "lang": "tsx",
        "bytes": 9441
      },
      {
        "path": "web-console/pages/dashboard.tsx",
        "lang": "tsx",
        "bytes": 3057
      },
      {
        "path": "web-console/pages/index.tsx",
        "lang": "tsx",
        "bytes": 4054
      },
      {
        "path": "web-console/pages/login.tsx",
        "lang": "tsx",
        "bytes": 4697
      },
      {
        "path": "web-console/playwright.config.ts",
        "lang": "typescript",
        "bytes": 2219
      },
      {
        "path": "web-console/services/api.ts",
        "lang": "typescript",
        "bytes": 917
      },
      {
        "path": "web-console/styles/globals.css",
        "lang": "css",
        "bytes": 1300
      },
      {
        "path": "web-console/styles/theme.ts",
        "lang": "typescript",
        "bytes": 2190
      },
      {
        "path": "web-console/tsconfig.json",
        "lang": "json",
        "bytes": 586
      },
      {
        "path": "web-console/utils/api.ts",
        "lang": "typescript",
        "bytes": 2229
      },
      {
        "path": "web-console/utils/auth.ts",
        "lang": "typescript",
        "bytes": 2361
      },
      {
        "path": "web-console/utils/config.ts",
        "lang": "typescript",
        "bytes": 1088
      },
      {
        "path": "web-console/utils/proxy-service-new.ts",
        "lang": "typescript",
        "bytes": 6320
      },
      {
        "path": "web-console/utils/proxy-service.ts",
        "lang": "typescript",
        "bytes": 862
      },
      {
        "path": "web-console/utils/validation.ts",
        "lang": "typescript",
        "bytes": 4937
      }
    ]
  },
  {
    "slug": "04-infrastructure-as-code/cdk/typescript/knowledge-base-rag-agent/infrastructure",
    "title": "Knowledge Base RAG Agent - Infrastructure",
    "desc": "This directory contains AWS CDK infrastructure code for deploying a complete Bedrock Agent application.",
    "sectionId": null,
    "kind": "iac",
    "frameworks": [
      "Strands"
    ],
    "languages": [
      "javascript",
      "python",
      "typescript"
    ],
    "hasNotebook": false,
    "readme": "/agentcore-samples/04-infrastructure-as-code/cdk/typescript/knowledge-base-rag-agent/infrastructure/README.md",
    "base": "/agentcore-samples/04-infrastructure-as-code/cdk/typescript/knowledge-base-rag-agent/infrastructure",
    "files": [
      {
        "path": "agent/requirements.txt",
        "lang": "text",
        "bytes": 252
      },
      {
        "path": "agent/src/__init__.py",
        "lang": "python",
        "bytes": 35
      },
      {
        "path": "agent/src/agent.py",
        "lang": "python",
        "bytes": 2071
      },
      {
        "path": "agent/src/main.py",
        "lang": "python",
        "bytes": 5048
      },
      {
        "path": "agent/src/memory.py",
        "lang": "python",
        "bytes": 5088
      },
      {
        "path": "agent/src/tools/__init__.py",
        "lang": "python",
        "bytes": 110
      },
      {
        "path": "agent/src/tools/knowledge_base.py",
        "lang": "python",
        "bytes": 3799
      },
      {
        "path": "bin/app.ts",
        "lang": "typescript",
        "bytes": 7933
      },
      {
        "path": "cdk.json",
        "lang": "json",
        "bytes": 1374
      },
      {
        "path": "jest.config.js",
        "lang": "javascript",
        "bytes": 1002
      },
      {
        "path": "lib/constructs/api-proxy-construct.ts",
        "lang": "typescript",
        "bytes": 7598
      },
      {
        "path": "lib/constructs/bedrock-knowledge-base-permissions.ts",
        "lang": "typescript",
        "bytes": 7379
      },
      {
        "path": "lib/constructs/cors-cloudfront-config.ts",
        "lang": "typescript",
        "bytes": 6434
      },
      {
        "path": "lib/constructs/lambda-function.ts",
        "lang": "typescript",
        "bytes": 1169
      },
      {
        "path": "lib/constructs/lambda-layer.ts",
        "lang": "typescript",
        "bytes": 856
      },
      {
        "path": "lib/constructs/origin-request-function.ts",
        "lang": "typescript",
        "bytes": 3079
      },
      {
        "path": "lib/stacks/agentcore-memory-stack.ts",
        "lang": "typescript",
        "bytes": 2522
      },
      {
        "path": "lib/stacks/agentcore-runtime-stack.ts",
        "lang": "typescript",
        "bytes": 6952
      },
      {
        "path": "lib/stacks/api-stack.ts",
        "lang": "typescript",
        "bytes": 16513
      },
      {
        "path": "lib/stacks/cognito-stack.ts",
        "lang": "typescript",
        "bytes": 14168
      },
      {
        "path": "lib/stacks/compute-stack.ts",
        "lang": "typescript",
        "bytes": 4356
      },
      {
        "path": "lib/stacks/database-stack.ts",
        "lang": "typescript",
        "bytes": 3145
      },
      {
        "path": "lib/stacks/monitoring-stack.ts",
        "lang": "typescript",
        "bytes": 7757
      },
      {
        "path": "lib/stacks/network-stack.ts",
        "lang": "typescript",
        "bytes": 4567
      },
      {
        "path": "lib/stacks/opensearch-stack.ts",
        "lang": "typescript",
        "bytes": 20244
      },
      {
        "path": "lib/stacks/shared-resources-stack.ts",
        "lang": "typescript",
        "bytes": 5751
      },
      {
        "path": "lib/stacks/storage-stack.ts",
        "lang": "typescript",
        "bytes": 3980
      },
      {
        "path": "lib/stacks/web-console-stack.ts",
        "lang": "typescript",
        "bytes": 5354
      },
      {
        "path": "lib/utils/nag-suppressions.ts",
        "lang": "typescript",
        "bytes": 8866
      },
      {
        "path": "package.json",
        "lang": "json",
        "bytes": 1957
      },
      {
        "path": "src/functions/chat/index.ts",
        "lang": "typescript",
        "bytes": 15152
      },
      {
        "path": "src/functions/chat/package.json",
        "lang": "json",
        "bytes": 571
      },
      {
        "path": "src/functions/chat/tsconfig.json",
        "lang": "json",
        "bytes": 388
      },
      {
        "path": "src/functions/create-initial-user/index.js",
        "lang": "javascript",
        "bytes": 3409
      },
      {
        "path": "src/functions/create-initial-user/package.json",
        "lang": "json",
        "bytes": 232
      },
      {
        "path": "src/functions/layers/common/nodejs/package.json",
        "lang": "json",
        "bytes": 815
      },
      {
        "path": "src/functions/package.json",
        "lang": "json",
        "bytes": 559
      },
      {
        "path": "src/functions/tsconfig.json",
        "lang": "json",
        "bytes": 470
      },
      {
        "path": "src/functions/types.ts",
        "lang": "typescript",
        "bytes": 415
      },
      {
        "path": "src/functions/vector-index/index.js",
        "lang": "javascript",
        "bytes": 10410
      },
      {
        "path": "src/functions/vector-index/package.json",
        "lang": "json",
        "bytes": 373
      },
      {
        "path": "tsconfig.json",
        "lang": "json",
        "bytes": 434
      }
    ]
  },
  {
    "slug": "04-infrastructure-as-code/cdk/typescript/knowledge-base-rag-agent/infrastructure/test",
    "title": "Test Suite",
    "desc": "This directory contains a focused test suite for the Bedrock AgentCore Template infrastructure, designed for open-source contribution and AWS Labs submission.",
    "sectionId": null,
    "kind": "iac",
    "frameworks": [],
    "languages": [
      "typescript"
    ],
    "hasNotebook": false,
    "readme": "/agentcore-samples/04-infrastructure-as-code/cdk/typescript/knowledge-base-rag-agent/infrastructure/test/README.md",
    "base": "/agentcore-samples/04-infrastructure-as-code/cdk/typescript/knowledge-base-rag-agent/infrastructure/test",
    "files": [
      {
        "path": "setup.ts",
        "lang": "typescript",
        "bytes": 850
      },
      {
        "path": "stacks/api-stack.test.ts",
        "lang": "typescript",
        "bytes": 744
      },
      {
        "path": "unit/functions/chat.test.ts",
        "lang": "typescript",
        "bytes": 3741
      }
    ]
  },
  {
    "slug": "04-infrastructure-as-code/cloudformation/basic-runtime",
    "title": "Basic AgentCore Runtime",
    "desc": "This CloudFormation template deploys a basic Amazon Bedrock AgentCore Runtime with a simple Strands agent. This is the simplest possible AgentCore deployment, perfect for getting started and...",
    "sectionId": "runtime",
    "kind": "iac",
    "frameworks": [
      "Strands"
    ],
    "languages": [],
    "hasNotebook": false,
    "readme": "/agentcore-samples/04-infrastructure-as-code/cloudformation/basic-runtime/README.md",
    "base": "/agentcore-samples/04-infrastructure-as-code/cloudformation/basic-runtime",
    "files": [
      {
        "path": "cleanup.sh",
        "lang": "bash",
        "bytes": 1667
      },
      {
        "path": "deploy.sh",
        "lang": "bash",
        "bytes": 2343
      },
      {
        "path": "template.yaml",
        "lang": "yaml",
        "bytes": 21862
      }
    ]
  },
  {
    "slug": "04-infrastructure-as-code/cloudformation/end-to-end-weather-agent",
    "title": "End-to-End Weather Agent with Tools and Memory",
    "desc": "This CloudFormation template deploys a complete Amazon Bedrock AgentCore Runtime with a sophisticated weather-based activity planning agent. This demonstrates the full power of AgentCore by...",
    "sectionId": null,
    "kind": "iac",
    "frameworks": [
      "Strands"
    ],
    "languages": [],
    "hasNotebook": false,
    "readme": "/agentcore-samples/04-infrastructure-as-code/cloudformation/end-to-end-weather-agent/README.md",
    "base": "/agentcore-samples/04-infrastructure-as-code/cloudformation/end-to-end-weather-agent",
    "files": [
      {
        "path": "cleanup.sh",
        "lang": "bash",
        "bytes": 1673
      },
      {
        "path": "deploy.sh",
        "lang": "bash",
        "bytes": 3565
      },
      {
        "path": "end-to-end-weather-agent.yaml",
        "lang": "yaml",
        "bytes": 50825
      }
    ]
  },
  {
    "slug": "04-infrastructure-as-code/cloudformation/mcp-server-agentcore-runtime",
    "title": "Hosting MCP Server on AgentCore Runtime - CloudFormation",
    "desc": "This CloudFormation template deploys an MCP (Model Context Protocol) server on Amazon Bedrock AgentCore Runtime. It demonstrates how to host MCP tools on AgentCore Runtime using infrastructure as...",
    "sectionId": "runtime",
    "kind": "iac",
    "frameworks": [],
    "languages": [
      "python"
    ],
    "hasNotebook": false,
    "readme": "/agentcore-samples/04-infrastructure-as-code/cloudformation/mcp-server-agentcore-runtime/README.md",
    "base": "/agentcore-samples/04-infrastructure-as-code/cloudformation/mcp-server-agentcore-runtime",
    "files": [
      {
        "path": "cleanup.sh",
        "lang": "bash",
        "bytes": 1015
      },
      {
        "path": "deploy.sh",
        "lang": "bash",
        "bytes": 1928
      },
      {
        "path": "get_token.py",
        "lang": "python",
        "bytes": 2230
      },
      {
        "path": "mcp-server-template.yaml",
        "lang": "yaml",
        "bytes": 25729
      },
      {
        "path": "test.sh",
        "lang": "bash",
        "bytes": 1774
      },
      {
        "path": "test_mcp_server.py",
        "lang": "python",
        "bytes": 3027
      }
    ]
  },
  {
    "slug": "04-infrastructure-as-code/cloudformation/multi-agent-runtime",
    "title": "Multi-Agent AgentCore Runtime",
    "desc": "This CloudFormation template demonstrates a multi-agent architecture where one agent (orchestrator) can invoke another agent (specialist) to handle complex tasks. This pattern is useful for...",
    "sectionId": "runtime",
    "kind": "iac",
    "frameworks": [],
    "languages": [],
    "hasNotebook": false,
    "readme": "/agentcore-samples/04-infrastructure-as-code/cloudformation/multi-agent-runtime/README.md",
    "base": "/agentcore-samples/04-infrastructure-as-code/cloudformation/multi-agent-runtime",
    "files": [
      {
        "path": "cleanup.sh",
        "lang": "bash",
        "bytes": 1667
      },
      {
        "path": "deploy.sh",
        "lang": "bash",
        "bytes": 2722
      },
      {
        "path": "template.yaml",
        "lang": "yaml",
        "bytes": 38795
      }
    ]
  },
  {
    "slug": "04-infrastructure-as-code/terraform/basic-runtime",
    "title": "Basic AgentCore Runtime - Terraform",
    "desc": "This pattern demonstrates the simplest deployment of an AgentCore Runtime using Terraform. It creates a basic agent without additional tools like Memory, Code Interpreter, or Browser.",
    "sectionId": "runtime",
    "kind": "iac",
    "frameworks": [
      "Strands"
    ],
    "languages": [
      "hcl",
      "python"
    ],
    "hasNotebook": false,
    "readme": "/agentcore-samples/04-infrastructure-as-code/terraform/basic-runtime/README.md",
    "base": "/agentcore-samples/04-infrastructure-as-code/terraform/basic-runtime",
    "files": [
      {
        "path": "agent-code/basic_agent.py",
        "lang": "python",
        "bytes": 921
      },
      {
        "path": "agent-code/requirements.txt",
        "lang": "text",
        "bytes": 39
      },
      {
        "path": "buildspec.yml",
        "lang": "yaml",
        "bytes": 1060
      },
      {
        "path": "codebuild.tf",
        "lang": "hcl",
        "bytes": 2738
      },
      {
        "path": "deploy.sh",
        "lang": "bash",
        "bytes": 7611
      },
      {
        "path": "destroy.sh",
        "lang": "bash",
        "bytes": 8099
      },
      {
        "path": "ecr.tf",
        "lang": "hcl",
        "bytes": 1498
      },
      {
        "path": "iam.tf",
        "lang": "hcl",
        "bytes": 6061
      },
      {
        "path": "main.tf",
        "lang": "hcl",
        "bytes": 991
      },
      {
        "path": "outputs.tf",
        "lang": "hcl",
        "bytes": 1778
      },
      {
        "path": "s3.tf",
        "lang": "hcl",
        "bytes": 1814
      },
      {
        "path": "scripts/build-image.sh",
        "lang": "bash",
        "bytes": 5487
      },
      {
        "path": "test_basic_agent.py",
        "lang": "python",
        "bytes": 5327
      },
      {
        "path": "variables.tf",
        "lang": "hcl",
        "bytes": 1765
      },
      {
        "path": "versions.tf",
        "lang": "hcl",
        "bytes": 560
      }
    ]
  },
  {
    "slug": "04-infrastructure-as-code/terraform/end-to-end-weather-agent",
    "title": "End-to-End Weather Agent on Amazon Bedrock AgentCore (Terraform)",
    "desc": "This Terraform module deploys a comprehensive weather agent using Amazon Bedrock AgentCore Runtime with integrated AgentCore tools (Browser, Code Interpreter, and Memory).",
    "sectionId": null,
    "kind": "iac",
    "frameworks": [
      "Strands",
      "LangChain"
    ],
    "languages": [
      "hcl",
      "python"
    ],
    "hasNotebook": false,
    "readme": "/agentcore-samples/04-infrastructure-as-code/terraform/end-to-end-weather-agent/README.md",
    "base": "/agentcore-samples/04-infrastructure-as-code/terraform/end-to-end-weather-agent",
    "files": [
      {
        "path": "agent-code/requirements.txt",
        "lang": "text",
        "bytes": 142
      },
      {
        "path": "agent-code/weather_agent.py",
        "lang": "python",
        "bytes": 11695
      },
      {
        "path": "browser.tf",
        "lang": "hcl",
        "bytes": 659
      },
      {
        "path": "buildspec.yml",
        "lang": "yaml",
        "bytes": 1073
      },
      {
        "path": "code_interpreter.tf",
        "lang": "hcl",
        "bytes": 743
      },
      {
        "path": "codebuild.tf",
        "lang": "hcl",
        "bytes": 1877
      },
      {
        "path": "deploy.sh",
        "lang": "bash",
        "bytes": 8171
      },
      {
        "path": "destroy.sh",
        "lang": "bash",
        "bytes": 10202
      },
      {
        "path": "ecr.tf",
        "lang": "hcl",
        "bytes": 1613
      },
      {
        "path": "iam.tf",
        "lang": "hcl",
        "bytes": 6439
      },
      {
        "path": "main.tf",
        "lang": "hcl",
        "bytes": 2906
      },
      {
        "path": "memory-init.tf",
        "lang": "hcl",
        "bytes": 1303
      },
      {
        "path": "memory.tf",
        "lang": "hcl",
        "bytes": 635
      },
      {
        "path": "observability.tf",
        "lang": "hcl",
        "bytes": 4545
      },
      {
        "path": "outputs.tf",
        "lang": "hcl",
        "bytes": 3633
      },
      {
        "path": "s3.tf",
        "lang": "hcl",
        "bytes": 2466
      },
      {
        "path": "scripts/build-image.sh",
        "lang": "bash",
        "bytes": 5487
      },
      {
        "path": "scripts/init-memory.py",
        "lang": "python",
        "bytes": 2831
      },
      {
        "path": "test_weather_agent.py",
        "lang": "python",
        "bytes": 6386
      },
      {
        "path": "variables.tf",
        "lang": "hcl",
        "bytes": 2101
      },
      {
        "path": "versions.tf",
        "lang": "hcl",
        "bytes": 571
      }
    ]
  },
  {
    "slug": "04-infrastructure-as-code/terraform/mcp-server-agentcore-runtime",
    "title": "MCP Server on AgentCore Runtime - Terraform",
    "desc": "This pattern demonstrates deploying an MCP (Model Context Protocol) server on Amazon Bedrock AgentCore Runtime using Terraform. It creates an MCP server with JWT authentication and three custom tools.",
    "sectionId": "runtime",
    "kind": "iac",
    "frameworks": [],
    "languages": [
      "hcl",
      "python"
    ],
    "hasNotebook": false,
    "readme": "/agentcore-samples/04-infrastructure-as-code/terraform/mcp-server-agentcore-runtime/README.md",
    "base": "/agentcore-samples/04-infrastructure-as-code/terraform/mcp-server-agentcore-runtime",
    "files": [
      {
        "path": "buildspec.yml",
        "lang": "yaml",
        "bytes": 1064
      },
      {
        "path": "codebuild.tf",
        "lang": "hcl",
        "bytes": 2752
      },
      {
        "path": "cognito.tf",
        "lang": "hcl",
        "bytes": 2268
      },
      {
        "path": "deploy.sh",
        "lang": "bash",
        "bytes": 7950
      },
      {
        "path": "destroy.sh",
        "lang": "bash",
        "bytes": 8752
      },
      {
        "path": "ecr.tf",
        "lang": "hcl",
        "bytes": 1503
      },
      {
        "path": "get_token.py",
        "lang": "python",
        "bytes": 2045
      },
      {
        "path": "iam.tf",
        "lang": "hcl",
        "bytes": 6057
      },
      {
        "path": "main.tf",
        "lang": "hcl",
        "bytes": 1459
      },
      {
        "path": "mcp-server-code/mcp_server.py",
        "lang": "python",
        "bytes": 509
      },
      {
        "path": "mcp-server-code/requirements.txt",
        "lang": "text",
        "bytes": 36
      },
      {
        "path": "outputs.tf",
        "lang": "hcl",
        "bytes": 3084
      },
      {
        "path": "s3.tf",
        "lang": "hcl",
        "bytes": 1853
      },
      {
        "path": "scripts/build-image.sh",
        "lang": "bash",
        "bytes": 5487
      },
      {
        "path": "test_mcp_server.py",
        "lang": "python",
        "bytes": 4453
      },
      {
        "path": "variables.tf",
        "lang": "hcl",
        "bytes": 1751
      },
      {
        "path": "versions.tf",
        "lang": "hcl",
        "bytes": 575
      }
    ]
  },
  {
    "slug": "04-infrastructure-as-code/terraform/multi-agent-runtime",
    "title": "Multi-Agent Runtime on Amazon Bedrock AgentCore (Terraform)",
    "desc": "This Terraform module deploys a multi-agent system using Amazon Bedrock AgentCore Runtime with Agent-to-Agent (A2A) communication capabilities.",
    "sectionId": "runtime",
    "kind": "iac",
    "frameworks": [
      "Strands"
    ],
    "languages": [
      "hcl",
      "python"
    ],
    "hasNotebook": false,
    "readme": "/agentcore-samples/04-infrastructure-as-code/terraform/multi-agent-runtime/README.md",
    "base": "/agentcore-samples/04-infrastructure-as-code/terraform/multi-agent-runtime",
    "files": [
      {
        "path": "agent-orchestrator-code/agent.py",
        "lang": "python",
        "bytes": 4113
      },
      {
        "path": "agent-orchestrator-code/requirements.txt",
        "lang": "text",
        "bytes": 64
      },
      {
        "path": "agent-specialist-code/agent.py",
        "lang": "python",
        "bytes": 1227
      },
      {
        "path": "agent-specialist-code/requirements.txt",
        "lang": "text",
        "bytes": 64
      },
      {
        "path": "buildspec-orchestrator.yml",
        "lang": "yaml",
        "bytes": 1082
      },
      {
        "path": "buildspec-specialist.yml",
        "lang": "yaml",
        "bytes": 1076
      },
      {
        "path": "codebuild.tf",
        "lang": "hcl",
        "bytes": 4167
      },
      {
        "path": "deploy.sh",
        "lang": "bash",
        "bytes": 7840
      },
      {
        "path": "destroy.sh",
        "lang": "bash",
        "bytes": 8366
      },
      {
        "path": "ecr.tf",
        "lang": "hcl",
        "bytes": 3037
      },
      {
        "path": "iam.tf",
        "lang": "hcl",
        "bytes": 11138
      },
      {
        "path": "main.tf",
        "lang": "hcl",
        "bytes": 2635
      },
      {
        "path": "orchestrator.tf",
        "lang": "hcl",
        "bytes": 1546
      },
      {
        "path": "outputs.tf",
        "lang": "hcl",
        "bytes": 4473
      },
      {
        "path": "s3.tf",
        "lang": "hcl",
        "bytes": 3464
      },
      {
        "path": "scripts/build-image.sh",
        "lang": "bash",
        "bytes": 5487
      },
      {
        "path": "specialist.tf",
        "lang": "hcl",
        "bytes": 1196
      },
      {
        "path": "test_multi_agent.py",
        "lang": "python",
        "bytes": 7409
      },
      {
        "path": "variables.tf",
        "lang": "hcl",
        "bytes": 1989
      },
      {
        "path": "versions.tf",
        "lang": "hcl",
        "bytes": 566
      }
    ]
  },
  {
    "slug": "05-blueprints/end-to-end-customer-service-agent",
    "title": "Agentic AI Foundation - Generative AI Customer Experience Platform",
    "desc": "The CX Agent is an intelligent customer experience platform built on LangGraph and designed for deployment on AWS Bedrock AgentCore Runtime. This agentic AI solution leverages multiple generative...",
    "sectionId": null,
    "kind": "blueprint",
    "frameworks": [
      "LangGraph",
      "LangChain",
      "OpenAI Agents"
    ],
    "languages": [
      "hcl",
      "python"
    ],
    "hasNotebook": true,
    "readme": "/agentcore-samples/05-blueprints/end-to-end-customer-service-agent/README.md",
    "base": "/agentcore-samples/05-blueprints/end-to-end-customer-service-agent",
    "files": [
      {
        "path": "CODE_OF_CONDUCT.md",
        "lang": "markdown",
        "bytes": 309
      },
      {
        "path": "CONTRIBUTING.md",
        "lang": "markdown",
        "bytes": 3160
      },
      {
        "path": "chat_to_agentcore.md",
        "lang": "markdown",
        "bytes": 6968,
        "fromNotebook": true
      },
      {
        "path": "cx-agent-backend/cx_agent_backend/__init__.py",
        "lang": "python",
        "bytes": 1211
      },
      {
        "path": "cx-agent-backend/cx_agent_backend/__main__.py",
        "lang": "python",
        "bytes": 361
      },
      {
        "path": "cx-agent-backend/cx_agent_backend/domain/__init__.py",
        "lang": "python",
        "bytes": 19
      },
      {
        "path": "cx-agent-backend/cx_agent_backend/domain/entities/conversation.py",
        "lang": "python",
        "bytes": 2706
      },
      {
        "path": "cx-agent-backend/cx_agent_backend/domain/ports/secret_reader.py",
        "lang": "python",
        "bytes": 181
      },
      {
        "path": "cx-agent-backend/cx_agent_backend/domain/repositories/conversation_repository.py",
        "lang": "python",
        "bytes": 845
      },
      {
        "path": "cx-agent-backend/cx_agent_backend/domain/services/agent_service.py",
        "lang": "python",
        "bytes": 1297
      },
      {
        "path": "cx-agent-backend/cx_agent_backend/domain/services/conversation_service.py",
        "lang": "python",
        "bytes": 5820
      },
      {
        "path": "cx-agent-backend/cx_agent_backend/domain/services/guardrail_service.py",
        "lang": "python",
        "bytes": 938
      },
      {
        "path": "cx-agent-backend/cx_agent_backend/domain/services/llm_service.py",
        "lang": "python",
        "bytes": 1064
      },
      {
        "path": "cx-agent-backend/cx_agent_backend/infrastructure/__init__.py",
        "lang": "python",
        "bytes": 27
      },
      {
        "path": "cx-agent-backend/cx_agent_backend/infrastructure/adapters/bedrock_guardrail_service.py",
        "lang": "python",
        "bytes": 3588
      },
      {
        "path": "cx-agent-backend/cx_agent_backend/infrastructure/adapters/langgraph_agent_service.py",
        "lang": "python",
        "bytes": 18668
      },
      {
        "path": "cx-agent-backend/cx_agent_backend/infrastructure/adapters/memory_conversation_repository.py",
        "lang": "python",
        "bytes": 1183
      },
      {
        "path": "cx-agent-backend/cx_agent_backend/infrastructure/adapters/openai_llm_service.py",
        "lang": "python",
        "bytes": 2452
      },
      {
        "path": "cx-agent-backend/cx_agent_backend/infrastructure/adapters/sql_alchemy_conversation_service.py",
        "lang": "python",
        "bytes": 1938
      },
      {
        "path": "cx-agent-backend/cx_agent_backend/infrastructure/adapters/tools.py",
        "lang": "python",
        "bytes": 12279
      },
      {
        "path": "cx-agent-backend/cx_agent_backend/infrastructure/aws/parameter_store_reader.py",
        "lang": "python",
        "bytes": 510
      },
      {
        "path": "cx-agent-backend/cx_agent_backend/infrastructure/aws/secret_reader.py",
        "lang": "python",
        "bytes": 829
      },
      {
        "path": "cx-agent-backend/cx_agent_backend/infrastructure/config/container.py",
        "lang": "python",
        "bytes": 2249
      },
      {
        "path": "cx-agent-backend/cx_agent_backend/infrastructure/config/settings.py",
        "lang": "python",
        "bytes": 1720
      },
      {
        "path": "cx-agent-backend/cx_agent_backend/presentation/__init__.py",
        "lang": "python",
        "bytes": 25
      },
      {
        "path": "cx-agent-backend/cx_agent_backend/presentation/api/conversation_router.py",
        "lang": "python",
        "bytes": 5619
      },
      {
        "path": "cx-agent-backend/cx_agent_backend/presentation/schemas/conversation_schemas.py",
        "lang": "python",
        "bytes": 2849
      },
      {
        "path": "cx-agent-backend/cx_agent_backend/server.py",
        "lang": "python",
        "bytes": 5260
      },
      {
        "path": "cx-agent-backend/pyproject.toml",
        "lang": "toml",
        "bytes": 1329
      },
      {
        "path": "cx-agent-backend/test_gateway.py",
        "lang": "python",
        "bytes": 6128
      },
      {
        "path": "cx-agent-frontend/pyproject.toml",
        "lang": "toml",
        "bytes": 570
      },
      {
        "path": "cx-agent-frontend/src/__init__.py",
        "lang": "python",
        "bytes": 19
      },
      {
        "path": "cx-agent-frontend/src/app.py",
        "lang": "python",
        "bytes": 5155
      },
      {
        "path": "cx-agent-frontend/src/components/__init__.py",
        "lang": "python",
        "bytes": 21
      },
      {
        "path": "cx-agent-frontend/src/components/chat.py",
        "lang": "python",
        "bytes": 8028
      },
      {
        "path": "cx-agent-frontend/src/components/config.py",
        "lang": "python",
        "bytes": 2548
      },
      {
        "path": "cx-agent-frontend/src/models/__init__.py",
        "lang": "python",
        "bytes": 17
      },
      {
        "path": "cx-agent-frontend/src/models/message.py",
        "lang": "python",
        "bytes": 255
      },
      {
        "path": "cx-agent-frontend/src/services/__init__.py",
        "lang": "python",
        "bytes": 19
      },
      {
        "path": "cx-agent-frontend/src/services/agentcore_client.py",
        "lang": "python",
        "bytes": 3422
      },
      {
        "path": "cx-agent-frontend/src/services/conversation_client.py",
        "lang": "python",
        "bytes": 2824
      },
      {
        "path": "infra/lambda/gateway_interceptor.py",
        "lang": "python",
        "bytes": 25171
      },
      {
        "path": "infra/lambda/tavily_search.py",
        "lang": "python",
        "bytes": 3696
      },
      {
        "path": "infra/main.tf",
        "lang": "hcl",
        "bytes": 12636
      },
      {
        "path": "infra/modules/agentcore-iam-role/bedrock-agentcore-policy.tf",
        "lang": "hcl",
        "bytes": 8916
      },
      {
        "path": "infra/modules/agentcore-iam-role/main.tf",
        "lang": "hcl",
        "bytes": 2030
      },
      {
        "path": "infra/modules/agentcore-iam-role/outputs.tf",
        "lang": "hcl",
        "bytes": 235
      },
      {
        "path": "infra/modules/agentcore-iam-role/variables.tf",
        "lang": "hcl",
        "bytes": 919
      },
      {
        "path": "infra/modules/bedrock-guardrails/main.tf",
        "lang": "hcl",
        "bytes": 1191
      },
      {
        "path": "infra/modules/bedrock-guardrails/outputs.tf",
        "lang": "hcl",
        "bytes": 269
      },
      {
        "path": "infra/modules/bedrock-guardrails/variables.tf",
        "lang": "hcl",
        "bytes": 447
      },
      {
        "path": "infra/modules/cognito/main.tf",
        "lang": "hcl",
        "bytes": 1809
      },
      {
        "path": "infra/modules/cognito/outputs.tf",
        "lang": "hcl",
        "bytes": 1274
      },
      {
        "path": "infra/modules/cognito/variables.tf",
        "lang": "hcl",
        "bytes": 100
      },
      {
        "path": "infra/modules/container-image/main.tf",
        "lang": "hcl",
        "bytes": 1496
      },
      {
        "path": "infra/modules/container-image/outputs.tf",
        "lang": "hcl",
        "bytes": 503
      },
      {
        "path": "infra/modules/container-image/variables.tf",
        "lang": "hcl",
        "bytes": 816
      },
      {
        "path": "infra/modules/kb-stack/main.tf",
        "lang": "hcl",
        "bytes": 3492
      },
      {
        "path": "infra/modules/kb-stack/outputs.tf",
        "lang": "hcl",
        "bytes": 657
      },
      {
        "path": "infra/modules/kb-stack/variables.tf",
        "lang": "hcl",
        "bytes": 305
      },
      {
        "path": "infra/modules/knowledge-base/main.tf",
        "lang": "hcl",
        "bytes": 2528
      },
      {
        "path": "infra/modules/knowledge-base/outputs.tf",
        "lang": "hcl",
        "bytes": 452
      },
      {
        "path": "infra/modules/knowledge-base/variables.tf",
        "lang": "hcl",
        "bytes": 833
      },
      {
        "path": "infra/modules/opensearch-serverless/main.tf",
        "lang": "hcl",
        "bytes": 4231
      },
      {
        "path": "infra/modules/opensearch-serverless/outputs.tf",
        "lang": "hcl",
        "bytes": 516
      },
      {
        "path": "infra/modules/opensearch-serverless/providers.tf",
        "lang": "hcl",
        "bytes": 263
      },
      {
        "path": "infra/modules/opensearch-serverless/variables.tf",
        "lang": "hcl",
        "bytes": 2562
      },
      {
        "path": "infra/modules/opensearch-serverless/versions.tf",
        "lang": "hcl",
        "bytes": 370
      },
      {
        "path": "infra/modules/parameters/main.tf",
        "lang": "hcl",
        "bytes": 1531
      },
      {
        "path": "infra/modules/parameters/outputs.tf",
        "lang": "hcl",
        "bytes": 861
      },
      {
        "path": "infra/modules/parameters/variables.tf",
        "lang": "hcl",
        "bytes": 682
      },
      {
        "path": "infra/modules/secrets/main.tf",
        "lang": "hcl",
        "bytes": 5418
      },
      {
        "path": "infra/modules/secrets/outputs.tf",
        "lang": "hcl",
        "bytes": 775
      },
      {
        "path": "infra/modules/secrets/rotation_lambda.py",
        "lang": "python",
        "bytes": 2755
      },
      {
        "path": "infra/modules/secrets/variables.tf",
        "lang": "hcl",
        "bytes": 1020
      },
      {
        "path": "infra/outputs.tf",
        "lang": "hcl",
        "bytes": 1703
      },
      {
        "path": "infra/terraform.tf",
        "lang": "hcl",
        "bytes": 315
      },
      {
        "path": "infra/variables.tf",
        "lang": "hcl",
        "bytes": 3309
      },
      {
        "path": "mise.toml",
        "lang": "toml",
        "bytes": 35
      },
      {
        "path": "offline_evaluation.py",
        "lang": "python",
        "bytes": 21868
      },
      {
        "path": "response_quality_evaluator.py",
        "lang": "python",
        "bytes": 3864
      }
    ]
  },
  {
    "slug": "05-blueprints/multitenant-agentic-platform",
    "title": "AWS Bedrock Agent Core Multitenant Platform",
    "desc": "A multi-tenant SaaS platform for deploying, managing, and invoking AI agents powered by AWS Bedrock Agent Core.",
    "sectionId": null,
    "kind": "blueprint",
    "frameworks": [
      "Strands"
    ],
    "languages": [
      "javascript",
      "python"
    ],
    "hasNotebook": false,
    "readme": "/agentcore-samples/05-blueprints/multitenant-agentic-platform/README.md",
    "base": "/agentcore-samples/05-blueprints/multitenant-agentic-platform",
    "files": [
      {
        "path": "agent-tools-repo/README.md",
        "lang": "markdown",
        "bytes": 1451
      },
      {
        "path": "agent-tools-repo/SETUP.md",
        "lang": "markdown",
        "bytes": 3104
      },
      {
        "path": "agent-tools-repo/catalog.json",
        "lang": "json",
        "bytes": 2003
      },
      {
        "path": "agent-tools-repo/templates/main.py",
        "lang": "python",
        "bytes": 3427
      },
      {
        "path": "agent-tools-repo/tools/calculator/config.json",
        "lang": "json",
        "bytes": 586
      },
      {
        "path": "agent-tools-repo/tools/calculator/tool.py",
        "lang": "python",
        "bytes": 3843
      },
      {
        "path": "agent-tools-repo/tools/database-query/config.json",
        "lang": "json",
        "bytes": 741
      },
      {
        "path": "agent-tools-repo/tools/database-query/tool.py",
        "lang": "python",
        "bytes": 4185
      },
      {
        "path": "agent-tools-repo/tools/datetime/config.json",
        "lang": "json",
        "bytes": 487
      },
      {
        "path": "agent-tools-repo/tools/datetime/tool.py",
        "lang": "python",
        "bytes": 2159
      },
      {
        "path": "agent-tools-repo/tools/email-sender/config.json",
        "lang": "json",
        "bytes": 921
      },
      {
        "path": "agent-tools-repo/tools/email-sender/tool.py",
        "lang": "python",
        "bytes": 2988
      },
      {
        "path": "agent-tools-repo/tools/web-crawler/config.json",
        "lang": "json",
        "bytes": 831
      },
      {
        "path": "agent-tools-repo/tools/web-crawler/tool.py",
        "lang": "python",
        "bytes": 4243
      },
      {
        "path": "agent-tools-repo/tools/web-search/config.json",
        "lang": "json",
        "bytes": 540
      },
      {
        "path": "agent-tools-repo/tools/web-search/tool.py",
        "lang": "python",
        "bytes": 4474
      },
      {
        "path": "cleanup.sh",
        "lang": "bash",
        "bytes": 4251
      },
      {
        "path": "deploy.sh",
        "lang": "bash",
        "bytes": 1226
      },
      {
        "path": "frontend/index.html",
        "lang": "html",
        "bytes": 789
      },
      {
        "path": "frontend/package.json",
        "lang": "json",
        "bytes": 807
      },
      {
        "path": "frontend/src/App.css",
        "lang": "css",
        "bytes": 3004
      },
      {
        "path": "frontend/src/App.jsx",
        "lang": "jsx",
        "bytes": 58812
      },
      {
        "path": "frontend/src/index.css",
        "lang": "css",
        "bytes": 2383
      },
      {
        "path": "frontend/src/main.jsx",
        "lang": "jsx",
        "bytes": 245
      },
      {
        "path": "frontend/src/utils/validation.js",
        "lang": "javascript",
        "bytes": 3722
      },
      {
        "path": "frontend/src/utils/validation.test.js",
        "lang": "javascript",
        "bytes": 12942
      },
      {
        "path": "frontend/vite.config.js",
        "lang": "javascript",
        "bytes": 256
      },
      {
        "path": "src/cdk.json",
        "lang": "json",
        "bytes": 37
      },
      {
        "path": "src/cdk_app.py",
        "lang": "python",
        "bytes": 7854
      },
      {
        "path": "src/cdk_requirements.txt",
        "lang": "text",
        "bytes": 42
      },
      {
        "path": "src/lambda_functions/async_deploy_agent/handler.py",
        "lang": "python",
        "bytes": 2735
      },
      {
        "path": "src/lambda_functions/build_deploy_agent/handler.py",
        "lang": "python",
        "bytes": 35129
      },
      {
        "path": "src/lambda_functions/config_injector/handler.py",
        "lang": "python",
        "bytes": 5418
      },
      {
        "path": "src/lambda_functions/delete_agent/handler.py",
        "lang": "python",
        "bytes": 5413
      },
      {
        "path": "src/lambda_functions/dynamodb_stream_processor/handler.py",
        "lang": "python",
        "bytes": 5137
      },
      {
        "path": "src/lambda_functions/get_agent_details/handler.py",
        "lang": "python",
        "bytes": 2276
      },
      {
        "path": "src/lambda_functions/infrastructure_costs/handler.py",
        "lang": "python",
        "bytes": 7429
      },
      {
        "path": "src/lambda_functions/invoke_agent/handler.py",
        "lang": "python",
        "bytes": 14235
      },
      {
        "path": "src/lambda_functions/invoke_agent/test_token_limit.py",
        "lang": "python",
        "bytes": 5548
      },
      {
        "path": "src/lambda_functions/list_agents/handler.py",
        "lang": "python",
        "bytes": 1501
      },
      {
        "path": "src/lambda_functions/set_tenant_limit/handler.py",
        "lang": "python",
        "bytes": 3579
      },
      {
        "path": "src/lambda_functions/shared/__init__.py",
        "lang": "python",
        "bytes": 41
      },
      {
        "path": "src/lambda_functions/shared/utils.py",
        "lang": "python",
        "bytes": 1870
      },
      {
        "path": "src/lambda_functions/sqs_to_dynamodb/handler.py",
        "lang": "python",
        "bytes": 624
      },
      {
        "path": "src/lambda_functions/token_usage/handler.py",
        "lang": "python",
        "bytes": 2029
      },
      {
        "path": "src/lambda_functions/update_agent_config/handler.py",
        "lang": "python",
        "bytes": 4677
      },
      {
        "path": "src/stacks/__init__.py",
        "lang": "python",
        "bytes": 530
      },
      {
        "path": "src/stacks/agent_runtime.py",
        "lang": "python",
        "bytes": 2090
      },
      {
        "path": "src/stacks/api.py",
        "lang": "python",
        "bytes": 6487
      },
      {
        "path": "src/stacks/database.py",
        "lang": "python",
        "bytes": 2765
      },
      {
        "path": "src/stacks/frontend.py",
        "lang": "python",
        "bytes": 5664
      },
      {
        "path": "src/stacks/helpers.py",
        "lang": "python",
        "bytes": 1703
      },
      {
        "path": "src/stacks/lambdas.py",
        "lang": "python",
        "bytes": 10609
      },
      {
        "path": "src/stacks/messaging.py",
        "lang": "python",
        "bytes": 2196
      }
    ]
  },
  {
    "slug": "05-blueprints/shopping-concierge-agent/concierge_agent/local-visa-server",
    "title": "Visa Local Backend Server",
    "desc": "Local development server for Visa card onboarding and payment integration.",
    "sectionId": null,
    "kind": "blueprint",
    "frameworks": [],
    "languages": [
      "python"
    ],
    "hasNotebook": false,
    "readme": "/agentcore-samples/05-blueprints/shopping-concierge-agent/concierge_agent/local-visa-server/README.md",
    "base": "/agentcore-samples/05-blueprints/shopping-concierge-agent/concierge_agent/local-visa-server",
    "files": [
      {
        "path": "handler.py",
        "lang": "python",
        "bytes": 3010
      },
      {
        "path": "requirements.txt",
        "lang": "text",
        "bytes": 270
      },
      {
        "path": "server.py",
        "lang": "python",
        "bytes": 33387
      },
      {
        "path": "visa/__init__.py",
        "lang": "python",
        "bytes": 30
      },
      {
        "path": "visa/flow.py",
        "lang": "python",
        "bytes": 56367
      },
      {
        "path": "visa/helpers.py",
        "lang": "python",
        "bytes": 10484
      },
      {
        "path": "visa/secure_token.py",
        "lang": "python",
        "bytes": 5676
      }
    ]
  },
  {
    "slug": "05-blueprints/shopping-concierge-agent/infrastructure/visa-lambda-stack",
    "title": "Visa Lambda Stack",
    "desc": "AWS Lambda proxy for Visa Payment API integration.",
    "sectionId": null,
    "kind": "blueprint",
    "frameworks": [],
    "languages": [
      "javascript",
      "typescript"
    ],
    "hasNotebook": false,
    "readme": "/agentcore-samples/05-blueprints/shopping-concierge-agent/infrastructure/visa-lambda-stack/README.md",
    "base": "/agentcore-samples/05-blueprints/shopping-concierge-agent/infrastructure/visa-lambda-stack",
    "files": [
      {
        "path": "bin/visa-lambda-stack.ts",
        "lang": "typescript",
        "bytes": 543
      },
      {
        "path": "cdk.json",
        "lang": "json",
        "bytes": 5458
      },
      {
        "path": "jest.config.js",
        "lang": "javascript",
        "bytes": 157
      },
      {
        "path": "lib/visa-lambda-stack.ts",
        "lang": "typescript",
        "bytes": 4742
      },
      {
        "path": "package.json",
        "lang": "json",
        "bytes": 524
      },
      {
        "path": "test/visa-lambda-stack.test.ts",
        "lang": "typescript",
        "bytes": 622
      },
      {
        "path": "tsconfig.json",
        "lang": "json",
        "bytes": 712
      }
    ]
  },
  {
    "slug": "05-blueprints/travel-concierge-agent/concierge_agent/local-visa-server",
    "title": "Visa Local Backend Server",
    "desc": "Local development server for Visa card onboarding and payment integration.",
    "sectionId": null,
    "kind": "blueprint",
    "frameworks": [],
    "languages": [
      "python"
    ],
    "hasNotebook": false,
    "readme": "/agentcore-samples/05-blueprints/travel-concierge-agent/concierge_agent/local-visa-server/README.md",
    "base": "/agentcore-samples/05-blueprints/travel-concierge-agent/concierge_agent/local-visa-server",
    "files": [
      {
        "path": "handler.py",
        "lang": "python",
        "bytes": 3010
      },
      {
        "path": "requirements.txt",
        "lang": "text",
        "bytes": 270
      },
      {
        "path": "server.py",
        "lang": "python",
        "bytes": 31709
      },
      {
        "path": "visa/__init__.py",
        "lang": "python",
        "bytes": 30
      },
      {
        "path": "visa/flow.py",
        "lang": "python",
        "bytes": 56868
      },
      {
        "path": "visa/helpers.py",
        "lang": "python",
        "bytes": 10484
      },
      {
        "path": "visa/secure_token.py",
        "lang": "python",
        "bytes": 5676
      }
    ]
  },
  {
    "slug": "05-blueprints/travel-concierge-agent/infrastructure/visa-lambda-stack",
    "title": "Visa Lambda Stack",
    "desc": "AWS Lambda proxy for Visa Payment API integration.",
    "sectionId": null,
    "kind": "blueprint",
    "frameworks": [],
    "languages": [
      "javascript",
      "typescript"
    ],
    "hasNotebook": false,
    "readme": "/agentcore-samples/05-blueprints/travel-concierge-agent/infrastructure/visa-lambda-stack/README.md",
    "base": "/agentcore-samples/05-blueprints/travel-concierge-agent/infrastructure/visa-lambda-stack",
    "files": [
      {
        "path": "bin/visa-lambda-stack.ts",
        "lang": "typescript",
        "bytes": 543
      },
      {
        "path": "cdk.json",
        "lang": "json",
        "bytes": 5458
      },
      {
        "path": "jest.config.js",
        "lang": "javascript",
        "bytes": 157
      },
      {
        "path": "lib/visa-lambda-stack.ts",
        "lang": "typescript",
        "bytes": 4742
      },
      {
        "path": "package.json",
        "lang": "json",
        "bytes": 524
      },
      {
        "path": "test/visa-lambda-stack.test.ts",
        "lang": "typescript",
        "bytes": 622
      },
      {
        "path": "tsconfig.json",
        "lang": "json",
        "bytes": 712
      }
    ]
  },
  {
    "slug": "06-workshops",
    "title": "📚 Amazon Bedrock AgentCore Tutorials",
    "desc": "This folder contains Hands-on tutorials for building, deploying, and managing AI agents with Amazon Bedrock AgentCore.",
    "sectionId": null,
    "kind": "workshop",
    "frameworks": [
      "Strands",
      "LangGraph",
      "LangChain",
      "CrewAI",
      "OpenAI Agents",
      "Claude Agent SDK"
    ],
    "languages": [
      "javascript",
      "python",
      "typescript"
    ],
    "hasNotebook": true,
    "readme": "/agentcore-samples/06-workshops/README.md",
    "base": "/agentcore-samples/06-workshops",
    "files": [
      {
        "path": "01-AgentCore-runtime/01-hosting-agent/04-crewai-with-bedrock-model/pyproject.toml",
        "lang": "toml",
        "bytes": 671
      },
      {
        "path": "01-AgentCore-runtime/01-hosting-agent/04-crewai-with-bedrock-model/research_crew/__init__.py",
        "lang": "python",
        "bytes": 0
      },
      {
        "path": "01-AgentCore-runtime/01-hosting-agent/04-crewai-with-bedrock-model/research_crew/requirements.txt",
        "lang": "text",
        "bytes": 82
      },
      {
        "path": "01-AgentCore-runtime/01-hosting-agent/04-crewai-with-bedrock-model/runtime-with-crewai-and-bedrock-models.md",
        "lang": "markdown",
        "bytes": 22296,
        "fromNotebook": true
      },
      {
        "path": "01-AgentCore-runtime/01-hosting-agent/05-java-agents/01-springai-with-bedrock-model/README.md",
        "lang": "markdown",
        "bytes": 4308
      },
      {
        "path": "01-AgentCore-runtime/01-hosting-agent/05-java-agents/01-springai-with-bedrock-model/agent/build-and-push.sh",
        "lang": "bash",
        "bytes": 5300
      },
      {
        "path": "01-AgentCore-runtime/01-hosting-agent/05-java-agents/01-springai-with-bedrock-model/agent/src/main/resources/application.yml",
        "lang": "yaml",
        "bytes": 230
      },
      {
        "path": "01-AgentCore-runtime/01-hosting-agent/05-java-agents/01-springai-with-bedrock-model/infra/bin/app.ts",
        "lang": "typescript",
        "bytes": 582
      },
      {
        "path": "01-AgentCore-runtime/01-hosting-agent/05-java-agents/01-springai-with-bedrock-model/infra/cdk.json",
        "lang": "json",
        "bytes": 3476
      },
      {
        "path": "01-AgentCore-runtime/01-hosting-agent/05-java-agents/01-springai-with-bedrock-model/infra/jest.config.js",
        "lang": "javascript",
        "bytes": 375
      },
      {
        "path": "01-AgentCore-runtime/01-hosting-agent/05-java-agents/01-springai-with-bedrock-model/infra/lib/agentcore-stack.ts",
        "lang": "typescript",
        "bytes": 3402
      },
      {
        "path": "01-AgentCore-runtime/01-hosting-agent/05-java-agents/01-springai-with-bedrock-model/infra/package.json",
        "lang": "json",
        "bytes": 732
      },
      {
        "path": "01-AgentCore-runtime/01-hosting-agent/05-java-agents/01-springai-with-bedrock-model/infra/tsconfig.json",
        "lang": "json",
        "bytes": 855
      },
      {
        "path": "01-AgentCore-runtime/01-hosting-agent/05-java-agents/02-embabel-with-bedrock-model/README.md",
        "lang": "markdown",
        "bytes": 6126
      },
      {
        "path": "01-AgentCore-runtime/01-hosting-agent/05-java-agents/02-embabel-with-bedrock-model/agent/build-and-push.sh",
        "lang": "bash",
        "bytes": 5300
      },
      {
        "path": "01-AgentCore-runtime/01-hosting-agent/05-java-agents/02-embabel-with-bedrock-model/agent/src/main/resources/application.yml",
        "lang": "yaml",
        "bytes": 377
      },
      {
        "path": "01-AgentCore-runtime/01-hosting-agent/05-java-agents/02-embabel-with-bedrock-model/agent/src/main/resources/models/bedrock-models.yml",
        "lang": "yaml",
        "bytes": 6999
      },
      {
        "path": "01-AgentCore-runtime/01-hosting-agent/05-java-agents/02-embabel-with-bedrock-model/infra/bin/app.ts",
        "lang": "typescript",
        "bytes": 579
      },
      {
        "path": "01-AgentCore-runtime/01-hosting-agent/05-java-agents/02-embabel-with-bedrock-model/infra/cdk.json",
        "lang": "json",
        "bytes": 3476
      },
      {
        "path": "01-AgentCore-runtime/01-hosting-agent/05-java-agents/02-embabel-with-bedrock-model/infra/jest.config.js",
        "lang": "javascript",
        "bytes": 375
      },
      {
        "path": "01-AgentCore-runtime/01-hosting-agent/05-java-agents/02-embabel-with-bedrock-model/infra/lib/agentcore-stack.ts",
        "lang": "typescript",
        "bytes": 4020
      },
      {
        "path": "01-AgentCore-runtime/01-hosting-agent/05-java-agents/02-embabel-with-bedrock-model/infra/package.json",
        "lang": "json",
        "bytes": 732
      },
      {
        "path": "01-AgentCore-runtime/01-hosting-agent/05-java-agents/02-embabel-with-bedrock-model/infra/tsconfig.json",
        "lang": "json",
        "bytes": 855
      },
      {
        "path": "01-AgentCore-runtime/01-hosting-agent/05-java-agents/README.md",
        "lang": "markdown",
        "bytes": 2638
      },
      {
        "path": "01-AgentCore-runtime/01-hosting-agent/README.md",
        "lang": "markdown",
        "bytes": 3696
      },
      {
        "path": "01-AgentCore-runtime/03-advanced-concepts/04-async-agents/01_weekly_report_generator_async/agent/agent.py",
        "lang": "python",
        "bytes": 5697
      },
      {
        "path": "01-AgentCore-runtime/03-advanced-concepts/04-async-agents/01_weekly_report_generator_async/agent/requirements.txt",
        "lang": "text",
        "bytes": 168
      },
      {
        "path": "01-AgentCore-runtime/03-advanced-concepts/04-async-agents/01_weekly_report_generator_async/agent/tools.py",
        "lang": "python",
        "bytes": 45555
      },
      {
        "path": "01-AgentCore-runtime/03-advanced-concepts/04-async-agents/01_weekly_report_generator_async/demo_data/issues/bug_tracker_week_10.json",
        "lang": "json",
        "bytes": 2122
      },
      {
        "path": "01-AgentCore-runtime/03-advanced-concepts/04-async-agents/01_weekly_report_generator_async/demo_data/meeting_notes/executive_sync_mar_02.md",
        "lang": "markdown",
        "bytes": 1243
      },
      {
        "path": "01-AgentCore-runtime/03-advanced-concepts/04-async-agents/01_weekly_report_generator_async/demo_data/meeting_notes/incident_postmortem_mar_02.md",
        "lang": "markdown",
        "bytes": 1550
      },
      {
        "path": "01-AgentCore-runtime/03-advanced-concepts/04-async-agents/01_weekly_report_generator_async/demo_data/meeting_notes/sprint_planning_mar_02.md",
        "lang": "markdown",
        "bytes": 1044
      },
      {
        "path": "01-AgentCore-runtime/03-advanced-concepts/04-async-agents/01_weekly_report_generator_async/demo_data/team_updates/alex_rivera_week_10.md",
        "lang": "markdown",
        "bytes": 776
      },
      {
        "path": "01-AgentCore-runtime/03-advanced-concepts/04-async-agents/01_weekly_report_generator_async/demo_data/team_updates/carlos_mendez_week_10.md",
        "lang": "markdown",
        "bytes": 999
      },
      {
        "path": "01-AgentCore-runtime/03-advanced-concepts/04-async-agents/01_weekly_report_generator_async/demo_data/team_updates/jordan_lee_week_10.md",
        "lang": "markdown",
        "bytes": 770
      },
      {
        "path": "01-AgentCore-runtime/03-advanced-concepts/04-async-agents/01_weekly_report_generator_async/demo_data/team_updates/maya_thompson_week_10.md",
        "lang": "markdown",
        "bytes": 822
      },
      {
        "path": "01-AgentCore-runtime/03-advanced-concepts/04-async-agents/01_weekly_report_generator_async/demo_data/team_updates/samantha_brooks_week_10.md",
        "lang": "markdown",
        "bytes": 860
      },
      {
        "path": "01-AgentCore-runtime/03-advanced-concepts/04-async-agents/01_weekly_report_generator_async/update_demo_dates.py",
        "lang": "python",
        "bytes": 10593
      },
      {
        "path": "01-AgentCore-runtime/03-advanced-concepts/04-async-agents/01_weekly_report_generator_async/weekly_update_agentcore_deploy.md",
        "lang": "markdown",
        "bytes": 13456,
        "fromNotebook": true
      },
      {
        "path": "01-AgentCore-runtime/03-advanced-concepts/04-async-agents/README.md",
        "lang": "markdown",
        "bytes": 4674
      },
      {
        "path": "01-AgentCore-runtime/03-advanced-concepts/README.md",
        "lang": "markdown",
        "bytes": 0
      },
      {
        "path": "01-AgentCore-runtime/06-bi-directional-streaming-webrtc/README.md",
        "lang": "markdown",
        "bytes": 6035
      },
      {
        "path": "01-AgentCore-runtime/06-bi-directional-streaming-webrtc/agent/audio.py",
        "lang": "python",
        "bytes": 3333
      },
      {
        "path": "01-AgentCore-runtime/06-bi-directional-streaming-webrtc/agent/bot.py",
        "lang": "python",
        "bytes": 5832
      },
      {
        "path": "01-AgentCore-runtime/06-bi-directional-streaming-webrtc/agent/kvs.py",
        "lang": "python",
        "bytes": 2158
      },
      {
        "path": "01-AgentCore-runtime/06-bi-directional-streaming-webrtc/agent/nova_sonic.py",
        "lang": "python",
        "bytes": 8702
      },
      {
        "path": "01-AgentCore-runtime/06-bi-directional-streaming-webrtc/agent/requirements.txt",
        "lang": "text",
        "bytes": 124
      },
      {
        "path": "01-AgentCore-runtime/06-bi-directional-streaming-webrtc/bedrock-iam-policy.json",
        "lang": "json",
        "bytes": 282
      },
      {
        "path": "01-AgentCore-runtime/06-bi-directional-streaming-webrtc/kvs-iam-policy.json",
        "lang": "json",
        "bytes": 468
      },
      {
        "path": "01-AgentCore-runtime/06-bi-directional-streaming-webrtc/server/index.html",
        "lang": "html",
        "bytes": 9990
      },
      {
        "path": "01-AgentCore-runtime/06-bi-directional-streaming-webrtc/server/requirements.txt",
        "lang": "text",
        "bytes": 16
      },
      {
        "path": "01-AgentCore-runtime/06-bi-directional-streaming-webrtc/server/server.py",
        "lang": "python",
        "bytes": 261
      },
      {
        "path": "01-AgentCore-runtime/06-bi-directional-streaming/01-bedrock-sonic-ws/README.md",
        "lang": "markdown",
        "bytes": 6675
      },
      {
        "path": "01-AgentCore-runtime/06-bi-directional-streaming/01-bedrock-sonic-ws/client/client.py",
        "lang": "python",
        "bytes": 11191
      },
      {
        "path": "01-AgentCore-runtime/06-bi-directional-streaming/01-bedrock-sonic-ws/client/requirements.txt",
        "lang": "text",
        "bytes": 363
      },
      {
        "path": "01-AgentCore-runtime/06-bi-directional-streaming/01-bedrock-sonic-ws/client/sonic-client.html",
        "lang": "html",
        "bytes": 55388
      },
      {
        "path": "01-AgentCore-runtime/06-bi-directional-streaming/01-bedrock-sonic-ws/websocket/requirements.txt",
        "lang": "text",
        "bytes": 157
      },
      {
        "path": "01-AgentCore-runtime/06-bi-directional-streaming/01-bedrock-sonic-ws/websocket/s2s_events.py",
        "lang": "python",
        "bytes": 5292
      },
      {
        "path": "01-AgentCore-runtime/06-bi-directional-streaming/01-bedrock-sonic-ws/websocket/s2s_session_manager.py",
        "lang": "python",
        "bytes": 17463
      },
      {
        "path": "01-AgentCore-runtime/06-bi-directional-streaming/01-bedrock-sonic-ws/websocket/server.py",
        "lang": "python",
        "bytes": 22716
      },
      {
        "path": "01-AgentCore-runtime/06-bi-directional-streaming/02-strands-ws/README.md",
        "lang": "markdown",
        "bytes": 10131
      },
      {
        "path": "01-AgentCore-runtime/06-bi-directional-streaming/02-strands-ws/client/client.py",
        "lang": "python",
        "bytes": 12472
      },
      {
        "path": "01-AgentCore-runtime/06-bi-directional-streaming/02-strands-ws/client/profiles.json",
        "lang": "json",
        "bytes": 4139
      },
      {
        "path": "01-AgentCore-runtime/06-bi-directional-streaming/02-strands-ws/client/requirements.txt",
        "lang": "text",
        "bytes": 30
      },
      {
        "path": "01-AgentCore-runtime/06-bi-directional-streaming/02-strands-ws/client/strands-client.html",
        "lang": "html",
        "bytes": 51016
      },
      {
        "path": "01-AgentCore-runtime/06-bi-directional-streaming/02-strands-ws/mcp/auth_mcp.py",
        "lang": "python",
        "bytes": 4683
      },
      {
        "path": "01-AgentCore-runtime/06-bi-directional-streaming/02-strands-ws/mcp/banking_mcp.py",
        "lang": "python",
        "bytes": 9095
      },
      {
        "path": "01-AgentCore-runtime/06-bi-directional-streaming/02-strands-ws/mcp/faq_kb_mcp.py",
        "lang": "python",
        "bytes": 14903
      },
      {
        "path": "01-AgentCore-runtime/06-bi-directional-streaming/02-strands-ws/mcp/mortgage_mcp.py",
        "lang": "python",
        "bytes": 13100
      },
      {
        "path": "01-AgentCore-runtime/06-bi-directional-streaming/02-strands-ws/mcp/requirements.txt",
        "lang": "text",
        "bytes": 25
      },
      {
        "path": "01-AgentCore-runtime/06-bi-directional-streaming/02-strands-ws/websocket/agent.py",
        "lang": "python",
        "bytes": 9000
      },
      {
        "path": "01-AgentCore-runtime/06-bi-directional-streaming/02-strands-ws/websocket/requirements.txt",
        "lang": "text",
        "bytes": 289
      },
      {
        "path": "01-AgentCore-runtime/06-bi-directional-streaming/02-strands-ws/websocket/server.py",
        "lang": "python",
        "bytes": 11155
      },
      {
        "path": "01-AgentCore-runtime/06-bi-directional-streaming/03-langchain-transcribe-polly-ws/README.md",
        "lang": "markdown",
        "bytes": 10359
      },
      {
        "path": "01-AgentCore-runtime/06-bi-directional-streaming/03-langchain-transcribe-polly-ws/client/client.py",
        "lang": "python",
        "bytes": 11295
      },
      {
        "path": "01-AgentCore-runtime/06-bi-directional-streaming/03-langchain-transcribe-polly-ws/client/langchain-client.html",
        "lang": "html",
        "bytes": 30923
      },
      {
        "path": "01-AgentCore-runtime/06-bi-directional-streaming/03-langchain-transcribe-polly-ws/client/profiles.json",
        "lang": "json",
        "bytes": 2515
      },
      {
        "path": "01-AgentCore-runtime/06-bi-directional-streaming/03-langchain-transcribe-polly-ws/client/requirements.txt",
        "lang": "text",
        "bytes": 31
      },
      {
        "path": "01-AgentCore-runtime/06-bi-directional-streaming/03-langchain-transcribe-polly-ws/websocket/agent.py",
        "lang": "python",
        "bytes": 23655
      },
      {
        "path": "01-AgentCore-runtime/06-bi-directional-streaming/03-langchain-transcribe-polly-ws/websocket/requirements.txt",
        "lang": "text",
        "bytes": 210
      },
      {
        "path": "01-AgentCore-runtime/06-bi-directional-streaming/03-langchain-transcribe-polly-ws/websocket/server.py",
        "lang": "python",
        "bytes": 8630
      },
      {
        "path": "01-AgentCore-runtime/06-bi-directional-streaming/04-pipecat-sonic-ws/README.md",
        "lang": "markdown",
        "bytes": 3201
      },
      {
        "path": "01-AgentCore-runtime/06-bi-directional-streaming/04-pipecat-sonic-ws/client/client.py",
        "lang": "python",
        "bytes": 3686
      },
      {
        "path": "01-AgentCore-runtime/06-bi-directional-streaming/04-pipecat-sonic-ws/client/index.html",
        "lang": "html",
        "bytes": 1088
      },
      {
        "path": "01-AgentCore-runtime/06-bi-directional-streaming/04-pipecat-sonic-ws/client/package.json",
        "lang": "json",
        "bytes": 355
      },
      {
        "path": "01-AgentCore-runtime/06-bi-directional-streaming/04-pipecat-sonic-ws/client/src/app.js",
        "lang": "javascript",
        "bytes": 4480
      },
      {
        "path": "01-AgentCore-runtime/06-bi-directional-streaming/04-pipecat-sonic-ws/client/src/style.css",
        "lang": "css",
        "bytes": 1565
      },
      {
        "path": "01-AgentCore-runtime/06-bi-directional-streaming/04-pipecat-sonic-ws/client/vite.config.js",
        "lang": "javascript",
        "bytes": 383
      },
      {
        "path": "01-AgentCore-runtime/06-bi-directional-streaming/04-pipecat-sonic-ws/websocket/requirements.txt",
        "lang": "text",
        "bytes": 126
      },
      {
        "path": "01-AgentCore-runtime/06-bi-directional-streaming/04-pipecat-sonic-ws/websocket/server.py",
        "lang": "python",
        "bytes": 13895
      },
      {
        "path": "01-AgentCore-runtime/06-bi-directional-streaming/README.md",
        "lang": "markdown",
        "bytes": 6425
      },
      {
        "path": "01-AgentCore-runtime/06-bi-directional-streaming/assets/anybank-faq.md",
        "lang": "markdown",
        "bytes": 15658
      },
      {
        "path": "01-AgentCore-runtime/06-bi-directional-streaming/utils/agent_role.json",
        "lang": "json",
        "bytes": 3398
      },
      {
        "path": "01-AgentCore-runtime/06-bi-directional-streaming/utils/cleanup.py",
        "lang": "python",
        "bytes": 25437
      },
      {
        "path": "01-AgentCore-runtime/06-bi-directional-streaming/utils/deploy.py",
        "lang": "python",
        "bytes": 28641
      },
      {
        "path": "01-AgentCore-runtime/06-bi-directional-streaming/utils/requirements.txt",
        "lang": "text",
        "bytes": 313
      },
      {
        "path": "01-AgentCore-runtime/06-bi-directional-streaming/utils/start_client.sh",
        "lang": "bash",
        "bytes": 5750
      },
      {
        "path": "01-AgentCore-runtime/06-bi-directional-streaming/utils/trust_policy.json",
        "lang": "json",
        "bytes": 291
      },
      {
        "path": "01-AgentCore-runtime/06-bi-directional-streaming/utils/websocket_helpers.py",
        "lang": "python",
        "bytes": 3267
      },
      {
        "path": "01-AgentCore-runtime/08-mcp-e2e/02-client-e2e/agents/dynamo_utils.py",
        "lang": "python",
        "bytes": 4511
      },
      {
        "path": "01-AgentCore-runtime/08-mcp-e2e/02-client-e2e/agents/mcp_client_features.py",
        "lang": "python",
        "bytes": 3886
      },
      {
        "path": "01-AgentCore-runtime/08-mcp-e2e/02-client-e2e/mcp_client_features_e2e.md",
        "lang": "markdown",
        "bytes": 20151,
        "fromNotebook": true
      },
      {
        "path": "01-AgentCore-runtime/08-mcp-e2e/02-client-e2e/requirements.txt",
        "lang": "text",
        "bytes": 73
      },
      {
        "path": "01-AgentCore-runtime/08-mcp-e2e/03-utilities-e2e/01_progress.md",
        "lang": "markdown",
        "bytes": 11985,
        "fromNotebook": true
      },
      {
        "path": "01-AgentCore-runtime/08-mcp-e2e/03-utilities-e2e/agents/dynamo_utils.py",
        "lang": "python",
        "bytes": 4511
      },
      {
        "path": "01-AgentCore-runtime/08-mcp-e2e/03-utilities-e2e/agents/mcp_progress_server.py",
        "lang": "python",
        "bytes": 2443
      },
      {
        "path": "01-AgentCore-runtime/08-mcp-e2e/03-utilities-e2e/requirements.txt",
        "lang": "text",
        "bytes": 73
      },
      {
        "path": "01-AgentCore-runtime/08-mcp-e2e/README.md",
        "lang": "markdown",
        "bytes": 5461
      },
      {
        "path": "01-AgentCore-runtime/08-mcp-e2e/helpers/dynamo_utils.py",
        "lang": "python",
        "bytes": 4511
      },
      {
        "path": "01-AgentCore-runtime/08-mcp-e2e/helpers/utils.py",
        "lang": "python",
        "bytes": 18508
      },
      {
        "path": "01-AgentCore-runtime/10-managed-session-storage/01_managed_session_storage.md",
        "lang": "markdown",
        "bytes": 12142,
        "fromNotebook": true
      },
      {
        "path": "01-AgentCore-runtime/10-managed-session-storage/helpers/utils.py",
        "lang": "python",
        "bytes": 8365
      },
      {
        "path": "01-AgentCore-runtime/10-managed-session-storage/main.py",
        "lang": "python",
        "bytes": 1426
      },
      {
        "path": "01-AgentCore-runtime/10-managed-session-storage/persistent-notes/README.md",
        "lang": "markdown",
        "bytes": 919
      },
      {
        "path": "01-AgentCore-runtime/10-managed-session-storage/persistent-notes/SKILL.md",
        "lang": "markdown",
        "bytes": 1113
      },
      {
        "path": "01-AgentCore-runtime/10-managed-session-storage/persistent-notes/notes.json",
        "lang": "json",
        "bytes": 104
      },
      {
        "path": "01-AgentCore-runtime/10-managed-session-storage/persistent-notes/scripts/note_manager.py",
        "lang": "python",
        "bytes": 1197
      },
      {
        "path": "01-AgentCore-runtime/10-managed-session-storage/requirements.txt",
        "lang": "text",
        "bytes": 49
      },
      {
        "path": "01-AgentCore-runtime/README.md",
        "lang": "markdown",
        "bytes": 2056
      },
      {
        "path": "03-AgentCore-identity/01-getting_started.md",
        "lang": "markdown",
        "bytes": 2273
      },
      {
        "path": "03-AgentCore-identity/02-how_it_works.md",
        "lang": "markdown",
        "bytes": 11897
      },
      {
        "path": "03-AgentCore-identity/03-Inbound Auth example/inbound_auth_runtime_with_strands_and_bedrock_models.md",
        "lang": "markdown",
        "bytes": 10637,
        "fromNotebook": true
      },
      {
        "path": "03-AgentCore-identity/03-Inbound Auth example/requirements.txt",
        "lang": "text",
        "bytes": 90
      },
      {
        "path": "03-AgentCore-identity/04-Outbound Auth example/requirements.txt",
        "lang": "text",
        "bytes": 179
      },
      {
        "path": "03-AgentCore-identity/04-Outbound Auth example/runtime_with_strands_and_openai_models.md",
        "lang": "markdown",
        "bytes": 21040,
        "fromNotebook": true
      },
      {
        "path": "03-AgentCore-identity/05-Outbound_Auth_3lo/chatbot_app_cognito.py",
        "lang": "python",
        "bytes": 35297
      },
      {
        "path": "03-AgentCore-identity/05-Outbound_Auth_3lo/oauth2_callback_server.py",
        "lang": "python",
        "bytes": 17800
      },
      {
        "path": "03-AgentCore-identity/05-Outbound_Auth_3lo/requirements.txt",
        "lang": "text",
        "bytes": 229
      },
      {
        "path": "03-AgentCore-identity/05-Outbound_Auth_3lo/runtime_with_strands_and_egress_3lo.md",
        "lang": "markdown",
        "bytes": 31493,
        "fromNotebook": true
      },
      {
        "path": "03-AgentCore-identity/05-Outbound_Auth_3lo/strands_claude_google_3lo.py",
        "lang": "python",
        "bytes": 5329
      },
      {
        "path": "03-AgentCore-identity/06-Outbound_Auth_Github/chatbot_app_cognito.py",
        "lang": "python",
        "bytes": 35298
      },
      {
        "path": "03-AgentCore-identity/06-Outbound_Auth_Github/github_agent.py",
        "lang": "python",
        "bytes": 5894
      },
      {
        "path": "03-AgentCore-identity/06-Outbound_Auth_Github/oauth2_callback_server.py",
        "lang": "python",
        "bytes": 17800
      },
      {
        "path": "03-AgentCore-identity/06-Outbound_Auth_Github/requirements.txt",
        "lang": "text",
        "bytes": 167
      },
      {
        "path": "03-AgentCore-identity/06-Outbound_Auth_Github/runtime_with_strands_and_egress_github_3lo.md",
        "lang": "markdown",
        "bytes": 32012,
        "fromNotebook": true
      },
      {
        "path": "03-AgentCore-identity/09-Outbound_Auth_Self_Hosted/agent.py",
        "lang": "python",
        "bytes": 8677
      },
      {
        "path": "03-AgentCore-identity/09-Outbound_Auth_Self_Hosted/create_cognito.sh",
        "lang": "bash",
        "bytes": 2357
      },
      {
        "path": "03-AgentCore-identity/09-Outbound_Auth_Self_Hosted/requirements.txt",
        "lang": "text",
        "bytes": 91
      },
      {
        "path": "03-AgentCore-identity/09-Outbound_Auth_Self_Hosted/self_hosted_agent_oauth.md",
        "lang": "markdown",
        "bytes": 14784,
        "fromNotebook": true
      },
      {
        "path": "03-AgentCore-identity/README.md",
        "lang": "markdown",
        "bytes": 6237
      },
      {
        "path": "04-AgentCore-memory/01-short-term-memory/01-single-agent/with-langgraph-agent/math-agent-with-checkpointing.md",
        "lang": "markdown",
        "bytes": 8990,
        "fromNotebook": true
      },
      {
        "path": "04-AgentCore-memory/01-short-term-memory/01-single-agent/with-langgraph-agent/personal-fitness-coach.md",
        "lang": "markdown",
        "bytes": 12281,
        "fromNotebook": true
      },
      {
        "path": "04-AgentCore-memory/01-short-term-memory/01-single-agent/with-langgraph-agent/requirements.txt",
        "lang": "text",
        "bytes": 87
      },
      {
        "path": "04-AgentCore-memory/01-short-term-memory/01-single-agent/with-langgraph-agent/support-agent-human-in-the-loop.md",
        "lang": "markdown",
        "bytes": 9409,
        "fromNotebook": true
      },
      {
        "path": "04-AgentCore-memory/01-short-term-memory/01-single-agent/with-strands-agent/personal-agent-memory-manager.md",
        "lang": "markdown",
        "bytes": 15272,
        "fromNotebook": true
      },
      {
        "path": "04-AgentCore-memory/01-short-term-memory/01-single-agent/with-strands-agent/personal-agent.md",
        "lang": "markdown",
        "bytes": 11925,
        "fromNotebook": true
      },
      {
        "path": "04-AgentCore-memory/01-short-term-memory/01-single-agent/with-strands-agent/requirements.txt",
        "lang": "text",
        "bytes": 122
      },
      {
        "path": "04-AgentCore-memory/01-short-term-memory/02-multi-agent/with-strands-agent/requirements.txt",
        "lang": "text",
        "bytes": 72
      },
      {
        "path": "04-AgentCore-memory/01-short-term-memory/02-multi-agent/with-strands-agent/travel-planning-agent-memory-manager.md",
        "lang": "markdown",
        "bytes": 16779,
        "fromNotebook": true
      },
      {
        "path": "04-AgentCore-memory/01-short-term-memory/02-multi-agent/with-strands-agent/travel-planning-agent.md",
        "lang": "markdown",
        "bytes": 15578,
        "fromNotebook": true
      },
      {
        "path": "04-AgentCore-memory/01-short-term-memory/README.md",
        "lang": "markdown",
        "bytes": 5389
      },
      {
        "path": "04-AgentCore-memory/02-long-term-memory/01-single-agent/using-langgraph-agent-hooks/custom-user-preferences/custom_memory_prompts.py",
        "lang": "python",
        "bytes": 2048
      },
      {
        "path": "04-AgentCore-memory/02-long-term-memory/01-single-agent/using-langgraph-agent-hooks/custom-user-preferences/nutrition-assistant-with-user-preference-saving.md",
        "lang": "markdown",
        "bytes": 14020,
        "fromNotebook": true
      },
      {
        "path": "04-AgentCore-memory/02-long-term-memory/01-single-agent/using-langgraph-agent-hooks/custom-user-preferences/requirements.txt",
        "lang": "text",
        "bytes": 88
      },
      {
        "path": "04-AgentCore-memory/02-long-term-memory/01-single-agent/using-langgraph-agent-hooks/episodic-memory/custom_memory_prompts.py",
        "lang": "python",
        "bytes": 3368
      },
      {
        "path": "04-AgentCore-memory/02-long-term-memory/01-single-agent/using-langgraph-agent-hooks/episodic-memory/nutrition-assistant-with-episodic-memory.md",
        "lang": "markdown",
        "bytes": 19143,
        "fromNotebook": true
      },
      {
        "path": "04-AgentCore-memory/02-long-term-memory/01-single-agent/using-langgraph-agent-hooks/episodic-memory/requirements.txt",
        "lang": "text",
        "bytes": 96
      },
      {
        "path": "04-AgentCore-memory/02-long-term-memory/01-single-agent/using-strands-agent-hooks/culinary-assistant-self-managed-strategy/agentcore_self_managed_memory_demo.md",
        "lang": "markdown",
        "bytes": 19674,
        "fromNotebook": true
      },
      {
        "path": "04-AgentCore-memory/02-long-term-memory/01-single-agent/using-strands-agent-hooks/culinary-assistant-self-managed-strategy/aws_utils.py",
        "lang": "python",
        "bytes": 29073
      },
      {
        "path": "04-AgentCore-memory/02-long-term-memory/01-single-agent/using-strands-agent-hooks/culinary-assistant-self-managed-strategy/lambda_function.py",
        "lang": "python",
        "bytes": 10382
      },
      {
        "path": "04-AgentCore-memory/02-long-term-memory/01-single-agent/using-strands-agent-hooks/culinary-assistant-self-managed-strategy/requirements.txt",
        "lang": "text",
        "bytes": 107
      },
      {
        "path": "04-AgentCore-memory/02-long-term-memory/01-single-agent/using-strands-agent-hooks/customer-support/customer-support-inbuilt-strategy.md",
        "lang": "markdown",
        "bytes": 30137,
        "fromNotebook": true
      },
      {
        "path": "04-AgentCore-memory/02-long-term-memory/01-single-agent/using-strands-agent-hooks/customer-support/customer-support-override-strategy.md",
        "lang": "markdown",
        "bytes": 35698,
        "fromNotebook": true
      },
      {
        "path": "04-AgentCore-memory/02-long-term-memory/01-single-agent/using-strands-agent-hooks/customer-support/requirements.txt",
        "lang": "text",
        "bytes": 106
      },
      {
        "path": "04-AgentCore-memory/02-long-term-memory/01-single-agent/using-strands-agent-hooks/simple-math-assistant/math-assistant.md",
        "lang": "markdown",
        "bytes": 21235,
        "fromNotebook": true
      },
      {
        "path": "04-AgentCore-memory/02-long-term-memory/01-single-agent/using-strands-agent-hooks/simple-math-assistant/requirements.txt",
        "lang": "text",
        "bytes": 59
      },
      {
        "path": "04-AgentCore-memory/02-long-term-memory/01-single-agent/using-strands-agent-memory-tool/culinary-assistant.md",
        "lang": "markdown",
        "bytes": 14093,
        "fromNotebook": true
      },
      {
        "path": "04-AgentCore-memory/02-long-term-memory/01-single-agent/using-strands-agent-memory-tool/debugging-agent/data/session1_memory_leak.json",
        "lang": "json",
        "bytes": 6864
      },
      {
        "path": "04-AgentCore-memory/02-long-term-memory/01-single-agent/using-strands-agent-memory-tool/debugging-agent/data/session2_race_condition.json",
        "lang": "json",
        "bytes": 7387
      },
      {
        "path": "04-AgentCore-memory/02-long-term-memory/01-single-agent/using-strands-agent-memory-tool/debugging-agent/data/session3_api_timeout.json",
        "lang": "json",
        "bytes": 7622
      },
      {
        "path": "04-AgentCore-memory/02-long-term-memory/01-single-agent/using-strands-agent-memory-tool/debugging-agent/debugging_assistant_episodic_memory.md",
        "lang": "markdown",
        "bytes": 22647,
        "fromNotebook": true
      },
      {
        "path": "04-AgentCore-memory/02-long-term-memory/01-single-agent/using-strands-agent-memory-tool/debugging-agent/requirements.txt",
        "lang": "text",
        "bytes": 171
      },
      {
        "path": "04-AgentCore-memory/02-long-term-memory/01-single-agent/using-strands-agent-memory-tool/requirements.txt",
        "lang": "text",
        "bytes": 59
      },
      {
        "path": "04-AgentCore-memory/02-long-term-memory/02-multi-agent/with-strands-agent/travel-booking-agent/requirements.txt",
        "lang": "text",
        "bytes": 59
      },
      {
        "path": "04-AgentCore-memory/02-long-term-memory/02-multi-agent/with-strands-agent/travel-booking-agent/travel-booking-assistant.md",
        "lang": "markdown",
        "bytes": 17833,
        "fromNotebook": true
      },
      {
        "path": "04-AgentCore-memory/02-long-term-memory/README.md",
        "lang": "markdown",
        "bytes": 12469
      },
      {
        "path": "04-AgentCore-memory/03-advanced-patterns/01-guardrails-integration/guardrails-memory.md",
        "lang": "markdown",
        "bytes": 20929,
        "fromNotebook": true
      },
      {
        "path": "04-AgentCore-memory/03-advanced-patterns/01-guardrails-integration/requirements.txt",
        "lang": "text",
        "bytes": 39
      },
      {
        "path": "04-AgentCore-memory/03-advanced-patterns/02-memory-runtime-integration/requirements.txt",
        "lang": "text",
        "bytes": 72
      },
      {
        "path": "04-AgentCore-memory/03-advanced-patterns/02-memory-runtime-integration/runtime_memory_integration.md",
        "lang": "markdown",
        "bytes": 19352,
        "fromNotebook": true
      },
      {
        "path": "04-AgentCore-memory/03-advanced-patterns/03-memory-identity-runtime-integration/requirements.txt",
        "lang": "text",
        "bytes": 100
      },
      {
        "path": "04-AgentCore-memory/03-advanced-patterns/03-memory-identity-runtime-integration/runtime_memory_identity_integration.md",
        "lang": "markdown",
        "bytes": 33037,
        "fromNotebook": true
      },
      {
        "path": "04-AgentCore-memory/03-advanced-patterns/03-memory-identity-runtime-integration/utils.py",
        "lang": "python",
        "bytes": 10165
      },
      {
        "path": "04-AgentCore-memory/03-advanced-patterns/05-memory-streaming/memory_record_streaming.md",
        "lang": "markdown",
        "bytes": 19867,
        "fromNotebook": true
      },
      {
        "path": "04-AgentCore-memory/03-advanced-patterns/07-memory-for-personalisation-and-analytics/01-memory_for_personalised_recommendations.md",
        "lang": "markdown",
        "bytes": 20218,
        "fromNotebook": true
      },
      {
        "path": "04-AgentCore-memory/03-advanced-patterns/07-memory-for-personalisation-and-analytics/02-memory_cross_customer_analytics.md",
        "lang": "markdown",
        "bytes": 17172,
        "fromNotebook": true
      },
      {
        "path": "04-AgentCore-memory/05-memory-security-patterns/01-memory-iam-policies/requirements.txt",
        "lang": "text",
        "bytes": 92
      },
      {
        "path": "04-AgentCore-memory/05-memory-security-patterns/01-memory-iam-policies/runtime_memory_identity_integration.md",
        "lang": "markdown",
        "bytes": 35268,
        "fromNotebook": true
      },
      {
        "path": "04-AgentCore-memory/05-memory-security-patterns/01-memory-iam-policies/utils.py",
        "lang": "python",
        "bytes": 11152
      },
      {
        "path": "04-AgentCore-memory/05-memory-security-patterns/02-memory-iam-cognito-identities/requirements.txt",
        "lang": "text",
        "bytes": 92
      },
      {
        "path": "04-AgentCore-memory/05-memory-security-patterns/02-memory-iam-cognito-identities/runtime_memory_federated_identity_integration.md",
        "lang": "markdown",
        "bytes": 33790,
        "fromNotebook": true
      },
      {
        "path": "04-AgentCore-memory/05-memory-security-patterns/02-memory-iam-cognito-identities/utils.py",
        "lang": "python",
        "bytes": 18650
      },
      {
        "path": "04-AgentCore-memory/README.md",
        "lang": "markdown",
        "bytes": 16582
      },
      {
        "path": "05-AgentCore-tools/01-Agent-Core-code-interpreter/README.md",
        "lang": "markdown",
        "bytes": 2434
      },
      {
        "path": "05-AgentCore-tools/01-Agent-Core-code-interpreter/requirements.txt",
        "lang": "text",
        "bytes": 91
      },
      {
        "path": "05-AgentCore-tools/02-Agent-Core-browser-tool/01-browser-with-NovaAct/01_getting_started-agentcore-browser-tool-with-nova-act.md",
        "lang": "markdown",
        "bytes": 5325,
        "fromNotebook": true
      },
      {
        "path": "05-AgentCore-tools/02-Agent-Core-browser-tool/01-browser-with-NovaAct/02_agentcore-browser-tool-live-view-with-nova-act.md",
        "lang": "markdown",
        "bytes": 16064,
        "fromNotebook": true
      },
      {
        "path": "05-AgentCore-tools/02-Agent-Core-browser-tool/01-browser-with-NovaAct/requirements.txt",
        "lang": "text",
        "bytes": 73
      },
      {
        "path": "05-AgentCore-tools/02-Agent-Core-browser-tool/02-browser-with-browserUse/agentcore-browser-tool-live-view-with-browser-use.md",
        "lang": "markdown",
        "bytes": 12428,
        "fromNotebook": true
      },
      {
        "path": "05-AgentCore-tools/02-Agent-Core-browser-tool/02-browser-with-browserUse/getting_started-agentcore-browser-tool-with-browser-use.md",
        "lang": "markdown",
        "bytes": 9696,
        "fromNotebook": true
      },
      {
        "path": "05-AgentCore-tools/02-Agent-Core-browser-tool/02-browser-with-browserUse/requirements.txt",
        "lang": "text",
        "bytes": 92
      },
      {
        "path": "05-AgentCore-tools/02-Agent-Core-browser-tool/03-browser-observability/01_browser_observability.md",
        "lang": "markdown",
        "bytes": 13144,
        "fromNotebook": true
      },
      {
        "path": "05-AgentCore-tools/02-Agent-Core-browser-tool/03-browser-observability/requirements.txt",
        "lang": "text",
        "bytes": 73
      },
      {
        "path": "05-AgentCore-tools/02-Agent-Core-browser-tool/04-browser-with-Strands/01_getting_started-agentcore-browser-tool-with-strands.md",
        "lang": "markdown",
        "bytes": 9916,
        "fromNotebook": true
      },
      {
        "path": "05-AgentCore-tools/02-Agent-Core-browser-tool/04-browser-with-Strands/requirements.txt",
        "lang": "text",
        "bytes": 532
      },
      {
        "path": "05-AgentCore-tools/02-Agent-Core-browser-tool/05-browser-live-view/01-embed-dcv-live-view-tutorial.md",
        "lang": "markdown",
        "bytes": 52104,
        "fromNotebook": true
      },
      {
        "path": "05-AgentCore-tools/02-Agent-Core-browser-tool/06-Web-Bot-Auth-Signing/01_agentcore-browser-tool-with-web-bot-auth.md",
        "lang": "markdown",
        "bytes": 13701,
        "fromNotebook": true
      },
      {
        "path": "05-AgentCore-tools/02-Agent-Core-browser-tool/06-Web-Bot-Auth-Signing/requirements.txt",
        "lang": "text",
        "bytes": 549
      },
      {
        "path": "05-AgentCore-tools/02-Agent-Core-browser-tool/07-connecting-public-browser-from-private-vpc/01-connecting-public-browser-from-private-vpc-runtime.md",
        "lang": "markdown",
        "bytes": 5574,
        "fromNotebook": true
      },
      {
        "path": "05-AgentCore-tools/02-Agent-Core-browser-tool/07-connecting-public-browser-from-private-vpc/cfn-browser.yaml",
        "lang": "yaml",
        "bytes": 46227
      },
      {
        "path": "05-AgentCore-tools/02-Agent-Core-browser-tool/08-Interacting-with-vpc-based-browser-from-vpc/01-Interacting-with-vpc-based-browser-from-vpc.md",
        "lang": "markdown",
        "bytes": 5751,
        "fromNotebook": true
      },
      {
        "path": "05-AgentCore-tools/02-Agent-Core-browser-tool/08-Interacting-with-vpc-based-browser-from-vpc/cfn-vpc-browser.yaml",
        "lang": "yaml",
        "bytes": 49769
      },
      {
        "path": "05-AgentCore-tools/02-Agent-Core-browser-tool/12-browser-extensions/browser-extensions.md",
        "lang": "markdown",
        "bytes": 7479,
        "fromNotebook": true
      },
      {
        "path": "05-AgentCore-tools/02-Agent-Core-browser-tool/12-browser-extensions/extension/manifest.json",
        "lang": "json",
        "bytes": 271
      },
      {
        "path": "05-AgentCore-tools/02-Agent-Core-browser-tool/12-browser-extensions/extension/popup.html",
        "lang": "html",
        "bytes": 378
      },
      {
        "path": "05-AgentCore-tools/02-Agent-Core-browser-tool/12-browser-extensions/requirements.txt",
        "lang": "text",
        "bytes": 16
      },
      {
        "path": "05-AgentCore-tools/02-Agent-Core-browser-tool/README.md",
        "lang": "markdown",
        "bytes": 5105
      },
      {
        "path": "05-AgentCore-tools/02-Agent-Core-browser-tool/helpers/browser_helper.py",
        "lang": "python",
        "bytes": 803
      },
      {
        "path": "05-AgentCore-tools/README.md",
        "lang": "markdown",
        "bytes": 2520
      },
      {
        "path": "06-AgentCore-observability/01-Agentcore-runtime-hosted/README.md",
        "lang": "markdown",
        "bytes": 2557
      },
      {
        "path": "06-AgentCore-observability/01-Agentcore-runtime-hosted/Strands Agents/requirements.txt",
        "lang": "text",
        "bytes": 130
      },
      {
        "path": "06-AgentCore-observability/01-Agentcore-runtime-hosted/Strands Agents/runtime_with_strands_and_bedrock_models.md",
        "lang": "markdown",
        "bytes": 12998,
        "fromNotebook": true
      },
      {
        "path": "06-AgentCore-observability/02-Agent-not-hosted-on-runtime/CrewAI/CrewAI_Observability.md",
        "lang": "markdown",
        "bytes": 18110,
        "fromNotebook": true
      },
      {
        "path": "06-AgentCore-observability/02-Agent-not-hosted-on-runtime/CrewAI/requirements.txt",
        "lang": "text",
        "bytes": 152
      },
      {
        "path": "06-AgentCore-observability/02-Agent-not-hosted-on-runtime/Langgraph/Langgraph_Observability.md",
        "lang": "markdown",
        "bytes": 19624,
        "fromNotebook": true
      },
      {
        "path": "06-AgentCore-observability/02-Agent-not-hosted-on-runtime/Langgraph/requirements.txt",
        "lang": "text",
        "bytes": 210
      },
      {
        "path": "06-AgentCore-observability/02-Agent-not-hosted-on-runtime/README.md",
        "lang": "markdown",
        "bytes": 1702
      },
      {
        "path": "06-AgentCore-observability/02-Agent-not-hosted-on-runtime/Strands/Strands_Observability.md",
        "lang": "markdown",
        "bytes": 17602,
        "fromNotebook": true
      },
      {
        "path": "06-AgentCore-observability/02-Agent-not-hosted-on-runtime/Strands/requirements.txt",
        "lang": "text",
        "bytes": 148
      },
      {
        "path": "06-AgentCore-observability/03-advanced-concepts/01-custom-span-creation/Custom_Span_Creation.md",
        "lang": "markdown",
        "bytes": 16813,
        "fromNotebook": true
      },
      {
        "path": "06-AgentCore-observability/03-advanced-concepts/01-custom-span-creation/requirements.txt",
        "lang": "text",
        "bytes": 89
      },
      {
        "path": "06-AgentCore-observability/03-advanced-concepts/03-agentops/02-langfuse/README.md",
        "lang": "markdown",
        "bytes": 22852
      },
      {
        "path": "06-AgentCore-observability/03-advanced-concepts/03-agentops/02-langfuse/agents/requirements.txt",
        "lang": "text",
        "bytes": 120
      },
      {
        "path": "06-AgentCore-observability/03-advanced-concepts/03-agentops/02-langfuse/agents/strands_claude.py",
        "lang": "python",
        "bytes": 2401
      },
      {
        "path": "06-AgentCore-observability/03-advanced-concepts/03-agentops/02-langfuse/cicd/check_factuality.py",
        "lang": "python",
        "bytes": 4004
      },
      {
        "path": "06-AgentCore-observability/03-advanced-concepts/03-agentops/02-langfuse/cicd/delete_agent.py",
        "lang": "python",
        "bytes": 4379
      },
      {
        "path": "06-AgentCore-observability/03-advanced-concepts/03-agentops/02-langfuse/cicd/deploy_agent.py",
        "lang": "python",
        "bytes": 4059
      },
      {
        "path": "06-AgentCore-observability/03-advanced-concepts/03-agentops/02-langfuse/cicd/hp_config.json",
        "lang": "json",
        "bytes": 254
      },
      {
        "path": "06-AgentCore-observability/03-advanced-concepts/03-agentops/02-langfuse/cicd/tst.py",
        "lang": "python",
        "bytes": 5758
      },
      {
        "path": "06-AgentCore-observability/03-advanced-concepts/03-agentops/02-langfuse/dataset.json",
        "lang": "json",
        "bytes": 1518
      },
      {
        "path": "06-AgentCore-observability/03-advanced-concepts/03-agentops/02-langfuse/experimentation/hpo.py",
        "lang": "python",
        "bytes": 6784
      },
      {
        "path": "06-AgentCore-observability/03-advanced-concepts/03-agentops/02-langfuse/experimentation/hpo_config.json",
        "lang": "json",
        "bytes": 796
      },
      {
        "path": "06-AgentCore-observability/03-advanced-concepts/03-agentops/02-langfuse/requirements.txt",
        "lang": "text",
        "bytes": 59
      },
      {
        "path": "06-AgentCore-observability/03-advanced-concepts/03-agentops/02-langfuse/simulation/load_config.json",
        "lang": "json",
        "bytes": 2874
      },
      {
        "path": "06-AgentCore-observability/03-advanced-concepts/03-agentops/02-langfuse/simulation/simulate_users.py",
        "lang": "python",
        "bytes": 3976
      },
      {
        "path": "06-AgentCore-observability/03-advanced-concepts/03-agentops/02-langfuse/utils/__init__.py",
        "lang": "python",
        "bytes": 0
      },
      {
        "path": "06-AgentCore-observability/03-advanced-concepts/03-agentops/02-langfuse/utils/agent.py",
        "lang": "python",
        "bytes": 9957
      },
      {
        "path": "06-AgentCore-observability/03-advanced-concepts/03-agentops/02-langfuse/utils/aws.py",
        "lang": "python",
        "bytes": 7052
      },
      {
        "path": "06-AgentCore-observability/03-advanced-concepts/03-agentops/02-langfuse/utils/langfuse.py",
        "lang": "python",
        "bytes": 7075
      },
      {
        "path": "06-AgentCore-observability/03-advanced-concepts/README.md",
        "lang": "markdown",
        "bytes": 2425
      },
      {
        "path": "06-AgentCore-observability/04-Agentcore-runtime-partner-observability/Arize/requirements.txt",
        "lang": "text",
        "bytes": 227
      },
      {
        "path": "06-AgentCore-observability/04-Agentcore-runtime-partner-observability/Arize/runtime_with_strands_and_arize.md",
        "lang": "markdown",
        "bytes": 9958,
        "fromNotebook": true
      },
      {
        "path": "06-AgentCore-observability/04-Agentcore-runtime-partner-observability/Braintrust/requirements.txt",
        "lang": "text",
        "bytes": 107
      },
      {
        "path": "06-AgentCore-observability/04-Agentcore-runtime-partner-observability/Braintrust/runtime_with_strands_and_braintrust.md",
        "lang": "markdown",
        "bytes": 9416,
        "fromNotebook": true
      },
      {
        "path": "06-AgentCore-observability/04-Agentcore-runtime-partner-observability/Datadog/requirements.txt",
        "lang": "text",
        "bytes": 157
      },
      {
        "path": "06-AgentCore-observability/04-Agentcore-runtime-partner-observability/Datadog/runtime_with_strands_and_datadog.md",
        "lang": "markdown",
        "bytes": 12534,
        "fromNotebook": true
      },
      {
        "path": "06-AgentCore-observability/04-Agentcore-runtime-partner-observability/Honeycomb/requirements.txt",
        "lang": "text",
        "bytes": 195
      },
      {
        "path": "06-AgentCore-observability/04-Agentcore-runtime-partner-observability/Honeycomb/runtime_with_strands_and_honeycomb.md",
        "lang": "markdown",
        "bytes": 13463,
        "fromNotebook": true
      },
      {
        "path": "06-AgentCore-observability/04-Agentcore-runtime-partner-observability/Instana/requirements.txt",
        "lang": "text",
        "bytes": 115
      },
      {
        "path": "06-AgentCore-observability/04-Agentcore-runtime-partner-observability/Instana/runtime_with_strands_and_instana.md",
        "lang": "markdown",
        "bytes": 14193,
        "fromNotebook": true
      },
      {
        "path": "06-AgentCore-observability/04-Agentcore-runtime-partner-observability/Langfuse/requirements.txt",
        "lang": "text",
        "bytes": 108
      },
      {
        "path": "06-AgentCore-observability/04-Agentcore-runtime-partner-observability/Langfuse/runtime_with_strands_and_langfuse.md",
        "lang": "markdown",
        "bytes": 9231,
        "fromNotebook": true
      },
      {
        "path": "06-AgentCore-observability/04-Agentcore-runtime-partner-observability/OpenLIT/requirements.txt",
        "lang": "text",
        "bytes": 116
      },
      {
        "path": "06-AgentCore-observability/04-Agentcore-runtime-partner-observability/OpenLIT/runtime_with_strands_and_openlit.md",
        "lang": "markdown",
        "bytes": 12397,
        "fromNotebook": true
      },
      {
        "path": "06-AgentCore-observability/04-Agentcore-runtime-partner-observability/README.md",
        "lang": "markdown",
        "bytes": 3155
      },
      {
        "path": "06-AgentCore-observability/README.md",
        "lang": "markdown",
        "bytes": 6388
      },
      {
        "path": "07-AgentCore-evaluations/02-running-evaluations/README.md",
        "lang": "markdown",
        "bytes": 5865
      },
      {
        "path": "07-AgentCore-evaluations/03-advanced/02-simulating-agent-interactions/Langgraph-AgentCore-Websearch.md",
        "lang": "markdown",
        "bytes": 8711,
        "fromNotebook": true
      },
      {
        "path": "07-AgentCore-evaluations/03-advanced/02-simulating-agent-interactions/Strands-AgentCore-ShoppingConcierge.md",
        "lang": "markdown",
        "bytes": 23480,
        "fromNotebook": true
      },
      {
        "path": "07-AgentCore-evaluations/03-advanced/02-simulating-agent-interactions/Strands-AgentCore-Websearch.md",
        "lang": "markdown",
        "bytes": 5315,
        "fromNotebook": true
      },
      {
        "path": "07-AgentCore-evaluations/03-advanced/02-simulating-agent-interactions/deploy_shopping_concierge_agent.py",
        "lang": "python",
        "bytes": 2778
      },
      {
        "path": "07-AgentCore-evaluations/03-advanced/02-simulating-agent-interactions/lg_eval_config.py",
        "lang": "python",
        "bytes": 6492
      },
      {
        "path": "07-AgentCore-evaluations/03-advanced/02-simulating-agent-interactions/requirements.txt",
        "lang": "text",
        "bytes": 87
      },
      {
        "path": "07-AgentCore-evaluations/03-advanced/02-simulating-agent-interactions/shopping_concierge_agent.py",
        "lang": "python",
        "bytes": 10993
      },
      {
        "path": "07-AgentCore-evaluations/03-advanced/02-simulating-agent-interactions/strands_eval_config.py",
        "lang": "python",
        "bytes": 1773
      },
      {
        "path": "07-AgentCore-evaluations/README.md",
        "lang": "markdown",
        "bytes": 2357
      },
      {
        "path": "07-AgentCore-evaluations/requirements.txt",
        "lang": "text",
        "bytes": 101
      },
      {
        "path": "09-AgentCore-E2E/README.md",
        "lang": "markdown",
        "bytes": 1799
      },
      {
        "path": "09-AgentCore-E2E/langgraph/README.md",
        "lang": "markdown",
        "bytes": 85
      },
      {
        "path": "10-Agent-Registry/00-getting-started/end-to-end/01-registry-end-to-end/getting-started-registry-end-to-end.md",
        "lang": "markdown",
        "bytes": 39856,
        "fromNotebook": true
      },
      {
        "path": "10-Agent-Registry/00-getting-started/step-by-step/01-create-user-personas-workflow.md",
        "lang": "markdown",
        "bytes": 18553,
        "fromNotebook": true
      },
      {
        "path": "10-Agent-Registry/00-getting-started/step-by-step/02-creating-registry-workflow.md",
        "lang": "markdown",
        "bytes": 9456,
        "fromNotebook": true
      },
      {
        "path": "10-Agent-Registry/00-getting-started/step-by-step/03-publishing-records-workflow.md",
        "lang": "markdown",
        "bytes": 34147,
        "fromNotebook": true
      },
      {
        "path": "10-Agent-Registry/00-getting-started/step-by-step/04-admin-approval-workflow.md",
        "lang": "markdown",
        "bytes": 23662,
        "fromNotebook": true
      },
      {
        "path": "10-Agent-Registry/00-getting-started/step-by-step/05-search-registry-workflow.md",
        "lang": "markdown",
        "bytes": 22054,
        "fromNotebook": true
      },
      {
        "path": "10-Agent-Registry/00-getting-started/step-by-step/utils.py",
        "lang": "python",
        "bytes": 7578
      },
      {
        "path": "10-Agent-Registry/01-advanced/consumer-discovery-semantic-search/consumer-discovery-semantic-search.md",
        "lang": "markdown",
        "bytes": 19547,
        "fromNotebook": true
      },
      {
        "path": "10-Agent-Registry/01-advanced/consumer-discovery-semantic-search/registry-records.json",
        "lang": "json",
        "bytes": 21940
      },
      {
        "path": "10-Agent-Registry/01-advanced/kiro-registry-dcr-auth0/DCR_registry_search_mcp_in_kiro.md",
        "lang": "markdown",
        "bytes": 10450,
        "fromNotebook": true
      },
      {
        "path": "10-Agent-Registry/01-advanced/kiro-registry-dcr-auth0/seed_records.py",
        "lang": "python",
        "bytes": 10333
      },
      {
        "path": "10-Agent-Registry/01-advanced/kiro/kiro-power-publisher-workflow/README.md",
        "lang": "markdown",
        "bytes": 6233
      },
      {
        "path": "10-Agent-Registry/01-advanced/kiro/kiro-power-publisher-workflow/aws-agent-registry/POWER.md",
        "lang": "markdown",
        "bytes": 2870
      },
      {
        "path": "10-Agent-Registry/01-advanced/kiro/kiro-power-publisher-workflow/aws-agent-registry/steering/publisher_workflow.md",
        "lang": "markdown",
        "bytes": 10858
      },
      {
        "path": "11-AgentCore-harness/01-advanced-examples/06-vpc-integration/README.md",
        "lang": "markdown",
        "bytes": 3984
      },
      {
        "path": "11-AgentCore-harness/CONTRIBUTORS.md",
        "lang": "markdown",
        "bytes": 148
      },
      {
        "path": "11-AgentCore-harness/README.md",
        "lang": "markdown",
        "bytes": 2584
      },
      {
        "path": "11-AgentCore-harness/helper/client.py",
        "lang": "python",
        "bytes": 891
      },
      {
        "path": "11-AgentCore-harness/helper/iam.py",
        "lang": "python",
        "bytes": 4243
      },
      {
        "path": "11-AgentCore-harness/requirements.txt",
        "lang": "text",
        "bytes": 6
      },
      {
        "path": "13-AgentCore-payments/02-use-cases/README.md",
        "lang": "markdown",
        "bytes": 3027
      },
      {
        "path": "13-AgentCore-payments/README.md",
        "lang": "markdown",
        "bytes": 5009
      },
      {
        "path": "utils.py",
        "lang": "python",
        "bytes": 8615
      }
    ]
  },
  {
    "slug": "06-workshops/01-AgentCore-runtime/01-hosting-agent/01-strands-with-bedrock-model",
    "title": "Hosting Strands Agents with Amazon Bedrock models in Amazon Bedrock AgentCore Runtime",
    "desc": "In this tutorial we will learn how to host your existing agent, using Amazon Bedrock AgentCore Runtime.",
    "sectionId": "runtime",
    "kind": "workshop",
    "frameworks": [
      "Strands",
      "LangGraph",
      "OpenAI Agents"
    ],
    "languages": [],
    "hasNotebook": true,
    "readme": "/agentcore-samples/06-workshops/01-AgentCore-runtime/01-hosting-agent/01-strands-with-bedrock-model/README.md",
    "base": "/agentcore-samples/06-workshops/01-AgentCore-runtime/01-hosting-agent/01-strands-with-bedrock-model",
    "files": [
      {
        "path": "requirements.txt",
        "lang": "text",
        "bytes": 111
      },
      {
        "path": "runtime_with_strands_and_bedrock_models.md",
        "lang": "markdown",
        "bytes": 17775,
        "fromNotebook": true
      }
    ]
  },
  {
    "slug": "06-workshops/01-AgentCore-runtime/01-hosting-agent/02-langgraph-with-bedrock-model",
    "title": "Hosting LangGraph agent with Amazon Bedrock models in Amazon Bedrock AgentCore Runtime",
    "desc": "In this tutorial we will learn how to host your existing agent, using Amazon Bedrock AgentCore Runtime.",
    "sectionId": "runtime",
    "kind": "workshop",
    "frameworks": [
      "Strands",
      "LangGraph",
      "LangChain",
      "OpenAI Agents"
    ],
    "languages": [],
    "hasNotebook": true,
    "readme": "/agentcore-samples/06-workshops/01-AgentCore-runtime/01-hosting-agent/02-langgraph-with-bedrock-model/README.md",
    "base": "/agentcore-samples/06-workshops/01-AgentCore-runtime/01-hosting-agent/02-langgraph-with-bedrock-model",
    "files": [
      {
        "path": "requirements.txt",
        "lang": "text",
        "bytes": 207
      },
      {
        "path": "runtime_with_langgraph_and_bedrock_models.md",
        "lang": "markdown",
        "bytes": 22573,
        "fromNotebook": true
      }
    ]
  },
  {
    "slug": "06-workshops/01-AgentCore-runtime/01-hosting-agent/03-strands-with-openai-model",
    "title": "Hosting Strands Agents with OpenAI models in Amazon Bedrock AgentCore Runtime",
    "desc": "In this tutorial we will learn how to host your existing agent, using Amazon Bedrock AgentCore Runtime.",
    "sectionId": "runtime",
    "kind": "workshop",
    "frameworks": [
      "Strands",
      "LangGraph",
      "OpenAI Agents"
    ],
    "languages": [],
    "hasNotebook": true,
    "readme": "/agentcore-samples/06-workshops/01-AgentCore-runtime/01-hosting-agent/03-strands-with-openai-model/README.md",
    "base": "/agentcore-samples/06-workshops/01-AgentCore-runtime/01-hosting-agent/03-strands-with-openai-model",
    "files": [
      {
        "path": "requirements.txt",
        "lang": "text",
        "bytes": 194
      },
      {
        "path": "runtime_with_strands_and_openai_models.md",
        "lang": "markdown",
        "bytes": 16682,
        "fromNotebook": true
      }
    ]
  },
  {
    "slug": "06-workshops/01-AgentCore-runtime/01-hosting-agent/06-strands-with-skills",
    "title": "Hosting Strands Agents with AgentSkills Plugin in Amazon Bedrock AgentCore Runtime",
    "desc": "In this tutorial we will learn how to host a Strands agent that uses the AgentSkills plugin for on-demand specialized instructions, using Amazon Bedrock AgentCore Runtime.",
    "sectionId": "runtime",
    "kind": "workshop",
    "frameworks": [
      "Strands"
    ],
    "languages": [
      "python"
    ],
    "hasNotebook": true,
    "readme": "/agentcore-samples/06-workshops/01-AgentCore-runtime/01-hosting-agent/06-strands-with-skills/README.md",
    "base": "/agentcore-samples/06-workshops/01-AgentCore-runtime/01-hosting-agent/06-strands-with-skills",
    "files": [
      {
        "path": "agent_with_skills.py",
        "lang": "python",
        "bytes": 1676
      },
      {
        "path": "requirements.txt",
        "lang": "text",
        "bytes": 112
      },
      {
        "path": "runtime_with_strands_and_skills.md",
        "lang": "markdown",
        "bytes": 12861,
        "fromNotebook": true
      },
      {
        "path": "skills/weather-reporter/SKILL.md",
        "lang": "markdown",
        "bytes": 936
      }
    ]
  },
  {
    "slug": "06-workshops/01-AgentCore-runtime/01-hosting-agent/07-direct-code-deploy-typescript",
    "title": "Getting Started — TypeScript Agent on Amazon Bedrock AgentCore",
    "desc": "Deploy a TypeScript agent to AgentCore Runtime using Direct Code Deploy with Node.js 22.",
    "sectionId": "runtime",
    "kind": "workshop",
    "frameworks": [
      "Strands"
    ],
    "languages": [
      "typescript"
    ],
    "hasNotebook": false,
    "readme": "/agentcore-samples/06-workshops/01-AgentCore-runtime/01-hosting-agent/07-direct-code-deploy-typescript/README.md",
    "base": "/agentcore-samples/06-workshops/01-AgentCore-runtime/01-hosting-agent/07-direct-code-deploy-typescript",
    "files": [
      {
        "path": "app.ts",
        "lang": "typescript",
        "bytes": 2210
      },
      {
        "path": "iam.sh",
        "lang": "bash",
        "bytes": 3342
      },
      {
        "path": "package.json",
        "lang": "json",
        "bytes": 495
      },
      {
        "path": "runtime.sh",
        "lang": "bash",
        "bytes": 5031
      },
      {
        "path": "tsconfig.json",
        "lang": "json",
        "bytes": 250
      }
    ]
  },
  {
    "slug": "06-workshops/01-AgentCore-runtime/02-hosting-MCP-server",
    "title": "Hosting MCP server on AgentCore Runtime",
    "desc": "In this session we will discuss how to host MCP tools on Amazon Bedrock AgentCore Runtime.",
    "sectionId": "runtime",
    "kind": "workshop",
    "frameworks": [],
    "languages": [
      "python"
    ],
    "hasNotebook": true,
    "readme": "/agentcore-samples/06-workshops/01-AgentCore-runtime/02-hosting-MCP-server/README.md",
    "base": "/agentcore-samples/06-workshops/01-AgentCore-runtime/02-hosting-MCP-server",
    "files": [
      {
        "path": "hosting_mcp_server.md",
        "lang": "markdown",
        "bytes": 28112,
        "fromNotebook": true
      },
      {
        "path": "hosting_mcp_server_iam_auth.md",
        "lang": "markdown",
        "bytes": 33606,
        "fromNotebook": true
      },
      {
        "path": "requirements.txt",
        "lang": "text",
        "bytes": 84
      },
      {
        "path": "streamable_http_sigv4.py",
        "lang": "python",
        "bytes": 4997
      }
    ]
  },
  {
    "slug": "06-workshops/01-AgentCore-runtime/03-advanced-concepts/01-streaming-agent-response",
    "title": "Streaming Responses with Strands Agents and Amazon Bedrock models in Amazon Bedrock AgentCore Runtime",
    "desc": "In this tutorial we will learn how to implement streaming responses using Amazon Bedrock AgentCore Runtime with your existing agents.",
    "sectionId": "runtime",
    "kind": "workshop",
    "frameworks": [
      "Strands"
    ],
    "languages": [],
    "hasNotebook": true,
    "readme": "/agentcore-samples/06-workshops/01-AgentCore-runtime/03-advanced-concepts/01-streaming-agent-response/README.md",
    "base": "/agentcore-samples/06-workshops/01-AgentCore-runtime/03-advanced-concepts/01-streaming-agent-response",
    "files": [
      {
        "path": "requirements.txt",
        "lang": "text",
        "bytes": 111
      },
      {
        "path": "streamining_agent_response.md",
        "lang": "markdown",
        "bytes": 11980,
        "fromNotebook": true
      }
    ]
  },
  {
    "slug": "06-workshops/01-AgentCore-runtime/03-advanced-concepts/02-understanding-runtime-context",
    "title": "Understanding Runtime Context and Session Management in AgentCore Runtime",
    "desc": "In this tutorial, we will learn how to understand and work with runtime context and session management in Amazon Bedrock AgentCore Runtime. This example demonstrates how AgentCore Runtime handles...",
    "sectionId": "runtime",
    "kind": "workshop",
    "frameworks": [
      "Strands"
    ],
    "languages": [],
    "hasNotebook": true,
    "readme": "/agentcore-samples/06-workshops/01-AgentCore-runtime/03-advanced-concepts/02-understanding-runtime-context/README.md",
    "base": "/agentcore-samples/06-workshops/01-AgentCore-runtime/03-advanced-concepts/02-understanding-runtime-context",
    "files": [
      {
        "path": "requirements.txt",
        "lang": "text",
        "bytes": 111
      },
      {
        "path": "understanding_runtime_context.md",
        "lang": "markdown",
        "bytes": 28179,
        "fromNotebook": true
      }
    ]
  },
  {
    "slug": "06-workshops/01-AgentCore-runtime/03-advanced-concepts/03-handling-large-payloads",
    "title": "Handling Large Multi-Modal Payloads in AgentCore Runtime",
    "desc": "This tutorial demonstrates how Amazon Bedrock AgentCore Runtime handles large payloads up to 100MB, including multi-modal content such as Excel files and images. AgentCore Runtime is designed to...",
    "sectionId": "runtime",
    "kind": "workshop",
    "frameworks": [
      "Strands"
    ],
    "languages": [],
    "hasNotebook": true,
    "readme": "/agentcore-samples/06-workshops/01-AgentCore-runtime/03-advanced-concepts/03-handling-large-payloads/README.md",
    "base": "/agentcore-samples/06-workshops/01-AgentCore-runtime/03-advanced-concepts/03-handling-large-payloads",
    "files": [
      {
        "path": "handling_large_payloads.md",
        "lang": "markdown",
        "bytes": 10184,
        "fromNotebook": true
      },
      {
        "path": "requirements.txt",
        "lang": "text",
        "bytes": 134
      }
    ]
  },
  {
    "slug": "06-workshops/01-AgentCore-runtime/03-advanced-concepts/04-async-agents/02_async_data_analysis",
    "title": "Asynchronous Data Analysis Agent with Amazon Bedrock AgentCore",
    "desc": "In this tutorial we will learn how to build an asynchronous data analysis agent that can perform long-running analysis tasks in the background while maintaining a responsive conversation with the...",
    "sectionId": "runtime",
    "kind": "workshop",
    "frameworks": [
      "Strands"
    ],
    "languages": [
      "python"
    ],
    "hasNotebook": true,
    "readme": "/agentcore-samples/06-workshops/01-AgentCore-runtime/03-advanced-concepts/04-async-agents/02_async_data_analysis/README.md",
    "base": "/agentcore-samples/06-workshops/01-AgentCore-runtime/03-advanced-concepts/04-async-agents/02_async_data_analysis",
    "files": [
      {
        "path": "async_data_analysis_agent.py",
        "lang": "python",
        "bytes": 31464
      },
      {
        "path": "async_data_analysis_tutorial.md",
        "lang": "markdown",
        "bytes": 28145,
        "fromNotebook": true
      },
      {
        "path": "requirements.txt",
        "lang": "text",
        "bytes": 507
      },
      {
        "path": "utils.py",
        "lang": "python",
        "bytes": 17063
      }
    ]
  },
  {
    "slug": "06-workshops/01-AgentCore-runtime/03-advanced-concepts/05-multi-agents/01-multi-runtimes-with-boto3",
    "title": "Distributed Multi-agent Solution using Amazon Bedrock AgentCore",
    "desc": "In this tutorial we will learn how to independently host agents each in their own Bedrock AgentCore Runtime and built with different Agentic Frameworks. We'll then enable communication between...",
    "sectionId": "runtime",
    "kind": "workshop",
    "frameworks": [
      "Strands",
      "LangGraph"
    ],
    "languages": [
      "python"
    ],
    "hasNotebook": true,
    "readme": "/agentcore-samples/06-workshops/01-AgentCore-runtime/03-advanced-concepts/05-multi-agents/01-multi-runtimes-with-boto3/README.md",
    "base": "/agentcore-samples/06-workshops/01-AgentCore-runtime/03-advanced-concepts/05-multi-agents/01-multi-runtimes-with-boto3",
    "files": [
      {
        "path": "distributed_agents_with_agentcore.md",
        "lang": "markdown",
        "bytes": 23890,
        "fromNotebook": true
      },
      {
        "path": "hr_agent/requirements.txt",
        "lang": "text",
        "bytes": 123
      },
      {
        "path": "orchestrator_agent/invoke_agent_utils.py",
        "lang": "python",
        "bytes": 1075
      },
      {
        "path": "orchestrator_agent/requirements.txt",
        "lang": "text",
        "bytes": 96
      },
      {
        "path": "requirements.txt",
        "lang": "text",
        "bytes": 234
      },
      {
        "path": "tech_agent/requirements.txt",
        "lang": "text",
        "bytes": 96
      },
      {
        "path": "utils.py",
        "lang": "python",
        "bytes": 8158
      }
    ]
  },
  {
    "slug": "06-workshops/01-AgentCore-runtime/03-advanced-concepts/06-middleware-support",
    "title": "Middleware Support in AgentCore Runtime",
    "desc": "This tutorial demonstrates how to implement middleware in Amazon Bedrock AgentCore Runtime. Middleware allows you to process requests before they reach your agent and responses before they're sent...",
    "sectionId": "runtime",
    "kind": "workshop",
    "frameworks": [
      "Strands"
    ],
    "languages": [
      "python"
    ],
    "hasNotebook": true,
    "readme": "/agentcore-samples/06-workshops/01-AgentCore-runtime/03-advanced-concepts/06-middleware-support/README.md",
    "base": "/agentcore-samples/06-workshops/01-AgentCore-runtime/03-advanced-concepts/06-middleware-support",
    "files": [
      {
        "path": "middleware_agent.py",
        "lang": "python",
        "bytes": 4125
      },
      {
        "path": "middleware_support.md",
        "lang": "markdown",
        "bytes": 19666,
        "fromNotebook": true
      },
      {
        "path": "requirements.txt",
        "lang": "text",
        "bytes": 155
      }
    ]
  },
  {
    "slug": "06-workshops/01-AgentCore-runtime/03-advanced-concepts/07-connect-to-vpc-resources",
    "title": "VPC Fargate Agent Runtime CDK Stack",
    "desc": "This CDK stack deploys a Fargate container in a VPC with AWS Bedrock AgentCore Runtime. The container exposes two HTTP endpoints:",
    "sectionId": "runtime",
    "kind": "workshop",
    "frameworks": [],
    "languages": [
      "python",
      "typescript"
    ],
    "hasNotebook": true,
    "readme": "/agentcore-samples/06-workshops/01-AgentCore-runtime/03-advanced-concepts/07-connect-to-vpc-resources/README.md",
    "base": "/agentcore-samples/06-workshops/01-AgentCore-runtime/03-advanced-concepts/07-connect-to-vpc-resources",
    "files": [
      {
        "path": "agent/main.py",
        "lang": "python",
        "bytes": 457
      },
      {
        "path": "agent/requirements.txt",
        "lang": "text",
        "bytes": 23
      },
      {
        "path": "agentcore-runtime-in-vpc-access.md",
        "lang": "markdown",
        "bytes": 2741,
        "fromNotebook": true
      },
      {
        "path": "bin/app.ts",
        "lang": "typescript",
        "bytes": 434
      },
      {
        "path": "cdk.json",
        "lang": "json",
        "bytes": 3839
      },
      {
        "path": "lib/vpc-fargate-stack.ts",
        "lang": "typescript",
        "bytes": 6446
      },
      {
        "path": "package.json",
        "lang": "json",
        "bytes": 706
      },
      {
        "path": "resource-code/app.py",
        "lang": "python",
        "bytes": 1969
      },
      {
        "path": "resource-code/requirements.txt",
        "lang": "text",
        "bytes": 5
      }
    ]
  },
  {
    "slug": "06-workshops/01-AgentCore-runtime/04-hosting-ts-MCP-server",
    "title": "TypeScript MCP Server on Amazon Bedrock AgentCore",
    "desc": "This tutorial demonstrates how to host a TypeScript-based MCP (Model Context Protocol) server using the Amazon Bedrock AgentCore runtime environment.",
    "sectionId": "runtime",
    "kind": "workshop",
    "frameworks": [],
    "languages": [
      "typescript"
    ],
    "hasNotebook": true,
    "readme": "/agentcore-samples/06-workshops/01-AgentCore-runtime/04-hosting-ts-MCP-server/README.md",
    "base": "/agentcore-samples/06-workshops/01-AgentCore-runtime/04-hosting-ts-MCP-server",
    "files": [
      {
        "path": "mcp_client.md",
        "lang": "markdown",
        "bytes": 14790,
        "fromNotebook": true
      },
      {
        "path": "package.json",
        "lang": "json",
        "bytes": 942
      },
      {
        "path": "requirements.txt",
        "lang": "text",
        "bytes": 17
      },
      {
        "path": "src/index.ts",
        "lang": "typescript",
        "bytes": 1516
      },
      {
        "path": "src/server.ts",
        "lang": "typescript",
        "bytes": 1137
      },
      {
        "path": "tsconfig.json",
        "lang": "json",
        "bytes": 1080
      }
    ]
  },
  {
    "slug": "06-workshops/01-AgentCore-runtime/05-hosting-a2a/01-a2a-agent-orchestrating-mcp",
    "title": "A2A Agent Orchestrating Mcp",
    "desc": "Amazon Bedrock AgentCore Runtime is a secure, serverless runtime designed for deploying and scaling AI agents and tools. It supports any frameworks, models, and protocols, enabling developers to...",
    "sectionId": "runtime",
    "kind": "workshop",
    "frameworks": [
      "Strands"
    ],
    "languages": [
      "python"
    ],
    "hasNotebook": true,
    "readme": "/agentcore-samples/06-workshops/01-AgentCore-runtime/05-hosting-a2a/01-a2a-agent-orchestrating-mcp/README.md",
    "base": "/agentcore-samples/06-workshops/01-AgentCore-runtime/05-hosting-a2a/01-a2a-agent-orchestrating-mcp",
    "files": [
      {
        "path": "01-a2a-getting-started-agentcore-strands.md",
        "lang": "markdown",
        "bytes": 21757,
        "fromNotebook": true
      },
      {
        "path": "02-a2a-deploy-orchestrator.md",
        "lang": "markdown",
        "bytes": 11367,
        "fromNotebook": true
      },
      {
        "path": "03-a2a-cleanup.md",
        "lang": "markdown",
        "bytes": 3026,
        "fromNotebook": true
      },
      {
        "path": "helpers/utils.py",
        "lang": "python",
        "bytes": 23417
      },
      {
        "path": "requirements.txt",
        "lang": "text",
        "bytes": 134
      }
    ]
  },
  {
    "slug": "06-workshops/01-AgentCore-runtime/05-hosting-a2a/02-a2a-agent-sigv4",
    "title": "AgentCore A2A with IAM Authentication Sample",
    "desc": "This sample demonstrates how to deploy an A2A (Agent-to-Agent) agent on Amazon Bedrock AgentCore Runtime using AWS IAM for inbound authentication. It combines the A2A protocol with IAM-based...",
    "sectionId": "runtime",
    "kind": "workshop",
    "frameworks": [
      "Strands"
    ],
    "languages": [
      "python"
    ],
    "hasNotebook": true,
    "readme": "/agentcore-samples/06-workshops/01-AgentCore-runtime/05-hosting-a2a/02-a2a-agent-sigv4/README.md",
    "base": "/agentcore-samples/06-workshops/01-AgentCore-runtime/05-hosting-a2a/02-a2a-agent-sigv4",
    "files": [
      {
        "path": "agent.py",
        "lang": "python",
        "bytes": 2135
      },
      {
        "path": "client.py",
        "lang": "python",
        "bytes": 5447
      },
      {
        "path": "deploy.py",
        "lang": "python",
        "bytes": 1450
      },
      {
        "path": "hosting_a2a_iam_auth.md",
        "lang": "markdown",
        "bytes": 8343,
        "fromNotebook": true
      },
      {
        "path": "requirements.txt",
        "lang": "text",
        "bytes": 121
      }
    ]
  },
  {
    "slug": "06-workshops/01-AgentCore-runtime/07-mcp-dynamic-client-registration",
    "title": "Dynamic Client Registration with AgentCore Runtime and Auth0",
    "desc": "In this session, we will discuss how to host MCP tools on Amazon Bedrock AgentCore Runtime. This MCP will be integrated with Auth0's Dynamic Client Registration feature.",
    "sectionId": "runtime",
    "kind": "workshop",
    "frameworks": [],
    "languages": [
      "python"
    ],
    "hasNotebook": true,
    "readme": "/agentcore-samples/06-workshops/01-AgentCore-runtime/07-mcp-dynamic-client-registration/README.md",
    "base": "/agentcore-samples/06-workshops/01-AgentCore-runtime/07-mcp-dynamic-client-registration",
    "files": [
      {
        "path": "deploy_dcr_mcp_agentcore.md",
        "lang": "markdown",
        "bytes": 9787,
        "fromNotebook": true
      },
      {
        "path": "mcp_auth0_client.py",
        "lang": "python",
        "bytes": 15592
      },
      {
        "path": "requirements.txt",
        "lang": "text",
        "bytes": 59
      },
      {
        "path": "server.py",
        "lang": "python",
        "bytes": 523
      }
    ]
  },
  {
    "slug": "06-workshops/01-AgentCore-runtime/08-mcp-e2e/01-server-e2e",
    "title": "Full Example of MCP Stateless Server",
    "desc": "This tutorial demonstrates how to build a complete MCP (Model Context Protocol) server with all three core capabilities and deploy it to Amazon Bedrock AgentCore Runtime.",
    "sectionId": "runtime",
    "kind": "workshop",
    "frameworks": [],
    "languages": [
      "python"
    ],
    "hasNotebook": true,
    "readme": "/agentcore-samples/06-workshops/01-AgentCore-runtime/08-mcp-e2e/01-server-e2e/README.md",
    "base": "/agentcore-samples/06-workshops/01-AgentCore-runtime/08-mcp-e2e/01-server-e2e",
    "files": [
      {
        "path": "agents/dynamo_utils.py",
        "lang": "python",
        "bytes": 4511
      },
      {
        "path": "agents/mcp_e2e_stateless_server.py",
        "lang": "python",
        "bytes": 8443
      },
      {
        "path": "expenses.txt",
        "lang": "text",
        "bytes": 174
      },
      {
        "path": "mcp_server_features_e2e.md",
        "lang": "markdown",
        "bytes": 31487,
        "fromNotebook": true
      },
      {
        "path": "requirements.txt",
        "lang": "text",
        "bytes": 70
      }
    ]
  },
  {
    "slug": "06-workshops/01-AgentCore-runtime/09-execute-command",
    "title": "Execute Commands in Bedrock AgentCore Runtime",
    "desc": "This tutorial demonstrates how to execute system commands directly within the Amazon Bedrock AgentCore Runtime environment using the invokeagentruntimecommand API. Learn how to deploy an agent and...",
    "sectionId": "runtime",
    "kind": "workshop",
    "frameworks": [
      "Strands"
    ],
    "languages": [
      "python"
    ],
    "hasNotebook": true,
    "readme": "/agentcore-samples/06-workshops/01-AgentCore-runtime/09-execute-command/README.md",
    "base": "/agentcore-samples/06-workshops/01-AgentCore-runtime/09-execute-command",
    "files": [
      {
        "path": "01_exec_command.md",
        "lang": "markdown",
        "bytes": 8875,
        "fromNotebook": true
      },
      {
        "path": "agents/agent.py",
        "lang": "python",
        "bytes": 873
      },
      {
        "path": "agents/requirements.txt",
        "lang": "text",
        "bytes": 33
      },
      {
        "path": "requirements.txt",
        "lang": "text",
        "bytes": 82
      }
    ]
  },
  {
    "slug": "06-workshops/01-AgentCore-runtime/11-ag-ui-examples",
    "title": "AG-UI Examples on AgentCore Runtime",
    "desc": "AG-UI (Agent-User Interface) is an open, event-based protocol for connecting AI agents to user-facing applications. Unlike request-response protocols, AG-UI streams events as the agent works —...",
    "sectionId": "runtime",
    "kind": "workshop",
    "frameworks": [
      "Strands"
    ],
    "languages": [
      "python"
    ],
    "hasNotebook": true,
    "readme": "/agentcore-samples/06-workshops/01-AgentCore-runtime/11-ag-ui-examples/README.md",
    "base": "/agentcore-samples/06-workshops/01-AgentCore-runtime/11-ag-ui-examples",
    "files": [
      {
        "path": "agui_agent.py",
        "lang": "python",
        "bytes": 6395
      },
      {
        "path": "hosting_agui_agent_cognito.md",
        "lang": "markdown",
        "bytes": 16153,
        "fromNotebook": true
      },
      {
        "path": "hosting_agui_agent_iam.md",
        "lang": "markdown",
        "bytes": 15111,
        "fromNotebook": true
      },
      {
        "path": "requirements.txt",
        "lang": "text",
        "bytes": 69
      }
    ]
  },
  {
    "slug": "06-workshops/01-AgentCore-runtime/12-coding-agents/01-claude-code-with-s3-files",
    "title": "Claude Code on AgentCore Runtime with S3 Files",
    "desc": "Deploys Claude Code as an HTTP agent on AWS Bedrock AgentCore Runtime, with an S3 Files file system mounted at /mnt/s3files for persistent storage shared across sessions.",
    "sectionId": "runtime",
    "kind": "workshop",
    "frameworks": [],
    "languages": [
      "javascript",
      "python"
    ],
    "hasNotebook": false,
    "readme": "/agentcore-samples/06-workshops/01-AgentCore-runtime/12-coding-agents/01-claude-code-with-s3-files/README.md",
    "base": "/agentcore-samples/06-workshops/01-AgentCore-runtime/12-coding-agents/01-claude-code-with-s3-files",
    "files": [
      {
        "path": "cfn-vpc.yaml",
        "lang": "yaml",
        "bytes": 13135
      },
      {
        "path": "cleanup.py",
        "lang": "python",
        "bytes": 3959
      },
      {
        "path": "cleanup.sh",
        "lang": "bash",
        "bytes": 314
      },
      {
        "path": "deploy.py",
        "lang": "python",
        "bytes": 13393
      },
      {
        "path": "exec_cmd.py",
        "lang": "python",
        "bytes": 3308
      },
      {
        "path": "invoke.py",
        "lang": "python",
        "bytes": 4105
      },
      {
        "path": "server.js",
        "lang": "javascript",
        "bytes": 2330
      },
      {
        "path": "setup.sh",
        "lang": "bash",
        "bytes": 4679
      },
      {
        "path": "update.py",
        "lang": "python",
        "bytes": 5011
      }
    ]
  },
  {
    "slug": "06-workshops/01-AgentCore-runtime/12-coding-agents/02-claude-code-with-efs",
    "title": "Claude Code on AgentCore Runtime with EFS",
    "desc": "Deploys Claude Code as an HTTP agent on AWS Bedrock AgentCore Runtime, with an EFS file system mounted at /mnt/efs for persistent storage shared across sessions.",
    "sectionId": "runtime",
    "kind": "workshop",
    "frameworks": [],
    "languages": [
      "javascript",
      "python"
    ],
    "hasNotebook": false,
    "readme": "/agentcore-samples/06-workshops/01-AgentCore-runtime/12-coding-agents/02-claude-code-with-efs/README.md",
    "base": "/agentcore-samples/06-workshops/01-AgentCore-runtime/12-coding-agents/02-claude-code-with-efs",
    "files": [
      {
        "path": "cfn-vpc.yaml",
        "lang": "yaml",
        "bytes": 9093
      },
      {
        "path": "cleanup.py",
        "lang": "python",
        "bytes": 3748
      },
      {
        "path": "cleanup.sh",
        "lang": "bash",
        "bytes": 314
      },
      {
        "path": "deploy.py",
        "lang": "python",
        "bytes": 10242
      },
      {
        "path": "exec_cmd.py",
        "lang": "python",
        "bytes": 3304
      },
      {
        "path": "invoke.py",
        "lang": "python",
        "bytes": 4105
      },
      {
        "path": "server.js",
        "lang": "javascript",
        "bytes": 2843
      },
      {
        "path": "setup.sh",
        "lang": "bash",
        "bytes": 3543
      },
      {
        "path": "update.py",
        "lang": "python",
        "bytes": 4942
      }
    ]
  },
  {
    "slug": "06-workshops/02-AgentCore-gateway",
    "title": "Amazon Bedrock AgentCore Gateway",
    "desc": "Bedrock AgentCore Gateway provides customers a way to turn their existing APIs and Lambda functions into fully-managed MCP servers without needing to manage infra or hosting. Customers can bring...",
    "sectionId": "gateway",
    "kind": "workshop",
    "frameworks": [
      "Strands",
      "LangChain"
    ],
    "languages": [
      "python",
      "typescript"
    ],
    "hasNotebook": true,
    "readme": "/agentcore-samples/06-workshops/02-AgentCore-gateway/README.md",
    "base": "/agentcore-samples/06-workshops/02-AgentCore-gateway",
    "files": [
      {
        "path": "02-transform-apis-into-mcp-tools/01-transform-openapi-into-mcp-tools/01-openapis-into-mcp-api-key.md",
        "lang": "markdown",
        "bytes": 15003,
        "fromNotebook": true
      },
      {
        "path": "02-transform-apis-into-mcp-tools/01-transform-openapi-into-mcp-tools/02-openapis-into-mcp-oauth-enterprise-apis.md",
        "lang": "markdown",
        "bytes": 15412,
        "fromNotebook": true
      },
      {
        "path": "02-transform-apis-into-mcp-tools/01-transform-openapi-into-mcp-tools/openapi-specs/Zendesk-support-apis.yaml",
        "lang": "yaml",
        "bytes": 1178660
      },
      {
        "path": "02-transform-apis-into-mcp-tools/01-transform-openapi-into-mcp-tools/openapi-specs/google-calendar-open-api.json",
        "lang": "json",
        "bytes": 42026
      },
      {
        "path": "02-transform-apis-into-mcp-tools/01-transform-openapi-into-mcp-tools/openapi-specs/nasa_mars_insights_openapi.json",
        "lang": "json",
        "bytes": 4756
      },
      {
        "path": "02-transform-apis-into-mcp-tools/01-transform-openapi-into-mcp-tools/requirements.txt",
        "lang": "text",
        "bytes": 96
      },
      {
        "path": "02-transform-apis-into-mcp-tools/02-transform-smithyapis-into-mcp-tools/01-s3-smithy-into-mcp-iam.md",
        "lang": "markdown",
        "bytes": 13517,
        "fromNotebook": true
      },
      {
        "path": "02-transform-apis-into-mcp-tools/02-transform-smithyapis-into-mcp-tools/requirements.txt",
        "lang": "text",
        "bytes": 96
      },
      {
        "path": "02-transform-apis-into-mcp-tools/02-transform-smithyapis-into-mcp-tools/smithy-specs/s3-apis.json",
        "lang": "json",
        "bytes": 1981559
      },
      {
        "path": "02-transform-apis-into-mcp-tools/README.md",
        "lang": "markdown",
        "bytes": 6028
      },
      {
        "path": "04-integration/04-enterprise-mcp-demo/README.MD",
        "lang": "markdown",
        "bytes": 18963
      },
      {
        "path": "04-integration/04-enterprise-mcp-demo/scripts/script.py",
        "lang": "python",
        "bytes": 2391
      },
      {
        "path": "04-integration/05-entraid-3lo-gateway/README.md",
        "lang": "markdown",
        "bytes": 10002
      },
      {
        "path": "04-integration/05-entraid-3lo-gateway/bin/cdk.ts",
        "lang": "typescript",
        "bytes": 553
      },
      {
        "path": "04-integration/05-entraid-3lo-gateway/cdk.json",
        "lang": "json",
        "bytes": 591
      },
      {
        "path": "04-integration/05-entraid-3lo-gateway/docs/out-of-band-outbound-auth.md",
        "lang": "markdown",
        "bytes": 16244
      },
      {
        "path": "04-integration/05-entraid-3lo-gateway/infra/cdk-stack.ts",
        "lang": "typescript",
        "bytes": 18017
      },
      {
        "path": "04-integration/05-entraid-3lo-gateway/lambda/elicitation_interceptor.py",
        "lang": "python",
        "bytes": 4640
      },
      {
        "path": "04-integration/05-entraid-3lo-gateway/lambda/mcp_proxy_lambda.py",
        "lang": "python",
        "bytes": 36551
      },
      {
        "path": "04-integration/05-entraid-3lo-gateway/lambda/weather_api_lambda.py",
        "lang": "python",
        "bytes": 1999
      },
      {
        "path": "04-integration/05-entraid-3lo-gateway/openapi/weather-api.json",
        "lang": "json",
        "bytes": 2522
      },
      {
        "path": "04-integration/05-entraid-3lo-gateway/package.json",
        "lang": "json",
        "bytes": 543
      },
      {
        "path": "04-integration/05-entraid-3lo-gateway/scripts/create-demo-user.sh",
        "lang": "bash",
        "bytes": 3968
      },
      {
        "path": "04-integration/05-entraid-3lo-gateway/scripts/redeploy-cdk.sh",
        "lang": "bash",
        "bytes": 3321
      },
      {
        "path": "04-integration/05-entraid-3lo-gateway/scripts/setup.sh",
        "lang": "bash",
        "bytes": 20146
      },
      {
        "path": "04-integration/05-entraid-3lo-gateway/tsconfig.json",
        "lang": "json",
        "bytes": 676
      },
      {
        "path": "10-sensitive-data-masking/01-interceptor-lambda-mask-sensitive-data.md",
        "lang": "markdown",
        "bytes": 32988,
        "fromNotebook": true
      },
      {
        "path": "10-sensitive-data-masking/requirements.txt",
        "lang": "text",
        "bytes": 102
      },
      {
        "path": "10-sensitive-data-masking/src/lambda/lambda_function.py",
        "lang": "python",
        "bytes": 13197
      },
      {
        "path": "10-sensitive-data-masking/src/tools/employee_data_tool.py",
        "lang": "python",
        "bytes": 5938
      },
      {
        "path": "13-outbound-auth-code-grant/01-outbound-auth-code-grant-linkedin.md",
        "lang": "markdown",
        "bytes": 29775,
        "fromNotebook": true
      },
      {
        "path": "13-outbound-auth-code-grant/oauth2_callback_server.py",
        "lang": "python",
        "bytes": 17800
      },
      {
        "path": "13-outbound-auth-code-grant/requirements.txt",
        "lang": "text",
        "bytes": 87
      },
      {
        "path": "17-inbound-auth-code-flow-okta/okta-auth-code-flow-gateway.md",
        "lang": "markdown",
        "bytes": 11359,
        "fromNotebook": true
      },
      {
        "path": "utils.py",
        "lang": "python",
        "bytes": 41763
      }
    ]
  },
  {
    "slug": "06-workshops/02-AgentCore-gateway/01-transform-lambda-into-mcp-tools",
    "title": "Implement Lambda function tools for Gateway",
    "desc": "Bedrock AgentCore Gateway provides customers a way to turn their existing Lambda functions into fully-managed MCP servers without needing to manage infra or hosting. Customers can bring their...",
    "sectionId": "gateway",
    "kind": "workshop",
    "frameworks": [
      "Strands"
    ],
    "languages": [
      "python"
    ],
    "hasNotebook": true,
    "readme": "/agentcore-samples/06-workshops/02-AgentCore-gateway/01-transform-lambda-into-mcp-tools/README.md",
    "base": "/agentcore-samples/06-workshops/02-AgentCore-gateway/01-transform-lambda-into-mcp-tools",
    "files": [
      {
        "path": "01-gateway-target-lambda-oauth.md",
        "lang": "markdown",
        "bytes": 14569,
        "fromNotebook": true
      },
      {
        "path": "02-gateway-target-lambda-iam.md",
        "lang": "markdown",
        "bytes": 14595,
        "fromNotebook": true
      },
      {
        "path": "requirements.txt",
        "lang": "text",
        "bytes": 96
      },
      {
        "path": "streamable_http_sigv4.py",
        "lang": "python",
        "bytes": 4997
      }
    ]
  },
  {
    "slug": "06-workshops/02-AgentCore-gateway/03-search-tools",
    "title": "Amazon Bedrock AgentCore Gateway - Semantic search",
    "desc": "Amazon Bedrock AgentCore Gateway provides unified connectivity between agents and the tools and resources they need to interact with. Gateway plays multiple roles in this connectivity layer:",
    "sectionId": "gateway",
    "kind": "workshop",
    "frameworks": [
      "Strands"
    ],
    "languages": [
      "python"
    ],
    "hasNotebook": true,
    "readme": "/agentcore-samples/06-workshops/02-AgentCore-gateway/03-search-tools/README.md",
    "base": "/agentcore-samples/06-workshops/02-AgentCore-gateway/03-search-tools",
    "files": [
      {
        "path": "01-gateway-search.md",
        "lang": "markdown",
        "bytes": 44174,
        "fromNotebook": true
      },
      {
        "path": "calc/calc-api.json",
        "lang": "json",
        "bytes": 59108
      },
      {
        "path": "calc/lambda_function_code.py",
        "lang": "python",
        "bytes": 1751
      },
      {
        "path": "requirements.txt",
        "lang": "text",
        "bytes": 102
      },
      {
        "path": "restaurant/lambda_function_code.py",
        "lang": "python",
        "bytes": 1060
      },
      {
        "path": "restaurant/restaurant-api.json",
        "lang": "json",
        "bytes": 1258
      },
      {
        "path": "utils.py",
        "lang": "python",
        "bytes": 20731
      }
    ]
  },
  {
    "slug": "06-workshops/02-AgentCore-gateway/04-integration/01-runtime-gateway",
    "title": "Integrate Amazon Bedrock AgentCore Gateway with Amazon Bedrock AgentCore Runtime",
    "desc": "Amazon Bedrock AgentCore Gateway provides customers a way to turn their existing AWS Lambda functions & APIs (OpenAPI and Smithy) into fully-managed MCP servers without needing to manage infra or...",
    "sectionId": "gateway",
    "kind": "workshop",
    "frameworks": [
      "Strands"
    ],
    "languages": [
      "python"
    ],
    "hasNotebook": true,
    "readme": "/agentcore-samples/06-workshops/02-AgentCore-gateway/04-integration/01-runtime-gateway/README.md",
    "base": "/agentcore-samples/06-workshops/02-AgentCore-gateway/04-integration/01-runtime-gateway",
    "files": [
      {
        "path": "04-runtime-gateway.md",
        "lang": "markdown",
        "bytes": 36457,
        "fromNotebook": true
      },
      {
        "path": "cloudformation/customer_support_lambda.yaml",
        "lang": "yaml",
        "bytes": 38106
      },
      {
        "path": "deploy_cloudformation.py",
        "lang": "python",
        "bytes": 17604
      },
      {
        "path": "lambda/__init__.py",
        "lang": "python",
        "bytes": 0
      },
      {
        "path": "lambda/api_spec.json",
        "lang": "json",
        "bytes": 1118
      },
      {
        "path": "lambda/python/__init__.py",
        "lang": "python",
        "bytes": 0
      },
      {
        "path": "lambda/python/check_warranty.py",
        "lang": "python",
        "bytes": 6364
      },
      {
        "path": "lambda/python/get_customer_profile.py",
        "lang": "python",
        "bytes": 12248
      },
      {
        "path": "lambda/python/lambda_function_code.py",
        "lang": "python",
        "bytes": 2134
      },
      {
        "path": "openapi-specs/nasa_mars_insights_openapi.json",
        "lang": "json",
        "bytes": 7581
      },
      {
        "path": "requirements.txt",
        "lang": "text",
        "bytes": 100
      },
      {
        "path": "streamable_http_sigv4.py",
        "lang": "python",
        "bytes": 4997
      }
    ]
  },
  {
    "slug": "06-workshops/02-AgentCore-gateway/04-integration/02-runtime-gateway-mcp-toolkit",
    "title": "AgentCore Runtime and Gateway MCP Server Toolkit",
    "desc": "A configurable toolkit for quickly setting up Custom MCP Server in AgentCore runtime and gateway infrastructure.",
    "sectionId": "gateway",
    "kind": "workshop",
    "frameworks": [
      "Strands"
    ],
    "languages": [
      "python"
    ],
    "hasNotebook": false,
    "readme": "/agentcore-samples/06-workshops/02-AgentCore-gateway/04-integration/02-runtime-gateway-mcp-toolkit/README.md",
    "base": "/agentcore-samples/06-workshops/02-AgentCore-gateway/04-integration/02-runtime-gateway-mcp-toolkit",
    "files": [
      {
        "path": "agentcore_toolkit/__init__.py",
        "lang": "python",
        "bytes": 79
      },
      {
        "path": "agentcore_toolkit/main.py",
        "lang": "python",
        "bytes": 19821
      },
      {
        "path": "agentcore_toolkit/utils.py",
        "lang": "python",
        "bytes": 33281
      },
      {
        "path": "build.sh",
        "lang": "bash",
        "bytes": 290
      },
      {
        "path": "cleanup.py",
        "lang": "python",
        "bytes": 2102
      },
      {
        "path": "example_usage.sh",
        "lang": "bash",
        "bytes": 829
      },
      {
        "path": "mcp_server/calculator/requirements.txt",
        "lang": "text",
        "bytes": 57
      },
      {
        "path": "mcp_server/calculator/server.py",
        "lang": "python",
        "bytes": 500
      },
      {
        "path": "mcp_server/helloworld/requirements.txt",
        "lang": "text",
        "bytes": 57
      },
      {
        "path": "mcp_server/helloworld/server.py",
        "lang": "python",
        "bytes": 301
      },
      {
        "path": "pyproject.toml",
        "lang": "toml",
        "bytes": 618
      },
      {
        "path": "requirements.txt",
        "lang": "text",
        "bytes": 76
      },
      {
        "path": "setup.py",
        "lang": "python",
        "bytes": 281
      }
    ]
  },
  {
    "slug": "06-workshops/02-AgentCore-gateway/04-integration/03-ide-gateway-tool",
    "title": "VS Code + AgentCore Gateway: Serverless OAuth Proxy",
    "desc": "This document explains how to connect Visual Studio Code with Copilot to Amazon Bedrock AgentCore Gateway using a serverless OAuth proxy deployed on AWS, with Atlassian Confluence as a backend...",
    "sectionId": "gateway",
    "kind": "workshop",
    "frameworks": [],
    "languages": [
      "python"
    ],
    "hasNotebook": true,
    "readme": "/agentcore-samples/06-workshops/02-AgentCore-gateway/04-integration/03-ide-gateway-tool/README.md",
    "base": "/agentcore-samples/06-workshops/02-AgentCore-gateway/04-integration/03-ide-gateway-tool",
    "files": [
      {
        "path": "01_vscode_agentcore_confluence_serverless.md",
        "lang": "markdown",
        "bytes": 31959,
        "fromNotebook": true
      },
      {
        "path": "lambda/callback_lambda.py",
        "lang": "python",
        "bytes": 3323
      },
      {
        "path": "lambda/mcp_proxy_lambda.py",
        "lang": "python",
        "bytes": 11737
      },
      {
        "path": "requirements.txt",
        "lang": "text",
        "bytes": 154
      },
      {
        "path": "utils.py",
        "lang": "python",
        "bytes": 14711
      }
    ]
  },
  {
    "slug": "06-workshops/02-AgentCore-gateway/04-integration/04-enterprise-mcp-demo/cdk",
    "title": "Enterprise MCP Gateway – CDK Infrastructure",
    "desc": "This CDK stack deploys an enterprise-grade MCP (Model Context Protocol) gateway backed by Amazon Bedrock AgentCore, using an Application Load Balancer (ALB) with full security hardening.",
    "sectionId": "gateway",
    "kind": "workshop",
    "frameworks": [],
    "languages": [
      "javascript",
      "python",
      "typescript"
    ],
    "hasNotebook": false,
    "readme": "/agentcore-samples/06-workshops/02-AgentCore-gateway/04-integration/04-enterprise-mcp-demo/cdk/README.md",
    "base": "/agentcore-samples/06-workshops/02-AgentCore-gateway/04-integration/04-enterprise-mcp-demo/cdk",
    "files": [
      {
        "path": "bin/enterprise-mcp-infra.ts",
        "lang": "typescript",
        "bytes": 306
      },
      {
        "path": "cdk.context.json",
        "lang": "json",
        "bytes": 147
      },
      {
        "path": "cdk.json",
        "lang": "json",
        "bytes": 5615
      },
      {
        "path": "jest.config.js",
        "lang": "javascript",
        "bytes": 224
      },
      {
        "path": "lambda/agentcore-policy-engine/agentcore_policy_engine.py",
        "lang": "python",
        "bytes": 24452
      },
      {
        "path": "lambda/agentcore-policy-engine/requirements.txt",
        "lang": "text",
        "bytes": 14
      },
      {
        "path": "lambda/interceptor/interceptor.py",
        "lang": "python",
        "bytes": 12237
      },
      {
        "path": "lambda/mcp-servers/inventory/inventory_lambda.py",
        "lang": "python",
        "bytes": 1347
      },
      {
        "path": "lambda/mcp-servers/user_details/user_details_lambda.py",
        "lang": "python",
        "bytes": 1641
      },
      {
        "path": "lambda/mcp-servers/weather/weather_lambda.py",
        "lang": "python",
        "bytes": 1216
      },
      {
        "path": "lambda/mcp_proxy_lambda.py",
        "lang": "python",
        "bytes": 21761
      },
      {
        "path": "lambda/pre_token_generation_lambda.py",
        "lang": "python",
        "bytes": 4322
      },
      {
        "path": "lib/agentcore-policy-engine.ts",
        "lang": "typescript",
        "bytes": 6843
      },
      {
        "path": "lib/enterprise-mcp-infra-stack.ts",
        "lang": "typescript",
        "bytes": 55693
      },
      {
        "path": "package.json",
        "lang": "json",
        "bytes": 587
      },
      {
        "path": "test/enterprise-mcp-infra.test.ts",
        "lang": "typescript",
        "bytes": 637
      },
      {
        "path": "tsconfig.json",
        "lang": "json",
        "bytes": 712
      }
    ]
  },
  {
    "slug": "06-workshops/02-AgentCore-gateway/04-integration/06-secure-ide-gateway-tool",
    "title": "VS Code + AgentCore Gateway: Secure IDE Tool Access with Figma",
    "desc": "This sample connects an IDE — Visual Studio Code (with GitHub Copilot) or Kiro — to Amazon Bedrock AgentCore Gateway, giving it access to Figma as an MCP tool with OAuth 2.0 three-legged...",
    "sectionId": "gateway",
    "kind": "workshop",
    "frameworks": [],
    "languages": [
      "python"
    ],
    "hasNotebook": true,
    "readme": "/agentcore-samples/06-workshops/02-AgentCore-gateway/04-integration/06-secure-ide-gateway-tool/README.md",
    "base": "/agentcore-samples/06-workshops/02-AgentCore-gateway/04-integration/06-secure-ide-gateway-tool",
    "files": [
      {
        "path": "01_gateway_secure_3lo_auth.md",
        "lang": "markdown",
        "bytes": 15406,
        "fromNotebook": true
      },
      {
        "path": "cognito_helper.py",
        "lang": "python",
        "bytes": 3147
      },
      {
        "path": "lambda/callback_lambda.py",
        "lang": "python",
        "bytes": 9446
      },
      {
        "path": "lambda/idp_lambda.py",
        "lang": "python",
        "bytes": 32132
      },
      {
        "path": "lambda/mcp_lambda.py",
        "lang": "python",
        "bytes": 7234
      },
      {
        "path": "requirements.txt",
        "lang": "text",
        "bytes": 29
      }
    ]
  },
  {
    "slug": "06-workshops/02-AgentCore-gateway/04-integration/06-secure-ide-gateway-tool/cdk",
    "title": "CDK app — Secure IDE Gateway Tool (Figma)",
    "desc": "CDK TypeScript app that deploys the serverless OAuth proxy and AgentCore Gateway for this sample. See DEPLOYMENT.md for the full deployment guide and ../README.md for the architecture.",
    "sectionId": "gateway",
    "kind": "workshop",
    "frameworks": [],
    "languages": [
      "typescript"
    ],
    "hasNotebook": false,
    "readme": "/agentcore-samples/06-workshops/02-AgentCore-gateway/04-integration/06-secure-ide-gateway-tool/cdk/README.md",
    "base": "/agentcore-samples/06-workshops/02-AgentCore-gateway/04-integration/06-secure-ide-gateway-tool/cdk",
    "files": [
      {
        "path": "DEPLOYMENT.md",
        "lang": "markdown",
        "bytes": 6022
      },
      {
        "path": "bin/cdk.ts",
        "lang": "typescript",
        "bytes": 897
      },
      {
        "path": "cdk.json",
        "lang": "json",
        "bytes": 5598
      },
      {
        "path": "cdk_out.json",
        "lang": "json",
        "bytes": 0
      },
      {
        "path": "lib/cdk-stack.ts",
        "lang": "typescript",
        "bytes": 25354
      },
      {
        "path": "package.json",
        "lang": "json",
        "bytes": 369
      },
      {
        "path": "tsconfig.json",
        "lang": "json",
        "bytes": 712
      }
    ]
  },
  {
    "slug": "06-workshops/02-AgentCore-gateway/05-mcp-server-as-a-target",
    "title": "Integrate your MCP Server with AgentCore Gateway",
    "desc": "Amazon Bedrock AgentCore Gateway supports MCP servers as native targets alongside REST APIs and AWS Lambda functions. This lets you integrate existing MCP server implementations through one...",
    "sectionId": "gateway",
    "kind": "workshop",
    "frameworks": [
      "Strands"
    ],
    "languages": [
      "python"
    ],
    "hasNotebook": true,
    "readme": "/agentcore-samples/06-workshops/02-AgentCore-gateway/05-mcp-server-as-a-target/README.md",
    "base": "/agentcore-samples/06-workshops/02-AgentCore-gateway/05-mcp-server-as-a-target",
    "files": [
      {
        "path": "01-mcp-server-target.md",
        "lang": "markdown",
        "bytes": 25742,
        "fromNotebook": true
      },
      {
        "path": "02-mcp-target-synchronization.md",
        "lang": "markdown",
        "bytes": 24095,
        "fromNotebook": true
      },
      {
        "path": "04-streaming.md",
        "lang": "markdown",
        "bytes": 16414,
        "fromNotebook": true
      },
      {
        "path": "05-session-management.md",
        "lang": "markdown",
        "bytes": 16080,
        "fromNotebook": true
      },
      {
        "path": "06-elicitation.md",
        "lang": "markdown",
        "bytes": 16610,
        "fromNotebook": true
      },
      {
        "path": "cloudformation/cognito-signup-stack.yaml",
        "lang": "yaml",
        "bytes": 11845
      },
      {
        "path": "gateway_mcp_client.py",
        "lang": "python",
        "bytes": 16093
      },
      {
        "path": "lambda-intercept.py",
        "lang": "python",
        "bytes": 4113
      },
      {
        "path": "mcpservers/README.md",
        "lang": "markdown",
        "bytes": 4120
      },
      {
        "path": "mcpservers/agentcore/.cli/deployed-state.json",
        "lang": "json",
        "bytes": 19
      },
      {
        "path": "mcpservers/agentcore/agentcore.json",
        "lang": "json",
        "bytes": 452
      },
      {
        "path": "mcpservers/app/labelicitation/main.py",
        "lang": "python",
        "bytes": 8830
      },
      {
        "path": "mcpservers/app/labelicitation/pyproject.toml",
        "lang": "toml",
        "bytes": 306
      },
      {
        "path": "mcpservers/app/labmcp/main.py",
        "lang": "python",
        "bytes": 2404
      },
      {
        "path": "mcpservers/app/labmcp/pyproject.toml",
        "lang": "toml",
        "bytes": 295
      },
      {
        "path": "mcpservers/app/labstateful/main.py",
        "lang": "python",
        "bytes": 16683
      },
      {
        "path": "mcpservers/app/labstateful/pyproject.toml",
        "lang": "toml",
        "bytes": 303
      },
      {
        "path": "mcpservers/app/labstream/main.py",
        "lang": "python",
        "bytes": 3007
      },
      {
        "path": "mcpservers/app/labstream/pyproject.toml",
        "lang": "toml",
        "bytes": 301
      },
      {
        "path": "mcpservers/app/labsync/main.py",
        "lang": "python",
        "bytes": 436
      },
      {
        "path": "mcpservers/app/labsync/pyproject.toml",
        "lang": "toml",
        "bytes": 296
      },
      {
        "path": "requirements.txt",
        "lang": "text",
        "bytes": 59
      },
      {
        "path": "ruff.toml",
        "lang": "toml",
        "bytes": 408
      },
      {
        "path": "utils.py",
        "lang": "python",
        "bytes": 12895
      }
    ]
  },
  {
    "slug": "06-workshops/02-AgentCore-gateway/05-mcp-server-as-a-target/03-authorization-code-flow",
    "title": "Amazon Bedrock AgentCore Gateway - Authorization Code Flow Examples",
    "desc": "This repository contains step-by-step Jupyter notebooks demonstrating how to connect remote MCP servers to Amazon Bedrock AgentCore Gateway using the OAuth 2.0 Authorization Code Grant flow.",
    "sectionId": "gateway",
    "kind": "workshop",
    "frameworks": [],
    "languages": [
      "python"
    ],
    "hasNotebook": true,
    "readme": "/agentcore-samples/06-workshops/02-AgentCore-gateway/05-mcp-server-as-a-target/03-authorization-code-flow/README.md",
    "base": "/agentcore-samples/06-workshops/02-AgentCore-gateway/05-mcp-server-as-a-target/03-authorization-code-flow",
    "files": [
      {
        "path": "LICENSE.txt",
        "lang": "text",
        "bytes": 10142
      },
      {
        "path": "flows/implicit-sync-diagram.md",
        "lang": "markdown",
        "bytes": 1498
      },
      {
        "path": "flows/invoke-tool-diagram.md",
        "lang": "markdown",
        "bytes": 2062
      },
      {
        "path": "flows/schema-upfront-diagram.md",
        "lang": "markdown",
        "bytes": 677
      },
      {
        "path": "github-mcp-server.md",
        "lang": "markdown",
        "bytes": 24267,
        "fromNotebook": true
      },
      {
        "path": "requirements.txt",
        "lang": "text",
        "bytes": 42
      },
      {
        "path": "schema/github.json",
        "lang": "json",
        "bytes": 2594
      },
      {
        "path": "utils/callback_server.py",
        "lang": "python",
        "bytes": 2650
      },
      {
        "path": "utils/policy.json",
        "lang": "json",
        "bytes": 2300
      },
      {
        "path": "utils/utils.py",
        "lang": "python",
        "bytes": 15532
      }
    ]
  },
  {
    "slug": "06-workshops/02-AgentCore-gateway/05-mcp-server-as-a-target/mcpservers/agentcore/.llm-context",
    "title": "LLM Context Files",
    "desc": "DO NOT EDIT THESE FILES - They are read-only reference for AI coding assistants.",
    "sectionId": "gateway",
    "kind": "workshop",
    "frameworks": [
      "OpenAI Agents"
    ],
    "languages": [
      "typescript"
    ],
    "hasNotebook": false,
    "readme": "/agentcore-samples/06-workshops/02-AgentCore-gateway/05-mcp-server-as-a-target/mcpservers/agentcore/.llm-context/README.md",
    "base": "/agentcore-samples/06-workshops/02-AgentCore-gateway/05-mcp-server-as-a-target/mcpservers/agentcore/.llm-context",
    "files": [
      {
        "path": "agentcore.ts",
        "lang": "typescript",
        "bytes": 19614
      },
      {
        "path": "aws-targets.ts",
        "lang": "typescript",
        "bytes": 2039
      }
    ]
  },
  {
    "slug": "06-workshops/02-AgentCore-gateway/05-mcp-server-as-a-target/mcpservers/agentcore/cdk",
    "title": "AgentCore CDK Project",
    "desc": "This CDK project is managed by the AgentCore CLI. It deploys your agent infrastructure into AWS using the @aws/agentcore-cdk L3 constructs.",
    "sectionId": "gateway",
    "kind": "workshop",
    "frameworks": [],
    "languages": [
      "javascript",
      "typescript"
    ],
    "hasNotebook": false,
    "readme": "/agentcore-samples/06-workshops/02-AgentCore-gateway/05-mcp-server-as-a-target/mcpservers/agentcore/cdk/README.md",
    "base": "/agentcore-samples/06-workshops/02-AgentCore-gateway/05-mcp-server-as-a-target/mcpservers/agentcore/cdk",
    "files": [
      {
        "path": "bin/cdk.ts",
        "lang": "typescript",
        "bytes": 3166
      },
      {
        "path": "cdk.json",
        "lang": "json",
        "bytes": 5487
      },
      {
        "path": "jest.config.js",
        "lang": "javascript",
        "bytes": 225
      },
      {
        "path": "package.json",
        "lang": "json",
        "bytes": 672
      },
      {
        "path": "test/cdk.test.ts",
        "lang": "typescript",
        "bytes": 785
      },
      {
        "path": "tsconfig.json",
        "lang": "json",
        "bytes": 770
      }
    ]
  },
  {
    "slug": "06-workshops/02-AgentCore-gateway/05-mcp-server-as-a-target/mcpservers/app/labsession",
    "title": "lab1",
    "desc": "An MCP (Model Context Protocol) server deployed on Amazon Bedrock AgentCore.",
    "sectionId": "gateway",
    "kind": "workshop",
    "frameworks": [],
    "languages": [
      "python"
    ],
    "hasNotebook": false,
    "readme": "/agentcore-samples/06-workshops/02-AgentCore-gateway/05-mcp-server-as-a-target/mcpservers/app/labsession/README.md",
    "base": "/agentcore-samples/06-workshops/02-AgentCore-gateway/05-mcp-server-as-a-target/mcpservers/app/labsession",
    "files": [
      {
        "path": "main.py",
        "lang": "python",
        "bytes": 2088
      },
      {
        "path": "pyproject.toml",
        "lang": "toml",
        "bytes": 302
      }
    ]
  },
  {
    "slug": "06-workshops/02-AgentCore-gateway/06-gateway-observability",
    "title": "Configure Observability for AgentCore Gateway with Amazon CloudWatch and AWS CloudTrail",
    "desc": "AgentCore Gateway Observability Tutorial",
    "sectionId": "gateway",
    "kind": "workshop",
    "frameworks": [],
    "languages": [],
    "hasNotebook": true,
    "readme": "/agentcore-samples/06-workshops/02-AgentCore-gateway/06-gateway-observability/README.md",
    "base": "/agentcore-samples/06-workshops/02-AgentCore-gateway/06-gateway-observability",
    "files": [
      {
        "path": "01-gateway-observability.md",
        "lang": "markdown",
        "bytes": 59599,
        "fromNotebook": true
      },
      {
        "path": "requirements.txt",
        "lang": "text",
        "bytes": 96
      }
    ]
  },
  {
    "slug": "06-workshops/02-AgentCore-gateway/07-bearer-token-injection",
    "title": "Bearer Token Injection",
    "desc": "",
    "sectionId": "gateway",
    "kind": "workshop",
    "frameworks": [],
    "languages": [
      "python"
    ],
    "hasNotebook": true,
    "readme": null,
    "base": "/agentcore-samples/06-workshops/02-AgentCore-gateway/07-bearer-token-injection",
    "files": [
      {
        "path": "01-bearer-token-injection.md",
        "lang": "markdown",
        "bytes": 9859,
        "fromNotebook": true
      },
      {
        "path": "clean_up.sh",
        "lang": "bash",
        "bytes": 3172
      },
      {
        "path": "prerequisites/agentcore-components/agentcore_gateway_creation.py",
        "lang": "python",
        "bytes": 9399
      },
      {
        "path": "prerequisites/agentcore-components/cognito.yaml",
        "lang": "yaml",
        "bytes": 12855
      },
      {
        "path": "prerequisites/agentcore-components/infrastructure_all.yaml",
        "lang": "yaml",
        "bytes": 23755
      },
      {
        "path": "prerequisites/agentcore-components/prereq.sh",
        "lang": "bash",
        "bytes": 2335
      },
      {
        "path": "prerequisites/openapi-spec/openapi_simple.json",
        "lang": "json",
        "bytes": 1983
      },
      {
        "path": "requirements.txt",
        "lang": "text",
        "bytes": 221
      },
      {
        "path": "security_config.py",
        "lang": "python",
        "bytes": 6733
      },
      {
        "path": "utils.py",
        "lang": "python",
        "bytes": 6990
      }
    ]
  },
  {
    "slug": "06-workshops/02-AgentCore-gateway/08-custom-header-propagation",
    "title": "Custom Header and Query Parameter Propagation with AgentCore Gateway",
    "desc": "Modern enterprise agent systems require passing contextual information through API calls for distributed tracing, multi-tenant isolation, API versioning, and rate limiting. AgentCore Gateway...",
    "sectionId": "gateway",
    "kind": "workshop",
    "frameworks": [
      "Strands"
    ],
    "languages": [],
    "hasNotebook": true,
    "readme": "/agentcore-samples/06-workshops/02-AgentCore-gateway/08-custom-header-propagation/README.md",
    "base": "/agentcore-samples/06-workshops/02-AgentCore-gateway/08-custom-header-propagation",
    "files": [
      {
        "path": "gateway-interceptor-header-propagation.md",
        "lang": "markdown",
        "bytes": 28241,
        "fromNotebook": true
      },
      {
        "path": "requirements.txt",
        "lang": "text",
        "bytes": 103
      }
    ]
  },
  {
    "slug": "06-workshops/02-AgentCore-gateway/09-fine-grained-access-control",
    "title": "Fine-Grained Access Control with AgentCore Gateway Interceptors using JWT scopes.",
    "desc": "Modern enterprise agent systems often expose multiple tools—search, retrieval, order systems, analytics, document pipelines, and more. Not all users should be allowed to access every tool, and...",
    "sectionId": "gateway",
    "kind": "workshop",
    "frameworks": [
      "Strands"
    ],
    "languages": [
      "python"
    ],
    "hasNotebook": true,
    "readme": "/agentcore-samples/06-workshops/02-AgentCore-gateway/09-fine-grained-access-control/README.md",
    "base": "/agentcore-samples/06-workshops/02-AgentCore-gateway/09-fine-grained-access-control",
    "files": [
      {
        "path": "01-fine-grained-access-control-using-custom-scopes.md",
        "lang": "markdown",
        "bytes": 50358,
        "fromNotebook": true
      },
      {
        "path": "02-fine-grained-access-control-using-data-store/02-fine-grained-access-control-using-data-store.md",
        "lang": "markdown",
        "bytes": 27512,
        "fromNotebook": true
      },
      {
        "path": "02-fine-grained-access-control-using-data-store/requirements.txt",
        "lang": "text",
        "bytes": 471
      },
      {
        "path": "02-fine-grained-access-control-using-data-store/src/lambda/lambda_function.py",
        "lang": "python",
        "bytes": 10949
      },
      {
        "path": "02-fine-grained-access-control-using-data-store/src/tools/calculation_tool.py",
        "lang": "python",
        "bytes": 6680
      },
      {
        "path": "02-fine-grained-access-control-using-data-store/src/tools/database_query_tool.py",
        "lang": "python",
        "bytes": 5515
      },
      {
        "path": "02-fine-grained-access-control-using-data-store/src/tools/file_handler_tool.py",
        "lang": "python",
        "bytes": 8153
      },
      {
        "path": "02-fine-grained-access-control-using-data-store/src/tools/search_tool.py",
        "lang": "python",
        "bytes": 7532
      },
      {
        "path": "02-fine-grained-access-control-using-data-store/src/tools/weather_tool.py",
        "lang": "python",
        "bytes": 2611
      },
      {
        "path": "requirements.txt",
        "lang": "text",
        "bytes": 93
      },
      {
        "path": "requirements_lambda.txt",
        "lang": "text",
        "bytes": 18
      }
    ]
  },
  {
    "slug": "06-workshops/02-AgentCore-gateway/11-api-gateway-as-a-target",
    "title": "Integrate your API Gateway as an AgentCore Gateway Target",
    "desc": "As organizations explore the possibilities of agentic applications, they continue to navigate challenges of using enterprise data as context in invocation requests to large language models (LLMs)...",
    "sectionId": "gateway",
    "kind": "workshop",
    "frameworks": [
      "Strands"
    ],
    "languages": [
      "python"
    ],
    "hasNotebook": true,
    "readme": "/agentcore-samples/06-workshops/02-AgentCore-gateway/11-api-gateway-as-a-target/README.md",
    "base": "/agentcore-samples/06-workshops/02-AgentCore-gateway/11-api-gateway-as-a-target",
    "files": [
      {
        "path": "01-api-gateway-target.md",
        "lang": "markdown",
        "bytes": 25714,
        "fromNotebook": true
      },
      {
        "path": "AgentCore_Sample_API-dev-oas30-apigateway.json",
        "lang": "json",
        "bytes": 6566
      },
      {
        "path": "requirements.txt",
        "lang": "text",
        "bytes": 200
      },
      {
        "path": "utils.py",
        "lang": "python",
        "bytes": 40693
      }
    ]
  },
  {
    "slug": "06-workshops/02-AgentCore-gateway/12-agents-as-tools-using-mcp",
    "title": "AWS re:Invent 2025 AIML301: Build End-to-End SRE Usecase with Bedrock AgentCore",
    "desc": "This workshop demonstrates how Site Reliability Engineers (SREs) can leverage Amazon Bedrock AgentCore to automate incident response, from diagnostics through remediation to prevention.",
    "sectionId": "gateway",
    "kind": "workshop",
    "frameworks": [
      "Strands"
    ],
    "languages": [
      "python"
    ],
    "hasNotebook": true,
    "readme": "/agentcore-samples/06-workshops/02-AgentCore-gateway/12-agents-as-tools-using-mcp/README.md",
    "base": "/agentcore-samples/06-workshops/02-AgentCore-gateway/12-agents-as-tools-using-mcp",
    "files": [
      {
        "path": "Lab-01-prerequisites-infra.md",
        "lang": "markdown",
        "bytes": 17044,
        "fromNotebook": true
      },
      {
        "path": "Lab-02-diagnostics-agent.md",
        "lang": "markdown",
        "bytes": 38508,
        "fromNotebook": true
      },
      {
        "path": "Lab-03a-remediation-agent.md",
        "lang": "markdown",
        "bytes": 63082,
        "fromNotebook": true
      },
      {
        "path": "Lab-03b-remediation-agent-fgac.md",
        "lang": "markdown",
        "bytes": 32822,
        "fromNotebook": true
      },
      {
        "path": "Lab-04-prevention-agent.md",
        "lang": "markdown",
        "bytes": 37642,
        "fromNotebook": true
      },
      {
        "path": "Lab-05-multi-agent-orchestration.md",
        "lang": "markdown",
        "bytes": 28538,
        "fromNotebook": true
      },
      {
        "path": "lab_helpers/__init__.py",
        "lang": "python",
        "bytes": 170
      },
      {
        "path": "lab_helpers/cognito_setup.py",
        "lang": "python",
        "bytes": 26349
      },
      {
        "path": "lab_helpers/config.py",
        "lang": "python",
        "bytes": 1403
      },
      {
        "path": "lab_helpers/constants.py",
        "lang": "python",
        "bytes": 8207
      },
      {
        "path": "lab_helpers/diagnostic_tools.py",
        "lang": "python",
        "bytes": 10299
      },
      {
        "path": "lab_helpers/jwt_helper.py",
        "lang": "python",
        "bytes": 2330
      },
      {
        "path": "lab_helpers/lab_01/__init__.py",
        "lang": "python",
        "bytes": 696
      },
      {
        "path": "lab_helpers/lab_01/fault_injection.py",
        "lang": "python",
        "bytes": 15146
      },
      {
        "path": "lab_helpers/lab_01/infrastructure.py",
        "lang": "python",
        "bytes": 8170
      },
      {
        "path": "lab_helpers/lab_01/ssm_helper.py",
        "lang": "python",
        "bytes": 3075
      },
      {
        "path": "lab_helpers/lab_02/__init__.py",
        "lang": "python",
        "bytes": 60
      },
      {
        "path": "lab_helpers/lab_02/cleanup.py",
        "lang": "python",
        "bytes": 14322
      },
      {
        "path": "lab_helpers/lab_02/deploy.sh",
        "lang": "bash",
        "bytes": 10135
      },
      {
        "path": "lab_helpers/lab_02/diagnostics_handler.py",
        "lang": "python",
        "bytes": 7966
      },
      {
        "path": "lab_helpers/lab_02/gateway_setup.py",
        "lang": "python",
        "bytes": 5048
      },
      {
        "path": "lab_helpers/lab_02/lambda_deployer.py",
        "lang": "python",
        "bytes": 15313
      },
      {
        "path": "lab_helpers/lab_02/lambda_packager.py",
        "lang": "python",
        "bytes": 25344
      },
      {
        "path": "lab_helpers/lab_02/mcp_client.py",
        "lang": "python",
        "bytes": 8189
      },
      {
        "path": "lab_helpers/lab_03/__init__.py",
        "lang": "python",
        "bytes": 691
      },
      {
        "path": "lab_helpers/lab_03/agentcore_runtime_deployer.py",
        "lang": "python",
        "bytes": 23559
      },
      {
        "path": "lab_helpers/lab_03/app_arch.txt",
        "lang": "text",
        "bytes": 6960
      },
      {
        "path": "lab_helpers/lab_03/cleanup.py",
        "lang": "python",
        "bytes": 29392
      },
      {
        "path": "lab_helpers/lab_03/cleanup_lab_03b.py",
        "lang": "python",
        "bytes": 4571
      },
      {
        "path": "lab_helpers/lab_03/code_interpreter_permissions_policy.json",
        "lang": "json",
        "bytes": 1937
      },
      {
        "path": "lab_helpers/lab_03/configure_logging.py",
        "lang": "python",
        "bytes": 12703
      },
      {
        "path": "lab_helpers/lab_03/custom_runtime_permissions.json",
        "lang": "json",
        "bytes": 4566
      },
      {
        "path": "lab_helpers/lab_03/custom_runtime_trust_policy.json",
        "lang": "json",
        "bytes": 434
      },
      {
        "path": "lab_helpers/lab_03/gateway_setup.py",
        "lang": "python",
        "bytes": 21632
      },
      {
        "path": "lab_helpers/lab_03/interceptor-request.py",
        "lang": "python",
        "bytes": 7202
      },
      {
        "path": "lab_helpers/lab_03/interceptor_deployer.py",
        "lang": "python",
        "bytes": 3098
      },
      {
        "path": "lab_helpers/lab_03/jwt_helper.py",
        "lang": "python",
        "bytes": 1837
      },
      {
        "path": "lab_helpers/lab_03/mcp_client.py",
        "lang": "python",
        "bytes": 8225
      },
      {
        "path": "lab_helpers/lab_03/oauth2_setup.py",
        "lang": "python",
        "bytes": 16307
      },
      {
        "path": "lab_helpers/lab_03/runtime_mcp_agent_code.py",
        "lang": "python",
        "bytes": 31537
      },
      {
        "path": "lab_helpers/lab_03/runtime_oauth2_config.py",
        "lang": "python",
        "bytes": 17789
      },
      {
        "path": "lab_helpers/lab_04/__init__.py",
        "lang": "python",
        "bytes": 406
      },
      {
        "path": "lab_helpers/lab_04/agentcore_runtime_deployer.py",
        "lang": "python",
        "bytes": 26071
      },
      {
        "path": "lab_helpers/lab_04/cleanup.py",
        "lang": "python",
        "bytes": 25484
      },
      {
        "path": "lab_helpers/lab_04/configure_logging.py",
        "lang": "python",
        "bytes": 12703
      },
      {
        "path": "lab_helpers/lab_04/gateway_setup.py",
        "lang": "python",
        "bytes": 21098
      },
      {
        "path": "lab_helpers/lab_04/mcp_client.py",
        "lang": "python",
        "bytes": 8118
      },
      {
        "path": "lab_helpers/lab_04/runtime_mcp_agent_code.py",
        "lang": "python",
        "bytes": 9121
      },
      {
        "path": "lab_helpers/lab_05/__init__.py",
        "lang": "python",
        "bytes": 1098
      },
      {
        "path": "lab_helpers/lab_05/cleanup.py",
        "lang": "python",
        "bytes": 8624
      },
      {
        "path": "lab_helpers/lab_05/iam_setup.py",
        "lang": "python",
        "bytes": 9676
      },
      {
        "path": "lab_helpers/lab_05/local_supervisor_agent.py",
        "lang": "python",
        "bytes": 5137
      },
      {
        "path": "lab_helpers/lab_05/streamlit_app.py",
        "lang": "python",
        "bytes": 16599
      },
      {
        "path": "lab_helpers/lab_05/supervisor_agent_code.py",
        "lang": "python",
        "bytes": 13973
      },
      {
        "path": "lab_helpers/lab_05/supervisor_prompt.py",
        "lang": "python",
        "bytes": 6815
      },
      {
        "path": "lab_helpers/mock_data.py",
        "lang": "python",
        "bytes": 9864
      },
      {
        "path": "lab_helpers/parameter_store.py",
        "lang": "python",
        "bytes": 10427
      },
      {
        "path": "lab_helpers/short_term_memory.py",
        "lang": "python",
        "bytes": 9958
      },
      {
        "path": "requirements.txt",
        "lang": "text",
        "bytes": 675
      }
    ]
  },
  {
    "slug": "06-workshops/02-AgentCore-gateway/14-token-exchange-at-request-interceptor",
    "title": "Token Exchange At Request Interceptor",
    "desc": "",
    "sectionId": "gateway",
    "kind": "workshop",
    "frameworks": [
      "Strands"
    ],
    "languages": [
      "python"
    ],
    "hasNotebook": true,
    "readme": null,
    "base": "/agentcore-samples/06-workshops/02-AgentCore-gateway/14-token-exchange-at-request-interceptor",
    "files": [
      {
        "path": "demo.py",
        "lang": "python",
        "bytes": 15890
      },
      {
        "path": "pyproject.toml",
        "lang": "toml",
        "bytes": 241
      },
      {
        "path": "token-exchange-at-request-interceptor.md",
        "lang": "markdown",
        "bytes": 41404,
        "fromNotebook": true
      }
    ]
  },
  {
    "slug": "06-workshops/02-AgentCore-gateway/14-token-exchange-at-request-interceptor/terraform",
    "title": "AgentCore Gateway with Token Exchange at Request Interceptor - Terraform",
    "desc": "This Terraform configuration provisions the same infrastructure as the companion Jupyter notebook (token-exchange-at-request-interceptor.ipynb), enabling secure token exchange and identity...",
    "sectionId": "gateway",
    "kind": "workshop",
    "frameworks": [
      "Strands"
    ],
    "languages": [
      "hcl",
      "python"
    ],
    "hasNotebook": false,
    "readme": "/agentcore-samples/06-workshops/02-AgentCore-gateway/14-token-exchange-at-request-interceptor/terraform/README.md",
    "base": "/agentcore-samples/06-workshops/02-AgentCore-gateway/14-token-exchange-at-request-interceptor/terraform",
    "files": [
      {
        "path": "agentcore.tf",
        "lang": "hcl",
        "bytes": 4424
      },
      {
        "path": "apigateway.tf",
        "lang": "hcl",
        "bytes": 4174
      },
      {
        "path": "cognito.tf",
        "lang": "hcl",
        "bytes": 4120
      },
      {
        "path": "data.tf",
        "lang": "hcl",
        "bytes": 423
      },
      {
        "path": "lambda.tf",
        "lang": "hcl",
        "bytes": 3678
      },
      {
        "path": "lambda_src/gateway_interceptor/lambda_function.py",
        "lang": "python",
        "bytes": 3194
      },
      {
        "path": "lambda_src/pre_token_generation/lambda_function.py",
        "lang": "python",
        "bytes": 1181
      },
      {
        "path": "outputs.tf",
        "lang": "hcl",
        "bytes": 3056
      },
      {
        "path": "providers.tf",
        "lang": "hcl",
        "bytes": 430
      },
      {
        "path": "variables.tf",
        "lang": "hcl",
        "bytes": 225
      }
    ]
  },
  {
    "slug": "06-workshops/02-AgentCore-gateway/15-prevent-sql-injection",
    "title": "Preventing SQL Injection Attacks with Amazon Bedrock AgentCore Gateway Interceptors",
    "desc": "Modern AI agent systems often interact with databases to retrieve, update, or analyze data. When agents dynamically generate queries or accept user inputs that influence database operations, SQL...",
    "sectionId": "gateway",
    "kind": "workshop",
    "frameworks": [],
    "languages": [
      "python"
    ],
    "hasNotebook": true,
    "readme": "/agentcore-samples/06-workshops/02-AgentCore-gateway/15-prevent-sql-injection/README.md",
    "base": "/agentcore-samples/06-workshops/02-AgentCore-gateway/15-prevent-sql-injection",
    "files": [
      {
        "path": "01-prevent-sql-injection-with-interceptor.md",
        "lang": "markdown",
        "bytes": 27307,
        "fromNotebook": true
      },
      {
        "path": "requirements.txt",
        "lang": "text",
        "bytes": 102
      },
      {
        "path": "src/lambda/lambda_function.py",
        "lang": "python",
        "bytes": 8262
      },
      {
        "path": "src/tools/customer_query_tool.py",
        "lang": "python",
        "bytes": 4654
      }
    ]
  },
  {
    "slug": "06-workshops/02-AgentCore-gateway/16-vpc-egress",
    "title": "Configure Amazon Bedrock AgentCore Gateway VPC Egress for Gateway Targets using VPC Lattice",
    "desc": "Learn about connecting private resources in your VPC using Amazon VPC Lattice and configuring Amazon Bedrock AgentCore Gateway VPC Egress for Gateway Targets.",
    "sectionId": "gateway",
    "kind": "workshop",
    "frameworks": [],
    "languages": [
      "javascript",
      "python",
      "typescript"
    ],
    "hasNotebook": false,
    "readme": "/agentcore-samples/06-workshops/02-AgentCore-gateway/16-vpc-egress/README.md",
    "base": "/agentcore-samples/06-workshops/02-AgentCore-gateway/16-vpc-egress",
    "files": [
      {
        "path": "LICENSE.txt",
        "lang": "text",
        "bytes": 10142
      },
      {
        "path": "bin/vpcegress.ts",
        "lang": "typescript",
        "bytes": 6548
      },
      {
        "path": "cdk.json",
        "lang": "json",
        "bytes": 5595
      },
      {
        "path": "docker/fastmcp-mock/requirements.txt",
        "lang": "text",
        "bytes": 13
      },
      {
        "path": "docker/fastmcp-mock/server.py",
        "lang": "python",
        "bytes": 539
      },
      {
        "path": "docker/simple-api/app.py",
        "lang": "python",
        "bytes": 279
      },
      {
        "path": "docker/simple-api/openapi.json",
        "lang": "json",
        "bytes": 2581
      },
      {
        "path": "docker/simple-api/requirements.txt",
        "lang": "text",
        "bytes": 33
      },
      {
        "path": "docker/stock-mcp-mock/requirements.txt",
        "lang": "text",
        "bytes": 29
      },
      {
        "path": "docker/stock-mcp-mock/server.py",
        "lang": "python",
        "bytes": 2012
      },
      {
        "path": "jest.config.js",
        "lang": "javascript",
        "bytes": 224
      },
      {
        "path": "lib/private-cert-backend-stack.ts",
        "lang": "typescript",
        "bytes": 16542
      },
      {
        "path": "lib/private-domain-stack.ts",
        "lang": "typescript",
        "bytes": 7457
      },
      {
        "path": "lib/public-cert-proxy-stack.ts",
        "lang": "typescript",
        "bytes": 3537
      },
      {
        "path": "lib/shared/agentcore-gateway-stack.ts",
        "lang": "typescript",
        "bytes": 3851
      },
      {
        "path": "lib/shared/eks-cluster-stack.ts",
        "lang": "typescript",
        "bytes": 9131
      },
      {
        "path": "lib/shared/private-ca-stack.ts",
        "lang": "typescript",
        "bytes": 1399
      },
      {
        "path": "lib/shared/short-lived-ca-stack.ts",
        "lang": "typescript",
        "bytes": 1668
      },
      {
        "path": "lib/test1-mcp-ecs-stack.ts",
        "lang": "typescript",
        "bytes": 9848
      },
      {
        "path": "lib/test2-mcp-eks-stack.ts",
        "lang": "typescript",
        "bytes": 11379
      },
      {
        "path": "lib/test3-api-eks-stack.ts",
        "lang": "typescript",
        "bytes": 5341
      },
      {
        "path": "lib/test4-private-apigw-stack.ts",
        "lang": "typescript",
        "bytes": 6925
      },
      {
        "path": "lib/test5-private-api-public-cert-stack.ts",
        "lang": "typescript",
        "bytes": 4809
      },
      {
        "path": "lib/test6-public-dns-private-cert-stack.ts",
        "lang": "typescript",
        "bytes": 5082
      },
      {
        "path": "lib/test7-private-dns-private-cert-stack.ts",
        "lang": "typescript",
        "bytes": 8245
      },
      {
        "path": "lib/vpc-peering-stack.ts",
        "lang": "typescript",
        "bytes": 4126
      },
      {
        "path": "lib/vpcegress-stack.ts",
        "lang": "typescript",
        "bytes": 5380
      },
      {
        "path": "package.json",
        "lang": "json",
        "bytes": 632
      },
      {
        "path": "requirements.txt",
        "lang": "text",
        "bytes": 23
      },
      {
        "path": "tsconfig.json",
        "lang": "json",
        "bytes": 712
      },
      {
        "path": "utils/utils.py",
        "lang": "python",
        "bytes": 771
      }
    ]
  },
  {
    "slug": "06-workshops/02-AgentCore-gateway/16-vpc-egress/00-prerequisites",
    "title": "Prerequisites",
    "desc": "This folder contains the setup notebook and reference guides needed before running any of the labs.",
    "sectionId": "gateway",
    "kind": "workshop",
    "frameworks": [],
    "languages": [],
    "hasNotebook": true,
    "readme": "/agentcore-samples/06-workshops/02-AgentCore-gateway/16-vpc-egress/00-prerequisites/README.md",
    "base": "/agentcore-samples/06-workshops/02-AgentCore-gateway/16-vpc-egress/00-prerequisites",
    "files": [
      {
        "path": "00-vpc-gateway-setup.md",
        "lang": "markdown",
        "bytes": 14208,
        "fromNotebook": true
      },
      {
        "path": "create-acm-public-certificate.md",
        "lang": "markdown",
        "bytes": 2640
      },
      {
        "path": "create-private-hosted-zone.md",
        "lang": "markdown",
        "bytes": 2545
      },
      {
        "path": "create-public-dns-record.md",
        "lang": "markdown",
        "bytes": 1445
      },
      {
        "path": "private-certificate-private-domain.md",
        "lang": "markdown",
        "bytes": 2987
      },
      {
        "path": "private-certificate-public-domain.md",
        "lang": "markdown",
        "bytes": 2475
      },
      {
        "path": "public-certificate-private-domain.md",
        "lang": "markdown",
        "bytes": 2842
      },
      {
        "path": "public-certificate-public-domain.md",
        "lang": "markdown",
        "bytes": 1701
      }
    ]
  },
  {
    "slug": "06-workshops/02-AgentCore-gateway/16-vpc-egress/01-managed-vpc-resource",
    "title": "Managed VPC Resource",
    "desc": "Amazon Bedrock AgentCore Gateway creates and manages the VPC Lattice resource gateway and resource configuration on your behalf. You provide your VPC, subnets, and optional security groups —...",
    "sectionId": "gateway",
    "kind": "workshop",
    "frameworks": [],
    "languages": [],
    "hasNotebook": true,
    "readme": "/agentcore-samples/06-workshops/02-AgentCore-gateway/16-vpc-egress/01-managed-vpc-resource/README.md",
    "base": "/agentcore-samples/06-workshops/02-AgentCore-gateway/16-vpc-egress/01-managed-vpc-resource",
    "files": [
      {
        "path": "01-getting-started.md",
        "lang": "markdown",
        "bytes": 10543,
        "fromNotebook": true
      },
      {
        "path": "02-peering.md",
        "lang": "markdown",
        "bytes": 11279,
        "fromNotebook": true
      },
      {
        "path": "openapi-private-apigw.json",
        "lang": "json",
        "bytes": 2448
      }
    ]
  },
  {
    "slug": "06-workshops/02-AgentCore-gateway/16-vpc-egress/02-self-managed-lattice",
    "title": "Self-Managed Amazon VPC Lattice",
    "desc": "You create the VPC Lattice resource gateway and resource configuration yourself, then provide the resource configuration identifier to AgentCore. Use this option for cross-account connectivity, if...",
    "sectionId": "gateway",
    "kind": "workshop",
    "frameworks": [],
    "languages": [],
    "hasNotebook": true,
    "readme": "/agentcore-samples/06-workshops/02-AgentCore-gateway/16-vpc-egress/02-self-managed-lattice/README.md",
    "base": "/agentcore-samples/06-workshops/02-AgentCore-gateway/16-vpc-egress/02-self-managed-lattice",
    "files": [
      {
        "path": "01-getting-started.md",
        "lang": "markdown",
        "bytes": 13818,
        "fromNotebook": true
      },
      {
        "path": "02-cross-account.md",
        "lang": "markdown",
        "bytes": 14871,
        "fromNotebook": true
      },
      {
        "path": "openapi-private-apigw.json",
        "lang": "json",
        "bytes": 2448
      }
    ]
  },
  {
    "slug": "06-workshops/02-AgentCore-gateway/16-vpc-egress/03-advanced-concepts",
    "title": "Advanced Concepts",
    "desc": "This section covers private DNS, private certificates, static IP egress, and the patterns needed to make them work with AgentCore Gateway VPC egress.",
    "sectionId": "gateway",
    "kind": "workshop",
    "frameworks": [],
    "languages": [],
    "hasNotebook": true,
    "readme": "/agentcore-samples/06-workshops/02-AgentCore-gateway/16-vpc-egress/03-advanced-concepts/README.md",
    "base": "/agentcore-samples/06-workshops/02-AgentCore-gateway/16-vpc-egress/03-advanced-concepts",
    "files": [
      {
        "path": "01-private-domain.md",
        "lang": "markdown",
        "bytes": 13157,
        "fromNotebook": true
      },
      {
        "path": "02-private-certificate-authority.md",
        "lang": "markdown",
        "bytes": 27455,
        "fromNotebook": true
      },
      {
        "path": "03-self-signed-certificate.md",
        "lang": "markdown",
        "bytes": 26884,
        "fromNotebook": true
      },
      {
        "path": "04-static-gateway-ip.md",
        "lang": "markdown",
        "bytes": 17755,
        "fromNotebook": true
      },
      {
        "path": "openapi-private.json",
        "lang": "json",
        "bytes": 2448
      }
    ]
  },
  {
    "slug": "06-workshops/02-AgentCore-gateway/16-vpc-egress/04-ecs-deployment",
    "title": "ECS Deployment",
    "desc": "Deploy MCP servers on Amazon ECS and connect them to AgentCore Gateway using VPC egress.",
    "sectionId": "gateway",
    "kind": "workshop",
    "frameworks": [],
    "languages": [],
    "hasNotebook": true,
    "readme": "/agentcore-samples/06-workshops/02-AgentCore-gateway/16-vpc-egress/04-ecs-deployment/README.md",
    "base": "/agentcore-samples/06-workshops/02-AgentCore-gateway/16-vpc-egress/04-ecs-deployment",
    "files": [
      {
        "path": "fargate-mcp-gateway-managed.md",
        "lang": "markdown",
        "bytes": 12612,
        "fromNotebook": true
      }
    ]
  },
  {
    "slug": "06-workshops/02-AgentCore-gateway/16-vpc-egress/05-eks-deployment",
    "title": "EKS Deployment",
    "desc": "Deploy MCP servers and REST APIs on Amazon EKS and connect them to AgentCore Gateway using VPC egress.",
    "sectionId": "gateway",
    "kind": "workshop",
    "frameworks": [],
    "languages": [],
    "hasNotebook": true,
    "readme": "/agentcore-samples/06-workshops/02-AgentCore-gateway/16-vpc-egress/05-eks-deployment/README.md",
    "base": "/agentcore-samples/06-workshops/02-AgentCore-gateway/16-vpc-egress/05-eks-deployment",
    "files": [
      {
        "path": "api-server-gateway-managed.md",
        "lang": "markdown",
        "bytes": 16155,
        "fromNotebook": true
      },
      {
        "path": "mcp-server-gateway-managed.md",
        "lang": "markdown",
        "bytes": 25102,
        "fromNotebook": true
      },
      {
        "path": "openapi.json",
        "lang": "json",
        "bytes": 2581
      }
    ]
  },
  {
    "slug": "06-workshops/02-AgentCore-gateway/18-Outbound_Auth_OBO_Microsoft",
    "title": "OBO Token Exchange with AgentCore Gateway + Microsoft Graph API",
    "desc": "This tutorial demonstrates how to use Amazon Bedrock AgentCore Gateway with On-Behalf-Of (OBO) token exchange to expose Microsoft Graph API endpoints as MCP tools. The agent code contains zero...",
    "sectionId": "gateway",
    "kind": "workshop",
    "frameworks": [
      "Strands"
    ],
    "languages": [
      "python"
    ],
    "hasNotebook": true,
    "readme": "/agentcore-samples/06-workshops/02-AgentCore-gateway/18-Outbound_Auth_OBO_Microsoft/README.md",
    "base": "/agentcore-samples/06-workshops/02-AgentCore-gateway/18-Outbound_Auth_OBO_Microsoft",
    "files": [
      {
        "path": "obo_token_exchange_microsoft.md",
        "lang": "markdown",
        "bytes": 25964,
        "fromNotebook": true
      },
      {
        "path": "requirements.txt",
        "lang": "text",
        "bytes": 108
      },
      {
        "path": "token_callback_server.py",
        "lang": "python",
        "bytes": 6228
      }
    ]
  },
  {
    "slug": "06-workshops/03-AgentCore-identity/07-Outbound_Auth_3LO_ECS_Fargate",
    "title": "Amazon ECS with AgentCore Identity and 3LO",
    "desc": "This sample demonstrates how to build an AI agent on Amazon ECS Fargate that uses Amazon Bedrock AgentCore Identity for the Authorization Code Grant (3-legged OAuth) Flow. The agent can securely...",
    "sectionId": "identity",
    "kind": "workshop",
    "frameworks": [
      "Strands",
      "LangGraph",
      "LangChain"
    ],
    "languages": [
      "python"
    ],
    "hasNotebook": false,
    "readme": "/agentcore-samples/06-workshops/03-AgentCore-identity/07-Outbound_Auth_3LO_ECS_Fargate/README.md",
    "base": "/agentcore-samples/06-workshops/03-AgentCore-identity/07-Outbound_Auth_3LO_ECS_Fargate",
    "files": [
      {
        "path": "app.py",
        "lang": "python",
        "bytes": 934
      },
      {
        "path": "backend/runtime/agent/__init__.py",
        "lang": "python",
        "bytes": 207
      },
      {
        "path": "backend/runtime/agent/agent.py",
        "lang": "python",
        "bytes": 756
      },
      {
        "path": "backend/runtime/agent/tools/__init__.py",
        "lang": "python",
        "bytes": 219
      },
      {
        "path": "backend/runtime/agent/tools/auth.py",
        "lang": "python",
        "bytes": 3741
      },
      {
        "path": "backend/runtime/agent/tools/exceptions.py",
        "lang": "python",
        "bytes": 998
      },
      {
        "path": "backend/runtime/agent/tools/github/__init__.py",
        "lang": "python",
        "bytes": 307
      },
      {
        "path": "backend/runtime/agent/tools/github/config.py",
        "lang": "python",
        "bytes": 689
      },
      {
        "path": "backend/runtime/agent/tools/github/github.py",
        "lang": "python",
        "bytes": 4110
      },
      {
        "path": "backend/runtime/agent/tools/github/models.py",
        "lang": "python",
        "bytes": 1300
      },
      {
        "path": "backend/runtime/app/__init__.py",
        "lang": "python",
        "bytes": 137
      },
      {
        "path": "backend/runtime/app/config.py",
        "lang": "python",
        "bytes": 783
      },
      {
        "path": "backend/runtime/app/dependencies.py",
        "lang": "python",
        "bytes": 1421
      },
      {
        "path": "backend/runtime/app/main.py",
        "lang": "python",
        "bytes": 641
      },
      {
        "path": "backend/runtime/app/models.py",
        "lang": "python",
        "bytes": 394
      },
      {
        "path": "backend/runtime/app/routers/__init__.py",
        "lang": "python",
        "bytes": 125
      },
      {
        "path": "backend/runtime/app/routers/health.py",
        "lang": "python",
        "bytes": 661
      },
      {
        "path": "backend/runtime/app/routers/invocations.py",
        "lang": "python",
        "bytes": 1766
      },
      {
        "path": "backend/runtime/identity.py",
        "lang": "python",
        "bytes": 1126
      },
      {
        "path": "backend/runtime/main.py",
        "lang": "python",
        "bytes": 196
      },
      {
        "path": "backend/runtime/services/__init__.py",
        "lang": "python",
        "bytes": 126
      },
      {
        "path": "backend/runtime/services/agent_service.py",
        "lang": "python",
        "bytes": 2604
      },
      {
        "path": "backend/session_binding/app/__init__.py",
        "lang": "python",
        "bytes": 136
      },
      {
        "path": "backend/session_binding/app/config.py",
        "lang": "python",
        "bytes": 852
      },
      {
        "path": "backend/session_binding/app/main.py",
        "lang": "python",
        "bytes": 736
      },
      {
        "path": "backend/session_binding/app/routers/__init__.py",
        "lang": "python",
        "bytes": 126
      },
      {
        "path": "backend/session_binding/app/routers/health.py",
        "lang": "python",
        "bytes": 566
      },
      {
        "path": "backend/session_binding/app/routers/session_binding.py",
        "lang": "python",
        "bytes": 2238
      },
      {
        "path": "backend/session_binding/app/templates/success.html",
        "lang": "html",
        "bytes": 975
      },
      {
        "path": "backend/session_binding/main.py",
        "lang": "python",
        "bytes": 215
      },
      {
        "path": "backend/shared/__init__.py",
        "lang": "python",
        "bytes": 281
      },
      {
        "path": "backend/shared/alb_auth.py",
        "lang": "python",
        "bytes": 1536
      },
      {
        "path": "cdk.json",
        "lang": "json",
        "bytes": 102
      },
      {
        "path": "cdk/constructs/__init__.py",
        "lang": "python",
        "bytes": 179
      },
      {
        "path": "cdk/constructs/agent.py",
        "lang": "python",
        "bytes": 3942
      },
      {
        "path": "cdk/constructs/compute/__init__.py",
        "lang": "python",
        "bytes": 227
      },
      {
        "path": "cdk/constructs/compute/alb.py",
        "lang": "python",
        "bytes": 1897
      },
      {
        "path": "cdk/constructs/compute/ecs_service.py",
        "lang": "python",
        "bytes": 14557
      },
      {
        "path": "cdk/constructs/networking/__init__.py",
        "lang": "python",
        "bytes": 180
      },
      {
        "path": "cdk/constructs/networking/vpc.py",
        "lang": "python",
        "bytes": 1005
      },
      {
        "path": "cdk/constructs/security/__init__.py",
        "lang": "python",
        "bytes": 221
      },
      {
        "path": "cdk/constructs/security/identity.py",
        "lang": "python",
        "bytes": 2284
      },
      {
        "path": "cdk/constructs/security/waf.py",
        "lang": "python",
        "bytes": 3021
      },
      {
        "path": "cdk/constructs/storage/__init__.py",
        "lang": "python",
        "bytes": 189
      },
      {
        "path": "cdk/constructs/storage/s3.py",
        "lang": "python",
        "bytes": 3041
      },
      {
        "path": "cdk/constructs/storage/storage.py",
        "lang": "python",
        "bytes": 1008
      },
      {
        "path": "cdk/identity_stack.py",
        "lang": "python",
        "bytes": 962
      },
      {
        "path": "cdk/main_stack.py",
        "lang": "python",
        "bytes": 755
      },
      {
        "path": "config.py",
        "lang": "python",
        "bytes": 2924
      },
      {
        "path": "deploy_sample.sh",
        "lang": "bash",
        "bytes": 2869
      },
      {
        "path": "docs/inbound.md",
        "lang": "markdown",
        "bytes": 1858
      },
      {
        "path": "docs/outbound.md",
        "lang": "markdown",
        "bytes": 3148
      },
      {
        "path": "pyproject.toml",
        "lang": "toml",
        "bytes": 1251
      },
      {
        "path": "security_considerations.md",
        "lang": "markdown",
        "bytes": 2680
      },
      {
        "path": "tests/conftest.py",
        "lang": "python",
        "bytes": 4148
      },
      {
        "path": "tests/test_agent.py",
        "lang": "python",
        "bytes": 2762
      },
      {
        "path": "tests/test_session_binding.py",
        "lang": "python",
        "bytes": 2518
      }
    ]
  },
  {
    "slug": "06-workshops/03-AgentCore-identity/08-IDP-examples/EntraID",
    "title": "Microsoft Entra ID Integration with Amazon Bedrock AgentCore",
    "desc": "This repository contains three comprehensive notebooks demonstrating how to integrate Microsoft Entra ID (formerly Azure Active Directory) with Amazon Bedrock AgentCore for various authentication...",
    "sectionId": "identity",
    "kind": "workshop",
    "frameworks": [
      "Strands"
    ],
    "languages": [
      "python"
    ],
    "hasNotebook": true,
    "readme": "/agentcore-samples/06-workshops/03-AgentCore-identity/08-IDP-examples/EntraID/README.md",
    "base": "/agentcore-samples/06-workshops/03-AgentCore-identity/08-IDP-examples/EntraID",
    "files": [
      {
        "path": "1 Entra ID Inbound Auth.md",
        "lang": "markdown",
        "bytes": 12303,
        "fromNotebook": true
      },
      {
        "path": "2 Entra ID with AgentCore Gateway.md",
        "lang": "markdown",
        "bytes": 17643,
        "fromNotebook": true
      },
      {
        "path": "3 Entra ID with AgentCore Gateway Auth Code Flow.md",
        "lang": "markdown",
        "bytes": 24226,
        "fromNotebook": true
      },
      {
        "path": "images/test.txt",
        "lang": "text",
        "bytes": 1
      },
      {
        "path": "oauth2_callback_server.py",
        "lang": "python",
        "bytes": 14712
      },
      {
        "path": "requirements.txt",
        "lang": "text",
        "bytes": 182
      }
    ]
  },
  {
    "slug": "06-workshops/03-AgentCore-identity/08-IDP-examples/Okta",
    "title": "Okta Integration with Amazon Bedrock AgentCore",
    "desc": "This repository contains comprehensive notebooks demonstrating how to integrate Okta with Amazon Bedrock AgentCore for various authentication and authorization scenarios.",
    "sectionId": "identity",
    "kind": "workshop",
    "frameworks": [
      "Strands"
    ],
    "languages": [],
    "hasNotebook": true,
    "readme": "/agentcore-samples/06-workshops/03-AgentCore-identity/08-IDP-examples/Okta/README.md",
    "base": "/agentcore-samples/06-workshops/03-AgentCore-identity/08-IDP-examples/Okta",
    "files": [
      {
        "path": "Step_by_Step_Okta_Integration_for_Gateway_Auth.md",
        "lang": "markdown",
        "bytes": 42967,
        "fromNotebook": true
      },
      {
        "path": "Step_by_Step_Okta_for_Inbound_Auth.md",
        "lang": "markdown",
        "bytes": 23363,
        "fromNotebook": true
      }
    ]
  },
  {
    "slug": "06-workshops/03-AgentCore-identity/08-IDP-examples/PingFederate",
    "title": "Private IdP Connectivity: PingFederate with AgentCore Identity via VPC Lattice",
    "desc": "This sample demonstrates how to connect Amazon Bedrock AgentCore Identity to a privately hosted PingFederate Identity Provider (IdP) using Amazon VPC Lattice, eliminating the need for the IdP to...",
    "sectionId": "identity",
    "kind": "workshop",
    "frameworks": [],
    "languages": [
      "python"
    ],
    "hasNotebook": false,
    "readme": "/agentcore-samples/06-workshops/03-AgentCore-identity/08-IDP-examples/PingFederate/README.md",
    "base": "/agentcore-samples/06-workshops/03-AgentCore-identity/08-IDP-examples/PingFederate",
    "files": [
      {
        "path": "agent/private-idp-ping-agent/AGENTS.md",
        "lang": "markdown",
        "bytes": 6467
      },
      {
        "path": "agent/private-idp-ping-agent/README.md",
        "lang": "markdown",
        "bytes": 4120
      },
      {
        "path": "agent/private-idp-ping-agent/agentcore/agentcore.json",
        "lang": "json",
        "bytes": 966
      },
      {
        "path": "agent/private-idp-ping-agent/app/private-idp-ping-agent/main.py",
        "lang": "python",
        "bytes": 3528
      },
      {
        "path": "agent/private-idp-ping-agent/app/private-idp-ping-agent/pyproject.toml",
        "lang": "toml",
        "bytes": 440
      },
      {
        "path": "app.py",
        "lang": "python",
        "bytes": 1554
      },
      {
        "path": "cdk.json",
        "lang": "json",
        "bytes": 100
      },
      {
        "path": "cleanup_sample.sh",
        "lang": "bash",
        "bytes": 3898
      },
      {
        "path": "config.py",
        "lang": "python",
        "bytes": 1960
      },
      {
        "path": "deploy_sample.sh",
        "lang": "bash",
        "bytes": 12525
      },
      {
        "path": "lambda/configure_pingfed/index.py",
        "lang": "python",
        "bytes": 20193
      },
      {
        "path": "lambda/mcp_echo/index.py",
        "lang": "python",
        "bytes": 2929
      },
      {
        "path": "pyproject.toml",
        "lang": "toml",
        "bytes": 629
      },
      {
        "path": "stacks/__init__.py",
        "lang": "python",
        "bytes": 102
      },
      {
        "path": "stacks/gateway_infra_stack.py",
        "lang": "python",
        "bytes": 1939
      },
      {
        "path": "stacks/lattice_stack.py",
        "lang": "python",
        "bytes": 3808
      },
      {
        "path": "stacks/ping_federate_stack.py",
        "lang": "python",
        "bytes": 12343
      },
      {
        "path": "stacks/vpc_stack.py",
        "lang": "python",
        "bytes": 1732
      }
    ]
  },
  {
    "slug": "06-workshops/03-AgentCore-identity/08-IDP-examples/PingFederate/agent/private-idp-ping-agent/agentcore/.llm-context",
    "title": "LLM Context Files",
    "desc": "DO NOT EDIT THESE FILES - They are read-only reference for AI coding assistants.",
    "sectionId": "identity",
    "kind": "workshop",
    "frameworks": [
      "OpenAI Agents"
    ],
    "languages": [
      "typescript"
    ],
    "hasNotebook": false,
    "readme": "/agentcore-samples/06-workshops/03-AgentCore-identity/08-IDP-examples/PingFederate/agent/private-idp-ping-agent/agentcore/.llm-context/README.md",
    "base": "/agentcore-samples/06-workshops/03-AgentCore-identity/08-IDP-examples/PingFederate/agent/private-idp-ping-agent/agentcore/.llm-context",
    "files": [
      {
        "path": "agentcore.ts",
        "lang": "typescript",
        "bytes": 5263
      },
      {
        "path": "aws-targets.ts",
        "lang": "typescript",
        "bytes": 2039
      }
    ]
  },
  {
    "slug": "06-workshops/03-AgentCore-identity/08-IDP-examples/PingFederate/agent/private-idp-ping-agent/agentcore/cdk",
    "title": "AgentCore CDK Project",
    "desc": "This CDK project is managed by the AgentCore CLI. It deploys your agent infrastructure into AWS using the @aws/agentcore-cdk L3 constructs.",
    "sectionId": "identity",
    "kind": "workshop",
    "frameworks": [],
    "languages": [
      "javascript",
      "typescript"
    ],
    "hasNotebook": false,
    "readme": "/agentcore-samples/06-workshops/03-AgentCore-identity/08-IDP-examples/PingFederate/agent/private-idp-ping-agent/agentcore/cdk/README.md",
    "base": "/agentcore-samples/06-workshops/03-AgentCore-identity/08-IDP-examples/PingFederate/agent/private-idp-ping-agent/agentcore/cdk",
    "files": [
      {
        "path": "bin/cdk.ts",
        "lang": "typescript",
        "bytes": 3166
      },
      {
        "path": "cdk.json",
        "lang": "json",
        "bytes": 5487
      },
      {
        "path": "jest.config.js",
        "lang": "javascript",
        "bytes": 225
      },
      {
        "path": "package.json",
        "lang": "json",
        "bytes": 672
      },
      {
        "path": "test/cdk.test.ts",
        "lang": "typescript",
        "bytes": 785
      },
      {
        "path": "tsconfig.json",
        "lang": "json",
        "bytes": 770
      }
    ]
  },
  {
    "slug": "06-workshops/03-AgentCore-identity/10-runtime-inbound-outbound-auth",
    "title": "AgentCore Identity: Runtime Inbound and Outbound Auth (Cognito)",
    "desc": "This sample shows how to secure an AgentCore Runtime agent with both inbound and outbound authentication using Amazon Cognito as the Identity Provider (IdP).",
    "sectionId": "identity",
    "kind": "workshop",
    "frameworks": [
      "Strands",
      "OpenAI Agents"
    ],
    "languages": [
      "python"
    ],
    "hasNotebook": false,
    "readme": "/agentcore-samples/06-workshops/03-AgentCore-identity/10-runtime-inbound-outbound-auth/README.md",
    "base": "/agentcore-samples/06-workshops/03-AgentCore-identity/10-runtime-inbound-outbound-auth",
    "files": [
      {
        "path": "app/MyAgent/main.py",
        "lang": "python",
        "bytes": 3715
      },
      {
        "path": "app/MyAgent/pyproject.toml",
        "lang": "toml",
        "bytes": 230
      },
      {
        "path": "invoke.py",
        "lang": "python",
        "bytes": 6326
      },
      {
        "path": "requirements.txt",
        "lang": "text",
        "bytes": 32
      },
      {
        "path": "setup_cognito.py",
        "lang": "python",
        "bytes": 2580
      },
      {
        "path": "streamlit_app.py",
        "lang": "python",
        "bytes": 16800
      }
    ]
  },
  {
    "slug": "06-workshops/03-AgentCore-identity/11-gateway-inbound-outbound-auth",
    "title": "AgentCore Identity: Gateway Inbound and Outbound Auth (Cognito)",
    "desc": "This sample shows how to secure an AgentCore Gateway with both inbound and outbound authentication using Amazon Cognito as the Identity Provider.",
    "sectionId": "gateway",
    "kind": "workshop",
    "frameworks": [
      "Strands"
    ],
    "languages": [
      "python"
    ],
    "hasNotebook": false,
    "readme": "/agentcore-samples/06-workshops/03-AgentCore-identity/11-gateway-inbound-outbound-auth/README.md",
    "base": "/agentcore-samples/06-workshops/03-AgentCore-identity/11-gateway-inbound-outbound-auth",
    "files": [
      {
        "path": "app/MyAgent/main.py",
        "lang": "python",
        "bytes": 3502
      },
      {
        "path": "app/MyAgent/pyproject.toml",
        "lang": "toml",
        "bytes": 195
      },
      {
        "path": "configure_inbound_auth.py",
        "lang": "python",
        "bytes": 6849
      },
      {
        "path": "invoke.py",
        "lang": "python",
        "bytes": 5965
      },
      {
        "path": "requirements.txt",
        "lang": "text",
        "bytes": 32
      },
      {
        "path": "setup_cognito.py",
        "lang": "python",
        "bytes": 4400
      },
      {
        "path": "setup_mcp_server.py",
        "lang": "python",
        "bytes": 7685
      },
      {
        "path": "streamlit_app.py",
        "lang": "python",
        "bytes": 16067
      }
    ]
  },
  {
    "slug": "06-workshops/03-AgentCore-identity/12-m2m-3lo-runtime",
    "title": "AgentCore Identity: M2M and Auth Code Flows with Runtime (Cognito)",
    "desc": "This sample demonstrates two outbound OAuth2 flows in a single AgentCore Runtime agent:",
    "sectionId": "identity",
    "kind": "workshop",
    "frameworks": [
      "Strands"
    ],
    "languages": [
      "python"
    ],
    "hasNotebook": false,
    "readme": "/agentcore-samples/06-workshops/03-AgentCore-identity/12-m2m-3lo-runtime/README.md",
    "base": "/agentcore-samples/06-workshops/03-AgentCore-identity/12-m2m-3lo-runtime",
    "files": [
      {
        "path": "app/MyAgent/main.py",
        "lang": "python",
        "bytes": 11196
      },
      {
        "path": "app/MyAgent/pyproject.toml",
        "lang": "toml",
        "bytes": 195
      },
      {
        "path": "configure_inbound_auth.py",
        "lang": "python",
        "bytes": 5307
      },
      {
        "path": "invoke.py",
        "lang": "python",
        "bytes": 9688
      },
      {
        "path": "oauth2_callback_server.py",
        "lang": "python",
        "bytes": 17759
      },
      {
        "path": "requirements.txt",
        "lang": "text",
        "bytes": 142
      },
      {
        "path": "setup_cognito.py",
        "lang": "python",
        "bytes": 4430
      },
      {
        "path": "setup_oauth_providers.py",
        "lang": "python",
        "bytes": 8029
      },
      {
        "path": "streamlit_app.py",
        "lang": "python",
        "bytes": 24489
      }
    ]
  },
  {
    "slug": "06-workshops/03-AgentCore-identity/13-entra-obo-mcp-runtime",
    "title": "Entra ID On-Behalf-Of for an MCP tool on AgentCore Runtime",
    "desc": "A Strands agent running on Amazon Bedrock AgentCore Runtime calls Microsoft Graph on the signed-in user's behalf, via an MCP server deployed as a separate AgentCore Runtime. The agent exchanges...",
    "sectionId": "identity",
    "kind": "workshop",
    "frameworks": [
      "Strands"
    ],
    "languages": [],
    "hasNotebook": true,
    "readme": "/agentcore-samples/06-workshops/03-AgentCore-identity/13-entra-obo-mcp-runtime/README.md",
    "base": "/agentcore-samples/06-workshops/03-AgentCore-identity/13-entra-obo-mcp-runtime",
    "files": [
      {
        "path": "ENTRA_SETUP.md",
        "lang": "markdown",
        "bytes": 14030
      },
      {
        "path": "agent/requirements.txt",
        "lang": "text",
        "bytes": 190
      },
      {
        "path": "mcp/requirements.txt",
        "lang": "text",
        "bytes": 178
      },
      {
        "path": "requirements.txt",
        "lang": "text",
        "bytes": 273
      },
      {
        "path": "runtime_with_entra_id_obo_and_mcp.md",
        "lang": "markdown",
        "bytes": 33986,
        "fromNotebook": true
      }
    ]
  },
  {
    "slug": "06-workshops/04-AgentCore-memory/01-short-term-memory/01-single-agent/with-llamaindex-agent",
    "title": "LlamaIndex with AWS Bedrock AgentCore Memory Integration",
    "desc": "This project showcases enterprise-grade AI agents with persistent memory capabilities, demonstrating how LlamaIndex's ReAct framework integrates seamlessly with AWS Bedrock AgentCore Memory to...",
    "sectionId": "memory",
    "kind": "workshop",
    "frameworks": [
      "LlamaIndex"
    ],
    "languages": [],
    "hasNotebook": true,
    "readme": "/agentcore-samples/06-workshops/04-AgentCore-memory/01-short-term-memory/01-single-agent/with-llamaindex-agent/README.md",
    "base": "/agentcore-samples/06-workshops/04-AgentCore-memory/01-short-term-memory/01-single-agent/with-llamaindex-agent",
    "files": [
      {
        "path": "academic-research-assistant-short-term-memory-tutorial.md",
        "lang": "markdown",
        "bytes": 16229,
        "fromNotebook": true
      },
      {
        "path": "investment-portfolio-advisor-short-term-memory-tutorial.md",
        "lang": "markdown",
        "bytes": 19466,
        "fromNotebook": true
      },
      {
        "path": "legal-document-analyzer-short-term-memory-tutorial.md",
        "lang": "markdown",
        "bytes": 17215,
        "fromNotebook": true
      },
      {
        "path": "medical-knowledge-assistant-short-term-memory-tutorial.md",
        "lang": "markdown",
        "bytes": 18338,
        "fromNotebook": true
      },
      {
        "path": "requirements.txt",
        "lang": "text",
        "bytes": 191
      }
    ]
  },
  {
    "slug": "06-workshops/04-AgentCore-memory/02-long-term-memory/01-single-agent/using-llamaindex-agent-memory-tool",
    "title": "LlamaIndex with AWS Bedrock AgentCore Memory Integration",
    "desc": "This project showcases enterprise-grade AI agents with persistent memory capabilities, demonstrating how LlamaIndex's ReAct framework integrates seamlessly with AWS Bedrock AgentCore Memory to...",
    "sectionId": "memory",
    "kind": "workshop",
    "frameworks": [
      "LlamaIndex"
    ],
    "languages": [],
    "hasNotebook": true,
    "readme": "/agentcore-samples/06-workshops/04-AgentCore-memory/02-long-term-memory/01-single-agent/using-llamaindex-agent-memory-tool/README.md",
    "base": "/agentcore-samples/06-workshops/04-AgentCore-memory/02-long-term-memory/01-single-agent/using-llamaindex-agent-memory-tool",
    "files": [
      {
        "path": "academic-research-assistant-long-term-memory-tutorial.md",
        "lang": "markdown",
        "bytes": 28359,
        "fromNotebook": true
      },
      {
        "path": "investment-portfolio-advisor-long-term-memory-tutorial.md",
        "lang": "markdown",
        "bytes": 30634,
        "fromNotebook": true
      },
      {
        "path": "legal-document-analyzer-long-term-memory-tutorial.md",
        "lang": "markdown",
        "bytes": 30737,
        "fromNotebook": true
      },
      {
        "path": "medical-knowledge-assistant-long-term-memory-tutorial.md",
        "lang": "markdown",
        "bytes": 30865,
        "fromNotebook": true
      },
      {
        "path": "requirements.txt",
        "lang": "text",
        "bytes": 191
      }
    ]
  },
  {
    "slug": "06-workshops/04-AgentCore-memory/02-long-term-memory/01-single-agent/using-strands-agent-hooks/culinary-assistant-self-managed-strategy-with-citations",
    "title": "Culinary Assistant with Self-Managed Memory Strategy (With Citations)",
    "desc": "This sample demonstrates Amazon Bedrock AgentCore's self-managed memory strategy with enhanced citation tracking. This version extends the base culinary assistant example by adding comprehensive...",
    "sectionId": "memory",
    "kind": "workshop",
    "frameworks": [],
    "languages": [
      "python"
    ],
    "hasNotebook": true,
    "readme": "/agentcore-samples/06-workshops/04-AgentCore-memory/02-long-term-memory/01-single-agent/using-strands-agent-hooks/culinary-assistant-self-managed-strategy-with-citations/README.md",
    "base": "/agentcore-samples/06-workshops/04-AgentCore-memory/02-long-term-memory/01-single-agent/using-strands-agent-hooks/culinary-assistant-self-managed-strategy-with-citations",
    "files": [
      {
        "path": "agentcore_self_managed_memory_demo.md",
        "lang": "markdown",
        "bytes": 19708,
        "fromNotebook": true
      },
      {
        "path": "aws_utils.py",
        "lang": "python",
        "bytes": 29073
      },
      {
        "path": "lambda_function.py",
        "lang": "python",
        "bytes": 12101
      },
      {
        "path": "requirements.txt",
        "lang": "text",
        "bytes": 107
      }
    ]
  },
  {
    "slug": "06-workshops/04-AgentCore-memory/02-long-term-memory/01-single-agent/using-strands-agent-hooks/meeting-notes-assistant-using-episodic",
    "title": "AgentCore Memory: Episodic Memory Strategy",
    "desc": "Episodic memory captures meaningful slices of user and system interactions so applications can recall context in a way that feels focused and relevant. Instead of storing every raw event, it...",
    "sectionId": "memory",
    "kind": "workshop",
    "frameworks": [
      "Strands"
    ],
    "languages": [
      "python"
    ],
    "hasNotebook": true,
    "readme": "/agentcore-samples/06-workshops/04-AgentCore-memory/02-long-term-memory/01-single-agent/using-strands-agent-hooks/meeting-notes-assistant-using-episodic/README.md",
    "base": "/agentcore-samples/06-workshops/04-AgentCore-memory/02-long-term-memory/01-single-agent/using-strands-agent-hooks/meeting-notes-assistant-using-episodic",
    "files": [
      {
        "path": "meeting-notes-assistant.md",
        "lang": "markdown",
        "bytes": 21158,
        "fromNotebook": true
      },
      {
        "path": "meeting-notes-assistant.py",
        "lang": "python",
        "bytes": 20995
      },
      {
        "path": "requirements.txt",
        "lang": "text",
        "bytes": 58
      }
    ]
  },
  {
    "slug": "06-workshops/04-AgentCore-memory/02-long-term-memory/02-multi-agent/with-strands-agent/healthcare-assistant-using-episodic",
    "title": "Multi-Agent Healthcare System with Episodic Memory",
    "desc": "Episodic memory captures meaningful interaction slices, identifying important moments and summarizing them into compact, organized records for focused retrieval without noise.",
    "sectionId": "memory",
    "kind": "workshop",
    "frameworks": [
      "Strands"
    ],
    "languages": [],
    "hasNotebook": true,
    "readme": "/agentcore-samples/06-workshops/04-AgentCore-memory/02-long-term-memory/02-multi-agent/with-strands-agent/healthcare-assistant-using-episodic/README.md",
    "base": "/agentcore-samples/06-workshops/04-AgentCore-memory/02-long-term-memory/02-multi-agent/with-strands-agent/healthcare-assistant-using-episodic",
    "files": [
      {
        "path": "healthcare-data-assistant.md",
        "lang": "markdown",
        "bytes": 37454,
        "fromNotebook": true
      },
      {
        "path": "requirements.txt",
        "lang": "text",
        "bytes": 53
      }
    ]
  },
  {
    "slug": "06-workshops/04-AgentCore-memory/03-advanced-patterns/04-memory-browser",
    "title": "AgentCore Memory Dashboard",
    "desc": "A lightweight React + FastAPI dashboard for browsing AWS Bedrock AgentCore Memory data.",
    "sectionId": "browser",
    "kind": "workshop",
    "frameworks": [],
    "languages": [
      "javascript",
      "python"
    ],
    "hasNotebook": false,
    "readme": "/agentcore-samples/06-workshops/04-AgentCore-memory/03-advanced-patterns/04-memory-browser/README.md",
    "base": "/agentcore-samples/06-workshops/04-AgentCore-memory/03-advanced-patterns/04-memory-browser",
    "files": [
      {
        "path": "backend/app.py",
        "lang": "python",
        "bytes": 60015
      },
      {
        "path": "backend/requirements.txt",
        "lang": "text",
        "bytes": 135
      },
      {
        "path": "package.json",
        "lang": "json",
        "bytes": 1240
      },
      {
        "path": "public/index.html",
        "lang": "html",
        "bytes": 557
      },
      {
        "path": "scripts/get-aws-credentials.js",
        "lang": "javascript",
        "bytes": 2964
      },
      {
        "path": "src/App.js",
        "lang": "javascript",
        "bytes": 22067
      },
      {
        "path": "src/components/LongTermMemoryForm.js",
        "lang": "javascript",
        "bytes": 16151
      },
      {
        "path": "src/components/ShortTermMemoryForm.js",
        "lang": "javascript",
        "bytes": 7036
      },
      {
        "path": "src/index.css",
        "lang": "css",
        "bytes": 18929
      },
      {
        "path": "src/index.js",
        "lang": "javascript",
        "bytes": 253
      },
      {
        "path": "start-backend.sh",
        "lang": "bash",
        "bytes": 1444
      }
    ]
  },
  {
    "slug": "06-workshops/04-AgentCore-memory/03-advanced-patterns/06-streaming-for-cross-region-replication",
    "title": "AgentCore Memory Cross-Region Replication",
    "desc": "Active-passive cross-region replication for Amazon Bedrock AgentCore Memory using the memory record streaming feature.",
    "sectionId": "memory",
    "kind": "workshop",
    "frameworks": [],
    "languages": [
      "python"
    ],
    "hasNotebook": true,
    "readme": "/agentcore-samples/06-workshops/04-AgentCore-memory/03-advanced-patterns/06-streaming-for-cross-region-replication/README.md",
    "base": "/agentcore-samples/06-workshops/04-AgentCore-memory/03-advanced-patterns/06-streaming-for-cross-region-replication",
    "files": [
      {
        "path": "06-memory-cross-region-replication.md",
        "lang": "markdown",
        "bytes": 22133,
        "fromNotebook": true
      },
      {
        "path": "requirements.txt",
        "lang": "text",
        "bytes": 15
      },
      {
        "path": "scripts/deploy.sh",
        "lang": "bash",
        "bytes": 6368
      },
      {
        "path": "scripts/global-stack.yaml",
        "lang": "yaml",
        "bytes": 859
      },
      {
        "path": "scripts/handler.py",
        "lang": "python",
        "bytes": 6308
      },
      {
        "path": "scripts/regional-stack.yaml",
        "lang": "yaml",
        "bytes": 5907
      },
      {
        "path": "scripts/toggle-streaming.sh",
        "lang": "bash",
        "bytes": 1516
      }
    ]
  },
  {
    "slug": "06-workshops/04-AgentCore-memory/04-memory-branching",
    "title": "AgentCore Memory: Memory Branching",
    "desc": "Memory branching lets an agent fork a conversation into alternative paths from any prior event, then explore each branch independently before choosing one to continue. Branches share the same...",
    "sectionId": "memory",
    "kind": "workshop",
    "frameworks": [
      "Strands"
    ],
    "languages": [],
    "hasNotebook": true,
    "readme": "/agentcore-samples/06-workshops/04-AgentCore-memory/04-memory-branching/README.md",
    "base": "/agentcore-samples/06-workshops/04-AgentCore-memory/04-memory-branching",
    "files": [
      {
        "path": "multi-agent-parallel-execution-with-memory-branching.md",
        "lang": "markdown",
        "bytes": 33800,
        "fromNotebook": true
      },
      {
        "path": "requirements.txt",
        "lang": "text",
        "bytes": 45
      },
      {
        "path": "travel-planning-agent-with-memory-branching.md",
        "lang": "markdown",
        "bytes": 29430,
        "fromNotebook": true
      }
    ]
  },
  {
    "slug": "06-workshops/05-AgentCore-tools/01-Agent-Core-code-interpreter/01-file-operations-using-code-interpreter",
    "title": "Amazon AgentCore Bedrock Code Interpreter - Getting Started Tutorial",
    "desc": "In this tutorial you will learn how to use AgentCore Bedrock Code Interpreter to:",
    "sectionId": "code-interpreter",
    "kind": "workshop",
    "frameworks": [],
    "languages": [
      "python"
    ],
    "hasNotebook": true,
    "readme": "/agentcore-samples/06-workshops/05-AgentCore-tools/01-Agent-Core-code-interpreter/01-file-operations-using-code-interpreter/README.md",
    "base": "/agentcore-samples/06-workshops/05-AgentCore-tools/01-Agent-Core-code-interpreter/01-file-operations-using-code-interpreter",
    "files": [
      {
        "path": "file-operations-using-code-interpreter.md",
        "lang": "markdown",
        "bytes": 5627,
        "fromNotebook": true
      },
      {
        "path": "requirements.txt",
        "lang": "text",
        "bytes": 24
      },
      {
        "path": "samples/stats.py",
        "lang": "python",
        "bytes": 71
      }
    ]
  },
  {
    "slug": "06-workshops/05-AgentCore-tools/01-Agent-Core-code-interpreter/02-code-execution-with-agent-using-code-interpreter",
    "title": "Agent-Based Code Execution using Amazon AgentCore Bedrock Code Interpreter - Tutorial",
    "desc": "This tutorial demonstrates how to create an AI agent that validates answers through code execution using Python. We will use Amazon Bedrock AgentCore Code Interpreter to run code that is generated...",
    "sectionId": "code-interpreter",
    "kind": "workshop",
    "frameworks": [
      "Strands",
      "LangChain"
    ],
    "languages": [],
    "hasNotebook": true,
    "readme": "/agentcore-samples/06-workshops/05-AgentCore-tools/01-Agent-Core-code-interpreter/02-code-execution-with-agent-using-code-interpreter/README.md",
    "base": "/agentcore-samples/06-workshops/05-AgentCore-tools/01-Agent-Core-code-interpreter/02-code-execution-with-agent-using-code-interpreter",
    "files": [
      {
        "path": "langchain-agent-code-execution-code-interpreter.md",
        "lang": "markdown",
        "bytes": 6606,
        "fromNotebook": true
      },
      {
        "path": "requirements.txt",
        "lang": "text",
        "bytes": 98
      },
      {
        "path": "strands-agent-code-execution-code-interpreter.md",
        "lang": "markdown",
        "bytes": 5950,
        "fromNotebook": true
      }
    ]
  },
  {
    "slug": "06-workshops/05-AgentCore-tools/01-Agent-Core-code-interpreter/03-advanced-data-analysis-with-agent-using-code-interpreter",
    "title": "Advanced Data Analysis using Amazon AgentCore Bedrock Code Interpreter- Tutorial",
    "desc": "This tutorial demonstrates how to create an AI agent that performs advanced data analysis through code execution using Python. We use Amazon Bedrock AgentCore Code Interpreter to run code that is...",
    "sectionId": "code-interpreter",
    "kind": "workshop",
    "frameworks": [
      "Strands",
      "LangChain"
    ],
    "languages": [
      "python"
    ],
    "hasNotebook": true,
    "readme": "/agentcore-samples/06-workshops/05-AgentCore-tools/01-Agent-Core-code-interpreter/03-advanced-data-analysis-with-agent-using-code-interpreter/README.md",
    "base": "/agentcore-samples/06-workshops/05-AgentCore-tools/01-Agent-Core-code-interpreter/03-advanced-data-analysis-with-agent-using-code-interpreter",
    "files": [
      {
        "path": "langchain-agent-advanced-data-analysis-code-interpreter.md",
        "lang": "markdown",
        "bytes": 11039,
        "fromNotebook": true
      },
      {
        "path": "requirements.txt",
        "lang": "text",
        "bytes": 105
      },
      {
        "path": "samples/stats.py",
        "lang": "python",
        "bytes": 71
      },
      {
        "path": "strands-agent-advanced-data-analysis-code-interpreter.md",
        "lang": "markdown",
        "bytes": 10790,
        "fromNotebook": true
      }
    ]
  },
  {
    "slug": "06-workshops/05-AgentCore-tools/01-Agent-Core-code-interpreter/04-run-commands-using-code-interpreter",
    "title": "Running Commands on Amazon Bedrock AgentCore Code Interpreter - Tutorial",
    "desc": "This tutorial demonstrates how to use Amazon Bedrock AgentCore Code Interpreter to run commands (shell and AWS CLI). We will interact with AWS services, specifically focusing on S3 operations....",
    "sectionId": "code-interpreter",
    "kind": "workshop",
    "frameworks": [
      "Strands",
      "LangChain"
    ],
    "languages": [
      "python"
    ],
    "hasNotebook": true,
    "readme": "/agentcore-samples/06-workshops/05-AgentCore-tools/01-Agent-Core-code-interpreter/04-run-commands-using-code-interpreter/README.md",
    "base": "/agentcore-samples/06-workshops/05-AgentCore-tools/01-Agent-Core-code-interpreter/04-run-commands-using-code-interpreter",
    "files": [
      {
        "path": "requirements.txt",
        "lang": "text",
        "bytes": 24
      },
      {
        "path": "run-commands-using-code-interpreter.md",
        "lang": "markdown",
        "bytes": 8852,
        "fromNotebook": true
      },
      {
        "path": "samples/stats.py",
        "lang": "python",
        "bytes": 71
      }
    ]
  },
  {
    "slug": "06-workshops/05-AgentCore-tools/02-Agent-Core-browser-tool/09-browser-with-domain-filtering",
    "title": "AgentCore Browser Tool with AWS Network Firewall",
    "desc": "This example demonstrates how to deploy Amazon Bedrock AgentCore Browser Tool with domain-based allow/deny listing using AWS Network Firewall. This provides a secure, controlled browsing...",
    "sectionId": "browser",
    "kind": "workshop",
    "frameworks": [],
    "languages": [
      "python"
    ],
    "hasNotebook": true,
    "readme": "/agentcore-samples/06-workshops/05-AgentCore-tools/02-Agent-Core-browser-tool/09-browser-with-domain-filtering/README.md",
    "base": "/agentcore-samples/06-workshops/05-AgentCore-tools/02-Agent-Core-browser-tool/09-browser-with-domain-filtering",
    "files": [
      {
        "path": "agentcore-browser-firewall.yaml",
        "lang": "yaml",
        "bytes": 17095
      },
      {
        "path": "requirements.txt",
        "lang": "text",
        "bytes": 17
      },
      {
        "path": "verify_domain_filtering.md",
        "lang": "markdown",
        "bytes": 4579,
        "fromNotebook": true
      },
      {
        "path": "verify_domain_filtering.py",
        "lang": "python",
        "bytes": 3812
      }
    ]
  },
  {
    "slug": "06-workshops/05-AgentCore-tools/02-Agent-Core-browser-tool/10-browser-with-profile",
    "title": "AgentCore Browser Tool with Browser Profiles",
    "desc": "This example demonstrates how to use browser profiles with Amazon Bedrock AgentCore Browser Tool. Browser profiles enable you to persist and reuse browser session data (cookies, local storage)...",
    "sectionId": "browser",
    "kind": "workshop",
    "frameworks": [],
    "languages": [],
    "hasNotebook": true,
    "readme": "/agentcore-samples/06-workshops/05-AgentCore-tools/02-Agent-Core-browser-tool/10-browser-with-profile/README.md",
    "base": "/agentcore-samples/06-workshops/05-AgentCore-tools/02-Agent-Core-browser-tool/10-browser-with-profile",
    "files": [
      {
        "path": "browser-profile.md",
        "lang": "markdown",
        "bytes": 11763,
        "fromNotebook": true
      },
      {
        "path": "requirements.txt",
        "lang": "text",
        "bytes": 17
      }
    ]
  },
  {
    "slug": "06-workshops/05-AgentCore-tools/02-Agent-Core-browser-tool/10-browser-with-profile/sample-ecommerce",
    "title": "Sample E-Commerce",
    "desc": "Simple static e-commerce site for t-shirts with persistent shopping cart using localStorage.",
    "sectionId": "browser",
    "kind": "workshop",
    "frameworks": [],
    "languages": [
      "javascript"
    ],
    "hasNotebook": false,
    "readme": "/agentcore-samples/06-workshops/05-AgentCore-tools/02-Agent-Core-browser-tool/10-browser-with-profile/sample-ecommerce/README.md",
    "base": "/agentcore-samples/06-workshops/05-AgentCore-tools/02-Agent-Core-browser-tool/10-browser-with-profile/sample-ecommerce",
    "files": [
      {
        "path": "cloudformation.yaml",
        "lang": "yaml",
        "bytes": 2443
      },
      {
        "path": "delete.sh",
        "lang": "bash",
        "bytes": 527
      },
      {
        "path": "deploy.sh",
        "lang": "bash",
        "bytes": 2217
      },
      {
        "path": "index.html",
        "lang": "html",
        "bytes": 849
      },
      {
        "path": "script.js",
        "lang": "javascript",
        "bytes": 2876
      },
      {
        "path": "style.css",
        "lang": "css",
        "bytes": 1870
      },
      {
        "path": "update.sh",
        "lang": "bash",
        "bytes": 1245
      }
    ]
  },
  {
    "slug": "06-workshops/05-AgentCore-tools/02-Agent-Core-browser-tool/11-browser-with-proxy",
    "title": "AgentCore Browser with Squid Proxy",
    "desc": "This example deploys an Amazon Bedrock AgentCore Browser that routes all web traffic through a Squid forward proxy running on EC2. The proxy authenticates requests via Secrets Manager and ships...",
    "sectionId": "browser",
    "kind": "workshop",
    "frameworks": [],
    "languages": [
      "python"
    ],
    "hasNotebook": true,
    "readme": "/agentcore-samples/06-workshops/05-AgentCore-tools/02-Agent-Core-browser-tool/11-browser-with-proxy/README.md",
    "base": "/agentcore-samples/06-workshops/05-AgentCore-tools/02-Agent-Core-browser-tool/11-browser-with-proxy",
    "files": [
      {
        "path": "agentcore-browser-proxy.yaml",
        "lang": "yaml",
        "bytes": 16400
      },
      {
        "path": "requirements.txt",
        "lang": "text",
        "bytes": 26
      },
      {
        "path": "verify_proxy.md",
        "lang": "markdown",
        "bytes": 4340,
        "fromNotebook": true
      },
      {
        "path": "verify_proxy.py",
        "lang": "python",
        "bytes": 3507
      }
    ]
  },
  {
    "slug": "06-workshops/05-AgentCore-tools/02-Agent-Core-browser-tool/13-browser-chrome-policies",
    "title": "AgentCore Browser with Chrome Enterprise Policies and Custom Root CAs",
    "desc": "This example demonstrates how to use Chrome enterprise policies and custom root CA certificates with Amazon Bedrock AgentCore Browser and Code Interpreter.",
    "sectionId": "browser",
    "kind": "workshop",
    "frameworks": [
      "Strands"
    ],
    "languages": [],
    "hasNotebook": true,
    "readme": "/agentcore-samples/06-workshops/05-AgentCore-tools/02-Agent-Core-browser-tool/13-browser-chrome-policies/README.md",
    "base": "/agentcore-samples/06-workshops/05-AgentCore-tools/02-Agent-Core-browser-tool/13-browser-chrome-policies",
    "files": [
      {
        "path": "browser-chrome-policies.md",
        "lang": "markdown",
        "bytes": 27860,
        "fromNotebook": true
      },
      {
        "path": "requirements.txt",
        "lang": "text",
        "bytes": 95
      }
    ]
  },
  {
    "slug": "06-workshops/05-AgentCore-tools/02-Agent-Core-browser-tool/14-browser-os-actions",
    "title": "AgentCore Browser Tool — OS-Level Actions (InvokeBrowser API)",
    "desc": "This tutorial demonstrates how to use OS-level actions with Amazon Bedrock AgentCore Browser Tool via the InvokeBrowser API, using SigV4-signed REST calls.",
    "sectionId": "browser",
    "kind": "workshop",
    "frameworks": [],
    "languages": [
      "python"
    ],
    "hasNotebook": true,
    "readme": "/agentcore-samples/06-workshops/05-AgentCore-tools/02-Agent-Core-browser-tool/14-browser-os-actions/README.md",
    "base": "/agentcore-samples/06-workshops/05-AgentCore-tools/02-Agent-Core-browser-tool/14-browser-os-actions",
    "files": [
      {
        "path": "browser-os-actions-boto3.md",
        "lang": "markdown",
        "bytes": 8417,
        "fromNotebook": true
      },
      {
        "path": "browser-os-actions.md",
        "lang": "markdown",
        "bytes": 12522,
        "fromNotebook": true
      },
      {
        "path": "helpers/browser.py",
        "lang": "python",
        "bytes": 2489
      },
      {
        "path": "helpers/utils.py",
        "lang": "python",
        "bytes": 5558
      },
      {
        "path": "requirements.txt",
        "lang": "text",
        "bytes": 25
      }
    ]
  },
  {
    "slug": "06-workshops/05-AgentCore-tools/02-Agent-Core-browser-tool/interactive_tools",
    "title": "Amazon Bedrock Agentcore SDK Tools Examples",
    "desc": "This folder contains examples demonstrating the use of AgentCore SDK tools:",
    "sectionId": "browser",
    "kind": "workshop",
    "frameworks": [
      "LangGraph",
      "LangChain"
    ],
    "languages": [
      "python"
    ],
    "hasNotebook": false,
    "readme": "/agentcore-samples/06-workshops/05-AgentCore-tools/02-Agent-Core-browser-tool/interactive_tools/README.md",
    "base": "/agentcore-samples/06-workshops/05-AgentCore-tools/02-Agent-Core-browser-tool/interactive_tools",
    "files": [
      {
        "path": "__init__.py",
        "lang": "python",
        "bytes": 48
      },
      {
        "path": "browser_viewer.py",
        "lang": "python",
        "bytes": 27919
      },
      {
        "path": "dynamic_research_agent_langgraph.py",
        "lang": "python",
        "bytes": 23246
      },
      {
        "path": "requirements.txt",
        "lang": "text",
        "bytes": 83
      },
      {
        "path": "run_live_viewer.py",
        "lang": "python",
        "bytes": 2362
      },
      {
        "path": "static/css/viewer.css",
        "lang": "css",
        "bytes": 2673
      },
      {
        "path": "static/replay-viewer/index.html",
        "lang": "html",
        "bytes": 11734
      }
    ]
  },
  {
    "slug": "06-workshops/05-AgentCore-tools/02-Agent-Core-browser-tool/interactive_tools/live_view_sessionreplay",
    "title": "Amazon Bedrock AgentCore SDK Tools Examples",
    "desc": "This folder contains examples demonstrating the use of Amazon Bedrock AgentCore SDK tools:",
    "sectionId": "browser",
    "kind": "workshop",
    "frameworks": [],
    "languages": [
      "python"
    ],
    "hasNotebook": false,
    "readme": "/agentcore-samples/06-workshops/05-AgentCore-tools/02-Agent-Core-browser-tool/interactive_tools/live_view_sessionreplay/README.md",
    "base": "/agentcore-samples/06-workshops/05-AgentCore-tools/02-Agent-Core-browser-tool/interactive_tools/live_view_sessionreplay",
    "files": [
      {
        "path": "__init__.py",
        "lang": "python",
        "bytes": 40
      },
      {
        "path": "browser_interactive_session.py",
        "lang": "python",
        "bytes": 29734
      },
      {
        "path": "browser_viewer_replay.py",
        "lang": "python",
        "bytes": 36555
      },
      {
        "path": "requirements.txt",
        "lang": "text",
        "bytes": 83
      },
      {
        "path": "session_replay_viewer.py",
        "lang": "python",
        "bytes": 37671
      },
      {
        "path": "view_recordings.py",
        "lang": "python",
        "bytes": 18474
      }
    ]
  },
  {
    "slug": "06-workshops/05-AgentCore-tools/02-Agent-Core-browser-tool/interactive_tools/static/dcvjs",
    "title": "Amazon DCV Web Client SDK",
    "desc": "The Amazon DCV Web Client SDK is a JavaScript library that lets you develop your own Amazon DCV web browser client application. Users of your application will be able to connect and interact with...",
    "sectionId": "browser",
    "kind": "workshop",
    "frameworks": [],
    "languages": [
      "javascript"
    ],
    "hasNotebook": false,
    "readme": "/agentcore-samples/06-workshops/05-AgentCore-tools/02-Agent-Core-browser-tool/interactive_tools/static/dcvjs/README.md",
    "base": "/agentcore-samples/06-workshops/05-AgentCore-tools/02-Agent-Core-browser-tool/interactive_tools/static/dcvjs",
    "files": [
      {
        "path": "EULA.txt",
        "lang": "text",
        "bytes": 27888
      },
      {
        "path": "dcv.js",
        "lang": "javascript",
        "bytes": 1938365
      },
      {
        "path": "dcv/broadwayh264decoder-worker.js",
        "lang": "javascript",
        "bytes": 909
      },
      {
        "path": "dcv/jsmpegdecoder-worker.js",
        "lang": "javascript",
        "bytes": 1086
      },
      {
        "path": "dcv/lz4decoder-worker.js",
        "lang": "javascript",
        "bytes": 2453
      },
      {
        "path": "dcv/microphoneprocessor.js",
        "lang": "javascript",
        "bytes": 404791
      },
      {
        "path": "third-party-licenses.txt",
        "lang": "text",
        "bytes": 67671
      }
    ]
  },
  {
    "slug": "06-workshops/06-AgentCore-observability/00-enable-transaction-search-template",
    "title": "Enable Transaction Search for Amazon Bedrock AgentCore Observability",
    "desc": "This tutorial demonstrates how to enable Amazon CloudWatch Transaction Search for AgentCore observability. Transaction Search provides an interactive analytics experience for complete visibility...",
    "sectionId": "payments",
    "kind": "workshop",
    "frameworks": [],
    "languages": [],
    "hasNotebook": true,
    "readme": "/agentcore-samples/06-workshops/06-AgentCore-observability/00-enable-transaction-search-template/README.md",
    "base": "/agentcore-samples/06-workshops/06-AgentCore-observability/00-enable-transaction-search-template",
    "files": [
      {
        "path": "enable_transaction_search.md",
        "lang": "markdown",
        "bytes": 4816,
        "fromNotebook": true
      },
      {
        "path": "transaction_search.yml",
        "lang": "yaml",
        "bytes": 1335
      }
    ]
  },
  {
    "slug": "06-workshops/06-AgentCore-observability/01-Agentcore-runtime-hosted/CrewAI",
    "title": "CrewAI Agent with Amazon Bedrock AgentCore Runtime and Observability",
    "desc": "This tutorial demonstrates how to deploy a CrewAI travel agent to Amazon Bedrock AgentCore Runtime with observability through Amazon CloudWatch.",
    "sectionId": "observability",
    "kind": "workshop",
    "frameworks": [
      "CrewAI"
    ],
    "languages": [],
    "hasNotebook": true,
    "readme": "/agentcore-samples/06-workshops/06-AgentCore-observability/01-Agentcore-runtime-hosted/CrewAI/README.md",
    "base": "/agentcore-samples/06-workshops/06-AgentCore-observability/01-Agentcore-runtime-hosted/CrewAI",
    "files": [
      {
        "path": "requirements.txt",
        "lang": "text",
        "bytes": 195
      },
      {
        "path": "runtime-with-crewai-and-bedrock-models.md",
        "lang": "markdown",
        "bytes": 13863,
        "fromNotebook": true
      }
    ]
  },
  {
    "slug": "06-workshops/06-AgentCore-observability/01-Agentcore-runtime-hosted/LlamaIndex",
    "title": "LlamaIndex Agent with Amazon Bedrock AgentCore Runtime and Observability",
    "desc": "This tutorial demonstrates how to deploy a LlamaIndex agent to Amazon Bedrock AgentCore Runtime with comprehensive observability and telemetry collection.",
    "sectionId": "observability",
    "kind": "workshop",
    "frameworks": [
      "LlamaIndex"
    ],
    "languages": [],
    "hasNotebook": true,
    "readme": "/agentcore-samples/06-workshops/06-AgentCore-observability/01-Agentcore-runtime-hosted/LlamaIndex/README.md",
    "base": "/agentcore-samples/06-workshops/06-AgentCore-observability/01-Agentcore-runtime-hosted/LlamaIndex",
    "files": [
      {
        "path": "requirements.txt",
        "lang": "text",
        "bytes": 199
      },
      {
        "path": "runtime_with_llamaindex_and_bedrock_models.md",
        "lang": "markdown",
        "bytes": 15416,
        "fromNotebook": true
      }
    ]
  },
  {
    "slug": "06-workshops/06-AgentCore-observability/01-Agentcore-runtime-hosted/Multi-Runtime-multi-agent-strands-langgraph",
    "title": "Multi-Agent Systems with Observability",
    "desc": "This tutorial demonstrates how to build multi-agent systems with full observability using Amazon Bedrock AgentCore Runtime and Observability. You'll learn two patterns for coordinating multiple...",
    "sectionId": "observability",
    "kind": "workshop",
    "frameworks": [
      "Strands",
      "LangGraph",
      "LangChain"
    ],
    "languages": [
      "python"
    ],
    "hasNotebook": true,
    "readme": "/agentcore-samples/06-workshops/06-AgentCore-observability/01-Agentcore-runtime-hosted/Multi-Runtime-multi-agent-strands-langgraph/README.md",
    "base": "/agentcore-samples/06-workshops/06-AgentCore-observability/01-Agentcore-runtime-hosted/Multi-Runtime-multi-agent-strands-langgraph",
    "files": [
      {
        "path": "multi_agent_observability.md",
        "lang": "markdown",
        "bytes": 23912,
        "fromNotebook": true
      },
      {
        "path": "orchestrator_agent/main.py",
        "lang": "python",
        "bytes": 5371
      },
      {
        "path": "orchestrator_agent/requirements.txt",
        "lang": "text",
        "bytes": 89
      },
      {
        "path": "requirements.txt",
        "lang": "text",
        "bytes": 111
      },
      {
        "path": "single_runtime/multi_agent.py",
        "lang": "python",
        "bytes": 2622
      },
      {
        "path": "single_runtime/requirements.txt",
        "lang": "text",
        "bytes": 95
      },
      {
        "path": "travel_agent/main.py",
        "lang": "python",
        "bytes": 1502
      },
      {
        "path": "travel_agent/requirements.txt",
        "lang": "text",
        "bytes": 96
      },
      {
        "path": "utils.py",
        "lang": "python",
        "bytes": 4407
      },
      {
        "path": "weather_agent/main.py",
        "lang": "python",
        "bytes": 2478
      },
      {
        "path": "weather_agent/requirements.txt",
        "lang": "text",
        "bytes": 125
      }
    ]
  },
  {
    "slug": "06-workshops/06-AgentCore-observability/02-Agent-not-hosted-on-runtime/LlamaIndex",
    "title": "LlamaIndex Function Agent with AWS Bedrock and OpenTelemetry",
    "desc": "This project demonstrates how to create a simple arithmetic agent using LlamaIndex, hosted on AWS Bedrock with OpenTelemetry instrumentation for AgentCore observability tracing.",
    "sectionId": "observability",
    "kind": "workshop",
    "frameworks": [
      "LlamaIndex"
    ],
    "languages": [],
    "hasNotebook": true,
    "readme": "/agentcore-samples/06-workshops/06-AgentCore-observability/02-Agent-not-hosted-on-runtime/LlamaIndex/README.md",
    "base": "/agentcore-samples/06-workshops/06-AgentCore-observability/02-Agent-not-hosted-on-runtime/LlamaIndex",
    "files": [
      {
        "path": "LlamaIndex_Observability.md",
        "lang": "markdown",
        "bytes": 16934,
        "fromNotebook": true
      },
      {
        "path": "requirements.txt",
        "lang": "text",
        "bytes": 246
      }
    ]
  },
  {
    "slug": "06-workshops/06-AgentCore-observability/03-advanced-concepts/02-data-protection",
    "title": "Amazon Bedrock AgentCore Observability: Data Protection",
    "desc": "In this tutorial, we will learn how to implement comprehensive data protection in agentic AI applications using Amazon Bedrock Guardrails and Amazon CloudWatch Logs Data Protection policies. This...",
    "sectionId": "observability",
    "kind": "workshop",
    "frameworks": [
      "Strands"
    ],
    "languages": [],
    "hasNotebook": true,
    "readme": "/agentcore-samples/06-workshops/06-AgentCore-observability/03-advanced-concepts/02-data-protection/README.md",
    "base": "/agentcore-samples/06-workshops/06-AgentCore-observability/03-advanced-concepts/02-data-protection",
    "files": [
      {
        "path": "cloudwatch_data_protection_policy.json",
        "lang": "json",
        "bytes": 1476
      },
      {
        "path": "data/customer_support_conversation_sample.txt",
        "lang": "text",
        "bytes": 1171
      },
      {
        "path": "data_protection.md",
        "lang": "markdown",
        "bytes": 28238,
        "fromNotebook": true
      },
      {
        "path": "requirements.txt",
        "lang": "text",
        "bytes": 135
      }
    ]
  },
  {
    "slug": "06-workshops/06-AgentCore-observability/05-Lambda-AgentCore-invocation",
    "title": "Lambda AgentCore Invocation with CloudWatch Observability",
    "desc": "This tutorial demonstrates how to invoke Strands agents hosted on Amazon Bedrock AgentCore Runtime from AWS Lambda functions, with full CloudWatch Gen AI Observability enabled.",
    "sectionId": "observability",
    "kind": "workshop",
    "frameworks": [
      "Strands"
    ],
    "languages": [
      "python"
    ],
    "hasNotebook": true,
    "readme": "/agentcore-samples/06-workshops/06-AgentCore-observability/05-Lambda-AgentCore-invocation/README.md",
    "base": "/agentcore-samples/06-workshops/06-AgentCore-observability/05-Lambda-AgentCore-invocation",
    "files": [
      {
        "path": "agentcore_observability_lambda.md",
        "lang": "markdown",
        "bytes": 38017,
        "fromNotebook": true
      },
      {
        "path": "lambda_agentcore_invoker.py",
        "lang": "python",
        "bytes": 4020
      },
      {
        "path": "mcp_agent_multi_server.py",
        "lang": "python",
        "bytes": 2080
      },
      {
        "path": "requirements.txt",
        "lang": "text",
        "bytes": 102
      }
    ]
  },
  {
    "slug": "06-workshops/06-AgentCore-observability/06-Agentcore-observability-for-eks-hosted-agent",
    "title": "Deploying a Strands Agent to Amazon EKS",
    "desc": "This example demonstrates how to deploy a Python application built with Strands Agents SDK to Amazon EKS. The example deploys a travel research agent application that runs as a containerized...",
    "sectionId": "observability",
    "kind": "workshop",
    "frameworks": [
      "Strands"
    ],
    "languages": [
      "python"
    ],
    "hasNotebook": true,
    "readme": "/agentcore-samples/06-workshops/06-AgentCore-observability/06-Agentcore-observability-for-eks-hosted-agent/README.md",
    "base": "/agentcore-samples/06-workshops/06-AgentCore-observability/06-Agentcore-observability-for-eks-hosted-agent",
    "files": [
      {
        "path": "chart/Chart.yaml",
        "lang": "yaml",
        "bytes": 170
      },
      {
        "path": "chart/templates/NOTES.txt",
        "lang": "text",
        "bytes": 2254
      },
      {
        "path": "chart/templates/deployment.yaml",
        "lang": "yaml",
        "bytes": 1949
      },
      {
        "path": "chart/templates/ingress.yaml",
        "lang": "yaml",
        "bytes": 1417
      },
      {
        "path": "chart/templates/poddisruptionbudget.yaml",
        "lang": "yaml",
        "bytes": 619
      },
      {
        "path": "chart/templates/service.yaml",
        "lang": "yaml",
        "bytes": 431
      },
      {
        "path": "chart/templates/serviceaccount.yaml",
        "lang": "yaml",
        "bytes": 348
      },
      {
        "path": "chart/values.yaml",
        "lang": "yaml",
        "bytes": 2002
      },
      {
        "path": "deploy.md",
        "lang": "markdown",
        "bytes": 13102,
        "fromNotebook": true
      },
      {
        "path": "docker/app/app.py",
        "lang": "python",
        "bytes": 10980
      },
      {
        "path": "docker/requirements.txt",
        "lang": "text",
        "bytes": 137
      }
    ]
  },
  {
    "slug": "06-workshops/07-AgentCore-evaluations/00-prereqs",
    "title": "Prerequisites: Creating sample Agents",
    "desc": "Before we can evaluate agents, we need an agent to evaluate. This tutorial sets up two sample agents that we'll use throughout the remaining evaluation tutorials: one using Strands Agents SDK and...",
    "sectionId": "evaluations",
    "kind": "workshop",
    "frameworks": [
      "Strands",
      "LangGraph",
      "LangChain"
    ],
    "languages": [
      "python"
    ],
    "hasNotebook": true,
    "readme": "/agentcore-samples/06-workshops/07-AgentCore-evaluations/00-prereqs/README.md",
    "base": "/agentcore-samples/06-workshops/07-AgentCore-evaluations/00-prereqs",
    "files": [
      {
        "path": "creating_and_invoking_agent.md",
        "lang": "markdown",
        "bytes": 5170,
        "fromNotebook": true
      },
      {
        "path": "eval_agent_langgraph.py",
        "lang": "python",
        "bytes": 4052
      },
      {
        "path": "eval_agent_strands.py",
        "lang": "python",
        "bytes": 929
      },
      {
        "path": "requirements_langgraph.txt",
        "lang": "text",
        "bytes": 118
      },
      {
        "path": "requirements_strands.txt",
        "lang": "text",
        "bytes": 78
      }
    ]
  },
  {
    "slug": "06-workshops/07-AgentCore-evaluations/01-creating-custom-evaluators",
    "title": "Creating Evaluators",
    "desc": "In this tutorial you will learn about AgentCore Evaluations built-in and custom metrics. You'll learn when to use each type and how to create custom evaluators tailored to your specific needs.",
    "sectionId": "evaluations",
    "kind": "workshop",
    "frameworks": [],
    "languages": [],
    "hasNotebook": true,
    "readme": "/agentcore-samples/06-workshops/07-AgentCore-evaluations/01-creating-custom-evaluators/README.md",
    "base": "/agentcore-samples/06-workshops/07-AgentCore-evaluations/01-creating-custom-evaluators",
    "files": [
      {
        "path": "01-agentcore-evaluators.md",
        "lang": "markdown",
        "bytes": 11300,
        "fromNotebook": true
      },
      {
        "path": "metric.json",
        "lang": "json",
        "bytes": 2692
      }
    ]
  },
  {
    "slug": "06-workshops/07-AgentCore-evaluations/02-running-evaluations/01-strands",
    "title": "Running Evaluations with Strands Agents",
    "desc": "This tutorial demonstrates how to use AgentCore Evaluations with agents built using the Strands Agents SDK. You'll learn to run both on-demand and online evaluations to assess and monitor your...",
    "sectionId": "evaluations",
    "kind": "workshop",
    "frameworks": [
      "Strands"
    ],
    "languages": [],
    "hasNotebook": true,
    "readme": "/agentcore-samples/06-workshops/07-AgentCore-evaluations/02-running-evaluations/01-strands/README.md",
    "base": "/agentcore-samples/06-workshops/07-AgentCore-evaluations/02-running-evaluations/01-strands",
    "files": [
      {
        "path": "01-on-demand-eval.md",
        "lang": "markdown",
        "bytes": 11666,
        "fromNotebook": true
      },
      {
        "path": "02-online-eval.md",
        "lang": "markdown",
        "bytes": 11015,
        "fromNotebook": true
      }
    ]
  },
  {
    "slug": "06-workshops/07-AgentCore-evaluations/02-running-evaluations/02-langgraph",
    "title": "Running Evaluations with LangGraph",
    "desc": "This tutorial demonstrates how to use AgentCore Evaluations with agents built using LangGraph. You'll learn to run both on-demand and online evaluations to assess and monitor your LangGraph...",
    "sectionId": "evaluations",
    "kind": "workshop",
    "frameworks": [
      "LangGraph",
      "LangChain"
    ],
    "languages": [],
    "hasNotebook": true,
    "readme": "/agentcore-samples/06-workshops/07-AgentCore-evaluations/02-running-evaluations/02-langgraph/README.md",
    "base": "/agentcore-samples/06-workshops/07-AgentCore-evaluations/02-running-evaluations/02-langgraph",
    "files": [
      {
        "path": "01-on-demand-eval.md",
        "lang": "markdown",
        "bytes": 11704,
        "fromNotebook": true
      },
      {
        "path": "02-online-eval.md",
        "lang": "markdown",
        "bytes": 11048,
        "fromNotebook": true
      }
    ]
  },
  {
    "slug": "06-workshops/07-AgentCore-evaluations/03-advanced/01-end-to-end-on-demand-with-boto3",
    "title": "AgentCore Evaluation Utility",
    "desc": "Python utility for extracting CloudWatch trace data and evaluating agent sessions using the AgentCore Evaluation DataPlane API.",
    "sectionId": "evaluations",
    "kind": "workshop",
    "frameworks": [
      "Strands"
    ],
    "languages": [
      "python"
    ],
    "hasNotebook": true,
    "readme": "/agentcore-samples/06-workshops/07-AgentCore-evaluations/03-advanced/01-end-to-end-on-demand-with-boto3/README.md",
    "base": "/agentcore-samples/06-workshops/07-AgentCore-evaluations/03-advanced/01-end-to-end-on-demand-with-boto3",
    "files": [
      {
        "path": "evaluate_by_session_id.md",
        "lang": "markdown",
        "bytes": 2557,
        "fromNotebook": true
      },
      {
        "path": "evaluate_like_a_pipeline.md",
        "lang": "markdown",
        "bytes": 4032,
        "fromNotebook": true
      },
      {
        "path": "evaluation_dashboard.html",
        "lang": "html",
        "bytes": 129721
      },
      {
        "path": "requirements.txt",
        "lang": "text",
        "bytes": 13
      },
      {
        "path": "utils/__init__.py",
        "lang": "python",
        "bytes": 526
      },
      {
        "path": "utils/cloudwatch_client.py",
        "lang": "python",
        "bytes": 10020
      },
      {
        "path": "utils/constants.py",
        "lang": "python",
        "bytes": 1479
      },
      {
        "path": "utils/evaluation_client.py",
        "lang": "python",
        "bytes": 33552
      },
      {
        "path": "utils/models.py",
        "lang": "python",
        "bytes": 7606
      },
      {
        "path": "utils/online_evaluation.py",
        "lang": "python",
        "bytes": 8057
      }
    ]
  },
  {
    "slug": "06-workshops/07-AgentCore-evaluations/03-advanced/03-groundtruth-evals-agentcore-strandseval",
    "title": "Offline Multi-Session Evaluation",
    "desc": "Evaluate deployed AI agent sessions using historical traces from AgentCore Observability. This tool fetches traces from your agent's observability logs, converts them to Strands Evals format, runs...",
    "sectionId": "evaluations",
    "kind": "workshop",
    "frameworks": [
      "Strands"
    ],
    "languages": [
      "python"
    ],
    "hasNotebook": true,
    "readme": "/agentcore-samples/06-workshops/07-AgentCore-evaluations/03-advanced/03-groundtruth-evals-agentcore-strandseval/README.md",
    "base": "/agentcore-samples/06-workshops/07-AgentCore-evaluations/03-advanced/03-groundtruth-evals-agentcore-strandseval",
    "files": [
      {
        "path": "01_session_discovery.md",
        "lang": "markdown",
        "bytes": 6091,
        "fromNotebook": true
      },
      {
        "path": "02_multi_session_analysis.md",
        "lang": "markdown",
        "bytes": 16119,
        "fromNotebook": true
      },
      {
        "path": "03_ground_truth_evaluation.md",
        "lang": "markdown",
        "bytes": 24125,
        "fromNotebook": true
      },
      {
        "path": "config.py",
        "lang": "python",
        "bytes": 4221
      },
      {
        "path": "demo_ground_truth.json",
        "lang": "json",
        "bytes": 2454
      },
      {
        "path": "demo_traces.json",
        "lang": "json",
        "bytes": 2801
      },
      {
        "path": "requirements.txt",
        "lang": "text",
        "bytes": 42
      },
      {
        "path": "utils/__init__.py",
        "lang": "python",
        "bytes": 1454
      },
      {
        "path": "utils/cloudwatch_client.py",
        "lang": "python",
        "bytes": 21425
      },
      {
        "path": "utils/constants.py",
        "lang": "python",
        "bytes": 1479
      },
      {
        "path": "utils/evaluation_cloudwatch_logger.py",
        "lang": "python",
        "bytes": 11390
      },
      {
        "path": "utils/models.py",
        "lang": "python",
        "bytes": 12734
      },
      {
        "path": "utils/session_mapper.py",
        "lang": "python",
        "bytes": 16721
      }
    ]
  },
  {
    "slug": "06-workshops/07-AgentCore-evaluations/04-using-evaluation-results",
    "title": "Evaluation Analyzer",
    "desc": "Scale your AI agent evaluation analysis from days/weeks to minutes.",
    "sectionId": "evaluations",
    "kind": "workshop",
    "frameworks": [
      "Strands"
    ],
    "languages": [],
    "hasNotebook": true,
    "readme": "/agentcore-samples/06-workshops/07-AgentCore-evaluations/04-using-evaluation-results/README.md",
    "base": "/agentcore-samples/06-workshops/07-AgentCore-evaluations/04-using-evaluation-results",
    "files": [
      {
        "path": "eval_data/example_session_1.json",
        "lang": "json",
        "bytes": 6521
      },
      {
        "path": "eval_data/example_session_2.json",
        "lang": "json",
        "bytes": 2150
      },
      {
        "path": "eval_data/example_session_3.json",
        "lang": "json",
        "bytes": 5663
      },
      {
        "path": "evaluation_analyzer.md",
        "lang": "markdown",
        "bytes": 17041,
        "fromNotebook": true
      },
      {
        "path": "example_agent_output.md",
        "lang": "markdown",
        "bytes": 12503
      },
      {
        "path": "example_system_prompt.txt",
        "lang": "text",
        "bytes": 2408
      },
      {
        "path": "requirements.txt",
        "lang": "text",
        "bytes": 206
      },
      {
        "path": "system_prompt.txt",
        "lang": "text",
        "bytes": 201
      }
    ]
  },
  {
    "slug": "06-workshops/07-AgentCore-evaluations/05-groundtruth-based-evalautions",
    "title": "Ground Truth Evaluations with Custom Evaluators",
    "desc": "This tutorial demonstrates evaluation of an agentic application using Amazon Bedrock AgentCore Evaluations with ground-truth reference inputs. It covers three evaluation interfaces and shows how...",
    "sectionId": "evaluations",
    "kind": "workshop",
    "frameworks": [
      "Strands"
    ],
    "languages": [
      "python"
    ],
    "hasNotebook": true,
    "readme": "/agentcore-samples/06-workshops/07-AgentCore-evaluations/05-groundtruth-based-evalautions/README.md",
    "base": "/agentcore-samples/06-workshops/07-AgentCore-evaluations/05-groundtruth-based-evalautions",
    "files": [
      {
        "path": "deploy_hr_assistant_agent.py",
        "lang": "python",
        "bytes": 2788
      },
      {
        "path": "groundtruth_evaluations.md",
        "lang": "markdown",
        "bytes": 41563,
        "fromNotebook": true
      },
      {
        "path": "hr_assistant_agent.py",
        "lang": "python",
        "bytes": 10489
      },
      {
        "path": "requirements.txt",
        "lang": "text",
        "bytes": 141
      }
    ]
  },
  {
    "slug": "06-workshops/07-AgentCore-evaluations/06-programmatic_evaluators",
    "title": "Programmatic (Code-Based) Evaluators",
    "desc": "This tutorial shows how to build and run custom code-based evaluators with Amazon Bedrock AgentCore Evaluations. Instead of relying on an LLM as the judge, code-based evaluators delegate scoring...",
    "sectionId": "evaluations",
    "kind": "workshop",
    "frameworks": [
      "Strands"
    ],
    "languages": [
      "python"
    ],
    "hasNotebook": true,
    "readme": "/agentcore-samples/06-workshops/07-AgentCore-evaluations/06-programmatic_evaluators/README.md",
    "base": "/agentcore-samples/06-workshops/07-AgentCore-evaluations/06-programmatic_evaluators",
    "files": [
      {
        "path": "hr_assistant_agent.py",
        "lang": "python",
        "bytes": 10330
      },
      {
        "path": "lambdas/hr_fact_checker/lambda_function.py",
        "lang": "python",
        "bytes": 8646
      },
      {
        "path": "lambdas/hr_response_length/lambda_function.py",
        "lang": "python",
        "bytes": 4238
      },
      {
        "path": "programmatic_evaluators.md",
        "lang": "markdown",
        "bytes": 72527,
        "fromNotebook": true
      },
      {
        "path": "requirements.txt",
        "lang": "text",
        "bytes": 100
      }
    ]
  },
  {
    "slug": "06-workshops/08-AgentCore-policy/01-Getting-Started",
    "title": "AgentCore Policy - Getting Started Demo",
    "desc": "A complete, hands-on demo of implementing policy-based controls for AI agents using Amazon Bedrock AgentCore Policy.",
    "sectionId": "policy",
    "kind": "workshop",
    "frameworks": [
      "Strands"
    ],
    "languages": [
      "javascript",
      "python"
    ],
    "hasNotebook": true,
    "readme": "/agentcore-samples/06-workshops/08-AgentCore-policy/01-Getting-Started/README.md",
    "base": "/agentcore-samples/06-workshops/08-AgentCore-policy/01-Getting-Started",
    "files": [
      {
        "path": "AgentCore-Policy-Demo.md",
        "lang": "markdown",
        "bytes": 19200,
        "fromNotebook": true
      },
      {
        "path": "requirements.txt",
        "lang": "text",
        "bytes": 455
      },
      {
        "path": "scripts/agent_with_tools.py",
        "lang": "python",
        "bytes": 7807
      },
      {
        "path": "scripts/lambda-target-setup/add_lambda_permissions.py",
        "lang": "python",
        "bytes": 3039
      },
      {
        "path": "scripts/lambda-target-setup/application_tool.js",
        "lang": "javascript",
        "bytes": 4511
      },
      {
        "path": "scripts/lambda-target-setup/approval_tool.js",
        "lang": "javascript",
        "bytes": 4516
      },
      {
        "path": "scripts/lambda-target-setup/deploy_lambdas.py",
        "lang": "python",
        "bytes": 6769
      },
      {
        "path": "scripts/lambda-target-setup/risk_model_tool.js",
        "lang": "javascript",
        "bytes": 4673
      },
      {
        "path": "scripts/setup_gateway.py",
        "lang": "python",
        "bytes": 12072
      }
    ]
  },
  {
    "slug": "06-workshops/08-AgentCore-policy/02-Natural-Language-Policy-Authoring",
    "title": "AgentCore Policy - Natural Language Policy Authoring (NL2Cedar)",
    "desc": "A hands-on demo of generating Cedar policies from natural language using Amazon Bedrock AgentCore Policy's NL2Cedar capability.",
    "sectionId": "policy",
    "kind": "workshop",
    "frameworks": [],
    "languages": [],
    "hasNotebook": true,
    "readme": "/agentcore-samples/06-workshops/08-AgentCore-policy/02-Natural-Language-Policy-Authoring/README.md",
    "base": "/agentcore-samples/06-workshops/08-AgentCore-policy/02-Natural-Language-Policy-Authoring",
    "files": [
      {
        "path": "NL-Authoring-Policy.md",
        "lang": "markdown",
        "bytes": 16186,
        "fromNotebook": true
      },
      {
        "path": "requirements.txt",
        "lang": "text",
        "bytes": 390
      }
    ]
  },
  {
    "slug": "06-workshops/08-AgentCore-policy/03-Fine-Grained-Access-Control",
    "title": "Policy for Amazon Bedrock AgentCore",
    "desc": "Policy for Amazon Bedrock AgentCore enables fine-grained access control for AI agents using Cedar policies. It evaluates JWT token claims to determine whether tool invocations should be allowed or...",
    "sectionId": "policy",
    "kind": "workshop",
    "frameworks": [],
    "languages": [
      "python"
    ],
    "hasNotebook": true,
    "readme": "/agentcore-samples/06-workshops/08-AgentCore-policy/03-Fine-Grained-Access-Control/README.md",
    "base": "/agentcore-samples/06-workshops/08-AgentCore-policy/03-Fine-Grained-Access-Control",
    "files": [
      {
        "path": "gateway_config.json",
        "lang": "json",
        "bytes": 708
      },
      {
        "path": "policy_for_agentcore_tutorial.md",
        "lang": "markdown",
        "bytes": 56833,
        "fromNotebook": true
      },
      {
        "path": "requirements.txt",
        "lang": "text",
        "bytes": 29
      },
      {
        "path": "setup-gateway.py",
        "lang": "python",
        "bytes": 15882
      }
    ]
  },
  {
    "slug": "06-workshops/09-AgentCore-E2E/google-adk",
    "title": "End-to-End Customer Support Agent with AgentCore using Google ADK",
    "desc": "In this tutorial we will move a customer support agent from prototype to production using Amazon Bedrock AgentCore services.",
    "sectionId": null,
    "kind": "workshop",
    "frameworks": [
      "Strands",
      "Google ADK"
    ],
    "languages": [
      "python"
    ],
    "hasNotebook": true,
    "readme": "/agentcore-samples/06-workshops/09-AgentCore-E2E/google-adk/README.md",
    "base": "/agentcore-samples/06-workshops/09-AgentCore-E2E/google-adk",
    "files": [
      {
        "path": "knowledge_base_data/laptop-maintenance-guide.txt",
        "lang": "text",
        "bytes": 867
      },
      {
        "path": "knowledge_base_data/monitor-calibration-guide.txt",
        "lang": "text",
        "bytes": 946
      },
      {
        "path": "knowledge_base_data/smartphone-setup-guide.txt",
        "lang": "text",
        "bytes": 1073
      },
      {
        "path": "knowledge_base_data/troubleshooting-guide.txt",
        "lang": "text",
        "bytes": 1044
      },
      {
        "path": "knowledge_base_data/warranty-service-guide.txt",
        "lang": "text",
        "bytes": 1051
      },
      {
        "path": "knowledge_base_data/wireless-connectivity-guide.txt",
        "lang": "text",
        "bytes": 1138
      },
      {
        "path": "lab-01-create-an-agent.md",
        "lang": "markdown",
        "bytes": 22065,
        "fromNotebook": true
      },
      {
        "path": "lab-02-agentcore-memory.md",
        "lang": "markdown",
        "bytes": 26200,
        "fromNotebook": true
      },
      {
        "path": "lab-03-agentcore-gateway.md",
        "lang": "markdown",
        "bytes": 41180,
        "fromNotebook": true
      },
      {
        "path": "lab-04-agentcore-runtime.md",
        "lang": "markdown",
        "bytes": 34461,
        "fromNotebook": true
      },
      {
        "path": "lab-05-frontend.md",
        "lang": "markdown",
        "bytes": 8612,
        "fromNotebook": true
      },
      {
        "path": "lab-06-cleanup.md",
        "lang": "markdown",
        "bytes": 4485,
        "fromNotebook": true
      },
      {
        "path": "lab_helpers/lab1_strands_agent.py",
        "lang": "python",
        "bytes": 8507
      },
      {
        "path": "lab_helpers/lab2_memory.py",
        "lang": "python",
        "bytes": 6867
      },
      {
        "path": "lab_helpers/lab4_runtime.py",
        "lang": "python",
        "bytes": 16303
      },
      {
        "path": "lab_helpers/lab5_evaluation.py",
        "lang": "python",
        "bytes": 4891
      },
      {
        "path": "lab_helpers/lab5_evaluation/agentcore-evaluation-policy.json",
        "lang": "json",
        "bytes": 1636
      },
      {
        "path": "lab_helpers/lab5_frontend/chat.py",
        "lang": "python",
        "bytes": 14276
      },
      {
        "path": "lab_helpers/lab5_frontend/chat_utils.py",
        "lang": "python",
        "bytes": 4573
      },
      {
        "path": "lab_helpers/lab5_frontend/main.py",
        "lang": "python",
        "bytes": 10492
      },
      {
        "path": "lab_helpers/lab5_frontend/requirements.txt",
        "lang": "text",
        "bytes": 47
      },
      {
        "path": "lab_helpers/lab5_frontend/sagemaker_helper.py",
        "lang": "python",
        "bytes": 1429
      },
      {
        "path": "lab_helpers/utils.py",
        "lang": "python",
        "bytes": 28983
      },
      {
        "path": "prerequisite/cognito.yaml",
        "lang": "yaml",
        "bytes": 9988
      },
      {
        "path": "prerequisite/infrastructure.yaml",
        "lang": "yaml",
        "bytes": 59793
      },
      {
        "path": "prerequisite/lambda/__init__.py",
        "lang": "python",
        "bytes": 0
      },
      {
        "path": "prerequisite/lambda/api_spec.json",
        "lang": "json",
        "bytes": 1324
      },
      {
        "path": "prerequisite/lambda/python/__init__.py",
        "lang": "python",
        "bytes": 0
      },
      {
        "path": "prerequisite/lambda/python/check_warranty.py",
        "lang": "python",
        "bytes": 6364
      },
      {
        "path": "prerequisite/lambda/python/lambda_function.py",
        "lang": "python",
        "bytes": 2118
      },
      {
        "path": "prerequisite/lambda/python/web_search.py",
        "lang": "python",
        "bytes": 683
      },
      {
        "path": "requirements.txt",
        "lang": "text",
        "bytes": 210
      },
      {
        "path": "scripts/__init__.py",
        "lang": "python",
        "bytes": 0
      },
      {
        "path": "scripts/cleanup.sh",
        "lang": "bash",
        "bytes": 2345
      },
      {
        "path": "scripts/list_ssm_parameters.sh",
        "lang": "bash",
        "bytes": 460
      },
      {
        "path": "scripts/prereq.sh",
        "lang": "bash",
        "bytes": 4519
      }
    ]
  },
  {
    "slug": "06-workshops/09-AgentCore-E2E/google-adk/lab_helpers/lab5_evaluation/scripts",
    "title": "🧪 Lab 5 — Evaluation Data Generator",
    "desc": "┌─────────────────────────────────────────────────────────┐ │ │ │ ⚡ setup → test → generate → cleanup ⚡ │ │ │ │ Creates a full Strands agent stack (Labs 1-4) │ │ then generates 30 min of...",
    "sectionId": "evaluations",
    "kind": "workshop",
    "frameworks": [
      "Strands"
    ],
    "languages": [
      "python"
    ],
    "hasNotebook": false,
    "readme": "/agentcore-samples/06-workshops/09-AgentCore-E2E/google-adk/lab_helpers/lab5_evaluation/scripts/README.md",
    "base": "/agentcore-samples/06-workshops/09-AgentCore-E2E/google-adk/lab_helpers/lab5_evaluation/scripts",
    "files": [
      {
        "path": "lab5_evaluation_helper.py",
        "lang": "python",
        "bytes": 38108
      },
      {
        "path": "requirements.txt",
        "lang": "text",
        "bytes": 138
      }
    ]
  },
  {
    "slug": "06-workshops/09-AgentCore-E2E/strands-agents",
    "title": "End-to-End Customer Support Agent with AgentCore",
    "desc": "Move a customer support agent from prototype to production using Amazon Bedrock AgentCore services. Across six labs, you'll build a complete system that handles real customer conversations with...",
    "sectionId": null,
    "kind": "workshop",
    "frameworks": [
      "Strands"
    ],
    "languages": [
      "python"
    ],
    "hasNotebook": true,
    "readme": "/agentcore-samples/06-workshops/09-AgentCore-E2E/strands-agents/README.md",
    "base": "/agentcore-samples/06-workshops/09-AgentCore-E2E/strands-agents",
    "files": [
      {
        "path": "Optional-lab-agentcore-observability.md",
        "lang": "markdown",
        "bytes": 10853,
        "fromNotebook": true
      },
      {
        "path": "Optional-lab-identity.md",
        "lang": "markdown",
        "bytes": 21686,
        "fromNotebook": true
      },
      {
        "path": "lab-01-create-an-agent.md",
        "lang": "markdown",
        "bytes": 19824,
        "fromNotebook": true
      },
      {
        "path": "lab-02-agentcore-memory.md",
        "lang": "markdown",
        "bytes": 14763,
        "fromNotebook": true
      },
      {
        "path": "lab-03-agentcore-gateway.md",
        "lang": "markdown",
        "bytes": 29839,
        "fromNotebook": true
      },
      {
        "path": "lab-04-agentcore-runtime.md",
        "lang": "markdown",
        "bytes": 22490,
        "fromNotebook": true
      },
      {
        "path": "lab-05-agentcore-evals.md",
        "lang": "markdown",
        "bytes": 11391,
        "fromNotebook": true
      },
      {
        "path": "lab-06-frontend.md",
        "lang": "markdown",
        "bytes": 8708,
        "fromNotebook": true
      },
      {
        "path": "lab-07-cleanup.md",
        "lang": "markdown",
        "bytes": 4333,
        "fromNotebook": true
      },
      {
        "path": "lab_helpers/lab1_strands_agent.py",
        "lang": "python",
        "bytes": 8490
      },
      {
        "path": "lab_helpers/lab2_memory.py",
        "lang": "python",
        "bytes": 6867
      },
      {
        "path": "lab_helpers/lab4_runtime.py",
        "lang": "python",
        "bytes": 3281
      },
      {
        "path": "lab_helpers/lab5_frontend/chat.py",
        "lang": "python",
        "bytes": 14276
      },
      {
        "path": "lab_helpers/lab5_frontend/chat_utils.py",
        "lang": "python",
        "bytes": 4573
      },
      {
        "path": "lab_helpers/lab5_frontend/main.py",
        "lang": "python",
        "bytes": 10463
      },
      {
        "path": "lab_helpers/lab5_frontend/requirements.txt",
        "lang": "text",
        "bytes": 47
      },
      {
        "path": "lab_helpers/lab5_frontend/sagemaker_helper.py",
        "lang": "python",
        "bytes": 1429
      },
      {
        "path": "lab_helpers/utils.py",
        "lang": "python",
        "bytes": 28467
      },
      {
        "path": "prerequisite/cognito.yaml",
        "lang": "yaml",
        "bytes": 10027
      },
      {
        "path": "prerequisite/infrastructure.yaml",
        "lang": "yaml",
        "bytes": 59793
      },
      {
        "path": "prerequisite/lambda/__init__.py",
        "lang": "python",
        "bytes": 0
      },
      {
        "path": "prerequisite/lambda/api_spec.json",
        "lang": "json",
        "bytes": 1324
      },
      {
        "path": "prerequisite/lambda/python/__init__.py",
        "lang": "python",
        "bytes": 0
      },
      {
        "path": "prerequisite/lambda/python/check_warranty.py",
        "lang": "python",
        "bytes": 6364
      },
      {
        "path": "prerequisite/lambda/python/lambda_function.py",
        "lang": "python",
        "bytes": 2118
      },
      {
        "path": "prerequisite/lambda/python/web_search.py",
        "lang": "python",
        "bytes": 683
      },
      {
        "path": "requirements.txt",
        "lang": "text",
        "bytes": 178
      },
      {
        "path": "scripts/__init__.py",
        "lang": "python",
        "bytes": 0
      },
      {
        "path": "scripts/cleanup.sh",
        "lang": "bash",
        "bytes": 2345
      },
      {
        "path": "scripts/list_ssm_parameters.sh",
        "lang": "bash",
        "bytes": 460
      },
      {
        "path": "scripts/prereq.sh",
        "lang": "bash",
        "bytes": 5148
      }
    ]
  },
  {
    "slug": "06-workshops/10-Agent-Registry/00-getting-started/end-to-end/02-registry-end-to-end-oauth",
    "title": "AWS Agent Registry with OAuth Authentication",
    "desc": "AWS Agent Registry is a fully managed discovery service that provides a centralized catalog for organizing, curating, and discovering AI agents, MCP servers, agent skills, and custom resources...",
    "sectionId": "registry",
    "kind": "workshop",
    "frameworks": [],
    "languages": [],
    "hasNotebook": true,
    "readme": "/agentcore-samples/06-workshops/10-Agent-Registry/00-getting-started/end-to-end/02-registry-end-to-end-oauth/README.md",
    "base": "/agentcore-samples/06-workshops/10-Agent-Registry/00-getting-started/end-to-end/02-registry-end-to-end-oauth",
    "files": [
      {
        "path": "registry-end-to-end-oauth.md",
        "lang": "markdown",
        "bytes": 24807,
        "fromNotebook": true
      },
      {
        "path": "requirements.txt",
        "lang": "text",
        "bytes": 51
      }
    ]
  },
  {
    "slug": "06-workshops/10-Agent-Registry/01-advanced/admin-approval-workflow",
    "title": "Admin CI/CD and Approval Workflow for AWS Agent Registry",
    "desc": "Enterprise AI agent platforms require governance controls to ensure that only vetted, secure agents and tools are deployed into production. When multiple teams publish A2A Agents, MCP servers, and...",
    "sectionId": "registry",
    "kind": "workshop",
    "frameworks": [],
    "languages": [
      "python"
    ],
    "hasNotebook": true,
    "readme": "/agentcore-samples/06-workshops/10-Agent-Registry/01-advanced/admin-approval-workflow/README.md",
    "base": "/agentcore-samples/06-workshops/10-Agent-Registry/01-advanced/admin-approval-workflow",
    "files": [
      {
        "path": "IAM_PERMISSIONS.md",
        "lang": "markdown",
        "bytes": 9072
      },
      {
        "path": "admin-approval-workflow-notebook.md",
        "lang": "markdown",
        "bytes": 17176,
        "fromNotebook": true
      },
      {
        "path": "cfn_eventbridge.yaml",
        "lang": "yaml",
        "bytes": 23667
      },
      {
        "path": "deploy.sh",
        "lang": "bash",
        "bytes": 6092
      },
      {
        "path": "destroy.sh",
        "lang": "bash",
        "bytes": 1824
      },
      {
        "path": "requirements.txt",
        "lang": "text",
        "bytes": 6
      },
      {
        "path": "utils.py",
        "lang": "python",
        "bytes": 1475
      }
    ]
  },
  {
    "slug": "06-workshops/10-Agent-Registry/01-advanced/discovery-and-invocation-at-runtime",
    "title": "Discovering Tools and Agents at Runtime Using AWS Agent Registry",
    "desc": "This tutorial demonstrates an autonomous agent that discovers tools and agents at runtime via AWS Agent Registry semantic search and invokes them dynamically — zero hardcoded integrations.",
    "sectionId": "registry",
    "kind": "workshop",
    "frameworks": [
      "Strands"
    ],
    "languages": [
      "python"
    ],
    "hasNotebook": true,
    "readme": "/agentcore-samples/06-workshops/10-Agent-Registry/01-advanced/discovery-and-invocation-at-runtime/README.md",
    "base": "/agentcore-samples/06-workshops/10-Agent-Registry/01-advanced/discovery-and-invocation-at-runtime",
    "files": [
      {
        "path": "cleanup.py",
        "lang": "python",
        "bytes": 7314
      },
      {
        "path": "discovery-and-invocation-at-runtime.md",
        "lang": "markdown",
        "bytes": 41473,
        "fromNotebook": true
      },
      {
        "path": "utils.py",
        "lang": "python",
        "bytes": 17186
      }
    ]
  },
  {
    "slug": "06-workshops/10-Agent-Registry/01-advanced/publish-agentcore-tools-in-registry",
    "title": "Publishing AgentCore Tools in AWS Agent Registry",
    "desc": "When organizations operate dozens or hundreds of AI agents, MCP servers, and tools, keeping track of what exists, who owns it, and whether it's approved for use becomes a real problem. Teams end...",
    "sectionId": "registry",
    "kind": "workshop",
    "frameworks": [
      "Strands"
    ],
    "languages": [],
    "hasNotebook": true,
    "readme": "/agentcore-samples/06-workshops/10-Agent-Registry/01-advanced/publish-agentcore-tools-in-registry/README.md",
    "base": "/agentcore-samples/06-workshops/10-Agent-Registry/01-advanced/publish-agentcore-tools-in-registry",
    "files": [
      {
        "path": "agents/a2a/requirements.txt",
        "lang": "text",
        "bytes": 135
      },
      {
        "path": "agents/mcp/requirements.txt",
        "lang": "text",
        "bytes": 88
      },
      {
        "path": "publish-agentcore-a2a-mcp-in-registry.md",
        "lang": "markdown",
        "bytes": 32587,
        "fromNotebook": true
      },
      {
        "path": "requirements.txt",
        "lang": "text",
        "bytes": 141
      }
    ]
  },
  {
    "slug": "06-workshops/10-Agent-Registry/01-advanced/registry-push-sync-lambda",
    "title": "Synchronizing Metadata with the AWS Agent Registry",
    "desc": "There are two ways to keep MCP and A2A server metadata in sync with the AWS Agent Registry: pull-based and push-based.",
    "sectionId": "registry",
    "kind": "workshop",
    "frameworks": [],
    "languages": [
      "python"
    ],
    "hasNotebook": true,
    "readme": "/agentcore-samples/06-workshops/10-Agent-Registry/01-advanced/registry-push-sync-lambda/README.md",
    "base": "/agentcore-samples/06-workshops/10-Agent-Registry/01-advanced/registry-push-sync-lambda",
    "files": [
      {
        "path": "deploy_lambda_push_sync.md",
        "lang": "markdown",
        "bytes": 36222,
        "fromNotebook": true
      },
      {
        "path": "handler.py",
        "lang": "python",
        "bytes": 15098
      },
      {
        "path": "requirements.txt",
        "lang": "text",
        "bytes": 50
      }
    ]
  },
  {
    "slug": "06-workshops/10-Agent-Registry/01-advanced/registry-skills-dynamic-discovery",
    "title": "Publishing and Discovering Agent Skills with AWS Agent Registry",
    "desc": "AWS Agent Registry is a fully managed discovery service that provides a centralized catalog for organizing, curating, and discovering AI agents, MCP servers, agent skills, and custom resources...",
    "sectionId": "registry",
    "kind": "workshop",
    "frameworks": [
      "Strands"
    ],
    "languages": [
      "python"
    ],
    "hasNotebook": true,
    "readme": "/agentcore-samples/06-workshops/10-Agent-Registry/01-advanced/registry-skills-dynamic-discovery/README.md",
    "base": "/agentcore-samples/06-workshops/10-Agent-Registry/01-advanced/registry-skills-dynamic-discovery",
    "files": [
      {
        "path": "registry-skills-dynamic-discovery.md",
        "lang": "markdown",
        "bytes": 20021,
        "fromNotebook": true
      },
      {
        "path": "requirements.txt",
        "lang": "text",
        "bytes": 87
      },
      {
        "path": "skill registry/pdf SKILL.md",
        "lang": "markdown",
        "bytes": 8072
      },
      {
        "path": "utils/python_exec_tool.py",
        "lang": "python",
        "bytes": 2632
      },
      {
        "path": "utils/skill_loader.py",
        "lang": "python",
        "bytes": 7104
      }
    ]
  },
  {
    "slug": "06-workshops/10-Agent-Registry/01-advanced/registry-synchronize-mcpserver",
    "title": "Synchronize MCP Server Metadata to AWS Agent Registry",
    "desc": "This tutorial demonstrates how to use AWS Agent Registry's URL-based synchronization to automatically extract and register MCP server metadata (server schema, tools, descriptions, and versions)...",
    "sectionId": "registry",
    "kind": "workshop",
    "frameworks": [],
    "languages": [],
    "hasNotebook": true,
    "readme": "/agentcore-samples/06-workshops/10-Agent-Registry/01-advanced/registry-synchronize-mcpserver/README.md",
    "base": "/agentcore-samples/06-workshops/10-Agent-Registry/01-advanced/registry-synchronize-mcpserver",
    "files": [
      {
        "path": "registry_synchronize_mcpserver.md",
        "lang": "markdown",
        "bytes": 33503,
        "fromNotebook": true
      },
      {
        "path": "requirements.txt",
        "lang": "text",
        "bytes": 113
      }
    ]
  },
  {
    "slug": "06-workshops/11-AgentCore-harness/00-getting-started",
    "title": "Getting Started with harness in AgentCore",
    "desc": "This folder contains the introductory tutorial for harness in Amazon Bedrock AgentCore.",
    "sectionId": "harness",
    "kind": "workshop",
    "frameworks": [
      "OpenAI Agents"
    ],
    "languages": [],
    "hasNotebook": true,
    "readme": "/agentcore-samples/06-workshops/11-AgentCore-harness/00-getting-started/README.md",
    "base": "/agentcore-samples/06-workshops/11-AgentCore-harness/00-getting-started",
    "files": [
      {
        "path": "01_getting_started_bedrock.md",
        "lang": "markdown",
        "bytes": 6790,
        "fromNotebook": true
      },
      {
        "path": "CLI.md",
        "lang": "markdown",
        "bytes": 1690
      }
    ]
  },
  {
    "slug": "06-workshops/11-AgentCore-harness/01-advanced-examples/01-custom-containers",
    "title": "01 — Custom Containers",
    "desc": "Run a harness agent inside your own container image instead of the default Amazon Linux VM. This unlocks any runtime, system library, or pre-installed dependency your agent needs.",
    "sectionId": "harness",
    "kind": "workshop",
    "frameworks": [],
    "languages": [
      "python"
    ],
    "hasNotebook": true,
    "readme": "/agentcore-samples/06-workshops/11-AgentCore-harness/01-advanced-examples/01-custom-containers/README.md",
    "base": "/agentcore-samples/06-workshops/11-AgentCore-harness/01-advanced-examples/01-custom-containers",
    "files": [
      {
        "path": "01_custom_container_node.md",
        "lang": "markdown",
        "bytes": 9825,
        "fromNotebook": true
      },
      {
        "path": "02_custom_container_cli.py",
        "lang": "python",
        "bytes": 11513
      },
      {
        "path": "03_custom_container_go.md",
        "lang": "markdown",
        "bytes": 7770,
        "fromNotebook": true
      }
    ]
  },
  {
    "slug": "06-workshops/11-AgentCore-harness/01-advanced-examples/02-gateway-integration",
    "title": "02 — AgentCore Gateway Integration",
    "desc": "Wire a harness agent to an AgentCore Gateway so it can reach external MCP tool servers through a managed proxy — with centralized auth, routing, and observability.",
    "sectionId": "harness",
    "kind": "workshop",
    "frameworks": [],
    "languages": [
      "python"
    ],
    "hasNotebook": false,
    "readme": "/agentcore-samples/06-workshops/11-AgentCore-harness/01-advanced-examples/02-gateway-integration/README.md",
    "base": "/agentcore-samples/06-workshops/11-AgentCore-harness/01-advanced-examples/02-gateway-integration",
    "files": [
      {
        "path": "02_agentcore_gateway_integration.py",
        "lang": "python",
        "bytes": 14320
      }
    ]
  },
  {
    "slug": "06-workshops/11-AgentCore-harness/01-advanced-examples/03-execution-limits",
    "title": "03 — Execution Limits",
    "desc": "Limit how much work a harness agent can do per invocation by setting execution limits. Useful for predictable latency, bounded cost, and guardrails against runaway agents.",
    "sectionId": "harness",
    "kind": "workshop",
    "frameworks": [],
    "languages": [],
    "hasNotebook": true,
    "readme": "/agentcore-samples/06-workshops/11-AgentCore-harness/01-advanced-examples/03-execution-limits/README.md",
    "base": "/agentcore-samples/06-workshops/11-AgentCore-harness/01-advanced-examples/03-execution-limits",
    "files": [
      {
        "path": "03_execution_limits.md",
        "lang": "markdown",
        "bytes": 7118,
        "fromNotebook": true
      }
    ]
  },
  {
    "slug": "06-workshops/11-AgentCore-harness/01-advanced-examples/04-mcp-integration",
    "title": "04 — MCP Integration",
    "desc": "Connect harness agent to MCP (Model Context Protocol) servers to extend its capabilities with tools exposed by third-party providers (search, knowledge bases, APIs, etc.) — declaratively, without...",
    "sectionId": "harness",
    "kind": "workshop",
    "frameworks": [],
    "languages": [],
    "hasNotebook": true,
    "readme": "/agentcore-samples/06-workshops/11-AgentCore-harness/01-advanced-examples/04-mcp-integration/README.md",
    "base": "/agentcore-samples/06-workshops/11-AgentCore-harness/01-advanced-examples/04-mcp-integration",
    "files": [
      {
        "path": "04_mcp_integration.md",
        "lang": "markdown",
        "bytes": 16876,
        "fromNotebook": true
      }
    ]
  },
  {
    "slug": "06-workshops/11-AgentCore-harness/01-advanced-examples/05-agent-skills",
    "title": "05 — Agent Skills",
    "desc": "Extend harness agent with Agent Skills — bundles of files, code, and instructions installed on the agent's microVM filesystem. Skills give the agent domain-specific capabilities (e.g., generating...",
    "sectionId": "harness",
    "kind": "workshop",
    "frameworks": [],
    "languages": [],
    "hasNotebook": true,
    "readme": "/agentcore-samples/06-workshops/11-AgentCore-harness/01-advanced-examples/05-agent-skills/README.md",
    "base": "/agentcore-samples/06-workshops/11-AgentCore-harness/01-advanced-examples/05-agent-skills",
    "files": [
      {
        "path": "05_agent_skills.md",
        "lang": "markdown",
        "bytes": 14970,
        "fromNotebook": true
      }
    ]
  },
  {
    "slug": "06-workshops/11-AgentCore-harness/01-advanced-examples/07-oauth",
    "title": "harness with OAuth Inbound Auth and OAuth-Protected Gateway",
    "desc": "This sample demonstrates end-to-end OAuth integration with AgentCore harness:",
    "sectionId": "harness",
    "kind": "workshop",
    "frameworks": [],
    "languages": [
      "python"
    ],
    "hasNotebook": true,
    "readme": "/agentcore-samples/06-workshops/11-AgentCore-harness/01-advanced-examples/07-oauth/README.md",
    "base": "/agentcore-samples/06-workshops/11-AgentCore-harness/01-advanced-examples/07-oauth",
    "files": [
      {
        "path": "harness_oauth_gateway.md",
        "lang": "markdown",
        "bytes": 13434,
        "fromNotebook": true
      },
      {
        "path": "requirements.txt",
        "lang": "text",
        "bytes": 31
      },
      {
        "path": "utils/__init__.py",
        "lang": "python",
        "bytes": 16
      },
      {
        "path": "utils/lambda_function_code.py",
        "lang": "python",
        "bytes": 3047
      },
      {
        "path": "utils/setup_helpers.py",
        "lang": "python",
        "bytes": 31258
      }
    ]
  },
  {
    "slug": "06-workshops/11-AgentCore-harness/02-use-cases/01-travel-agent",
    "title": "01 — Travel Guide Agent",
    "desc": "A full end-to-end Harness agent that doubles as a tour of every Harness feature — built around a travel-guide persona that recommends destinations, renders itineraries, and remembers users across...",
    "sectionId": "harness",
    "kind": "workshop",
    "frameworks": [
      "OpenAI Agents"
    ],
    "languages": [],
    "hasNotebook": true,
    "readme": "/agentcore-samples/06-workshops/11-AgentCore-harness/02-use-cases/01-travel-agent/README.md",
    "base": "/agentcore-samples/06-workshops/11-AgentCore-harness/02-use-cases/01-travel-agent",
    "files": [
      {
        "path": "01_travel_guide_agent.md",
        "lang": "markdown",
        "bytes": 25980,
        "fromNotebook": true
      }
    ]
  },
  {
    "slug": "06-workshops/11-AgentCore-harness/02-use-cases/02-webapp-visual-testing",
    "title": "02 — Webapp Visual Testing Agent",
    "desc": "An AI-powered automated visual QA pipeline: hand the agent a web app and it builds it, runs it, tests it, and returns screenshots of every step — all inside the isolated Harness microVM.",
    "sectionId": "harness",
    "kind": "workshop",
    "frameworks": [],
    "languages": [],
    "hasNotebook": true,
    "readme": "/agentcore-samples/06-workshops/11-AgentCore-harness/02-use-cases/02-webapp-visual-testing/README.md",
    "base": "/agentcore-samples/06-workshops/11-AgentCore-harness/02-use-cases/02-webapp-visual-testing",
    "files": [
      {
        "path": "02_webapp_visual_testing_agent.md",
        "lang": "markdown",
        "bytes": 10745,
        "fromNotebook": true
      }
    ]
  },
  {
    "slug": "06-workshops/12-AgentCore-optimization",
    "title": "AgentCore Optimization Tutorial — HR Assistant",
    "desc": "This tutorial demonstrates the complete Amazon Bedrock AgentCore Optimization workflow: measure your agent's baseline performance, generate AI-driven recommendations, package them into...",
    "sectionId": "optimization",
    "kind": "workshop",
    "frameworks": [
      "Strands"
    ],
    "languages": [
      "python"
    ],
    "hasNotebook": true,
    "readme": "/agentcore-samples/06-workshops/12-AgentCore-optimization/README.md",
    "base": "/agentcore-samples/06-workshops/12-AgentCore-optimization",
    "files": [
      {
        "path": "deploy_agent.py",
        "lang": "python",
        "bytes": 13537
      },
      {
        "path": "hr_assistant_agent.py",
        "lang": "python",
        "bytes": 12069
      },
      {
        "path": "optimization_tutorial.md",
        "lang": "markdown",
        "bytes": 64205,
        "fromNotebook": true
      },
      {
        "path": "requirements.txt",
        "lang": "text",
        "bytes": 94
      }
    ]
  },
  {
    "slug": "06-workshops/13-AgentCore-payments/00-getting-started",
    "title": "Amazon Bedrock AgentCore payments — Tutorials",
    "desc": "Step-by-step Jupyter notebook tutorials for building payment-enabled AI agents with Amazon Bedrock AgentCore payments.",
    "sectionId": "payments",
    "kind": "workshop",
    "frameworks": [
      "Strands"
    ],
    "languages": [
      "python"
    ],
    "hasNotebook": false,
    "readme": "/agentcore-samples/06-workshops/13-AgentCore-payments/00-getting-started/README.md",
    "base": "/agentcore-samples/06-workshops/13-AgentCore-payments/00-getting-started",
    "files": [
      {
        "path": "utils.py",
        "lang": "python",
        "bytes": 41679
      }
    ]
  },
  {
    "slug": "06-workshops/13-AgentCore-payments/00-getting-started/00-setup-agentcore-payments",
    "title": "Set Up AgentCore payments",
    "desc": "This tutorial walks you through the complete setup of Amazon Bedrock AgentCore payments using the AWS SDK (boto3). You'll create IAM roles, configure wallet credentials, and provision the payment...",
    "sectionId": "payments",
    "kind": "workshop",
    "frameworks": [],
    "languages": [],
    "hasNotebook": true,
    "readme": "/agentcore-samples/06-workshops/13-AgentCore-payments/00-getting-started/00-setup-agentcore-payments/README.md",
    "base": "/agentcore-samples/06-workshops/13-AgentCore-payments/00-getting-started/00-setup-agentcore-payments",
    "files": [
      {
        "path": "00b_multi_provider_setup.md",
        "lang": "markdown",
        "bytes": 13920,
        "fromNotebook": true
      },
      {
        "path": "requirements.txt",
        "lang": "text",
        "bytes": 125
      },
      {
        "path": "setup_agentcore_payments.md",
        "lang": "markdown",
        "bytes": 46019,
        "fromNotebook": true
      }
    ]
  },
  {
    "slug": "06-workshops/13-AgentCore-payments/00-getting-started/00-setup-agentcore-payments/providers",
    "title": "Provider Account Setup Guides",
    "desc": "Before running Tutorial 00, you need credentials from a supported wallet provider. These guides walk you through creating an account and obtaining the credentials that Tutorial 00 expects in your...",
    "sectionId": "payments",
    "kind": "workshop",
    "frameworks": [],
    "languages": [],
    "hasNotebook": true,
    "readme": "/agentcore-samples/06-workshops/13-AgentCore-payments/00-getting-started/00-setup-agentcore-payments/providers/README.md",
    "base": "/agentcore-samples/06-workshops/13-AgentCore-payments/00-getting-started/00-setup-agentcore-payments/providers",
    "files": [
      {
        "path": "coinbase_cdp_account_setup.md",
        "lang": "markdown",
        "bytes": 8613,
        "fromNotebook": true
      },
      {
        "path": "requirements.txt",
        "lang": "text",
        "bytes": 38
      },
      {
        "path": "stripe_privy_account_setup.md",
        "lang": "markdown",
        "bytes": 11990,
        "fromNotebook": true
      }
    ]
  },
  {
    "slug": "06-workshops/13-AgentCore-payments/00-getting-started/01-agents-payments-and-limits",
    "title": "Enable Payment Limits on an Agent",
    "desc": "This tutorial builds a payment-enabled agent that accesses paid x402 endpoints on Coinbase Bazaar. Two notebooks show the same payment flow with different frameworks — proving AgentCore payments...",
    "sectionId": "payments",
    "kind": "workshop",
    "frameworks": [
      "Strands",
      "LangGraph",
      "LangChain"
    ],
    "languages": [],
    "hasNotebook": true,
    "readme": "/agentcore-samples/06-workshops/13-AgentCore-payments/00-getting-started/01-agents-payments-and-limits/README.md",
    "base": "/agentcore-samples/06-workshops/13-AgentCore-payments/00-getting-started/01-agents-payments-and-limits",
    "files": [
      {
        "path": "langgraph_payment_agent.md",
        "lang": "markdown",
        "bytes": 19599,
        "fromNotebook": true
      },
      {
        "path": "langgraph_payment_agent_middleware.md",
        "lang": "markdown",
        "bytes": 15458,
        "fromNotebook": true
      },
      {
        "path": "requirements.txt",
        "lang": "text",
        "bytes": 513
      },
      {
        "path": "strands_payment_agent.md",
        "lang": "markdown",
        "bytes": 24033,
        "fromNotebook": true
      }
    ]
  },
  {
    "slug": "06-workshops/13-AgentCore-payments/00-getting-started/02-deploy-to-agentcore-runtime",
    "title": "Deploy Payment Agent to AgentCore Runtime",
    "desc": "Deploy a payment-enabled Strands agent to AgentCore Runtime with role separation and observability. The agent runs under a dedicated execution role — the plugin calls ProcessPayment on behalf of...",
    "sectionId": "payments",
    "kind": "workshop",
    "frameworks": [
      "Strands"
    ],
    "languages": [
      "python"
    ],
    "hasNotebook": true,
    "readme": "/agentcore-samples/06-workshops/13-AgentCore-payments/00-getting-started/02-deploy-to-agentcore-runtime/README.md",
    "base": "/agentcore-samples/06-workshops/13-AgentCore-payments/00-getting-started/02-deploy-to-agentcore-runtime",
    "files": [
      {
        "path": "deploy_payment_agent.md",
        "lang": "markdown",
        "bytes": 14608,
        "fromNotebook": true
      },
      {
        "path": "payment_agent.py",
        "lang": "python",
        "bytes": 4483
      },
      {
        "path": "requirements.txt",
        "lang": "text",
        "bytes": 281
      }
    ]
  },
  {
    "slug": "06-workshops/13-AgentCore-payments/00-getting-started/03-user-onboarding-wallet-funding",
    "title": "User Onboarding and Backend Wallet Operations",
    "desc": "Tutorial 00 creates the infrastructure and gets your first wallet funded. This tutorial covers the full wallet lifecycle in depth, split into two parts:",
    "sectionId": "payments",
    "kind": "workshop",
    "frameworks": [],
    "languages": [],
    "hasNotebook": true,
    "readme": "/agentcore-samples/06-workshops/13-AgentCore-payments/00-getting-started/03-user-onboarding-wallet-funding/README.md",
    "base": "/agentcore-samples/06-workshops/13-AgentCore-payments/00-getting-started/03-user-onboarding-wallet-funding",
    "files": [
      {
        "path": "requirements.txt",
        "lang": "text",
        "bytes": 115
      },
      {
        "path": "user_onboarding.md",
        "lang": "markdown",
        "bytes": 21135,
        "fromNotebook": true
      }
    ]
  },
  {
    "slug": "06-workshops/13-AgentCore-payments/00-getting-started/04-agent-with-coinbase-bazaar-via-gateway",
    "title": "Integrate Your Agent with Coinbase Bazaar via AgentCore Gateway",
    "desc": "The Coinbase x402 Bazaar is an MCP marketplace exposing 10,000+ pay-per-use x402 endpoints. Agents discover tools via semantic search and pay per call using x402. This tutorial connects a Strands...",
    "sectionId": "gateway",
    "kind": "workshop",
    "frameworks": [
      "Strands"
    ],
    "languages": [],
    "hasNotebook": true,
    "readme": "/agentcore-samples/06-workshops/13-AgentCore-payments/00-getting-started/04-agent-with-coinbase-bazaar-via-gateway/README.md",
    "base": "/agentcore-samples/06-workshops/13-AgentCore-payments/00-getting-started/04-agent-with-coinbase-bazaar-via-gateway",
    "files": [
      {
        "path": "bazaar_gateway_agent.md",
        "lang": "markdown",
        "bytes": 21907,
        "fromNotebook": true
      },
      {
        "path": "requirements.txt",
        "lang": "text",
        "bytes": 203
      }
    ]
  },
  {
    "slug": "06-workshops/13-AgentCore-payments/00-getting-started/05-agent-with-browser-tool-pay-for-content",
    "title": "Agent with Browser Tool — Pay for Gated Content",
    "desc": "AgentCore Browser enables agents to autonomously access paywalled websites that support x402, securely through the AgentCore Browser and payments combination. This tutorial builds a custom Strands...",
    "sectionId": "browser",
    "kind": "workshop",
    "frameworks": [
      "Strands"
    ],
    "languages": [],
    "hasNotebook": true,
    "readme": "/agentcore-samples/06-workshops/13-AgentCore-payments/00-getting-started/05-agent-with-browser-tool-pay-for-content/README.md",
    "base": "/agentcore-samples/06-workshops/13-AgentCore-payments/00-getting-started/05-agent-with-browser-tool-pay-for-content",
    "files": [
      {
        "path": "browser_paywall_payments.md",
        "lang": "markdown",
        "bytes": 17472,
        "fromNotebook": true
      },
      {
        "path": "requirements.txt",
        "lang": "text",
        "bytes": 145
      }
    ]
  },
  {
    "slug": "06-workshops/13-AgentCore-payments/00-getting-started/06-research-agent-with-payment-memory",
    "title": "Research Agent with Payment Memory",
    "desc": "This tutorial combines AgentCore payments and AgentCore Memory to build a research agent that gets smarter over time. The agent checks what it already knows before paying for fresh data — saving...",
    "sectionId": "memory",
    "kind": "workshop",
    "frameworks": [
      "Strands"
    ],
    "languages": [],
    "hasNotebook": true,
    "readme": "/agentcore-samples/06-workshops/13-AgentCore-payments/00-getting-started/06-research-agent-with-payment-memory/README.md",
    "base": "/agentcore-samples/06-workshops/13-AgentCore-payments/00-getting-started/06-research-agent-with-payment-memory",
    "files": [
      {
        "path": "requirements.txt",
        "lang": "text",
        "bytes": 126
      },
      {
        "path": "research_agent_with_memory.md",
        "lang": "markdown",
        "bytes": 25922,
        "fromNotebook": true
      }
    ]
  },
  {
    "slug": "06-workshops/13-AgentCore-payments/00-getting-started/07-multi-agent-payment-orchestrator",
    "title": "Multi-Agent Payment Orchestrator",
    "desc": "This tutorial builds a multi-agent system with per-agent budgets, multi-wallet support, and full spend attribution — then deploys it to AgentCore Runtime with role separation, observability, and...",
    "sectionId": "payments",
    "kind": "workshop",
    "frameworks": [
      "Strands"
    ],
    "languages": [
      "python"
    ],
    "hasNotebook": true,
    "readme": "/agentcore-samples/06-workshops/13-AgentCore-payments/00-getting-started/07-multi-agent-payment-orchestrator/README.md",
    "base": "/agentcore-samples/06-workshops/13-AgentCore-payments/00-getting-started/07-multi-agent-payment-orchestrator",
    "files": [
      {
        "path": "multi_agent_payments.md",
        "lang": "markdown",
        "bytes": 32534,
        "fromNotebook": true
      },
      {
        "path": "payment_orchestrator.py",
        "lang": "python",
        "bytes": 6501
      },
      {
        "path": "requirements.txt",
        "lang": "text",
        "bytes": 144
      }
    ]
  },
  {
    "slug": "06-workshops/13-AgentCore-payments/02-use-cases/pay-for-api-agent",
    "title": "Pay-For-API",
    "desc": "Amazon Bedrock AgentCore Payments enables AI agents to make autonomous payments for digital services. Agents never hold private keys or require human approval for each transaction.",
    "sectionId": "payments",
    "kind": "workshop",
    "frameworks": [
      "Strands"
    ],
    "languages": [
      "javascript",
      "python"
    ],
    "hasNotebook": true,
    "readme": "/agentcore-samples/06-workshops/13-AgentCore-payments/02-use-cases/pay-for-api-agent/README.md",
    "base": "/agentcore-samples/06-workshops/13-AgentCore-payments/02-use-cases/pay-for-api-agent",
    "files": [
      {
        "path": "agent/README.md",
        "lang": "markdown",
        "bytes": 5388
      },
      {
        "path": "agent/cdk/agent_stack.py",
        "lang": "python",
        "bytes": 24280
      },
      {
        "path": "agent/cdk/app.py",
        "lang": "python",
        "bytes": 676
      },
      {
        "path": "agent/cdk/cdk.json",
        "lang": "json",
        "bytes": 315
      },
      {
        "path": "agent/cdk/requirements.txt",
        "lang": "text",
        "bytes": 48
      },
      {
        "path": "agent/container/agent.py",
        "lang": "python",
        "bytes": 19658
      },
      {
        "path": "agent/container/requirements.txt",
        "lang": "text",
        "bytes": 942
      },
      {
        "path": "env-sample.txt",
        "lang": "text",
        "bytes": 7311
      },
      {
        "path": "pay-for-api.md",
        "lang": "markdown",
        "bytes": 105299,
        "fromNotebook": true
      },
      {
        "path": "requirements.txt",
        "lang": "text",
        "bytes": 145
      },
      {
        "path": "seller/cdk/app.py",
        "lang": "python",
        "bytes": 782
      },
      {
        "path": "seller/cdk/cdk.json",
        "lang": "json",
        "bytes": 438
      },
      {
        "path": "seller/cdk/requirements.txt",
        "lang": "text",
        "bytes": 48
      },
      {
        "path": "seller/cdk/seller_stack.py",
        "lang": "python",
        "bytes": 6611
      },
      {
        "path": "seller/lambda/index.js",
        "lang": "javascript",
        "bytes": 10767
      },
      {
        "path": "seller/lambda/package.json",
        "lang": "json",
        "bytes": 337
      },
      {
        "path": "utils.py",
        "lang": "python",
        "bytes": 5684
      }
    ]
  },
  {
    "slug": "06-workshops/13-AgentCore-payments/02-use-cases/pay-for-api-agent/test/integration",
    "title": "test/integration/",
    "desc": "Operational scripts for the Pay-For-API use case. Run them from the use-case root (02-use-cases/01-pay-for-api/); each script resolves its paths relative to this folder, so it does not matter...",
    "sectionId": "payments",
    "kind": "workshop",
    "frameworks": [],
    "languages": [
      "python"
    ],
    "hasNotebook": false,
    "readme": "/agentcore-samples/06-workshops/13-AgentCore-payments/02-use-cases/pay-for-api-agent/test/integration/README.md",
    "base": "/agentcore-samples/06-workshops/13-AgentCore-payments/02-use-cases/pay-for-api-agent/test/integration",
    "files": [
      {
        "path": "deploy-agent.sh",
        "lang": "bash",
        "bytes": 3732
      },
      {
        "path": "deploy-seller.sh",
        "lang": "bash",
        "bytes": 6116
      },
      {
        "path": "destroy-agent.sh",
        "lang": "bash",
        "bytes": 1250
      },
      {
        "path": "destroy-seller.sh",
        "lang": "bash",
        "bytes": 645
      },
      {
        "path": "setup-env.sh",
        "lang": "bash",
        "bytes": 303
      },
      {
        "path": "setup-roles.sh",
        "lang": "bash",
        "bytes": 14710
      },
      {
        "path": "setup_env.py",
        "lang": "python",
        "bytes": 5042
      }
    ]
  },
  {
    "slug": "06-workshops/13-AgentCore-payments/02-use-cases/pay-for-content-browser-use",
    "title": "Pay for Content — Browser Use Case (AgentCore Runtime)",
    "desc": "\"Amazon Bedrock AgentCore payments enables AI agents to make autonomous payments for digital services — without ever holding private keys or requiring human approval for each transaction.\"",
    "sectionId": "browser",
    "kind": "workshop",
    "frameworks": [
      "Strands"
    ],
    "languages": [
      "python"
    ],
    "hasNotebook": true,
    "readme": "/agentcore-samples/06-workshops/13-AgentCore-payments/02-use-cases/pay-for-content-browser-use/README.md",
    "base": "/agentcore-samples/06-workshops/13-AgentCore-payments/02-use-cases/pay-for-content-browser-use",
    "files": [
      {
        "path": "agent/payment_agent.py",
        "lang": "python",
        "bytes": 8056
      },
      {
        "path": "agent/requirements.txt",
        "lang": "text",
        "bytes": 213
      },
      {
        "path": "pay_for_content_browser.md",
        "lang": "markdown",
        "bytes": 44060,
        "fromNotebook": true
      },
      {
        "path": "requirements.txt",
        "lang": "text",
        "bytes": 167
      },
      {
        "path": "setup_roles.sh",
        "lang": "bash",
        "bytes": 16765
      }
    ]
  },
  {
    "slug": "06-workshops/13-AgentCore-payments/02-use-cases/pay-for-content-browser-use/content-provider",
    "title": "Demo Content Provider — x402 Paywall",
    "desc": "A CloudFront + Lambda@Edge deployment that serves paywalled content using the x402 v2 protocol. Used as the \"seller\" side of the Pay for Content (Browser) use case.",
    "sectionId": "browser",
    "kind": "workshop",
    "frameworks": [],
    "languages": [
      "javascript",
      "typescript"
    ],
    "hasNotebook": false,
    "readme": "/agentcore-samples/06-workshops/13-AgentCore-payments/02-use-cases/pay-for-content-browser-use/content-provider/README.md",
    "base": "/agentcore-samples/06-workshops/13-AgentCore-payments/02-use-cases/pay-for-content-browser-use/content-provider",
    "files": [
      {
        "path": "cdk/bin/app.ts",
        "lang": "typescript",
        "bytes": 860
      },
      {
        "path": "cdk/cdk.json",
        "lang": "json",
        "bytes": 433
      },
      {
        "path": "cdk/package.json",
        "lang": "json",
        "bytes": 479
      },
      {
        "path": "cdk/tsconfig.json",
        "lang": "json",
        "bytes": 388
      },
      {
        "path": "deploy.sh",
        "lang": "bash",
        "bytes": 4006
      },
      {
        "path": "index.js",
        "lang": "javascript",
        "bytes": 9780
      },
      {
        "path": "lambda/x402-verify/index.ts",
        "lang": "typescript",
        "bytes": 12375
      },
      {
        "path": "lambda/x402-verify/package.json",
        "lang": "json",
        "bytes": 201
      },
      {
        "path": "package.json",
        "lang": "json",
        "bytes": 383
      },
      {
        "path": "site/article/paywall-demo.html",
        "lang": "html",
        "bytes": 468
      },
      {
        "path": "site/index.html",
        "lang": "html",
        "bytes": 2447
      }
    ]
  },
  {
    "slug": "06-workshops/13-AgentCore-payments/02-use-cases/pay-for-data",
    "title": "Pay for Data — Heurist Finance Agent",
    "desc": "A finance research agent that pays for real-time market data using Amazon Bedrock AgentCore payments. The agent calls paid Heurist endpoints for live prices, SEC filings, and macro indicators,...",
    "sectionId": "payments",
    "kind": "workshop",
    "frameworks": [
      "Strands"
    ],
    "languages": [
      "python"
    ],
    "hasNotebook": true,
    "readme": "/agentcore-samples/06-workshops/13-AgentCore-payments/02-use-cases/pay-for-data/README.md",
    "base": "/agentcore-samples/06-workshops/13-AgentCore-payments/02-use-cases/pay-for-data",
    "files": [
      {
        "path": "agent/catalog.py",
        "lang": "python",
        "bytes": 8555
      },
      {
        "path": "agent/config.py",
        "lang": "python",
        "bytes": 3927
      },
      {
        "path": "agent/main.py",
        "lang": "python",
        "bytes": 23033
      },
      {
        "path": "agent/requirements.txt",
        "lang": "text",
        "bytes": 191
      },
      {
        "path": "agent/sync_registry.py",
        "lang": "python",
        "bytes": 1140
      },
      {
        "path": "pay-for-data.md",
        "lang": "markdown",
        "bytes": 47319,
        "fromNotebook": true
      }
    ]
  }
];

export const AGENTCORE_SAMPLE_OVERVIEWS = [
  {
    "slug": "01-features",
    "title": "Amazon Bedrock AgentCore — Feature Tutorials",
    "desc": "Amazon Bedrock AgentCore is an agentic platform for building, deploying, and operating highly effective agents securely at scale using any framework and foundation model. With AgentCore, you can...",
    "sectionId": null,
    "kind": "overview",
    "readme": "/agentcore-samples/01-features/README.md",
    "base": "/agentcore-samples/01-features"
  },
  {
    "slug": "01-features/01-harness",
    "title": "AgentCore harness",
    "desc": "Every agent has an orchestration layer which contains the loop that calls the model, decides which tool to invoke, passes results back, manages context windows, and handles failures. Running that...",
    "sectionId": "harness",
    "kind": "overview",
    "readme": "/agentcore-samples/01-features/01-harness/README.md",
    "base": "/agentcore-samples/01-features/01-harness"
  },
  {
    "slug": "01-features/01-harness/01-advanced-examples/11-mantle",
    "title": "Run a harness on the Bedrock Mantle (OpenAI-compatible) endpoint",
    "desc": "These examples run an AgentCore harness against the Mantle endpoint (bedrock-mantle..api.aws), the OpenAI-compatible face of Amazon Bedrock. You select it on the harness with --api-format...",
    "sectionId": "harness",
    "kind": "overview",
    "readme": "/agentcore-samples/01-features/01-harness/01-advanced-examples/11-mantle/README.md",
    "base": "/agentcore-samples/01-features/01-harness/01-advanced-examples/11-mantle"
  },
  {
    "slug": "01-features/02-host-your-agent",
    "title": "Host Your Agent",
    "desc": "Deploy AI agents and MCP tool servers on Amazon Bedrock AgentCore — a secure, serverless hosting environment with session isolation, multi-protocol support (HTTP, MCP, A2A, AG-UI), and extended...",
    "sectionId": "runtime",
    "kind": "overview",
    "readme": "/agentcore-samples/01-features/02-host-your-agent/README.md",
    "base": "/agentcore-samples/01-features/02-host-your-agent"
  },
  {
    "slug": "01-features/02-host-your-agent/01-runtime",
    "title": "Amazon Bedrock AgentCore runtime",
    "desc": "Amazon Bedrock AgentCore runtime is a secure, serverless hosting environment for deploying and running AI agents and tools at scale.",
    "sectionId": "runtime",
    "kind": "overview",
    "readme": "/agentcore-samples/01-features/02-host-your-agent/01-runtime/README.md",
    "base": "/agentcore-samples/01-features/02-host-your-agent/01-runtime"
  },
  {
    "slug": "01-features/02-host-your-agent/01-runtime/01-hosting-agents",
    "title": "Hosting Agents on AgentCore runtime",
    "desc": "AgentCore runtime hosts your agents as HTTP services running in isolated microVMs. You write your agent logic, zip it with a requirements.txt, and deploy using boto3 — the runtime handles scaling,...",
    "sectionId": "runtime",
    "kind": "overview",
    "readme": "/agentcore-samples/01-features/02-host-your-agent/01-runtime/01-hosting-agents/README.md",
    "base": "/agentcore-samples/01-features/02-host-your-agent/01-runtime/01-hosting-agents"
  },
  {
    "slug": "01-features/02-host-your-agent/01-runtime/01-hosting-agents/01-http-protocol",
    "title": "Hosting Agents with HTTP Protocol",
    "desc": "The HTTP protocol is the default and most common way to host agents on AgentCore runtime. Your agent receives JSON payloads on POST /invocations and returns JSON responses (or streams via...",
    "sectionId": "runtime",
    "kind": "overview",
    "readme": "/agentcore-samples/01-features/02-host-your-agent/01-runtime/01-hosting-agents/01-http-protocol/README.md",
    "base": "/agentcore-samples/01-features/02-host-your-agent/01-runtime/01-hosting-agents/01-http-protocol"
  },
  {
    "slug": "01-features/02-host-your-agent/01-runtime/02-hosting-tools",
    "title": "Hosting MCP Tools on AgentCore runtime",
    "desc": "AgentCore runtime can host Model Context Protocol (MCP) servers, making your tools available to any MCP-compatible client. When you set the protocol to MCP, AgentCore runtime expects a stateless...",
    "sectionId": "runtime",
    "kind": "overview",
    "readme": "/agentcore-samples/01-features/02-host-your-agent/01-runtime/02-hosting-tools/README.md",
    "base": "/agentcore-samples/01-features/02-host-your-agent/01-runtime/02-hosting-tools"
  },
  {
    "slug": "01-features/02-host-your-agent/01-runtime/03-advanced",
    "title": "Advanced AgentCore runtime Capabilities",
    "desc": "Beyond basic agent and tool hosting, AgentCore runtime provides advanced capabilities for production workloads.",
    "sectionId": "runtime",
    "kind": "overview",
    "readme": "/agentcore-samples/01-features/02-host-your-agent/01-runtime/03-advanced/README.md",
    "base": "/agentcore-samples/01-features/02-host-your-agent/01-runtime/03-advanced"
  },
  {
    "slug": "01-features/02-host-your-agent/01-runtime/03-advanced/04-async-agents",
    "title": "Async Agents",
    "desc": "Asynchronous agents handle long-running tasks in the background while remaining responsive to the user. Instead of blocking until a task completes, the agent starts the work, returns a task ID,...",
    "sectionId": "runtime",
    "kind": "overview",
    "readme": "/agentcore-samples/01-features/02-host-your-agent/01-runtime/03-advanced/04-async-agents/README.md",
    "base": "/agentcore-samples/01-features/02-host-your-agent/01-runtime/03-advanced/04-async-agents"
  },
  {
    "slug": "01-features/02-host-your-agent/01-runtime/03-advanced/09-mcp-e2e",
    "title": "MCP End-to-End Examples",
    "desc": "The Model Context Protocol (MCP) defines a standard way for AI agents to discover and use tools, access resources, and interact with users through a structured protocol. AgentCore runtime supports...",
    "sectionId": "runtime",
    "kind": "overview",
    "readme": "/agentcore-samples/01-features/02-host-your-agent/01-runtime/03-advanced/09-mcp-e2e/README.md",
    "base": "/agentcore-samples/01-features/02-host-your-agent/01-runtime/03-advanced/09-mcp-e2e"
  },
  {
    "slug": "01-features/02-host-your-agent/01-runtime/04-coding-agents",
    "title": "Coding Agents on AgentCore Runtime",
    "desc": "Examples of deploying coding agents on Amazon Bedrock AgentCore Runtime with persistent storage and MCP tool access.",
    "sectionId": "runtime",
    "kind": "overview",
    "readme": "/agentcore-samples/01-features/02-host-your-agent/01-runtime/04-coding-agents/README.md",
    "base": "/agentcore-samples/01-features/02-host-your-agent/01-runtime/04-coding-agents"
  },
  {
    "slug": "01-features/02-host-your-agent/01-runtime/04-coding-agents/03-code-agents-competition-e2e",
    "title": "Coding Agents on Amazon Bedrock AgentCore",
    "desc": "Deploy coding agents (Claude Code, Kiro, Codex, Cursor, Hermes, OpenCode) on AWS Bedrock AgentCore with a shared GitHub MCP Gateway, interactive TUI sessions, and a local comparison frontend.",
    "sectionId": "runtime",
    "kind": "overview",
    "readme": "/agentcore-samples/01-features/02-host-your-agent/01-runtime/04-coding-agents/03-code-agents-competition-e2e/README.md",
    "base": "/agentcore-samples/01-features/02-host-your-agent/01-runtime/04-coding-agents/03-code-agents-competition-e2e"
  },
  {
    "slug": "01-features/02-host-your-agent/01-runtime/04-coding-agents/05-autonomous-coding-agent-durable",
    "title": "Autonomous Coding Agent — Durable Orchestration on AgentCore Runtime",
    "desc": "An event-driven, headless coding backend that receives a ticket, clones a repo, writes code, runs tests in an isolated sandbox, gets a review from an evaluator agent, and retries until tests pass...",
    "sectionId": "runtime",
    "kind": "overview",
    "readme": "/agentcore-samples/01-features/02-host-your-agent/01-runtime/04-coding-agents/05-autonomous-coding-agent-durable/README.md",
    "base": "/agentcore-samples/01-features/02-host-your-agent/01-runtime/04-coding-agents/05-autonomous-coding-agent-durable"
  },
  {
    "slug": "01-features/03-connect-your-agent-to-anything",
    "title": "Connect Your Agent to Anything",
    "desc": "Give your agents access to powerful built-in tool environments — sandboxed code execution, headless browser automation, and real-time web search — managed and scaled by Amazon Bedrock AgentCore.",
    "sectionId": null,
    "kind": "overview",
    "readme": "/agentcore-samples/01-features/03-connect-your-agent-to-anything/README.md",
    "base": "/agentcore-samples/01-features/03-connect-your-agent-to-anything"
  },
  {
    "slug": "01-features/03-connect-your-agent-to-anything/01-code-interpreter",
    "title": "AgentCore Code Interpreter",
    "desc": "Amazon Bedrock AgentCore Code Interpreter is a fully managed, sandboxed Python execution environment that your agents can use at runtime. The sandbox includes a Python 3.12 interpreter, a writable...",
    "sectionId": "code-interpreter",
    "kind": "overview",
    "readme": "/agentcore-samples/01-features/03-connect-your-agent-to-anything/01-code-interpreter/README.md",
    "base": "/agentcore-samples/01-features/03-connect-your-agent-to-anything/01-code-interpreter"
  },
  {
    "slug": "01-features/03-connect-your-agent-to-anything/02-browser",
    "title": "AgentCore Browser Tool",
    "desc": "Amazon Bedrock AgentCore Browser Tool is a fully managed, headless Chromium sandbox that your agents can control at runtime. Connect to it via the Chrome DevTools Protocol (CDP), and drive it with...",
    "sectionId": "browser",
    "kind": "overview",
    "readme": "/agentcore-samples/01-features/03-connect-your-agent-to-anything/02-browser/README.md",
    "base": "/agentcore-samples/01-features/03-connect-your-agent-to-anything/02-browser"
  },
  {
    "slug": "01-features/03-connect-your-agent-to-anything/03-web-search",
    "title": "AgentCore web search tool",
    "desc": "Amazon Bedrock AgentCore web search tool exposes web search as a fully managed, MCP-compliant tool through Amazon Bedrock AgentCore gateway. Your agents discover and invoke it using the standard...",
    "sectionId": null,
    "kind": "overview",
    "readme": "/agentcore-samples/01-features/03-connect-your-agent-to-anything/03-web-search/README.md",
    "base": "/agentcore-samples/01-features/03-connect-your-agent-to-anything/03-web-search"
  },
  {
    "slug": "01-features/03-connect-your-agent-to-anything/04-fmkb-managed-kb",
    "title": "Connect your agent to a Bedrock Managed Knowledge Base via AgentCore Gateway",
    "desc": "This sample shows how to expose a Bedrock Managed Knowledge Base (FMKB) as an MCP tool through AgentCore Gateway, then have an agent — running on AgentCore Runtime — query that tool. Follows the...",
    "sectionId": null,
    "kind": "overview",
    "readme": "/agentcore-samples/01-features/03-connect-your-agent-to-anything/04-fmkb-managed-kb/README.md",
    "base": "/agentcore-samples/01-features/03-connect-your-agent-to-anything/04-fmkb-managed-kb"
  },
  {
    "slug": "01-features/04-manage-context-of-your-agent/memory",
    "title": "Amazon Bedrock AgentCore Memory",
    "desc": "AgentCore Memory is a fully managed service that gives your AI agents the ability to remember past interactions, enabling more intelligent, context-aware, and personalised conversations. It...",
    "sectionId": "memory",
    "kind": "overview",
    "readme": "/agentcore-samples/01-features/04-manage-context-of-your-agent/memory/README.md",
    "base": "/agentcore-samples/01-features/04-manage-context-of-your-agent/memory"
  },
  {
    "slug": "01-features/04-manage-context-of-your-agent/memory/01-short-term-memory/examples",
    "title": "Short-term memory — framework examples",
    "desc": "End-to-end agent examples that wire AgentCore short-term memory (raw events, getlastkturns) into real agent frameworks. The section README covers the underlying primitives — events, sessions,...",
    "sectionId": "memory",
    "kind": "overview",
    "readme": "/agentcore-samples/01-features/04-manage-context-of-your-agent/memory/01-short-term-memory/examples/README.md",
    "base": "/agentcore-samples/01-features/04-manage-context-of-your-agent/memory/01-short-term-memory/examples"
  },
  {
    "slug": "01-features/04-manage-context-of-your-agent/memory/01-short-term-memory/examples/multi-agent",
    "title": "Short-term memory — multi-agent examples",
    "desc": "Multiple specialized agents collaborating through a shared AgentCore short-term memory resource. Branching keeps each agent's conversation context isolated within one session.",
    "sectionId": "memory",
    "kind": "overview",
    "readme": "/agentcore-samples/01-features/04-manage-context-of-your-agent/memory/01-short-term-memory/examples/multi-agent/README.md",
    "base": "/agentcore-samples/01-features/04-manage-context-of-your-agent/memory/01-short-term-memory/examples/multi-agent"
  },
  {
    "slug": "01-features/04-manage-context-of-your-agent/memory/01-short-term-memory/examples/single-agent",
    "title": "Short-term memory — single-agent examples",
    "desc": "One agent per example, each wiring AgentCore short-term memory into a different framework. The same pattern recurs: retrieve recent turns on startup, store each turn as it happens.",
    "sectionId": "memory",
    "kind": "overview",
    "readme": "/agentcore-samples/01-features/04-manage-context-of-your-agent/memory/01-short-term-memory/examples/single-agent/README.md",
    "base": "/agentcore-samples/01-features/04-manage-context-of-your-agent/memory/01-short-term-memory/examples/single-agent"
  },
  {
    "slug": "01-features/04-manage-context-of-your-agent/memory/02-long-term-memory/examples",
    "title": "Long-term memory — framework examples",
    "desc": "End-to-end agent examples that wire AgentCore long-term memory (strategies + retrievememories) into real agent frameworks. The section README covers the strategies, namespaces, and retrieval APIs;...",
    "sectionId": "memory",
    "kind": "overview",
    "readme": "/agentcore-samples/01-features/04-manage-context-of-your-agent/memory/02-long-term-memory/examples/README.md",
    "base": "/agentcore-samples/01-features/04-manage-context-of-your-agent/memory/02-long-term-memory/examples"
  },
  {
    "slug": "01-features/04-manage-context-of-your-agent/memory/02-long-term-memory/examples/multi-agent",
    "title": "Long-term memory — multi-agent examples",
    "desc": "Multiple specialized agents collaborating through a single shared AgentCore long-term memory resource, each scoped to its own namespace so agents build persistent, non-colliding knowledge.",
    "sectionId": "memory",
    "kind": "overview",
    "readme": "/agentcore-samples/01-features/04-manage-context-of-your-agent/memory/02-long-term-memory/examples/multi-agent/README.md",
    "base": "/agentcore-samples/01-features/04-manage-context-of-your-agent/memory/02-long-term-memory/examples/multi-agent"
  },
  {
    "slug": "01-features/04-manage-context-of-your-agent/memory/02-long-term-memory/examples/multi-agent/with-strands-agent",
    "title": "Long-term memory — multi-agent (Strands)",
    "desc": "See also: short-term multi-agent branching in ../../../../01-short-term-memory/examples/multi-agent/with-strands-agent/multi-agent-parallel-branches/.",
    "sectionId": "memory",
    "kind": "overview",
    "readme": "/agentcore-samples/01-features/04-manage-context-of-your-agent/memory/02-long-term-memory/examples/multi-agent/with-strands-agent/README.md",
    "base": "/agentcore-samples/01-features/04-manage-context-of-your-agent/memory/02-long-term-memory/examples/multi-agent/with-strands-agent"
  },
  {
    "slug": "01-features/04-manage-context-of-your-agent/memory/02-long-term-memory/examples/single-agent",
    "title": "Long-term memory — single-agent examples",
    "desc": "One agent per example, each giving a single agent long-term memory backed by AgentCore. The folders differ by framework; within each, the same three integration patterns recur (built-in, custom,...",
    "sectionId": "memory",
    "kind": "overview",
    "readme": "/agentcore-samples/01-features/04-manage-context-of-your-agent/memory/02-long-term-memory/examples/single-agent/README.md",
    "base": "/agentcore-samples/01-features/04-manage-context-of-your-agent/memory/02-long-term-memory/examples/single-agent"
  },
  {
    "slug": "01-features/04-manage-context-of-your-agent/memory/02-long-term-memory/examples/single-agent/with-claude-sdk",
    "title": "Long-term memory — Claude SDK single-agent",
    "desc": "Long-term memory examples built directly on the Anthropic Claude SDK (via Amazon Bedrock), with no agent framework. The Anthropic SDK is a stateless API client — no built-in conversation...",
    "sectionId": "memory",
    "kind": "overview",
    "readme": "/agentcore-samples/01-features/04-manage-context-of-your-agent/memory/02-long-term-memory/examples/single-agent/with-claude-sdk/README.md",
    "base": "/agentcore-samples/01-features/04-manage-context-of-your-agent/memory/02-long-term-memory/examples/single-agent/with-claude-sdk"
  },
  {
    "slug": "01-features/04-manage-context-of-your-agent/memory/02-long-term-memory/examples/single-agent/with-langgraph-agent",
    "title": "Long-term memory — LangGraph single-agent",
    "desc": "Three integration patterns for giving a LangGraph agent long-term memory backed by Amazon Bedrock AgentCore Memory. They differ in who decides when to store and recall.",
    "sectionId": "memory",
    "kind": "overview",
    "readme": "/agentcore-samples/01-features/04-manage-context-of-your-agent/memory/02-long-term-memory/examples/single-agent/with-langgraph-agent/README.md",
    "base": "/agentcore-samples/01-features/04-manage-context-of-your-agent/memory/02-long-term-memory/examples/single-agent/with-langgraph-agent"
  },
  {
    "slug": "01-features/04-manage-context-of-your-agent/memory/02-long-term-memory/examples/single-agent/with-llamaindex-agent",
    "title": "Long-term memory — LlamaIndex single-agent",
    "desc": "Three integration patterns matching the LlamaIndex model.",
    "sectionId": "memory",
    "kind": "overview",
    "readme": "/agentcore-samples/01-features/04-manage-context-of-your-agent/memory/02-long-term-memory/examples/single-agent/with-llamaindex-agent/README.md",
    "base": "/agentcore-samples/01-features/04-manage-context-of-your-agent/memory/02-long-term-memory/examples/single-agent/with-llamaindex-agent"
  },
  {
    "slug": "01-features/04-manage-context-of-your-agent/memory/02-long-term-memory/examples/single-agent/with-strands-agent",
    "title": "Long-term memory — Strands single-agent",
    "desc": "Three integration patterns, same memory resource. Pick based on how explicit you want the agent's memory lifecycle to be.",
    "sectionId": "memory",
    "kind": "overview",
    "readme": "/agentcore-samples/01-features/04-manage-context-of-your-agent/memory/02-long-term-memory/examples/single-agent/with-strands-agent/README.md",
    "base": "/agentcore-samples/01-features/04-manage-context-of-your-agent/memory/02-long-term-memory/examples/single-agent/with-strands-agent"
  },
  {
    "slug": "01-features/04-manage-context-of-your-agent/memory/03-integrations",
    "title": "Integrations",
    "desc": "Composite patterns that connect AgentCore Memory to other AgentCore primitives and to Bedrock Guardrails. Each example assumes you've worked through ../01-short-term-memory/ and...",
    "sectionId": "memory",
    "kind": "overview",
    "readme": "/agentcore-samples/01-features/04-manage-context-of-your-agent/memory/03-integrations/README.md",
    "base": "/agentcore-samples/01-features/04-manage-context-of-your-agent/memory/03-integrations"
  },
  {
    "slug": "01-features/04-manage-context-of-your-agent/memory/05-security",
    "title": "Security",
    "desc": "IAM, Cognito, and KMS patterns for production memory deployments.",
    "sectionId": "memory",
    "kind": "overview",
    "readme": "/agentcore-samples/01-features/04-manage-context-of-your-agent/memory/05-security/README.md",
    "base": "/agentcore-samples/01-features/04-manage-context-of-your-agent/memory/05-security"
  },
  {
    "slug": "01-features/05-authenticate-and-authorize",
    "title": "Authenticate and Authorize",
    "desc": "Amazon Bedrock AgentCore identity is a comprehensive identity and credential management service designed specifically for AI agents and automated workloads. It provides secure authentication,...",
    "sectionId": "identity",
    "kind": "overview",
    "readme": "/agentcore-samples/01-features/05-authenticate-and-authorize/README.md",
    "base": "/agentcore-samples/01-features/05-authenticate-and-authorize"
  },
  {
    "slug": "01-features/05-authenticate-and-authorize/01-inbound-auth",
    "title": "Inbound Authentication",
    "desc": "Protect your AgentCore runtime and gateway endpoints so that only callers with valid credentials can reach your agents.",
    "sectionId": "identity",
    "kind": "overview",
    "readme": "/agentcore-samples/01-features/05-authenticate-and-authorize/01-inbound-auth/README.md",
    "base": "/agentcore-samples/01-features/05-authenticate-and-authorize/01-inbound-auth"
  },
  {
    "slug": "01-features/05-authenticate-and-authorize/01-inbound-auth/04-inbound-auth-pingfederate/agent/private-idp-ping-agent",
    "title": "AgentCore Project",
    "desc": "This project was created with the AgentCore CLI.",
    "sectionId": "identity",
    "kind": "overview",
    "readme": "/agentcore-samples/01-features/05-authenticate-and-authorize/01-inbound-auth/04-inbound-auth-pingfederate/agent/private-idp-ping-agent/README.md",
    "base": "/agentcore-samples/01-features/05-authenticate-and-authorize/01-inbound-auth/04-inbound-auth-pingfederate/agent/private-idp-ping-agent"
  },
  {
    "slug": "01-features/05-authenticate-and-authorize/02-outbound-auth",
    "title": "Outbound Authentication",
    "desc": "Give your AgentCore agents secure, token-based access to external APIs — without ever exposing credentials to the LLM context.",
    "sectionId": "identity",
    "kind": "overview",
    "readme": "/agentcore-samples/01-features/05-authenticate-and-authorize/02-outbound-auth/README.md",
    "base": "/agentcore-samples/01-features/05-authenticate-and-authorize/02-outbound-auth"
  },
  {
    "slug": "01-features/05-authenticate-and-authorize/05-certificate-based-auth",
    "title": "Outbound Auth with Private Key JWT Client Authentication",
    "desc": "Traditionally, an OAuth 2.0 confidential client authenticates to a token endpoint by sending a client secret: a shared string that both sides know. Both sides have to store and rotate it, both...",
    "sectionId": "identity",
    "kind": "overview",
    "readme": "/agentcore-samples/01-features/05-authenticate-and-authorize/05-certificate-based-auth/README.md",
    "base": "/agentcore-samples/01-features/05-authenticate-and-authorize/05-certificate-based-auth"
  },
  {
    "slug": "01-features/05-authenticate-and-authorize/obo-training",
    "title": "OBO (On-Behalf-Of) Training Material",
    "desc": "Training material and end-to-end examples for OAuth 2.0 On-Behalf-Of flows with AgentCore Identity, Microsoft Entra ID, and Okta.",
    "sectionId": "identity",
    "kind": "overview",
    "readme": "/agentcore-samples/01-features/05-authenticate-and-authorize/obo-training/README.md",
    "base": "/agentcore-samples/01-features/05-authenticate-and-authorize/obo-training"
  },
  {
    "slug": "01-features/05-authenticate-and-authorize/obo-training/3-examples",
    "title": "OBO Python Examples",
    "desc": "End-to-end working examples of OAuth 2.0 On-Behalf-Of (OBO) flows using AgentCore Identity, in Python.",
    "sectionId": "identity",
    "kind": "overview",
    "readme": "/agentcore-samples/01-features/05-authenticate-and-authorize/obo-training/3-examples/README.md",
    "base": "/agentcore-samples/01-features/05-authenticate-and-authorize/obo-training/3-examples"
  },
  {
    "slug": "01-features/05-authenticate-and-authorize/obo-training/3-examples/01-agent-to-downstream",
    "title": "Use Case 1 — Agent on Runtime → Downstream API (same IdP)",
    "desc": "Scenario: A user signs into a frontend. The frontend invokes an agent on AgentCore Runtime. The agent — acting on the user's behalf — calls a downstream MCP server or REST API that is protected by...",
    "sectionId": "identity",
    "kind": "overview",
    "readme": "/agentcore-samples/01-features/05-authenticate-and-authorize/obo-training/3-examples/01-agent-to-downstream/README.md",
    "base": "/agentcore-samples/01-features/05-authenticate-and-authorize/obo-training/3-examples/01-agent-to-downstream"
  },
  {
    "slug": "01-features/05-authenticate-and-authorize/obo-training/3-examples/01-agent-to-downstream/entra",
    "title": "Use Case 1 — Entra ID flavor",
    "desc": "Two runnable variants of the same OBO flow (User → Frontend → Agent → Microsoft Graph), each aimed at a different learning goal:",
    "sectionId": "identity",
    "kind": "overview",
    "readme": "/agentcore-samples/01-features/05-authenticate-and-authorize/obo-training/3-examples/01-agent-to-downstream/entra/README.md",
    "base": "/agentcore-samples/01-features/05-authenticate-and-authorize/obo-training/3-examples/01-agent-to-downstream/entra"
  },
  {
    "slug": "01-features/05-authenticate-and-authorize/obo-training/3-examples/01-agent-to-downstream/entra/real-world",
    "title": "Real-World Example — User → Frontend → Agent on Runtime → Graph",
    "desc": "A production-shaped deployment of Use Case 1. Everything runs where it would in real life: the frontend on your laptop or a container, the agent on AgentCore Runtime, and Microsoft Graph as the...",
    "sectionId": "identity",
    "kind": "overview",
    "readme": "/agentcore-samples/01-features/05-authenticate-and-authorize/obo-training/3-examples/01-agent-to-downstream/entra/real-world/README.md",
    "base": "/agentcore-samples/01-features/05-authenticate-and-authorize/obo-training/3-examples/01-agent-to-downstream/entra/real-world"
  },
  {
    "slug": "01-features/05-authenticate-and-authorize/obo-training/3-examples/01-agent-to-downstream/okta",
    "title": "Use Case 1 — Okta flavor",
    "desc": "Two runnable variants of the same OBO flow (User → Frontend → Agent → Downstream API), each aimed at a different learning goal:",
    "sectionId": "identity",
    "kind": "overview",
    "readme": "/agentcore-samples/01-features/05-authenticate-and-authorize/obo-training/3-examples/01-agent-to-downstream/okta/README.md",
    "base": "/agentcore-samples/01-features/05-authenticate-and-authorize/obo-training/3-examples/01-agent-to-downstream/okta"
  },
  {
    "slug": "01-features/05-authenticate-and-authorize/obo-training/3-examples/01-agent-to-downstream/okta/real-world",
    "title": "Real-World Example — User → Frontend → Agent on Runtime → OBO exchange + Okta /v1/userinfo",
    "desc": "A production-shaped deployment of Use Case 1 (Okta flavor). Everything runs where it would in real life: the frontend on your laptop or a container, the agent on AgentCore Runtime, and a two-call...",
    "sectionId": "identity",
    "kind": "overview",
    "readme": "/agentcore-samples/01-features/05-authenticate-and-authorize/obo-training/3-examples/01-agent-to-downstream/okta/real-world/README.md",
    "base": "/agentcore-samples/01-features/05-authenticate-and-authorize/obo-training/3-examples/01-agent-to-downstream/okta/real-world"
  },
  {
    "slug": "01-features/05-authenticate-and-authorize/obo-training/3-examples/02-agent-via-gateway",
    "title": "Use Case 2 — User → BFF → Agent on Runtime → AgentCore Gateway → REST API",
    "desc": "Scenario: A user signs into a frontend. The frontend invokes an agent on AgentCore Runtime. The agent — acting on the user's behalf — calls an AgentCore Gateway target that, in turn, calls a...",
    "sectionId": "gateway",
    "kind": "overview",
    "readme": "/agentcore-samples/01-features/05-authenticate-and-authorize/obo-training/3-examples/02-agent-via-gateway/README.md",
    "base": "/agentcore-samples/01-features/05-authenticate-and-authorize/obo-training/3-examples/02-agent-via-gateway"
  },
  {
    "slug": "01-features/05-authenticate-and-authorize/obo-training/3-examples/02-agent-via-gateway/entra",
    "title": "Use Case 2 — Entra ID flavor",
    "desc": "OBO chain: User → Frontend → Agent on Runtime → AgentCore Gateway → Microsoft Graph /me, with two OBO exchanges using Entra's RFC 7523 JWT-bearer flow.",
    "sectionId": "gateway",
    "kind": "overview",
    "readme": "/agentcore-samples/01-features/05-authenticate-and-authorize/obo-training/3-examples/02-agent-via-gateway/entra/README.md",
    "base": "/agentcore-samples/01-features/05-authenticate-and-authorize/obo-training/3-examples/02-agent-via-gateway/entra"
  },
  {
    "slug": "01-features/05-authenticate-and-authorize/obo-training/3-examples/02-agent-via-gateway/entra/real-world",
    "title": "Real-World Example — User → Frontend → Agent on Runtime → Gateway → Graph (Entra)",
    "desc": "A production-shaped deployment of Use Case 2: two OBO exchanges in one chain, with user identity preserved end-to-end.",
    "sectionId": "gateway",
    "kind": "overview",
    "readme": "/agentcore-samples/01-features/05-authenticate-and-authorize/obo-training/3-examples/02-agent-via-gateway/entra/real-world/README.md",
    "base": "/agentcore-samples/01-features/05-authenticate-and-authorize/obo-training/3-examples/02-agent-via-gateway/entra/real-world"
  },
  {
    "slug": "01-features/05-authenticate-and-authorize/obo-training/3-examples/02-agent-via-gateway/okta/real-world",
    "title": "Real-World Example — User → Frontend → Agent on Runtime → Gateway → Mock API (Okta)",
    "desc": "A production-shaped deployment of Use Case 2 (Okta flavor): two OBO exchanges in one chain, both using Okta's RFC 8693 Token Exchange grant, with user identity preserved end-to-end.",
    "sectionId": "gateway",
    "kind": "overview",
    "readme": "/agentcore-samples/01-features/05-authenticate-and-authorize/obo-training/3-examples/02-agent-via-gateway/okta/real-world/README.md",
    "base": "/agentcore-samples/01-features/05-authenticate-and-authorize/obo-training/3-examples/02-agent-via-gateway/okta/real-world"
  },
  {
    "slug": "01-features/06-observe-evaluate-optimize-your-agent",
    "title": "Observe, Evaluate, and Optimize Your Agent",
    "desc": "End-to-end lifecycle management for agents on Amazon Bedrock AgentCore — from enabling observability infrastructure through advanced monitoring techniques, automated evaluation, and AI-driven...",
    "sectionId": "evaluations",
    "kind": "overview",
    "readme": "/agentcore-samples/01-features/06-observe-evaluate-optimize-your-agent/README.md",
    "base": "/agentcore-samples/01-features/06-observe-evaluate-optimize-your-agent"
  },
  {
    "slug": "01-features/06-observe-evaluate-optimize-your-agent/02-evaluate",
    "title": "AgentCore evaluations",
    "desc": "Amazon Bedrock AgentCore evaluations provides automated assessment tools to measure how well your agent or tools perform specific tasks, handle edge cases, and maintain consistency across...",
    "sectionId": "evaluations",
    "kind": "overview",
    "readme": "/agentcore-samples/01-features/06-observe-evaluate-optimize-your-agent/02-evaluate/README.md",
    "base": "/agentcore-samples/01-features/06-observe-evaluate-optimize-your-agent/02-evaluate"
  },
  {
    "slug": "01-features/06-observe-evaluate-optimize-your-agent/02-evaluate/supported-frameworks",
    "title": "AgentCore Evaluations — Supported Frameworks",
    "desc": "This folder contains code samples demonstrating AgentCore Evaluations running against agents built with different frameworks. Each sample builds the same HR Assistant agent (same tools, same mock...",
    "sectionId": "evaluations",
    "kind": "overview",
    "readme": "/agentcore-samples/01-features/06-observe-evaluate-optimize-your-agent/02-evaluate/supported-frameworks/README.md",
    "base": "/agentcore-samples/01-features/06-observe-evaluate-optimize-your-agent/02-evaluate/supported-frameworks"
  },
  {
    "slug": "01-features/07-centralize-and-govern-your-ai-infrastructure",
    "title": "AI Governance Layer",
    "desc": "Add a gateway to a runtime project with the AgentCore CLI:",
    "sectionId": "identity",
    "kind": "overview",
    "readme": "/agentcore-samples/01-features/07-centralize-and-govern-your-ai-infrastructure/README.md",
    "base": "/agentcore-samples/01-features/07-centralize-and-govern-your-ai-infrastructure"
  },
  {
    "slug": "01-features/07-centralize-and-govern-your-ai-infrastructure/01-gateway",
    "title": "Amazon Bedrock AgentCore gateway",
    "desc": "Without a centralized gateway, every tool or agent your organization builds, whether it's an MCP server, a REST API, or an AI agent, must independently handle credentials, policy enforcement,...",
    "sectionId": "gateway",
    "kind": "overview",
    "readme": "/agentcore-samples/01-features/07-centralize-and-govern-your-ai-infrastructure/01-gateway/README.md",
    "base": "/agentcore-samples/01-features/07-centralize-and-govern-your-ai-infrastructure/01-gateway"
  },
  {
    "slug": "01-features/07-centralize-and-govern-your-ai-infrastructure/01-gateway/01-attach-targets",
    "title": "Amazon Bedrock AgentCore gateway Targets",
    "desc": "Targets define the tools and models that your AgentCore gateway will host. AgentCore gateway supports three categories of targets:",
    "sectionId": "gateway",
    "kind": "overview",
    "readme": "/agentcore-samples/01-features/07-centralize-and-govern-your-ai-infrastructure/01-gateway/01-attach-targets/README.md",
    "base": "/agentcore-samples/01-features/07-centralize-and-govern-your-ai-infrastructure/01-gateway/01-attach-targets"
  },
  {
    "slug": "01-features/07-centralize-and-govern-your-ai-infrastructure/01-gateway/01-attach-targets/mcp",
    "title": "Attach MCP Targets",
    "desc": "MCP targets operate in aggregation mode, the gateway acts as an MCP server whose capabilities combine those of all its MCP targets. Clients see a single consolidated tools/list response that...",
    "sectionId": "gateway",
    "kind": "overview",
    "readme": "/agentcore-samples/01-features/07-centralize-and-govern-your-ai-infrastructure/01-gateway/01-attach-targets/mcp/README.md",
    "base": "/agentcore-samples/01-features/07-centralize-and-govern-your-ai-infrastructure/01-gateway/01-attach-targets/mcp"
  },
  {
    "slug": "01-features/07-centralize-and-govern-your-ai-infrastructure/01-gateway/03-private-connectivity",
    "title": "Private Connectivity",
    "desc": "Configure private network connectivity for your Amazon Bedrock AgentCore gateway — both outbound (gateway to private resources) and inbound (clients to gateway over private network).",
    "sectionId": "gateway",
    "kind": "overview",
    "readme": "/agentcore-samples/01-features/07-centralize-and-govern-your-ai-infrastructure/01-gateway/03-private-connectivity/README.md",
    "base": "/agentcore-samples/01-features/07-centralize-and-govern-your-ai-infrastructure/01-gateway/03-private-connectivity"
  },
  {
    "slug": "01-features/07-centralize-and-govern-your-ai-infrastructure/03-registry",
    "title": "AWS Agent registry",
    "desc": "AWS Agent registry lets you discover and manage agents, tools, and resources across your organization. It provides a centralized catalog where teams can publish, search, and consume AI...",
    "sectionId": "identity",
    "kind": "overview",
    "readme": "/agentcore-samples/01-features/07-centralize-and-govern-your-ai-infrastructure/03-registry/README.md",
    "base": "/agentcore-samples/01-features/07-centralize-and-govern-your-ai-infrastructure/03-registry"
  },
  {
    "slug": "01-features/08-agents-that-transact",
    "title": "Agents That Transact — Amazon Bedrock AgentCore payments",
    "desc": "Amazon Bedrock AgentCore payments is a fully managed service that enables microtransaction payments in AI agents to access paid APIs, MCP servers, and content. AI agents increasingly handle...",
    "sectionId": "payments",
    "kind": "overview",
    "readme": "/agentcore-samples/01-features/08-agents-that-transact/README.md",
    "base": "/agentcore-samples/01-features/08-agents-that-transact"
  },
  {
    "slug": "01-features/08-agents-that-transact/02-use-cases",
    "title": "Use Cases",
    "desc": "Real-world use cases that demonstrate Amazon Bedrock AgentCore payments in action. Each use case is a standalone sample with its own Python scripts, environment configuration, and supporting...",
    "sectionId": "payments",
    "kind": "overview",
    "readme": "/agentcore-samples/01-features/08-agents-that-transact/02-use-cases/README.md",
    "base": "/agentcore-samples/01-features/08-agents-that-transact/02-use-cases"
  },
  {
    "slug": "02-use-cases",
    "title": "Amazon Bedrock AgentCore Use Cases",
    "desc": "End-to-end samples organized by agent type. Each folder maps to one of the three workload categories used in AgentCore documentation.",
    "sectionId": null,
    "kind": "overview",
    "readme": "/agentcore-samples/02-use-cases/README.md",
    "base": "/agentcore-samples/02-use-cases"
  },
  {
    "slug": "02-use-cases/01-conversational-agents",
    "title": "Conversational Agents",
    "desc": "Agents that interact with users in real time through a chat or query interface. The user authenticates through an identity provider (Entra ID, Okta, Cognito), and the agent acts on their behalf....",
    "sectionId": null,
    "kind": "overview",
    "readme": "/agentcore-samples/02-use-cases/01-conversational-agents/README.md",
    "base": "/agentcore-samples/02-use-cases/01-conversational-agents"
  },
  {
    "slug": "02-use-cases/01-conversational-agents/AWS-operations-agent",
    "title": "AWS Support Agent with Amazon Bedrock AgentCore",
    "desc": "An AWS support conversational AI system built on Amazon Bedrock AgentCore, featuring OAuth2 authentication, MCP (Model Control Protocol) integration, and comprehensive AWS service operations.",
    "sectionId": null,
    "kind": "overview",
    "readme": "/agentcore-samples/02-use-cases/01-conversational-agents/AWS-operations-agent/README.md",
    "base": "/agentcore-samples/02-use-cases/01-conversational-agents/AWS-operations-agent"
  },
  {
    "slug": "02-use-cases/01-conversational-agents/lakehouse-agent/deployment",
    "title": "Lakehouse Agent Deployment Guide (DevOps)",
    "desc": "This guide provides the deployment sequence for the Lakehouse Agent system using command-line scripts. For a guided notebook-based approach, see the Jupyter notebooks in the parent directory.",
    "sectionId": null,
    "kind": "overview",
    "readme": "/agentcore-samples/02-use-cases/01-conversational-agents/lakehouse-agent/deployment/README.md",
    "base": "/agentcore-samples/02-use-cases/01-conversational-agents/lakehouse-agent/deployment"
  },
  {
    "slug": "02-use-cases/01-conversational-agents/video-games-sales-assistant",
    "title": "Deploying a Conversational Data Analyst Assistant Solution with Amazon Bedrock AgentCore",
    "desc": "This solution provides a Generative AI application reference that allows users to interact with data through a natural language interface. The solution leverages Amazon Bedrock AgentCore, a...",
    "sectionId": null,
    "kind": "overview",
    "readme": "/agentcore-samples/02-use-cases/01-conversational-agents/video-games-sales-assistant/README.md",
    "base": "/agentcore-samples/02-use-cases/01-conversational-agents/video-games-sales-assistant"
  },
  {
    "slug": "02-use-cases/02-workflow-automation-agents",
    "title": "Automation Agents",
    "desc": "Agents that run without a user in the loop. They are triggered by system events such as file uploads, queue messages, scheduled jobs, or webhooks, and they process work end-to-end until they...",
    "sectionId": null,
    "kind": "overview",
    "readme": "/agentcore-samples/02-use-cases/02-workflow-automation-agents/README.md",
    "base": "/agentcore-samples/02-use-cases/02-workflow-automation-agents"
  },
  {
    "slug": "02-use-cases/02-workflow-automation-agents/it-incident-response-agent",
    "title": "IT Incident Response Agent on Amazon Bedrock AgentCore",
    "desc": "An event-driven IT assistant built with the AgentCore CLI-first workflow. Publish a \"ticket\" to SNS — an AgentCore Runtime agent picks it up, diagnoses the issue using a Knowledge Base and Lambda...",
    "sectionId": null,
    "kind": "overview",
    "readme": "/agentcore-samples/02-use-cases/02-workflow-automation-agents/it-incident-response-agent/README.md",
    "base": "/agentcore-samples/02-use-cases/02-workflow-automation-agents/it-incident-response-agent"
  },
  {
    "slug": "02-use-cases/02-workflow-automation-agents/visa-b2b-account-payable-agent",
    "title": "Procure-to-Pay: Automated Accounts Payable with AWS Bedrock AgentCore",
    "desc": "Problem: Manual accounts payable processes are slow, error-prone, and lack real-time visibility into invoice status, payment generation, and goods receipt matching.",
    "sectionId": null,
    "kind": "overview",
    "readme": "/agentcore-samples/02-use-cases/02-workflow-automation-agents/visa-b2b-account-payable-agent/README.md",
    "base": "/agentcore-samples/02-use-cases/02-workflow-automation-agents/visa-b2b-account-payable-agent"
  },
  {
    "slug": "02-use-cases/03-coding-assistants",
    "title": "Coding Agents",
    "desc": "Agents that help developers write, execute, or fix code. Tasks are typically longer-running than a chat response and are scoped to a project or repository. AgentCore Code Interpreter runs...",
    "sectionId": null,
    "kind": "overview",
    "readme": "/agentcore-samples/02-use-cases/03-coding-assistants/README.md",
    "base": "/agentcore-samples/02-use-cases/03-coding-assistants"
  },
  {
    "slug": "03-integrations",
    "title": "🔌 Amazon Bedrock AgentCore Integrations",
    "desc": "Welcome to the integrations section of the Amazon Bedrock AgentCore samples repository!",
    "sectionId": null,
    "kind": "overview",
    "readme": "/agentcore-samples/03-integrations/README.md",
    "base": "/agentcore-samples/03-integrations"
  },
  {
    "slug": "03-integrations/agentic-frameworks/crewai",
    "title": "Crewai",
    "desc": "Please refer to - https://github.com/awslabs/amazon-bedrock-agentcore-samples/tree/main/06-workshops/01-AgentCore-runtime/01-hosting-agent/04-crewai-with-bedrock-model",
    "sectionId": null,
    "kind": "overview",
    "readme": "/agentcore-samples/03-integrations/agentic-frameworks/crewai/README.md",
    "base": "/agentcore-samples/03-integrations/agentic-frameworks/crewai"
  },
  {
    "slug": "03-integrations/agents-hosted-outside-runtime/agents-on-aws-lambda",
    "title": "Agents on AWS Lambda — AgentCore Observability",
    "desc": "This folder contains two complementary patterns for running agents in AWS Lambda with AgentCore observability.",
    "sectionId": "runtime",
    "kind": "overview",
    "readme": "/agentcore-samples/03-integrations/agents-hosted-outside-runtime/agents-on-aws-lambda/README.md",
    "base": "/agentcore-samples/03-integrations/agents-hosted-outside-runtime/agents-on-aws-lambda"
  },
  {
    "slug": "04-infrastructure-as-code",
    "title": "Infrastructure as Code Samples for Amazon Bedrock AgentCore",
    "desc": "Deploy Amazon Bedrock AgentCore resources using CloudFormation templates, AWS CDK, or Terraform.",
    "sectionId": null,
    "kind": "overview",
    "readme": "/agentcore-samples/04-infrastructure-as-code/README.md",
    "base": "/agentcore-samples/04-infrastructure-as-code"
  },
  {
    "slug": "04-infrastructure-as-code/cdk",
    "title": "CDK Samples",
    "desc": "Deploy Amazon Bedrock AgentCore resources using AWS CDK in Python or TypeScript.",
    "sectionId": null,
    "kind": "overview",
    "readme": "/agentcore-samples/04-infrastructure-as-code/cdk/README.md",
    "base": "/agentcore-samples/04-infrastructure-as-code/cdk"
  },
  {
    "slug": "04-infrastructure-as-code/cdk/typescript",
    "title": "TypeScript CDK Samples",
    "desc": "Deploy Amazon Bedrock AgentCore resources using AWS CDK with TypeScript.",
    "sectionId": null,
    "kind": "overview",
    "readme": "/agentcore-samples/04-infrastructure-as-code/cdk/typescript/README.md",
    "base": "/agentcore-samples/04-infrastructure-as-code/cdk/typescript"
  },
  {
    "slug": "04-infrastructure-as-code/cloudformation",
    "title": "CloudFormation Samples",
    "desc": "Deploy Amazon Bedrock AgentCore resources using CloudFormation templates.",
    "sectionId": null,
    "kind": "overview",
    "readme": "/agentcore-samples/04-infrastructure-as-code/cloudformation/README.md",
    "base": "/agentcore-samples/04-infrastructure-as-code/cloudformation"
  },
  {
    "slug": "04-infrastructure-as-code/terraform",
    "title": "Terraform Samples",
    "desc": "Deploy Amazon Bedrock AgentCore resources using Terraform.",
    "sectionId": null,
    "kind": "overview",
    "readme": "/agentcore-samples/04-infrastructure-as-code/terraform/README.md",
    "base": "/agentcore-samples/04-infrastructure-as-code/terraform"
  },
  {
    "slug": "05-blueprints/shopping-concierge-agent",
    "title": "Shopping Agent Overview",
    "desc": "AI-powered concierge agent with shopping assistance capabilities, built with AWS Bedrock AgentCore, Amplify, and React.",
    "sectionId": null,
    "kind": "overview",
    "readme": "/agentcore-samples/05-blueprints/shopping-concierge-agent/README.md",
    "base": "/agentcore-samples/05-blueprints/shopping-concierge-agent"
  },
  {
    "slug": "05-blueprints/shopping-concierge-agent/infrastructure",
    "title": "Agent Infrastructure",
    "desc": "CDK infrastructure for deploying the Concierge Agent system with AWS Bedrock AgentCore.",
    "sectionId": null,
    "kind": "overview",
    "readme": "/agentcore-samples/05-blueprints/shopping-concierge-agent/infrastructure/README.md",
    "base": "/agentcore-samples/05-blueprints/shopping-concierge-agent/infrastructure"
  },
  {
    "slug": "05-blueprints/travel-concierge-agent",
    "title": "Travel Agent Overview",
    "desc": "AI-powered concierge agent with travel planning and booking assistance capabilities, built with AWS Bedrock AgentCore, Amplify, and React.",
    "sectionId": null,
    "kind": "overview",
    "readme": "/agentcore-samples/05-blueprints/travel-concierge-agent/README.md",
    "base": "/agentcore-samples/05-blueprints/travel-concierge-agent"
  },
  {
    "slug": "05-blueprints/travel-concierge-agent/infrastructure",
    "title": "Agent Infrastructure",
    "desc": "CDK infrastructure for deploying the Concierge Agent system with AWS Bedrock AgentCore.",
    "sectionId": null,
    "kind": "overview",
    "readme": "/agentcore-samples/05-blueprints/travel-concierge-agent/infrastructure/README.md",
    "base": "/agentcore-samples/05-blueprints/travel-concierge-agent/infrastructure"
  },
  {
    "slug": "06-workshops/01-AgentCore-runtime",
    "title": "Amazon Bedrock AgentCore Runtime",
    "desc": "Amazon Bedrock AgentCore Runtime is a secure, serverless runtime designed for deploying and scaling AI agents and tools. It supports any frameworks, models, and protocols, enabling developers to...",
    "sectionId": "runtime",
    "kind": "overview",
    "readme": "/agentcore-samples/06-workshops/01-AgentCore-runtime/README.md",
    "base": "/agentcore-samples/06-workshops/01-AgentCore-runtime"
  },
  {
    "slug": "06-workshops/01-AgentCore-runtime/01-hosting-agent",
    "title": "Hosting AI Agents on AgentCore Runtime",
    "desc": "This tutorial demonstrates how to host AI agents on Amazon Bedrock AgentCore Runtime using the Amazon Bedrock AgentCore Python SDK. Learn to transform your agent code into a standardized HTTP...",
    "sectionId": "runtime",
    "kind": "overview",
    "readme": "/agentcore-samples/06-workshops/01-AgentCore-runtime/01-hosting-agent/README.md",
    "base": "/agentcore-samples/06-workshops/01-AgentCore-runtime/01-hosting-agent"
  },
  {
    "slug": "06-workshops/01-AgentCore-runtime/03-advanced-concepts",
    "title": "Advanced Concepts",
    "desc": "",
    "sectionId": "runtime",
    "kind": "overview",
    "readme": "/agentcore-samples/06-workshops/01-AgentCore-runtime/03-advanced-concepts/README.md",
    "base": "/agentcore-samples/06-workshops/01-AgentCore-runtime/03-advanced-concepts"
  },
  {
    "slug": "06-workshops/01-AgentCore-runtime/03-advanced-concepts/04-async-agents",
    "title": "Weekly Status Report Generator with Amazon Bedrock AgentCore Runtime",
    "desc": "In this tutorial we will learn how to build and deploy an automated weekly status report generator using Amazon Bedrock AgentCore Runtime. The agent collects data from multiple sources (team...",
    "sectionId": "runtime",
    "kind": "overview",
    "readme": "/agentcore-samples/06-workshops/01-AgentCore-runtime/03-advanced-concepts/04-async-agents/README.md",
    "base": "/agentcore-samples/06-workshops/01-AgentCore-runtime/03-advanced-concepts/04-async-agents"
  },
  {
    "slug": "06-workshops/01-AgentCore-runtime/08-mcp-e2e",
    "title": "Stateful MCP Examples",
    "desc": "End-to-end tutorials demonstrating MCP (Model Context Protocol) server and client features on Amazon Bedrock AgentCore Runtime.",
    "sectionId": "runtime",
    "kind": "overview",
    "readme": "/agentcore-samples/06-workshops/01-AgentCore-runtime/08-mcp-e2e/README.md",
    "base": "/agentcore-samples/06-workshops/01-AgentCore-runtime/08-mcp-e2e"
  },
  {
    "slug": "06-workshops/02-AgentCore-gateway/05-mcp-server-as-a-target/mcpservers",
    "title": "AgentCore Project",
    "desc": "This project was created with the AgentCore CLI.",
    "sectionId": "gateway",
    "kind": "overview",
    "readme": "/agentcore-samples/06-workshops/02-AgentCore-gateway/05-mcp-server-as-a-target/mcpservers/README.md",
    "base": "/agentcore-samples/06-workshops/02-AgentCore-gateway/05-mcp-server-as-a-target/mcpservers"
  },
  {
    "slug": "06-workshops/03-AgentCore-identity",
    "title": "Amazon Bedrock AgentCore Identity",
    "desc": "Amazon Bedrock AgentCore Identity is a comprehensive identity and credential management service designed specifically for AI agents and automated workloads. It provides secure authentication,...",
    "sectionId": "identity",
    "kind": "overview",
    "readme": "/agentcore-samples/06-workshops/03-AgentCore-identity/README.md",
    "base": "/agentcore-samples/06-workshops/03-AgentCore-identity"
  },
  {
    "slug": "06-workshops/03-AgentCore-identity/08-IDP-examples/PingFederate/agent/private-idp-ping-agent",
    "title": "AgentCore Project",
    "desc": "This project was created with the AgentCore CLI.",
    "sectionId": "identity",
    "kind": "overview",
    "readme": "/agentcore-samples/06-workshops/03-AgentCore-identity/08-IDP-examples/PingFederate/agent/private-idp-ping-agent/README.md",
    "base": "/agentcore-samples/06-workshops/03-AgentCore-identity/08-IDP-examples/PingFederate/agent/private-idp-ping-agent"
  },
  {
    "slug": "06-workshops/04-AgentCore-memory",
    "title": "Amazon Bedrock AgentCore Memory",
    "desc": "Memory is a critical component of Agent intelligence. Large Language Models (LLMs) lack persistent memory across conversations. Amazon Bedrock AgentCore Memory addresses this by providing a...",
    "sectionId": "memory",
    "kind": "overview",
    "readme": "/agentcore-samples/06-workshops/04-AgentCore-memory/README.md",
    "base": "/agentcore-samples/06-workshops/04-AgentCore-memory"
  },
  {
    "slug": "06-workshops/04-AgentCore-memory/01-short-term-memory",
    "title": "AgentCore Memory: Short-Term Memory",
    "desc": "Short-term memory in Amazon Bedrock AgentCore provides immediate conversation context and session-based information management. It enables AI agents to maintain continuity within a single...",
    "sectionId": "memory",
    "kind": "overview",
    "readme": "/agentcore-samples/06-workshops/04-AgentCore-memory/01-short-term-memory/README.md",
    "base": "/agentcore-samples/06-workshops/04-AgentCore-memory/01-short-term-memory"
  },
  {
    "slug": "06-workshops/04-AgentCore-memory/02-long-term-memory",
    "title": "AgentCore Memory: Long-Term Memory Strategies",
    "desc": "Long-term memory in Amazon Bedrock AgentCore enables AI agents to maintain persistent information across multiple conversations and sessions. Unlike short-term memory that focuses on immediate...",
    "sectionId": "memory",
    "kind": "overview",
    "readme": "/agentcore-samples/06-workshops/04-AgentCore-memory/02-long-term-memory/README.md",
    "base": "/agentcore-samples/06-workshops/04-AgentCore-memory/02-long-term-memory"
  },
  {
    "slug": "06-workshops/05-AgentCore-tools",
    "title": "Amazon Bedrock AgentCore Tools",
    "desc": "Amazon Bedrock AgentCore Tools provide enterprise-grade capabilities that enhance AI agents' ability to perform complex tasks securely and efficiently. This suite includes tools such as:",
    "sectionId": null,
    "kind": "overview",
    "readme": "/agentcore-samples/06-workshops/05-AgentCore-tools/README.md",
    "base": "/agentcore-samples/06-workshops/05-AgentCore-tools"
  },
  {
    "slug": "06-workshops/05-AgentCore-tools/01-Agent-Core-code-interpreter",
    "title": "Amazon Bedrock AgentCore RuntCode Interpreter",
    "desc": "Amazon Bedrock AgentCore Code Interpreter is a secure and serverless, environment where AI agents can directly write and execute code to complete end-to-end tasks, enabling them to perform complex...",
    "sectionId": "code-interpreter",
    "kind": "overview",
    "readme": "/agentcore-samples/06-workshops/05-AgentCore-tools/01-Agent-Core-code-interpreter/README.md",
    "base": "/agentcore-samples/06-workshops/05-AgentCore-tools/01-Agent-Core-code-interpreter"
  },
  {
    "slug": "06-workshops/05-AgentCore-tools/02-Agent-Core-browser-tool",
    "title": "Amazon Bedrock AgentCore Browser Tool",
    "desc": "Amazon Bedrock AgentCore Browser Tool provides AI agents with a secure, fully managed way to interact with websites just like humans do. It allows agents to navigate web pages, fill out forms, and...",
    "sectionId": "browser",
    "kind": "overview",
    "readme": "/agentcore-samples/06-workshops/05-AgentCore-tools/02-Agent-Core-browser-tool/README.md",
    "base": "/agentcore-samples/06-workshops/05-AgentCore-tools/02-Agent-Core-browser-tool"
  },
  {
    "slug": "06-workshops/06-AgentCore-observability",
    "title": "AgentCore Observability",
    "desc": "This repository demonstrates how to implement AgentCore observability for Agents using Amazon CloudWatch and other providers. It provides examples for both Amazon Bedrock AgentCore Runtime hosted...",
    "sectionId": "observability",
    "kind": "overview",
    "readme": "/agentcore-samples/06-workshops/06-AgentCore-observability/README.md",
    "base": "/agentcore-samples/06-workshops/06-AgentCore-observability"
  },
  {
    "slug": "06-workshops/06-AgentCore-observability/01-Agentcore-runtime-hosted",
    "title": "AgentCore Observability on Amazon CloudWatch for Bedrock AgentCore Runtime Agents",
    "desc": "This repository contains examples to showcase AgentCore Observability for Strands, CrewAI, and LlamaIndex agents hosted on Amazon Bedrock AgentCore Runtime using Amazon OpenTelemetry Python...",
    "sectionId": "observability",
    "kind": "overview",
    "readme": "/agentcore-samples/06-workshops/06-AgentCore-observability/01-Agentcore-runtime-hosted/README.md",
    "base": "/agentcore-samples/06-workshops/06-AgentCore-observability/01-Agentcore-runtime-hosted"
  },
  {
    "slug": "06-workshops/06-AgentCore-observability/02-Agent-not-hosted-on-runtime",
    "title": "Self-Hosted Agent Observability using AgentCore",
    "desc": "This section demonstrates AgentCore Observability for popular open-source agent frameworks not hosted on Amazon Bedrock AgentCore Runtime. Learn to add comprehensive observability to your existing...",
    "sectionId": "observability",
    "kind": "overview",
    "readme": "/agentcore-samples/06-workshops/06-AgentCore-observability/02-Agent-not-hosted-on-runtime/README.md",
    "base": "/agentcore-samples/06-workshops/06-AgentCore-observability/02-Agent-not-hosted-on-runtime"
  },
  {
    "slug": "06-workshops/06-AgentCore-observability/03-advanced-concepts",
    "title": "Advanced Observability Concepts",
    "desc": "This section covers advanced observability patterns and techniques for Amazon Bedrock AgentCore, helping you implement sophisticated customized monitoring and debugging capabilities.",
    "sectionId": "observability",
    "kind": "overview",
    "readme": "/agentcore-samples/06-workshops/06-AgentCore-observability/03-advanced-concepts/README.md",
    "base": "/agentcore-samples/06-workshops/06-AgentCore-observability/03-advanced-concepts"
  },
  {
    "slug": "06-workshops/07-AgentCore-evaluations",
    "title": "Overview",
    "desc": "Amazon Bedrock AgentCore Evaluations helps you optimize your agent's quality based on real-world interactions.",
    "sectionId": "evaluations",
    "kind": "overview",
    "readme": "/agentcore-samples/06-workshops/07-AgentCore-evaluations/README.md",
    "base": "/agentcore-samples/06-workshops/07-AgentCore-evaluations"
  },
  {
    "slug": "06-workshops/07-AgentCore-evaluations/02-running-evaluations",
    "title": "Running Evaluations",
    "desc": "In this tutorial you will learn how to use AgentCore Evaluations to assess your agent's performance using both on-demand and online evaluation approaches. You'll apply built-in and custom...",
    "sectionId": "evaluations",
    "kind": "overview",
    "readme": "/agentcore-samples/06-workshops/07-AgentCore-evaluations/02-running-evaluations/README.md",
    "base": "/agentcore-samples/06-workshops/07-AgentCore-evaluations/02-running-evaluations"
  },
  {
    "slug": "06-workshops/09-AgentCore-E2E",
    "title": "End-to-End AgentCore Workshop",
    "desc": "This workshop walks you through building a complete customer support agent from prototype to production using Amazon Bedrock AgentCore services. The same workshop is implemented in three different...",
    "sectionId": null,
    "kind": "overview",
    "readme": "/agentcore-samples/06-workshops/09-AgentCore-E2E/README.md",
    "base": "/agentcore-samples/06-workshops/09-AgentCore-E2E"
  },
  {
    "slug": "06-workshops/11-AgentCore-harness",
    "title": "Harness in AgentCore — Samples",
    "desc": "Welcome to harness in AgentCore samples.",
    "sectionId": "harness",
    "kind": "overview",
    "readme": "/agentcore-samples/06-workshops/11-AgentCore-harness/README.md",
    "base": "/agentcore-samples/06-workshops/11-AgentCore-harness"
  },
  {
    "slug": "06-workshops/13-AgentCore-payments",
    "title": "Amazon Bedrock AgentCore payments — Samples",
    "desc": "Amazon Bedrock AgentCore payments is a fully managed service that enables microtransaction payments in AI agents to access paid APIs, MCP servers, and content. AI agents increasingly handle...",
    "sectionId": "payments",
    "kind": "overview",
    "readme": "/agentcore-samples/06-workshops/13-AgentCore-payments/README.md",
    "base": "/agentcore-samples/06-workshops/13-AgentCore-payments"
  },
  {
    "slug": "06-workshops/13-AgentCore-payments/02-use-cases",
    "title": "Use Cases",
    "desc": "Real-world use cases that demonstrate Amazon Bedrock AgentCore payments in action. Each use case is a standalone sample with its own notebook, environment configuration, and supporting infrastructure.",
    "sectionId": "payments",
    "kind": "overview",
    "readme": "/agentcore-samples/06-workshops/13-AgentCore-payments/02-use-cases/README.md",
    "base": "/agentcore-samples/06-workshops/13-AgentCore-payments/02-use-cases"
  }
];

export const SAMPLES_BY_SECTION = AGENTCORE_SAMPLES.reduce((acc, s) => {
  if (!s.sectionId) return acc;
  (acc[s.sectionId] = acc[s.sectionId] || []).push(s);
  return acc;
}, {});

export const SAMPLE_KINDS = [...new Set(AGENTCORE_SAMPLES.map((s) => s.kind))].sort();
export const SAMPLE_FRAMEWORKS = [...new Set(AGENTCORE_SAMPLES.flatMap((s) => s.frameworks))].sort();
