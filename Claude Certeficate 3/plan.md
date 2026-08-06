I'm building an interactive study website for a set of professional certification courses. I have uploaded the full course module content and a practice question dump for the first course (Claude Certified Associate – Foundations) as project files. I want you to read all of the uploaded files carefully and build a complete, polished, self-contained HTML file for this website.
 
CONTEXT ON THE DATA
- The module files (MODULE_1.txt through MODULE_8.txt, or however they're named) contain the full course content: teaching sections, worked examples, key takeaways, and quiz questions with answers and rationale for each module.
- The question dump file contains a larger set of practice questions (both official course questions and additional original questions), organized by module/domain, with correct answers and explanations.
- Extract ALL of this content faithfully — every module, every section, every quiz question. Do not summarize, shorten, or drop content. This is a study tool, so completeness matters more than brevity.
 
OVERALL SITE STRUCTURE
This site needs to support MULTIPLE courses over time (I'll add 2 more later), so build it to be easily extensible from the start:
 
1. LANDING / COURSE SELECTION SCREEN
   - Shows a card or tile for each available course (right now, just one: "Claude Certified Associate – Foundations")
   - Each card shows the course title, a short description, and something like a progress indicator (e.g., "0 of 8 modules complete") once the user starts
   - Clicking a course card takes the user into that course's home view
   - Structure the underlying data so a new course = adding one new entry to a `courses` data object, not rewriting the page
 
2. COURSE HOME VIEW (after selecting a course)
   - Two clear options/tabs: "Course Material" and "Quiz"
   - Show the course title and a way to navigate back to the course selection screen
 
3. COURSE MATERIAL VIEW
   - List all modules in order (e.g., Module 1 through Module 8), each as a clickable item showing its title and a completion checkmark once viewed
   - Clicking a module opens its full content in a clean, readable, well-formatted layout:
     - Use proper headings, subheadings, bullet lists, and tables where the source content has them (e.g., comparison tables, decision frameworks)
     - Preserve worked examples, key takeaways, and any tables/frameworks exactly as structured in the source
     - Include the module's own quiz questions inline at the end of that module's content, shown as expandable/revealable Q&A (question first, click or button to reveal the answer + rationale) — NOT as a graded quiz, just for review as you read
   - Add "Previous Module" / "Next Module" navigation buttons so the user can progress through the course sequentially
   - Track and visually indicate which modules have been opened/completed (a progress bar or checklist at the top of the Course Material view)
 
4. QUIZ VIEW
   - Pull questions from the question dump file (use the full set, not just a sample)
   - Present ONE question at a time in a proper quiz format:
     - Question text, then multiple-choice options as clickable buttons/cards (not a dropdown)
     - After the user selects an answer, show immediate feedback: mark their choice correct/incorrect, reveal the correct answer if they got it wrong, and show the rationale/explanation
     - A "Next Question" button to proceed
   - Include a progress indicator ("Question 4 of 50") and a running score
   - At the end of the quiz, show a results summary: score, percentage, and a breakdown of which questions were missed (with the option to review them)
   - Add a way to restart the quiz or select a shorter random subset (e.g., "Quick 20-question quiz" vs "Full quiz") if that's easy to implement — optional but nice to have
   - If the dump organizes questions by domain/module, let the user optionally filter/select which domain(s) to be quizzed on, in addition to a "full mixed quiz" default option
 
DESIGN & UX REQUIREMENTS
- Clean, modern, professional aesthetic — this is a serious study tool, not a toy. Use a cohesive color palette, good typography hierarchy, generous whitespace, and clear visual separation between sections.
- Fully responsive — must work well on both desktop and mobile, since I'll likely study on my phone sometimes.
- Smooth, simple transitions between views (course selection → course home → material/quiz) — no jarring page reloads, this should feel like a single-page app.
- Make correct/incorrect quiz feedback visually obvious (color coding, icons) without being childish.
- Include a persistent way to navigate back at every level (quiz → course home → course selection).

TECHNICAL REQUIREMENTS

* Build the website as a modern React application using reusable functional components and React Hooks.

* Use JavaScript with JSX. Do not use TypeScript unless it is already configured in the project.

* Assume the project uses React with Vite.

* Create a complete, working frontend rather than a static mockup.

* Organize the application into clear, reusable components such as:

  * App
  * CourseSelection
  * CourseCard
  * CourseHome
  * CourseMaterial
  * ModuleSidebar
  * ModuleContent
  * InlineReviewQuestion
  * QuizSetup
  * QuizQuestion
  * QuizProgress
  * QuizResults
  * MissedQuestionReview

* Use React state to manage:

  * Selected course
  * Current application view
  * Selected module
  * Completed or opened modules
  * Quiz configuration
  * Current quiz question
  * Selected answers
  * Score
  * Missed questions
  * Quiz completion state

* Use an SPA-style navigation flow without full-page reloads.

* React Router is optional. A clean state-based navigation approach is acceptable if routing is unnecessary.

* Store all course content in structured JavaScript objects or arrays, clearly organized in the following hierarchy:

  * Course
  * Course metadata
  * Modules
  * Module sections
  * Inline module review questions
  * Quiz domains
  * Quiz questions

* Keep the course data separate from the presentation components. Prefer a structure such as:

  src/
  components/
  data/
  courses.js
  styles/
  App.jsx
  main.jsx

* Structure the course data so that adding another course only requires adding another object to the `courses` array or object.

* Add clear comments showing where future courses, modules, domains, and questions should be added.

* Extract ALL content from the uploaded files faithfully. Do not use placeholder module content, sample questions, shortened text, or generated summaries.

* Preserve headings, lists, tables, examples, key takeaways, answer choices, correct answers, and rationales from the uploaded files.

* Render source tables as accessible, responsive HTML tables.

* Render module review questions as expandable React components using buttons or disclosure panels.

* Render quiz answer options as selectable buttons or cards.

* Disable repeated answer selection after an answer has been submitted unless the question is being reviewed.

* Clearly show:

  * The selected answer
  * Whether it is correct or incorrect
  * The correct answer
  * The full rationale

* Support:

  * Full mixed quiz
  * Quick 20-question quiz
  * Domain-specific quiz
  * Module-specific quiz where the source data supports it
  * Quiz restart
  * Review of missed questions

* Randomize questions for quick quizzes while preventing duplicate questions in the same attempt.

* Keep progress and quiz state in React memory for now.

* Do not use localStorage, sessionStorage, or a backend at this stage.

* Add a code comment explaining that all progress resets when the page refreshes and that the state layer can later be replaced with localStorage, a database, or an API.

* Use plain CSS, CSS Modules, or the project’s existing styling system.

* Do not introduce external UI libraries unless they are already installed in the project.

* Do not use external CDN scripts or stylesheets.

* Ensure the application is fully responsive for desktop, tablet, and mobile screens.

* Follow accessibility best practices:

  * Semantic HTML
  * Keyboard-accessible controls
  * Visible focus states
  * Appropriate ARIA attributes
  * Sufficient color contrast
  * Accessible expandable sections
  * Accessible progress indicators

* Avoid unnecessary dependencies and keep the implementation easy to maintain.

* The final application must run without console errors.

* Do not leave TODO placeholders for any content available in the uploaded files.

* Do not omit questions because of response length. Include the complete dataset from every uploaded module file and the entire practice-question dump.

DESIGN IMPLEMENTATION REQUIREMENTS

* Use a clean, modern, professional visual style suitable for a certification-learning platform.
* Create a responsive dashboard-style layout with:

  * Course cards
  * Module navigation
  * Reading progress
  * Quiz progress
  * Score indicators
  * Results summary
* On desktop, the Course Material view may use a sidebar for module navigation and a main reading panel.
* On mobile, convert the sidebar into a collapsible module selector or drawer-style panel.
* Keep navigation controls visible and predictable.
* Use subtle animations or CSS transitions for:

  * View changes
  * Expandable answers
  * Quiz feedback
  * Progress updates
* Respect reduced-motion preferences.
* Use professional correct and incorrect states without making the interface look childish.
* Make long module content comfortable to read with appropriate content width, typography, line height, spacing, and heading hierarchy.

DATA MODEL EXPECTATION

Use an extensible structure similar to the following concept or you can make your own :

```javascript
const courses = [
  {
    id: "claude-certified-associate-foundations",
    title: "Claude Certified Associate – Foundations",
    description: "...",
    modules: [
      {
        id: "module-1",
        number: 1,
        title: "...",
        sections: [
          {
            id: "section-1",
            title: "...",
            type: "content",
            content: [...]
          }
        ],
        reviewQuestions: [
          {
            id: "...",
            question: "...",
            answer: "...",
            rationale: "..."
          }
        ]
      }
    ],
    quiz: {
      domains: [
        {
          id: "...",
          title: "..."
        }
      ],
      questions: [
        {
          id: "...",
          moduleId: "module-1",
          domainId: "...",
          question: "...",
          options: [
            {
              id: "A",
              text: "..."
            }
          ],
          correctOptionId: "A",
          rationale: "..."
        }
      ]
    }
  }
];
```

This is only a structural example. Adapt the model where necessary to preserve the exact uploaded content.

DELIVERABLE

Before generating the implementation, briefly state:

* The number of course module files found
* The number of modules extracted
* The total number of inline module review questions found
* The total number of questions found in the practice-question dump
* Any duplicate, malformed, or incomplete questions detected

Then build the complete React application.
