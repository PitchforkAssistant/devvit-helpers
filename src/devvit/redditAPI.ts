/**
 * @file This file contains helper functions to simplify common tasks that involving Devvit's RedditAPIClient.
 */

import {ModActionType, RedditAPIClient, Comment, Post, ModAction, ModeratorPermission} from "@devvit/public-api";
import {getTimeDeltaInSeconds} from "../misc/date.js";
import {valueToArrayOrUndefined} from "../misc/converters.js";

/**
 * This function lets you fetch the moderation log with multiple action types at once.
 * @param reddit An instance of RedditAPIClient, such as context.reddit from inside most Devvit event handlers.
 * @param subredditName Subreddit name as a string (no prefix).
 * @param actionType Optionally filter by action type, one of the strings from ModActionType or an array of them.
 * @param moderators Optionally filter by moderator, one or more usernames (no prefix) or an array of them.
 * @param limit The number of actions to fetch, this is for each actionType. Defaults to 100, the maximum allowed in a single request.
 * @returns A list of mod actions.
 */
export async function getModerationLog (reddit: RedditAPIClient, subredditName: string, actionType?: ModActionType[], moderators?: string | string[], limit = 100): Promise<ModAction[]> {
    const moderatorUsernames = valueToArrayOrUndefined<string>(moderators);
    const actionTypes = valueToArrayOrUndefined<ModActionType>(actionType);
    if (!actionTypes) {
        return reddit.getModerationLog({subredditName, moderatorUsernames, limit, pageSize: 100}).all();
    } else {
        const actionChecks = actionTypes.map(actionType => reddit.getModerationLog({subredditName, moderatorUsernames, type: actionType, limit, pageSize: 100}).all());
        const results = await Promise.all(actionChecks);
        return results.flat();
    }
}

/**
 * This function lets you check if moderators have performed a specific action on something.
 * @param reddit An instance of RedditAPIClient, such as context.reddit from inside most Devvit event handlers.
 * @param subredditName Subreddit name as a string (no prefix).
 * @param actionTargetId Action target ID, should be the prefixed ID of a post, comment, or user.
 * @param actionType Type of moderation action as one of the strings from ModActionType.
 * @param moderators Limits the search to a moderator or list of moderator usernames (no prefix). Defaults to all moderators.
 * @param includeRelatives Also check whether the action has been performed on a post or any of its comments. Defaults to off.
 * @param cutoffSeconds Any actions older than this many seconds will not be considered a match. Defaults to off.
 * @param limit The number of actions to fetch. Defaults to 100, the maximum allowed in a single request.
 * @returns A boolean indicating whether the action has been performed.
 */
export async function hasPerformedAction (reddit: RedditAPIClient, subredditName: string, actionTargetId: string, actionType: ModActionType, moderators?: string | string[], includeParent?: boolean, cutoffSeconds?: number, limit = 100): Promise<boolean> {
    const moderatorUsernames = valueToArrayOrUndefined<string>(moderators);
    const modLog = await reddit.getModerationLog({subredditName, moderatorUsernames, type: actionType, limit, pageSize: 100}).all().catch(e => {
        console.error(`Failed to fetch ${actionType} log for ${subredditName} by ${moderatorUsernames?.join(",") ?? ""}`, e);
        return [];
    });
    for (const modAction of modLog) {
        if (!cutoffSeconds || getTimeDeltaInSeconds(new Date(), modAction.createdAt) < cutoffSeconds) {
            if (modAction.target?.id === actionTargetId) {
                return true;
            } else if (includeParent && modAction.target?.permalink?.startsWith(`/r/${subredditName}/comments/${actionTargetId.substring(3)}/`)) {
                return true;
            }
        }
    }
    return false;
}

/**
 * This function lets you use hasPerformedAction() with multiple action types at once.
 * @param reddit An instance of RedditAPIClient, such as context.reddit from inside most Devvit event handlers.
 * @param subredditName Subreddit name as a string (no prefix).
 * @param actionTargetId Action target ID, should be the prefixed ID of a post, comment, or user.
 * @param actionTypes List of moderation action types as strings from ModActionType.
 * @param moderators Limits the search to a list of moderator usernames (no prefix). Defaults to all moderators.
 * @param includeRelatives Also check whether the action has been performed on a post or any of its comments. Defaults to off.
 * @param cutoffSeconds Any actions older than this many seconds will not be considered a match. Defaults to off.
 * @param limit The number of actions to fetch. Defaults to 100, the maximum allowed in a single request.
 * @returns A boolean indicating whether any of actions have been performed.
 */
export async function hasPerformedActions (reddit: RedditAPIClient, subredditName: string, actionTargetId: string, actionTypes: ModActionType[], moderators?: string | string[], includeParent?: boolean, cutoffSeconds?: number, limit = 100): Promise<boolean> {
    const actionChecks = actionTypes.map(actionType => hasPerformedAction(reddit, subredditName, actionTargetId, actionType, moderators, includeParent, cutoffSeconds, limit));
    const results = await Promise.all(actionChecks);
    return results.includes(true);
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
 * This function lets you get a username from a user ID, it saves you from having to fetch the user first on your own.
 * @param reddit An instance of RedditAPIClient, such as context.reddit from inside most Devvit event handlers.
 * @param userId A user ID, should look like t2_abc123.
 * @returns The username of the user (no prefix).
 */
export async function getUsernameFromUserId (reddit: RedditAPIClient, userId: string): Promise<string> {
    return reddit.getUserById(userId).then(user => user.username);
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
