Sometimes, you need to trace a request across multiple services.

LangSmith supports distributed tracing out of the box, linking runs within a trace across services using context propagation headers (`langsmith-trace` and optional `baggage` for metadata/tags).

Example client-server setup:

* Trace starts on client
* Continues on server


> [!WARNING]
>
> **Only accept distributed-tracing headers from trusted services.** The `langsmith-trace` and `baggage` headers are consumed as trusted tracing context. Do not add `TracingMiddleware` (or pass inbound request headers as the tracing `parent`) on a service that receives requests directly from untrusted third parties or the public internet. Keep distributed tracing to internal, service-to-service calls, and strip these headers from untrusted inbound requests at your gateway or proxy. Trusting `baggage` from an external caller lets them influence how your runs are recorded.


## Distributed tracing in Python

```python
# client.py
from langsmith.run_helpers import get_current_run_tree, traceable

@traceable
async def my_client_function():
    headers = {}
    async with httpx.AsyncClient(base_url="...") as client:
        if run_tree := get_current_run_tree():
            # add langsmith-id to headers
            headers.update(run_tree.to_headers())
        return await client.post("/my-route", headers=headers)
```

Then the server (or other service) can continue the trace by handling the headers appropriately. If you are using an asgi app Starlette or FastAPI, you can connect the distributed trace using LangSmith's `TracingMiddleware`.


> [!NOTE]
>
> The `TracingMiddleware` class was added in `langsmith==0.1.133`.


Example using FastAPI:

```python
from langsmith import traceable
from langsmith.middleware import TracingMiddleware
from fastapi import FastAPI, Request

app = FastAPI()  # Or Flask, Django, or any other framework
app.add_middleware(TracingMiddleware)

@traceable
async def some_function():
    ...

@app.post("/my-route")
async def fake_route(request: Request):
    return await some_function()
```

Or in Starlette:

```python
from starlette.applications import Starlette
from starlette.middleware import Middleware
from langsmith.middleware import TracingMiddleware

routes = ...
middleware = [
    Middleware(TracingMiddleware),
]
app = Starlette(..., middleware=middleware)
```

If you are using other server frameworks, you can always "receive" the distributed trace by passing the headers in through `langsmith_extra`:

```python
# server.py

from fastapi import FastAPI, Request

@ls.traceable
async def my_application():
    ...

app = FastAPI()  # Or Flask, Django, or any other framework

@app.post("/my-route")
async def fake_route(request: Request):
    # request.headers:  {"langsmith-trace": "..."}
    # as well as optional metadata/tags in `baggage`
    with ls.tracing_context(parent=request.headers):
        return await my_application()
```

The example above uses the `tracing_context` context manager. You can also directly specify the parent run context in the `langsmith_extra` parameter of a method wrapped with `@traceable`.

```python
# ... same as above

@app.post("/my-route")
async def fake_route(request: Request):
    # request.headers:  {"langsmith-trace": "..."}
    my_application(langsmith_extra={"parent": request.headers})
```

## Distributed tracing in TypeScript


> [!NOTE]
>
> Distributed tracing in TypeScript requires `langsmith` version `>=0.1.31`


First, we obtain the current run tree from the client and convert it to `langsmith-trace` and `baggage` header values, which we can pass to the server:

```typescript
// client.mts

const client = traceable(
    async () => {
        const runTree = getCurrentRunTree();
        return await fetch("...", {
            method: "POST",
            headers: runTree.toHeaders(),
        }).then((a) => a.text());
    },
    { name: "client" }
);

await client();
```

Then, the server converts the headers back to a run tree, which it uses to further continue the tracing.

To pass the newly created run tree to a traceable function, we can use the `withRunTree` helper, which will ensure the run tree is propagated within traceable invocations.

```lc-tabs
[
 {
  "label": "Express.JS",
  "lang": "typescript",
  "code": "// server.mts\n\n    const server = traceable(\n        (text: string) => `Hello from the server! Received \"${text}\"`,\n        { name: \"server\" }\n    );\n\n    const app = express();\n    app.use(bodyParser.text());\n\napp.post(\"/\", async (req, res) => {\n    const runTree = RunTree.fromHeaders(req.headers);\n    const result = await withRunTree(runTree, () => server(req.body));\n    res.send(result);\n});"
 },
 {
  "label": "Hono",
  "lang": "typescript",
  "code": "// server.mts\n\n    const server = traceable(\n        (text: string) => `Hello from the server! Received \"${text}\"`,\n        { name: \"server\" }\n    );\n\n    const app = new Hono();\n\napp.post(\"/\", async (c) => {\n    const body = await c.req.text();\n    const runTree = RunTree.fromHeaders(c.req.raw.headers);\n    const result = await withRunTree(runTree, () => server(body));\n    return c.body(result);\n});"
 }
]
```
