import React from 'react';
import { FileText, File, FolderOpen, Eye } from 'lucide-react';
import './FileList.css';

const FileList = ({ files }) => {
    const getFileIcon = (filePath) => {
        if (!filePath) return <File size={16} />;
        if (filePath.endsWith('.pdf')) return <FileText size={16} />;
        if (filePath.endsWith('.txt')) return <File size={16} />;
        return <File size={16} />;
    };

    const getFileName = (filePath) => {
        if (!filePath) return 'Unknown file';
        return filePath.split('/').pop();
    };

    if (!files || files.length === 0) {
        return (
            <div className="file-list-container">
                <h2 className="section-title">Indexed Files</h2>
                <div className="empty-state">
                    <FolderOpen size={32} className="empty-icon-svg" />
                    <p>No files indexed yet</p>
                    <span className="empty-subtitle">Upload files to get started</span>
                </div>
            </div>
        );
    }

    return (
        <div className="file-list-container">
            <h2 className="section-title">
                Indexed Files
                <span className="file-count">{files.length}</span>
            </h2>

            <div className="file-list">
                {files.map((file, index) => (
                    <div key={index} className="file-item">
                        <div className="file-icon-wrapper">
                            {getFileIcon(file.file)}
                        </div>

                        <div className="file-info">
                            <h3 className="file-name">{getFileName(file.file)}</h3>
                            <div className="file-meta">
                                {(file.word_count || file.metadata?.words) && (
                                    <span className="meta-item">
                                        {file.word_count || file.metadata?.words} words
                                    </span>
                                )}
                                {file.cluster_id !== undefined && (
                                    <span className="meta-item cluster-badge">
                                        Cluster {file.cluster_id}
                                    </span>
                                )}
                            </div>
                        </div>

                        <div className="file-actions">
                            <button className="action-btn" title="View details">
                                <Eye size={14} />
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default FileList;
