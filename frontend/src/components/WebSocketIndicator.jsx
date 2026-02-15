import React, { useState, useEffect } from 'react';
import { getWebSocketUrl } from '../api';
import { Activity, Radio } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const WebSocketIndicator = () => {
    const [status, setStatus] = useState('connecting');

    useEffect(() => {
        let ws;
        const connect = () => {
            ws = new WebSocket(getWebSocketUrl());

            ws.onopen = () => setStatus('connected');
            ws.onclose = () => {
                setStatus('disconnected');
                // Try to reconnect after 5 seconds
                setTimeout(connect, 5000);
            };
            ws.onerror = () => setStatus('error');
        };

        connect();
        return () => ws?.close();
    }, []);

    const getStatusConfig = () => {
        switch (status) {
            case 'connected':
                return {
                    color: 'text-emerald-400',
                    bg: 'bg-emerald-400/10',
                    text: 'Live Monitoring Active',
                    iconColor: 'emerald'
                };
            case 'disconnected':
                return {
                    color: 'text-rose-400',
                    bg: 'bg-rose-400/10',
                    text: 'Connection Lost',
                    iconColor: 'rose'
                };
            default:
                return {
                    color: 'text-amber-400',
                    bg: 'bg-amber-400/10',
                    text: 'Establishing Connection...',
                    iconColor: 'amber'
                };
        }
    };

    const config = getStatusConfig();

    return (
        <div className={`flex items-center gap-3 px-4 py-2 rounded-full ${config.bg} ${config.color} border border-white/5 transition-all duration-500`}>
            <div className="relative flex items-center justify-center">
                {status === 'connected' && (
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75"></span>
                )}
                <Radio size={16} />
            </div>
            <span className="text-sm font-medium tracking-wide">
                {config.text}
            </span>
        </div>
    );
};

export default WebSocketIndicator;
