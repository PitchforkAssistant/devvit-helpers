import * as protos from "@devvit/protos";
import {UserAboutResponse} from "@devvit/protos/types/devvit/plugin/redditapi/users/users_msg.js";
import {Devvit, UserSocialLink} from "@devvit/public-api";

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
 * This function calls the Vote function under Devvit.redditAPIPlugins.LinksAndComments.
 * @param id Thing ID to cast a vote on
 * @param dir Direction of vote, 1 for upvote, 0 for no vote, -1 for downvote.
 * @param metadata Metadata, usually just context.debug.metadata
 * @returns {protos.Empty} Empty response
 */
export async function setVote (id: string, dir: 1 | 0 | -1, metadata: protos.Metadata): Promise<protos.Empty> {
    return getExtendedDevvit().redditAPIPlugins.LinksAndComments.Vote({id, dir}, metadata);
}

type UserSocialLinkResponse = Omit<UserSocialLink, "handle"> & { handle: string | null };

/**
 * This function calls the GetUserSocialLinks persisted query under Devvit.redditAPIPlugins.GraphQL and returns the user's social links.
 * @param username The username of the user to retrieve social links for.
 * @param metadata Metadata, usually just context.debug.metadata
 * @returns An array of UserSocialLink objects.
 */
export async function getUserSocialLinks (username: string, metadata: protos.Metadata): Promise<UserSocialLink[]> {
    const gql = getExtendedDevvit().redditAPIPlugins.GraphQL;
    const response = await gql.PersistedQuery({
        operationName: "GetUserSocialLinks", // Name and ID are both from <https://github.com/reddit/devvit/blob/f083/packages/public-api/src/apis/reddit/models/User.ts#L437-L438>
        id: "2aca18ef5f4fc75fb91cdaace3e9aeeae2cb3843b5c26ad511e6f01b8521593a",
        variables: {
            name: username,
        },
    }, metadata);

    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    if (!response.data?.user?.profile?.socialLinks) {
        return [];
    }

    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-return
    return response.data.user.profile.socialLinks.map((link: UserSocialLinkResponse) => ({
        ...link,
        handle: link.handle ?? undefined,
    }));
}
