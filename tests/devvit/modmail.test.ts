import {ConversationData, MessageData} from "@devvit/public-api";
import {ModmailConversationPermalink, ModmailMessagePermalink, compareConversations, getLastConversation, getModmailPermalink, sortConversations} from "../../src/devvit/modmail.js";
import {ConversationSort} from "../../src/devvit/modmail.js";
import {ModMail} from "@devvit/protos";

const oldestConversation: ConversationData = {lastUpdated: new Date("2000-01-01").toISOString(), authors: [], messages: {}, modActions: {}};
const olderConversation: ConversationData = {lastUpdated: new Date("2010-01-01").toISOString(), authors: [], messages: {}, modActions: {}};
const newerConversation: ConversationData = {lastUpdated: new Date("2020-01-01").toISOString(), authors: [], messages: {}, modActions: {}};
const newestConversation: ConversationData = {lastUpdated: new Date("2030-01-01").toISOString(), authors: [], messages: {}, modActions: {}};

describe("compareConversations", () => {
    it("should return a negative number when a is older than b", () => {
        const a: ConversationData = oldestConversation;
        const b: ConversationData = newestConversation;
        const sort: ConversationSort = "recent";

        const result = compareConversations(a, b, sort);

        expect(result).toBeLessThan(0);
    });

    it("should return a positive number when a is newer than b", () => {
        const a: ConversationData = newestConversation;
        const b: ConversationData = oldestConversation;
        const sort: ConversationSort = "recent";

        const result = compareConversations(a, b, sort);

        expect(result).toBeGreaterThan(0);
    });

    it("should return 0 when a and b have the same date", () => {
        const a: ConversationData = newestConversation;
        const b: ConversationData = newestConversation;
        const sort: ConversationSort = "recent";

        const result = compareConversations(a, b, sort);

        expect(result).toBe(0);
    });
});

describe("sortConversations", () => {
    it("should sort conversations with newest first", () => {
        const conversations: ConversationData[] = [oldestConversation, newerConversation, olderConversation, newestConversation];
        const sort: ConversationSort = "recent";

        const result = sortConversations(conversations, sort);

        expect(result).toEqual([oldestConversation, olderConversation, newerConversation, newestConversation]);
    });
});

describe("getLastConversation", () => {
    it("should get the oldest conversation", () => {
        const conversations: ConversationData[] = [newerConversation, oldestConversation, olderConversation, newestConversation];
        const sort: ConversationSort = "recent";

        const result = getLastConversation(conversations, sort);

        expect(result).toEqual(oldestConversation);
    });
});

describe("getModmailPermalink", () => {
    const convoUrl: ModmailConversationPermalink = "https://mod.reddit.com/mail/perma/convoId";
    const messageUrl: ModmailMessagePermalink = "https://mod.reddit.com/mail/perma/convoId/messageId";

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
