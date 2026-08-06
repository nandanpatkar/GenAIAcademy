/*
 * Amazon Connect course track.
 *
 * GENERATED FILE. Do not edit by hand.
 * Generator: tools/build-connect-data.mjs  (node tools/build-connect-data.mjs)
 *
 * Built from the raw course exports in conne/. Each course follows the shape
 * documented in src/data/courses.js, with two track-specific additions:
 *
 *   track     'amazon-connect' — selects the AWS theme and groups the course
 *                                on the library screen.
 *   category  the shelf a course sits on within the track.
 *
 * `quiz` is null for every course in this track: the exports carry a knowledge
 * check per topic (surfaced as that topic's review questions) but no separate
 * exam bank, so there is nothing to build a scored quiz from.
 *
 * The course text runs to megabytes, so the manifest below holds metadata only
 * and `loadAmazonConnectCourse` imports a course's content when it is opened.
 * Each import is memoised, so revisiting a course is instant.
 */

export const AMAZON_CONNECT_TRACK = {
  id: 'amazon-connect',
  title: 'Amazon Connect',
  provider: 'Amazon Web Services',
  blurb:
    'Contact center course material covering routing, flows, channels, analytics, AI, development, and administration.',
};

/* Shelves within the track, in the order they should be listed. */
export const AMAZON_CONNECT_CATEGORIES = [
  'Foundations',
  'Routing',
  'Flows',
  'Agent experience',
  'Analytics',
  'AI and automation',
  'Channels',
  'Development',
  'Administration',
];

export const amazonConnectCatalog = [
  {
    "id": "connect-introduction",
    "track": "amazon-connect",
    "code": "AWS",
    "title": "Amazon Connect Introduction",
    "provider": "Amazon Web Services",
    "level": "Fundamentals",
    "category": "Foundations",
    "description": "What Amazon Connect is, its common use cases and benefits, and its pay-as-you-go pricing model, with the NatWest customer story.",
    "examFormat": "3 topics · ~9 min · 4 review questions",
    "sourceFiles": [
      "conne/AMAZON CONNECT INTRODUCTION.txt"
    ],
    "topicCount": 3,
    "questionCount": 4,
    "lazy": true
  },
  {
    "id": "connect-foundations",
    "track": "amazon-connect",
    "code": "AWS",
    "title": "Amazon Connect Foundations",
    "provider": "Amazon Web Services",
    "level": "Fundamentals",
    "category": "Foundations",
    "description": "Legacy versus cloud contact centers, core architecture and terminology, compliance essentials, and customer experience design principles.",
    "examFormat": "20 topics · ~23 min · 9 review questions",
    "sourceFiles": [
      "conne/AMAZON CONNECT FOUNDATIONS.txt"
    ],
    "topicCount": 20,
    "questionCount": 9,
    "lazy": true
  },
  {
    "id": "connect-architecture-fundamentals",
    "track": "amazon-connect",
    "code": "AWS",
    "title": "Architecture Fundamentals",
    "provider": "Amazon Web Services",
    "level": "Fundamentals",
    "category": "Foundations",
    "description": "Create an instance and navigate the admin workspace, then build the foundation: hours of operation, queues, routing profiles, users, flows, and reports.",
    "examFormat": "23 topics · ~29 min · 13 review questions",
    "sourceFiles": [
      "conne/AMAZON CONNECT ARCHITECTURE FUNDAMENTALS.txt"
    ],
    "topicCount": 23,
    "questionCount": 13,
    "lazy": true
  },
  {
    "id": "connect-instance-fundamentals",
    "track": "amazon-connect",
    "code": "AWS",
    "title": "Instance Fundamentals",
    "provider": "Amazon Web Services",
    "level": "Fundamentals",
    "category": "Foundations",
    "description": "Instance design considerations, creating an instance, and the additional configuration options available once it exists.",
    "examFormat": "6 topics · ~32 min · 10 review questions",
    "sourceFiles": [
      "conne/AMAZON CONNECT INSTANCE FUNDAMENTALS.txt",
      "conne-text/Amazon Connect Instance Fundamentals Course Summary.txt  (from conne/Amazon Connect Instance Fundamentals Course Summary.pdf)"
    ],
    "topicCount": 6,
    "questionCount": 10,
    "lazy": true
  },
  {
    "id": "connect-creating-managing-instances",
    "track": "amazon-connect",
    "code": "AWS",
    "title": "Creating and Managing Instances",
    "provider": "Amazon Web Services",
    "level": "Fundamentals",
    "category": "Foundations",
    "description": "What to settle before you create an instance, the steps to create and configure one, and how to modify configurations as the business grows.",
    "examFormat": "4 topics · ~16 min · 13 review questions",
    "sourceFiles": [
      "conne/AMAZON CONNECT CREATING AND MANAGING AMAZON CONNECT INSTANCES.txt"
    ],
    "topicCount": 4,
    "questionCount": 13,
    "lazy": true
  },
  {
    "id": "connect-console-fundamentals",
    "track": "amazon-connect",
    "code": "AWS",
    "title": "Console Fundamentals",
    "provider": "Amazon Web Services",
    "level": "Fundamentals",
    "category": "Foundations",
    "description": "The Amazon Connect console: managing resource access control and navigating between instance settings and the admin workspace.",
    "examFormat": "5 topics · ~24 min · 3 review questions",
    "sourceFiles": [
      "conne/AMAZON CONNECT CONSOLE FUNDAMENTALS.txt",
      "conne-text/Amazon Connect Console Fundamentals Summary.txt  (from conne/Amazon Connect Console Fundamentals Summary.pdf)"
    ],
    "topicCount": 5,
    "questionCount": 3,
    "lazy": true
  },
  {
    "id": "connect-routing-fundamentals",
    "track": "amazon-connect",
    "code": "AWS",
    "title": "Routing Fundamentals",
    "provider": "Amazon Web Services",
    "level": "Fundamentals",
    "category": "Routing",
    "description": "Routing concepts and terminology, queues and routing profiles, inbound and outbound routing, and the built-in routing strategies.",
    "examFormat": "7 topics · ~37 min · 9 review questions",
    "sourceFiles": [
      "conne/AMAZON CONNECT ROUTING FUNDAMENTALS.txt",
      "conne-text/Amazon Connect Routing Fundamentals Summary.txt  (from conne/Amazon Connect Routing Fundamentals Summary.pdf)"
    ],
    "topicCount": 7,
    "questionCount": 9,
    "lazy": true
  },
  {
    "id": "connect-routing-intermediate",
    "track": "amazon-connect",
    "code": "AWS",
    "title": "Routing Intermediate",
    "provider": "Amazon Web Services",
    "level": "Intermediate",
    "category": "Routing",
    "description": "Implementing a routing strategy: queue prioritization, proficiency routing, and data-driven routing decisions.",
    "examFormat": "6 topics · ~42 min · 11 review questions",
    "sourceFiles": [
      "conne/AMAZON CONNECT ROUTING INTERMEDIATE.txt",
      "conne-text/Amazon Connect Routing Intermediate Summary.txt  (from conne/Amazon Connect Routing Intermediate Summary.pdf)"
    ],
    "topicCount": 6,
    "questionCount": 11,
    "lazy": true
  },
  {
    "id": "connect-optimizing-routing",
    "track": "amazon-connect",
    "code": "AWS",
    "title": "Optimizing Routing Solutions",
    "provider": "Amazon Web Services",
    "level": "Advanced",
    "category": "Routing",
    "description": "Dynamic routing design, plus handling unexpected contact volumes, fraudulent calls, and resuming interrupted interactions.",
    "examFormat": "6 topics · ~33 min · 8 review questions",
    "sourceFiles": [
      "conne/AMAZON CONNECT OPTIMIZING ROUTING SOLUTIONS.txt",
      "conne-text/Amazon Connect Optimizing Routing Solutions Summary.txt  (from conne/Amazon Connect Optimizing Routing Solutions Summary.pdf)"
    ],
    "topicCount": 6,
    "questionCount": 8,
    "lazy": true
  },
  {
    "id": "connect-flows-fundamentals",
    "track": "amazon-connect",
    "code": "AWS",
    "title": "Flows Fundamentals",
    "provider": "Amazon Web Services",
    "level": "Fundamentals",
    "category": "Flows",
    "description": "Flow types and the flow designer, the blocks that enable additional Amazon Connect functionality, and operational support blocks.",
    "examFormat": "6 topics · ~40 min · 6 review questions",
    "sourceFiles": [
      "conne/AMAZON CONNECT FLOWS FUNDAMENTAL.txt",
      "conne-text/Amazon Connect Flows Fundamentals Summary.txt  (from conne/Amazon Connect Flows Fundamentals Summary.pdf)"
    ],
    "topicCount": 6,
    "questionCount": 6,
    "lazy": true
  },
  {
    "id": "connect-flows-intermediate",
    "track": "amazon-connect",
    "code": "AWS",
    "title": "Flows Intermediate",
    "provider": "Amazon Web Services",
    "level": "Intermediate",
    "category": "Flows",
    "description": "Contact attribute types and use cases, using attributes in flows, pulling in external data sources, and flow design best practices.",
    "examFormat": "6 topics · ~41 min · 6 review questions",
    "sourceFiles": [
      "conne/AMAZON CONNECT FLOWS INTERMEDIATE.txt",
      "conne-text/Amazon Connect Flows Intermediate Course Summary.txt  (from conne/Amazon Connect Flows Intermediate Course Summary.pdf)"
    ],
    "topicCount": 6,
    "questionCount": 6,
    "lazy": true
  },
  {
    "id": "connect-flow-modules-guides",
    "track": "amazon-connect",
    "code": "AWS",
    "title": "Flow Modules and Step-by-Step Guides",
    "provider": "Amazon Web Services",
    "level": "Intermediate",
    "category": "Flows",
    "description": "Reusable flow modules, and building the step-by-step guides that walk agents through a process in the agent workspace.",
    "examFormat": "4 topics · ~28 min · 6 review questions",
    "sourceFiles": [
      "conne/AMAZON CONNECT FLOW MODULES AND STEP BY STEP GUIDE.txt"
    ],
    "topicCount": 4,
    "questionCount": 6,
    "lazy": true
  },
  {
    "id": "connect-agent-application-fundamentals",
    "track": "amazon-connect",
    "code": "AWS",
    "title": "Agent Application Fundamentals",
    "provider": "Amazon Web Services",
    "level": "Fundamentals",
    "category": "Agent experience",
    "description": "The Contact Control Panel and the agent workspace: what agents see, how they handle contacts, and the considerations that apply.",
    "examFormat": "6 topics · ~34 min · 7 review questions",
    "sourceFiles": [
      "conne/AMAZON CONNECT AGENT APPLICATION FUNDAMENTALS.txt",
      "conne-text/Amazon Connect Agent Applications Fundamentals Course Summary.txt  (from conne/Amazon Connect Agent Applications Fundamentals Course Summary.pdf)"
    ],
    "topicCount": 6,
    "questionCount": 7,
    "lazy": true
  },
  {
    "id": "connect-custom-ccp-fundamentals",
    "track": "amazon-connect",
    "code": "AWS",
    "title": "Custom CCP Fundamentals",
    "provider": "Amazon Web Services",
    "level": "Fundamentals",
    "category": "Agent experience",
    "description": "The Amazon Connect Streams API: built-in and extended functionality, and the considerations and best practices for a custom CCP.",
    "examFormat": "5 topics · ~25 min · 6 review questions",
    "sourceFiles": [
      "conne/AMAZON CONNECT CUSTOM CCP FUNDAMENTALS.txt",
      "conne-text/Building a Contact Control Panel Fundamentals Course Summary.txt  (from conne/Building a Contact Control Panel Fundamentals Course Summary.pdf)"
    ],
    "topicCount": 5,
    "questionCount": 6,
    "lazy": true
  },
  {
    "id": "connect-custom-ccp-intermediate",
    "track": "amazon-connect",
    "code": "AWS",
    "title": "Custom CCP Intermediate",
    "provider": "Amazon Web Services",
    "level": "Intermediate",
    "category": "Agent experience",
    "description": "Streams architecture and the Core, Agent, and Contact APIs, plus Customer Profiles, Amazon Q in Connect, and step-by-step guides in a custom CCP.",
    "examFormat": "9 topics · ~54 min · 7 review questions",
    "sourceFiles": [
      "conne/AMAZON CONNECT CUSTOM CCP INTERMEDIATE.txt",
      "conne-text/Amazon Connect Custom Contact Control Panel Intermediate Intermediate Summary.txt  (from conne/Amazon Connect Custom Contact Control Panel Intermediate Intermediate Summary.pdf)"
    ],
    "topicCount": 9,
    "questionCount": 7,
    "lazy": true
  },
  {
    "id": "connect-agent-performance-evaluation",
    "track": "amazon-connect",
    "code": "AWS",
    "title": "Agent Performance Evaluation",
    "provider": "Amazon Web Services",
    "level": "Intermediate",
    "category": "Agent experience",
    "description": "Building evaluation forms and scoring criteria, automating evaluations, running calibration sessions, and analyzing and communicating results.",
    "examFormat": "18 topics · ~25 min · 12 review questions",
    "sourceFiles": [
      "conne/AMAZON CONNECT AGENT PERFORMANCE EVALUATION.txt"
    ],
    "topicCount": 18,
    "questionCount": 12,
    "lazy": true
  },
  {
    "id": "connect-contact-lens-fundamentals",
    "track": "amazon-connect",
    "code": "AWS",
    "title": "Contact Lens Fundamentals",
    "provider": "Amazon Web Services",
    "level": "Fundamentals",
    "category": "Analytics",
    "description": "What Contact Lens analyzes, its advanced functionality, how it is used day to day, and the considerations that apply.",
    "examFormat": "6 topics · ~28 min · 6 review questions",
    "sourceFiles": [
      "conne/AMAZON CONNECT CONTACT LENS FUNDAMENTAL.txt",
      "conne-text/Amazon Connect Contact Lens Fundamentals Summary.txt  (from conne/Amazon Connect Contact Lens Fundamentals Summary.pdf)"
    ],
    "topicCount": 6,
    "questionCount": 6,
    "lazy": true
  },
  {
    "id": "connect-metrics-analytics",
    "track": "amazon-connect",
    "code": "AWS",
    "title": "Metrics and Analytics",
    "provider": "Amazon Web Services",
    "level": "Intermediate",
    "category": "Analytics",
    "description": "Metric categories and KPIs, real-time monitoring and decision-making, and designing, securing, and troubleshooting custom historical reports.",
    "examFormat": "19 topics · ~37 min · 10 review questions",
    "sourceFiles": [
      "conne/AMAZON CONNECT METRICS AND ANALYTICS.txt"
    ],
    "topicCount": 19,
    "questionCount": 10,
    "lazy": true
  },
  {
    "id": "connect-conversational-analytics",
    "track": "amazon-connect",
    "code": "AWS",
    "title": "Conversational Analytics Essentials",
    "provider": "Amazon Web Services",
    "level": "Intermediate",
    "category": "Analytics",
    "description": "Agent, queue, contact, bot, and evaluation metrics; recording configuration and strategies; and recording retention, access control, and management.",
    "examFormat": "22 topics · ~52 min · 12 review questions",
    "sourceFiles": [
      "conne/AMAZON CONNECT CONVERSATIONAL ANALYTICS ESSENTIALS.txt"
    ],
    "topicCount": 22,
    "questionCount": 12,
    "lazy": true
  },
  {
    "id": "connect-ai-agent-capabilities",
    "track": "amazon-connect",
    "code": "AWS",
    "title": "AI Agent Capabilities",
    "provider": "Amazon Web Services",
    "level": "Intermediate",
    "category": "AI and automation",
    "description": "Where AI helps agents, Amazon Q in Connect and guided workflows, and real-time transcription, sentiment analysis, and post-contact summarization.",
    "examFormat": "18 topics · ~21 min · 11 review questions",
    "sourceFiles": [
      "conne/AMAZON CONNECT AI AGENT CAPABILITIES.txt"
    ],
    "topicCount": 18,
    "questionCount": 11,
    "lazy": true
  },
  {
    "id": "connect-ai-customer-engagement",
    "track": "amazon-connect",
    "code": "AWS",
    "title": "AI Customer Engagement",
    "provider": "Amazon Web Services",
    "level": "Intermediate",
    "category": "AI and automation",
    "description": "Customer data and personalization, Customer Profiles with generative AI data mapping and identity resolution, and AI-assisted outbound campaigns.",
    "examFormat": "21 topics · ~42 min · 9 review questions",
    "sourceFiles": [
      "conne/AMAZON CONNECT AI CUSTOMER ENGAGEMENT.txt"
    ],
    "topicCount": 21,
    "questionCount": 9,
    "lazy": true
  },
  {
    "id": "connect-customer-profiles-fundamentals",
    "track": "amazon-connect",
    "code": "AWS",
    "title": "Customer Profiles Fundamentals",
    "provider": "Amazon Web Services",
    "level": "Fundamentals",
    "category": "AI and automation",
    "description": "What Customer Profiles brings together, how agents use it during a contact, and the considerations for enabling it.",
    "examFormat": "5 topics · ~36 min · 6 review questions",
    "sourceFiles": [
      "conne/AMAZON CONNECT CUSTOMER PROFILE FUNDAMENTALS.txt",
      "conne-text/Amazon Connect Customer Profiles Getting Started Course Summary.txt  (from conne/Amazon Connect Customer Profiles Getting Started Course Summary.pdf)"
    ],
    "topicCount": 5,
    "questionCount": 6,
    "lazy": true
  },
  {
    "id": "connect-conversational-interfaces",
    "track": "amazon-connect",
    "code": "AWS",
    "title": "Conversational Interfaces Intermediate",
    "provider": "Amazon Web Services",
    "level": "Intermediate",
    "category": "AI and automation",
    "description": "IVR systems and intelligent self-service routing, Amazon Lex with Amazon Connect, capturing contact input, and the Connect–Lex data exchange.",
    "examFormat": "9 topics · ~32 min · 14 review questions",
    "sourceFiles": [
      "conne/AMAZON CONNECT CONVERSATIONAL INTERFACES INTERMEDIATE.txt",
      "conne-text/Amazon Connect Conversational Interfaces Intermediate Course Summary.txt  (from conne/Amazon Connect Conversational Interfaces Intermediate Course Summary.pdf)"
    ],
    "topicCount": 9,
    "questionCount": 14,
    "lazy": true
  },
  {
    "id": "connect-voice-intermediate",
    "track": "amazon-connect",
    "code": "AWS",
    "title": "Voice Intermediate",
    "provider": "Amazon Web Services",
    "level": "Intermediate",
    "category": "Channels",
    "description": "Amazon Connect telephony, the telecoms country coverage guide, configuring phone numbers, in-app, web, and video calling, and voice pricing.",
    "examFormat": "8 topics · ~1 h 5 min · 6 review questions",
    "sourceFiles": [
      "conne/AMAZON CONNECT VOICE INTERMEDIATE.txt",
      "conne-text/Amazon Connect Voice Course Summary.txt  (from conne/Amazon Connect Voice Course Summary.pdf)"
    ],
    "topicCount": 8,
    "questionCount": 6,
    "lazy": true
  },
  {
    "id": "connect-chat-messaging-intermediate",
    "track": "amazon-connect",
    "code": "AWS",
    "title": "Chat and Messaging Intermediate",
    "provider": "Amazon Web Services",
    "level": "Intermediate",
    "category": "Channels",
    "description": "The Amazon Connect communication widget, SMS messaging, and the Amazon Connect Chat feature set.",
    "examFormat": "3 topics · ~30 min · 9 review questions",
    "sourceFiles": [
      "conne/AMAZON CONNECT CHAT AND MESSAGING INTERMEDIATE.txt"
    ],
    "topicCount": 3,
    "questionCount": 9,
    "lazy": true
  },
  {
    "id": "connect-implementing-chats",
    "track": "amazon-connect",
    "code": "AWS",
    "title": "Implementing Chats in Amazon Connect",
    "provider": "Amazon Web Services",
    "level": "Intermediate",
    "category": "Channels",
    "description": "What Amazon Connect Chat provides, how to integrate it into your own website or application, and the considerations that apply.",
    "examFormat": "4 topics · ~1 h 9 min · 6 review questions",
    "sourceFiles": [
      "conne/AMAZON CONNECT IMPLEMENTING CHATS IN CONNECT.txt"
    ],
    "topicCount": 4,
    "questionCount": 6,
    "lazy": true
  },
  {
    "id": "connect-implementing-tasks",
    "track": "amazon-connect",
    "code": "AWS",
    "title": "Implementing Tasks in Amazon Connect",
    "provider": "Amazon Web Services",
    "level": "Intermediate",
    "category": "Channels",
    "description": "Configuring and creating tasks, orchestrating them with prebuilt integrations and rules, and reporting on task contacts.",
    "examFormat": "8 topics · ~51 min · 8 review questions",
    "sourceFiles": [
      "conne/AMAZON CONNECT IMPLEMENTING TASKS IN CONNECT.txt"
    ],
    "topicCount": 8,
    "questionCount": 8,
    "lazy": true
  },
  {
    "id": "connect-development-fundamentals",
    "track": "amazon-connect",
    "code": "AWS",
    "title": "Development Fundamentals",
    "provider": "Amazon Web Services",
    "level": "Fundamentals",
    "category": "Development",
    "description": "Reaching Amazon Connect programmatically: the AWS CLI, the Amazon Connect REST APIs, and the AWS SDKs.",
    "examFormat": "5 topics · ~39 min · 11 review questions",
    "sourceFiles": [
      "conne/AMAZON CONNECT DEVELOPMENT FUNDAMENTALS.txt",
      "conne-text/Amazon Connect Development Fundamentals Summary.txt  (from conne/Amazon Connect Development Fundamentals Summary.pdf)"
    ],
    "topicCount": 5,
    "questionCount": 11,
    "lazy": true
  },
  {
    "id": "connect-integrations-intermediate",
    "track": "amazon-connect",
    "code": "AWS",
    "title": "Integrations Intermediate",
    "provider": "Amazon Web Services",
    "level": "Intermediate",
    "category": "Development",
    "description": "Streaming contact events, agent events, Contact Lens real-time analytics, and contact records, plus integrating Amazon API Gateway with Connect.",
    "examFormat": "6 topics · ~40 min · 14 review questions",
    "sourceFiles": [
      "conne/AMAZON CONNECT INTEGRATIONS INTERMEDIATE.txt",
      "conne-text/Amazon Connect Integrations Intermediate Summary.txt  (from conne/Amazon Connect Integrations Intermediate Summary.pdf)"
    ],
    "topicCount": 6,
    "questionCount": 14,
    "lazy": true
  },
  {
    "id": "connect-flows-advanced",
    "track": "amazon-connect",
    "code": "AWS",
    "title": "Flows Advanced",
    "provider": "Amazon Web Services",
    "level": "Advanced",
    "category": "Flows",
    "description": "Flow modules as reusable components and step-by-step guides for agents: what they are, the benefits of each, and the considerations for both.",
    "examFormat": "1 topic · ~2 min",
    "sourceFiles": [
      "conne-text/Amazon Connect Flows Advanced Summary.txt  (from conne/Amazon Connect Flows Advanced Summary.pdf)"
    ],
    "topicCount": 1,
    "questionCount": 0,
    "lazy": true
  },
  {
    "id": "connect-agent-reference-cards",
    "track": "amazon-connect",
    "code": "AWS",
    "title": "Agent Reference Cards",
    "provider": "Amazon Web Services",
    "level": "Reference",
    "category": "Agent experience",
    "description": "Quick reference for agents: signing in and out with SAML, answering, transferring and making calls, handling tasks, browser support, and troubleshooting.",
    "examFormat": "2 topics · ~2 min",
    "sourceFiles": [
      "conne-text/Agent Reference Cards.txt  (from conne/Agent Reference Cards.pdf)"
    ],
    "topicCount": 2,
    "questionCount": 0,
    "lazy": true
  },
  {
    "id": "connect-appflow",
    "track": "amazon-connect",
    "code": "AWS",
    "title": "Amazon AppFlow for Amazon Connect",
    "provider": "Amazon Web Services",
    "level": "Fundamentals",
    "category": "Development",
    "description": "Connectors, connections and flows; on-demand, scheduled and event-triggered runs; permissions; and the service guide for wiring SaaS data into Customer Profiles.",
    "examFormat": "17 topics · ~34 min",
    "sourceFiles": [
      "conne-text/Document 3.txt  (from conne/Document 3.pdf)",
      "conne/Amazon AppFlow.txt"
    ],
    "topicCount": 17,
    "questionCount": 0,
    "lazy": true
  },
  {
    "id": "connect-implementing-tasks-walkthrough",
    "track": "amazon-connect",
    "code": "AWS",
    "title": "Implementing Tasks — Guided Walkthrough",
    "provider": "Amazon Web Services",
    "level": "Intermediate",
    "category": "Channels",
    "description": "The guided walkthrough export of the tasks course: the same eight lessons, written as a linear read-through. Its knowledge checks carry no answer key.",
    "examFormat": "8 topics · ~57 min",
    "sourceFiles": [
      "conne/IMPLEMENTING TASKS IN AWS CONNECT.txt"
    ],
    "topicCount": 8,
    "questionCount": 0,
    "lazy": true
  },
  {
    "id": "connect-administration",
    "track": "amazon-connect",
    "code": "AWS",
    "title": "Amazon Connect Administration",
    "provider": "Amazon Web Services",
    "level": "Advanced",
    "category": "Administration",
    "description": "Advanced flow design, AWS service integration with Lambda, Lex, Polly and databases, security and compliance implementation, and the reliability model.",
    "examFormat": "27 topics · ~27 min · 13 review questions",
    "sourceFiles": [
      "conne/AMAZON CONNECT ADMINISTRATION.txt"
    ],
    "topicCount": 27,
    "questionCount": 13,
    "lazy": true
  },
  {
    "id": "connect-troubleshooting",
    "track": "amazon-connect",
    "code": "AWS",
    "title": "Amazon Connect Troubleshooting",
    "provider": "Amazon Web Services",
    "level": "Advanced",
    "category": "Administration",
    "description": "Gathering information from the console and CLI, monitoring, and troubleshooting CCP errors, audio quality, contact flows, and routing.",
    "examFormat": "10 topics · ~44 min · 2 review questions",
    "sourceFiles": [
      "conne/AMAZON CONNECT TROUBLESHOOTING.txt"
    ],
    "topicCount": 10,
    "questionCount": 2,
    "lazy": true
  }
];

const LOADERS = {
  'connect-introduction': () => import('./courses/connect-introduction.js'),
  'connect-foundations': () => import('./courses/connect-foundations.js'),
  'connect-architecture-fundamentals': () => import('./courses/connect-architecture-fundamentals.js'),
  'connect-instance-fundamentals': () => import('./courses/connect-instance-fundamentals.js'),
  'connect-creating-managing-instances': () => import('./courses/connect-creating-managing-instances.js'),
  'connect-console-fundamentals': () => import('./courses/connect-console-fundamentals.js'),
  'connect-routing-fundamentals': () => import('./courses/connect-routing-fundamentals.js'),
  'connect-routing-intermediate': () => import('./courses/connect-routing-intermediate.js'),
  'connect-optimizing-routing': () => import('./courses/connect-optimizing-routing.js'),
  'connect-flows-fundamentals': () => import('./courses/connect-flows-fundamentals.js'),
  'connect-flows-intermediate': () => import('./courses/connect-flows-intermediate.js'),
  'connect-flow-modules-guides': () => import('./courses/connect-flow-modules-guides.js'),
  'connect-agent-application-fundamentals': () => import('./courses/connect-agent-application-fundamentals.js'),
  'connect-custom-ccp-fundamentals': () => import('./courses/connect-custom-ccp-fundamentals.js'),
  'connect-custom-ccp-intermediate': () => import('./courses/connect-custom-ccp-intermediate.js'),
  'connect-agent-performance-evaluation': () => import('./courses/connect-agent-performance-evaluation.js'),
  'connect-contact-lens-fundamentals': () => import('./courses/connect-contact-lens-fundamentals.js'),
  'connect-metrics-analytics': () => import('./courses/connect-metrics-analytics.js'),
  'connect-conversational-analytics': () => import('./courses/connect-conversational-analytics.js'),
  'connect-ai-agent-capabilities': () => import('./courses/connect-ai-agent-capabilities.js'),
  'connect-ai-customer-engagement': () => import('./courses/connect-ai-customer-engagement.js'),
  'connect-customer-profiles-fundamentals': () => import('./courses/connect-customer-profiles-fundamentals.js'),
  'connect-conversational-interfaces': () => import('./courses/connect-conversational-interfaces.js'),
  'connect-voice-intermediate': () => import('./courses/connect-voice-intermediate.js'),
  'connect-chat-messaging-intermediate': () => import('./courses/connect-chat-messaging-intermediate.js'),
  'connect-implementing-chats': () => import('./courses/connect-implementing-chats.js'),
  'connect-implementing-tasks': () => import('./courses/connect-implementing-tasks.js'),
  'connect-development-fundamentals': () => import('./courses/connect-development-fundamentals.js'),
  'connect-integrations-intermediate': () => import('./courses/connect-integrations-intermediate.js'),
  'connect-flows-advanced': () => import('./courses/connect-flows-advanced.js'),
  'connect-agent-reference-cards': () => import('./courses/connect-agent-reference-cards.js'),
  'connect-appflow': () => import('./courses/connect-appflow.js'),
  'connect-implementing-tasks-walkthrough': () => import('./courses/connect-implementing-tasks-walkthrough.js'),
  'connect-administration': () => import('./courses/connect-administration.js'),
  'connect-troubleshooting': () => import('./courses/connect-troubleshooting.js'),
};

const cache = new Map();

export function loadAmazonConnectCourse(courseId) {
  const loader = LOADERS[courseId];
  if (!loader) return null;
  if (!cache.has(courseId)) cache.set(courseId, loader().then((module) => module.course));
  return cache.get(courseId);
}
