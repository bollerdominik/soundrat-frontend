/* tslint:disable */
/* eslint-disable */

export interface CommentResponse {
    id: number;
    user: string;
    message: string;
    created: Date;
}

export interface CreateCollectionRequest {
    title: string;
    description: string;
    privacy: Privacy;
    coverId: number;
    trackList: CreateCollectionTrack[];
}

export interface CreateCommentRequest {
    message: string;
}

export interface CreateFeedbackRequest {
    message: string;
    name: string;
    email: string;
}

export interface CreateLikeRequest {
    id: number;
    postType: PostType;
}

export interface CreateListenRequest {
    previous: number;
    track: number;
}

export interface CreateMessageRequest {
    message: string;
}

export interface CreateStripeOauthRequest {
    code: string;
}

export interface CreateSubscriptionRequest {
    userId: number;
    amount: number;
    message: string;
}

export interface CreateSubscriptionResponse {
    sessionId: string;
    accountId: string;
}

export interface CreateTrackRequest {
    uploadId: string;
    title: string;
    description: string;
    lyrics: string;
    coverId: number;
    privacy: Privacy;
}

export interface CreateUserRequest {
    email: string;
    name: string;
    password: string;
}

export interface CreateVerificationRequest {
    name: string;
    paypalEmail: string;
    payoutType: PayoutType;
}

export interface DashboardResponse {
    url: string;
}

export interface DownloadResponse {
    file: string;
}

export interface JwtAuthenticationResponse {
    accessToken: string;
}

export interface LoginRequest {
    email: string;
    password: string;
}

export interface MessageResponse {
    id: number;
    user: UserResponse;
    message: string;
    created: Date;
}

export interface PostResponse extends Serializable {
    createDate: Date;
    track: TrackResponse;
    video: VideoResponse;
    trackCollection: TrackCollectionResponse;
}

export interface SocialMediaResponse {
    website: Website;
    url: string;
}

export interface SubscriptionResponse {
    id: number;
    amount: number;
    nextBill: Date;
    artist: UserResponse;
}

export interface SupporterResponse {
    id: number;
    amount: number;
    nextBill: Date;
    created: Date;
    supporter: UserResponse;
}

export interface TrackCollectionResponse extends Serializable {
    id: number;
    created: Date;
    tracks: TrackResponse[];
    title: string;
    coverFile: string;
    coverColor: number[];
    user: string;
    userRoute: string;
    collectionRoute: string;
    privacy: Privacy;
}

export interface TrackResponse extends Serializable {
    id: number;
    created: Date;
    title: string;
    coverFile: string;
    coverColor: number[];
    url: string;
    trackRoute: string;
    user: string;
    userRoute: string;
    lyrics: string;
    duration: number;
    privacy: Privacy;
    trackCollectionId: number;
}

export interface UpdateCollectionRequest {
    title: string;
    description: string;
    privacy: Privacy;
    coverId: number;
    trackList: CreateCollectionTrack[];
}

export interface UpdateCollectionResponse {
    collectionRoute: string;
}

export interface UpdateTrackRequest {
    title: string;
    lyrics: string;
    privacy: Privacy;
    coverId: number;
}

export interface UpdateTrackResponse {
    trackRoute: string;
}

export interface UpdateUserRequest {
    name: string;
    description: string;
    socialMedia: SocialMediaResponse[];
}

export interface UpdateUserResponse {
    userRoute: string;
}

export interface UserResponse extends Serializable {
    id: number;
    name: string;
    userRoute: string;
    avatarFile: string;
    description: string;
    verified: boolean;
    avatarColor: number[];
}

export interface VerificationResponse {
    name: string;
    paypalEmail: string;
    payoutType: PayoutType;
    active: boolean;
}

export interface VideoResponse extends Serializable {
    created: Date;
    youtubeId: string;
    user: string;
    userRoute: string;
    coverFile: string;
}

export interface CreateCollectionTrack {
    position: number;
    newTrack: CreateCollectionNewTrack;
    selectedTrack: CreateCollectionSelectedTrack;
}

export interface Serializable {
}

export interface CreateCollectionNewTrack {
    uploadId: string;
    title: string;
    progress: number;
}

export interface CreateCollectionSelectedTrack {
    trackId: number;
}

export type ContextTypeRequest = "DISCOVER" | "RANDOM" | "ALL_POSTS_OF_ARTIST" | "ALL_TRACKS_OF_ARTIST" | "ALL_COLLECTIONS_OF_ARTIST" | "COLLECTION" | "TRACK" | "USER_LIKES" | "USER_FOLLOWINGS";

export type Privacy = "PUBLIC" | "PRIVATE";

export type PostType = "TRACK" | "COLLECTION" | "VIDEO";

export type PayoutType = "PAYPAL" | "BANK";

export type Website = "TWITTER" | "INSTAGRAM" | "YOUTUBE" | "FACEBOOK";
