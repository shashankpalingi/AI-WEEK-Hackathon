import React from 'react';
import StatusPanel from './StatusPanel';
import ClusterViewer from './ClusterViewer';
import SearchBox from './SearchBox';
import KnowledgeHubAssistant from './knowledge/KnowledgeHubAssistant';
import WebSocketIndicator from './WebSocketIndicator';
import { Box, LayoutDashboard, Cpu } from 'lucide-react';

const Dashboard = () => {
    return (
        <div className="flex flex-col h-screen max-h-screen overflow-hidden bg-slate-950 text-slate-50 font-sans p-6 lg:p-8 relative">
            {/* Top Header */}
            <header className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 gap-4 shrink-0">
                <div className="flex items-center gap-4">
                    <div className="p-3 bg-blue-600 rounded-2xl shadow-lg shadow-blue-500/20">
                        <Box className="text-white" size={28} />
                    </div>
                    <div>
                        <h1 className="text-2xl lg:text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white via-white to-slate-500 tracking-tight">
                            Semantic File Intelligence
                        </h1>
                        <p className="text-sm text-slate-500 font-medium">Professional AI Repository Analysis</p>
                    </div>
                </div>
                <WebSocketIndicator />
            </header>

            {/* Main Structural Layout */}
            <main className="flex-1 flex flex-col lg:flex-row gap-6 min-h-0 overflow-hidden">

                {/* Left Column (Fixed Width 320px Sidebar) */}
                <aside className="w-full lg:w-[320px] flex flex-col gap-6 min-h-0 shrink-0">
                    <StatusPanel />
                    <ClusterViewer />
                </aside>

                {/* Right Column (Primary Content Area) */}
                <div className="flex-1 flex flex-col gap-6 min-h-0 relative">
                    <div className="flex-1 min-h-0">
                        <SearchBox />
                    </div>

                    {/* Knowledge Hub - Floating AI Assistant (Relative to Right Column) */}
                    <KnowledgeHubAssistant />
                </div>
            </main>

            {/* Desktop Footer */}
            <footer className="mt-8 flex items-center justify-between text-[11px] text-slate-600 font-mono tracking-widest uppercase shrink-0 border-t border-white/5 pt-4">
                <div className="flex items-center gap-6">
                    <span className="flex items-center gap-2">
                        <LayoutDashboard size={12} /> Dashboard View
                    </span>
                    <span className="flex items-center gap-2">
                        <Cpu size={12} /> Vercel Engine
                    </span>
                </div>
                <div>
                    Hackathon Edition v1.1.2 • Build Stable
                </div>
            </footer>
        </div>
    );
};

export default Dashboard;
