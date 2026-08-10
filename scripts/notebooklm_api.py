"""
api/notebooklm.py
-----------------
Vercel Python serverless function that generates study content
(quiz, flashcards, mind map, summary) for a GenAI Academy module.

Strategy
--------
Primary  - notebooklm-py  (if GOOGLE_NOTEBOOKLM_TOKEN is set)
Fallback - Qwen 3.6 Plus via OpenRouter
"""

import json, os, sys, urllib.request
from http.server import BaseHTTPRequestHandler

try:
    import notebooklm as nlm
    _HAS_NLM = True
except ImportError:
    _HAS_NLM = False

MODEL_ID = "minimax/minimax-m2.5:free"

def build_context(body):
    lines = [
        f"Module: {body.get('title', 'Unknown')}",
        f"Subtitle: {body.get('subtitle', '')}",
        f"Overview: {body.get('overview', '')}",
        "Subtopics: " + ", ".join(body.get("subtopics", [])),
    ]
    if body.get("links"):
        lines.append("Reference Links: " + ", ".join(body["links"][:5]))
    if body.get("videos"):
        lines.append("YouTube Videos: " + ", ".join(body["videos"][:3]))
    return "\n".join(lines)

# ── NotebookLM-py path (primary) ─────────────────────────────────────────

async def generate_via_notebooklm(mode, body):
    token = os.environ.get("GOOGLE_NOTEBOOKLM_TOKEN")
    if not token or not _HAS_NLM:
        raise RuntimeError("NotebookLM not configured")
    title  = body.get("title", "GenAI Academy Module")
    client = nlm.NotebookLM(access_token=token)
    notebook = await client.create_notebook(title=f"[GenAI Academy] {title}")
    nid = notebook["notebook_id"]
    try:
        for url in (body.get("links", [])[:8] + body.get("videos", [])[:3]):
            try:
                await client.add_source(notebook_id=nid, url=url)
            except Exception:
                pass
        import asyncio
        await asyncio.sleep(4)
        if mode == "quiz":
            raw = await client.generate_quiz(notebook_id=nid, difficulty="medium")
            return {"questions": raw} if isinstance(raw, list) else raw
        elif mode == "flashcards":
            raw = await client.generate_flashcards(notebook_id=nid, quantity="more")
            if isinstance(raw, list):
                return {"cards": [{"term": i.get("term",""), "definition": i.get("definition","")} for i in raw]}
            return raw
        elif mode == "mindmap":
            raw = await client.generate_mind_map(notebook_id=nid)
            if isinstance(raw, dict) and "mindmap" not in raw:
                branches = [{"label": k, "children": v if isinstance(v,list) else [str(v)]} for k,v in raw.items()]
                return {"mindmap": {"root": title, "branches": branches}}
            return raw
        elif mode == "summary":
            raw = await client.generate_study_guide(notebook_id=nid)
            return {"summary": raw if isinstance(raw, str) else json.dumps(raw)}
        else:
            raise ValueError(f"Unknown mode: {mode}")
    finally:
        try:
            await client.delete_notebook(notebook_id=nid)
        except Exception:
            pass

# ── Qwen 3.6 Plus path (fallback) ─────────────────────────────────────────

PROMPTS = {
    "quiz": (
        "You are an expert GenAI instructor.\n"
        "Given the module context below, generate exactly 5 multiple-choice questions.\n\n"
        "RULES:\n"
        "- Each question has exactly 4 options.\n"
        "- Exactly one option is correct.\n"
        "- Include a short explanation for the correct answer.\n"
        "- Return ONLY valid JSON, no markdown fences, no extra text.\n\n"
        'FORMAT:\n{{"questions":[{{"question":"...","options":["A","B","C","D"],"answer":"A","explanation":"..."}}]}}\n\n'
        "MODULE CONTEXT:\n{context}"
    ),
    "flashcards": (
        "You are an expert GenAI instructor.\n"
        "Generate exactly 8 flashcards for the module context below.\n\n"
        "RULES:\n"
        "- term: 6 words max.\n"
        "- definition: 1-2 clear sentences.\n"
        "- Return ONLY valid JSON, no markdown fences, no extra text.\n\n"
        'FORMAT:\n{{"cards":[{{"term":"...","definition":"..."}}]}}\n\n'
        "MODULE CONTEXT:\n{context}"
    ),
    "mindmap": (
        "You are an expert GenAI instructor.\n"
        "Create a structured mind map for the module context below.\n\n"
        "RULES:\n"
        "- root = module title.\n"
        "- 3-5 main branches from subtopics.\n"
        "- Each branch has 2-5 short leaf node labels.\n"
        "- Return ONLY valid JSON, no markdown fences, no extra text.\n\n"
        'FORMAT:\n{{"mindmap":{{"root":"Title","branches":[{{"label":"Branch","children":["c1","c2"]}}]}}}}\n\n'
        "MODULE CONTEXT:\n{context}"
    ),
    "summary": (
        "You are an expert GenAI instructor.\n"
        "Write a concise study summary for the module context below.\n\n"
        "RULES:\n"
        "- 150-200 words, plain flowing text, no bullet points.\n"
        "- Return ONLY valid JSON, no markdown fences, no extra text.\n\n"
        'FORMAT:\n{{"summary":"..."}}\n\n'
        "MODULE CONTEXT:\n{context}"
    ),
}

def generate_via_openrouter(mode, body):
    api_key = os.environ.get("OPENROUTER_API_KEY")
    if not api_key:
        raise RuntimeError("OPENROUTER_API_KEY not configured")
    context = build_context(body)
    prompt  = PROMPTS.get(mode, PROMPTS["summary"]).format(context=context)

    req_data = {
        "model": MODEL_ID,
        "messages": [{"role": "user", "content": prompt}],
        "temperature": 0.3,
        "response_format": {"type": "json_object"}
    }
    
    req = urllib.request.Request(
        "https://openrouter.ai/api/v1/chat/completions",
        data=json.dumps(req_data).encode(),
        headers={
            "Authorization": f"Bearer {api_key}",
            "Content-Type": "application/json",
            "X-Title": "GenAI Academy"
        },
        method="POST"
    )
    
    with urllib.request.urlopen(req) as response:
        data = json.loads(response.read().decode())
        raw = data["choices"][0]["message"]["content"].strip()
        
        # Strip markdown fences if present
        if raw.startswith("```"):
            parts = raw.split("```")
            raw = parts[1]
            if raw.startswith("json"):
                raw = raw[4:]
        return json.loads(raw.strip())

def generate_via_gemini(mode, body):
    api_key = os.environ.get("GEMINI_API_KEY") or os.environ.get("VITE_GEMINI_API_KEY")
    if not api_key:
        raise RuntimeError("GEMINI_API_KEY not configured")
    
    context = build_context(body)
    prompt  = PROMPTS.get(mode, PROMPTS["summary"]).format(context=context)
    
    # Gemini 1.5 Flash endpoint
    url = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key={api_key}"
    
    req_data = {
        "contents": [{
            "parts": [{"text": prompt}]
        }],
        "generationConfig": {
            "temperature": 0.2,
            "topP": 0.8,
            "topK": 40,
            "maxOutputTokens": 2048,
        }
    }
    
    req = urllib.request.Request(
        url,
        data=json.dumps(req_data).encode(),
        headers={"Content-Type": "application/json"},
        method="POST"
    )
    
    with urllib.request.urlopen(req) as response:
        data = json.loads(response.read().decode())
        if "candidates" not in data or not data["candidates"]:
            raise RuntimeError(f"Gemini error: {data}")
            
        raw = data["candidates"][0]["content"]["parts"][0]["text"].strip()
        
        # Strip markdown fences if present
        if "```" in raw:
            parts = raw.split("```")
            for p in parts:
                inner = p.strip()
                if inner.startswith("{") or inner.startswith("["):
                    raw = inner
                    if raw.startswith("json"): raw = raw[4:].strip()
                    break
        
        # Final safety strip
        start = raw.find("{") if raw.find("{") < raw.find("[") or raw.find("[") == -1 else raw.find("[")
        end = max(raw.rfind("}"), raw.rfind("]"))
        if start != -1 and end != -1:
            raw = raw[start:end+1]
            
        return json.loads(raw)

# ── Vercel handler ────────────────────────────────────────────────────────

class handler(BaseHTTPRequestHandler):
    def _send_json(self, status, data):
        body = json.dumps(data).encode()
        self.send_response(status)
        self.send_header("Content-Type", "application/json")
        self.send_header("Content-Length", str(len(body)))
        self.send_header("Access-Control-Allow-Origin", "*")
        self.send_header("Access-Control-Allow-Methods", "POST, OPTIONS")
        self.send_header("Access-Control-Allow-Headers", "Content-Type")
        self.end_headers()
        self.wfile.write(body)

    def do_OPTIONS(self):
        self._send_json(200, {})

    def do_POST(self):
        try:
            length = int(self.headers.get("Content-Length", 0))
            raw    = self.rfile.read(length)
            body   = json.loads(raw)
        except Exception as e:
            self._send_json(400, {"error": f"Bad request body: {e}"})
            return

        mode = body.get("mode", "quiz")
        result, used = None, None

        # Try NotebookLM-py if token available
        if _HAS_NLM and os.environ.get("GOOGLE_NOTEBOOKLM_TOKEN"):
            try:
                import asyncio
                result = asyncio.run(generate_via_notebooklm(mode, body))
                used   = "notebooklm"
            except Exception as e:
                print(f"[notebooklm-py] {e}", file=sys.stderr)

        # Fallback to Gemini
        if result is None:
            try:
                result = generate_via_gemini(mode, body)
                used   = "gemini-1.5-flash-py"
            except Exception as e:
                print(f"[gemini-py] {e}", file=sys.stderr)

        # Fallback to OpenRouter (Qwen)
        if result is None:
            try:
                result = generate_via_openrouter(mode, body)
                used   = "qwen3.6-plus-py"
            except Exception as e:
                self._send_json(500, {"error": str(e)})
                return

        result["_source"] = used
        self._send_json(200, result)
