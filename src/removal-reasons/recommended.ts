/**
 * @file Contains functions to generate removal reasons from posts and mod actions using recommended placeholders.
 */

import {Post} from "@devvit/public-api";
import {CommentV2, ModAction, PostV2, SubredditV2, UserV2} from "@devvit/protos";
import {Placeholder, PlaceholderGetters, getPlaceholdersFromGetters} from "./generics.js";
import {domainFromUrlString} from "../misc/misc.js";
import {CustomDateformat, safeFormatInTimeZone} from "../misc/date.js";
import {isLinkId} from "@devvit/shared-types/tid.js";

export type RecommendedPlaceholderKeys = "{{author}}" | "{{subreddit}}" | "{{body}}" | "{{title}}" | "{{kind}}" | "{{permalink}}" | "{{url}}" | "{{link}}" | "{{domain}}" | "{{author_id}}" | "{{subreddit_id}}" | "{{id}}" | "{{link_flair_text}}" | "{{link_flair_css_class}}" | "{{link_flair_template_id}}" | "{{author_flair_text}}" | "{{author_flair_css_class}}" | "{{author_flair_template_id}}" | "{{time_iso}}" | "{{time_unix}}" | "{{time_custom}}" | "{{created_iso}}" | "{{created_unix}}" | "{{created_custom}}" | "{{actioned_iso}}" | "{{actioned_unix}}" | "{{actioned_custom}}";

export type ObjectWithDateformatOptions<T extends object> = T & {customDateformat?: CustomDateformat};

export const RecommendedPlaceholderGettersFromPost: PlaceholderGetters<RecommendedPlaceholderKeys, Post> = {
    "{{author}}": async post => post.authorName ?? "",
    "{{subreddit}}": async post => post.subredditName ?? "",
    "{{body}}": async post => post.body ?? "",
    "{{title}}": async post => post.title ?? "",
    "{{kind}}": async () => "submission",
    "{{permalink}}": async post => post.permalink ?? "",
    "{{url}}": async post => post.permalink ?? "",
    "{{link}}": async post => post.url ?? "",
    "{{domain}}": async post => domainFromUrlString(post.url ?? ""),
    "{{author_id}}": async post => post.authorId?.substring(3) ?? "",
    "{{subreddit_id}}": async post => post.subredditId?.substring(3) ?? "",
    "{{id}}": async post => post.id?.substring(3) ?? "",
    "{{link_flair_text}}": async post => post.flair?.text ?? "",
    "{{link_flair_css_class}}": async post => post.flair?.cssClass ?? "",
    "{{link_flair_template_id}}": async post => post.flair?.templateId ?? "",
    "{{author_flair_text}}": async post => (await (await post.getAuthor()).getUserFlairBySubreddit(post.subredditName))?.flairText ?? "", // Post object does not currently contain author flair.
    "{{author_flair_css_class}}": async post => (await (await post.getAuthor()).getUserFlairBySubreddit(post.subredditName))?.flairCssClass ?? "", // Post object does not currently contain author flair.
    "{{author_flair_template_id}}": async () => "", // Post object does not currently contain author flair and getUserFlairBySubreddit doesn't return the template ID.
    "{{time_iso}}": async () => new Date().toISOString(),
    "{{time_unix}}": async () => (new Date().getTime() / 1000).toString(),
    "{{time_custom}}": async post => post.customDateformat ? safeFormatInTimeZone(new Date(), post.customDateformat) : "",
    "{{created_iso}}": async post => post.createdAt.toISOString(),
    "{{created_unix}}": async post => (post.createdAt.getTime() / 1000).toString(),
    "{{created_custom}}": async post => post.customDateformat ? safeFormatInTimeZone(post.createdAt, post.customDateformat) : "",
    "{{actioned_iso}}": async () => "",
    "{{actioned_unix}}": async () => "",
    "{{actioned_custom}}": async () => "",
};

export async function getRecommendedPlaceholdersFromPost (post: Post, customDateformat?: CustomDateformat): Promise<Placeholder[]> {
    const dataSource: ObjectWithDateformatOptions<Post> = post;
    dataSource.customDateformat = customDateformat;
    return getPlaceholdersFromGetters(RecommendedPlaceholderGettersFromPost, dataSource);
}

export const RecommendedPlaceholderGettersFromModPostAction: PlaceholderGetters<RecommendedPlaceholderKeys, ModAction & {subreddit: SubredditV2, targetPost: PostV2, targetUser: UserV2}> = {
    "{{author}}": async action => action.targetUser.name ?? "",
    "{{subreddit}}": async action => action.subreddit.name ?? "",
    "{{body}}": async action => action.targetPost.selftext ?? "",
    "{{title}}": async action => action.targetPost.title ?? "",
    "{{kind}}": async () => "submission",
    "{{permalink}}": async action => isLinkId(action.targetPost.id) ? `https://redd.it/${action.targetPost.id.substring(3)}` : "",
    "{{url}}": async action => isLinkId(action.targetPost.id) ? `https://redd.it/${action.targetPost.id.substring(3)}` : "",
    "{{link}}": async action => action.targetPost.url ?? "",
    "{{domain}}": async action => domainFromUrlString(action.targetPost.url ?? ""),
    "{{author_id}}": async action => action.targetUser.id?.substring(3) ?? "",
    "{{subreddit_id}}": async action => action.subreddit.id?.substring(3) ?? "",
    "{{id}}": async action => action.targetPost.id?.substring(3) ?? "",
    "{{link_flair_text}}": async action => action.targetPost.linkFlair?.text ?? "",
    "{{link_flair_css_class}}": async action => action.targetPost.linkFlair?.cssClass ?? "",
    "{{link_flair_template_id}}": async action => action.targetPost.linkFlair?.templateId ?? "",
    "{{author_flair_text}}": async action => action.targetPost.authorFlair?.text ?? "",
    "{{author_flair_css_class}}": async action => action.targetPost.authorFlair?.cssClass ?? "",
    "{{author_flair_template_id}}": async action => action.targetPost.authorFlair?.templateId ?? "",
    "{{time_iso}}": async () => new Date().toISOString(),
    "{{time_unix}}": async () => (new Date().getTime() / 1000).toString(),
    "{{time_custom}}": async action => action.customDateformat ? safeFormatInTimeZone(new Date(), action.customDateformat) : "",
    "{{created_iso}}": async action => new Date(action.targetPost.createdAt).toISOString() ?? "",
    "{{created_unix}}": async action => (new Date(action.targetPost.createdAt).getTime() / 1000).toString(),
    "{{created_custom}}": async action => action.customDateformat ? safeFormatInTimeZone(new Date(action.targetPost.createdAt), action.customDateformat) : "",
    "{{actioned_iso}}": async action => action.actionedAt ? new Date(action.actionedAt).toISOString() : "",
    "{{actioned_unix}}": async action => action.actionedAt ? (new Date(action.actionedAt).getTime() / 1000).toString() : "",
    "{{actioned_custom}}": async action => action.customDateformat && action.actionedAt ? safeFormatInTimeZone(new Date(action.actionedAt), action.customDateformat) : "",
};

export const RecommendedPlaceholderGettersFromModCommentAction: PlaceholderGetters<RecommendedPlaceholderKeys, ModAction & {subreddit: SubredditV2, targetComment: CommentV2, targetUser: UserV2}> = {
    "{{author}}": async action => action.targetUser.name ?? "",
    "{{subreddit}}": async action => action.subreddit.name ?? "",
    "{{body}}": async action => action.targetComment.body ?? "",
    "{{title}}": async () => "",
    "{{kind}}": async () => "comment",
    "{{permalink}}": async action => action.targetComment.id ? `https://old.reddit.com/api/info/?id=${action.targetComment.id}` : "",
    "{{url}}": async action => action.targetComment.id ? `https://old.reddit.com/api/info/?id=${action.targetComment.id}` : "",
    "{{link}}": async action => action.targetComment.id ? `https://old.reddit.com/api/info/?id=${action.targetComment.id}` : "",
    "{{domain}}": async () => "",
    "{{author_id}}": async action => action.targetUser.id?.substring(3) ?? "",
    "{{subreddit_id}}": async action => action.subreddit.id?.substring(3) ?? "",
    "{{id}}": async action => action.targetComment.id?.substring(3) ?? "",
    "{{link_flair_text}}": async () => "",
    "{{link_flair_css_class}}": async () => "",
    "{{link_flair_template_id}}": async () => "",
    "{{author_flair_text}}": async () => "", // CommentV2 object does not currently contain author flair.
    "{{author_flair_css_class}}": async () => "", // CommentV2 object does not currently contain author flair.
    "{{author_flair_template_id}}": async () => "", // CommentV2 object does not currently contain author flair.
    "{{time_iso}}": async () => new Date().toISOString(),
    "{{time_unix}}": async () => (new Date().getTime() / 1000).toString(),
    "{{time_custom}}": async action => action.customDateformat ? safeFormatInTimeZone(new Date(), action.customDateformat) : "",
    "{{created_iso}}": async action => new Date(action.targetComment.createdAt).toISOString() ?? "",
    "{{created_unix}}": async action => (new Date(action.targetComment.createdAt).getTime() / 1000).toString(),
    "{{created_custom}}": async action => action.customDateformat ? safeFormatInTimeZone(new Date(action.targetComment.createdAt), action.customDateformat) : "",
    "{{actioned_iso}}": async action => action.actionedAt ? new Date(action.actionedAt).toISOString() : "",
    "{{actioned_unix}}": async action => action.actionedAt ? (new Date(action.actionedAt).getTime() / 1000).toString() : "",
    "{{actioned_custom}}": async action => action.customDateformat && action.actionedAt ? safeFormatInTimeZone(new Date(action.actionedAt), action.customDateformat) : "",
};

export async function getRecommendedPlaceholdersFromModAction (action: ModAction & ({targetPost: PostV2} | {targetComment: CommentV2}), customDateformat?: CustomDateformat): Promise<Placeholder[]> {
    if (!action.targetUser || !action.subreddit) {
        throw new Error("ModAction does not contain required targetUser and subreddit properties.");
    }
    const dataSource: ObjectWithDateformatOptions<ModAction & ({targetPost: PostV2} | {targetComment: CommentV2})> = action;
    dataSource.customDateformat = customDateformat;

    let placeholders = undefined;
    if (action.targetPost?.id) {
        placeholders = await getPlaceholdersFromGetters(RecommendedPlaceholderGettersFromModPostAction, action as Required<ModAction>);
    } else if (action.targetComment?.id) {
        placeholders = await getPlaceholdersFromGetters(RecommendedPlaceholderGettersFromModCommentAction, action as Required<ModAction>);
    } else {
        throw new Error("ModAction does not contain required targetPost or targetComment property.");
    }

    if (!placeholders) {
        throw new Error("Placeholder retrieval failed.");
    } else {
        if (dataSource.moderator?.name) {
            // Add the moderator name to the beginning of the list of placeholders, so that it is the first placeholder to be replaced.
            placeholders.unshift({placeholder: "{{mod}}", value: dataSource.moderator.name});
        }
        return placeholders;
    }
}
