import React, { useState } from 'react';
import { semanticSearch } from '../api';
import { Search, FileText, Target, ExternalLink } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const SearchBox = () => {
    const [query, setQuery] = useState('');
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(false);

    const handleSearch = async (e) => {
        e.preventDefault();
        if (!query.trim()) return;

        setLoading(true);
        try {
            const res = await semanticSearch(query);
            setResults(res.data.results || []);
        } catch (err) {
            console.error('Search error:', err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="glass-card flex flex-col gap-4 h-full overflow-hidden">
            <div className="flex items-center justify-between shrink-0">
                <h2 className="text-sm font-semibold flex items-center gap-2 text-slate-400 uppercase tracking-widest">
                    <Target size={16} className="text-blue-400" />
                    Knowledge Search
                </h2>
                <span className="text-[10px] text-slate-600 font-mono font-bold tracking-tight bg-blue-500/5 px-2 py-0.5 rounded border border-blue-500/10">
                    VECTOR MATCH
                </span>
            </div>

            <form onSubmit={handleSearch} className="relative group shrink-0">
                <input
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Describe what you're looking for..."
                    className="glass-input w-full pl-11 pr-4 h-11 text-sm text-slate-200 placeholder:text-slate-600 focus:ring-blue-500/30 border-white/5 bg-white/2"
                />
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600 group-focus-within:text-blue-400 transition-colors" size={18} />
                {loading && (
                    <div className="absolute right-4 top-1/2 -translate-y-1/2">
                        <div className="w-4 h-4 border-2 border-blue-500/20 border-t-blue-500 rounded-full animate-spin" />
                    </div>
                )}
            </form>

            <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar min-h-0 space-y-3">
                <AnimatePresence mode="popLayout">
                    {results.length === 0 ? (
                        !loading && (
                            <div className="h-full flex flex-col items-center justify-center text-slate-600 py-12 italic text-xs">
                                Enter a query to find semantic matches
                            </div>
                        )
                    ) : (
                        results.map((result, idx) => (
                            <motion.div
                                key={(result.file || result.filename) + idx}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: idx * 0.05 }}
                                className="group p-4 rounded-xl bg-white/2 border border-white/5 hover:border-blue-500/20 hover:bg-white/5 transition-all cursor-default"
                            >
                                <div className="flex items-start justify-between gap-4 mb-2">
                                    <div className="flex items-center gap-3 overflow-hidden">
                                        <div className="p-2 rounded-lg bg-blue-500/5 text-blue-400 shrink-0">
                                            <FileText size={14} />
                                        </div>
                                        <div className="min-w-0">
                                            <h3 className="text-sm font-bold text-slate-100 truncate group-hover:text-white transition-colors" title={result.file || result.filename}>
                                                {(result.file || result.filename || "Unknown").split('/').pop()}
                                            </h3>
                                            <div className="flex items-center gap-2 mt-0.5">
                                                <span className="text-[10px] text-blue-400/60 font-medium uppercase tracking-wider">
                                                    Cluster: {result.cluster_label || "Uncategorized"}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="shrink-0 text-right">
                                        <span className="text-[11px] font-mono font-bold text-emerald-400 bg-emerald-400/5 px-2 py-0.5 rounded">
                                            {(result.similarity * 100).toFixed(1)}%
                                        </span>
                                    </div>
                                </div>
                                <div className="flex items-center justify-between gap-4 mt-3 pt-3 border-t border-white/5">
                                    <span className="text-[10px] text-slate-600 truncate max-w-[200px]" title={result.file}>
                                        {result.file || result.filename}
                                    </span>
                                    <button className="text-[10px] font-bold text-slate-400 hover:text-white flex items-center gap-1 transition-colors uppercase tracking-widest">
                                        Open <ExternalLink size={10} />
                                    </button>
                                </div>
                            </motion.div>
                        ))
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
};

export default SearchBox;
