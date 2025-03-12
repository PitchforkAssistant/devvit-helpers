import * as protos from "@devvit/protos";
import {UserAboutResponse} from "@devvit/protos/types/devvit/plugin/redditapi/users/users_msg.js";
import {Devvit} from "@devvit/public-api";

export type RedditAPIPlugins = {
    NewModmail: protos.NewModmail;
    Widgets: protos.Widgets;
    ModNote: protos.ModNote;
    LinksAndComments: protos.LinksAndComments;
    Moderation: protos.Moderation;
    GraphQL: protos.GraphQL;
    Listings: protos.Listings;
    Flair: protos.Flair;
    Wiki: protos.Wiki;
    Users: protos.Users;
    PrivateMessages: protos.PrivateMessages;
    Subreddits: protos.Subreddits;
}

/**
 * This is an extended version of the Devvit type that includes some of the members that are not exposed by default.
 */
export type ExtendedDevvit = typeof Devvit & {
    redditAPIPlugins: RedditAPIPlugins
    modLogPlugin: protos.Modlog
    schedulerPlugin: protos.Scheduler
    kvStorePlugin: protos.KVStore
    redisPlugin: protos.RedisAPI
    mediaPlugin: protos.MediaService
    settingsPlugin: protos.Settings
    realtimePlugin: protos.Realtime
};

/**
 * @returns {ExtendedDevvit} Returns the standard imported Devvit object, but cast to the ExtendedDevvit type.
 */
export function getExtendedDevvit (): ExtendedDevvit {
    return Devvit as ExtendedDevvit;
}

/**
 * This function calls the UserAbout function under Devvit.redditAPIPlugins.Users.
 * @param username Username to pass to UserAbout request
 * @param metadata Metadata, usually just context.debug.metadata
 * @returns {UserAboutResponse} Response of Devvit.redditAPIPlugins.Users.UserAbout
 */
export async function getRawUserData (username: string, metadata: protos.Metadata): Promise<UserAboutResponse> {
    return getExtendedDevvit().redditAPIPlugins.Users.UserAbout({username}, metadata);
}

/**
 * This function calls the Info function under Devvit.redditAPIPlugins.LinksAndComments.
 * @param postOrCommentIds Array of post or comment IDs as strings, should be prefixed with "t3_" or "t1_" respectively.
 * @param metadata Metadata, usually just context.debug.metadata
 * @returns {protos.Listing} Response of Devvit.redditAPIPlugins.LinksAndComments.Info
 */
export async function getRawLinksAndCommentsData (postOrCommentIds: string[], metadata: protos.Metadata): Promise<protos.Listing> {
    return getExtendedDevvit().redditAPIPlugins.LinksAndComments.Info({subreddits: [], thingIds: postOrCommentIds}, metadata);
}

/**
 * This function calls the SubredditAbout function under Devvit.redditAPIPlugins.Subreddits.
 * @param subredditName Subreddit to pass to SubredditAbout request
 * @param metadata Metadata, usually just context.debug.metadata
 * @returns {UserAboutResponse} Response of Devvit.redditAPIPlugins.Users.UserAbout
 */
export async function getRawSubredditData (subredditName: string, metadata: protos.Metadata): Promise<protos.SubredditAboutResponse> {
    return getExtendedDevvit().redditAPIPlugins.Subreddits.SubredditAbout({subreddit: subredditName}, metadata);
}

/**
 * This function calls the SubredditAbout function under Devvit.redditAPIPlugins.LinksAndComments.Vote.
 * @param id Thing ID to cast a vote on
 * @param dir Direction of vote, 1 for upvote, 0 for no vote, -1 for downvote.
 * @param metadata Metadata, usually just context.debug.metadata
 * @returns {protos.Empty} Empty response
 */
export async function setVote (id: string, dir: 1 | 0 | -1, metadata: protos.Metadata): Promise<protos.Empty> {
    return getExtendedDevvit().redditAPIPlugins.LinksAndComments.Vote({id, dir}, metadata);
}
