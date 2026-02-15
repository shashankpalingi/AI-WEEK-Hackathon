import React, { useState, useEffect } from 'react';
import { getStatus } from '../api';
import { Cpu, Database, FolderTree, RefreshCw, Activity } from 'lucide-react';
import { motion } from 'framer-motion';

const StatusPanel = () => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);

    const fetchData = async () => {
        try {
            const res = await getStatus();
            setData(res.data);
        } catch (err) {
            console.error('Status fetch error:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
        const interval = setInterval(fetchData, 5000);
        return () => clearInterval(interval);
    }, []);

    const stats = [
        {
            label: 'Status',
            value: data?.status || 'Active',
            icon: Cpu,
            color: 'text-blue-400',
            bg: 'bg-blue-500/10'
        },
        {
            label: 'Clusters',
            value: data?.clusters || 0,
            icon: FolderTree,
            color: 'text-purple-400',
            bg: 'bg-purple-500/10'
        },
        {
            label: 'Indexed',
            value: data?.files || 0,
            icon: Database,
            color: 'text-emerald-400',
            bg: 'bg-emerald-500/10'
        },
    ];

    return (
        <div className="glass-card flex flex-col gap-4 shrink-0">
            <div className="flex items-center justify-between">
                <h2 className="text-sm font-semibold flex items-center gap-2 text-slate-400 uppercase tracking-widest">
                    <Activity size={16} className="text-blue-400" />
                    Metrics
                </h2>
                {loading && <RefreshCw size={12} className="animate-spin text-slate-600" />}
            </div>

            <div className="grid grid-cols-1 gap-3">
                {stats.map((stat, idx) => (
                    <motion.div
                        key={stat.label}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: idx * 0.05 }}
                        className="flex items-center justify-between p-3 rounded-xl bg-white/5 border border-white/5 hover:bg-white/10 transition-all group"
                    >
                        <div className="flex items-center gap-3">
                            <div className={`p-2 rounded-lg ${stat.bg} ${stat.color}`}>
                                <stat.icon size={16} />
                            </div>
                            <span className="text-xs font-medium text-slate-400">{stat.label}</span>
                        </div>
                        <span className="text-sm font-bold font-mono tracking-tight text-slate-100">
                            {stat.value}
                        </span>
                    </motion.div>
                ))}
            </div>
        </div>
    );
};

export default StatusPanel;
