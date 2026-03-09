import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { AppLocale, DEFAULT_LOCALE, SUPPORTED_LOCALES, TRANSLATIONS } from './translations';

const STORAGE_KEY = 'site-locale';

type LanguageContextValue = {
	locale: AppLocale;
	setLocale: (locale: AppLocale) => void;
	t: (key: string) => string;
};

const LanguageContext = createContext<LanguageContextValue>({
	locale: DEFAULT_LOCALE,
	setLocale: () => {},
	t: (key: string) => key,
});

export const LanguageProvider = ({ children }: { children: React.ReactNode }) => {
	const [locale, setLocaleState] = useState<AppLocale>(DEFAULT_LOCALE);

	useEffect(() => {
		if (typeof window === 'undefined') return;
		const stored = localStorage.getItem(STORAGE_KEY) as AppLocale | null;
		if (stored && SUPPORTED_LOCALES.includes(stored)) setLocaleState(stored);
	}, []);

	const setLocale = (nextLocale: AppLocale) => {
		setLocaleState(nextLocale);
		if (typeof window !== 'undefined') localStorage.setItem(STORAGE_KEY, nextLocale);
	};

	const value = useMemo(
		() => ({
			locale,
			setLocale,
			t: (key: string) => TRANSLATIONS[locale]?.[key] ?? TRANSLATIONS.en[key] ?? key,
		}),
		[locale],
	);

	return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
};

export const useLanguage = () => useContext(LanguageContext);
