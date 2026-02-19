import React, { useState } from 'react';
import { Search, AlertCircle } from 'lucide-react';
import './SearchPanel.css';

const SearchPanel = () => {
    const [query, setQuery] = useState('');
    const [results, setResults] = useState([]);
    const [searching, setSearching] = useState(false);
    const [error, setError] = useState(null);
    const [showResults, setShowResults] = useState(false);

    const handleSearch = async (e) => {
        e.preventDefault();

        if (!query.trim()) return;

        setSearching(true);
        setError(null);

        try {
            const response = await fetch('http://127.0.0.1:8000/search', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ query: query.trim() }),
            });

            if (response.ok) {
                const data = await response.json();
                setResults(data.results || []);
                setShowResults(true);
            } else {
                throw new Error('Search failed');
            }
        } catch (err) {
            setError('Failed to search. Please try again.');
            setResults([]);
            setShowResults(true);
        } finally {
            setSearching(false);
        }
    };

    const getFileName = (filePath) => {
        if (!filePath) return 'Unknown file';
        return filePath.split('/').pop();
    };

    const handleBlur = (e) => {
        // Delay hiding so clicks on results can register
        setTimeout(() => {
            if (!e.currentTarget?.contains(document.activeElement)) {
                setShowResults(false);
            }
        }, 200);
    };

    return (
        <div className="search-panel-container" onBlur={handleBlur}>
            <form onSubmit={handleSearch} className="search-form">
                <div className="search-input-wrapper">
                    <Search size={15} className="search-icon-left" />
                    <input
                        type="text"
                        className="search-input"
                        placeholder="Search your knowledge base..."
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        onFocus={() => { if (results.length > 0 || error) setShowResults(true); }}
                        disabled={searching}
                    />
                    <span className="search-shortcut">⌘K</span>
                    <button
                        type="submit"
                        className="search-btn"
                        disabled={searching || !query.trim()}
                    >
                        {searching ? (
                            <div className="search-spinner" />
                        ) : (
                            <Search size={14} />
                        )}
                        <span>Search</span>
                    </button>
                </div>
            </form>

            {/* Dropdown results */}
            {showResults && (
                <div className="search-dropdown">
                    {error && (
                        <div className="search-error">
                            <AlertCircle size={14} />
                            {error}
                        </div>
                    )}

                    {results.length > 0 && (
                        <div className="search-results">
                            <div className="results-header">
                                <span className="results-count">{results.length} results found</span>
                            </div>

                            {results.map((result, index) => (
                                <div key={index} className="result-card">
                                    <div className="result-header">
                                        <h3 className="result-file">{getFileName(result.file)}</h3>
                                        <span className="similarity-score">
                                            {(result.similarity * 100).toFixed(1)}%
                                        </span>
                                    </div>

                                    {result.snippet && (
                                        <p className="result-snippet">{result.snippet}</p>
                                    )}

                                    <div className="result-footer">
                                        <span className="result-path">{result.file}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    {!searching && results.length === 0 && query && !error && (
                        <div className="empty-results">
                            <Search size={24} className="empty-search-icon" />
                            <p>No results found</p>
                            <span className="empty-subtitle">Try a different search query</span>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default SearchPanel;
