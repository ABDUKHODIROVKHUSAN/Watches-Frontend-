import { gql } from '@apollo/client';

export const GET_WATCHES = gql`
	query GetWatches($input: WatchesInquiry!) {
		getWatches(input: $input) {
			list {
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
				watchViews
				watchLikes
				watchComments
				watchRank
				memberId
				soldAt
				deletedAt
				manufacturedAt
				createdAt
				updatedAt
				memberData {
					_id
					memberNick
					memberImage
				}
				meLiked {
					memberId
					likeRefId
					myFavorite
				}
			}
			metaCounter {
				total
			}
		}
	}
`;

export const GET_BEST_SELLER_WATCHES_ROW = gql`
	query GetBestSellerWatchesRow {
		getBestSellerWatchesRow {
			list {
				_id
				watchBrand
				watchTitle
				watchImages
			}
			metaCounter {
				total
			}
		}
	}
`;

export const GET_WATCH = gql`
	query GetWatch($input: String!) {
		getWatch(watchId: $input) {
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
			watchViews
			watchLikes
			watchComments
			watchRank
			memberId
			soldAt
			deletedAt
			manufacturedAt
			createdAt
			updatedAt
			memberData {
				_id
				memberType
				memberNick
				memberFullName
				memberImage
				memberPhone
			}
			meLiked {
				memberId
				likeRefId
				myFavorite
			}
		}
	}
`;

export const GET_SELLERS = gql`
	query GetSellers($input: SellersInquiry!) {
		getSellers(input: $input) {
			list {
				_id
				memberType
				memberStatus
				memberNick
				memberFullName
				memberImage
				memberDesc
				memberWatches
				memberLikes
				memberViews
				memberRank
				meLiked {
					memberId
					likeRefId
					myFavorite
				}
			}
			metaCounter {
				total
			}
		}
	}
`;

export const GET_MEMBER = gql`
	query GetMember($input: String!) {
		getMember(memberId: $input) {
			_id
			memberType
			memberStatus
			memberNick
			memberFullName
			memberImage
			memberAddress
			memberDesc
			memberWatches
			memberArticles
			memberPoints
			memberLikes
			memberViews
			memberFollowings
			memberFollowers
			memberRank
			createdAt
			meFollowed {
				followingId
				followerId
				myFollowing
			}
		}
	}
`;

export const GET_FAVORITE_WATCHES = gql`
	query GetFavoriteWatches($input: OrdinaryInquiry!) {
		getFavoriteWatches(input: $input) {
			list {
				_id
				watchType
				watchBrand
				watchTitle
				watchPrice
				watchImages
				watchViews
				watchLikes
				memberId
				createdAt
				memberData {
					_id
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

export const GET_VISITED_WATCHES = gql`
	query GetVisitedWatches($input: OrdinaryInquiry!) {
		getVisitedWatches(input: $input) {
			list {
				_id
				watchType
				watchBrand
				watchTitle
				watchPrice
				watchImages
				watchViews
				watchLikes
				memberId
				createdAt
				memberData {
					_id
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

export const GET_SELLER_WATCHES = gql`
	query GetSellerWatches($input: SellerWatchesInquiry!) {
		getSellerWatches(input: $input) {
			list {
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
				watchViews
				watchLikes
				memberId
				soldAt
				manufacturedAt
				createdAt
				updatedAt
				memberData {
					_id
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

export const GET_WATCH_AI_INSIGHTS = gql`
	query GetWatchAIInsights($watchId: String!) {
		getWatchAIInsights(watchId: $watchId) {
			watchTitle
			watchBrand
			salesInfo
			celebrityWearers {
				name
				description
			}
			fashionTips {
				outfit
				occasion
			}
			priceRange
			funFacts
			summary
		}
	}
`;

export const GET_WATCH_BRAND_AI_INSIGHTS = gql`
	query GetWatchBrandAIInsights($brand: String!) {
		getWatchBrandAIInsights(brand: $brand) {
			watchTitle
			watchBrand
			salesInfo
			celebrityWearers {
				name
				description
			}
			fashionTips {
				outfit
				occasion
			}
			priceRange
			funFacts
			summary
		}
	}
`;

export const GET_MY_ORDERS = gql`
	query GetMyOrders($input: OrdersInquiry!) {
		getMyOrders(input: $input) {
			list {
				_id
				watchId
				watchTitle
				watchBrand
				watchPrice
				watchImage
				orderTotal
				orderStatus
				paymentStatus
				paymentMethod
				shippingAddress
				createdAt
			}
			metaCounter {
				total
			}
		}
	}
`;
