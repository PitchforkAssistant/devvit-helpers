/**
 * @file This file contains helper functions to simplify common tasks that involving the RedditAPIClient.
 */

import {ModActionType, RedditAPIClient} from "@devvit/public-api";
import {getTimeDeltaInSeconds} from "./date.js";
import {TID} from "@devvit/shared-types/tid.js";

/**
 * This function lets you check if moderators have performed a specific action on something.
 * @param reddit An instance of RedditAPIClient, such as context.reddit from inside most Devvit event handlers.
 * @param subredditName Subreddit name as a string (no prefix).
 * @param actionTargetId Action target ID, should be the prefixed ID of a post, comment, or user.
 * @param actionType Type of moderation action as one of the strings from ModActionType.
 * @param moderatorUsernames Limits the search to a list of moderator usernames (no prefix). Defaults to all moderators.
 * @param includeRelatives Also check whether the action has been performed on a post or any of its comments. Defaults to off.
 * @param cutoffSeconds Any actions older than this many seconds will not be considered a match. Defaults to off.
 * @param limit The number of actions to fetch. Defaults to 100, the maximum allowed in a single request.
 * @returns A boolean indicating whether the action has been performed.
 */
export async function hasPerformedAction (reddit: RedditAPIClient, subredditName: string, actionTargetId: TID, actionType: ModActionType, moderatorUsernames?: string[], includeParent?: boolean, cutoffSeconds?: number, limit = 100): Promise<boolean> {
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
 * @param moderatorUsernames Limits the search to a list of moderator usernames (no prefix). Defaults to all moderators.
 * @param includeRelatives Also check whether the action has been performed on a post or any of its comments. Defaults to off.
 * @param cutoffSeconds Any actions older than this many seconds will not be considered a match. Defaults to off.
 * @param limit The number of actions to fetch. Defaults to 100, the maximum allowed in a single request.
 * @returns A boolean indicating whether any of actions have been performed.
 */
export async function hasPerformedActions (reddit: RedditAPIClient, subredditName: string, actionTargetId: TID, actionTypes: ModActionType[], moderatorUsernames?: string[], includeParent?: boolean, cutoffSeconds?: number, limit = 100): Promise<boolean> {
    const actionChecks = actionTypes.map(actionType => hasPerformedAction(reddit, subredditName, actionTargetId, actionType, moderatorUsernames, includeParent, cutoffSeconds, limit));
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
 * @returns A boolean indicating whether the user is in the subreddit's approved users/contributors list.
 */
export async function isBanned (reddit: RedditAPIClient, subredditName: string, username: string): Promise<boolean> {
    const filteredBanList = await reddit.getBannedUsers({subredditName, username}).all();
    return filteredBanList.length > 0;
}
