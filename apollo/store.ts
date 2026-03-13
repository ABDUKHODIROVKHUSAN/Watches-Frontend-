import { makeVar } from '@apollo/client';

export interface UserPayload {
	_id: string;
	memberType: string;
	role: string;
	sellerStatus: string;
	sellerRequestedAt?: string;
	memberStatus: string;
	memberAuthType: string;
	memberPhone: string;
	memberEmail: string;
	memberNick: string;
	memberFullName: string;
	memberImage: string;
	memberAddress: string;
	memberDesc: string;
	memberWatches: number;
	memberRank: number;
	memberArticles: number;
	memberPoints: number;
	memberLikes: number;
	memberViews: number;
	memberWarnings: number;
	memberBlocks: number;
}

export const userVar = makeVar<UserPayload>({
	_id: '',
	memberType: '',
	role: '',
	sellerStatus: '',
	sellerRequestedAt: '',
	memberStatus: '',
	memberAuthType: '',
	memberPhone: '',
	memberEmail: '',
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
