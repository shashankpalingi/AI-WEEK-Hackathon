import React from 'react';
import { ThemeProvider } from '../context/ThemeContext';
import SemanticWorkspace from '../components/dashboard/SemanticWorkspace';

export default function Dashboard() {
    return (
        <ThemeProvider>
            <div className="App" style={{ width: '100%', minHeight: '100vh', margin: 0, padding: 0 }}>
                <SemanticWorkspace />
            </div>
        </ThemeProvider>
    );
}
