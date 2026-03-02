export type CartItem = {
	_id: string;
	watchTitle: string;
	watchBrand: string;
	watchPrice: number;
	watchImage?: string;
	qty: number;
};

const getCartStorageKey = (memberId?: string) => `timeless:cart:${memberId || 'guest'}`;

export const getCartItems = (memberId?: string): CartItem[] => {
	if (typeof window === 'undefined') return [];
	try {
		const raw = localStorage.getItem(getCartStorageKey(memberId));
		if (!raw) return [];
		const parsed = JSON.parse(raw);
		return Array.isArray(parsed) ? parsed : [];
	} catch {
		return [];
	}
};

const setCartItems = (items: CartItem[], memberId?: string) => {
	if (typeof window === 'undefined') return;
	localStorage.setItem(getCartStorageKey(memberId), JSON.stringify(items));
	window.dispatchEvent(new Event('cart-updated'));
};

export const addToCart = (item: Omit<CartItem, 'qty'>, memberId?: string) => {
	const current = getCartItems(memberId);
	const existingIndex = current.findIndex((ele) => ele._id === item._id);
	if (existingIndex >= 0) {
		current[existingIndex].qty += 1;
		setCartItems(current, memberId);
		return;
	}
	setCartItems([...current, { ...item, qty: 1 }], memberId);
};

export const removeFromCart = (watchId: string, memberId?: string) => {
	const current = getCartItems(memberId).filter((ele) => ele._id !== watchId);
	setCartItems(current, memberId);
};

export const clearCart = (memberId?: string) => {
	setCartItems([], memberId);
};

export const getCartCount = (memberId?: string): number => {
	return getCartItems(memberId).reduce((sum, item) => sum + (item.qty || 0), 0);
};
