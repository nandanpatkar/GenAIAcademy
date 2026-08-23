import React, { useMemo, useState } from "react";
import {
  ArrowRight,
  BookOpen,
  Boxes,
  BriefcaseBusiness,
  Camera,
  Check,
  ChevronDown,
  ChevronRight,
  ClipboardList,
  Code,
  Compass,
  CreditCard,
  FileCode2,
  FileQuestionMark,
  FileText,
  FlagTriangleRight,
  Globe,
  GraduationCap,
  LayoutDashboard,
  Library,
  LifeBuoy,
  Medal,
  MessageCircle,
  MessageSquare,
  Monitor,
  Play,
  Route,
  Sparkles,
  Target,
  Terminal,
  TerminalSquare,
  Trophy,
  UserCog,
  Users,
  X,
} from "lucide-react";
import DsaBrandMark from "./DsaBrandMark";
import "../../styles/DsaHome.css";

// The hero drifts a field of dim particles behind the headline. Positions are
// derived from a fixed seed so the layer never reshuffles between renders.
const buildParticles = (count) => {
  let seed = 20260823;
  const random = () => {
    seed = (seed * 1103515245 + 12345) % 2147483648;
    return seed / 2147483648;
  };
  return Array.from({ length: count }, (_, index) => ({
    id: index,
    left: `${random() * 100}%`,
    top: `${random() * 100}%`,
    size: `${1 + random() * 1.6}px`,
    opacity: 0.18 + random() * 0.45,
    duration: `${8 + random() * 6}s`,
    delay: `${random() * 6}s`,
    driftX: `${random() * 26 - 13}px`,
    driftY: `${random() * 26 - 13}px`,
  }));
};

const previewRail = [
  [LayoutDashboard, "Dashboard"],
  [Library, "Buy Courses"],
  [Boxes, "DSA Preparation"],
  [MessageSquare, "Interview Experience"],
  [GraduationCap, "Core Subjects"],
  [FileText, "Articles"],
  [FlagTriangleRight, "Guided Path"],
  [FileQuestionMark, "Tutorials"],
  [ClipboardList, "Mock Test"],
];

const community = [
  ["800", "k+", "YouTube learners and counting"],
  ["100", "K+", "Community members and counting"],
  ["10", "k+", "Discord coders and counting"],
  ["1", "k+", "Mentored placements and counting"],
];

const resources = [
  [GraduationCap, "Core CS Subjects", "Essential computer science foundations simplified.", "dashboard"],
  [Code, "Free Web Dev", "Learn to build real-world web projects from scratch.", "dashboard"],
  [Monitor, "Dev Playground", "Prototype and inspect ideas in a live scratch environment.", "problems"],
  [Terminal, "Quick Compiler", "Run and test code instantly, without setup.", "problems"],
  [ClipboardList, "Mock Tests", "Practice with test simulations to boost placement.", "sheet"],
  [FileQuestionMark, "Tutorials", "Step-by-step guides to master concepts with ease.", "dashboard"],
  [MessageCircle, "Interview Experiences", "Get insights from real interview journeys.", "dashboard"],
  [Medal, "Dev Challenges", "Sharpen your skills with hands-on coding challenges.", "problems"],
];

const learnCardIcons = [Sparkles, Target, Boxes];

const learnTabs = [
  {
    id: "sheets",
    label: "DSA Sheets",
    target: "sheet",
    cards: [
      ["Theory Simplified", "Every pattern is unpacked before the questions arrive, so the sheet reads as one continuous idea instead of 450 disconnected problems."],
      ["Exam Focused", "Questions are ordered the way interviews escalate — warm-up, core pattern, then the follow-up variant a panel actually asks."],
      ["Practical Usage", "Each solved problem links back to where the structure shows up in real systems, not just in the judge."],
    ],
  },
  {
    id: "core",
    label: "Core Subjects",
    target: "dashboard",
    cards: [
      ["Theory Simplified", "Operating systems, DBMS, and networks explained from first principles with the jargon translated as it appears."],
      ["Exam Focused", "Condensed revision passes built for the week before a placement drive, not for a semester syllabus."],
      ["Practical Usage", "See how scheduling, indexing, and transactions decide the behaviour of the software you already use."],
    ],
  },
  {
    id: "interview",
    label: "Interview Experience",
    target: "dashboard",
    cards: [
      ["Theory Simplified", "Round-by-round breakdowns that separate what was asked from how it was actually evaluated."],
      ["Exam Focused", "Company-tagged patterns so preparation narrows to the shortlist you are targeting."],
      ["Practical Usage", "Post-offer notes on negotiation, timelines, and what the first ninety days look like."],
    ],
  },
  {
    id: "guides",
    label: "Guides",
    target: "dashboard",
    cards: [
      ["Theory Simplified", "Long-form explainers that build one concept at a time with worked examples throughout."],
      ["Exam Focused", "Short reference pages for the definitions and complexities worth memorising before a round."],
      ["Practical Usage", "Implementation walkthroughs you can lift straight into a project or a submission."],
    ],
  },
];

const mentorNotes = [
  {
    lead: "Here to",
    accent: "Guide",
    trail: ", not Just Create.",
    body: "Courses are everywhere. What this section provides is a living ecosystem built for real builders — learning becomes action through collaboration, critique, and real-world execution.",
    sign: "~ Mentor note",
  },
  {
    lead: "Transforming",
    accent: "Learners",
    trail: " into Industry Leaders.",
    body: "From startups to tech giants, the gap between learning and doing closes through real challenges, personalised feedback, and a community that ships. Excellence is the only standard.",
    sign: "~ Mentor note",
  },
];

const testimonials = [
  ["PA", "Parth Singh", "2nd year student", "The way everything is explained is phenomenal — it genuinely starts from zero, and the same idea gets repeated across three or four test cases until it lands."],
  ["VE", "Vedant Jain", "Final year student", "I had tried understanding DSA many times through different resources, but the structure and quality of teaching here stood out on top."],
  ["RI", "Rishi Kant", "BBA student", "You won't believe I am graduating from BBA, but the teaching made me start loving coding. Now I am looking for a job in IT because of it."],
  ["CH", "Chirag Arora", "Student", "Best DSA experience I have come across online. Affordable, and the variety of questions is top notch — better than programmes costing many times more."],
  ["AN", "Anshika Aggarwal", "1.5 YOE as MTS", "When I started I was not confident in DSA at all, and now I genuinely am. The amount of knowledge shared here is hard to overstate."],
  ["BH", "Bhavya Bhalla", "Student", "Beginner friendly from language basics to graphs and DP. I used to be afraid of DP, and the rules taught here apply to most DP problems I now attempt."],
];


const helpTopics = [
  {
    id: "content",
    icon: BookOpen,
    label: "Course Content & Curriculum",
    faqs: [
      ["What is included in the DSA section?", "The full Code Lab question bank, the Zero to Hero 450 sheet experience, progress tracking, an AI coach, and a working judge — all in one place."],
      ["How is the material structured?", "Questions are grouped by category and then by pattern, so each topic moves from the core idea to the interview variants built on top of it."],
      ["Which languages are covered?", "Solutions and the editor support the mainstream interview languages, and every problem statement stays language agnostic."],
    ],
  },
  {
    id: "practice",
    icon: TerminalSquare,
    label: "Practice & Technical Support",
    faqs: [
      ["Can I run and submit solutions?", "Yes. Every judge-ready problem uses the same Code Lab execution and submission pipeline as the rest of the workspace."],
      ["Do you provide coding exercises and projects?", "Each pattern ships with graded practice, and the problem bank doubles as the exercise set for every topic you open."],
      ["What if the judge fails on a problem?", "Non judge-ready problems fall back to a read-and-notes mode so the statement, examples, and your notes still work."],
    ],
  },
  {
    id: "progress",
    icon: LayoutDashboard,
    label: "Progress & Account",
    faqs: [
      ["Are my notes and progress saved?", "Yes. Problem notes, code drafts, completions, bookmarks, and recent activity are stored locally on your device."],
      ["Can I use the AI coach while coding?", "Yes. The AI tab receives the active problem and your current editor code as context, so answers stay specific to what you are writing."],
      ["Does this replace any existing section?", "No. DSA is an additive section and does not remove or reorder any existing sidebar destination."],
    ],
  },
  {
    id: "career",
    icon: BriefcaseBusiness,
    label: "Career Guidance",
    faqs: [
      ["How long does the sheet take to finish?", "At a steady three to four problems a day the sheet lands in roughly four months, which matches most placement calendars."],
      ["Where do I start if I am a beginner?", "Open the guided path first — it orders the categories so nothing depends on a pattern you have not seen yet."],
      ["Is this enough for interviews?", "It covers the pattern surface most panels draw from, and interview experiences fill in the round structure around it."],
    ],
  },
  {
    id: "billing",
    icon: CreditCard,
    label: "Payment & Refunds",
    faqs: [
      ["Is anything free?", "The Start Here block — core subjects, tutorials, the quick compiler, and dev challenges — needs no subscription."],
      ["Do I need an account to practise?", "Progress, notes, and drafts are stored locally, so you can start immediately and keep everything on this device."],
    ],
  },
];

export default function DsaHomeLanding({ onNavigate, onClose }) {
  const particles = useMemo(() => buildParticles(28), []);
  const [activeLearnTab, setActiveLearnTab] = useState(learnTabs[0].id);
  const [activeHelpTopic, setActiveHelpTopic] = useState(helpTopics[0].id);

  const learnTab = learnTabs.find((tab) => tab.id === activeLearnTab) || learnTabs[0];
  const helpTopic = helpTopics.find((topic) => topic.id === activeHelpTopic) || helpTopics[0];

  const scrollTo = (id) => document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });

  return (
    <div className="dsa-home-page">
      <header className="dsa-home-nav">
        <button type="button" className="dsa-home-brand" onClick={() => onNavigate("home")}>
          <DsaBrandMark />
          <strong>DSA</strong>
        </button>
        <nav aria-label="DSA home navigation">
          <button type="button" onClick={() => onNavigate("dashboard")}>Learn</button>
          <button type="button" onClick={() => scrollTo("dsa-resources")}>Explore</button>
          <button type="button" onClick={() => onNavigate("problems")}>Practice</button>
        </nav>
        <div>
          <button type="button" onClick={() => onNavigate("dashboard")}><LayoutDashboard size={14} /> Dashboard</button>
          <button type="button" className="dsa-home-close" onClick={onClose} aria-label="Close DSA"><X size={16} /></button>
        </div>
      </header>

      <main>
        <section className="dsa-home-hero">
          <div className="dsa-hero-particles" aria-hidden="true">
            {particles.map((particle) => (
              <i
                key={particle.id}
                style={{
                  left: particle.left,
                  top: particle.top,
                  width: particle.size,
                  height: particle.size,
                  "--p-opacity": particle.opacity,
                  "--p-dx": particle.driftX,
                  "--p-dy": particle.driftY,
                  animationDuration: particle.duration,
                  animationDelay: particle.delay,
                }}
              />
            ))}
          </div>

          <span className="dsa-hero-badge">India&apos;s #1 Coding Community</span>
          <h1>Get Your First Job</h1>
          <h2>one pattern at a time</h2>
          <p>A complete practice track — data structures, core CS subjects, contests, and interview prep, connected to the same guided roadmap you already learn from.</p>
          <div className="dsa-hero-actions">
            <button type="button" onClick={() => scrollTo("dsa-resources")}>Start Here</button>
            <button type="button" className="dsa-hero-cta" onClick={() => onNavigate("problems")}>
              <DsaBrandMark /> Start practicing
            </button>
          </div>

          <figure className="dsa-home-product-shot">
            <aside>
              <span className="dsa-home-brand"><DsaBrandMark /><strong>DSA</strong></span>
              <hr />
              {previewRail.map(([Icon, label], index) => (
                <b key={label} className={index === 2 ? "is-current" : ""}><Icon size={13} />{label}</b>
              ))}
            </aside>
            <div>
              <header><i /><i /><i /><span>Pattern-wise DSA</span></header>
              <div className="dsa-preview-stat">
                <div><small>Solved this week</small><strong>18</strong><em>+4 vs last week</em></div>
                <div><small>Current streak</small><strong>26 days</strong><em>Longest 41</em></div>
                <div><small>Sheet progress</small><strong>62%</strong><i><b style={{ width: "62%" }} /></i></div>
              </div>
              <ul className="dsa-preview-rows">
                {[["Two Sum", "Hashing", "Easy", true], ["Longest Substring", "Sliding Window", "Medium", true], ["Course Schedule", "Graphs", "Medium", false], ["Edit Distance", "Dynamic Programming", "Hard", false], ["Word Ladder", "BFS", "Hard", false], ["LRU Cache", "Design", "Medium", false]].map(([title, pattern, level, done]) => (
                  <li key={title}>
                    <span className={done ? "is-done" : ""}>{done && <Check size={9} />}</span>
                    <b>{title}</b>
                    <small>{pattern}</small>
                    <em className={`level-${level.toLowerCase()}`}>{level}</em>
                  </li>
                ))}
              </ul>
            </div>
          </figure>
        </section>

        <section className="dsa-home-section dsa-home-features">
          <div className="dsa-home-section-heading">
            <span>ONE LEARNING SYSTEM</span>
            <h2>Features That Power Your Learning</h2>
            <p>Everything you need in one place — from beginner-friendly courses to in-depth subject articles.</p>
          </div>
          <div className="dsa-feature-bento">
            <article className="personalized">
              <span><Compass size={18} /></span>
              <h3>Personalized Learning</h3>
              <p>Learn at your own pace with paths that adapt to your practice history.</p>
              <div><small>Beginner</small><i><b /></i><small>Expert</small></div>
            </article>
            <article className="hub">
              <span><Boxes size={18} /></span>
              <h3>All-in-One Learning Hub</h3>
              <p>Courses, articles, sheets, mock tests, and guided paths stay connected.</p>
              <ul>
                <li><Check size={12} /> Guided path</li>
                <li><Check size={12} /> Array quiz</li>
                <li><Check size={12} /> Core subjects</li>
                <li><Check size={12} /> Coding platform</li>
              </ul>
            </article>
            <article className="practice">
              <span><FileCode2 size={18} /></span>
              <h3>Practice &amp; Play</h3>
              <p>Write, test, and experiment with code instantly without leaving your dashboard.</p>
              <div className="dsa-practice-split">
                <pre><i>Source — main.cpp</i><code><em>#include</em> &lt;bits/stdc++.h&gt;{"\n"}<span>using namespace</span> std;{"\n"}{"\n"}<span>int</span> main() {"{"}{"\n"}    cout &lt;&lt; solve();{"\n"}{"}"}</code></pre>
                <div className="dsa-practice-output">
                  <i>Test results</i>
                  <ul>
                    <li className="is-pass"><Check size={10} /> Case 1 · 0 ms</li>
                    <li className="is-pass"><Check size={10} /> Case 2 · 1 ms</li>
                    <li className="is-pass"><Check size={10} /> Case 3 · 0 ms</li>
                  </ul>
                  <b>Accepted</b>
                  <small>Runtime beats 96% · Memory 12.4 MB</small>
                </div>
              </div>
            </article>
            <article className="prep">
              <span><Target size={18} /></span>
              <h3>Ace Preparation</h3>
              <p>Level up your problem-solving and get job-ready with hands-on prep.</p>
              <div className="dsa-prep-split">
                <button type="button" onClick={() => onNavigate("problems")}><Play size={13} /> Open problem bank</button>
                <ul>
                  {[[Target, "Mock tests"], [Trophy, "Contests"], [BriefcaseBusiness, "Company sets"], [Route, "Timed drills"]].map(([Icon, label]) => (
                    <li key={label}><Icon size={12} /> {label}</li>
                  ))}
                </ul>
              </div>
            </article>
          </div>
        </section>

        <section className="dsa-home-section dsa-home-community">
          <div className="dsa-home-section-heading">
            <span>COMMUNITY</span>
            <h2>Welcome to Our Coding Family</h2>
            <p>Join a supportive community of passionate coders, where learning, collaboration, and innovation come together.</p>
          </div>
          <div>
            {community.map(([value, unit, label]) => (
              <div key={label}><b>{value}<i>{unit}</i></b><small>{label}</small></div>
            ))}
          </div>
        </section>

        <section className="dsa-home-section dsa-home-resources" id="dsa-resources">
          <div className="dsa-home-section-heading row">
            <div>
              <span>START LEARNING</span>
              <h2>Start Here</h2>
              <p>Everything you need to begin — no subscription required.</p>
            </div>
            <button type="button" onClick={() => onNavigate("dashboard")}>Browse everything <ArrowRight size={13} /></button>
          </div>
          <div>
            {resources.map(([Icon, title, description, target]) => (
              <button type="button" key={title} onClick={() => onNavigate(target)}>
                <Icon size={16} />
                <span><b>{title}</b><small>{description}</small></span>
                <ArrowRight size={13} />
              </button>
            ))}
          </div>
        </section>

        <section className="dsa-home-section dsa-home-learn">
          <div className="dsa-home-section-heading">
            <span>A CLEARER PATH</span>
            <h2>A Simpler Way for You to Learn</h2>
            <p>Everything you need in one place — from beginner-friendly courses to in-depth subject articles.</p>
          </div>
          <div className="dsa-learn-tabs" role="tablist" aria-label="Learning formats">
            {learnTabs.map((tab) => (
              <button
                key={tab.id}
                type="button"
                role="tab"
                aria-selected={tab.id === activeLearnTab}
                className={tab.id === activeLearnTab ? "is-active" : ""}
                onClick={() => setActiveLearnTab(tab.id)}
              >
                {tab.label}
              </button>
            ))}
          </div>
          <div className="dsa-learn-cards">
            {learnTab.cards.map(([title, body], index) => (
              <article key={title}>
                <span className={`tone-${index}`}>{React.createElement(learnCardIcons[index], { size: 16 })}</span>
                <h3>{title}</h3>
                <p>{body}</p>
                <button type="button" onClick={() => onNavigate(learnTab.target)}>Learn more <ArrowRight size={12} /></button>
              </article>
            ))}
          </div>
        </section>

        <section className="dsa-home-section dsa-home-mentors">
          <div className="dsa-home-section-heading">
            <span>GUIDANCE</span>
            <h2>Meet Your Mentors</h2>
            <p>Guided by educators and working engineers who have mentored learners into their first and next roles.</p>
          </div>
          <div>
            {mentorNotes.map((note) => (
              <article key={note.accent}>
                <h3>{note.lead} <em>{note.accent}</em>{note.trail}</h3>
                <p>{note.body}</p>
                <small>{note.sign}</small>
              </article>
            ))}
          </div>
        </section>

        <section className="dsa-home-section dsa-home-stories">
          <div className="dsa-home-section-heading">
            <span>LEARNER STORIES</span>
            <h2>What Others Are Saying</h2>
            <p>Real stories from people who have experienced the journey firsthand — their wins and growth speak louder than we could.</p>
          </div>
          <div>
            {testimonials.map(([avatar, name, role, quote], index) => (
              <article key={name}>
                <header>
                  <i className={`tone-${index % 3}`}>{avatar}</i>
                  <span><b>{name}</b><small>{role}</small></span>
                </header>
                <p>“{quote}”</p>
              </article>
            ))}
          </div>
        </section>


        <section className="dsa-home-section dsa-home-faq">
          <div className="dsa-home-section-heading">
            <span>NEED HELP?</span>
            <h2>Frequently Asked Questions</h2>
            <p>Got questions? We have gathered the most common ones and answered them clearly so you can move forward.</p>
          </div>
          <div className="dsa-faq-body">
            <nav aria-label="Help topics">
              <b><LifeBuoy size={13} /> Get Help</b>
              {helpTopics.map((topic) => (
                <button
                  key={topic.id}
                  type="button"
                  className={topic.id === activeHelpTopic ? "is-active" : ""}
                  onClick={() => setActiveHelpTopic(topic.id)}
                >
                  <topic.icon size={13} />
                  <span>{topic.label}</span>
                  <ChevronRight size={13} />
                </button>
              ))}
              <button type="button" onClick={() => onNavigate("dashboard")}>
                <UserCog size={13} />
                <span>Account Management</span>
                <ChevronRight size={13} />
              </button>
            </nav>
            <div>
              {helpTopic.faqs.map(([question, answer]) => (
                <details key={question}>
                  <summary>{question}<ChevronDown size={15} /></summary>
                  <p>{answer}</p>
                </details>
              ))}
            </div>
          </div>
        </section>
      </main>

      <footer className="dsa-home-footer">
        <div>
          <span className="dsa-home-brand"><DsaBrandMark /><strong>DSA</strong></span>
          <p>Learn to code with structured courses, practice, and real-world projects.</p>
          <small>Copyright © 2026 DSA. All rights reserved.</small>
        </div>
        <div>
          <b>Pages</b>
          <button type="button" onClick={() => onNavigate("home")}>Home</button>
          <button type="button" onClick={() => onNavigate("dashboard")}>Learn</button>
          <button type="button" onClick={() => onNavigate("problems")}>Practice</button>
        </div>
        <div>
          <b>Explore</b>
          <button type="button" onClick={() => onNavigate("sheet")}>DSA Sheet</button>
          <button type="button" onClick={() => onNavigate("dashboard")}>Progress</button>
          <button type="button" onClick={() => scrollTo("dsa-resources")}>Start Here</button>
        </div>
        <div>
          <b>Socials</b>
          <span><Play size={12} /> YouTube</span>
          <span><Globe size={12} /> LinkedIn</span>
          <span><Camera size={12} /> Instagram</span>
          <span><Users size={12} /> Community</span>
        </div>
        <div>
          <b>Legal</b>
          <span>Privacy Policy</span>
          <span>Terms of Service</span>
          <span>Refund Policy</span>
        </div>
      </footer>
    </div>
  );
}
