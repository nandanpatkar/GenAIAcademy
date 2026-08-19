// Local lesson generation for a catalog module.
//
// The catalog carries a module's title, its track and its one-line tagline — the site's
// public page metadata. The lesson body is written here, on demand, by whichever AI
// provider the app is already configured with, and then cached in localStorage so a
// module you have opened once stays readable offline. Nothing is fetched from
// aimlcompanion.ai at runtime.
import { generateStudyContent, getActiveAIProviderStatus } from "../../services/aiService";

export const MODES = [
  { id: "summary", label: "Lesson" },
  { id: "flashcards", label: "Flashcards" },
  { id: "quiz", label: "Quiz" },
];

const cacheKey = (trackId, moduleId, mode) => `amc_lesson_v1:${trackId}/${moduleId}:${mode}`;

export function readLesson(trackId, moduleId, mode) {
  try {
    const raw = localStorage.getItem(cacheKey(trackId, moduleId, mode));
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function writeLesson(trackId, moduleId, mode, data) {
  try {
    localStorage.setItem(cacheKey(trackId, moduleId, mode), JSON.stringify(data));
  } catch {
    // Quota is the only realistic failure here, and a lesson that regenerates next time
    // is a much better outcome than one that refuses to render.
  }
}

export function clearLesson(trackId, moduleId, mode) {
  try {
    localStorage.removeItem(cacheKey(trackId, moduleId, mode));
  } catch { /* nothing to clean up */ }
}

export const providerStatus = () => getActiveAIProviderStatus();

export async function buildLesson({ track, module, mode, refresh = false, onStatus }) {
  if (!refresh) {
    const cached = readLesson(track.id, module.id, mode);
    if (cached) return { data: cached, cached: true };
  }

  const data = await generateStudyContent(
    mode,
    {
      title: module.label,
      subtitle: module.tagline || "",
      overview: `This module sits in the "${track.label}" study path. ${track.summary}`,
      subtopics: [],
    },
    onStatus,
  );

  writeLesson(track.id, module.id, mode, data);
  return { data, cached: false };
}
