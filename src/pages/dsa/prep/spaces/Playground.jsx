import React, { useState } from "react";
import { FolderInput, RotateCcw } from "lucide-react";
import { RUN_LANGUAGES } from "../../../../services/jdoodleService";
import { useAutosave } from "../hooks";
import { STARTERS, validateName } from "../lib/codespace";
import { KEYS } from "../keys";
import { readStore, writeStore } from "../lib/store";
import { PrepPage } from "../ui";
import { createCodeFile } from "./CodeSpace";
import { CodeEditor, RunPanel } from "./CodeTools";

/** Standalone IDE: any supported language, stdin, remote sandbox run, save to CodeSpace. */
export default function Playground({ navigate }) {
  const [saved] = useState(() => readStore(KEYS.playground, {}));
  const [language, setLanguage] = useState(saved.language || "python3");
  const [drafts, setDrafts] = useState(saved.drafts || {});
  const [savedAs, setSavedAs] = useState("");
  const [saveError, setSaveError] = useState("");
  const option = RUN_LANGUAGES.find((entry) => entry.id === language) || RUN_LANGUAGES[0];
  const code = drafts[language] ?? STARTERS[language] ?? "";

  useAutosave({ language, drafts }, (value) => writeStore(KEYS.playground, value), 500);

  const saveToCodeSpace = () => {
    const name = window.prompt("Save as (file name):", `scratch.${option.ext}`);
    if (!name) return;
    const error = validateName(name, [], { requireExtension: true });
    if (error) { setSaveError(error); return; }
    const id = createCodeFile({ name: name.trim(), content: code, folderName: "Playground" });
    setSaveError("");
    setSavedAs(id);
  };

  return (
    <PrepPage
      className="dsp-playground-page"
      eyebrow="Dev Tools"
      title="IDE"
      description="A scratchpad for any quick experiment. Drafts are kept per language on this device; code runs in the remote sandbox, never in this app."
      actions={(
        <>
          <select className="dsp-select" value={language} onChange={(event) => setLanguage(event.target.value)} aria-label="Language">{RUN_LANGUAGES.map((entry) => <option key={entry.id} value={entry.id}>{entry.label}</option>)}</select>
          <button type="button" className="dsp-btn is-quiet" onClick={() => setDrafts((prev) => ({ ...prev, [language]: STARTERS[language] }))}><RotateCcw size={14} /> Reset</button>
          <button type="button" className="dsp-btn" onClick={saveToCodeSpace}><FolderInput size={14} /> Save to CodeSpace</button>
        </>
      )}
    >
      {saveError && <div className="dsp-notice is-danger" role="alert"><span>{saveError}</span></div>}
      {savedAs && <div className="dsp-notice"><span>Saved to CodeSpace › Playground. <button type="button" className="dsp-link" onClick={() => navigate("codespace", { fileId: savedAs })}>Open it</button></span></div>}
      <section className="dsp-box dsp-playground">
        <div className="dsp-code-monaco is-tall"><CodeEditor value={code} language={option.monaco} onChange={(value) => setDrafts((prev) => ({ ...prev, [language]: value }))} /></div>
        <RunPanel code={code} runLanguage={option.id} />
      </section>
    </PrepPage>
  );
}
