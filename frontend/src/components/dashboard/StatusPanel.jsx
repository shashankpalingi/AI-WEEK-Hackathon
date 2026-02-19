import React from 'react';
import { Zap, Layers, FileText, Radio } from 'lucide-react';
import './StatusPanel.css';

const StatusPanel = ({ status }) => {
    const isOnline = status?.status === 'online';

    return (
        <div className="status-panel">
            <div className="panel-header">
                <h2 className="panel-title">System Status</h2>
                <div className={`system-dot ${isOnline ? 'online' : 'offline'}`} />
            </div>

            <div className="status-cards">
                {/* System Health */}
                <div className="status-card">
                    <div className={`card-icon ${isOnline ? 'icon-success' : 'icon-error'}`}>
                        <Zap size={18} />
                    </div>
                    <div className="card-content">
                        <span className="card-label">System</span>
                        <span className={`card-value ${isOnline ? 'online' : 'offline'}`}>
                            {status ? (isOnline ? 'Online' : 'Offline') : 'Loading...'}
                        </span>
                    </div>
                </div>

                {/* Clusters */}
                <div className="status-card">
                    <div className="card-icon icon-accent">
                        <Layers size={18} />
                    </div>
                    <div className="card-content">
                        <span className="card-label">Clusters</span>
                        <span className="card-value">
                            {status?.clusters !== undefined ? status.clusters : '—'}
                        </span>
                    </div>
                </div>

                {/* Files Indexed */}
                <div className="status-card">
                    <div className="card-icon icon-purple">
                        <FileText size={18} />
                    </div>
                    <div className="card-content">
                        <span className="card-label">Files Indexed</span>
                        <span className="card-value">
                            {status?.files_indexed !== undefined ? status.files_indexed : '—'}
                        </span>
                    </div>
                </div>

                {/* Live Monitoring */}
                <div className="status-card">
                    <div className="card-icon icon-success">
                        <Radio size={18} />
                    </div>
                    <div className="card-content">
                        <span className="card-label">Live Monitoring</span>
                        <span className="card-value active">
                            <span className="live-dot" />
                            Active
                        </span>
                    </div>
                </div>
            </div>

            {/* Additional Info */}
            <div className="panel-footer">
                <div className="info-item">
                    <span className="info-label">Last Updated</span>
                    <span className="info-value">
                        {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                </div>
            </div>
        </div>
    );
};

export default StatusPanel;
