import React, { useState, useRef, useEffect } from 'react';
import { askAI } from '../../api';
import { MessageSquare, Send, Sparkles, FileText, Bot, User, Share2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const AskAI = () => {
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
        <div className="glass-card flex flex-col gap-4 h-full overflow-hidden">
            <div className="flex items-center justify-between shrink-0">
                <h2 className="text-sm font-semibold flex items-center gap-2 text-slate-400 uppercase tracking-widest">
                    <Sparkles size={16} className="text-amber-400" />
                    Knowledge Hub
                </h2>
                <span className="text-[10px] text-slate-600 font-mono font-bold tracking-tight bg-amber-500/5 px-2 py-0.5 rounded border border-amber-500/10 uppercase">
                    RAG Context Enabled
                </span>
            </div>

            <div
                ref={scrollRef}
                className="flex-1 overflow-y-auto pr-2 custom-scrollbar min-h-0 space-y-6 scroll-smooth"
            >
                {messages.length === 0 ? (
                    <div className="h-full flex flex-col items-center justify-center text-slate-600 py-12 text-center p-8">
                        <div className="p-4 rounded-full bg-white/2 border border-white/5 mb-4">
                            <Bot size={32} className="text-slate-500" />
                        </div>
                        <h3 className="text-sm font-bold text-slate-400 mb-2">Ask your repository anything</h3>
                        <p className="text-xs max-w-[240px] leading-relaxed mx-auto italic">
                            "What are the main architectural patterns used in this project?"
                        </p>
                    </div>
                ) : (
                    messages.map((msg, idx) => (
                        <motion.div
                            key={idx}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className={`flex gap-4 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                        >
                            {msg.role === 'assistant' && (
                                <div className="p-2 rounded-lg bg-amber-500/10 text-amber-500 h-fit shrink-0 border border-amber-500/10">
                                    <Bot size={16} />
                                </div>
                            )}
                            <div className={`max-w-[85%] flex flex-col gap-2 ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
                                <div className={`p-4 rounded-2xl text-sm leading-relaxed ${msg.role === 'user'
                                    ? 'bg-blue-600 text-white rounded-tr-none shadow-lg shadow-blue-600/10'
                                    : msg.error
                                        ? 'bg-red-500/10 border border-red-500/20 text-red-400 font-medium'
                                        : 'bg-white/5 border border-white/5 text-slate-200 rounded-tl-none'
                                    }`}>
                                    <p className="whitespace-pre-wrap">{msg.content}</p>
                                </div>

                                {msg.sources && msg.sources.length > 0 && (
                                    <div className="flex flex-col gap-2 w-full mt-1">
                                        <div className="flex items-center gap-2 text-[10px] text-slate-500 font-bold uppercase tracking-widest pl-1">
                                            <Share2 size={10} /> Verified Sources
                                        </div>
                                        <div className="flex flex-wrap gap-2">
                                            {msg.sources.map((src, sIdx) => (
                                                <div
                                                    key={sIdx}
                                                    className="flex items-center gap-1.5 px-2 py-1 rounded-md bg-white/2 border border-white/5 text-[11px] text-slate-400 hover:text-white transition-colors cursor-default"
                                                    title={src}
                                                >
                                                    <FileText size={10} className="text-slate-600 shrink-0" />
                                                    <span className="truncate max-w-[120px]">
                                                        {src.split('/').pop()}
                                                    </span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                            {msg.role === 'user' && (
                                <div className="p-2 rounded-lg bg-blue-500/10 text-blue-500 h-fit shrink-0 border border-blue-500/10">
                                    <User size={16} />
                                </div>
                            )}
                        </motion.div>
                    ))
                )}
                {loading && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="flex gap-4"
                    >
                        <div className="p-2 rounded-lg bg-amber-500/10 text-amber-500 h-fit shrink-0 border border-amber-500/10">
                            <Bot size={16} />
                        </div>
                        <div className="flex space-x-2 items-center p-4 bg-white/5 border border-white/5 rounded-2xl rounded-tl-none">
                            <div className="w-1.5 h-1.5 bg-amber-500 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                            <div className="w-1.5 h-1.5 bg-amber-500 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                            <div className="w-1.5 h-1.5 bg-amber-500 rounded-full animate-bounce"></div>
                        </div>
                    </motion.div>
                )}
            </div>

            <form onSubmit={handleAsk} className="relative mt-4 shrink-0 overflow-hidden rounded-2xl border border-white/5 bg-white/2 group transition-all focus-within:border-amber-500/30">
                <textarea
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    onKeyDown={(e) => {
                        if (e.key === 'Enter' && !e.shiftKey) {
                            e.preventDefault();
                            handleAsk(e);
                        }
                    }}
                    placeholder="Ask a question about your indexed files..."
                    className="w-full bg-transparent min-h-[100px] max-h-[200px] pl-4 pr-14 pt-4 pb-4 text-sm text-slate-200 placeholder:text-slate-600 resize-none focus:outline-none custom-scrollbar"
                />
                <button
                    type="submit"
                    disabled={!query.trim() || loading}
                    className="absolute right-4 bottom-4 p-2.5 rounded-xl bg-amber-600 text-white shadow-lg shadow-amber-600/20 hover:bg-amber-500 disabled:opacity-30 disabled:shadow-none transition-all"
                >
                    <Send size={18} />
                </button>
            </form>
        </div>
    );
};

export default AskAI;
