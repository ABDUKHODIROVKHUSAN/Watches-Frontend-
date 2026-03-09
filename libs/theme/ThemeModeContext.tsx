import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { CssBaseline } from '@mui/material';
import { ThemeProvider, createTheme } from '@mui/material/styles';

type ThemeMode = 'light' | 'dark';

type ThemeModeContextValue = {
	mode: ThemeMode;
	isDark: boolean;
	toggleMode: () => void;
	setMode: (mode: ThemeMode) => void;
};

const STORAGE_KEY = 'site-theme-mode';

const ThemeModeContext = createContext<ThemeModeContextValue>({
	mode: 'light',
	isDark: false,
	toggleMode: () => {},
	setMode: () => {},
});

export const ThemeModeProvider = ({ children }: { children: React.ReactNode }) => {
	const [mode, setModeState] = useState<ThemeMode>('light');

	useEffect(() => {
		if (typeof window === 'undefined') return;
		const saved = localStorage.getItem(STORAGE_KEY) as ThemeMode | null;
		if (saved === 'dark' || saved === 'light') setModeState(saved);
	}, []);

	useEffect(() => {
		if (typeof document === 'undefined') return;
		document.documentElement.setAttribute('data-theme', mode);
		document.body.setAttribute('data-theme', mode);
	}, [mode]);

	const setMode = (nextMode: ThemeMode) => {
		setModeState(nextMode);
		if (typeof window !== 'undefined') localStorage.setItem(STORAGE_KEY, nextMode);
	};

	const toggleMode = () => setMode(mode === 'dark' ? 'light' : 'dark');

	const theme = useMemo(
		() =>
			createTheme({
				palette: {
					mode,
					primary: { main: mode === 'dark' ? '#f3f4f6' : '#111111' },
					secondary: { main: '#D4AF37' },
					background: {
						default: mode === 'dark' ? '#0b0f16' : '#FAFAFA',
						paper: mode === 'dark' ? '#101722' : '#FFFFFF',
					},
					text: {
						primary: mode === 'dark' ? '#E5E7EB' : '#111111',
						secondary: mode === 'dark' ? '#9CA3AF' : '#555555',
					},
				},
				typography: {
					fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
				},
			}),
		[mode],
	);

	return (
		<ThemeModeContext.Provider value={{ mode, isDark: mode === 'dark', toggleMode, setMode }}>
			<ThemeProvider theme={theme}>
				<CssBaseline />
				{children}
			</ThemeProvider>
		</ThemeModeContext.Provider>
	);
};

export const useThemeMode = () => useContext(ThemeModeContext);
