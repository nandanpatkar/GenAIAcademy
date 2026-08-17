import React, { useState, useEffect } from "react";
import { X, RefreshCw, Bot, Send, Loader2, Flag, LogOut } from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { PrismLight as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";
import ExamPractice from "./quiz2/ExamPractice";
import { askQuizBot } from "../services/aiService";
import { useTheme } from '../contexts/ThemeContext';
import "../styles/QuizApp.css";

const LETTERS = 'ABCDEFGHIJ';

/**
 * Quiz 2.0 — an isolated test build of the Exam Bank, wired to /api/exam2
 * (api/_lib/examScraper2.js) instead of the shipped /api/exam so the new
 * headless-browser bot-challenge fallback can be validated end to end
 * (browse -> practice fetch -> take the quiz -> see real answers/
 * explanations) without touching the live Quiz section or its data.
 *
 * Deliberately narrower than QuizApp.jsx: no custom-quiz builder, no quiz
 * history/save-and-resume, and no Supabase writes (quiz_metrics,
 * user_quizzes, quiz_sessions) — this is a scraper test harness, not a
 * second production quiz product, so a session taken here never mixes
 * into a user's real quiz history. The AI tutor is kept since it's a
 * read-only call with no persistence.
 */
export default function QuizApp2({ onClose }) {
  const [questions, setQuestions] = useState([]);
  const [quizState, setQuizState] = useState("start"); // start, quiz, results, review
  const [currentIndex, setCurrentIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState({});
  const [checkedQuestions, setCheckedQuestions] = useState(new Set());
  const [correctCount, setCorrectCount] = useState(0);
  const [wrongCount, setWrongCount] = useState(0);
  const [reviewFilter, setReviewFilter] = useState("all");
  const { theme } = useTheme();
  const [flaggedQuestions, setFlaggedQuestions] = useState(new Set());
  const [isCertificationWorkspaceOpen, setIsCertificationWorkspaceOpen] = useState(false);

  const [quizConfig, setQuizConfig] = useState({
    name: "Practice Exam",
    timeLimit: 90,
    marksCorrect: 1,
    marksWrong: 0,
    sections: [],
    useDefault: true,
    enableAiTutor: true,
  });

  const [timeLeft, setTimeLeft] = useState(0);

  const [aiChatOpen, setAiChatOpen] = useState(false);
  const [aiMessages, setAiMessages] = useState([]);
  const [aiInput, setAiInput] = useState("");
  const [aiLoading, setAiLoading] = useState(false);

  useEffect(() => {
    let timer;
    if (quizState === "quiz" && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            clearInterval(timer);
            finishTest();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [quizState, timeLeft]);

  useEffect(() => {
    setAiMessages([]);
    setAiChatOpen(false);
  }, [currentIndex]);

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  const handleAiSubmit = async () => {
    if (!aiInput.trim() || aiLoading) return;
    const query = aiInput;
    setAiInput("");
    const newMsg = { role: 'user', text: query };
    setAiMessages(prev => [...prev, newMsg]);
    setAiLoading(true);

    try {
      const q = questions[currentIndex];
      const context = {
        q: q.q || q.question,
        options: q.options,
        answer: (q.answer || []).map(idx => q.options[idx]),
        explanation: q.explanation
      };

      const response = await askQuizBot(context, aiMessages, query);
      const botText = typeof response === 'string' ? response : (response?.answer || response?.content || JSON.stringify(response));

      setAiMessages(prev => [...prev, { role: 'model', text: botText }]);
    } catch (e) {
      setAiMessages(prev => [...prev, { role: 'model', text: "Sorry, I encountered an error connecting to the AI." }]);
    } finally {
      setAiLoading(false);
    }
  };

  const mapExamDifficulty = (d) => {
    const s = String(d || "").toLowerCase();
    if (s === "easy") return "E";
    if (s === "hard") return "I";
    return "M";
  };

  // Adapts scraped exam-bank questions {question, options, correctAnswer, ...}
  // into the internal quiz format {q, options, answer:[idx], ...}, same
  // shape QuizApp.jsx uses, so this reuses the identical quiz-taking UI.
  const startExamQuiz = (examName, rawQuestions, config) => {
    const transformed = rawQuestions.map((q, i) => ({
      n: i + 1,
      section: q.category || examName,
      difficulty: mapExamDifficulty(q.difficulty),
      multi: false,
      q: q.question,
      options: q.options || [],
      answer: [typeof q.correctAnswer === "number" ? q.correctAnswer : 0],
      explanation: q.explanation || "",
    }));

    setQuestions(transformed);
    setQuizConfig({
      name: examName,
      timeLimit: config.timeLimit,
      marksCorrect: config.marksCorrect,
      marksWrong: config.marksWrong,
      sections: [],
      useDefault: false,
      enableAiTutor: config.enableAiTutor,
    });
    setQuizState("quiz");
    setCurrentIndex(0);
    setUserAnswers({});
    setCheckedQuestions(new Set());
    setFlaggedQuestions(new Set());
    setCorrectCount(0);
    setWrongCount(0);
    setTimeLeft(config.timeLimit * 60);
  };

  const toggleOption = (idx) => {
    const q = questions[currentIndex];
    const currentAns = userAnswers[currentIndex] || [];
    let newAns = [...currentAns];

    if (q.multi) {
      const pos = newAns.indexOf(idx);
      if (pos >= 0) {
        newAns.splice(pos, 1);
      } else {
        if (newAns.length < (q.multiCount || 1)) {
          newAns.push(idx);
        } else {
          newAns.shift();
          newAns.push(idx);
        }
      }
    } else {
      newAns = [idx];
    }

    setUserAnswers(prev => ({ ...prev, [currentIndex]: newAns }));
  };

  const arraysEqual = (a, b) => {
    if (a.length !== b.length) return false;
    const sortedA = [...a].sort();
    const sortedB = [...b].sort();
    for (let i = 0; i < sortedA.length; i++) {
      if (sortedA[i] !== sortedB[i]) return false;
    }
    return true;
  };

  const checkAnswer = () => {
    const ans = userAnswers[currentIndex] || [];
    if (ans.length === 0) return;
    if (checkedQuestions.has(currentIndex)) return;

    const q = questions[currentIndex];
    const isCorrect = arraysEqual(ans, q.answer || []);

    setCheckedQuestions(prev => new Set(prev).add(currentIndex));
    if (isCorrect) setCorrectCount(c => c + 1);
    else setWrongCount(c => c + 1);
  };

  const nextQuestion = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(c => c + 1);
    } else {
      finishTest();
    }
  };

  const prevQuestion = () => {
    if (currentIndex > 0) setCurrentIndex(c => c - 1);
  };

  const finishTest = () => {
    let newCorrect = correctCount;
    let newWrong = wrongCount;
    const newChecked = new Set(checkedQuestions);

    questions.forEach((q, i) => {
      const ans = userAnswers[i] || [];
      if (!newChecked.has(i) && ans.length > 0) {
        newChecked.add(i);
        const isCorrect = arraysEqual(ans, q.answer || []);
        if (isCorrect) newCorrect++;
        else newWrong++;
      }
    });

    setCheckedQuestions(newChecked);
    setCorrectCount(newCorrect);
    setWrongCount(newWrong);
    setQuizState("results");
  };

  const renderFormattedText = (text) => {
    if (!text) return "";

    const parts = text.split("```");
    if (parts.length === 1) {
      let formatted = text.replace(/\n/g, '<br/>');
      return <div dangerouslySetInnerHTML={{ __html: formatted }} />;
    }

    return (
      <div className="quiz-formatted-text">
        {parts.map((part, index) => {
          if (index % 2 === 1) {
            const codeContent = part.replace(/^[a-z]*\n/, '');
            return (
              <pre key={index} className="quiz-code-block" style={{ margin: '12px 0', textAlign: 'left', whiteSpace: 'pre-wrap' }}>
                <code>{codeContent}</code>
              </pre>
            );
          } else {
            let formatted = part.replace(/\n/g, '<br/>');
            return <div key={index} dangerouslySetInnerHTML={{ __html: formatted }} style={{ display: 'inline' }} />;
          }
        })}
      </div>
    );
  };

  return (
    <div className={`quiz-container ${quizState === "start" && isCertificationWorkspaceOpen ? "quiz-container--claude" : ""}`}>
      {onClose && (
        <button onClick={onClose} style={{ position: 'absolute', top: 20, right: 20, background: 'transparent', border: 'none', color: 'var(--text2)', cursor: 'pointer' }}>
          <X size={24} />
        </button>
      )}

      {quizState === "start" && (
        <div className={`quiz-start-screen ${isCertificationWorkspaceOpen ? "quiz-start-screen--claude" : ""}`} style={{ maxWidth: 1200, margin: '0 auto' }}>
          <div className="quiz-topbar">
            <div className="quiz-topbar-brand"><span className="quiz-brand-mark"><TargetIcon size={18} /></span><span><strong>Quiz lab 2.0</strong><small>Test build · new scraper</small></span></div>
            <div className="quiz-topbar-status"><span className="quiz-status-pulse" />Testing /api/exam2</div>
          </div>

          <div className="quiz-config-panel" style={{ textAlign: 'left', background: 'var(--bg-card)', padding: '12px 16px', borderRadius: 'var(--radius)', border: '1px solid var(--border)', marginBottom: 20, fontSize: 13, color: 'var(--text-muted)' }}>
            This is an isolated test build of the Exam Bank running against the new bot-challenge-aware scraper (<code>/api/exam2</code>). It uses its own Supabase cache and never writes to your real quiz history — the shipped Quiz section is unaffected.
          </div>

          <ExamPractice onStartExam={startExamQuiz} theme={theme} onWorkspaceChange={setIsCertificationWorkspaceOpen} />
        </div>
      )}

      {quizState === "quiz" && (
        <>
          <div className="quiz-live-header">
            <div className="quiz-live-heading">
              <div className="quiz-live-kicker"><span className="quiz-status-pulse" /> LIVE PRACTICE <span>•</span> {questions.length} QUESTIONS</div>
              <h1>{quizConfig.name}</h1>
              <p>Stay focused, trust your reasoning, and use the flag when you want a second pass.</p>
            </div>
            <div className="quiz-live-actions">
              <button className="quiz-live-action finish" onClick={finishTest} title="Submit quiz now"><LogOut size={16} /> <span>Finish Early</span></button>
              <div className={`quiz-live-timer ${timeLeft < 300 ? 'critical' : ''}`}><span>TIME LEFT</span><strong>◷ {formatTime(timeLeft)}</strong></div>
            </div>
          </div>

          <div className="quiz-live-overview">
            <div className="quiz-stats-bar">
              <div className="quiz-stat-card">
                <div className="quiz-stat-value">{currentIndex + 1}<span>/{questions.length}</span></div>
                <div className="quiz-stat-label">Current question</div>
              </div>
              <div className="quiz-stat-card">
                <div className="quiz-stat-value success">{correctCount}</div>
                <div className="quiz-stat-label">Correct</div>
              </div>
              <div className="quiz-stat-card">
                <div className="quiz-stat-value danger">{wrongCount}</div>
                <div className="quiz-stat-label">Incorrect</div>
              </div>
            </div>

            <div className="quiz-question-map-panel">
              <div className="quiz-map-heading"><div><span>Question navigator</span><small>Jump to any question</small></div><div className="quiz-map-legend"><span><i className="is-current" /> Current</span><span><i className="is-answered" /> Answered</span><span><i className="is-flagged" /> Flagged</span></div></div>
              <div className="quiz-question-map">
                {questions.map((_, i) => {
                  const answered = (userAnswers[i] || []).length > 0;
                  const checked = checkedQuestions.has(i);
                  const correct = checked && arraysEqual(userAnswers[i], questions[i].answer || []);

                  let c = "quiz-qmap-dot";
                  if (i === currentIndex) c += " current";
                  else if (checked && correct) c += " correct-dot";
                  else if (checked && !correct) c += " incorrect-dot";
                  else if (answered) c += " answered";
                  if (flaggedQuestions.has(i)) c += " flagged-dot";

                  return (
                    <button key={i} className={c} onClick={() => setCurrentIndex(i)} aria-label={`Go to question ${i + 1}`}>
                      {i + 1}
                    </button>
                  )
                })}
              </div>
            </div>
          </div>

          <div className="quiz-progress-container">
            <div className="quiz-progress-info">
              <span>Question {currentIndex + 1} of {questions.length}</span>
              <span>{Math.round(((currentIndex + 1) / questions.length) * 100)}%</span>
            </div>
            <div className="quiz-progress-bar">
              <div className="quiz-progress-fill" style={{ width: `${((currentIndex + 1) / questions.length) * 100}%` }} />
            </div>
          </div>

          {(() => {
            const q = questions[currentIndex];
            const isChecked = checkedQuestions.has(currentIndex);
            const currentAns = userAnswers[currentIndex] || [];
            const diffLabel = q.difficulty === 'E' ? 'Easy' : q.difficulty === 'I' ? 'Intense' : 'Medium';

            return (
              <div className="quiz-question-card quiz-live-question-card">
                <div className="quiz-question-meta">
                  <span className="quiz-meta-tag number">Q{currentIndex + 1}</span>
                  {q.difficulty && <span className={`quiz-meta-tag difficulty-${q.difficulty}`}>{diffLabel}</span>}
                  {q.section && <span className="quiz-meta-tag section">{q.section}</span>}
                  {q.multi && <span className="quiz-meta-tag multi">Select {q.multiCount || 2}</span>}
                </div>

                <div className="quiz-question-text quiz-question-prompt">
                  {renderFormattedText(q.q || q.question)}
                </div>

                <div className="quiz-options-list">
                  {(q.options || []).map((opt, i) => {
                    const selected = currentAns.includes(i);
                    const correct = q.answer?.includes(i);
                    let className = "quiz-option-btn";
                    if (selected) className += " selected";
                    if (isChecked) {
                      className += " disabled";
                      if (correct) className += " correct";
                      if (selected && !correct) className += " incorrect";
                    }

                    return (
                      <button
                        key={i}
                        className={className}
                        onClick={() => !isChecked && toggleOption(i)}
                        disabled={isChecked}
                      >
                        <span className="quiz-option-letter">{LETTERS[i]}</span>
                        <span className="quiz-option-text">{opt}</span>
                      </button>
                    )
                  })}
                </div>

                {isChecked && q.explanation && (
                  <div className="quiz-explanation-panel">
                    <h4>💡 Explanation</h4>
                    <p>{q.explanation}</p>
                  </div>
                )}

                <div className="quiz-nav-buttons quiz-question-actions">
                  <div className="quiz-question-secondary-actions">
                    <button className="quiz-btn quiz-btn-secondary" onClick={prevQuestion} disabled={currentIndex === 0}>
                      ← Previous
                    </button>
                    <button
                      className={`quiz-btn quiz-btn-secondary ${flaggedQuestions.has(currentIndex) ? 'flagged' : ''}`}
                      onClick={() => {
                        setFlaggedQuestions(prev => {
                          const newSet = new Set(prev);
                          if (newSet.has(currentIndex)) newSet.delete(currentIndex);
                          else newSet.add(currentIndex);
                          return newSet;
                        });
                      }}
                      style={{ color: flaggedQuestions.has(currentIndex) ? 'var(--warning)' : '' }}
                    >
                      <Flag size={16} fill={flaggedQuestions.has(currentIndex) ? "currentColor" : "none"} style={{ marginRight: 6 }} />
                      {flaggedQuestions.has(currentIndex) ? 'Flagged' : 'Flag for Review'}
                    </button>
                  </div>
                  <div className="quiz-question-primary-actions">
                    {isChecked && quizConfig.enableAiTutor && (
                      <button className="quiz-btn" style={{ background: 'var(--bg-secondary)', color: 'var(--text-primary)', border: '1px solid var(--border)' }} onClick={() => setAiChatOpen(!aiChatOpen)}>
                        <Bot size={16} style={{ marginRight: 6 }} /> Ask AI Tutor
                      </button>
                    )}
                    {!isChecked && (
                      <button className="quiz-btn quiz-btn-success" onClick={checkAnswer} disabled={currentAns.length === 0}>
                        Check Answer
                      </button>
                    )}
                    <button className="quiz-btn quiz-btn-primary" onClick={nextQuestion}>
                      {currentIndex === questions.length - 1 ? 'Finish →' : 'Next →'}
                    </button>
                  </div>
                </div>

                {aiChatOpen && isChecked && (
                  <div className="quiz-ai-chat-panel">
                    <div className="quiz-ai-header">
                      <h4><Bot size={18} /> AI Tutor</h4>
                      <button onClick={() => setAiChatOpen(false)}><X size={16} /></button>
                    </div>
                    <div className="quiz-ai-messages">
                      {aiMessages.length === 0 && (
                        <div className="quiz-ai-empty">Ask me why an option is correct or incorrect!</div>
                      )}
                      {aiMessages.map((m, idx) => (
                        <div key={idx} className={`quiz-ai-msg ${m.role}`}>
                          {m.role === 'user' ? (
                            m.text
                          ) : (
                            <div className="quiz-ai-markdown">
                              <ReactMarkdown
                                remarkPlugins={[remarkGfm]}
                                components={{
                                  code({ node, inline, className, children, ...props }) {
                                    const match = /language-(\w+)/.exec(className || '');
                                    return !inline && match ? (
                                      <SyntaxHighlighter
                                        style={vscDarkPlus}
                                        language={match[1]}
                                        PreTag="div"
                                        customStyle={{ margin: '8px 0', borderRadius: 6, fontSize: 12 }}
                                        {...props}
                                      >
                                        {String(children).replace(/\n$/, '')}
                                      </SyntaxHighlighter>
                                    ) : (
                                      <code className={className} style={{ background: 'rgba(0,255,136,0.1)', padding: '2px 6px', borderRadius: 4, color: 'var(--neon)', fontSize: '0.9em' }} {...props}>
                                        {children}
                                      </code>
                                    );
                                  },
                                  a({ node, children, ...props }) {
                                    return <a {...props} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--neon)', textDecoration: 'underline' }}>{children}</a>;
                                  }
                                }}
                              >
                                {m.text}
                              </ReactMarkdown>
                            </div>
                          )}
                        </div>
                      ))}
                      {aiLoading && (
                        <div className="quiz-ai-msg model loading">
                          <Loader2 size={16} className="spin" /> Thinking...
                        </div>
                      )}
                    </div>
                    <div className="quiz-ai-input-area">
                      <input
                        type="text"
                        placeholder="Ask about this question..."
                        value={aiInput}
                        onChange={(e) => setAiInput(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleAiSubmit()}
                      />
                      <button onClick={handleAiSubmit} disabled={!aiInput.trim() || aiLoading}>
                        <Send size={16} />
                      </button>
                    </div>
                  </div>
                )}
              </div>
            );
          })()}
        </>
      )}

      {(quizState === "results" || quizState === "review") && (() => {
        const totalMarks = (correctCount * quizConfig.marksCorrect) - (wrongCount * quizConfig.marksWrong);
        const maxPossibleMarks = questions.length * quizConfig.marksCorrect;
        const scorePercentage = Math.max(0, Math.round((totalMarks / Math.max(1, maxPossibleMarks)) * 100));

        return (
          <div className="quiz-results-screen">
            <div className="quiz-score-ring">
              <svg viewBox="0 0 200 200" width="200" height="200">
                <circle className="bg-ring" cx="100" cy="100" r="85" fill="none" strokeWidth="12" />
                <circle
                  className="fg-ring"
                  cx="100" cy="100" r="85"
                  fill="none" strokeWidth="12"
                  strokeDasharray="534"
                  strokeLinecap="round"
                  id="score-ring-fg"
                  style={{
                    stroke: scorePercentage >= 70 ? 'var(--success)' : 'var(--danger)',
                    strokeDashoffset: 534 - ((scorePercentage / 100) * 534)
                  }}
                />
              </svg>
              <div className="quiz-score-text">
                <div className="percentage" style={{ color: scorePercentage >= 70 ? 'var(--success)' : 'var(--danger)' }}>
                  {scorePercentage}%
                </div>
                <div className="label">SCORE</div>
              </div>
            </div>

            <div className={`quiz-grade-badge ${ scorePercentage >= 70 ? 'quiz-grade-pass' : 'quiz-grade-fail' }`}>
               {scorePercentage >= 70 ? '🎉 PASSED' : '📚 NEEDS MORE PRACTICE'}
            </div>

            <div className="quiz-result-summary">
              <div className="quiz-result-card">
                <div className="value" style={{ color: 'var(--success)' }}>{totalMarks}</div>
                <div className="label">Total Marks</div>
              </div>
              <div className="quiz-result-card">
                <div className="value" style={{ color: 'var(--success)' }}>{correctCount}</div>
                <div className="label">Correct</div>
              </div>
              <div className="quiz-result-card">
                <div className="value" style={{ color: 'var(--danger)' }}>{wrongCount}</div>
                <div className="label">Incorrect</div>
              </div>
            </div>

          <div className="quiz-nav-buttons" style={{ justifyContent: 'center', gap: 20 }}>
            <button className="quiz-btn quiz-btn-secondary" onClick={() => setQuizState("review")}>
              Review Answers
            </button>
            <button className="quiz-btn quiz-btn-primary" onClick={() => setQuizState("start")}>
              <RefreshCw size={16} style={{ marginRight: 8 }} /> Retake Test
            </button>
          </div>

          {quizState === "review" && (
            <div className="quiz-review-section">
              <div style={{ display: 'flex', gap: 10, justifyContent: 'center', marginBottom: 20 }}>
                {['all', 'correct', 'incorrect', 'skipped'].map(f => (
                  <button
                    key={f}
                    className="quiz-btn"
                    style={{ background: reviewFilter === f ? 'var(--bg-secondary)' : 'var(--bg-card)', color: 'var(--text-primary)', border: '1px solid var(--border)' }}
                    onClick={() => setReviewFilter(f)}
                  >
                    {f.charAt(0).toUpperCase() + f.slice(1)}
                  </button>
                ))}
              </div>

              {questions.map((q, i) => {
                const ans = userAnswers[i] || [];
                const checked = checkedQuestions.has(i);
                const isCorrect = checked && arraysEqual(ans, q.answer || []);
                const isSkipped = !checked;

                if (reviewFilter === 'correct' && !isCorrect) return null;
                if (reviewFilter === 'incorrect' && (isCorrect || isSkipped)) return null;
                if (reviewFilter === 'skipped' && !isSkipped) return null;

                const status = isSkipped ? 'skipped' : (isCorrect ? 'correct' : 'incorrect');
                const yourAnsStr = ans.map(idx => `${LETTERS[idx]}: ${q.options[idx]}`).join(', ') || 'Not answered';
                const correctAnsStr = (q.answer || []).map(idx => `${LETTERS[idx]}: ${q.options[idx]}`).join(', ');

                return (
                  <div key={i} className={`quiz-review-card review-${status}`}>
                    <div className="quiz-review-question"><strong>Q{i+1}.</strong> {q.q || q.question}</div>
                    <div className="quiz-review-answer">
                      <div>Your answer: <span className={isCorrect ? 'correct-answer' : 'your-answer'}>{yourAnsStr}</span></div>
                      <div>Correct answer: <span className="correct-answer">{correctAnsStr}</span></div>
                      {q.explanation && <div style={{ marginTop: 8, color: 'var(--text-muted)', fontSize: 12 }}>💡 {q.explanation}</div>}
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>
        );
      })()}
    </div>
  );
}

function TargetIcon({ size }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10"></circle>
      <circle cx="12" cy="12" r="6"></circle>
      <circle cx="12" cy="12" r="2"></circle>
    </svg>
  );
}
