import {Post} from "@devvit/public-api";

/**
 * Checks if a post is deleted based on the authorName, because Devvit doesn't currently provide an isDeleted() property.
 * @param post Post object provided by Devvit, such as one from context.reddit.getPostById()
 * @param notIfAlsoRemoved If true, a post won't be considered deleted if it's also had a removal action performed on it. Defaults to false.
 * @returns True if the post is deleted, false otherwise.
 */
export function isDeleted (post: Post, notIfAlsoRemoved?: boolean): boolean {
    if (notIfAlsoRemoved && (post.isRemoved() || post.isSpam())) {
        return false;
    }

    return post.authorName === "[deleted]";
}
