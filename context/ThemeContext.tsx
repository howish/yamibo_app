import React, { createContext, useContext, useEffect, useState } from 'react';
import { useColorScheme } from 'nativewind';
import { Storage } from '../utils/storage';

type Theme = 'light' | 'dark' | 'system';

interface ThemeContextType {
    theme: Theme;
    setTheme: (theme: Theme) => void;
    isDark: boolean;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const THEME_KEY = 'yamibo_theme_preference';

export function ThemeProvider({ children }: { children: React.ReactNode }) {
    const { colorScheme, setColorScheme } = useColorScheme();
    const [theme, setThemeState] = useState<Theme>('system');

    // Load saved theme on mount
    useEffect(() => {
        const loadTheme = async () => {
            const savedTheme = await Storage.getItem(THEME_KEY);
            if (savedTheme === 'light' || savedTheme === 'dark' || savedTheme === 'system') {
                setThemeState(savedTheme);
                setColorScheme(savedTheme);
            }
        };
        loadTheme();
    }, []);

    const setTheme = async (newTheme: Theme) => {
        setThemeState(newTheme);
        await Storage.setItem(THEME_KEY, newTheme);
        setColorScheme(newTheme);
    };

    const isDark = colorScheme === 'dark';

    return (
        <ThemeContext.Provider value={{ theme, setTheme, isDark }}>
            {children}
        </ThemeContext.Provider>
    );
}

export function useTheme() {
    const context = useContext(ThemeContext);
    if (context === undefined) {
        throw new Error('useTheme must be used within a ThemeProvider');
    }
    return context;
}
