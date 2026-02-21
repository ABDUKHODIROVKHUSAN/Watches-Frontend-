import decodeJWT from 'jwt-decode';
import { initializeApollo } from '../../apollo/client';
import { userVar, UserPayload } from '../../apollo/store';
import { LOGIN, SIGN_UP } from '../../apollo/user/mutation';

export function getJwtToken(): any {
	if (typeof window !== 'undefined') {
		return localStorage.getItem('accessToken') ?? '';
	}
}

export function setJwtToken(token: string) {
	localStorage.setItem('accessToken', token);
}

export const logIn = async (nick: string, password: string): Promise<void> => {
	try {
		const { jwtToken } = await requestJwtToken({ nick, password });
		if (jwtToken) {
			updateStorage({ jwtToken });
			updateUserInfo(jwtToken);
		}
	} catch (err) {
		console.warn('login err', err);
		throw err;
	}
};

const requestJwtToken = async ({ nick, password }: { nick: string; password: string }): Promise<{ jwtToken: string }> => {
	const apolloClient = await initializeApollo();
	const result = await apolloClient.mutate({
		mutation: LOGIN,
		variables: { input: { memberNick: nick, memberPassword: password } },
		fetchPolicy: 'network-only',
	});
	const { accessToken } = result?.data?.login;
	return { jwtToken: accessToken };
};

export const signUp = async (nick: string, password: string, phone: string, type: string): Promise<void> => {
	try {
		const { jwtToken } = await requestSignUpJwtToken({ nick, password, phone, type });
		if (jwtToken) {
			updateStorage({ jwtToken });
			updateUserInfo(jwtToken);
		}
	} catch (err) {
		console.warn('signup err', err);
		throw err;
	}
};

const requestSignUpJwtToken = async ({ nick, password, phone, type }: { nick: string; password: string; phone: string; type: string }): Promise<{ jwtToken: string }> => {
	const apolloClient = await initializeApollo();
	const result = await apolloClient.mutate({
		mutation: SIGN_UP,
		variables: {
			input: { memberNick: nick, memberPassword: password, memberPhone: phone, memberType: type },
		},
		fetchPolicy: 'network-only',
	});
	const { accessToken } = result?.data?.signup;
	return { jwtToken: accessToken };
};

export const updateStorage = ({ jwtToken }: { jwtToken: any }) => {
	setJwtToken(jwtToken);
	window.localStorage.setItem('login', Date.now().toString());
};

export const updateUserInfo = (jwtToken: any) => {
	if (!jwtToken) return false;
	const claims = decodeJWT<UserPayload>(jwtToken);
	userVar({
		_id: claims._id ?? '',
		memberType: claims.memberType ?? '',
		memberStatus: claims.memberStatus ?? '',
		memberAuthType: claims.memberAuthType ?? '',
		memberPhone: claims.memberPhone ?? '',
		memberNick: claims.memberNick ?? '',
		memberFullName: claims.memberFullName ?? '',
		memberImage: claims.memberImage ? `${claims.memberImage}` : '/img/profile/defaultUser.svg',
		memberAddress: claims.memberAddress ?? '',
		memberDesc: claims.memberDesc ?? '',
		memberWatches: claims.memberWatches ?? 0,
		memberRank: claims.memberRank ?? 0,
		memberArticles: claims.memberArticles ?? 0,
		memberPoints: claims.memberPoints ?? 0,
		memberLikes: claims.memberLikes ?? 0,
		memberViews: claims.memberViews ?? 0,
		memberWarnings: claims.memberWarnings ?? 0,
		memberBlocks: claims.memberBlocks ?? 0,
	});
};

export const logOut = () => {
	localStorage.removeItem('accessToken');
	window.localStorage.setItem('logout', Date.now().toString());
	userVar({
		_id: '',
		memberType: '',
		memberStatus: '',
		memberAuthType: '',
		memberPhone: '',
		memberNick: '',
		memberFullName: '',
		memberImage: '',
		memberAddress: '',
		memberDesc: '',
		memberWatches: 0,
		memberRank: 0,
		memberArticles: 0,
		memberPoints: 0,
		memberLikes: 0,
		memberViews: 0,
		memberWarnings: 0,
		memberBlocks: 0,
	});
	window.location.reload();
};
