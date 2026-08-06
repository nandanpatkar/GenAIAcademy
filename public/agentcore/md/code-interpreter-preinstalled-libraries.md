# Pre-installed libraries - Amazon Bedrock AgentCore

Source: https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/code-interpreter-preinstalled-libraries.html

---

# Pre-installed libraries

The AgentCore Code Interpreter comes with pre-installed libraries for both Python and Node.js. These libraries are available immediately without requiring additional installation.

## Python libraries

The AgentCore Code Interpreter includes a comprehensive set of pre-installed Python libraries to support various data analysis, machine learning, and development tasks.

### Data Analysis and Visualization

Library | Description  
---|---  
`pandas` |  Data manipulation and analysis  
`polars` |  Fast DataFrame library for data manipulation  
`numpy` |  Numerical computing  
`matplotlib` |  Plotting and visualization  
`seaborn` |  Statistical data visualization  
`matplotlib-inline` |  Matplotlib backend for Jupyter  
`matplotlib-venn` |  Venn diagram plotting  
`plotly` |  Interactive visualizations  
`bokeh` |  Interactive visualization library  
`scipy` |  Scientific computing  
`statsmodels` |  Statistical modeling  
`sympy` |  Symbolic mathematics  
`numba` |  Just-in-time compilation for numerical functions  
`pyarrow` |  Columnar data processing  
`numexpr` |  Fast numerical expression evaluator  
`mizani` |  Scales for Python graphics  
`contourpy` |  Contour line generation  
`cycler` |  Composable style cycles  
`fonttools` |  Font manipulation library  
`kiwisolver` |  Constraint solver  
`pyparsing` |  Parsing library  
`python-dateutil` |  Date/time utilities  
`pytz` |  Timezone definitions  
`tzdata` |  Timezone data  
`patsy` |  Statistical model specification  
`threadpoolctl` |  Thread pool control  
`joblib` |  Parallel computing utilities  
`mpmath` |  Arbitrary-precision arithmetic  
`llvmlite` |  LLVM binding for Numba  
  
### Machine Learning and AI

Library | Description  
---|---  
`scikit-learn` |  Machine learning algorithms  
`scikit-image` |  Image processing  
`torch` |  PyTorch deep learning framework  
`torchvision` |  Computer vision for PyTorch  
`torchaudio` |  Audio processing for PyTorch  
`xgboost` |  Gradient boosting framework  
`openai` |  OpenAI API client  
`spacy` |  Natural language processing  
`spacy-legacy` |  Legacy components for spaCy  
`spacy-loggers` |  Logging utilities for spaCy  
`nltk` |  Natural language toolkit  
`textblob` |  Text processing  
`catalogue` |  Tiny library for function registries  
`confection` |  Configuration system  
`cymem` |  Memory management for Cython  
`murmurhash` |  Cython bindings for MurmurHash  
`preshed` |  Cython hash tables  
`srsly` |  Serialization utilities  
`thinc` |  Machine learning library  
`wasabi` |  Lightweight console printing  
`weasel` |  Command-line interface for spaCy projects  
`blis` |  BLAS-like linear algebra library  
`langcodes` |  Language code utilities  
`language_data` |  Language data for langcodes  
`marisa-trie` |  Trie data structure  
`absl-py` |  Abseil Python common libraries  
`mcp` |  Model Context Protocol  
  
### Mathematical and Optimization

Library | Description  
---|---  
`cvxpy` |  Convex optimization  
`ortools` |  Operations research tools  
`pulp` |  Linear programming  
`galois` |  Galois field arithmetic  
`z3-solver` |  Theorem prover  
`python_constraint2` |  Constraint satisfaction problems  
`gapstatistics` |  Gap statistic for clustering  
`oeis` |  Online Encyclopedia of Integer Sequences  
`networkx` |  Network analysis  
`igraph` |  Graph analysis and visualization  
  
### Web and API Development

Library | Description  
---|---  
`requests` |  HTTP library  
`beautifulsoup4` |  Web scraping  
`fastapi` |  Modern web framework  
`Flask` |  Lightweight web framework  
`Flask-Cors` |  Cross-origin resource sharing for Flask  
`Flask-Login` |  User session management for Flask  
`Django` |  Full-featured web framework  
`httpx` |  Async HTTP client  
`httpcore` |  HTTP core library  
`starlette` |  ASGI framework  
`uvicorn` |  ASGI server  
`gunicorn` |  WSGI HTTP server  
`Hypercorn` |  ASGI server  
`asgiref` |  ASGI reference implementation  
`Werkzeug` |  WSGI utility library  
`Jinja2` |  Template engine  
`MarkupSafe` |  Safe string handling  
`itsdangerous` |  Cryptographic signing  
`blinker` |  Signal/event dispatching  
`click-plugins` |  Click plugin system  
`tornado` |  Web framework and async networking  
`sqlparse` |  SQL parser  
`greenlet` |  Lightweight coroutines  
`aiosignal` |  Async signal dispatching  
`anyio` |  Async compatibility layer  
`certifi` |  Certificate bundle  
`dnspython` |  DNS toolkit  
`email_validator` |  Email validation  
`frozenlist` |  Immutable list implementation  
`h11` |  HTTP/1.1 protocol implementation  
`h2` |  HTTP/2 protocol implementation  
`hpack` |  HTTP/2 header compression  
`httptools` |  Fast HTTP parsing  
`hyperframe` |  HTTP/2 framing layer  
`idna` |  Internationalized domain names  
`multidict` |  Multi-value dictionary  
`priority` |  HTTP/2 priority tree  
`python-dotenv` |  Environment variable management  
`python-multipart` |  Multipart form data parser  
`shellingham` |  Shell detection library  
`sniffio` |  Async library detection  
`sse-starlette` |  Server-sent events for Starlette  
`urllib3` |  HTTP client library  
`uvloop` |  Fast event loop for asyncio  
`watchfiles` |  File watching library  
`wsproto` |  WebSocket protocol implementation  
`yarl` |  URL parsing library  
  
### Cloud and Database

Library | Description  
---|---  
`boto3` |  AWS SDK for Python (boto3)  
`duckdb` |  In-process SQL database  
`SQLAlchemy` |  SQL toolkit and ORM  
`pymongo` |  MongoDB driver  
`redis` |  Redis client  
`psycopg2-binary` |  PostgreSQL adapter  
  
### File Processing and Documents

Library | Description  
---|---  
`openpyxl` |  Excel file processing  
`xlrd` |  Excel file reading  
`XlsxWriter` |  Excel file writing  
`pyxlsb` |  Excel binary format reader  
`et-xmlfile` |  XML file handling for openpyxl  
`PyPDF2` |  PDF processing  
`pdfplumber` |  PDF text extraction  
`pdf2image` |  PDF to image conversion  
`pdfkit` |  HTML to PDF conversion. Requires the `wkhtmltopdf` and is not pre-installed in the runtime. To use `pdfkit`, install `wkhtmltopdf` yourself in the session.  
`pypdfium2` |  PDF processing library  
`pdfminer.six` |  PDF text extraction  
`pdfrw` |  PDF reader/writer  
`python-docx` |  Word document processing  
`docx2txt` |  Word document text extraction  
`reportlab` |  PDF generation  
`fpdf` |  Simple PDF generation  
`rarfile` |  RAR archive processing  
`xml-python` |  XML processing  
`svglib` |  SVG to PDF/bitmap conversion  
`svgwrite` |  SVG creation library  
`proglog` |  Progress logging  
`lazy_loader` |  Lazy module loading  
  
### Image and Media Processing

Library | Description  
---|---  
`pillow` |  Image processing  
`opencv-python` |  Computer vision  
`imageio` |  Image I/O  
`imageio-ffmpeg` |  FFmpeg plugin for imageio  
`moviepy` |  Video editing  
`ffmpeg-python` |  FFmpeg wrapper  
`ffmpy` |  FFmpeg wrapper  
`pydub` |  Audio manipulation  
`gtts` |  Google Text-to-Speech  
`mutagen` |  Audio metadata handling  
`Wand` |  ImageMagick binding  
`imgkit` |  HTML to image conversion  
`pypng` |  PNG image processing  
`PyWavelets` |  Wavelet transforms  
`tifffile` |  TIFF file processing  
  
### Development Tools and Utilities

Library | Description  
---|---  
`pydantic` |  Data validation using type hints  
`pydantic-settings` |  Settings management for Pydantic  
`pydantic_core` |  Core validation logic for Pydantic  
`jsonschema` |  JSON schema validation  
`PyYAML` |  YAML processing  
`orjson` |  Fast JSON library  
`ujson` |  Ultra fast JSON encoder/decoder  
`click` |  Command line interface creation  
`typer` |  Modern CLI framework  
`tqdm` |  Progress bars  
`loguru` |  Logging library  
`rich` |  Rich text and beautiful formatting  
`ipython` |  Interactive Python shell  
`Faker` |  Fake data generation  
`qrcode` |  QR code generation  
`retrying` |  Retry decorator  
`tenacity` |  Retry library  
`backoff` |  Backoff and retry  
`more_itertools` |  Additional iterator tools  
`cryptography` |  Cryptographic recipes and primitives  
`bcrypt` |  Password hashing  
`PyNaCl` |  Networking and Cryptography library  
`pyOpenSSL` |  OpenSSL wrapper  
`cffi` |  C Foreign Function Interface  
`pycparser` |  C parser in Python  
`annotated-types` |  Reusable constraint types  
`typing_extensions` |  Backported typing features  
`typing_inspection` |  Runtime inspection of typing  
`astor` |  AST to source code converter  
`asttokens` |  Annotate AST with source tokens  
`executing` |  Get currently executing AST node  
`pure-eval` |  Safe evaluation of expressions  
`stack-data` |  Extract data from stack frames  
`decorator` |  Decorator utilities  
`entrypoints` |  Discover entry points  
`jedi` |  Code completion library  
`parso` |  Python parser  
`prompt_toolkit` |  Interactive command line toolkit  
`traitlets` |  Configuration system  
`wcwidth` |  Terminal width calculation  
`Pygments` |  Syntax highlighting  
`mdurl` |  URL utilities for Markdown  
`texttable` |  Text table formatting  
`xyzservices` |  Source of XYZ tile services  
`attrs` |  Classes without boilerplate  
`cachetools` |  Extensible memoizing collections  
`cloudpathlib` |  Cloud storage path library  
`cloudpickle` |  Pickle for cloud computing  
`distro` |  Linux distribution information  
`filelock` |  Platform independent file locking  
`fsspec` |  Filesystem specification  
`future` |  Python 2/3 compatibility  
`httpx-sse` |  Server-sent events for HTTPX  
`importlib_metadata` |  Library metadata access  
`importlib_resources` |  Resource access for packages  
`jsonschema-specifications` |  JSON Schema specifications  
`packaging` |  Core utilities for Python packages  
`pexpect` |  Expect-like subprocess control  
`platformdirs` |  Platform-specific directories  
`ptyprocess` |  Pseudoterminal utilities  
`referencing` |  JSON reference resolution  
`rpds-py` |  Persistent data structures  
`six` |  Python 2/3 compatibility utilities  
`smart-open` |  Utils for streaming large files  
`zipp` |  Backport of pathlib-compatible object wrapper  
  
### Text and Markup Processing

Library | Description  
---|---  
`markdown-it-py` |  Markdown parser  
`markdown2` |  Markdown processor  
`markdownify` |  HTML to Markdown converter  
`lxml` |  XML and HTML processing  
`cssselect2` |  CSS selector implementation  
`tinycss2` |  CSS parser  
`webencodings` |  Character encoding for web  
`soupsieve` |  CSS selector library  
`regex` |  Alternative regular expression module  
`chardet` |  Character encoding detection  
`charset-normalizer` |  Character encoding detection  
  
### Geospatial and Mapping

Library | Description  
---|---  
`shapely` |  Geometric objects manipulation  
`pyshp` |  Shapefile library  
`branca` |  HTML/JS template library for maps  
  
### Document Processing Support

Library | Description  
---|---  
`python-pptx` |  Create and update PowerPoint (.pptx) files  
`defusedxml` |  XML bomb protection for Python stdlib modules  
`markitdown` |  Convert various file formats to Markdown  
`xlwt` |  Write data and formatting information to Excel files  
`odfpy` |  API for OpenDocument Format documents  
`docx-mailmerge` |  Mail merge for Word documents  
`docxcompose` |  Compose Word documents by concatenating/appending  
`html5lib` |  Standards-compliant library for parsing and serializing HTML  
`xmltodict` |  Convert XML to Python dictionaries  
`tabula-py` |  Extract tables from PDF files  
`pypandoc` |  Python wrapper for Pandoc document converter  
`pypdf` |  Pure Python PDF library for splitting, merging, cropping  
  
For a complete list of all pre-installed Python libraries with their specific versions, you can run the following code in your Code Interpreter session:

```python
import pkg_resources
installed_packages = [d for d in pkg_resources.working_set]
for package in sorted(installed_packages, key=lambda x: x.project_name.lower()):
    print(f"{package.project_name}=={package.version}")
```
## Node.js packages/libraries

The following Node.js packages/libraries are pre-installed in the AgentCore Code Interpreter environment.

Package/Library | Description  
---|---  
`axios` |  Promise-based HTTP client  
`lodash` |  Utility library for common programming tasks  
`uuid` |  UUID generation  
`zod` |  TypeScript-first schema validation  
`cheerio` |  HTML parsing and manipulation

