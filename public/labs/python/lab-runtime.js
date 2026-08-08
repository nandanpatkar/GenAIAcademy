(() => {
  "use strict";

  const ready = (callback) => document.readyState === "loading"
    ? document.addEventListener("DOMContentLoaded", callback, { once: true })
    : callback();

  ready(() => {
    const topic = document.body.dataset.topic || document.title.split("·")[1]?.trim() || "python";
    const mode = document.body.dataset.mode || "workshop";
    const key = `python-lab:${topic}`;
    const facts = [...document.querySelectorAll(".fact-card")].map((card) => ({
      title: card.querySelector("h3, strong")?.textContent?.trim() || "Core idea",
      body: card.querySelector("p")?.textContent?.trim() || card.textContent.trim(),
    })).filter((fact) => fact.body);
    const code = document.querySelector("#codeView")?.textContent?.trim() || "";
    const state = loadState();
    let recallIndex = 0;

    document.body.classList.add("python-lab-enhanced", `python-mode-${slug(mode)}`, `python-topic-${slug(topic)}`);
    addStyles();
    const studio = document.createElement("section");
    studio.className = "study-studio reveal";
    studio.id = "study-studio";
    studio.setAttribute("aria-labelledby", "study-studio-title");
    studio.innerHTML = `
      <header class="study-studio__header">
        <div>
          <span class="study-studio__eyebrow">Active study studio</span>
          <h2 id="study-studio-title">Turn ${escapeHtml(topic.replaceAll("-", " "))} into working knowledge.</h2>
          <p>Predict the program, explain the mental model, and leave with a saved study note.</p>
        </div>
        <div class="mastery-orbit" aria-label="Lesson mastery">
          <svg viewBox="0 0 80 80" aria-hidden="true"><circle cx="40" cy="40" r="33"/><circle class="mastery-orbit__progress" cx="40" cy="40" r="33"/></svg>
          <strong id="masteryValue">0%</strong>
        </div>
      </header>
      <div class="study-studio__grid">
        <article class="study-card study-card--map">
          <span class="study-card__index">01 · CONCEPT MAP</span>
          <h3>See how the idea fits together</h3>
          <div class="concept-orbit" role="list">
            ${(facts.length ? facts : [{ title: topic, body: "Connect the syntax to the value it produces." }]).slice(0, 4).map((fact, index) => `<button type="button" role="listitem" data-fact="${index}" style="--i:${index}"><span>${String(index + 1).padStart(2, "0")}</span><strong>${escapeHtml(fact.title)}</strong></button>`).join("")}
            <div class="concept-orbit__core"><small>Python model</small><strong>${escapeHtml(topic.replaceAll("-", " "))}</strong></div>
          </div>
          <p class="concept-reading" id="conceptReading">Select a concept node to inspect its role.</p>
        </article>
        <article class="study-card study-card--predict">
          <span class="study-card__index">02 · PREDICT</span>
          <h3>What will Python produce?</h3>
          <p>Read the example before stepping through it. Write the output you expect, then compare.</p>
          <label for="predictionInput">Your predicted output</label>
          <textarea id="predictionInput" rows="5" spellcheck="false" placeholder="Type the exact output here…">${escapeHtml(state.prediction || "")}</textarea>
          <div class="study-actions"><button type="button" class="study-button" id="comparePrediction">Reveal & compare</button><button type="button" class="study-button study-button--quiet" id="clearPrediction">Clear</button></div>
          <pre class="prediction-result" id="predictionResult" aria-live="polite">The result stays hidden until you commit to a prediction.</pre>
        </article>
        <article class="study-card study-card--recall">
          <span class="study-card__index">03 · RETRIEVE</span>
          <h3>Recall without rereading</h3>
          <button type="button" class="recall-card" id="recallCard" aria-expanded="false">
            <span>Explain this in your own words</span>
            <strong id="recallPrompt">${escapeHtml((facts[0]?.title || topic).replaceAll("-", " "))}</strong>
            <p id="recallAnswer">Tap to reveal a concise explanation.</p>
          </button>
          <div class="study-actions"><button type="button" class="study-button study-button--quiet" id="nextRecall">Next recall card</button><button type="button" class="study-button study-button--quiet" id="markRecall">I explained it</button></div>
        </article>
        <article class="study-card study-card--notes">
          <span class="study-card__index">04 · SYNTHESIZE</span>
          <h3>Save your field note</h3>
          <p>Write one rule, one pitfall, and one situation where you would use this concept.</p>
          <label for="studyNote">My study note</label>
          <textarea id="studyNote" rows="7" placeholder="Rule:\nPitfall:\nUse it when…">${escapeHtml(state.note || "")}</textarea>
          <div class="note-status"><span id="noteStatus">Saved on this device</span><button type="button" class="study-button" id="saveNote">Save note</button></div>
        </article>
      </div>
      <footer class="study-mission">
        <div><span>Lesson mission</span><strong id="missionCount">0 of 4 complete</strong></div>
        <div class="study-mission__steps" id="missionSteps"></div>
      </footer>`;

    const footer = document.querySelector("body > footer, main + footer");
    if (footer) footer.before(studio); else document.querySelector("main")?.append(studio);

    const tasks = [
      ["step", "Step through the code"],
      ["visual", "Play the visual model"],
      ["predict", "Compare a prediction"],
      ["recall", "Explain from memory"],
    ];

    studio.querySelectorAll("[data-fact]").forEach((button) => button.addEventListener("click", () => {
      const fact = facts[Number(button.dataset.fact)];
      if (!fact) return;
      studio.querySelectorAll("[data-fact]").forEach((node) => node.classList.toggle("is-active", node === button));
      studio.querySelector("#conceptReading").textContent = fact.body;
    }));

    const predictionInput = studio.querySelector("#predictionInput");
    studio.querySelector("#comparePrediction").addEventListener("click", () => {
      const next = document.querySelector("#nextCode");
      for (let index = 0; index < Math.max(4, code.split("\n").length + 2); index += 1) next?.click();
      const actual = document.querySelector("#outputView")?.textContent?.trim() || "Run the line-by-line example above to reveal its output.";
      const prediction = predictionInput.value.trim();
      const exact = normalize(prediction) === normalize(actual);
      studio.querySelector("#predictionResult").innerHTML = `<span class="${exact ? "is-correct" : "is-learning"}">${exact ? "Exact match" : prediction ? "Compare and refine" : "Prediction skipped"}</span><code>${escapeHtml(actual)}</code>`;
      state.prediction = prediction;
      complete("predict");
      saveState();
    });
    studio.querySelector("#clearPrediction").addEventListener("click", () => {
      predictionInput.value = "";
      state.prediction = "";
      studio.querySelector("#predictionResult").textContent = "The result stays hidden until you commit to a prediction.";
      saveState();
      predictionInput.focus();
    });

    const recallCard = studio.querySelector("#recallCard");
    const renderRecall = () => {
      const fact = facts[recallIndex % Math.max(facts.length, 1)] || { title: topic, body: "Connect the syntax, the runtime behavior, and the result." };
      studio.querySelector("#recallPrompt").textContent = fact.title;
      studio.querySelector("#recallAnswer").textContent = "Tap to reveal a concise explanation.";
      recallCard.setAttribute("aria-expanded", "false");
      recallCard.classList.remove("is-open");
    };
    recallCard.addEventListener("click", () => {
      const fact = facts[recallIndex % Math.max(facts.length, 1)] || { body: "Connect the syntax, the runtime behavior, and the result." };
      const open = recallCard.getAttribute("aria-expanded") !== "true";
      recallCard.setAttribute("aria-expanded", String(open));
      recallCard.classList.toggle("is-open", open);
      studio.querySelector("#recallAnswer").textContent = open ? fact.body : "Tap to reveal a concise explanation.";
    });
    studio.querySelector("#nextRecall").addEventListener("click", () => { recallIndex += 1; renderRecall(); });
    studio.querySelector("#markRecall").addEventListener("click", () => complete("recall"));

    const note = studio.querySelector("#studyNote");
    studio.querySelector("#saveNote").addEventListener("click", () => {
      state.note = note.value.trim();
      saveState();
      const status = studio.querySelector("#noteStatus");
      status.textContent = state.note ? "Note saved ✓" : "Add a note when you are ready";
      setTimeout(() => { status.textContent = "Saved on this device"; }, 1800);
    });

    document.querySelector("#nextCode")?.addEventListener("click", () => complete("step"));
    document.querySelector("#playVisual")?.addEventListener("click", () => complete("visual"));
    renderMission();

    function complete(id) {
      if (!state.completed.includes(id)) state.completed.push(id);
      saveState();
      renderMission();
    }
    function renderMission() {
      const done = tasks.filter(([id]) => state.completed.includes(id)).length;
      studio.querySelector("#missionCount").textContent = `${done} of ${tasks.length} complete`;
      studio.querySelector("#masteryValue").textContent = `${Math.round(done / tasks.length * 100)}%`;
      studio.style.setProperty("--mastery", String(done / tasks.length));
      studio.querySelector("#missionSteps").innerHTML = tasks.map(([id, label]) => `<span class="${state.completed.includes(id) ? "done" : ""}"><i>${state.completed.includes(id) ? "✓" : ""}</i>${escapeHtml(label)}</span>`).join("");
    }
    function loadState() {
      try {
        const saved = JSON.parse(localStorage.getItem(key) || "{}");
        return { completed: Array.isArray(saved.completed) ? saved.completed : [], note: saved.note || "", prediction: saved.prediction || "" };
      } catch { return { completed: [], note: "", prediction: "" }; }
    }
    function saveState() {
      try { localStorage.setItem(key, JSON.stringify(state)); } catch { /* storage may be blocked in an embedded lab */ }
    }
  });

  function slug(value) { return String(value).toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, ""); }
  function normalize(value) { return String(value).trim().replace(/\s+/g, " ").replace(/[“”]/g, '"').toLowerCase(); }
  function escapeHtml(value) { const node = document.createElement("span"); node.textContent = String(value); return node.innerHTML; }

  function addStyles() {
    const style = document.createElement("style");
    style.textContent = `
      .study-studio{--mastery:0;position:relative;padding:clamp(54px,8vw,110px) clamp(20px,7vw,110px);overflow:hidden;color:var(--ink);background:color-mix(in srgb,var(--canvas) 80%,var(--white));border-top:1px solid var(--line)}
      .study-studio::before{position:absolute;inset:-30% 45% auto -25%;height:460px;content:"";pointer-events:none;background:radial-gradient(circle,color-mix(in srgb,var(--primary) 16%,transparent),transparent 68%);animation:studyDrift 12s ease-in-out infinite alternate}
      .study-studio__header{position:relative;display:flex;align-items:center;justify-content:space-between;gap:28px;max-width:1450px;margin:0 auto 30px}.study-studio__eyebrow,.study-card__index{display:block;color:var(--primary);font-size:11px;font-weight:850;letter-spacing:.13em;text-transform:uppercase}.study-studio h2{max-width:900px;margin:10px 0 12px;font:650 clamp(35px,5vw,70px)/.98 Georgia,serif;letter-spacing:-.045em;text-transform:capitalize}.study-studio__header p{max-width:670px;margin:0;color:var(--muted)}
      .mastery-orbit{position:relative;flex:0 0 112px;display:grid;place-items:center;aspect-ratio:1}.mastery-orbit svg{position:absolute;inset:0;width:100%;transform:rotate(-90deg);fill:none;stroke:var(--line);stroke-width:5}.mastery-orbit__progress{stroke:var(--accent);stroke-dasharray:207;stroke-dashoffset:calc(207 - 207 * var(--mastery));stroke-linecap:round;transition:stroke-dashoffset .5s var(--ease)}.mastery-orbit strong{font-size:20px}
      .study-studio__grid{position:relative;display:grid;grid-template-columns:1.1fr .9fr;gap:16px;max-width:1450px;margin:auto}.study-card{min-width:0;padding:clamp(20px,3vw,34px);background:var(--white);border:1px solid var(--line);border-radius:var(--radius-md);box-shadow:0 12px 42px color-mix(in srgb,var(--ink) 7%,transparent);transition:transform .24s var(--ease),box-shadow .24s var(--ease)}.study-card:hover{transform:translateY(-3px);box-shadow:var(--shadow)}.study-card h3{margin:8px 0 9px;font:650 clamp(23px,3vw,38px)/1.05 Georgia,serif}.study-card>p{color:var(--muted)}.study-card label{display:block;margin:16px 0 7px;font-size:12px;font-weight:800}.study-card textarea{width:100%;resize:vertical;padding:14px;color:var(--ink);background:var(--canvas);border:1px solid var(--line);border-radius:var(--radius-sm);font:600 13px/1.55 ui-monospace,monospace}.study-card textarea:focus{outline:3px solid color-mix(in srgb,var(--accent) 45%,transparent);outline-offset:2px}
      .study-card--map{grid-row:span 2}.concept-orbit{position:relative;display:grid;place-items:center;min-height:440px;margin-top:20px;border-radius:50%;background:radial-gradient(circle,color-mix(in srgb,var(--primary) 12%,transparent),transparent 60%)}.concept-orbit::before,.concept-orbit::after{position:absolute;width:66%;aspect-ratio:1;content:"";border:1px dashed var(--line);border-radius:50%;animation:studySpin 30s linear infinite}.concept-orbit::after{width:42%;animation-direction:reverse;animation-duration:20s}.concept-orbit button{position:absolute;z-index:2;width:150px;min-height:78px;padding:10px;color:var(--ink);background:var(--white);border:1px solid var(--line);border-radius:16px;box-shadow:0 8px 24px color-mix(in srgb,var(--ink) 8%,transparent);transform:rotate(calc(var(--i) * 90deg)) translateX(175px) rotate(calc(var(--i) * -90deg));transition:.22s var(--ease)}.concept-orbit button:hover,.concept-orbit button.is-active{color:var(--white);background:var(--primary);border-color:var(--primary);transform:rotate(calc(var(--i) * 90deg)) translateX(175px) rotate(calc(var(--i) * -90deg)) scale(1.06)}.concept-orbit button span,.concept-orbit button strong{display:block}.concept-orbit button span{opacity:.7;font-size:9px}.concept-orbit button strong{margin-top:4px;font-size:11px}.concept-orbit__core{z-index:1;display:grid;place-items:center;width:150px;aspect-ratio:1;text-align:center;color:var(--white);background:var(--ink);border-radius:50%;box-shadow:0 0 0 14px color-mix(in srgb,var(--accent) 16%,transparent)}.concept-orbit__core small,.concept-orbit__core strong{display:block}.concept-orbit__core strong{text-transform:capitalize}.concept-reading{min-height:50px;padding:13px;border-left:3px solid var(--accent);background:var(--canvas)}
      .study-actions,.note-status{display:flex;align-items:center;gap:8px;margin-top:12px}.study-button{min-height:44px;padding:9px 14px;color:var(--white);background:var(--ink);border:1px solid var(--ink);border-radius:999px;font-weight:800;transition:.18s var(--ease)}.study-button:hover{transform:translateY(-2px);box-shadow:0 7px 0 color-mix(in srgb,var(--ink) 15%,transparent)}.study-button--quiet{color:var(--ink);background:transparent}.prediction-result{min-height:90px;margin:14px 0 0;padding:13px;white-space:pre-wrap;color:var(--muted);background:var(--ink);border-radius:var(--radius-sm);font-size:12px}.prediction-result span,.prediction-result code{display:block}.prediction-result span{margin-bottom:8px;font-weight:850;text-transform:uppercase}.prediction-result .is-correct{color:#86efac}.prediction-result .is-learning{color:#fde68a}.prediction-result code{color:white}
      .recall-card{width:100%;min-height:210px;padding:26px;color:var(--white);text-align:left;background:linear-gradient(145deg,var(--primary),color-mix(in srgb,var(--primary) 55%,var(--ink)));border:0;border-radius:var(--radius-md);transform-style:preserve-3d;transition:transform .35s var(--ease)}.recall-card:hover{transform:rotateX(2deg) rotateY(-2deg)}.recall-card.is-open{transform:rotateX(0) rotateY(0);background:var(--ink)}.recall-card span,.recall-card strong,.recall-card p{display:block}.recall-card span{font-size:10px;letter-spacing:.1em;text-transform:uppercase;opacity:.72}.recall-card strong{margin:32px 0 16px;font:650 26px/1.05 Georgia,serif}.recall-card p{margin:0;line-height:1.55;opacity:.85}.note-status{justify-content:space-between;color:var(--muted);font-size:12px}
      .study-mission{position:relative;display:grid;grid-template-columns:200px 1fr;gap:18px;align-items:center;max-width:1450px;margin:16px auto 0;padding:20px 24px;color:var(--white);background:var(--ink);border-radius:var(--radius-md)}.study-mission>div:first-child span,.study-mission>div:first-child strong{display:block}.study-mission>div:first-child span{font-size:10px;text-transform:uppercase;opacity:.65}.study-mission__steps{display:grid;grid-template-columns:repeat(4,1fr);gap:8px}.study-mission__steps span{display:flex;align-items:center;gap:7px;font-size:11px;opacity:.55}.study-mission__steps span.done{opacity:1}.study-mission__steps i{display:grid;place-items:center;flex:0 0 22px;aspect-ratio:1;border:1px solid currentColor;border-radius:50%;font-style:normal}.study-mission__steps .done i{color:var(--ink);background:var(--accent);border-color:var(--accent)}
      .python-mode-stream .study-card--map,.python-mode-loop .study-card--map{border-radius:40px 8px}.python-mode-map .concept-orbit button{border-radius:5px}.python-mode-class .study-card,.python-mode-object .study-card{box-shadow:8px 8px 0 color-mix(in srgb,var(--primary) 20%,transparent)}.python-mode-async .study-studio::before{animation-duration:4s}.python-mode-test .study-mission{outline:3px double var(--accent);outline-offset:4px}
      @keyframes studySpin{to{transform:rotate(360deg)}}@keyframes studyDrift{to{transform:translate(26%,16%) scale(1.2)}}
      @media(max-width:900px){.study-studio__grid{grid-template-columns:1fr}.study-card--map{grid-row:auto}.study-mission{grid-template-columns:1fr}.study-mission__steps{grid-template-columns:1fr 1fr}}
      @media(max-width:620px){.study-studio__header{align-items:flex-start;flex-direction:column}.mastery-orbit{flex-basis:90px}.concept-orbit{min-height:520px}.concept-orbit button{width:125px;transform:rotate(calc(var(--i) * 90deg)) translateX(145px) rotate(calc(var(--i) * -90deg))}.concept-orbit button:hover,.concept-orbit button.is-active{transform:rotate(calc(var(--i) * 90deg)) translateX(145px) rotate(calc(var(--i) * -90deg)) scale(1.04)}.study-mission__steps{grid-template-columns:1fr}}
      @media(prefers-reduced-motion:reduce){.study-studio *,.study-studio::before{animation:none!important;transition-duration:.01ms!important}}
    `;
    document.head.append(style);
  }
})();
