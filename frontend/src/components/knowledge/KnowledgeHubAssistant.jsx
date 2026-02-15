import React, { useState, useRef, useEffect } from 'react';
import { askAI } from '../../api';
import { MessageSquare, Send, Sparkles, FileText, Bot, User, Share2, X, Maximize2, Minimize2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const KnowledgeHubAssistant = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [query, setQuery] = useState('');
    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(false);
    const scrollRef = useRef(null);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages, loading]);

    const handleAsk = async (e) => {
        e.preventDefault();
        if (!query.trim() || loading) return;

        const userMsg = { role: 'user', content: query };
        setMessages(prev => [...prev, userMsg]);
        setQuery('');
        setLoading(true);

        try {
            const res = await askAI(userMsg.content);
            const aiMsg = {
                role: 'assistant',
                content: res.data.answer,
                sources: res.data.sources || []
            };
            setMessages(prev => [...prev, aiMsg]);
        } catch (err) {
            console.error('Ask error:', err);
            setMessages(prev => [...prev, {
                role: 'assistant',
                content: 'Error: Failed to reach the AI engine. Please check if the backend is running.',
                error: true
            }]);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="absolute inset-0 pointer-events-none z-50">
            {/* Pulsing 3D Floating Button (Visible when collapsed) */}
            <AnimatePresence>
                {!isOpen && (
                    <motion.button
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0, opacity: 0 }}
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => setIsOpen(true)}
                        className="pointer-events-auto absolute bottom-6 right-6 w-16 h-16 rounded-full bg-blue-600 flex items-center justify-center shadow-[0_0_20px_rgba(37,99,235,0.5)] group overflow-hidden"
                    >
                        <div className="absolute inset-0 bg-gradient-to-tr from-blue-400/20 to-transparent animate-pulse" />
                        <motion.div
                            animate={{
                                boxShadow: ["0 0 20px rgba(37,99,235,0.4)", "0 0 40px rgba(37,99,235,0.7)", "0 0 20px rgba(37,99,235,0.4)"]
                            }}
                            transition={{ repeat: Infinity, duration: 2 }}
                            className="absolute inset-0 rounded-full border-2 border-white/20"
                        />
                        <Sparkles size={28} className="text-white relative z-10 animate-spin-slow" />

                        {/* Status Indicator */}
                        <div className="absolute -top-1 -right-1 w-4 h-4 bg-emerald-500 rounded-full border-2 border-slate-900 z-20 shadow-lg" />
                    </motion.button>
                )}
            </AnimatePresence>

            {/* Expanded Chat Interface */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ scale: 0.8, opacity: 0, y: 20, transformOrigin: "bottom right" }}
                        animate={{ scale: 1, opacity: 1, y: 0 }}
                        exit={{ scale: 0.8, opacity: 0, y: 20 }}
                        className="pointer-events-auto absolute bottom-6 right-6 w-[450px] max-w-[calc(100vw-48px)] h-[480px] max-h-[calc(100vh-320px)] flex flex-col bg-slate-900/95 backdrop-blur-3xl rounded-3xl border border-white/10 shadow-[0_30px_60px_rgba(0,0,0,0.8)] overflow-hidden z-[200]"
                    >
                        {/* Header */}
                        <div className="p-4 border-b border-white/5 bg-gradient-to-r from-blue-600/10 to-purple-600/10 flex items-center justify-between shrink-0">
                            <div className="flex items-center gap-3">
                                <div className="p-2 rounded-xl bg-blue-500 shadow-lg shadow-blue-500/20">
                                    <Sparkles size={18} className="text-white" />
                                </div>
                                <div>
                                    <h2 className="text-sm font-bold tracking-tight text-white">Knowledge Assistant</h2>
                                    <div className="flex items-center gap-1.5 mt-0.5">
                                        <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
                                        <span className="text-[10px] text-slate-400 font-medium uppercase tracking-widest">Live Engine</span>
                                    </div>
                                </div>
                            </div>
                            <button
                                onClick={() => setIsOpen(false)}
                                className="p-2 hover:bg-white/5 rounded-lg text-slate-400 hover:text-white transition-colors"
                            >
                                <X size={18} />
                            </button>
                        </div>

                        {/* Message History */}
                        <div
                            ref={scrollRef}
                            className="flex-1 overflow-y-auto p-4 custom-scrollbar space-y-6 scroll-smooth"
                        >
                            {messages.length === 0 ? (
                                <div className="h-full flex flex-col items-center justify-center text-center p-8">
                                    <div className="w-16 h-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mb-4 shadow-xl">
                                        <Bot size={32} className="text-blue-400" />
                                    </div>
                                    <h3 className="text-sm font-bold text-slate-100 mb-2">Hello, I'm your AI Hub</h3>
                                    <p className="text-xs text-slate-500 leading-relaxed max-w-[200px]">
                                        Ask me anything about your indexed files and clusters.
                                    </p>
                                </div>
                            ) : (
                                messages.map((msg, idx) => (
                                    <motion.div
                                        key={idx}
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}
                                    >
                                        <div className={`w-8 h-8 rounded-lg shrink-0 flex items-center justify-center border ${msg.role === 'user'
                                            ? 'bg-blue-600 border-blue-500 shadow-blue-500/20'
                                            : 'bg-white/5 border-white/10'
                                            }`}>
                                            {msg.role === 'user' ? <User size={14} className="text-white" /> : <Bot size={14} className="text-blue-400" />}
                                        </div>
                                        <div className={`max-w-[80%] flex flex-col gap-2 ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
                                            <div className={`p-3 rounded-2xl text-sm leading-relaxed ${msg.role === 'user'
                                                ? 'bg-blue-600/90 text-white rounded-tr-sm'
                                                : msg.error
                                                    ? 'bg-red-500/10 border border-red-500/20 text-red-400'
                                                    : 'bg-white/5 border border-white/10 text-slate-200 rounded-tl-sm'
                                                }`}>
                                                <p className="whitespace-pre-wrap">{msg.content}</p>
                                            </div>

                                            {msg.sources && msg.sources.length > 0 && (
                                                <div className="flex flex-wrap gap-1.5 mt-1">
                                                    {msg.sources.map((src, sIdx) => (
                                                        <div
                                                            key={sIdx}
                                                            className="flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-white/5 border border-white/5 text-[9px] text-slate-500 hover:text-blue-400 hover:border-blue-500/30 transition-all cursor-pointer group/src"
                                                            title={src}
                                                        >
                                                            <FileText size={8} className="text-slate-600 group-hover/src:text-blue-500" />
                                                            <span className="truncate max-w-[80px]">
                                                                {src.split('/').pop()}
                                                            </span>
                                                        </div>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    </motion.div>
                                ))
                            )}
                            {loading && (
                                <div className="flex gap-3">
                                    <div className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center">
                                        <Bot size={14} className="text-blue-400" />
                                    </div>
                                    <div className="p-3 bg-white/5 border border-white/10 rounded-2xl rounded-tl-sm flex items-center gap-1.5">
                                        <div className="w-1 h-1 bg-blue-400 rounded-full animate-bounce" />
                                        <div className="w-1 h-1 bg-blue-400 rounded-full animate-bounce [animation-delay:-0.15s]" />
                                        <div className="w-1 h-1 bg-blue-400 rounded-full animate-bounce [animation-delay:-0.3s]" />
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Input Area */}
                        <div className="p-4 border-t border-white/5 bg-slate-900/50">
                            <form
                                onSubmit={handleAsk}
                                className="relative flex items-end gap-2 bg-white/5 border border-white/10 rounded-2xl p-2 transition-all focus-within:border-blue-500/50 focus-within:ring-1 focus-within:ring-blue-500/20"
                            >
                                <textarea
                                    value={query}
                                    onChange={(e) => setQuery(e.target.value)}
                                    onKeyDown={(e) => {
                                        if (e.key === 'Enter' && !e.shiftKey) {
                                            e.preventDefault();
                                            handleAsk(e);
                                        }
                                    }}
                                    placeholder="Ask anything..."
                                    className="flex-1 bg-transparent border-none text-sm text-slate-200 placeholder:text-slate-600 focus:ring-0 py-2 pl-2 resize-none max-h-32 min-h-10 custom-scrollbar"
                                    rows={1}
                                />
                                <button
                                    type="submit"
                                    disabled={!query.trim() || loading}
                                    className="p-2.5 rounded-xl bg-blue-600 text-white shadow-lg shadow-blue-600/20 hover:bg-blue-500 hover:scale-105 active:scale-95 disabled:opacity-30 disabled:scale-100 transition-all shrink-0"
                                >
                                    <Send size={18} />
                                </button>
                            </form>
                            <p className="text-[10px] text-slate-600 mt-3 text-center">
                                Grounded on indexed knowledge base
                            </p>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default KnowledgeHubAssistant;
