import {domainFromUrlString} from "../src/misc/misc.js";

// URL, expected output.
test.each([
    ["", ""],
    ["not a valid url", ""],
    ["https://i.imgur.com/CykNguI.png", "i.imgur.com"],
    ["https://i.redd.it/pctkxfqn4u9b1.png", "i.redd.it"],
    ["https://github.com/PitchforkAssistant/devvit-flair-assistant", "github.com"],
    ["https://old.reddit.com/r/modnews/comments/6auyq9/reddit_is_procss/", "old.reddit.com"],
    ["https://cdn.discordapp.com/attachments/1122823169997295626/1129349737477320734/image.png", "cdn.discordapp.com"],
])("domainFromUrlString(%s) -> %s", (url, expected) => {
    expect(domainFromUrlString(url)).toEqual(expected);
});
