// src/services/webSearchService.js
//
// Client-side wrapper for the `web-search` Supabase edge function, which
// proxies Tavily so the API key stays server-side (never in client bundle
// or git history). Mirrors the same invoke pattern used for `notion-fetch`.

import { supabase } from "../config/supabaseClient";

/**
 * @param {string} query
 * @param {number} [maxResults=5]
 * @returns {Promise<Array<{title: string, url: string, content: string}>>}
 */
export const searchWeb = async (query, maxResults = 5) => {
  if (!query || !query.trim()) return [];

  const { data, error } = await supabase.functions.invoke("web-search", {
    body: { query, maxResults },
  });

  if (error) {
    console.error("Web search error:", error);
    throw new Error("Web search failed. Is the web-search edge function deployed with a TAVILY_API_KEY secret set?");
  }

  return data?.results || [];
};
