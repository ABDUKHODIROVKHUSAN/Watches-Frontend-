import { gql } from '@apollo/client';

export const UPDATE_MEMBER_BY_ADMIN = gql`
	mutation UpdateMemberByAdmin($input: MemberUpdate!) {
		updateMemberByAdmin(input: $input) {
			_id
			memberType
			memberStatus
			memberNick
			memberPhone
			updatedAt
		}
	}
`;

export const UPDATE_WATCH_BY_ADMIN = gql`
	mutation UpdateWatchByAdmin($input: WatchUpdate!) {
		updateWatchByAdmin(input: $input) {
			_id
			watchStatus
			soldAt
			deletedAt
			updatedAt
		}
	}
`;

export const REMOVE_WATCH_BY_ADMIN = gql`
	mutation RemoveWatchByAdmin($input: String!) {
		removeWatchByAdmin(watchId: $input) {
			_id
		}
	}
`;
