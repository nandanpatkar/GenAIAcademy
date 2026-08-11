import React, { useState, useEffect, useRef } from "react";
import { Upload, X, Play, RefreshCw, CheckCircle, FileJson, Bot, MessageSquare, Send, Loader2, Settings2, Settings, Flag, Save, LogOut } from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { PrismLight as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";
import { defaultQuestions } from "../data/defaultQuizQuestions";
import ExamPractice from "./quiz/ExamPractice";
import { askQuizBot } from "../services/aiService";
import { supabase } from '../config/supabaseClient';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import ApiBeamConnectionNotice from './ApiBeamConnectionNotice';
import "../styles/QuizApp.css";

const LETTERS = 'ABCDEFGHIJ';

export default function QuizApp({ onClose }) {
  const [questions, setQuestions] = useState([]);
  const [quizState, setQuizState] = useState("start"); // start, quiz, results, review
  const [currentIndex, setCurrentIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState({});
  const [checkedQuestions, setCheckedQuestions] = useState(new Set());
  const [correctCount, setCorrectCount] = useState(0);
  const [wrongCount, setWrongCount] = useState(0);
  const [reviewFilter, setReviewFilter] = useState("all");
  const { user } = useAuth();
  const { theme } = useTheme();
  const [flaggedQuestions, setFlaggedQuestions] = useState(new Set());
  const [quizHistory, setQuizHistory] = useState([]);
  const [activeTab, setActiveTab] = useState("examBank"); // examBank, setup, history
  const [isCertificationWorkspaceOpen, setIsCertificationWorkspaceOpen] = useState(false);
  const [savedQuizzes, setSavedQuizzes] = useState([]);
  const [pausedSessions, setPausedSessions] = useState([]);
  const [activeSessionId, setActiveSessionId] = useState(null);

  const [quizConfig, setQuizConfig] = useState({
    name: "Practice Exam",
    timeLimit: 90,
    marksCorrect: 1,
    marksWrong: 0,
    sections: [],
    useDefault: true,
    enableAiTutor: true
  });
  
  const [timeLeft, setTimeLeft] = useState(0);
  
  const [aiChatOpen, setAiChatOpen] = useState(false);
  const [aiMessages, setAiMessages] = useState([]);
  const [aiInput, setAiInput] = useState("");
  const [aiLoading, setAiLoading] = useState(false);

  const uniqueSections = Array.from(new Set(defaultQuestions.map(q => q.section).filter(Boolean)));

  // Load from local storage if exists (optional feature)
  useEffect(() => {
    const saved = localStorage.getItem("quiz_data_temp");
    if (saved) {
      try {
        setQuestions(JSON.parse(saved));
        setQuizConfig(prev => ({ ...prev, useDefault: false }));
      } catch (e) {
        console.error("Failed to parse saved quiz data", e);
      }
    } else {
      setQuestions([...defaultQuestions]);
    }
  }, []);

  useEffect(() => {
    if (!user) return;
    const fetchSupabaseData = async () => {
      // Fetch metrics
      const { data: metrics } = await supabase.from('quiz_metrics').select('*').eq('user_id', user.id).order('created_at', { ascending: false });
      if (metrics) setQuizHistory(metrics);

      // Fetch saved quizzes
      const { data: quizzes } = await supabase.from('user_quizzes').select('id, title, created_at').eq('user_id', user.id).order('created_at', { ascending: false });
      if (quizzes) setSavedQuizzes(quizzes);

      // Fetch paused sessions
      const { data: sessions } = await supabase.from('quiz_sessions').select('id, quiz_name, updated_at, progress_state').eq('user_id', user.id).order('updated_at', { ascending: false });
      if (sessions) setPausedSessions(sessions);
    };
    fetchSupabaseData();
  }, [user]);

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
      // Determine if response is an object (due to standard helper) or plain text
      const botText = typeof response === 'string' ? response : (response?.answer || response?.content || JSON.stringify(response));
      
      setAiMessages(prev => [...prev, { role: 'model', text: botText }]);
    } catch (e) {
      setAiMessages(prev => [...prev, { role: 'model', text: "Sorry, I encountered an error connecting to the AI." }]);
    } finally {
      setAiLoading(false);
    }
  };

  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (event) => {
      try {
        const parsed = JSON.parse(event.target.result);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setQuestions(parsed);
          localStorage.setItem("quiz_data_temp", JSON.stringify(parsed));
          
          if (user) {
            const { data, error } = await supabase.from('user_quizzes').insert({
              user_id: user.id,
              title: file.name.replace('.json', ''),
              questions: parsed
            }).select();
            if (data) {
              setSavedQuizzes(prev => [data[0], ...prev]);
            }
          }
        } else {
          alert("Invalid JSON format. Expected an array of questions.");
        }
      } catch (err) {
        alert("Failed to parse JSON file.");
      }
    };
    reader.readAsText(file);
  };

  const downloadSampleJson = () => {
    const sample = [
      {
        q: "What does HTML stand for?",
        options: [
          "Hyper Text Preprocessor",
          "Hyper Text Markup Language",
          "Hyper Text Multiple Language",
          "Hyper Tool Multi Language"
        ],
        answer: [1],
        explanation: "HTML stands for Hyper Text Markup Language.",
        difficulty: "E",
        section: "Web Development"
      }
    ];
    const blob = new Blob([JSON.stringify(sample, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = "sample_quiz_format.json";
    a.click();
    URL.revokeObjectURL(url);
  };

  const startQuiz = () => {
    let activeQuestions = quizConfig.useDefault ? [...defaultQuestions] : [...questions];
    
    if (quizConfig.sections.length > 0) {
      activeQuestions = activeQuestions.filter(q => quizConfig.sections.includes(q.section));
    }
    
    if (activeQuestions.length === 0) {
      alert("No questions match your criteria.");
      return;
    }
    
    setQuestions(activeQuestions);
    setQuizState("quiz");
    setCurrentIndex(0);
    setUserAnswers({});
    setCheckedQuestions(new Set());
    setFlaggedQuestions(new Set());
    setCorrectCount(0);
    setWrongCount(0);
    setTimeLeft(quizConfig.timeLimit * 60);
  };

  const mapExamDifficulty = (d) => {
    const s = String(d || "").toLowerCase();
    if (s === "easy") return "E";
    if (s === "hard") return "I";
    return "M";
  };

  // Adapts scraped exam-bank questions {question, options, correctAnswer, ...}
  // into the internal quiz format {q, options, answer:[idx], ...} so the
  // exam bank can reuse the exact same quiz-taking UI as custom quizzes.
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

  const restartTest = () => {
    setQuizState("start");
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

  const resumeSession = (session) => {
    const state = session.progress_state;
    setQuestions(state.questions);
    setQuizConfig(state.quizConfig);
    setCurrentIndex(state.currentIndex);
    setUserAnswers(state.userAnswers);
    setCheckedQuestions(new Set(state.checkedQuestions));
    setFlaggedQuestions(new Set(state.flaggedQuestions));
    setTimeLeft(state.timeLeft);
    setActiveSessionId(session.id);
    
    let c = 0; let w = 0;
    state.checkedQuestions.forEach(idx => {
       const isCorrect = arraysEqual(state.userAnswers[idx] || [], state.questions[idx].answer || []);
       if (isCorrect) c++; else w++;
    });
    setCorrectCount(c);
    setWrongCount(w);

    setQuizState("quiz");
  };

  const saveAndExit = async () => {
    if (!user) {
      alert("You must be logged in to save your progress to the cloud.");
      return;
    }

    const progressState = {
      currentIndex,
      userAnswers,
      checkedQuestions: Array.from(checkedQuestions),
      flaggedQuestions: Array.from(flaggedQuestions),
      timeLeft,
      quizConfig,
      questions
    };

    if (activeSessionId) {
      const { data } = await supabase.from('quiz_sessions').update({
        progress_state: progressState,
        updated_at: new Date().toISOString()
      }).eq('id', activeSessionId).select();
      
      if (data) setPausedSessions(prev => prev.map(s => s.id === activeSessionId ? data[0] : s));
    } else {
      const { data } = await supabase.from('quiz_sessions').insert({
        user_id: user.id,
        quiz_name: quizConfig.name || "Practice Exam",
        progress_state: progressState
      }).select();
      
      if (data) setPausedSessions(prev => [data[0], ...prev]);
    }
    setQuizState("start");
  };

  const finishTest = async () => {
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

    // Save to history
    const totalQ = questions.length;
    if (totalQ > 0 && user) {
      const percentage = Math.round((newCorrect / totalQ) * 100);
      
      const { data } = await supabase.from('quiz_metrics').insert({
        user_id: user.id,
        quiz_name: quizConfig.name || "Practice Exam",
        score_percentage: percentage,
        correct_count: newCorrect,
        wrong_count: newWrong,
        total_questions: totalQ
      }).select();
      
      if (data) setQuizHistory(prev => [data[0], ...prev]);

      if (activeSessionId) {
        await supabase.from('quiz_sessions').delete().eq('id', activeSessionId);
        setPausedSessions(prev => prev.filter(s => s.id !== activeSessionId));
        setActiveSessionId(null);
      }
    }

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
    <div className={`quiz-container ${quizState === "start" && activeTab === "examBank" && isCertificationWorkspaceOpen ? "quiz-container--claude" : ""}`}>
      {onClose && (
        <button onClick={onClose} style={{ position: 'absolute', top: 20, right: 20, background: 'transparent', border: 'none', color: 'var(--text2)', cursor: 'pointer' }}>
          <X size={24} />
        </button>
      )}

      {quizState === "start" && (
        <div className={`quiz-start-screen ${activeTab === "examBank" && isCertificationWorkspaceOpen ? "quiz-start-screen--claude" : ""}`} style={{ maxWidth: 1200, margin: '0 auto' }}>
          <div className="quiz-topbar">
            <div className="quiz-topbar-brand"><span className="quiz-brand-mark"><TargetIcon size={18} /></span><span><strong>Quiz lab</strong><small>GenAI Academy</small></span></div>
            <div className="quiz-topbar-tabs">
            <button 
              className={`quiz-tab ${activeTab === "examBank" ? 'active' : ''}`}
              onClick={() => setActiveTab("examBank")}
            >
              <span>01</span> Exam bank
            </button>
            <button 
              className={`quiz-tab ${activeTab === "setup" ? 'active' : ''}`}
              onClick={() => { setIsCertificationWorkspaceOpen(false); setActiveTab("setup"); }}
            >
              <span>02</span> Build a quiz
            </button>
            <button 
              className={`quiz-tab ${activeTab === "history" ? 'active' : ''}`}
              onClick={() => { setIsCertificationWorkspaceOpen(false); setActiveTab("history"); }}
            >
              <span>03</span> My progress
            </button>
            </div>
            <div className="quiz-topbar-status"><span className="quiz-status-pulse" />Practice mode</div>
          </div>

          <ApiBeamConnectionNotice compact />

          {activeTab === "examBank" && <ExamPractice onStartExam={startExamQuiz} theme={theme} onWorkspaceChange={setIsCertificationWorkspaceOpen} />}

          {activeTab !== "examBank" && (activeTab === "setup" ? (
            <>
              {pausedSessions.length > 0 && (
                <div style={{ marginBottom: 24, padding: 20, background: 'var(--bg-card)', borderRadius: 12, border: '1px solid var(--border)' }}>
                  <h3 style={{ margin: '0 0 16px', color: 'var(--accent)', display: 'flex', alignItems: 'center', gap: 8 }}>
                    <RefreshCw size={18} /> Resume Paused Session
                  </h3>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                    {pausedSessions.map(ps => {
                      const st = ps.progress_state;
                      return (
                        <div key={ps.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: 16, background: 'var(--bg-secondary)', borderRadius: 8, border: '1px solid var(--border)' }}>
                          <div>
                            <div style={{ fontWeight: 600, fontSize: 16 }}>{ps.quiz_name}</div>
                            <div style={{ fontSize: 13, color: 'var(--text-muted)', marginTop: 4 }}>
                              Question {st.currentIndex + 1} of {st.questions?.length || 0} • {formatTime(st.timeLeft)} left
                            </div>
                          </div>
                          <button className="quiz-btn quiz-btn-primary" onClick={() => resumeSession(ps)}>
                            Resume <Play size={16} style={{ marginLeft: 6 }} />
                          </button>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              <div className="quiz-start-icon"><TargetIcon size={48} /></div>
              <h2>Configure Your Quiz</h2>
              <p>Customize the settings below or start immediately with the defaults.</p>
          
          <div className="quiz-config-panel" style={{ textAlign: 'left', background: 'var(--bg-card)', padding: 24, borderRadius: 'var(--radius)', border: '1px solid var(--border)', marginBottom: 24 }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
              
              <div>
                <label style={{ display: 'block', marginBottom: 8, fontSize: 13, color: 'var(--text-muted)' }}>QUIZ NAME</label>
                <input 
                  type="text" 
                  value={quizConfig.name}
                  onChange={(e) => setQuizConfig({...quizConfig, name: e.target.value})}
                  style={{ width: '100%', padding: '10px 14px', background: 'var(--bg-secondary)', border: '1px solid var(--border)', borderRadius: 8, color: 'var(--text-primary)' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: 8, fontSize: 13, color: 'var(--text-muted)' }}>TIME LIMIT (MINUTES)</label>
                <input 
                  type="number" 
                  value={quizConfig.timeLimit}
                  onChange={(e) => setQuizConfig({...quizConfig, timeLimit: Number(e.target.value)})}
                  style={{ width: '100%', padding: '10px 14px', background: 'var(--bg-secondary)', border: '1px solid var(--border)', borderRadius: 8, color: 'var(--text-primary)' }}
                />
              </div>
              
              <div>
                <label style={{ display: 'block', marginBottom: 8, fontSize: 13, color: 'var(--text-muted)' }}>MARKS PER CORRECT</label>
                <input 
                  type="number" 
                  value={quizConfig.marksCorrect}
                  onChange={(e) => setQuizConfig({...quizConfig, marksCorrect: Number(e.target.value)})}
                  style={{ width: '100%', padding: '10px 14px', background: 'var(--bg-secondary)', border: '1px solid var(--border)', borderRadius: 8, color: 'var(--text-primary)' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: 8, fontSize: 13, color: 'var(--text-muted)' }}>PENALTY PER WRONG</label>
                <input 
                  type="number" 
                  value={quizConfig.marksWrong}
                  onChange={(e) => setQuizConfig({...quizConfig, marksWrong: Number(e.target.value)})}
                  style={{ width: '100%', padding: '10px 14px', background: 'var(--bg-secondary)', border: '1px solid var(--border)', borderRadius: 8, color: 'var(--text-primary)' }}
                />
              </div>
            </div>

            <div style={{ marginTop: 24, padding: 16, background: 'var(--bg-secondary)', borderRadius: 8, border: '1px solid var(--border)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <input 
                  type="checkbox" 
                  id="enableAiTutor" 
                  checked={quizConfig.enableAiTutor}
                  onChange={(e) => setQuizConfig({...quizConfig, enableAiTutor: e.target.checked})}
                  style={{ width: 18, height: 18 }}
                />
                <label htmlFor="enableAiTutor" style={{ fontSize: 15, fontWeight: 500, cursor: 'pointer' }}>Enable AI Tutor Assistance</label>
              </div>
              <p style={{ margin: '4px 0 0 30px', fontSize: 13, color: 'var(--text-muted)' }}>Provides real-time hints and explanations during the quiz.</p>
            </div>

            <div style={{ marginTop: 24, padding: 16, background: 'var(--bg-secondary)', borderRadius: 8, border: '1px solid var(--border)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
                <input 
                  type="checkbox" 
                  id="useDefault" 
                  checked={quizConfig.useDefault}
                  onChange={(e) => setQuizConfig({...quizConfig, useDefault: e.target.checked})}
                  style={{ width: 18, height: 18 }}
                />
                <label htmlFor="useDefault" style={{ fontSize: 15, fontWeight: 500, cursor: 'pointer' }}>Use Default Data Engineer Questions ({defaultQuestions.length})</label>
              </div>

              {quizConfig.useDefault ? (
                <div>
                  <label style={{ display: 'block', marginBottom: 8, fontSize: 13, color: 'var(--text-muted)' }}>FILTER BY SECTION (Leave empty for all)</label>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                    {uniqueSections.map(sec => (
                      <button
                        key={sec}
                        onClick={() => {
                          setQuizConfig(prev => ({
                            ...prev, 
                            sections: prev.sections.includes(sec) ? prev.sections.filter(s => s !== sec) : [...prev.sections, sec]
                          }))
                        }}
                        className={`quiz-meta-tag section ${quizConfig.sections.includes(sec) ? 'selected' : ''}`}
                        style={{ cursor: 'pointer', opacity: quizConfig.sections.includes(sec) ? 1 : 0.6 }}
                      >
                        {sec}
                      </button>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="quiz-upload-area" style={{ marginTop: 0 }}>
                  <input 
                    type="file" 
                    accept=".json" 
                    onChange={handleFileUpload} 
                    id="quiz-upload" 
                    style={{ display: 'none' }} 
                  />
                  <label htmlFor="quiz-upload" style={{ cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10 }}>
                    <FileJson size={32} color="var(--accent)" />
                    <span style={{ fontWeight: 600, color: 'var(--accent)', fontSize: 14 }}>Upload Custom JSON Question Bank</span>
                  </label>
                  <button 
                    onClick={downloadSampleJson} 
                    className="quiz-btn" 
                    style={{ marginTop: 16, background: 'var(--bg-secondary)', color: 'var(--text-primary)', border: '1px solid var(--border)' }}
                  >
                    Download Sample JSON
                  </button>
                  {questions.length > 0 && !quizConfig.useDefault && (
                    <div style={{ marginTop: 12, color: 'var(--success)', fontSize: 13 }}>
                      Loaded {questions.length} custom questions successfully!
                    </div>
                  )}

                  {savedQuizzes.length > 0 && (
                    <div style={{ marginTop: 24, width: '100%', textAlign: 'left' }}>
                      <label style={{ display: 'block', marginBottom: 8, fontSize: 13, color: 'var(--text-muted)' }}>YOUR SAVED QUIZZES</label>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                        {savedQuizzes.map(sq => (
                          <div key={sq.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'var(--bg-card)', padding: 12, borderRadius: 8, border: '1px solid var(--border)' }}>
                            <div>
                              <div style={{ fontWeight: 600 }}>{sq.title}</div>
                              <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>{new Date(sq.created_at).toLocaleDateString()}</div>
                            </div>
                            <button className="quiz-btn quiz-btn-secondary" onClick={async () => {
                              const { data } = await supabase.from('user_quizzes').select('questions').eq('id', sq.id).single();
                              if (data) {
                                setQuestions(data.questions);
                                setQuizConfig(prev => ({...prev, name: sq.title}));
                                alert(`Loaded ${sq.title}!`);
                              }
                            }}>Load</button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          <button 
            className="quiz-btn quiz-btn-primary" 
            onClick={startQuiz} 
            disabled={!quizConfig.useDefault && questions.length === 0}
            style={{ padding: '16px 40px', fontSize: 18, width: '100%', justifyContent: 'center' }}
          >
            Start Quiz <Play size={18} />
          </button>
            </>
          ) : (
            <div className="quiz-history-view">
              <h2>My Quiz History</h2>
              {quizHistory.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '40px 0', color: 'var(--text-muted)' }}>
                  <p>No quizzes taken yet.</p>
                  <button onClick={() => setActiveTab("setup")} className="quiz-btn quiz-btn-primary" style={{ marginTop: 16 }}>Take a Quiz</button>
                </div>
              ) : (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 20, marginTop: 24 }}>
                  {quizHistory.map((item, idx) => (
                    <div key={idx} style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', padding: 20 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
                        <h3 style={{ margin: 0, fontSize: 18, color: 'var(--text-primary)' }}>{item.quiz_name}</h3>
                        <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>{new Date(item.created_at).toLocaleDateString()}</span>
                      </div>
                      
                      <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 16 }}>
                        <div style={{ fontSize: 32, fontWeight: 800, color: item.score_percentage >= 70 ? 'var(--success)' : (item.score_percentage >= 40 ? 'var(--warning)' : 'var(--danger)') }}>
                          {item.score_percentage}%
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 4, fontSize: 13, color: 'var(--text-secondary)' }}>
                          <span style={{ color: 'var(--success)' }}>✓ {item.correct_count} Correct</span>
                          <span style={{ color: 'var(--danger)' }}>✗ {item.wrong_count} Incorrect</span>
                          <span>Total: {item.total_questions} Questions</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
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
              <button className="quiz-live-action" onClick={saveAndExit} title="Save progress and exit"><Save size={16} /> <span>Save & Exit</span></button>
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

                {/* AI Chat Panel */}
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

// Simple fallback icon if Target is not imported globally
function TargetIcon({ size }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10"></circle>
      <circle cx="12" cy="12" r="6"></circle>
      <circle cx="12" cy="12" r="2"></circle>
    </svg>
  );
}
