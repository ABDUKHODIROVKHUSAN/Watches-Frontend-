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

export const IMAGE_UPLOADER = gql`
	mutation ImageUploader($file: Upload!, $target: String!) {
		imageUploader(file: $file, target: $target)
	}
`;

export const IMAGES_UPLOADER = gql`
	mutation ImagesUploader($files: [Upload!]!, $target: String!) {
		imagesUploader(files: $files, target: $target)
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

export const CREATE_WATCH = gql`
	mutation CreateWatch($input: WatchInput!) {
		createWatch(input: $input) {
			_id
			watchType
			watchStatus
			watchBrand
			watchTitle
			watchPrice
			watchImages
			watchDesc
			watchBarter
			watchRent
			watchBestSeller
			manufacturedAt
			createdAt
		}
	}
`;

export const UPDATE_WATCH = gql`
	mutation UpdateWatch($input: WatchUpdate!) {
		updateWatch(input: $input) {
			_id
			watchStatus
			soldAt
			updatedAt
		}
	}
`;

export const CREATE_ORDER = gql`
	mutation CreateOrder($input: CreateOrderInput!) {
		createOrder(input: $input) {
			_id
			watchId
			watchTitle
			watchBrand
			watchPrice
			orderTotal
			orderStatus
			paymentStatus
			createdAt
		}
	}
`;
