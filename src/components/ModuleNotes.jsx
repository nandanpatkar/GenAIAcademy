// src/components/ModuleNotes.jsx
// Notion-like per-module notes editor using TipTap + Supabase
// Table: module_notes (id uuid PK, user_id uuid FK, module_id text, content jsonb, updated_at timestamptz)

import React, { useEffect, useRef, useState, useCallback } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import CodeBlockLowlight from "@tiptap/extension-code-block-lowlight";
import { common, createLowlight } from "lowlight";
import {
  Bold, Italic, Code, Heading1, Heading2, Heading3,
  List, ListOrdered, Quote, Minus, Undo2, Redo2,
  Save, CheckCircle2, Loader2, FileText
} from "lucide-react";
import { supabase } from "../config/supabaseClient";

const lowlight = createLowlight(common);

// ── Toolbar ──────────────────────────────────────────────────────────────────
function Toolbar({ editor, saveStatus }) {
  if (!editor) return null;

  const btn = (action, icon, title, isActive = false) => (
    <button
      key={title}
      onMouseDown={(e) => { e.preventDefault(); action(); }}
      title={title}
      style={{
        padding: "5px 7px",
        borderRadius: 6,
        border: "none",
        cursor: "pointer",
        background: isActive ? "var(--dp-color, var(--primary))" : "transparent",
        color: isActive ? "#000" : "var(--text2)",
        display: "flex", alignItems: "center", justifyContent: "center",
        transition: "all .15s",
        opacity: isActive ? 1 : 0.7,
      }}
      onMouseEnter={(e) => { if (!isActive) { e.currentTarget.style.background = "rgba(255,255,255,0.07)"; e.currentTarget.style.opacity = "1"; } }}
      onMouseLeave={(e) => { if (!isActive) { e.currentTarget.style.background = "transparent"; e.currentTarget.style.opacity = "0.7"; } }}
    >
      {icon}
    </button>
  );

  const divider = (key) => (
    <div key={key} style={{ width: 1, height: 18, background: "var(--border)", margin: "0 3px", flexShrink: 0 }} />
  );

  return (
    <div style={{
      display: "flex", alignItems: "center", gap: 1,
      padding: "6px 12px",
      borderBottom: "1px solid var(--border)",
      background: "rgba(255,255,255,0.02)",
      flexWrap: "wrap",
      flexShrink: 0,
    }}>
      {btn(() => editor.chain().focus().toggleBold().run(),        <Bold size={13} />,        "Bold",        editor.isActive("bold"))}
      {btn(() => editor.chain().focus().toggleItalic().run(),      <Italic size={13} />,      "Italic",      editor.isActive("italic"))}
      {btn(() => editor.chain().focus().toggleCode().run(),        <Code size={13} />,        "Inline Code", editor.isActive("code"))}
      {divider("d1")}
      {btn(() => editor.chain().focus().toggleHeading({ level: 1 }).run(), <Heading1 size={13} />, "H1", editor.isActive("heading", { level: 1 }))}
      {btn(() => editor.chain().focus().toggleHeading({ level: 2 }).run(), <Heading2 size={13} />, "H2", editor.isActive("heading", { level: 2 }))}
      {btn(() => editor.chain().focus().toggleHeading({ level: 3 }).run(), <Heading3 size={13} />, "H3", editor.isActive("heading", { level: 3 }))}
      {divider("d2")}
      {btn(() => editor.chain().focus().toggleBulletList().run(),  <List size={13} />,        "Bullet List",   editor.isActive("bulletList"))}
      {btn(() => editor.chain().focus().toggleOrderedList().run(), <ListOrdered size={13} />, "Ordered List",  editor.isActive("orderedList"))}
      {btn(() => editor.chain().focus().toggleBlockquote().run(),  <Quote size={13} />,       "Blockquote",    editor.isActive("blockquote"))}
      {btn(() => editor.chain().focus().toggleCodeBlock().run(),   <Code size={13} />,        "Code Block",    editor.isActive("codeBlock"))}
      {btn(() => editor.chain().focus().setHorizontalRule().run(), <Minus size={13} />,       "Divider")}
      {divider("d3")}
      {btn(() => editor.chain().focus().undo().run(), <Undo2 size={13} />, "Undo")}
      {btn(() => editor.chain().focus().redo().run(), <Redo2 size={13} />, "Redo")}

      {/* Save status badge */}
      <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: 6, fontSize: 10, fontWeight: 700, letterSpacing: "0.5px" }}>
        {saveStatus === "saving" && <><Loader2 size={11} style={{ animation: "spin 1s linear infinite", color: "var(--text3)" }} /><span style={{ color: "var(--text3)" }}>SAVING</span></>}
        {saveStatus === "saved"  && <><CheckCircle2 size={11} style={{ color: "#22c55e" }} /><span style={{ color: "#22c55e" }}>SAVED</span></>}
        {saveStatus === "error"  && <><span style={{ color: "#ef4444" }}>SAVE FAILED</span></>}
      </div>
    </div>
  );
}

// ── Main Component ────────────────────────────────────────────────────────────
export default function ModuleNotes({ moduleId, userId, pathColor }) {
  const [saveStatus, setSaveStatus]   = useState("idle"); // idle | saving | saved | error
  const [isLoading, setIsLoading]     = useState(true);
  const saveTimer                     = useRef(null);
  const latestContent                 = useRef(null);

  // Build a stable key so switching modules resets the editor
  const noteKey = userId && moduleId ? `${userId}::${moduleId}` : null;

  // ── TipTap editor ──
  const editor = useEditor({
    extensions: [
      StarterKit.configure({ codeBlock: false }),
      CodeBlockLowlight.configure({ lowlight }),
    ],
    content: "",
    editorProps: {
      attributes: {
        class: "mn-editor-inner",
        spellcheck: "false",
      },
    },
    onUpdate: ({ editor }) => {
      const json = editor.getJSON();
      latestContent.current = json;
      setSaveStatus("idle");
      // Debounce autosave — 1.5 s after last keystroke
      if (saveTimer.current) clearTimeout(saveTimer.current);
      saveTimer.current = setTimeout(() => persistNote(json), 1500);
    },
  }, [noteKey]); // reinit when key changes

  // ── Load note from Supabase ──
  useEffect(() => {
    if (!noteKey || !editor) return;
    setIsLoading(true);
    (async () => {
      try {
        const { data, error } = await supabase
          .from("module_notes")
          .select("content")
          .eq("user_id", userId)
          .eq("module_id", moduleId)
          .maybeSingle();

        if (error && error.code !== "PGRST116") throw error;

        if (data?.content) {
          editor.commands.setContent(data.content, false);
          latestContent.current = data.content;
        } else {
          editor.commands.clearContent(false);
          latestContent.current = null;
        }
      } catch (err) {
        console.error("ModuleNotes load error:", err);
      } finally {
        setIsLoading(false);
      }
    })();

    return () => {
      if (saveTimer.current) clearTimeout(saveTimer.current);
    };
  }, [noteKey, editor]);

  // ── Persist to Supabase ──
  const persistNote = useCallback(async (content) => {
    if (!userId || !moduleId) return;
    setSaveStatus("saving");
    try {
      const { error } = await supabase
        .from("module_notes")
        .upsert(
          { user_id: userId, module_id: moduleId, content, updated_at: new Date().toISOString() },
          { onConflict: "user_id,module_id" }
        );
      if (error) throw error;
      setSaveStatus("saved");
      setTimeout(() => setSaveStatus("idle"), 2500);
    } catch (err) {
      console.error("ModuleNotes save error:", err);
      setSaveStatus("error");
    }
  }, [userId, moduleId]);

  // ── Empty state ──
  const isEmpty = editor?.isEmpty ?? true;

  if (!userId) {
    return (
      <div style={{ padding: 32, textAlign: "center", color: "var(--text3)", fontSize: 12 }}>
        Sign in to use module notes.
      </div>
    );
  }

  return (
    <div style={{
      display: "flex", flexDirection: "column",
      height: "100%", minHeight: 260,
      background: "var(--bg)",
      borderRadius: 12,
      border: "1px solid var(--border)",
      overflow: "hidden",
      position: "relative",
    }}>
      {/* Toolbar */}
      <Toolbar editor={editor} saveStatus={saveStatus} />

      {/* Editor area */}
      <div style={{ flex: 1, overflow: "auto", position: "relative" }}>
        {isLoading && (
          <div style={{
            position: "absolute", inset: 0, display: "flex",
            alignItems: "center", justifyContent: "center",
            background: "var(--bg)", zIndex: 10,
          }}>
            <Loader2 size={18} style={{ animation: "spin 1s linear infinite", color: "var(--text3)" }} />
          </div>
        )}

        {/* Placeholder when empty */}
        {!isLoading && isEmpty && (
          <div style={{
            position: "absolute", top: 20, left: 20, right: 20,
            pointerEvents: "none", color: "var(--text3)",
            fontSize: 13, lineHeight: 1.7,
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8, opacity: 0.5 }}>
              <FileText size={14} />
              <span style={{ fontWeight: 700, fontSize: 11, letterSpacing: "0.5px" }}>MODULE NOTES</span>
            </div>
            <div style={{ opacity: 0.4, fontSize: 12 }}>
              Jot your insights, key takeaways, or code snippets…<br />
              Supports <strong>bold</strong>, <em>italic</em>, headings, lists, code blocks &amp; more.
            </div>
          </div>
        )}

        <EditorContent editor={editor} style={{ padding: "16px 20px", minHeight: 200 }} />
      </div>

      {/* Spin keyframe */}
      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }

        .mn-editor-inner {
          outline: none;
          font-size: 13px;
          line-height: 1.75;
          color: var(--text);
          font-family: var(--font-body, 'Inter', sans-serif);
          min-height: 200px;
        }
        .mn-editor-inner h1 { font-size: 18px; font-weight: 800; margin: 16px 0 6px; color: var(--text); }
        .mn-editor-inner h2 { font-size: 15px; font-weight: 700; margin: 14px 0 5px; color: var(--text); }
        .mn-editor-inner h3 { font-size: 13px; font-weight: 700; margin: 12px 0 4px; color: var(--text); }
        .mn-editor-inner p  { margin: 4px 0; color: var(--text2); }
        .mn-editor-inner strong { color: var(--text); font-weight: 700; }
        .mn-editor-inner em { opacity: 0.85; font-style: italic; }
        .mn-editor-inner code {
          font-family: 'JetBrains Mono', 'Fira Code', monospace;
          font-size: 11.5px;
          background: rgba(255,255,255,0.07);
          border: 1px solid var(--border);
          border-radius: 4px;
          padding: 1px 5px;
          color: var(--dp-color, var(--primary));
        }
        .mn-editor-inner pre {
          background: rgba(0,0,0,0.35);
          border: 1px solid var(--border);
          border-radius: 8px;
          padding: 14px 16px;
          margin: 10px 0;
          overflow-x: auto;
        }
        .mn-editor-inner pre code {
          background: none; border: none; padding: 0;
          font-size: 12px; color: var(--text);
        }
        .mn-editor-inner ul, .mn-editor-inner ol {
          padding-left: 20px; margin: 6px 0;
        }
        .mn-editor-inner li { margin: 3px 0; color: var(--text2); }
        .mn-editor-inner blockquote {
          border-left: 3px solid var(--dp-color, var(--primary));
          padding-left: 14px; margin: 8px 0;
          color: var(--text3); font-style: italic;
        }
        .mn-editor-inner hr {
          border: none; border-top: 1px solid var(--border); margin: 14px 0;
        }
        /* Syntax highlighting token colors (lowlight) */
        .mn-editor-inner .hljs-keyword   { color: #c792ea; }
        .mn-editor-inner .hljs-string    { color: #c3e88d; }
        .mn-editor-inner .hljs-comment   { color: #546e7a; font-style: italic; }
        .mn-editor-inner .hljs-number    { color: #f78c6c; }
        .mn-editor-inner .hljs-function  { color: #82aaff; }
        .mn-editor-inner .hljs-built_in  { color: #ffcb6b; }
        .mn-editor-inner .hljs-variable  { color: #f07178; }
      `}</style>
    </div>
  );
}