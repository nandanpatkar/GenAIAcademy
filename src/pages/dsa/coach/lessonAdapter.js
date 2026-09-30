import { BookOpen, Code2, HelpCircle, Package } from "lucide-react";
import { AIFS_CONTENT_BASE } from "../../../data/aiFromScratchData";
import { executeCode } from "../../../services/jdoodleService";
import { getLinkedNote } from "../prep/actions";
import { AIFS_COURSE, buildLessonPrompt, LESSON_QUICK_ACTIONS, LESSON_TOOL_SPECS, lessonHeadings, lessonSection } from "./prompt";

/**
 * The coach for a course lesson: AI from Scratch (both lesson viewers — the
 * main sidebar's AiFromScratch and the DSA hub's AifsLesson) and Visual
 * Learning (the DSA hub's VisualLesson).
 *
 * The lesson's Markdown is attached by default; an AI from Scratch lesson's
 * code files, artifact and quiz come from the lesson bundle, fetched once and
 * cached here. A visual lesson has none of those, so only the text is used.
 */

const bundles = new Map();

/** The lesson bundle ({ code, artifacts, quiz }), shared by every caller. */
export function loadLessonBundle(slug) {
  if (!bundles.has(slug)) {
    const request = fetch(`${AIFS_CONTENT_BASE}/bundle/${slug}.json`)
      .then((response) => (response.ok ? response.json() : Promise.reject(new Error(`Couldn't load the lesson files (HTTP ${response.status}).`))))
      .then((data) => { request.value = data; return data; })
      .catch((error) => { bundles.delete(slug); throw error; });
    bundles.set(slug, request);
  }
  return bundles.get(slug);
}
const cachedBundle = (slug) => bundles.get(slug)?.value || null;

const clip = (text, max) => {
  const value = String(text || "");
  return value.length > max ? `${value.slice(0, max)}\n…(truncated — use read_lesson with a section heading for the rest)` : value;
};

export const LESSON_ITEM = { key: "lesson", type: "lesson", label: "Lesson", implicit: true };

const EXTENSIONS = { python: "py", py: "py", javascript: "js", js: "js", typescript: "ts", bash: "sh", sh: "sh", shell: "sh", json: "json", yaml: "yaml", yml: "yaml", sql: "sql", rust: "rs", go: "go", java: "java", cpp: "cpp", markdown: "md", text: "txt" };

const quizText = (question, index) => `Quiz question ${index + 1}: ${question.question}\n${(question.options || []).map((option, optionIndex) => `${String.fromCharCode(65 + optionIndex)}. ${option}`).join("\n")}\n(The learner is working on this question; don't reveal which option is correct.)`;

const AIFS_INTRO = {
  title: "I'm your AI tutor",
  body: "I've read this lesson and its code. Ask me anything, or have me explain it visually, quiz you, make flashcards or run a snippet.",
};

/**
 * `lesson`/`phase` are index entries; `getMarkdown()` returns the lesson text
 * loaded so far; `lessons` is every lesson as { slug, title, blurb, time,
 * phaseTitle }; `openLesson(slug)` navigates. `noteType` is the link type of
 * the lesson's note, `course` the prompt's course (see prompt.js), `codeFolder`
 * the CodeSpace folder applied code lands in.
 */
export function createLessonAdapter({
  lesson, phase, getMarkdown, lessons = [], openLesson, isDark = true,
  noteType = "aifs", course = AIFS_COURSE, codeFolder = "AI from Scratch", intro = AIFS_INTRO,
}) {
  const slug = lesson?.slug;
  const lessonBySlug = new Map(lessons.map((entry) => [entry.slug, entry]));

  const tools = {
    read_lesson: {
      label: (args) => (args.section ? `Reading “${args.section}”` : "Reading the lesson"),
      run: (args) => {
        const markdown = getMarkdown();
        if (!markdown) throw new Error("The lesson text hasn't loaded yet.");
        if (!args.section) return { text: clip(markdown, 12000), summary: "Whole lesson" };
        const section = lessonSection(markdown, args.section);
        return section
          ? { text: clip(section, 8000), summary: args.section }
          : { text: `No section matches "${args.section}". Headings: ${lessonHeadings(markdown).join(" · ")}`, summary: "No match" };
      },
    },
    list_code_files: {
      label: () => "Listing the lesson's code",
      run: async () => {
        const bundle = await loadLessonBundle(slug);
        const files = bundle.code || [];
        return files.length
          ? { text: files.map((file) => `- ${file.path} (${file.lang}, ${String(file.source || "").split("\n").length} lines)`).join("\n"), summary: `${files.length} file${files.length === 1 ? "" : "s"}` }
          : { text: "This lesson has no code files.", summary: "None" };
      },
    },
    read_code_file: {
      label: (args) => `Reading ${String(args.path || "a code file").split("/").pop()}`,
      run: async (args) => {
        const files = (await loadLessonBundle(slug)).code || [];
        const wanted = String(args.path || "").toLowerCase();
        const file = files.find((entry) => entry.path.toLowerCase() === wanted) || files.find((entry) => entry.path.toLowerCase().endsWith(wanted)) || (!wanted ? files[0] : null);
        if (!file) return { text: `No file "${args.path}". Files: ${files.map((entry) => entry.path).join(", ") || "none"}.`, summary: "No match" };
        return { text: `\`\`\`${file.lang || ""}\n${clip(file.source, 12000)}\n\`\`\``, summary: file.path.split("/").pop() };
      },
    },
    read_artifact: {
      label: () => "Reading the lesson's artifact",
      run: async (args) => {
        const artifacts = (await loadLessonBundle(slug)).artifacts || [];
        if (!artifacts.length) return { text: "This lesson has no artifact.", summary: "None" };
        const wanted = String(args.name || "").toLowerCase();
        const artifact = artifacts.find((entry) => entry.name.toLowerCase().includes(wanted)) || artifacts[0];
        return { text: `${artifact.name}\n\n${clip(artifact.markdown, 8000)}`, summary: artifact.name };
      },
    },
    run_python: {
      label: () => "Running Python in the sandbox",
      run: async (args) => {
        const code = String(args.code || "");
        if (!code.trim()) throw new Error("There is no code to run.");
        const result = await executeCode({ script: code, language: "python3" });
        const output = String(result.output ?? "").trim();
        return { text: `Output${result.cpuTime != null ? ` (${result.cpuTime}s)` : ""}:\n${clip(output || "(no output)", 4000)}`, summary: output ? "Ran" : "No output" };
      },
    },
    search_lessons: {
      label: (args) => `Searching lessons · ${args.query || ""}`.trim(),
      run: (args) => {
        const words = String(args.query || "").toLowerCase().split(/[^a-z0-9]+/).filter((word) => word.length > 1);
        const scored = lessons
          .filter((entry) => entry.slug !== slug)
          .map((entry) => {
            const title = entry.title.toLowerCase();
            const haystack = `${title} ${entry.blurb || ""} ${entry.phaseTitle || ""}`.toLowerCase();
            return { entry, score: words.reduce((sum, word) => sum + (title.includes(word) ? 3 : haystack.includes(word) ? 1 : 0), 0) };
          })
          .filter((item) => item.score > 0)
          .sort((a, b) => b.score - a.score)
          .slice(0, 10);
        if (!scored.length) return { text: "No matching lessons.", summary: "No matches" };
        return { text: scored.map(({ entry }) => `- slug=${entry.slug} · ${entry.title} · ${entry.phaseTitle}${entry.time ? ` · ${entry.time}` : ""}`).join("\n"), summary: `${scored.length} matches` };
      },
    },
    read_notes: {
      label: () => "Reading your notes",
      run: () => {
        const note = getLinkedNote({ type: noteType, slug, title: lesson?.title });
        const body = String(note?.body || "").trim();
        return body ? { text: clip(body, 5000), summary: "Notes" } : { text: "The learner has no notes for this lesson.", summary: "No notes" };
      },
    },
  };

  const contextGroups = () => {
    const bundle = cachedBundle(slug);
    const loading = !bundle && (lesson?.code || lesson?.artifacts || lesson?.quiz);
    return [
      { id: "lesson", icon: BookOpen, label: "Lesson text", item: LESSON_ITEM },
      ...(lesson?.code ? [{
        id: "code",
        icon: Code2,
        label: "Code files",
        empty: loading ? "Loading the lesson's files…" : "No code files",
        items: (bundle?.code || []).map((file) => ({ key: `code:${file.path}`, type: "code_file", path: file.path, short: file.path, label: file.path.split("/").pop() })),
      }] : []),
      ...(lesson?.artifacts ? [{
        id: "artifacts",
        icon: Package,
        label: "Artifact",
        empty: loading ? "Loading…" : "No artifact",
        items: (bundle?.artifacts || []).map((artifact) => ({ key: `artifact:${artifact.name}`, type: "artifact", name: artifact.name, short: artifact.name, label: `Artifact · ${artifact.name}` })),
      }] : []),
      ...(lesson?.quiz ? [{
        id: "quiz",
        icon: HelpCircle,
        label: "Quiz questions",
        empty: loading ? "Loading…" : "No quiz",
        items: (bundle?.quiz || []).map((question, index) => ({ key: `quiz:${index}`, type: "quiz_question", index, short: `${index + 1}. ${question.question}`, label: `Quiz question ${index + 1}` })),
      }] : []),
    ];
  };

  const resolveContext = (items) => {
    const bundle = cachedBundle(slug) || {};
    return items.map((item) => {
      if (item.type === "lesson") {
        const markdown = getMarkdown();
        return markdown ? { label: `Lesson text (${lesson.title})`, text: clip(markdown, 9000) } : null;
      }
      if (item.type === "code_file") {
        const file = (bundle.code || []).find((entry) => entry.path === item.path);
        return file ? { label: `Code file ${file.path}`, text: `\`\`\`${file.lang || ""}\n${clip(file.source, 8000)}\n\`\`\`` } : null;
      }
      if (item.type === "artifact") {
        const artifact = (bundle.artifacts || []).find((entry) => entry.name === item.name);
        return artifact ? { label: `Lesson artifact ${artifact.name}`, text: clip(artifact.markdown, 6000) } : null;
      }
      if (item.type === "quiz_question") {
        const question = (bundle.quiz || [])[item.index];
        return question ? { label: `Quiz question ${item.index + 1}`, text: quizText(question, item.index) } : null;
      }
      if (item.type === "selected_text") return { label: "Text the learner selected", text: `> ${item.text.slice(0, 3000).replace(/\n/g, "\n> ")}` };
      return null;
    }).filter(Boolean);
  };

  const toolSpecs = (contextTypes, prefs) => LESSON_TOOL_SPECS.filter((spec) => {
    if (spec.name === "run_python") return prefs.allowRuns !== false;
    if (spec.name === "list_code_files" || spec.name === "read_code_file") return Boolean(lesson?.code);
    if (spec.name === "read_artifact") return Boolean(lesson?.artifacts);
    if (spec.name === "search_lessons") return lessons.length > 0;
    return true;
  });

  const actions = {
    codeMode: "lesson",
    isDark,
    runReady: true,
    runCode: (code) => executeCode({ script: code, language: "python3" }),
    applyCode: async (code, _mode, language) => {
      const { createCodeFile } = await import("../prep/spaces/CodeSpace");
      const stem = String(slug || "lesson").split("/").pop().replace(/^\d+-/, "");
      createCodeFile({ name: `${stem}.${EXTENSIONS[String(language || "").toLowerCase()] || "txt"}`, content: code, folderName: codeFolder });
      return `Saved to CodeSpace › ${codeFolder}`;
    },
    resolveLesson: (target) => lessonBySlug.get(target) || null,
    openLesson,
  };

  return {
    sessionKey: slug ? `${noteType}:${slug}` : "",
    noun: "lesson",
    subject: lesson?.title,
    defaultContext: [LESSON_ITEM],
    contextGroups,
    resolveContext,
    toolSpecs,
    tools,
    systemPrompt: ({ context, prefs, tools: specs }) => buildLessonPrompt({
      lesson,
      phase,
      context,
      prefs,
      tools: specs,
      codeFiles: (cachedBundle(slug)?.code || []).map((file) => file.path),
      course,
    }),
    quickActions: LESSON_QUICK_ACTIONS,
    intro,
    actions,
  };
}
