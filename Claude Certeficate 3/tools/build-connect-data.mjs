/*
 * Generates src/data/amazon-connect/ from the course material in conne/.
 *
 *   node tools/extract-pdf-text.mjs     (once, and after conne/ changes)
 *   node tools/build-connect-data.mjs
 *
 * Everything under src/data/amazon-connect/courses/ is generated — edit this
 * script or tools/connect-parser.mjs and re-run rather than editing the output.
 *
 * Two kinds of source feed this build:
 *
 *   conne/*.txt        exports of the interactive courseware
 *   conne-text/*.txt   text pulled out of the PDFs in conne/ by
 *                      tools/extract-pdf-text.mjs
 *
 * The catalog below supplies only what the raw text does not carry: a stable
 * id, a display title, a level, a category, and a one-line description. Each
 * description is written from that file's own topic list, so it says what the
 * course actually covers. All teaching content comes from the source files.
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { parseCourseText, proseWordCount, estimateDuration } from './connect-parser.mjs';

const here = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(here, '..');
const SOURCE_DIR = path.join(root, 'conne');
const PDF_TEXT_DIR = path.join(root, 'conne-text');
const OUT_DIR = path.join(root, 'src', 'data', 'amazon-connect');

/*
 * Where a catalog entry's files live.
 *
 *   file          the courseware export, under conne/
 *   pdf           text extracted from a PDF, under conne-text/
 *   summaryPdf    a "Course Summary" PDF for the same course; folded into one
 *                 closing topic rather than becoming a course of its own
 *   pdfFurniture  running headers to strip when the text came from a PDF that
 *                 was extracted by something other than our own tool
 */
function sourcePath(entry) {
  return entry.pdf ? path.join(PDF_TEXT_DIR, entry.pdf) : path.join(SOURCE_DIR, entry.file);
}

/* ---------------------------------------------------------------------------
 * Catalog
 * ------------------------------------------------------------------------ */

const CATALOG = [
  {
    file: 'AMAZON CONNECT INTRODUCTION.txt',
    id: 'connect-introduction',
    title: 'Amazon Connect Introduction',
    level: 'Fundamentals',
    category: 'Foundations',
    description:
      'What Amazon Connect is, its common use cases and benefits, and its pay-as-you-go pricing model, with the NatWest customer story.',
  },
  {
    file: 'AMAZON CONNECT FOUNDATIONS.txt',
    id: 'connect-foundations',
    title: 'Amazon Connect Foundations',
    level: 'Fundamentals',
    category: 'Foundations',
    description:
      'Legacy versus cloud contact centers, core architecture and terminology, compliance essentials, and customer experience design principles.',
  },
  {
    file: 'AMAZON CONNECT ARCHITECTURE FUNDAMENTALS.txt',
    id: 'connect-architecture-fundamentals',
    title: 'Architecture Fundamentals',
    level: 'Fundamentals',
    category: 'Foundations',
    description:
      'Create an instance and navigate the admin workspace, then build the foundation: hours of operation, queues, routing profiles, users, flows, and reports.',
  },
  {
    file: 'AMAZON CONNECT INSTANCE FUNDAMENTALS.txt',
    summaryPdf: 'Amazon Connect Instance Fundamentals Course Summary.txt',
    id: 'connect-instance-fundamentals',
    title: 'Instance Fundamentals',
    level: 'Fundamentals',
    category: 'Foundations',
    description:
      'Instance design considerations, creating an instance, and the additional configuration options available once it exists.',
  },
  {
    file: 'AMAZON CONNECT CREATING AND MANAGING AMAZON CONNECT INSTANCES.txt',
    id: 'connect-creating-managing-instances',
    title: 'Creating and Managing Instances',
    level: 'Fundamentals',
    category: 'Foundations',
    description:
      'What to settle before you create an instance, the steps to create and configure one, and how to modify configurations as the business grows.',
  },
  {
    file: 'AMAZON CONNECT CONSOLE FUNDAMENTALS.txt',
    summaryPdf: 'Amazon Connect Console Fundamentals Summary.txt',
    id: 'connect-console-fundamentals',
    title: 'Console Fundamentals',
    level: 'Fundamentals',
    category: 'Foundations',
    description:
      'The Amazon Connect console: managing resource access control and navigating between instance settings and the admin workspace.',
  },

  {
    file: 'AMAZON CONNECT ROUTING FUNDAMENTALS.txt',
    summaryPdf: 'Amazon Connect Routing Fundamentals Summary.txt',
    id: 'connect-routing-fundamentals',
    title: 'Routing Fundamentals',
    level: 'Fundamentals',
    category: 'Routing',
    description:
      'Routing concepts and terminology, queues and routing profiles, inbound and outbound routing, and the built-in routing strategies.',
  },
  {
    file: 'AMAZON CONNECT ROUTING INTERMEDIATE.txt',
    summaryPdf: 'Amazon Connect Routing Intermediate Summary.txt',
    id: 'connect-routing-intermediate',
    title: 'Routing Intermediate',
    level: 'Intermediate',
    category: 'Routing',
    description:
      'Implementing a routing strategy: queue prioritization, proficiency routing, and data-driven routing decisions.',
  },
  {
    file: 'AMAZON CONNECT OPTIMIZING ROUTING SOLUTIONS.txt',
    summaryPdf: 'Amazon Connect Optimizing Routing Solutions Summary.txt',
    id: 'connect-optimizing-routing',
    title: 'Optimizing Routing Solutions',
    level: 'Advanced',
    category: 'Routing',
    description:
      'Dynamic routing design, plus handling unexpected contact volumes, fraudulent calls, and resuming interrupted interactions.',
  },

  {
    file: 'AMAZON CONNECT FLOWS FUNDAMENTAL.txt',
    summaryPdf: 'Amazon Connect Flows Fundamentals Summary.txt',
    id: 'connect-flows-fundamentals',
    title: 'Flows Fundamentals',
    level: 'Fundamentals',
    category: 'Flows',
    description:
      'Flow types and the flow designer, the blocks that enable additional Amazon Connect functionality, and operational support blocks.',
  },
  {
    file: 'AMAZON CONNECT FLOWS INTERMEDIATE.txt',
    summaryPdf: 'Amazon Connect Flows Intermediate Course Summary.txt',
    id: 'connect-flows-intermediate',
    title: 'Flows Intermediate',
    level: 'Intermediate',
    category: 'Flows',
    description:
      'Contact attribute types and use cases, using attributes in flows, pulling in external data sources, and flow design best practices.',
  },
  {
    file: 'AMAZON CONNECT FLOW MODULES AND STEP BY STEP GUIDE.txt',
    id: 'connect-flow-modules-guides',
    title: 'Flow Modules and Step-by-Step Guides',
    level: 'Intermediate',
    category: 'Flows',
    description:
      'Reusable flow modules, and building the step-by-step guides that walk agents through a process in the agent workspace.',
  },

  {
    file: 'AMAZON CONNECT AGENT APPLICATION FUNDAMENTALS.txt',
    summaryPdf: 'Amazon Connect Agent Applications Fundamentals Course Summary.txt',
    id: 'connect-agent-application-fundamentals',
    title: 'Agent Application Fundamentals',
    level: 'Fundamentals',
    category: 'Agent experience',
    description:
      'The Contact Control Panel and the agent workspace: what agents see, how they handle contacts, and the considerations that apply.',
  },
  {
    file: 'AMAZON CONNECT CUSTOM CCP FUNDAMENTALS.txt',
    summaryPdf: 'Building a Contact Control Panel Fundamentals Course Summary.txt',
    id: 'connect-custom-ccp-fundamentals',
    title: 'Custom CCP Fundamentals',
    level: 'Fundamentals',
    category: 'Agent experience',
    description:
      'The Amazon Connect Streams API: built-in and extended functionality, and the considerations and best practices for a custom CCP.',
  },
  {
    file: 'AMAZON CONNECT CUSTOM CCP INTERMEDIATE.txt',
    summaryPdf: 'Amazon Connect Custom Contact Control Panel Intermediate Intermediate Summary.txt',
    id: 'connect-custom-ccp-intermediate',
    title: 'Custom CCP Intermediate',
    level: 'Intermediate',
    category: 'Agent experience',
    description:
      'Streams architecture and the Core, Agent, and Contact APIs, plus Customer Profiles, Amazon Q in Connect, and step-by-step guides in a custom CCP.',
  },
  {
    file: 'AMAZON CONNECT AGENT PERFORMANCE EVALUATION.txt',
    id: 'connect-agent-performance-evaluation',
    title: 'Agent Performance Evaluation',
    level: 'Intermediate',
    category: 'Agent experience',
    description:
      'Building evaluation forms and scoring criteria, automating evaluations, running calibration sessions, and analyzing and communicating results.',
  },

  {
    file: 'AMAZON CONNECT CONTACT LENS FUNDAMENTAL.txt',
    summaryPdf: 'Amazon Connect Contact Lens Fundamentals Summary.txt',
    id: 'connect-contact-lens-fundamentals',
    title: 'Contact Lens Fundamentals',
    level: 'Fundamentals',
    category: 'Analytics',
    description:
      'What Contact Lens analyzes, its advanced functionality, how it is used day to day, and the considerations that apply.',
  },
  {
    file: 'AMAZON CONNECT METRICS AND ANALYTICS.txt',
    id: 'connect-metrics-analytics',
    title: 'Metrics and Analytics',
    level: 'Intermediate',
    category: 'Analytics',
    description:
      'Metric categories and KPIs, real-time monitoring and decision-making, and designing, securing, and troubleshooting custom historical reports.',
  },
  {
    file: 'AMAZON CONNECT CONVERSATIONAL ANALYTICS ESSENTIALS.txt',
    id: 'connect-conversational-analytics',
    title: 'Conversational Analytics Essentials',
    level: 'Intermediate',
    category: 'Analytics',
    description:
      'Agent, queue, contact, bot, and evaluation metrics; recording configuration and strategies; and recording retention, access control, and management.',
  },

  {
    file: 'AMAZON CONNECT AI AGENT CAPABILITIES.txt',
    id: 'connect-ai-agent-capabilities',
    title: 'AI Agent Capabilities',
    level: 'Intermediate',
    category: 'AI and automation',
    description:
      'Where AI helps agents, Amazon Q in Connect and guided workflows, and real-time transcription, sentiment analysis, and post-contact summarization.',
  },
  {
    file: 'AMAZON CONNECT AI CUSTOMER ENGAGEMENT.txt',
    id: 'connect-ai-customer-engagement',
    title: 'AI Customer Engagement',
    level: 'Intermediate',
    category: 'AI and automation',
    description:
      'Customer data and personalization, Customer Profiles with generative AI data mapping and identity resolution, and AI-assisted outbound campaigns.',
  },
  {
    file: 'AMAZON CONNECT CUSTOMER PROFILE FUNDAMENTALS.txt',
    summaryPdf: 'Amazon Connect Customer Profiles Getting Started Course Summary.txt',
    id: 'connect-customer-profiles-fundamentals',
    title: 'Customer Profiles Fundamentals',
    level: 'Fundamentals',
    category: 'AI and automation',
    description:
      'What Customer Profiles brings together, how agents use it during a contact, and the considerations for enabling it.',
  },
  {
    file: 'AMAZON CONNECT CONVERSATIONAL INTERFACES INTERMEDIATE.txt',
    summaryPdf: 'Amazon Connect Conversational Interfaces Intermediate Course Summary.txt',
    id: 'connect-conversational-interfaces',
    title: 'Conversational Interfaces Intermediate',
    level: 'Intermediate',
    category: 'AI and automation',
    description:
      'IVR systems and intelligent self-service routing, Amazon Lex with Amazon Connect, capturing contact input, and the Connect–Lex data exchange.',
  },

  {
    file: 'AMAZON CONNECT VOICE INTERMEDIATE.txt',
    summaryPdf: 'Amazon Connect Voice Course Summary.txt',
    id: 'connect-voice-intermediate',
    title: 'Voice Intermediate',
    level: 'Intermediate',
    category: 'Channels',
    description:
      'Amazon Connect telephony, the telecoms country coverage guide, configuring phone numbers, in-app, web, and video calling, and voice pricing.',
  },
  {
    file: 'AMAZON CONNECT CHAT AND MESSAGING INTERMEDIATE.txt',
    id: 'connect-chat-messaging-intermediate',
    title: 'Chat and Messaging Intermediate',
    level: 'Intermediate',
    category: 'Channels',
    description:
      'The Amazon Connect communication widget, SMS messaging, and the Amazon Connect Chat feature set.',
  },
  {
    file: 'AMAZON CONNECT IMPLEMENTING CHATS IN CONNECT.txt',
    id: 'connect-implementing-chats',
    title: 'Implementing Chats in Amazon Connect',
    level: 'Intermediate',
    category: 'Channels',
    description:
      'What Amazon Connect Chat provides, how to integrate it into your own website or application, and the considerations that apply.',
  },
  {
    file: 'AMAZON CONNECT IMPLEMENTING TASKS IN CONNECT.txt',
    id: 'connect-implementing-tasks',
    title: 'Implementing Tasks in Amazon Connect',
    level: 'Intermediate',
    category: 'Channels',
    description:
      'Configuring and creating tasks, orchestrating them with prebuilt integrations and rules, and reporting on task contacts.',
  },

  {
    file: 'AMAZON CONNECT DEVELOPMENT FUNDAMENTALS.txt',
    summaryPdf: 'Amazon Connect Development Fundamentals Summary.txt',
    id: 'connect-development-fundamentals',
    title: 'Development Fundamentals',
    level: 'Fundamentals',
    category: 'Development',
    description:
      'Reaching Amazon Connect programmatically: the AWS CLI, the Amazon Connect REST APIs, and the AWS SDKs.',
  },
  {
    file: 'AMAZON CONNECT INTEGRATIONS INTERMEDIATE.txt',
    summaryPdf: 'Amazon Connect Integrations Intermediate Summary.txt',
    id: 'connect-integrations-intermediate',
    title: 'Integrations Intermediate',
    level: 'Intermediate',
    category: 'Development',
    description:
      'Streaming contact events, agent events, Contact Lens real-time analytics, and contact records, plus integrating Amazon API Gateway with Connect.',
  },

  /* ---- courses that exist only as a PDF, or only as a second export ---- */

  {
    pdf: 'Amazon Connect Flows Advanced Summary.txt',
    foldToSummary: 'Course summary',
    id: 'connect-flows-advanced',
    title: 'Flows Advanced',
    level: 'Advanced',
    category: 'Flows',
    description:
      'Flow modules as reusable components and step-by-step guides for agents: what they are, the benefits of each, and the considerations for both.',
  },
  {
    pdf: 'Agent Reference Cards.txt',
    id: 'connect-agent-reference-cards',
    title: 'Agent Reference Cards',
    level: 'Reference',
    category: 'Agent experience',
    description:
      'Quick reference for agents: signing in and out with SAML, answering, transferring and making calls, handling tasks, browser support, and troubleshooting.',
  },
  {
    /* Two sources, read in this order: the explainer first, then the service
       guide it summarises. */
    sources: [
      { pdf: 'Document 3.txt' },
      {
        file: 'Amazon AppFlow.txt',
        pdfFurniture: ['Amazon AppFlow', 'User Guide', 'Amazon AppFlow API Reference.'],
      },
    ],
    id: 'connect-appflow',
    title: 'Amazon AppFlow for Amazon Connect',
    level: 'Fundamentals',
    category: 'Development',
    description:
      'Connectors, connections and flows; on-demand, scheduled and event-triggered runs; permissions; and the service guide for wiring SaaS data into Customer Profiles.',
  },
  {
    file: 'IMPLEMENTING TASKS IN AWS CONNECT.txt',
    id: 'connect-implementing-tasks-walkthrough',
    title: 'Implementing Tasks — Guided Walkthrough',
    level: 'Intermediate',
    category: 'Channels',
    description:
      'The guided walkthrough export of the tasks course: the same eight lessons, written as a linear read-through. Its knowledge checks carry no answer key.',
  },

  {
    file: 'AMAZON CONNECT ADMINISTRATION.txt',
    id: 'connect-administration',
    title: 'Amazon Connect Administration',
    level: 'Advanced',
    category: 'Administration',
    description:
      'Advanced flow design, AWS service integration with Lambda, Lex, Polly and databases, security and compliance implementation, and the reliability model.',
  },
  {
    file: 'AMAZON CONNECT TROUBLESHOOTING.txt',
    id: 'connect-troubleshooting',
    title: 'Amazon Connect Troubleshooting',
    level: 'Advanced',
    category: 'Administration',
    description:
      'Gathering information from the console and CLI, monitoring, and troubleshooting CCP errors, audio quality, contact flows, and routing.',
  },
];

/* ---------------------------------------------------------------------------
 * Assembly
 * ------------------------------------------------------------------------ */

function totalWords(topics) {
  return topics.reduce((total, topic) => total + proseWordCount(topic.sections), 0);
}

/* A topic's ids embed its position, so anything that changes position has to
   restamp them or two topics can collide. */
function renumber(topics, idPrefix) {
  return topics.map((topic, index) => {
    const id = `${idPrefix}-t${index + 1}`;
    return {
      ...topic,
      id,
      number: index + 1,
      sections: topic.sections.map((section, at) => ({ ...section, id: `${id}-s${at + 1}` })),
      reviewQuestions: topic.reviewQuestions.map((question, at) => ({
        ...question,
        id: `${id}-q${at + 1}`,
      })),
    };
  });
}

/*
 * Collapse a parsed document into a single topic.
 *
 * A course summary is a one- or two-page recap. Split across topics it reads as
 * a handful of stubs; as one topic it reads as what it is.
 */
function foldToOneTopic(topics, { id, title }) {
  /* Each source topic took its name from its opening heading, leaving that
     section titled "Overview". Folding discards the topic names, so the
     heading is put back where it came from — otherwise the result has several
     sections all called "Overview". */
  const sections = topics.flatMap((topic) =>
    topic.sections.map((section, index) =>
      index === 0 && section.title === 'Overview' && !/^Topic \d+$/.test(topic.title)
        ? { ...section, title: topic.title }
        : section
    )
  );

  const reviewQuestions = topics.flatMap((topic) => topic.reviewQuestions);
  const words = proseWordCount(sections);

  return {
    id,
    number: 0, // restamped by renumber
    title,
    shortTitle: title,
    summary:
      topics.find((topic) => topic.summary && topic.summary !== 'Course content.')?.summary ??
      'A condensed recap of the course.',
    duration: estimateDuration(words),
    lede: null,
    objectives: [],
    sections: sections.map((section, index) => ({ ...section, id: `${id}-s${index + 1}` })),
    reviewQuestions,
  };
}

/* Read one source and parse it into topics. */
function readSource(source, idPrefix) {
  const file = sourcePath(source);
  if (!fs.existsSync(file)) {
    console.error(`  MISSING  ${source.pdf ?? source.file}`);
    return null;
  }
  return parseCourseText(fs.readFileSync(file, 'utf8'), {
    idPrefix,
    pdfFurniture: source.pdfFurniture ?? null,
  });
}

/*
 * Build a course's topic list from its catalog entry: every source in order,
 * then the course-summary PDF as a closing topic if there is one.
 */
function buildTopics(entry) {
  const sources = entry.sources ?? [entry];

  let topics = [];
  sources.forEach((source, index) => {
    const parsed = readSource(source, `${entry.id}-p${index + 1}`);
    if (parsed) topics = topics.concat(parsed);
  });

  if (topics.length === 0) return null;

  if (entry.foldToSummary) {
    topics = [foldToOneTopic(topics, { id: `${entry.id}-sum`, title: entry.foldToSummary })];
  }

  if (entry.summaryPdf) {
    const parsed = readSource({ pdf: entry.summaryPdf }, `${entry.id}-sum`);
    if (parsed && parsed.length > 0) {
      topics.push(foldToOneTopic(parsed, { id: `${entry.id}-sum`, title: 'Course summary' }));
    }
  }

  return renumber(topics, entry.id);
}

/* Every source a course was built from, for the generated file's header. */
function provenance(entry) {
  const list = (entry.sources ?? [entry]).map((source) =>
    source.pdf ? `conne-text/${source.pdf}  (from conne/${source.pdf.replace(/\.txt$/, '.pdf')})` : `conne/${source.file}`
  );
  if (entry.summaryPdf) {
    list.push(`conne-text/${entry.summaryPdf}  (from conne/${entry.summaryPdf.replace(/\.txt$/, '.pdf')})`);
  }
  return list;
}

/* Same 200 wpm and same floor as the per-topic estimate, so a one-topic
   course's total never disagrees with the topic it contains. */
function readingTime(words) {
  const minutes = Math.max(2, Math.round(words / 200));
  if (minutes < 60) return `~${minutes} min`;
  const hours = Math.floor(minutes / 60);
  const rest = minutes % 60;
  return rest === 0 ? `~${hours} h` : `~${hours} h ${rest} min`;
}

function banner(entry, sources) {
  const list = sources.map((source, index) => ` * ${index === 0 ? 'Sources:  ' : '           '}${source}`);
  return `/*
 * Amazon Connect — ${entry.title}
 *
 * GENERATED FILE. Do not edit by hand.
${list.join('\n')}
 * Generator: tools/build-connect-data.mjs  (node tools/build-connect-data.mjs)
 *
 * Every string below is taken from the sources above. The block vocabulary is
 * documented in src/data/courses.js.
 */\n\n`;
}

function main() {
  fs.mkdirSync(path.join(OUT_DIR, 'courses'), { recursive: true });

  /* Clear out courses from a previous run so a renamed id cannot linger. */
  for (const stale of fs.readdirSync(path.join(OUT_DIR, 'courses'))) {
    fs.unlinkSync(path.join(OUT_DIR, 'courses', stale));
  }

  const built = [];

  for (const entry of CATALOG) {
    const topics = buildTopics(entry);
    if (!topics) continue;

    const questions = topics.reduce((total, topic) => total + topic.reviewQuestions.length, 0);
    const words = totalWords(topics);
    const sources = provenance(entry);

    const course = {
      id: entry.id,
      track: 'amazon-connect',
      code: 'AWS',
      title: entry.title,
      provider: 'Amazon Web Services',
      level: entry.level,
      category: entry.category,
      description: entry.description,
      examFormat: [
        `${topics.length} topic${topics.length === 1 ? '' : 's'}`,
        readingTime(words),
        questions > 0 ? `${questions} review question${questions === 1 ? '' : 's'}` : null,
      ]
        .filter(Boolean)
        .join(' · '),
      sourceFiles: sources,
      modules: topics,
      /* These exports carry knowledge checks per topic but no separate exam
         bank, so there is no scored quiz for this track. */
      quiz: null,
    };

    const body = `${banner(entry, sources)}export const course = ${JSON.stringify(course, null, 2)};\n`;
    fs.writeFileSync(path.join(OUT_DIR, 'courses', `${entry.id}.js`), body, 'utf8');

    built.push({ ...entry, course, topics: topics.length, questions, words });
    console.log(
      `  ${entry.id.padEnd(42)} ${String(topics.length).padStart(3)} topics  ${String(questions).padStart(3)} questions  ${readingTime(words).padStart(11)}${entry.summaryPdf ? '  +summary' : ''}`
    );
  }

  writeIndex(built);

  const totals = built.reduce(
    (acc, item) => ({
      topics: acc.topics + item.topics,
      questions: acc.questions + item.questions,
      words: acc.words + item.words,
    }),
    { topics: 0, questions: 0, words: 0 }
  );

  console.log(
    `\n${built.length} courses · ${totals.topics} topics · ${totals.questions} review questions · ${totals.words.toLocaleString('en-US')} words`
  );

  /* Every source file should end up in exactly one course. Anything left over
     is a file that was added to conne/ and never catalogued. */
  const used = new Set();
  for (const entry of CATALOG) {
    for (const source of entry.sources ?? [entry]) used.add(source.pdf ?? source.file);
    if (entry.summaryPdf) used.add(entry.summaryPdf);
  }

  const available = [
    ...fs.readdirSync(SOURCE_DIR).filter((file) => file.endsWith('.txt')),
    ...(fs.existsSync(PDF_TEXT_DIR) ? fs.readdirSync(PDF_TEXT_DIR) : []),
  ];
  const orphans = available.filter((file) => !used.has(file));

  if (orphans.length > 0) {
    console.log(`\n  NOT IN ANY COURSE (${orphans.length}):`);
    for (const file of orphans) console.log(`    ${file}`);
  } else {
    console.log('\n  every source file in conne/ and conne-text/ is part of a course');
  }
}

/*
 * The track is emitted as a small manifest plus one lazily imported file per
 * course. The library screen needs titles and counts, not 2.7 MB of course
 * text, so only the manifest is in the initial bundle; a course's content
 * arrives when it is opened.
 */
function writeIndex(built) {
  const summaries = built.map((entry) => {
    const { modules, quiz, ...meta } = entry.course;
    return {
      ...meta,
      topicCount: entry.topics,
      questionCount: entry.questions,
      /* Marks an entry as metadata only: the content is fetched on demand. */
      lazy: true,
    };
  });

  const loaders = built
    .map((entry) => `  '${entry.id}': () => import('./courses/${entry.id}.js'),`)
    .join('\n');

  const body = `/*
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
 * \`quiz\` is null for every course in this track: the exports carry a knowledge
 * check per topic (surfaced as that topic's review questions) but no separate
 * exam bank, so there is nothing to build a scored quiz from.
 *
 * The course text runs to megabytes, so the manifest below holds metadata only
 * and \`loadAmazonConnectCourse\` imports a course's content when it is opened.
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
${[...new Set(built.map((entry) => entry.category))].map((category) => `  '${category}',`).join('\n')}
];

export const amazonConnectCatalog = ${JSON.stringify(summaries, null, 2)};

const LOADERS = {
${loaders}
};

const cache = new Map();

export function loadAmazonConnectCourse(courseId) {
  const loader = LOADERS[courseId];
  if (!loader) return null;
  if (!cache.has(courseId)) cache.set(courseId, loader().then((module) => module.course));
  return cache.get(courseId);
}
`;

  fs.writeFileSync(path.join(OUT_DIR, 'index.js'), body, 'utf8');
}

main();
