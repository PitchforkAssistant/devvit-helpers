import {ModMail} from "@devvit/protos";
import {ConversationData, MessageData} from "@devvit/public-api";

import {getModmailPermalink, ModmailPermalink, sortConversations} from "../../src/devvit/modmail.js";

const oldestConversation: ConversationData = {lastUpdated: new Date("2000-01-01").toISOString(), id: "1", authors: [], messages: {}, modActions: {}};
const olderConversation: ConversationData = {lastUpdated: new Date("2010-01-01").toISOString(), id: "2", authors: [], messages: {}, modActions: {}};
const newerConversation: ConversationData = {lastUpdated: new Date("2020-01-01").toISOString(), id: "3", authors: [], messages: {}, modActions: {}};
const newestConversation: ConversationData = {lastUpdated: new Date("2030-01-01").toISOString(), id: "4", authors: [], messages: {}, modActions: {}};
const sortOrder = ["1", "2", "3", "4"];

describe("sortConversations", () => {
    it("should sort conversations with newest first", () => {
        const conversations: ConversationData[] = [oldestConversation, newerConversation, olderConversation, newestConversation];

        const result = sortConversations(conversations, sortOrder);

        expect(result).toEqual([oldestConversation, olderConversation, newerConversation, newestConversation]);
    });
});

describe("getModmailPermalink", () => {
    const convoUrl: ModmailPermalink = "https://mod.reddit.com/mail/perma/convoId";
    const messageUrl: ModmailPermalink = "https://mod.reddit.com/mail/perma/convoId/messageId";

    it("should return the correct permalink with strings", () => {
        expect(getModmailPermalink("convoId", "messageId")).toBe(messageUrl);
        expect(getModmailPermalink("convoId")).toBe(convoUrl);
        expect(getModmailPermalink("convoId", "")).toBe(convoUrl);
        expect(getModmailPermalink("ModmailConversation_convoId", "ModmailMessage_messageId")).toBe(messageUrl);
        expect(getModmailPermalink("", "")).toBeUndefined();
        expect(getModmailPermalink("", "messageId")).toBeUndefined();
    });

    const convoData = {id: "convoId"} as ConversationData;
    const messageData = {id: "messageId"} as MessageData;

    it("should return the correct permalink with data objects", () => {
        expect(getModmailPermalink(convoData)).toBe(convoUrl);
        expect(getModmailPermalink(convoData, messageData)).toBe(messageUrl);
        expect(getModmailPermalink("convoId", messageData)).toBe(messageUrl);
        expect(getModmailPermalink(convoData, "messageId")).toBe(messageUrl);
        expect(getModmailPermalink("", messageData)).toBeUndefined();
    });

    const modmailEvent = {conversationId: "convoId", messageId: "messageId"} as ModMail;
    it("should return the correct permalink with a ModMail event object", () => {
        expect(getModmailPermalink(modmailEvent)).toBe(messageUrl);
        expect(getModmailPermalink(modmailEvent, "")).toBe(convoUrl);
    });
});
