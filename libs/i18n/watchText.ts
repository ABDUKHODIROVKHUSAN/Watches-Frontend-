import { AppLocale } from './translations';

type LocalizedText = {
	en?: string;
	ko?: string;
	uz?: string;
};

export const localizeWatchText = (
	baseText: string | undefined,
	i18n: LocalizedText | undefined,
	locale: AppLocale,
): string => {
	const candidates: Array<string | undefined> = [i18n?.[locale], i18n?.en, baseText];
	return candidates.find((item) => Boolean(item && item.trim()))?.trim() || '';
};
