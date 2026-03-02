export type StoredPaymentDetails = {
	cardHolder: string;
	cardType: string;
	cardNumber: string;
	cardCvc: string;
	cardExpiry: string;
};

const PAYMENT_KEY_PREFIX = 'timeless:payment:';
const ALLOWED_CARD_TYPES = ['VISA', 'MASTERCARD', 'DOMESTIC'];

const getPaymentStorageKey = (memberId?: string) => `${PAYMENT_KEY_PREFIX}${memberId || 'guest'}`;

const defaultPaymentDetails: StoredPaymentDetails = {
	cardHolder: '',
	cardType: 'VISA',
	cardNumber: '',
	cardCvc: '',
	cardExpiry: '',
};

export const getPaymentDetails = (memberId?: string): StoredPaymentDetails => {
	if (typeof window === 'undefined') return defaultPaymentDetails;
	try {
		const raw = localStorage.getItem(getPaymentStorageKey(memberId));
		if (!raw) return defaultPaymentDetails;
		const parsed = JSON.parse(raw);
		return {
			cardHolder: String(parsed?.cardHolder || ''),
			cardType: String(parsed?.cardType || 'VISA'),
			cardNumber: String(parsed?.cardNumber || ''),
			cardCvc: String(parsed?.cardCvc || ''),
			cardExpiry: String(parsed?.cardExpiry || ''),
		};
	} catch {
		return defaultPaymentDetails;
	}
};

export const setPaymentDetails = (details: StoredPaymentDetails, memberId?: string) => {
	if (typeof window === 'undefined') return;
	localStorage.setItem(getPaymentStorageKey(memberId), JSON.stringify(details));
};

const isFutureOrCurrentExpiry = (value: string): boolean => {
	const match = value.match(/^(0[1-9]|1[0-2])\/(\d{2})$/);
	if (!match) return false;
	const month = Number(match[1]);
	const year2 = Number(match[2]);
	const now = new Date();
	const currentYear2 = now.getFullYear() % 100;
	const currentMonth = now.getMonth() + 1;
	return year2 > currentYear2 || (year2 === currentYear2 && month >= currentMonth);
};

export const isPaymentDetailsComplete = (details: StoredPaymentDetails): boolean => {
	const holder = (details.cardHolder || '').trim();
	const type = (details.cardType || '').trim().toUpperCase();
	const number = (details.cardNumber || '').replace(/\s+/g, '');
	const cvc = (details.cardCvc || '').trim();
	const expiry = (details.cardExpiry || '').trim();

	if (holder.length < 3) return false;
	if (!ALLOWED_CARD_TYPES.includes(type)) return false;
	if (!/^\d{13,19}$/.test(number)) return false;
	if (!/^\d{3,4}$/.test(cvc)) return false;
	if (!isFutureOrCurrentExpiry(expiry)) return false;
	return true;
};
