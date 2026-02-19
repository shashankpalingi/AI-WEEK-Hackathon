import React from 'react';
import { Moon, Sun } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import './ThemeToggle.css';

const ThemeToggle = () => {
    const { theme, toggleTheme } = useTheme();

    return (
        <button
            className="theme-toggle-btn"
            onClick={toggleTheme}
            aria-label="Toggle theme"
            title={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
        >
            {theme === 'light' ? <Moon size={18} /> : <Sun size={18} />}
        </button>
    );
};

export default ThemeToggle;
