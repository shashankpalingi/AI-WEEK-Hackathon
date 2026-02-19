import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Brain, Bell, User } from 'lucide-react';
import FileUpload from './FileUpload';
import SearchPanel from './SearchPanel';
import ChatAssistant from './ChatAssistant';
import Sidebar from './Sidebar';
import DendrogramChart from '../ui/dendrogram';
import ThemeToggle from './ThemeToggle';
import './SemanticWorkspace.css';

const SemanticWorkspace = () => {
  const [files, setFiles] = useState([]);
  const [systemStatus, setSystemStatus] = useState(null);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  // Refs to compare before setting state (avoids unnecessary re-renders)
  const filesRef = useRef('[]');
  const statusRef = useRef('null');

  // Fetch files list — only update state if data changed
  const fetchFiles = useCallback(async () => {
    try {
      const response = await fetch('http://127.0.0.1:8000/files');
      if (response.ok) {
        const data = await response.json();
        const json = JSON.stringify(data);
        if (json !== filesRef.current) {
          filesRef.current = json;
          setFiles(data);
        }
      }
    } catch (error) {
      console.error('Failed to fetch files:', error);
    }
  }, []);

  // Fetch system status — only update state if data changed
  const fetchStatus = useCallback(async () => {
    try {
      const response = await fetch('http://127.0.0.1:8000/status');
      if (response.ok) {
        const data = await response.json();
        const json = JSON.stringify(data);
        if (json !== statusRef.current) {
          statusRef.current = json;
          setSystemStatus(data);
        }
      }
    } catch (error) {
      console.error('Failed to fetch status:', error);
    }
  }, []);

  useEffect(() => {
    fetchFiles();
    fetchStatus();

    // Poll status + files every 5 seconds
    const interval = setInterval(() => {
      fetchStatus();
      fetchFiles();
    }, 5000);
    return () => clearInterval(interval);
  }, [refreshTrigger]);

  const handleUploadSuccess = () => {
    setRefreshTrigger(prev => prev + 1);
  };

  return (
    <div className="semantic-workspace">
      {/* Top Navigation Bar */}
      <nav className="top-nav">
        <div className="nav-content">
          <div className="nav-left">
            <div className="nav-brand">
              <div className="brand-icon">
                <Brain size={22} />
              </div>
              <span className="brand-name">Knowledge Workspace</span>
            </div>
          </div>

          <div className="nav-search">
            <SearchPanel />
          </div>

          <div className="nav-right">
            <ThemeToggle />
            <button className="nav-icon-btn" aria-label="Notifications">
              <Bell size={18} />
            </button>
            <div className="nav-avatar">
              <User size={16} />
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content Area */}
      <div className="main-content">
        {/* Left Sidebar - File Tree & Status */}
        <aside className="left-panel">
          <Sidebar files={files} status={systemStatus} />
        </aside>

        {/* Center - Knowledge Workspace */}
        <main className="center-panel">
          <FileUpload onUploadSuccess={handleUploadSuccess} />
          <DendrogramChart files={files} />
        </main>

        {/* Right Panel - AI Assistant */}
        <aside className="right-panel">
          <ChatAssistant />
        </aside>
      </div>
    </div>
  );
};

export default SemanticWorkspace;
