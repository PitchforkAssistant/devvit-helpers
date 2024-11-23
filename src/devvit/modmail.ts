import {ModMail} from "@devvit/protos";
import {ConversationData, GetConversationsRequest, MessageData, ModMailService} from "@devvit/public-api";

/**
 * This function sorts an array of conversations based on the specified sort order.
 * @param conversations
 * @param sort ModMail sort order to use
 * @returns Conversations sorted by the specified sort order, most recent first
 */
export function sortConversations (conversations: ConversationData[], sortOrder: string[]): ConversationData[] {
    // Sort conversations based on the position of their IDs in the sortOrder array
    return conversations.sort((a, b) => {
        const aIndex = sortOrder.indexOf(a.id ?? "");
        const bIndex = sortOrder.indexOf(b.id ?? "");
        return aIndex - bIndex;
    });
}

/**
 * This function retrieves a list of modmail conversations based on the specified options.
 * Unlike the one built-in getConversations() function, this function is not limited to a maximum of 100 and will return a sorted list of conversations.
 * @param modmail Instance of the ModMailService, such as context.reddit.modMail
 * @param options Same options as the ones you would provide to context.reddit.modMail.getConversations()
 * @param options.subreddits Only return conversations from these subreddits
 * @param options.state Filter returned conversations by their state (defaults to all)
 * @param options.sort recent, mod, user, or unread (defaults to recent)
 * @param options.limit Maximum number of conversations to retrieve from 1 to Infinity (defaults to 100)
 * @param options.after Conversation ID to start after, ones before this will be excluded
 * @returns A list of sorted conversations' ConversationData
 */
export async function getModmailConversations (modmail: ModMailService, options: GetConversationsRequest): Promise<ConversationData[]> {
    // Handle unspecified options
    if (!options.limit || options.limit < 1) {
        options.limit = 100;
    }
    if (!options.sort) {
        options.sort = "recent";
    }
    if (!options.state) {
        options.state = "all";
    }

    // If the limit is less than or equal to 100, we don't have to worry about pagination
    if (options.limit <= 100) {
        const response = await modmail.getConversations(options);
        return sortConversations(Object.values(response.conversations), response.conversationIds);
    }

    // If the limit is greater than 100, we need to paginate and handle potential duplicates
    const conversations: ConversationData[] = [];
    let seenConversationIds = new Set<string>();
    let after = options.after;
    while (conversations.length < options.limit) {
        try {
            const response = await modmail.getConversations({...options, after, limit: 100});

            // Create sorted list of conversations on the new page
            // there may be a small chance of duplicates due to pagination, so we'll filter them out
            const newConversations = sortConversations(
                Object.values(response.conversations).filter(conversation => conversation.id && !seenConversationIds.has(conversation.id)),
                response.conversationIds
            );

            // If there are no new conversations, we've reached the end
            if (response.conversationIds.length === 0) {
                break;
            }

            // If we have enough conversations to reach the limit, add exactly enough to reach the limit and break
            if (conversations.length + newConversations.length >= options.limit) {
                conversations.push(...newConversations.slice(0, options.limit - conversations.length));
                break;
            }
            // Otherwise add all of them
            conversations.push(...newConversations);

            if (Object.keys(response.conversations).length < 100) {
                // If the page isn't full, we've also reached the end
                break;
            }

            const newAfter = response.conversationIds[response.conversationIds.length - 1];
            if (newAfter === after) {
                // This seems like an unlikely scenario,
                // but if the ID of the new last conversation is the same as the previous last conversation,
                // we should break to avoid an infinite loop
                break;
            }
            after = newAfter;

            // Mark the new conversations as seen, moved to the end because we don't need to do this if the loop breaks
            seenConversationIds = new Set([...seenConversationIds, ...Object.keys(response.conversations)]);
        } catch (error) {
            // This is most likely to happen if there are no more conversations to retrieve
            console.log(`getModmailConversations: Failed to retrieve conversations after ${after} with options ${JSON.stringify(options)}`, error);
            break;
        }
    }
    // We don't need to sort the conversations here
    // That's because we sorted each page individually
    // While page contents may be out of order, the pages themselves are in order (fingers crossed)
    return conversations;
}

export type ModmailConversationPermalink = `https://mod.reddit.com/mail/perma/${string}`;
export type ModmailMessagePermalink = `https://mod.reddit.com/mail/perma/${string}/${string}`;

/**
 * This function creates a permalink to a modmail conversation or message.
 * @param conversation Conversation ID as a string, a ConversationData object, or a ModMail event object
 * @param message Message ID, MessageData object, or undefined. If undefined, the permalink will point to the conversation, unless the conversation object is the ModMail event object
 * @returns Permalink to the conversation or message, or undefined if at least the conversation ID is not found
 */
export function getModmailPermalink (conversation: string | ConversationData | ModMail, message?: string | MessageData): ModmailConversationPermalink | ModmailMessagePermalink | undefined {
    let conversationId = "";
    let messageId = "";

    if (typeof conversation === "string") {
        conversationId = conversation;
    } else if (typeof conversation === "object") {
        if ("conversationId" in conversation) {
            conversationId = conversation.conversationId;

            if (!message) {
                messageId = conversation.messageId;
            }
        } else if ("id" in conversation) {
            conversationId = conversation.id ?? "";
        }
    }

    if (typeof message === "string") {
        messageId = message;
    } else if (typeof message === "object" && "id" in message) {
        messageId = message.id ?? "";
    }

    // In some cases the ID may be prefixed
    conversationId = conversationId.replace("ModmailConversation_", "");
    messageId = messageId.replace("ModmailMessage_", "");

    if (messageId && conversationId) {
        return `https://mod.reddit.com/mail/perma/${conversationId}/${messageId}`;
    }

    if (conversationId) {
        return `https://mod.reddit.com/mail/perma/${conversationId}`;
    }
}
