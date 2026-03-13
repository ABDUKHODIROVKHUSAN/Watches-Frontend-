const normalizeHttpUrl = (value?: string): string => {
	const raw = String(value || '').trim();
	if (!raw) return '';

	const fixedPortTypo = raw.replace(/\/:(\d+)/, ':$1');
	return fixedPortTypo.replace(/\/+$/, '');
};

const remapLocalhostHostForBrowser = (url: string): string => {
	if (!url || typeof window === 'undefined') return url;
	const localHostPattern = /^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/i;
	if (!localHostPattern.test(url)) return url;

	try {
		const parsed = new URL(url);
		parsed.hostname = window.location.hostname;
		return parsed.toString().replace(/\/+$/, '');
	} catch (err) {
		return url;
	}
};

const API_URL = remapLocalhostHostForBrowser(normalizeHttpUrl(process.env.REACT_APP_API_URL));
const API_GRAPHQL_URL = normalizeHttpUrl(process.env.REACT_APP_API_GRAPHQL_URL || `${API_URL}/graphql`);

export const REACT_APP_API_URL = API_URL;
export const REACT_APP_API_GRAPHQL_URL = API_GRAPHQL_URL;

export const Messages = {
	error1: 'Something went wrong!',
	error2: 'Please login first!',
	error3: 'Please fulfill all inputs!',
	error4: 'Message is empty!',
	error5: 'Only images with jpeg, jpg, png format allowed!',
};
