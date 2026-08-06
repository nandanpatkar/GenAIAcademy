I have added C:\Users\NandanPatkar\OneDrive - Celebal Technologies Private Limited\Desktop\Claude Certeficate\conne which contains Course material for Amazon Connect , i want to integrate it in my project as a seperate section 
CONTEXT
The project contains multiple course text/PDF files (e.g. "Amazon Connect Routing Fundamentals", "Amazon Connect Flows Intermediate", "Amazon Connect Customer Profiles Fundamentals", etc.). Each file represents one course, full of structured study content (concepts, configuration steps, use cases, terminology).

1. LANDING / COURSE SELECTION SCREEN
   - Show a clean grid or list of all available courses as cards.
   - Each card shows: course title, a short 1-line description, and an estimated topic count.
   - Clicking a card takes the user into that course's content view.
   - Include a search/filter box to quickly find a course by name.
2. COURSE CONTENT VIEW
   - Once a course is selected, show its full content broken into logical sections/topics (use headings from the source file to segment it — don't just dump raw text).
   - Left sidebar: a table of contents / topic list for that course, each topic clickable, with a checkmark or progress indicator once viewed.
   - Main panel: the formatted content for the selected topic — use proper typography (headings, bullet lists, code/config blocks styled distinctly, callout boxes for "key points" or "gotchas").
   - A "back to all courses" button/breadcrumb at the top.
   - Next/Previous topic navigation buttons at the bottom of each topic.
 
3. PROGRESS TRACKING
   - Track which topics within a course have been viewed/completed (use in-memory JS state — no localStorage/sessionStorage, since those aren't supported in this environment).
   - Show a progress bar per course on the course selection screen and inside the course view (e.g. "6 of 14 topics completed").
   - Note: since there's no persistent storage, progress will reset on page reload — that's expected and fine for now.
4. DESIGN
Aws Inspired colour and theme 
 
5. CONTENT SOURCING
   - Pull the actual structured content from the uploaded course files in this project (use project_knowledge_search / the uploaded files directly) — don't invent generic Amazon Connect content. Preserve the real structure, terminology, and details from each file.
   - Where a file is long, organize it into sensible topic chunks (roughly by its own headings/sections) rather than one giant scroll.

 
DELIVERABLE
- Make sure the course data (titles, topics, content) is embedded as a JS data structure inside the file itself, not fetched externally.
 

 