import { useState, useEffect, useRef } from 'react';
import { useParams, useLocation, useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import {
  RadialBarChart, RadialBar,
  ResponsiveContainer,
} from 'recharts';
import {
  Send, Bot, User as UserIcon, LayoutDashboard, History,
  TrendingUp, TrendingDown, CheckCircle2, Star, Zap,
  ArrowRight, BarChart2, LogOut, Target, Brain, MessageSquare,
  ChevronRight,
} from 'lucide-react';

const API = 'http://localhost:8000/api';
const MAX_Q = 10;

/* ── helpers ─────────────────────────────────────────── */
const headers = () => ({ Authorization: `Bearer ${localStorage.getItem('token')}` });

const scoreColor = (s) => {
  if (s >= 8) return '#22C55E';
  if (s >= 6) return '#F59E0B';
  return '#EF4444';
};

/* ── Animated counter ───────────────────────────────── */
const Counter = ({ value }) => {
  const [display, setDisplay] = useState(0);
  useEffect(() => {
    let start = display;
    const step = () => {
      start += 1;
      setDisplay(start);
      if (start < value) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [value]);
  return <span>{display}</span>;
};

/* ── Typing dots ─────────────────────────────────────── */
const TypingDots = () => (
  <div className="flex items-center gap-1.5 py-1 px-1">
    {[0, 0.18, 0.36].map((d, i) => (
      <motion.span key={i} className="w-2 h-2 rounded-full bg-teal-400"
        animate={{ y: [0, -6, 0], opacity: [0.4, 1, 0.4] }}
        transition={{ duration: 0.9, repeat: Infinity, delay: d }}
      />
    ))}
    <span className="text-xs text-teal-300 ml-2 font-medium">AI is thinking…</span>
  </div>
);

/* ── Typing‑effect text ──────────────────────────────── */
const TypingText = ({ text, onDone }) => {
  const [shown, setShown] = useState('');
  useEffect(() => {
    let i = 0;
    const iv = setInterval(() => {
      setShown(text.slice(0, i + 1));
      i++;
      if (i >= text.length) { clearInterval(iv); onDone?.(); }
    }, 16);
    return () => clearInterval(iv);
  }, [text]);
  return <>{shown}</>;
};

/* ── Metric progress bar ─────────────────────────────── */
const MetricRow = ({ label, value }) => (
  <div className="mb-3">
    <div className="flex justify-between text-xs mb-1">
      <span className="text-slate-400">{label}</span>
      <span className="font-bold" style={{ color: scoreColor(value) }}>{value}/10</span>
    </div>
    <div className="h-1.5 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.08)' }}>
      <motion.div className="h-full rounded-full"
        initial={{ width: 0 }}
        animate={{ width: `${(value / 10) * 100}%` }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
        style={{ background: `linear-gradient(90deg, #0EA5E9, #0D9488)` }}
      />
    </div>
  </div>
);
const FeedbackCard = ({ ev }) => (
  <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.4, ease: 'easeOut' }}
    className="ml-11 mt-3 max-w-2xl rounded-2xl p-5 font-['Arial'] text-base backdrop-blur-md bg-white/[0.02] border border-white/[0.08] shadow-[0_12px_40px_rgba(0,0,0,0.3)]"
  >
    <div className="flex items-center justify-between mb-4">
      <div className="flex items-center gap-2 text-yellow-400 text-xs font-semibold tracking-wider uppercase">
        <Star className="w-4 h-4 fill-yellow-400/20 text-yellow-400 animate-pulse" /> AI Evaluation
      </div>
      <span className="px-3 py-1 rounded-full text-xs font-black shadow-inner"
        style={{ background: 'linear-gradient(135deg, rgba(13,148,136,0.3), rgba(14,165,233,0.3))', color: '#2dd4bf', border: '1px solid rgba(13,148,136,0.4)' }}>
        SCORE: {ev.score}/10
      </span>
    </div>
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 mb-3.5 text-sm">
      <div className="rounded-xl p-3.5 backdrop-blur-sm bg-emerald-500/[0.04] border border-emerald-500/15 transition-colors hover:bg-emerald-500/[0.06]">
        <p className="text-emerald-400 font-bold mb-1.5 flex items-center gap-1.5"><TrendingUp className="w-3.5 h-3.5" />Strengths</p>
        <p className="text-slate-300 leading-relaxed">{ev.strengths}</p>
      </div>
      <div className="rounded-xl p-3.5 backdrop-blur-sm bg-rose-500/[0.04] border border-rose-500/15 transition-colors hover:bg-rose-500/[0.06]">
        <p className="text-rose-400 font-bold mb-1.5 flex items-center gap-1.5"><TrendingDown className="w-3.5 h-3.5" />Weaknesses</p>
        <p className="text-slate-300 leading-relaxed">{ev.weaknesses}</p>
      </div>
    </div>
    <div className="rounded-xl p-3.5 mb-3 text-sm backdrop-blur-sm bg-cyan-500/[0.04] border border-cyan-500/15 transition-colors hover:bg-cyan-500/[0.06]">
      <p className="text-cyan-400 font-bold mb-1.5 flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5" />Ideal Answer</p>
      <p className="text-slate-300 italic leading-relaxed">{ev.ideal_sample_answer}</p>
    </div>
    <div className="rounded-xl p-3.5 text-sm flex gap-2.5 items-start backdrop-blur-sm bg-sky-500/[0.05] border border-sky-500/15 transition-colors hover:bg-sky-500/[0.07]">
      <Zap className="w-4 h-4 text-sky-400 mt-0.5 shrink-0 animate-bounce" />
      <p className="text-slate-300 leading-relaxed">{ev.suggested_improvement}</p>
    </div>
  </motion.div>
);

/* ══════════════════════════════════════════════════════
   MAIN COMPONENT
   ══════════════════════════════════════════════════════ */
export default function InterviewChat() {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  const [session, setSession] = useState(null);
  const [history, setHistory] = useState([]);   // past sessions for sidebar
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [progress, setProgress] = useState(1);
  const [isCompleted, setIsCompleted] = useState(false);
  const [typingIdx, setTypingIdx] = useState(null);

  // Right panel live metrics (latest evaluation)
  const [liveMetrics, setLiveMetrics] = useState(null);
  const [avgScore, setAvgScore] = useState(0);
  const [scores, setScores] = useState([]);

  const bottomRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages, isTyping]);

  /* ── fetch history for sidebar ── */
  useEffect(() => {
    axios.get(`${API}/interview/history`, { headers: headers() })
      .then(r => setHistory(r.data.history || []))
      .catch(() => {});
  }, []);

  /* ── init chat ── */
  useEffect(() => {
    let active = true;
    const init = async () => {
      setIsTyping(true);
      try {
        const stateQ = location.state?.question;
        const { data } = await axios.get(`${API}/interview/report/${id}`, { headers: headers() });
        if (!active) return;
        setSession(data.session);
        setIsCompleted(data.session.is_completed);

        if (stateQ && data.turns.length === 0) {
          pushAi(stateQ, true);
          setProgress(1);
        } else if (data.turns.length > 0) {
          const rebuilt = [];
          const s = [];
          data.turns.forEach(t => {
            rebuilt.push({ type: 'ai', text: t.question, animate: false });
            rebuilt.push({ type: 'user', text: t.user_answer });
            const ev = JSON.parse(t.evaluation_json);
            rebuilt.push({ type: 'feedback', ev });
            s.push(ev.score);
          });
          setMessages(rebuilt);
          setProgress(data.turns.length + 1);
          setScores(s);
          setAvgScore(s.reduce((a, b) => a + b, 0) / s.length);
          setLiveMetrics(JSON.parse(data.turns[data.turns.length - 1].evaluation_json));
        } else {
          // No state and no turns — re-setup
          const { data: sd } = await axios.post(`${API}/interview/setup`, {
            job_role: data.session.job_role,
            category: data.session.category,
            difficulty: data.session.difficulty,
          }, { headers: headers() });
          if (!active) return;
          navigate(`/chat/${sd.session_id}`, { replace: true, state: { question: sd.question } });
          return;
        }
      } catch (e) {
        if (active) navigate('/setup');
      } finally {
        if (active) setIsTyping(false);
      }
    };
    init();
    return () => {
      active = false;
    };
  }, [id]);

  /* ── helper: add AI message ── */
  const pushAi = (text, animate = true) => {
    setMessages(prev => {
      const idx = prev.length;
      if (animate) setTypingIdx(idx);
      return [...prev, { type: 'ai', text, animate }];
    });
  };

  /* ── send answer ── */
  const handleSend = async (e) => {
    e.preventDefault();
    const answer = input.trim();
    if (!answer || isSending || isCompleted) return;
    setInput('');
    setMessages(prev => [...prev, { type: 'user', text: answer }]);
    setIsSending(true);
    setIsTyping(true);
    try {
      const lastAi = [...messages].reverse().find(m => m.type === 'ai');
      const { data } = await axios.post(`${API}/interview/chat`, {
        session_id: parseInt(id),
        question: lastAi?.text || '',
        user_answer: answer,
      }, { headers: headers() });

      const { evaluation: ev, next_question, is_completed } = data;
      setIsTyping(false);

      const newScores = [...scores, ev.score];
      setScores(newScores);
      setAvgScore(newScores.reduce((a, b) => a + b, 0) / newScores.length);
      setLiveMetrics(ev);

      setMessages(prev => [...prev, { type: 'feedback', ev }]);

      if (is_completed) {
        setIsCompleted(true);
        setProgress(MAX_Q);
        pushAi("That's all 10 questions — great effort! Your full report is ready.", true);
      } else {
        pushAi(next_question, true);
        setProgress(p => Math.min(p + 1, MAX_Q));
      }
    } catch {
      setIsTyping(false);
      pushAi('An error occurred. Please try again.', false);
    } finally {
      setIsSending(false);
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  };

  const radialData = liveMetrics ? [
    { name: 'Confidence', value: liveMetrics.confidence, fill: '#F59E0B' },
    { name: 'Clarity', value: liveMetrics.communication_clarity, fill: '#10B981' },
    { name: 'Tech', value: liveMetrics.technical_accuracy, fill: '#0D9488' },
    { name: 'Relevance', value: liveMetrics.relevance, fill: '#0EA5E9' },
  ] : [];

  /* ════════════════════════════════════════════════════
     RENDER
     ════════════════════════════════════════════════════ */
  return (
    <div className="flex h-screen w-full overflow-hidden font-['Arial'] relative"
      style={{ background: '#030712' }}>
      
      {/* ── Immersive background glowing orbs ── */}
      <div className="absolute top-[-10%] left-[-10%] w-[600px] h-[600px] rounded-full bg-teal-600/10 blur-[150px] pointer-events-none z-0" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[700px] h-[700px] rounded-full bg-sky-600/10 blur-[180px] pointer-events-none z-0" />
      <div className="absolute top-[40%] right-[30%] w-[450px] h-[450px] rounded-full bg-teal-500/5 blur-[130px] pointer-events-none z-0" />

      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 5px;
          height: 5px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.08);
          border-radius: 9px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(255, 255, 255, 0.15);
        }
      `}</style>

      {/* ══ LEFT SIDEBAR ══════════════════════════════ */}
      <aside className="hidden lg:flex flex-col w-64 shrink-0 border-r border-white/[0.06] backdrop-blur-3xl bg-[#030712]/50 z-10 relative">
        {/* Logo */}
        <div className="p-6 border-b border-white/[0.06]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl flex items-center justify-center shadow-lg relative group overflow-hidden"
              style={{ background: 'linear-gradient(135deg, #0EA5E9, #0D9488)' }}>
              <div className="absolute inset-0 bg-white/25 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <Brain className="w-5.5 h-5.5 text-white relative z-10" />
            </div>
            <div>
              <span className="font-extrabold text-white text-base tracking-widest uppercase">
                PrepWise <span className="bg-gradient-to-r from-teal-400 to-sky-400 bg-clip-text text-transparent font-black">AI</span>
              </span>
            </div>
          </div>
        </div>

        {/* Nav */}
        <nav className="p-4 space-y-2 border-b border-white/[0.06]">
          <Link to="/setup"
            className="flex items-center gap-3 px-4 py-3.5 rounded-2xl text-sm font-bold text-white transition-all duration-300 relative group overflow-hidden"
            style={{ 
              background: 'linear-gradient(135deg, rgba(13,148,136,0.3), rgba(14,165,233,0.25))', 
              border: '1px solid rgba(13,148,136,0.4)',
              boxShadow: '0 8px 24px rgba(13,148,136,0.15)'
            }}>
            <div className="absolute inset-0 bg-gradient-to-r from-teal-600/20 to-sky-600/20 opacity-0 group-hover:opacity-100 transition-all duration-300" />
            <MessageSquare className="w-4.5 h-4.5 text-teal-300 group-hover:text-white transition-colors" /> 
            <span className="group-hover:translate-x-0.5 transition-transform">New Interview</span>
          </Link>
          <Link to="/dashboard"
            className="flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-semibold text-slate-400 hover:text-white hover:bg-white/[0.04] border border-transparent hover:border-white/[0.04] transition-all duration-300">
            <LayoutDashboard className="w-4.5 h-4.5 text-slate-400 group-hover:text-white" /> Dashboard
          </Link>
        </nav>

        {/* Recent history */}
        <div className="flex-1 overflow-y-auto p-4 custom-scrollbar">
          <p className="text-[10px] text-slate-500 uppercase tracking-widest font-black mb-3 px-2">Recent Sessions</p>
          {history.slice(0, 8).map(s => (
            <Link key={s.id} to={`/report/${s.id}`}
              className="flex items-center justify-between px-3.5 py-3 rounded-2xl text-xs text-slate-400 hover:text-white hover:bg-white/[0.03] border border-transparent hover:border-white/[0.04] transition-all duration-300 group mb-2.5">
              <span className="truncate pr-1 group-hover:translate-x-0.5 transition-transform">{s.job_role}</span>
              <span className="font-extrabold shrink-0 ml-2 px-2.5 py-0.5 rounded-full bg-white/[0.04] text-[10px] border border-white/[0.05]" 
                style={{ color: scoreColor(s.overall_score) }}>
                {s.overall_score}/10
              </span>
            </Link>
          ))}
          {history.length === 0 && (
            <p className="text-xs text-slate-600 px-2 italic">No completed interviews yet.</p>
          )}
        </div>

        {/* Bottom */}
        <div className="p-4 border-t border-white/[0.06]">
          <button onClick={() => { localStorage.removeItem('token'); navigate('/login'); }}
            className="flex items-center gap-2.5 px-4 py-3 rounded-2xl text-xs text-slate-500 hover:text-rose-400 hover:bg-rose-500/[0.05] border border-transparent hover:border-rose-500/10 transition-all duration-300 w-full font-bold">
            <LogOut className="w-4 h-4" /> Sign out
          </button>
        </div>
      </aside>

      {/* ══ CENTER CHAT ═══════════════════════════════ */}
      <div className="flex-1 flex flex-col min-w-0 bg-transparent z-10 relative">
        {/* Top bar (mobile + session info) */}
        <div className="shrink-0 flex items-center justify-between px-6 md:px-10 py-5 border-b border-white/[0.06] backdrop-blur-xl bg-black/20">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-2xl flex items-center justify-center shadow-lg relative"
              style={{ background: 'linear-gradient(135deg, #0EA5E9, #0D9488)' }}>
              <div className="absolute inset-0 rounded-2xl bg-white/10 animate-pulse" />
              <Bot className="w-5 h-5 text-white" />
            </div>
            {session && (
              <div className="text-xs text-slate-400 flex flex-wrap items-center gap-2">
                <span className="text-white font-bold tracking-wide text-sm">{session.job_role}</span>
                <span className="text-white/20 hidden sm:inline">•</span>
                <span className="px-2.5 py-0.5 rounded-full bg-white/[0.04] border border-white/[0.06] text-[10px] text-slate-300">{session.category}</span>
                <span className="text-white/20 hidden sm:inline">•</span>
                <span className="text-teal-300 font-bold uppercase tracking-wider text-[10px]">{session.difficulty}</span>
              </div>
            )}
          </div>

          {/* Progress pill */}
          <div className="flex items-center gap-4">
            <div className="text-xs font-black tracking-wider text-teal-400 uppercase">
              Q {Math.min(progress, MAX_Q)} / {MAX_Q}
            </div>
            <div className="w-24 h-2 rounded-full overflow-hidden hidden sm:block bg-white/[0.06] border border-white/[0.04] p-[1px]">
              <motion.div className="h-full rounded-full"
                animate={{ width: `${((progress - 1) / MAX_Q) * 100}%` }}
                transition={{ duration: 0.5, ease: 'easeOut' }}
                style={{ background: 'linear-gradient(90deg, #0EA5E9, #0D9488)' }} />
            </div>
            {isCompleted && (
              <motion.button initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
                onClick={() => navigate(`/report/${id}`)}
                className="flex items-center gap-2 text-xs font-black px-4.5 py-2.5 rounded-2xl shadow-lg shadow-teal-600/10 hover:shadow-teal-600/20 transition-all duration-300"
                style={{ background: 'linear-gradient(135deg, #0EA5E9, #0D9488)', color: '#fff' }}>
                <BarChart2 className="w-4 h-4" /> View Report <ArrowRight className="w-4 h-4" />
              </motion.button>
            )}
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto px-6 md:px-12 py-8 space-y-6 custom-scrollbar">
          <AnimatePresence initial={false}>
            {messages.map((msg, idx) => (
              <motion.div key={idx}
                initial={{ opacity: 0, y: 15, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.3, ease: 'easeOut' }}>
                {msg.type === 'feedback' ? (
                  <FeedbackCard ev={msg.ev} />
                ) : msg.type === 'ai' ? (
                  <div className="flex items-start gap-4.5 max-w-3xl">
                    <div className="w-10 h-10 rounded-2xl shrink-0 flex items-center justify-center mt-0.5 shadow-lg relative group overflow-hidden"
                      style={{ background: 'linear-gradient(135deg, #0EA5E9, #0D9488)', boxShadow: '0 0 15px rgba(13,148,136,0.3)' }}>
                      <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity" />
                      <Bot className="w-5.5 h-5.5 text-white" />
                    </div>
                    <div className="rounded-3xl rounded-tl-sm px-6 py-4.5 font-['Arial'] text-base leading-relaxed text-slate-100 shadow-xl max-w-2xl backdrop-blur-md bg-gradient-to-br from-teal-600/[0.08] to-sky-600/[0.04] border-l-4 border-l-teal-500 border border-white/[0.08]">
                      {msg.animate && typingIdx === idx
                        ? <TypingText text={msg.text} onDone={() => setTypingIdx(null)} />
                        : msg.text}
                    </div>
                  </div>
                ) : (
                  <div className="flex items-start gap-4.5 justify-end">
                    <div className="rounded-3xl rounded-tr-sm px-6 py-4.5 font-['Arial'] text-base leading-relaxed text-cyan-50 shadow-xl max-w-2xl backdrop-blur-md bg-gradient-to-br from-sky-500/[0.08] to-blue-600/[0.04] border-r-4 border-r-sky-400 border border-white/[0.08]">
                      {msg.text}
                    </div>
                    <div className="w-10 h-10 rounded-2xl shrink-0 flex items-center justify-center mt-0.5 backdrop-blur-md bg-white/[0.06] border border-white/[0.08] shadow-[0_4px_12px_rgba(0,0,0,0.15)]">
                      <UserIcon className="w-5 h-5 text-slate-300" />
                    </div>
                  </div>
                )}
              </motion.div>
            ))}
          </AnimatePresence>

          {/* Typing indicator */}
          <AnimatePresence>
            {isTyping && (
              <motion.div key="dots" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                className="flex items-start gap-4.5">
                <div className="w-10 h-10 rounded-2xl shrink-0 flex items-center justify-center mt-0.5 shadow-lg"
                  style={{ background: 'linear-gradient(135deg, #0EA5E9, #0D9488)', boxShadow: '0 0 15px rgba(13,148,136,0.3)' }}>
                  <Bot className="w-5.5 h-5.5 text-white" />
                </div>
                <div className="rounded-3xl rounded-tl-sm px-6 py-4 shadow-xl backdrop-blur-md bg-gradient-to-br from-teal-600/[0.08] to-sky-600/[0.04] border-l-4 border-l-teal-500 border border-white/[0.08]">
                  <TypingDots />
                </div>
              </motion.div>
            )}
          </AnimatePresence>
          <div ref={bottomRef} />
        </div>

        {/* Input bar */}
        <div className="shrink-0 px-6 md:px-12 py-6 border-t border-white/[0.06] backdrop-blur-xl bg-black/20">
          <form onSubmit={handleSend} className="max-w-3xl mx-auto relative group">
            <textarea ref={inputRef} value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(e); } }}
              disabled={isSending || isCompleted}
              placeholder={isCompleted ? 'Interview complete — view your report above' : 'Type your answer here…'}
              rows={3}
              className="w-full rounded-3xl py-4.5 pl-6 pr-16 text-white placeholder-slate-600 resize-none focus:outline-none transition-all duration-300 font-['Arial'] text-base backdrop-blur-md bg-white/[0.02] border border-white/[0.08] focus:border-teal-500/40 focus:bg-white/[0.04] shadow-[inset_0_1px_2px_rgba(255,255,255,0.01)]"
              style={{ boxShadow: '0 8px 32px rgba(0,0,0,0.3)' }}
            />
            <motion.button whileHover={{ scale: 1.08 }} whileTap={{ scale: 0.94 }}
              type="submit"
              disabled={!input.trim() || isSending || isCompleted}
              className="absolute right-5 bottom-5 w-11 h-11 rounded-2xl flex items-center justify-center transition-all duration-300"
              style={input.trim() && !isSending && !isCompleted
                ? { background: 'linear-gradient(135deg, #0EA5E9, #0D9488)', boxShadow: '0 4px 15px rgba(13,148,136,0.45)' }
                : { background: 'rgba(255,255,255,0.03)', cursor: 'not-allowed', border: '1px solid rgba(255,255,255,0.02)' }}>
              <Send className="w-5 h-5 text-white" />
            </motion.button>
          </form>
          <p className="text-center text-[10px] text-slate-700 mt-2.5 hidden md:block tracking-widest font-semibold uppercase">
            <kbd className="bg-white/5 px-1.5 py-0.5 rounded text-slate-500 border border-white/5 mr-1">Enter</kbd> to send ·{' '}
            <kbd className="bg-white/5 px-1.5 py-0.5 rounded text-slate-500 border border-white/5 ml-1">Shift + Enter</kbd> for new line
          </p>
        </div>
      </div>

      {/* ══ RIGHT ANALYTICS PANEL ═════════════════════ */}
      <aside className="hidden xl:flex flex-col w-80 shrink-0 border-l border-white/[0.06] backdrop-blur-3xl bg-[#030712]/50 overflow-y-auto custom-scrollbar z-10 relative">
        <div className="p-6 border-b border-white/[0.06]">
          <p className="text-xs text-slate-500 uppercase tracking-widest font-black">Live Analytics</p>
        </div>

        <div className="p-6 space-y-6">
          {/* Average score */}
          <div className="rounded-3xl p-6 text-center relative overflow-hidden backdrop-blur-md bg-white/[0.02] border border-white/[0.08] shadow-[0_8px_32px_rgba(0,0,0,0.15)] group hover:border-teal-500/20 transition-all duration-300">
            {/* Glowing background */}
            <div className="absolute -top-12 -left-12 w-24 h-24 bg-teal-600/10 rounded-full blur-2xl group-hover:bg-teal-600/15 transition-all duration-300" />
            <div className="absolute -bottom-12 -right-12 w-24 h-24 bg-sky-600/10 rounded-full blur-2xl group-hover:bg-sky-600/15 transition-all duration-300" />
            
            <p className="text-[10px] text-slate-500 uppercase tracking-wider font-bold mb-2 relative z-10">Average Score</p>
            <div className="inline-block relative z-10">
              <span className="text-5xl font-black tracking-tight filter drop-shadow-[0_2px_12px_rgba(0,0,0,0.4)]" style={{ color: scoreColor(Math.round(avgScore)) }}>
                {scores.length > 0 ? <Counter value={Math.round(avgScore)} /> : '—'}
              </span>
              <span className="text-sm font-extrabold text-slate-600 ml-1">/10</span>
            </div>
          </div>

          {/* Per-question scores */}
          {scores.length > 0 && (
            <div className="rounded-3xl p-5 backdrop-blur-md bg-white/[0.01] border border-white/[0.04] space-y-3.5">
              <p className="text-[10px] text-slate-500 uppercase tracking-wider font-black">Question Progress</p>
              <div className="space-y-2.5">
                {scores.map((s, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <span className="text-[10px] text-slate-500 font-extrabold w-4 shrink-0">Q{i + 1}</span>
                    <div className="flex-1 h-2 rounded-full overflow-hidden bg-white/[0.04] border border-white/[0.02]">
                      <motion.div className="h-full rounded-full"
                        initial={{ width: 0 }} animate={{ width: `${(s / 10) * 100}%` }}
                        transition={{ duration: 0.7, delay: i * 0.05 }}
                        style={{ background: `linear-gradient(90deg, ${scoreColor(s)}dd, ${scoreColor(s)})` }} />
                    </div>
                    <span className="text-[10px] font-black w-8 text-right" style={{ color: scoreColor(s) }}>{s}/10</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Live metrics from last evaluation */}
          {liveMetrics ? (
            <div className="space-y-6">
              <div className="rounded-3xl p-5 backdrop-blur-md bg-white/[0.01] border border-white/[0.04]">
                <p className="text-[10px] text-slate-500 uppercase tracking-wider font-black mb-4">Last Answer Analysis</p>
                <MetricRow label="Relevance" value={liveMetrics.relevance} />
                <MetricRow label="Technical Accuracy" value={liveMetrics.technical_accuracy} />
                <MetricRow label="Clarity" value={liveMetrics.communication_clarity} />
                <MetricRow label="Confidence" value={liveMetrics.confidence} />
              </div>

              {/* Radial Bar Chart (Activity Rings) */}
              <div className="rounded-3xl p-5 backdrop-blur-md bg-white/[0.01] border border-white/[0.04]">
                <p className="text-[10px] text-slate-500 uppercase tracking-wider font-black mb-3">Performance Metrics</p>
                <div className="h-44 flex items-center justify-center">
                  <ResponsiveContainer width="100%" height="100%">
                    <RadialBarChart 
                      cx="50%" 
                      cy="50%" 
                      innerRadius="25%" 
                      outerRadius="100%" 
                      barSize={7} 
                      data={radialData}
                    >
                      <RadialBar
                        minAngle={15}
                        background={{ fill: 'rgba(255,255,255,0.03)' }}
                        clockWise
                        dataKey="value"
                        cornerRadius={10}
                      />
                    </RadialBarChart>
                  </ResponsiveContainer>
                </div>
                {/* Custom Legend */}
                <div className="grid grid-cols-2 gap-x-2 gap-y-2.5 mt-4 pt-4 border-t border-white/[0.04] text-[10px] font-bold">
                  <div className="flex items-center gap-1.5 text-slate-400">
                    <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ background: '#0EA5E9' }} />
                    <span className="truncate">Relevance: {liveMetrics.relevance}/10</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-slate-400">
                    <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ background: '#0D9488' }} />
                    <span className="truncate">Accuracy: {liveMetrics.technical_accuracy}/10</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-slate-400">
                    <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ background: '#10B981' }} />
                    <span className="truncate">Clarity: {liveMetrics.communication_clarity}/10</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-slate-400">
                    <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ background: '#F59E0B' }} />
                    <span className="truncate">Confidence: {liveMetrics.confidence}/10</span>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-12 rounded-3xl border border-dashed border-white/[0.06] bg-white/[0.01]">
              <Target className="w-9 h-9 text-slate-700 mx-auto mb-3 animate-pulse" />
              <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Awaiting First Response</p>
              <p className="text-[10px] text-slate-600 mt-1">Analytics will load as you chat.</p>
            </div>
          )}

          {/* Report button */}
          {isCompleted && (
            <motion.button initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
              onClick={() => navigate(`/report/${id}`)}
              className="w-full flex items-center justify-center gap-2 font-black py-4 rounded-2xl text-sm text-white shadow-xl hover:shadow-teal-600/10 transition-all duration-300"
              style={{ background: 'linear-gradient(135deg, #0EA5E9, #0D9488)', boxShadow: '0 4px 20px rgba(13,148,136,0.3)' }}>
              <BarChart2 className="w-4 h-4" /> Full Performance Report <ArrowRight className="w-4 h-4 animate-pulse" />
            </motion.button>
          )}
        </div>
      </aside>
    </div>
  );
}

