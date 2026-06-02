// import { useEffect, useState } from 'react';
// import { useParams, Link, useNavigate } from 'react-router-dom';
// import { motion } from 'framer-motion';
// import axios from 'axios';
// import {
//     Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer,
//     BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, Cell
// } from 'recharts';
// import { Award, Briefcase, ChevronLeft, Layers, Settings, TrendingUp, RefreshCcw } from 'lucide-react';

// const InterviewReport = () => {
//     const { id } = useParams();
//     const navigate = useNavigate();
//     const [reportData, setReportData] = useState(null);
//     const [loading, setLoading] = useState(true);

//     useEffect(() => {
//         const fetchReport = async () => {
//             try {
//                 const token = localStorage.getItem('token');
//                 const res = await axios.get(`http://localhost:8000/api/interview/report/${id}`, {
//                     headers: { Authorization: `Bearer ${token}` }
//                 });

//                 // Process the raw turns into report-ready data
//                 const session = res.data.session;
//                 const turns = res.data.turns;

//                 let relevanceSum = 0;
//                 let accuracySum = 0;
//                 let claritySum = 0;
//                 let confidenceSum = 0;
//                 let scoreSum = 0;

//                 const questionScores = turns.map((t, idx) => {
//                     const evalData = JSON.parse(t.evaluation_json);

//                     relevanceSum += evalData.relevance;
//                     accuracySum += evalData.technical_accuracy;
//                     claritySum += evalData.communication_clarity;
//                     confidenceSum += evalData.confidence;
//                     scoreSum += evalData.score;

//                     return {
//                         name: `Q${idx + 1}`,
//                         score: evalData.score,
//                     };
//                 });

//                 const turnCount = turns.length || 1;

//                 const skillRadarData = [
//                     { subject: 'Relevance', A: relevanceSum / turnCount, fullMark: 10 },
//                     { subject: 'Tech Accuracy', A: accuracySum / turnCount, fullMark: 10 },
//                     { subject: 'Clarity', A: claritySum / turnCount, fullMark: 10 },
//                     { subject: 'Confidence', A: confidenceSum / turnCount, fullMark: 10 },
//                     { subject: 'Overall', A: scoreSum / turnCount, fullMark: 10 },
//                 ];

//                 // Grab the best string strengths/weaknesses to display
//                 // const topStrengths = turns.map(t => JSON.parse(t.evaluation_json).strengths).filter(Boolean).slice(0, 3);
//                 // const topImprovements = turns.map(t => JSON.parse(t.evaluation_json).suggested_improvement).filter(Boolean).slice(0, 3);
//                 const uniqueStrengths = [
//                     ...new Set(
//                     turns.map(t => JSON.parse(t.evaluation_json).strengths)
//                         )
//                 ].slice(0, 3);

//                 const uniqueImprovements = [
//                     ...new Set(
//                     turns.map(t => JSON.parse(t.evaluation_json).suggested_improvement)
//                     )
//                 ].slice(0, 3);

//                 setReportData({
//                     session,
//                     turns,
//                     skillRadarData,
//                     questionScores,
//                     uniqueStrengths,
//                     uniqueImprovements
//                 });

//             } catch (err) {
//                 console.error("Failed to load report", err);
//                 // Could retry or show error
//             } finally {
//                 setLoading(false);
//             }
//         };
//         fetchReport();
//     }, [id]);

//     if (loading) return <div className="p-12 text-center text-slate-500 font-medium mt-20">Analyzing interview performance...</div>;
//     if (!reportData) return <div className="p-12 text-center text-rose-500 font-medium">Failed to load report.</div>;

//     const { session, skillRadarData, questionScores, topStrengths, topImprovements } = reportData;

//     return (
//         <div className="max-w-6xl mx-auto px-4 py-12 w-full pb-24">
//             <Link to="/dashboard" className="inline-flex items-center text-slate-500 hover:text-primary-blue mb-8 font-medium transition-colors">
//                 <ChevronLeft className="w-5 h-5 mr-1" /> Back to Dashboard
//             </Link>

//             <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-12">
//                 <div className="inline-block p-4 rounded-full bg-gradient-to-tr from-primary-blue to-primary-purple mb-4 shadow-lg shadow-primary-purple/20">
//                     <Award className="w-12 h-12 text-white" />
//                 </div>
//                 <h1 className="text-4xl font-extrabold text-slate-900 mb-2">Interview Analysis Report</h1>
//                 <p className="text-lg text-slate-600">Detailed breakdown of your AI-evaluated performance.</p>
//             </motion.div>

//             {/* Top Stats Banner */}
//             <motion.div
//                 initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.1 }}
//                 className="bg-slate-900 rounded-3xl p-8 shadow-2xl border border-slate-800 flex flex-col md:flex-row justify-between items-center mb-12 text-white relative overflow-hidden"
//             >
//                 {/* Decorative glow */}
//                 <div className="absolute top-[-50%] left-[-10%] w-64 h-64 bg-primary-purple/30 rounded-full blur-3xl"></div>

//                 <div className="flex gap-8 md:gap-16 z-10 w-full justify-between items-center flex-wrap">
//                     <div>
//                         <p className="text-slate-400 font-medium mb-1 uppercase tracking-widest text-sm">Final Score</p>
//                         <div className="flex items-baseline gap-2">
//                             <h2 className="text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">
//                                 {session.overall_score}
//                             </h2>
//                             <span className="text-2xl text-slate-500 font-bold">/ 10</span>
//                         </div>
//                     </div>

//                     <div className="flex gap-6">
//                         <div>
//                             <p className="text-slate-400 text-sm mb-1 flex items-center gap-1"><Briefcase className="w-4 h-4" /> Role</p>
//                             <p className="font-bold text-lg">{session.job_role}</p>
//                         </div>
//                         <div>
//                             <p className="text-slate-400 text-sm mb-1 flex items-center gap-1"><Layers className="w-4 h-4" /> Category</p>
//                             <p className="font-bold text-lg">{session.category}</p>
//                         </div>
//                         <div>
//                             <p className="text-slate-400 text-sm mb-1 flex items-center gap-1"><Settings className="w-4 h-4" /> Level</p>
//                             <p className="font-bold text-lg text-cyan-400">{session.difficulty}</p>
//                         </div>
//                     </div>

//                     <button
//                         onClick={() => navigate('/setup')}
//                         className="bg-white text-slate-900 px-6 py-3 rounded-xl font-bold hover:bg-slate-200 transition-colors flex items-center gap-2"
//                     >
//                         <RefreshCcw className="w-5 h-5" /> Try Again
//                     </button>
//                 </div>
//             </motion.div>

//             <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
//                 {/* Radar Chart */}
//                 {/* <motion.div
//                     initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }}
//                     className="glass-card p-8 h-[400px] flex flex-col items-center"
//                 >
//                     <h3 className="text-xl font-bold text-slate-900 mb-2 w-full text-left">Skill Breakdown</h3>
//                     <p className="text-slate-500 text-sm w-full text-left mb-4">Average scores across all evaluation metrics.</p>
//                     <ResponsiveContainer width="100%" height="100%">
//                         {/* //<RadarChart cx="50%" cy="50%" outerRadius="70%" data={skillRadarData}>
//                             //<PolarGrid stroke="#E2E8F0" />
//                            // <PolarAngleAxis dataKey="subject" tick={{ fill: '#64748B', fontSize: 12, fontWeight: 600 }} />
//                             //<PolarRadiusAxis angle={30} domain={[0, 10]} max={10} tick={{ fill: '#94A3B8' }} />
//                             //<Radar name="Performance" dataKey="A" stroke="#7C3AED" fill="#7C3AED" fillOpacity={0.4} />
//                        //</RadarChart> */}
                        
//                     {/* //</div></ResponsiveContainer> */}
//                 {/* //</div></motion.div> */}

//                 {/* Skill Breakdown Modern */}
//                 <motion.div
//                     initial={{ opacity: 0, x: -20 }}
//                     animate={{ opacity: 1, x: 0 }}
//                     transition={{ delay: 0.2 }}
//                     className="glass-card p-8"
//                     >
//                     <h3 className="text-2xl font-bold text-slate-900 mb-2">
//                     Skill Breakdown
//     </h3>

//     <p className="text-slate-500 text-sm mb-8">
//         Detailed performance across evaluation metrics
//     </p>

//     <div className="space-y-6">
//         {skillRadarData.map((skill, index) => (
//             <div key={index}>
//                 <div className="flex justify-between mb-2">
//                     <span className="font-semibold text-slate-700">
//                         {skill.subject}
//                     </span>

//                     <span className="font-bold text-primary-purple">
//                         {skill.A.toFixed(1)} / 10
//                     </span>
//                 </div>

//                 <div className="w-full bg-slate-200 rounded-full h-4 overflow-hidden">
//                     <motion.div
//                         initial={{ width: 0 }}
//                         animate={{ width: `${skill.A * 10}%` }}
//                         transition={{ duration: 1, delay: index * 0.1 }}
//                         className={`h-4 rounded-full ${
//                             skill.A >= 8
//                                 ? "bg-green-500"
//                                 : skill.A >= 6
//                                 ? "bg-yellow-500"
//                                 : "bg-red-500"
//                         }`}
//                     />
//                 </div>
//             </div>
//         ))}
//     </div>
// </motion.div>

//                 {/* Progress Bar Chart */}
//                 <motion.div
//                     initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 }}
//                     className="glass-card p-8 h-[400px] flex flex-col"
//                 >
//                     <h3 className="text-xl font-bold text-slate-900 mb-2">Question Progression</h3>
//                     <p className="text-slate-500 text-sm mb-8">Score (out of 10) for each question answered.</p>
//                     <div className="flex-1">
//                         <ResponsiveContainer width="100%" height="100%">
//                             <BarChart data={questionScores}>
//                                 <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
//                                 <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#64748B', fontSize: 12 }} />
//                                 <YAxis domain={[0, 10]} axisLine={false} tickLine={false} tick={{ fill: '#94A3B8', fontSize: 12 }} />
//                                 <Tooltip cursor={{ fill: '#F8FAFC' }} contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
//                                 <Bar dataKey="score" radius={[8, 8, 8, 8]}>
//                                     {questionScores.map((entry, index) => (
//                                         <Cell key={`cell-${index}`} fill={entry.score >= 7 ? '#22C55E' : entry.score >= 5 ? '#F59E0B' : '#EF4444'} />
//                                     ))}
//                                 </Bar>
//                             </BarChart>
//                         </ResponsiveContainer>
//                     </div>
//                 </motion.div>
//             </div>

//             {/* AI Text Feedback Summaries */}
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
//                 <motion.div
//                     initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
//                     className="bg-emerald-50/50 border border-emerald-100 rounded-3xl p-8"
//                 >
//                     <div className="flex items-center gap-3 mb-6">
//                         <div className="p-3 bg-emerald-100 rounded-xl text-emerald-600">
//                             <TrendingUp className="w-6 h-6" />
//                         </div>
//                         <h3 className="text-xl font-bold text-slate-900">Key Strengths</h3>
//                     </div>
//                     <ul className="space-y-4">
//                         {topStrengths.map((str, i) => (
//                             <li key={i} className="flex gap-3 text-emerald-900 font-medium bg-white p-4 rounded-xl shadow-sm border border-emerald-50">
//                                 <span className="text-emerald-500 font-bold">•</span> {str}
//                             </li>
//                         ))}
//                     </ul>
//                 </motion.div>

//                 <motion.div
//                     initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}
//                     className="bg-blue-50/50 border border-blue-100 rounded-3xl p-8"
//                 >
//                     <div className="flex items-center gap-3 mb-6">
//                         <div className="p-3 bg-blue-100 rounded-xl text-blue-600">
//                             <TrendingUp className="w-6 h-6 transform rotate-90" />
//                         </div>
//                         <h3 className="text-xl font-bold text-slate-900">Areas for Improvement</h3>
//                     </div>
//                     <ul className="space-y-4">
//                         {topImprovements.map((imp, i) => (
//                             <li key={i} className="flex gap-3 text-blue-900 font-medium bg-white p-4 rounded-xl shadow-sm border border-blue-50">
//                                 <span className="text-blue-500 font-bold">•</span> {imp}
//                             </li>
//                         ))}
//                     </ul>
//                 </motion.div>
//             </div>

//         </div>
//     );
// };

// export default InterviewReport;


import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import axios from 'axios';
import {
    BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, Cell,
    ResponsiveContainer
} from 'recharts';
import {
    Award, Briefcase, ChevronLeft, Layers,
    Settings, TrendingUp, RefreshCcw, CheckCircle2, AlertCircle
} from 'lucide-react';

// ─────────────────────────────────────────────────────────
// Safe JSON parse — never throws; returns {} on failure
// ─────────────────────────────────────────────────────────
function safeParse(raw) {
    try {
        return typeof raw === 'string' ? JSON.parse(raw) : (raw ?? {});
    } catch {
        return {};
    }
}

// ─────────────────────────────────────────────────────────
// Split pipe-joined strings from ai_service.py
// "Strength A | Strength B" → ["Strength A", "Strength B"]
// ─────────────────────────────────────────────────────────
function splitPipes(text) {
    if (!text || typeof text !== 'string') return [];
    return text.split('|').map(s => s.trim()).filter(Boolean);
}

// ─────────────────────────────────────────────────────────
// Deduplicate — remove exact & near-duplicate strings
// ─────────────────────────────────────────────────────────
function dedupe(items, limit = 3) {
    const seen = new Set();
    const out  = [];
    for (const raw of items) {
        if (!raw) continue;
        const key = raw.toLowerCase().replace(/\s+/g, ' ').trim();
        if (!seen.has(key)) {
            seen.add(key);
            out.push(raw.trim());
        }
        if (out.length >= limit) break;
    }
    return out;
}

// ─────────────────────────────────────────────────────────
// Score → colour
// ─────────────────────────────────────────────────────────
function scoreColor(v) {
    if (v >= 8) return '#22C55E';
    if (v >= 6) return '#F59E0B';
    return '#EF4444';
}

// ─────────────────────────────────────────────────────────
// Horizontal skill bar  (replaces radar chart)
// ─────────────────────────────────────────────────────────
function SkillBar({ label, value, index }) {
    const safe  = isFinite(value) ? value : 0;
    const pct   = Math.round((safe / 10) * 100);
    const color = scoreColor(safe);

    return (
        <motion.div
            className="mb-5"
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 + index * 0.07, duration: 0.4 }}
        >
            <div className="flex items-center justify-between mb-1.5">
                <span className="text-sm font-semibold text-slate-700">{label}</span>
                <span
                    className="text-xs font-bold px-2 py-0.5 rounded-full"
                    style={{
                        color,
                        background: color + '20',
                        border: `1px solid ${color}50`
                    }}
                >
                    {safe.toFixed(1)} / 10
                </span>
            </div>

            {/* track */}
            <div className="h-2.5 w-full rounded-full bg-slate-100 overflow-hidden">
                <motion.div
                    className="h-full rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: `${pct}%` }}
                    transition={{ delay: 0.3 + index * 0.07, duration: 0.65, ease: 'easeOut' }}
                    style={{ background: `linear-gradient(90deg, ${color}cc, ${color})` }}
                />
            </div>
        </motion.div>
    );
}

// ─────────────────────────────────────────────────────────
// Feedback pill (strength / improvement item)
// ─────────────────────────────────────────────────────────
function FeedbackItem({ text, variant, index }) {
    const isStrength = variant === 'strength';
    return (
        <motion.li
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.45 + index * 0.08 }}
            className={`flex gap-3 font-medium p-4 rounded-xl border text-sm
                ${isStrength
                    ? 'bg-white text-emerald-900 border-emerald-100'
                    : 'bg-white text-blue-900 border-blue-100'
                }`}
        >
            {isStrength
                ? <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                : <AlertCircle  className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
            }
            <span>{text}</span>
        </motion.li>
    );
}

// ═════════════════════════════════════════════════════════
// MAIN COMPONENT
// ═════════════════════════════════════════════════════════
const InterviewReport = () => {
    const { id }   = useParams();
    const navigate = useNavigate();

    const [reportData, setReportData] = useState(null);
    const [loading,    setLoading]    = useState(true);

    useEffect(() => {
        const fetchReport = async () => {
            try {
                const token = localStorage.getItem('token');
                const res   = await axios.get(
                    `http://localhost:8000/api/interview/report/${id}`,
                    { headers: { Authorization: `Bearer ${token}` } }
                );

                const session = res.data.session;
                const turns   = Array.isArray(res.data.turns) ? res.data.turns : [];

                // ── Accumulate metric sums ──────────────────────────────
                let relevanceSum  = 0;
                let accuracySum   = 0;
                let claritySum    = 0;
                let confidenceSum = 0;
                let scoreSum      = 0;

                // ── Per-question scores ─────────────────────────────────
                const questionScores = turns.map((t, idx) => {
                    const ev = safeParse(t.evaluation_json);
                    relevanceSum  += Number(ev.relevance             ?? 0);
                    accuracySum   += Number(ev.technical_accuracy    ?? 0);
                    claritySum    += Number(ev.communication_clarity ?? 0);
                    confidenceSum += Number(ev.confidence            ?? 0);
                    scoreSum      += Number(ev.score                 ?? 0);
                    return { name: `Q${idx + 1}`, score: Number(ev.score ?? 0) };
                });

                const n = turns.length || 1;

                // ── Skill bars data ────────────────────────────────────
                const skillData = [
                    { label: 'Relevance',            value: relevanceSum  / n },
                    { label: 'Technical Accuracy',   value: accuracySum   / n },
                    { label: 'Clarity',              value: claritySum    / n },
                    { label: 'Confidence',           value: confidenceSum / n },
                    { label: 'Overall Score',        value: scoreSum      / n },
                ];

                // ── Build unique strengths ─────────────────────────────
                // Sort turns best-first so top unique strengths come first.
                // ai_service.py returns pipe-joined strings → split them.
                const byBest  = [...turns].sort((a, b) =>
                    Number(safeParse(b.evaluation_json).score ?? 0) -
                    Number(safeParse(a.evaluation_json).score ?? 0)
                );
                const byWorst = [...turns].sort((a, b) =>
                    Number(safeParse(a.evaluation_json).score ?? 0) -
                    Number(safeParse(b.evaluation_json).score ?? 0)
                );

                const rawStrengths = byBest.flatMap(t =>
                    splitPipes(safeParse(t.evaluation_json).strengths)
                );
                const rawImprovements = byWorst.flatMap(t =>
                    splitPipes(safeParse(t.evaluation_json).suggested_improvement)
                );

                const topStrengths    = dedupe(rawStrengths,    3);
                const topImprovements = dedupe(rawImprovements, 3);

                setReportData({
                    session,
                    skillData,
                    questionScores,
                    topStrengths,
                    topImprovements,
                });

            } catch (err) {
                console.error('Failed to load report:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchReport();
    }, [id]);

    // ── Loading / error states ─────────────────────────────
    if (loading) return (
        <div className="p-12 text-center text-slate-500 font-medium mt-20">
            Analyzing interview performance…
        </div>
    );
    if (!reportData) return (
        <div className="p-12 text-center text-rose-500 font-medium">
            Failed to load report.
        </div>
    );

    const { session, skillData, questionScores, topStrengths, topImprovements } = reportData;

    // ── Render ─────────────────────────────────────────────
    return (
        <div className="max-w-6xl mx-auto px-4 py-12 w-full pb-24">

            {/* Back link */}
            <Link
                to="/dashboard"
                className="inline-flex items-center text-slate-500 hover:text-primary-blue mb-8 font-medium transition-colors"
            >
                <ChevronLeft className="w-5 h-5 mr-1" /> Back to Dashboard
            </Link>

            {/* ── Page header ── */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center mb-12"
            >
                <div className="inline-block p-4 rounded-full bg-gradient-to-tr from-primary-blue to-primary-purple mb-4 shadow-lg shadow-primary-purple/20">
                    <Award className="w-12 h-12 text-white" />
                </div>
                <h1 className="text-4xl font-extrabold text-slate-900 mb-2">
                    Interview Analysis Report
                </h1>
                <p className="text-lg text-slate-600">
                    Detailed breakdown of your AI-evaluated performance.
                </p>
            </motion.div>

            {/* ── Top stats banner ── */}
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.1 }}
                className="bg-slate-900 rounded-3xl p-8 shadow-2xl border border-slate-800 flex flex-col md:flex-row justify-between items-center mb-12 text-white relative overflow-hidden"
            >
                <div className="absolute top-[-50%] left-[-10%] w-64 h-64 bg-primary-purple/30 rounded-full blur-3xl" />
                <div className="flex gap-8 md:gap-16 z-10 w-full justify-between items-center flex-wrap">
                    <div>
                        <p className="text-slate-400 font-medium mb-1 uppercase tracking-widest text-sm">
                            Final Score
                        </p>
                        <div className="flex items-baseline gap-2">
                            <h2 className="text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">
                                {session.overall_score}
                            </h2>
                            <span className="text-2xl text-slate-500 font-bold">/ 10</span>
                        </div>
                    </div>
                    <div className="flex gap-6">
                        <div>
                            <p className="text-slate-400 text-sm mb-1 flex items-center gap-1">
                                <Briefcase className="w-4 h-4" /> Role
                            </p>
                            <p className="font-bold text-lg">{session.job_role}</p>
                        </div>
                        <div>
                            <p className="text-slate-400 text-sm mb-1 flex items-center gap-1">
                                <Layers className="w-4 h-4" /> Category
                            </p>
                            <p className="font-bold text-lg">{session.category}</p>
                        </div>
                        <div>
                            <p className="text-slate-400 text-sm mb-1 flex items-center gap-1">
                                <Settings className="w-4 h-4" /> Level
                            </p>
                            <p className="font-bold text-lg text-cyan-400">{session.difficulty}</p>
                        </div>
                    </div>
                    <button
                        onClick={() => navigate('/setup')}
                        className="bg-white text-slate-900 px-6 py-3 rounded-xl font-bold hover:bg-slate-200 transition-colors flex items-center gap-2"
                    >
                        <RefreshCcw className="w-5 h-5" /> Try Again
                    </button>
                </div>
            </motion.div>

            {/* ── Charts row ── */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">

                {/* FIX 1 ▸ Skill Breakdown — horizontal bars replace radar */}
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 }}
                    className="glass-card p-8 flex flex-col"
                >
                    <h3 className="text-xl font-bold text-slate-900 mb-1">
                        Skill Breakdown
                    </h3>
                    <p className="text-slate-500 text-sm mb-6">
                        Average score per metric across all {questionScores.length} questions.
                    </p>
                    <div className="flex-1">
                        {skillData.map((item, i) => (
                            <SkillBar
                                key={item.label}
                                label={item.label}
                                value={item.value}
                                index={i}
                            />
                        ))}
                    </div>
                </motion.div>

                {/* Question Progression bar chart */}
                <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 }}
                    className="glass-card p-8 h-[400px] flex flex-col"
                >
                    <h3 className="text-xl font-bold text-slate-900 mb-2">
                        Question Progression
                    </h3>
                    <p className="text-slate-500 text-sm mb-8">
                        Score (out of 10) for each question answered.
                    </p>
                    <div className="flex-1">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={questionScores}>
                                <CartesianGrid
                                    strokeDasharray="3 3"
                                    vertical={false}
                                    stroke="#F1F5F9"
                                />
                                <XAxis
                                    dataKey="name"
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fill: '#64748B', fontSize: 12 }}
                                />
                                <YAxis
                                    domain={[0, 10]}
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fill: '#94A3B8', fontSize: 12 }}
                                />
                                <Tooltip
                                    cursor={{ fill: '#F8FAFC' }}
                                    contentStyle={{
                                        borderRadius: '12px',
                                        border: 'none',
                                        boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
                                    }}
                                />
                                <Bar dataKey="score" radius={[8, 8, 8, 8]}>
                                    {questionScores.map((entry, i) => (
                                        <Cell
                                            key={`cell-${i}`}
                                            fill={scoreColor(entry.score)}
                                        />
                                    ))}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </motion.div>
            </div>

            {/* ── FIX 2 & 3: Unique Strengths + Unique Improvements ── */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

                {/* Key Strengths — best turns, pipes split, deduped */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="bg-emerald-50/50 border border-emerald-100 rounded-3xl p-8"
                >
                    <div className="flex items-center gap-3 mb-2">
                        <div className="p-3 bg-emerald-100 rounded-xl text-emerald-600">
                            <TrendingUp className="w-6 h-6" />
                        </div>
                        <div>
                            <h3 className="text-xl font-bold text-slate-900">Key Strengths</h3>
                            <p className="text-xs text-slate-400">From your best-performing answers</p>
                        </div>
                    </div>

                    <ul className="space-y-3 mt-5">
                        {topStrengths.length > 0
                            ? topStrengths.map((str, i) => (
                                <FeedbackItem key={i} text={str} variant="strength" index={i} />
                            ))
                            : <li className="text-slate-400 text-sm italic p-4">
                                No strengths recorded yet.
                              </li>
                        }
                    </ul>
                </motion.div>

                {/* Areas for Improvement — worst turns, pipes split, deduped */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                    className="bg-blue-50/50 border border-blue-100 rounded-3xl p-8"
                >
                    <div className="flex items-center gap-3 mb-2">
                        <div className="p-3 bg-blue-100 rounded-xl text-blue-600">
                            <AlertCircle className="w-6 h-6" />
                        </div>
                        <div>
                            <h3 className="text-xl font-bold text-slate-900">Areas for Improvement</h3>
                            <p className="text-xs text-slate-400">From your lowest-scoring answers</p>
                        </div>
                    </div>

                    <ul className="space-y-3 mt-5">
                        {topImprovements.length > 0
                            ? topImprovements.map((imp, i) => (
                                <FeedbackItem key={i} text={imp} variant="improvement" index={i} />
                            ))
                            : <li className="text-slate-400 text-sm italic p-4">
                                No improvements recorded yet.
                              </li>
                        }
                    </ul>
                </motion.div>
            </div>
        </div>
    );
};

export default InterviewReport;
