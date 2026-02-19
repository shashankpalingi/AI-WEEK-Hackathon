import React from 'react';
import SemanticWorkspace from './components/SemanticWorkspace';
import { ThemeProvider } from './context/ThemeContext';
import './App.css';

function App() {
  return (
    <ThemeProvider>
      <div className="App">
        <SemanticWorkspace />
      </div>
    </ThemeProvider>
  );
}

export default App;


