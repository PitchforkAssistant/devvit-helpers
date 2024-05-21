/**
 * @file This file contains helper functions to simplify common tasks that involving Devvit's RedditAPIClient.
 */

import {ModActionType, RedditAPIClient, Comment, Post, ModAction, ModeratorPermission} from "@devvit/public-api";
import {valueToArrayOrUndefined} from "../misc/converters.js";

export type GetModerationLogOptions = {
    subredditName: string,
    actionType?: ModActionType | ModActionType[],
    moderators?: string | string[],
    limit?: number,
    sort?: boolean,
}

/**
 * This function lets you fetch the moderation log with multiple action types at once.
 * @param reddit An instance of RedditAPIClient, such as context.reddit from inside most Devvit event handlers.
 * @param options GetModerationLogOptions object with the following properties:
 * @param options.subredditName Subreddit name as a string (no prefix).
 * @param options.actionType (optional) Filter by action type, takes ModActionType or an array of them. Defaults to no filtering (all action types).
 * @param options.moderators (optional) Filter by moderator username, takes a username (no prefix) or an array of them. Defaults to no filtering (all mods).
 * @param options.limit (optional) Only fetch this many of each specified action type. Defaults to 100, the maximum allowed in a single request.
 * @param options.sort (optional) Sort the logs by date, newest first. Defaults to off, but the fetch returns them as sorted if one or no action types are specified.
 * @returns A list of mod actions.
 */
export async function getModerationLog (reddit: RedditAPIClient, options: GetModerationLogOptions): Promise<ModAction[]> {
    const types = valueToArrayOrUndefined(options.actionType);
    const moderatorUsernames = valueToArrayOrUndefined(options.moderators);
    const pageSize = Math.min(options.limit ?? 100, 100); // Unless less than 100 are requested, we should fetch the maximum per page.

    // If the action type is not specified or there is only one, we can directly return the result because we don't need to merge multiple action types.
    if (!types) {
        return reddit.getModerationLog({subredditName: options.subredditName, moderatorUsernames, limit: options.limit, pageSize}).all();
    } else if (types.length === 1) {
        return reddit.getModerationLog({subredditName: options.subredditName, moderatorUsernames, type: types[0], limit: options.limit, pageSize}).all();
    }

    // We now know there are multiple action types, so we need to fetch them separately and merge the results.
    const unsortedLogs = (
        await Promise.all(types.map(type => reddit.getModerationLog({subredditName: options.subredditName, moderatorUsernames, type, limit: options.limit, pageSize})
            .all()))).flat();

    // If sorting isn't required, we can return the result now.
    if (!options.sort) {
        return unsortedLogs;
    }

    // If sorting is required, we need to sort the logs by date.
    return unsortedLogs.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
}

export type HasPerformedActionsOptions = {
    subredditName: string,
    actionTargetId: string,
    actionTypes: ModActionType | ModActionType[],
    moderators?: string | string[],
    includeParent?: boolean,
    newestCutoff?: Date,
    oldestCutoff?: Date,
    limit?: number
}

/**
 * This function lets you check if moderators have performed a specific action on something.
 * @param reddit An instance of RedditAPIClient, such as context.reddit from inside most Devvit event handlers.
 * @param options HasPerformedActionsOptions object with the following properties:
 * @param options.subredditName Subreddit name as a string (no prefix).
 * @param options.actionTargetId Action target ID, should be the prefixed ID of a post, comment, or user.
 * @param options.actionTypes Either ModActionType or a list of them of moderation action types as strings from ModActionType.
 * @param options.moderators (optional) Limits the search to a moderator or list of moderator usernames (no prefix). Defaults to any moderator.
 * @param options.includeParent (optional) This allows you to specify the actionTargetId as a postId and check if a moderator has performed the action on the post or any of its comments. Defaults to off.
 * @param options.newestCutoff (optional) Any actions newer than this date will not be considered a match. Defaults to off.
 * @param options.oldestCutoff (optional) Any actions older than this date will not be considered a match. Defaults to off.
 * @param options.limit (optional) This will limit the number of moderation log entries fetched for each specified action type. Defaults to everything.
 */
export async function hasPerformedActions (reddit: RedditAPIClient, options: HasPerformedActionsOptions): Promise<boolean> {
    const modLog = await getModerationLog(reddit, {
        subredditName: options.subredditName,
        actionType: options.actionTypes,
        moderators: options.moderators,
        limit: options.limit,
    });

    for (const modAction of modLog) {
        if (options.newestCutoff && modAction.createdAt > options.newestCutoff) {
            continue;
        }
        if (options.oldestCutoff && modAction.createdAt < options.oldestCutoff) {
            continue;
        }

        if (modAction.target?.id === options.actionTargetId) {
            return true;
        } else if (options.includeParent && modAction.target?.permalink?.includes(`comments/${options.actionTargetId.substring(3)}`)) {
            return true;
        }
    }
    return false;
}

/**
 * This function simplifies the process of checking if a user is a moderator of a subreddit.
 * @param reddit An instance of RedditAPIClient, such as context.reddit from inside most Devvit event handlers.
 * @param subredditName The name of the subreddit as a string, without the prefix.
 * @param username The username of the user as a string, without the prefix.
 * @returns A boolean indicating whether the user is a moderator of the subreddit.
 */
export async function isModerator (reddit: RedditAPIClient, subredditName: string, username: string): Promise<boolean> {
    const filteredModeratorList = await reddit.getModerators({subredditName, username}).all();
    return filteredModeratorList.length > 0;
}

/**
 * This function simplifies the process of checking if a user is in a subreddit's approved users/contributors list.
 * @param reddit An instance of RedditAPIClient, such as context.reddit from inside most Devvit event handlers.
 * @param subredditName The name of the subreddit as a string, without the prefix.
 * @param username The username of the user as a string, without the prefix.
 * @returns A boolean indicating whether the user is in the subreddit's approved users/contributors list.
 */
export async function isContributor (reddit: RedditAPIClient, subredditName: string, username: string): Promise<boolean> {
    const filteredContributorList = await reddit.getApprovedUsers({subredditName, username}).all();
    return filteredContributorList.length > 0;
}

/**
 * This function simplifies the process of checking if a user is banned from a subreddit.
 * @param reddit An instance of RedditAPIClient, such as context.reddit from inside most Devvit event handlers.
 * @param subredditName The name of the subreddit as a string, without the prefix.
 * @param username The username of the user as a string, without the prefix.
 * @returns A boolean indicating whether the user is banned from the subreddit.
 */
export async function isBanned (reddit: RedditAPIClient, subredditName: string, username: string): Promise<boolean> {
    const filteredBanList = await reddit.getBannedUsers({subredditName, username}).all();
    return filteredBanList.length > 0;
}

/**
 * This function simplifies the process of checking if a user is banned from a subreddit.
 * @param reddit An instance of RedditAPIClient, such as context.reddit from inside most Devvit event handlers.
 * @param subredditName The name of the subreddit as a string, without the prefix.
 * @param username The username of the user as a string, without the prefix.
 * @returns A boolean indicating whether the user is banned from the subreddit's wiki.
 */
export async function isWikiBanned (reddit: RedditAPIClient, subredditName: string, username: string): Promise<boolean> {
    const filteredWikiBanList = await reddit.getBannedWikiContributors({subredditName, username}).all();
    return filteredWikiBanList.length > 0;
}

/**
 * This function simplified the process of submitting a mod reply to a post.
 * @param reddit An instance of RedditAPIClient, such as context.reddit from inside most Devvit event handlers.
 * @param postId A post ID, should look like t3_abc123.
 * @param text Text to submit as a comment.
 * @param distinguish Should the comment be distinguished?
 * @param sticky Should the comment be stickied? Please note that sticking a comment also distinguishes it.
 * @param lock Should the comment be locked?
 * @returns The comment that was submitted.
 */
export async function submitPostReply (reddit: RedditAPIClient, postId: string, text: string, distinguish?: boolean, sticky?: boolean, lock?: boolean): Promise<Comment> {
    const comment = await reddit.submitComment({id: postId, text});
    if (distinguish || sticky) {
        await comment.distinguish(sticky);
    }
    if (lock) {
        await comment.lock();
    }
    return comment;
}

/**
 * This function lets you ignore a post's reports based on its ID. It both approves and ignores reports. This saves you from having to fetch the post first on your own. Only posts are supported because Devvit doesn't have a way to ignore reports on comments yet.
 * @param reddit An instance of RedditAPIClient, such as context.reddit from inside most Devvit event handlers.
 * @param postId A post ID, should look like t3_abc123.
 * @param alsoApprove Should the post be approved as well as ignored? Defaults to true.
 * @returns The post that was ignored.
 */
export async function ignoreReportsByPostId (reddit: RedditAPIClient, postId: string, alsoApprove = true): Promise<Post> {
    const post = await reddit.getPostById(postId);
    await Promise.all([post.ignoreReports(), alsoApprove ? post.approve() : Promise.resolve()]);
    return post;
}

/**
 * This function lets you lock or unlock a post based on its ID. This saves you from having to fetch the post first on your own.
 * @param reddit An instance of RedditAPIClient, such as context.reddit from inside most Devvit event handlers.
 * @param postId A post ID, should look like t3_abc123.
 * @param locked Should the lock state be set to locked (true) or unlocked (false)? Defaults to true.
 * @returns The post that was ignored.
 */
export async function setLockByPostId (reddit: RedditAPIClient, postId: string, locked = true): Promise<Post> {
    const post = await reddit.getPostById(postId);
    if (locked) {
        await post.lock();
    } else {
        await post.unlock();
    }
    return post;
}

/**
 * This function lets you get a username from a user ID, it saves you from having to fetch the user first on your own. It also works if the user is shadowbanned.
 * @param reddit An instance of RedditAPIClient, such as context.reddit from inside most Devvit event handlers.
 * @param userId A user ID, should look like t2_abc123.
 * @returns The username of the user (no prefix).
 */
export async function getUsernameFromUserId (reddit: RedditAPIClient, userId: string): Promise<string> {
    try {
        const user = await reddit.getUserById(userId);
        return user.username;
    } catch (e) {
        // Expected error example:
        // Error: Get "https://oauth.reddit.com/user/shadowbanned1234/about?raw_json=1": httpbp.ClientError: http status 404 Not Found: {"message": "Not Found", "error": 404}
        const match = String(e).match(/(?<=reddit\.com\/user\/)[a-zA-Z0-9_-]{3,30}(?=\/about)/);
        if (match) {
            return match[0];
        }
        return "";
    }
}

/**
 * This function lets you quickly check which permissions a user has on a subreddit with just the username and subreddit name.
 * @param reddit An instance of RedditAPIClient, such as context.reddit from inside most Devvit event handlers.
 * @param subredditName The name of the subreddit as a string, without the prefix.
 * @param username The username of the user as a string, without the prefix.
 * @param requiredPerms The user must have all of these permissions to return true, can be a ModeratorPermission string or array of them. If omitted, the function will return true if the user has any permissions.
 * @returns A boolean indicating whether the user has the required permissions.
 */
export async function hasPermissions (reddit: RedditAPIClient, subredditName: string, username: string, requiredPerms?: ModeratorPermission | ModeratorPermission[]): Promise<boolean> {
    requiredPerms = valueToArrayOrUndefined<ModeratorPermission>(requiredPerms);
    const user = await reddit.getUserByUsername(username);
    const actualPerms = await user.getModPermissionsForSubreddit(subredditName);
    if (actualPerms.includes("all")) {
        return true;
    } else if (!requiredPerms) {
        return actualPerms.length > 0;
    } else {
        return requiredPerms.every(requiredPerm => actualPerms.includes(requiredPerm));
    }
}

/**
 * Gets the stickied comment of a post, if it exists.
 * @param reddit An instance of RedditAPIClient, such as context.reddit from inside most Devvit event handlers.
 * @param postId Full post ID, should look like t3_abc123.
 * @returns The stickied comment if it exists, otherwise undefined.
 */
export async function getStickiedComment (reddit: RedditAPIClient, postId: string): Promise<Comment | undefined> {
    // We only need to fetch one comment because if there is a stickied comment, it will be always be the first one.
    const comments = await reddit.getComments({
        postId,
        limit: 1,
        depth: 1,
    }).all();
    // We'll only ever get 0 or 1 comments, so return the first one if it exists and is stickied.
    for (const comment of comments) {
        if (comment.isStickied()) {
            return comment;
        }
    }
}
