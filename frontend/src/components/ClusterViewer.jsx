import React, { useState, useEffect } from 'react';
import { getClusters } from '../api';
import { FolderTree, FileText, ChevronRight, ChevronDown, RefreshCw } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const ClusterViewer = () => {
    const [clusters, setClusters] = useState({});
    const [openClusters, setOpenClusters] = useState({});
    const [loading, setLoading] = useState(true);

    const fetchClusters = async () => {
        try {
            const res = await getClusters();
            setClusters(res.data || {});
            // Open first cluster by default if it exists and no others are open
            if (Object.keys(res.data || {}).length > 0 && Object.keys(openClusters).length === 0) {
                setOpenClusters({ [Object.keys(res.data)[0]]: true });
            }
        } catch (err) {
            console.error('Cluster fetch error:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchClusters();
        const interval = setInterval(fetchClusters, 8000);
        return () => clearInterval(interval);
    }, []);

    const toggleCluster = (id) => {
        setOpenClusters(prev => ({ ...prev, [id]: !prev[id] }));
    };

    return (
        <div className="glass-card flex-1 min-h-0 flex flex-col gap-4 overflow-hidden">
            <div className="flex items-center justify-between shrink-0">
                <h2 className="text-sm font-semibold flex items-center gap-2 text-slate-400 uppercase tracking-widest">
                    <FolderTree size={16} className="text-purple-400" />
                    Semantic Folders
                </h2>
                {loading && <RefreshCw size={12} className="animate-spin text-slate-600" />}
            </div>

            <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar min-h-0 space-y-2">
                {Object.keys(clusters).length === 0 ? (
                    <div className="h-full flex flex-col items-center justify-center text-slate-600 italic py-12 text-sm">
                        No clusters found yet
                    </div>
                ) : (
                    Object.entries(clusters).map(([id, data]) => (
                        <div key={id} className="rounded-xl border border-white/5 bg-white/2 overflow-hidden transition-all duration-200">
                            <button
                                onClick={() => toggleCluster(id)}
                                className="w-full flex items-center justify-between p-3 hover:bg-white/5 transition-colors text-left group"
                            >
                                <div className="flex items-center gap-3 overflow-hidden">
                                    <div className="text-purple-400 shrink-0">
                                        {openClusters[id] ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
                                    </div>
                                    <span className="text-sm font-medium text-slate-200 truncate group-hover:text-white transition-colors">
                                        {data.label || id}
                                    </span>
                                </div>
                                <span className="text-[10px] px-2 py-0.5 rounded-full bg-purple-500/10 text-purple-400 font-mono font-bold shrink-0">
                                    {Object.keys(data.files || {}).length}
                                </span>
                            </button>

                            <AnimatePresence initial={false}>
                                {openClusters[id] && (
                                    <motion.div
                                        initial={{ height: 0, opacity: 0 }}
                                        animate={{ height: "auto", opacity: 1 }}
                                        exit={{ height: 0, opacity: 0 }}
                                        transition={{ duration: 0.2 }}
                                    >
                                        <div className="px-3 pb-3 pt-1 space-y-1 ml-4 border-l border-white/5">
                                            {Object.keys(data.files || {}).length === 0 ? (
                                                <div className="text-[11px] text-slate-600 italic py-1">No files in this cluster</div>
                                            ) : (
                                                Object.keys(data.files).map((filePath) => (
                                                    <div
                                                        key={filePath}
                                                        className="flex items-center gap-2 text-[12px] text-slate-400 p-1.5 rounded-lg hover:bg-white/5 group relative"
                                                        title={filePath} // Default tooltip for full path
                                                    >
                                                        <FileText size={12} className="text-slate-600 shrink-0" />
                                                        <span className="truncate">
                                                            {filePath.split('/').pop()}
                                                        </span>
                                                        {/* Full path on hover logic handled by browser tooltip or custom UI if needed */}
                                                    </div>
                                                ))
                                            )}
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default ClusterViewer;
