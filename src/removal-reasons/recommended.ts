/**
 * @file Contains functions to generate removal reasons from posts and mod actions using recommended placeholders.
 */

import {PostFlairUpdate} from "@devvit/protos/types/devvit/events/v1alpha/events.js";
import {CommentV2} from "@devvit/protos/types/devvit/reddit/v2alpha/commentv2.js";
import {ModAction} from "@devvit/protos/types/devvit/reddit/v2alpha/modaction.js";
import {PostV2} from "@devvit/protos/types/devvit/reddit/v2alpha/postv2.js";
import {SubredditV2} from "@devvit/protos/types/devvit/reddit/v2alpha/subredditv2.js";
import {UserV2} from "@devvit/protos/types/devvit/reddit/v2alpha/userv2.js";
import {Post, RedditAPIClient} from "@devvit/public-api";
import {isLinkId} from "@devvit/public-api/types/tid.js";

import {isBanned} from "../devvit/redditAPI.js";
import {CustomDateformat, safeFormatInTimeZone} from "../misc/date.js";
import {domainFromUrlString} from "../misc/misc.js";
import {getPlaceholdersFromGetters, Placeholder, PlaceholderGetters} from "./generics.js";

export type RecommendedPlaceholderKeys = "{{author}}" | "{{subreddit}}" | "{{body}}" | "{{title}}" | "{{kind}}" | "{{permalink}}" | "{{url}}" | "{{link}}" | "{{domain}}" | "{{author_id}}" | "{{subreddit_id}}" | "{{id}}" | "{{link_flair_text}}" | "{{link_flair_css_class}}" | "{{link_flair_template_id}}" | "{{author_flair_text}}" | "{{author_flair_css_class}}" | "{{author_flair_template_id}}" | "{{time_iso}}" | "{{time_unix}}" | "{{time_custom}}" | "{{created_iso}}" | "{{created_unix}}" | "{{created_custom}}" | "{{actioned_iso}}" | "{{actioned_unix}}" | "{{actioned_custom}}";

export type ObjectWithDateformatOptions<T extends object> = T & {customDateformat?: CustomDateformat};

export const RecommendedPlaceholderGettersFromPost: PlaceholderGetters<RecommendedPlaceholderKeys, Post> = {
    "{{author}}": post => post.authorName ?? "",
    "{{subreddit}}": post => post.subredditName ?? "",
    "{{body}}": post => post.body ?? "",
    "{{title}}": post => post.title ?? "",
    "{{kind}}": () => "submission",
    "{{permalink}}": post => post.permalink ?? "",
    "{{url}}": post => post.permalink ?? "",
    "{{link}}": post => post.url ?? "",
    "{{domain}}": post => domainFromUrlString(post.url ?? ""),
    "{{author_id}}": post => post.authorId?.substring(3) ?? "",
    "{{subreddit_id}}": post => post.subredditId?.substring(3) ?? "",
    "{{id}}": post => post.id?.substring(3) ?? "",
    "{{link_flair_text}}": post => post.flair?.text ?? "",
    "{{link_flair_css_class}}": post => post.flair?.cssClass ?? "",
    "{{link_flair_template_id}}": post => post.flair?.templateId ?? "",
    "{{author_flair_text}}": post => post.authorFlair?.text ?? "",
    "{{author_flair_css_class}}": post => post.authorFlair?.cssClass ?? "",
    "{{author_flair_template_id}}": post => post.authorFlair?.templateId ?? "",
    "{{time_iso}}": () => new Date().toISOString(),
    "{{time_unix}}": () => (new Date().getTime() / 1000).toString(),
    "{{time_custom}}": post => post.customDateformat ? safeFormatInTimeZone(new Date(), post.customDateformat) : "",
    "{{created_iso}}": post => post.createdAt.toISOString(),
    "{{created_unix}}": post => (post.createdAt.getTime() / 1000).toString(),
    "{{created_custom}}": post => post.customDateformat ? safeFormatInTimeZone(post.createdAt, post.customDateformat) : "",
    "{{actioned_iso}}": () => "",
    "{{actioned_unix}}": () => "",
    "{{actioned_custom}}": () => "",
};

export async function getRecommendedPlaceholdersFromPost (post: Post, customDateformat?: CustomDateformat): Promise<Placeholder[]> {
    const dataSource: ObjectWithDateformatOptions<Post> = post;
    dataSource.customDateformat = customDateformat;
    return getPlaceholdersFromGetters(RecommendedPlaceholderGettersFromPost, dataSource);
}

export const RecommendedPlaceholderGettersFromModPostAction: PlaceholderGetters<RecommendedPlaceholderKeys, ModAction & {subreddit: SubredditV2, targetPost: PostV2, targetUser: UserV2}> = {
    "{{author}}": action => action.targetUser.name ?? "",
    "{{subreddit}}": action => action.subreddit.name ?? "",
    "{{body}}": action => action.targetPost.selftext ?? "",
    "{{title}}": action => action.targetPost.title ?? "",
    "{{kind}}": () => "submission",
    "{{permalink}}": action => isLinkId(action.targetPost.id) ? `https://redd.it/${action.targetPost.id.substring(3)}` : "",
    "{{url}}": action => isLinkId(action.targetPost.id) ? `https://redd.it/${action.targetPost.id.substring(3)}` : "",
    "{{link}}": action => action.targetPost.url ?? "",
    "{{domain}}": action => domainFromUrlString(action.targetPost.url ?? ""),
    "{{author_id}}": action => action.targetUser.id?.substring(3) ?? "",
    "{{subreddit_id}}": action => action.subreddit.id?.substring(3) ?? "",
    "{{id}}": action => action.targetPost.id?.substring(3) ?? "",
    "{{link_flair_text}}": action => action.targetPost.linkFlair?.text ?? "",
    "{{link_flair_css_class}}": action => action.targetPost.linkFlair?.cssClass ?? "",
    "{{link_flair_template_id}}": action => action.targetPost.linkFlair?.templateId ?? "",
    "{{author_flair_text}}": action => action.targetPost.authorFlair?.text ?? "",
    "{{author_flair_css_class}}": action => action.targetPost.authorFlair?.cssClass ?? "",
    "{{author_flair_template_id}}": action => action.targetPost.authorFlair?.templateId ?? "",
    "{{time_iso}}": () => new Date().toISOString(),
    "{{time_unix}}": () => (new Date().getTime() / 1000).toString(),
    "{{time_custom}}": action => action.customDateformat ? safeFormatInTimeZone(new Date(), action.customDateformat) : "",
    "{{created_iso}}": action => new Date(action.targetPost.createdAt).toISOString() ?? "",
    "{{created_unix}}": action => (new Date(action.targetPost.createdAt).getTime() / 1000).toString(),
    "{{created_custom}}": action => action.customDateformat ? safeFormatInTimeZone(new Date(action.targetPost.createdAt), action.customDateformat) : "",
    "{{actioned_iso}}": action => action.actionedAt ? new Date(action.actionedAt).toISOString() : "",
    "{{actioned_unix}}": action => action.actionedAt ? (new Date(action.actionedAt).getTime() / 1000).toString() : "",
    "{{actioned_custom}}": action => action.customDateformat && action.actionedAt ? safeFormatInTimeZone(new Date(action.actionedAt), action.customDateformat) : "",
};

export const RecommendedPlaceholderGettersFromModCommentAction: PlaceholderGetters<RecommendedPlaceholderKeys, ModAction & {subreddit: SubredditV2, targetComment: CommentV2, targetUser: UserV2}> = {
    "{{author}}": action => action.targetUser.name ?? "",
    "{{subreddit}}": action => action.subreddit.name ?? "",
    "{{body}}": action => action.targetComment.body ?? "",
    "{{title}}": () => "",
    "{{kind}}": () => "comment",
    "{{permalink}}": action => action.targetComment.id ? `https://old.reddit.com/api/info/?id=${action.targetComment.id}` : "",
    "{{url}}": action => action.targetComment.id ? `https://old.reddit.com/api/info/?id=${action.targetComment.id}` : "",
    "{{link}}": action => action.targetComment.id ? `https://old.reddit.com/api/info/?id=${action.targetComment.id}` : "",
    "{{domain}}": () => "",
    "{{author_id}}": action => action.targetUser.id?.substring(3) ?? "",
    "{{subreddit_id}}": action => action.subreddit.id?.substring(3) ?? "",
    "{{id}}": action => action.targetComment.id?.substring(3) ?? "",
    "{{link_flair_text}}": () => "",
    "{{link_flair_css_class}}": () => "",
    "{{link_flair_template_id}}": () => "",
    "{{author_flair_text}}": () => "", // CommentV2 object does not currently contain author flair.
    "{{author_flair_css_class}}": () => "", // CommentV2 object does not currently contain author flair.
    "{{author_flair_template_id}}": () => "", // CommentV2 object does not currently contain author flair.
    "{{time_iso}}": () => new Date().toISOString(),
    "{{time_unix}}": () => (new Date().getTime() / 1000).toString(),
    "{{time_custom}}": action => action.customDateformat ? safeFormatInTimeZone(new Date(), action.customDateformat) : "",
    "{{created_iso}}": action => new Date(action.targetComment.createdAt).toISOString() ?? "",
    "{{created_unix}}": action => (new Date(action.targetComment.createdAt).getTime() / 1000).toString(),
    "{{created_custom}}": action => action.customDateformat ? safeFormatInTimeZone(new Date(action.targetComment.createdAt), action.customDateformat) : "",
    "{{actioned_iso}}": action => action.actionedAt ? new Date(action.actionedAt).toISOString() : "",
    "{{actioned_unix}}": action => action.actionedAt ? (new Date(action.actionedAt).getTime() / 1000).toString() : "",
    "{{actioned_custom}}": action => action.customDateformat && action.actionedAt ? safeFormatInTimeZone(new Date(action.actionedAt), action.customDateformat) : "",
};

export async function getRecommendedPlaceholdersFromModAction (action: ModAction & ({targetPost: PostV2} | {targetComment: CommentV2}), customDateformat?: CustomDateformat): Promise<Placeholder[]> {
    if (!action.targetUser || !action.subreddit) {
        throw new Error("ModAction does not contain required targetUser and subreddit properties.");
    }
    const dataSource: ObjectWithDateformatOptions<ModAction & ({targetPost: PostV2} | {targetComment: CommentV2})> = action;
    dataSource.customDateformat = customDateformat;

    let placeholders: Placeholder[];
    if (action.targetPost?.id) {
        placeholders = await getPlaceholdersFromGetters(RecommendedPlaceholderGettersFromModPostAction, action as Required<ModAction>);
    } else if (action.targetComment?.id) {
        placeholders = await getPlaceholdersFromGetters(RecommendedPlaceholderGettersFromModCommentAction, action as Required<ModAction>);
    } else {
        throw new Error("ModAction does not contain required targetPost or targetComment property.");
    }

    if (dataSource.moderator?.name) {
        // Add the moderator name to the beginning of the list of placeholders, so that it is the first placeholder to be replaced.
        placeholders.unshift({placeholder: "{{mod}}", value: dataSource.moderator.name});
    }
    return placeholders;
}

/**
 * Returns the placeholders for a PostFlairUpdate event by mimicing a ModAction of type "editflair".
 * @param event PostFlairUpdate object.
 * @param reddit Reddit API client, this is used to fetch data about the post author if the flair was updated by a different user (i.e. a moderator).
 * @param customDateformat Custom Dateformat object.
 * @param updatedAt Date object of when the flair was updated, defaults to now.
 */
export async function getRecommendedPlaceholdersFromPostFlairUpdate (event: PostFlairUpdate, reddit: RedditAPIClient, customDateformat?: CustomDateformat, updatedAt?: Date): Promise<Placeholder[]> {
    if (!event.subreddit || !event.post || !event.author) {
        throw new Error("PostFlairUpdate does not contain required subreddit, post, and author properties.");
    }

    if (!updatedAt) {
        updatedAt = new Date();
    }

    let moderator;
    let targetUser = event.author;
    if (event.post.authorId !== event.author.id) {
        moderator = event.author;

        try {
            const postAuthor = await reddit.getUserById(event.post.authorId);
            if (!postAuthor) {
                throw new Error("User undefined.");
            }
            targetUser = {
                id: event.post.authorId,
                name: postAuthor.username,
                flair: event.post.authorFlair,
                karma: postAuthor.commentKarma + postAuthor.linkKarma,
                isGold: Boolean(event.post.gildings), // User object doesn't contain the gold status, so this is the best guess we can make
                banned: await isBanned(reddit, event.subreddit.name, postAuthor.username),
                spam: false,
                url: postAuthor.url,
                snoovatarImage: await postAuthor.getSnoovatarUrl().catch(() => "") ?? "",
                iconImage: await postAuthor.getSnoovatarUrl().catch(() => "") ?? "",
                description: "",
                suspended: false,
            };
        } catch {
            // This mostly handles shadowbanned, deleted, or suspended users.

            targetUser = {
                id: event.post.authorId,
                name: "[deleted]", // This function will extract the username from the exception if possible.
                flair: event.post.authorFlair,
                karma: event.post.score, // If we can't get the user's karma, this is the best guess we can make.
                snoovatarImage: "",
                iconImage: "",
                isGold: Boolean(event.post.gildings), // User object doesn't contain the gold status, so this is the best guess we can make
                banned: false,
                spam: true,
                url: "",
                description: "",
                suspended: true,
            };

            if (targetUser.name) {
                targetUser.banned = await isBanned(reddit, event.subreddit.name, targetUser.name).catch(() => false);
                targetUser.url = `https://reddit.com/user/${targetUser.name}`;
            }
        }
    }

    const modAction: ModAction & {targetPost: PostV2} = {
        action: "editflair",
        actionedAt: updatedAt,
        subreddit: event.subreddit,
        targetPost: event.post,
        targetUser,
        moderator,
    };
    return getRecommendedPlaceholdersFromModAction(modAction, customDateformat);
}
