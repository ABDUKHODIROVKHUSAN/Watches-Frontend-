import { gql } from '@apollo/client';

export const SIGN_UP = gql`
	mutation Signup($input: MemberInput!) {
		signup(input: $input) {
			_id
			memberType
			memberStatus
			memberAuthType
			memberPhone
			memberNick
			memberFullName
			memberImage
			memberWatches
			memberRank
			memberPoints
			memberLikes
			memberViews
			accessToken
		}
	}
`;

export const LOGIN = gql`
	mutation Login($input: LoginInput!) {
		login(input: $input) {
			_id
			memberType
			memberStatus
			memberAuthType
			memberPhone
			memberNick
			memberFullName
			memberImage
			memberWatches
			memberRank
			memberPoints
			memberLikes
			memberViews
			accessToken
		}
	}
`;

export const UPDATE_MEMBER = gql`
	mutation UpdateMember($input: MemberUpdate!) {
		updateMember(input: $input) {
			_id
			memberType
			memberStatus
			memberNick
			memberFullName
			memberImage
			memberAddress
			memberDesc
			memberWatches
			memberRank
			memberPoints
			memberLikes
			memberViews
			accessToken
		}
	}
`;

export const LIKE_TARGET_WATCH = gql`
	mutation LikeTargetWatch($input: String!) {
		likeTargetWatch(watchId: $input) {
			_id
			watchTitle
			watchBrand
			watchLikes
		}
	}
`;

export const LIKE_TARGET_MEMBER = gql`
	mutation LikeTargetMember($input: String!) {
		likeTargetMember(memberId: $input) {
			_id
			memberNick
			memberLikes
		}
	}
`;
