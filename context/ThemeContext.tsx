import React, { createContext, useContext, useEffect, useState } from 'react';
import { useColorScheme } from 'nativewind';
import { Storage } from '../utils/storage';

type Theme = 'light' | 'dark' | 'system';
export type FontSize = 'small' | 'medium' | 'large' | 'xlarge';

interface ThemeContextType {
    theme: Theme;
    setTheme: (theme: Theme) => void;
    isDark: boolean;
    fontSize: FontSize;
    setFontSize: (size: FontSize) => void;
    fontScale: number; // Helper for numeric calculations
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const THEME_KEY = 'yamibo_theme_preference';
export const FONT_SIZE_KEY = 'yamibo_font_size_preference';

export function ThemeProvider({ children }: { children: React.ReactNode }) {
    const { colorScheme, setColorScheme } = useColorScheme();
    const [theme, setThemeState] = useState<Theme>('system');
    const [fontSize, setFontSizeState] = useState<FontSize>('medium');

    // Load saved settings on mount
    useEffect(() => {
        const loadSettings = async () => {
            const savedTheme = await Storage.getItem(THEME_KEY);
            if (savedTheme === 'light' || savedTheme === 'dark' || savedTheme === 'system') {
                setThemeState(savedTheme);
                setColorScheme(savedTheme);
            }

            const savedFontSize = await Storage.getItem(FONT_SIZE_KEY);
            if (savedFontSize === 'small' || savedFontSize === 'medium' || savedFontSize === 'large' || savedFontSize === 'xlarge') {
                setFontSizeState(savedFontSize as FontSize);
            }
        };
        loadSettings();
    }, []);

    const setTheme = async (newTheme: Theme) => {
        setThemeState(newTheme);
        await Storage.setItem(THEME_KEY, newTheme);
        setColorScheme(newTheme);
    };

    const setFontSize = async (newSize: FontSize) => {
        setFontSizeState(newSize);
        await Storage.setItem(FONT_SIZE_KEY, newSize);
    };

    const isDark = colorScheme === 'dark';

    // Map size labels to scale multipliers or base pixel values
    const fontScaleMap: Record<FontSize, number> = {
        small: 0.875,  // 14px
        medium: 1,     // 16px
        large: 1.125,  // 18px
        xlarge: 1.25   // 20px
    };
    const fontScale = fontScaleMap[fontSize];

    return (
        <ThemeContext.Provider value={{ theme, setTheme, isDark, fontSize, setFontSize, fontScale }}>
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
