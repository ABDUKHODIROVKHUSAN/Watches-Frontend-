import { gql } from '@apollo/client';

export const GET_ALL_MEMBERS_BY_ADMIN = gql`
	query GetAllMembersByAdmin($input: MembersInquiry!) {
		getAllMembersByAdmin(input: $input) {
			list {
				_id
				memberType
				memberStatus
				memberAuthType
				memberPhone
				memberEmail
				memberNick
				memberFullName
				memberImage
				memberAddress
				memberDesc
				memberWarnings
				memberBlocks
				memberWatches
				memberRank
				memberArticles
				memberPoints
				memberLikes
				memberViews
				createdAt
				updatedAt
			}
			metaCounter {
				total
			}
		}
	}
`;

export const GET_ALL_WATCHES_BY_ADMIN = gql`
	query GetAllWatchesByAdmin($input: AllWatchesInquiry!) {
		getAllWatchesByAdmin(input: $input) {
			list {
				_id
				watchType
				watchStatus
				watchBrand
				watchTitle
				watchTitleI18n {
					en
					ko
					uz
				}
				watchPrice
				watchImages
				watchDescI18n {
					en
					ko
					uz
				}
				watchViews
				watchLikes
				watchBestSeller
				memberId
				soldAt
				deletedAt
				createdAt
				updatedAt
				memberData {
					_id
					memberType
					memberStatus
					memberNick
					memberImage
				}
			}
			metaCounter {
				total
			}
		}
	}
`;

export const GET_SELLER_REQUESTS = gql`
	query GetSellerRequests {
		getSellerRequests {
			_id
			memberNick
			memberFullName
			memberPhone
			memberEmail
			memberStatus
			role
			sellerStatus
			sellerRequestedAt
			createdAt
		}
	}
`;
