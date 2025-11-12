import {ERRORS} from "../../src/constants/errors.js";
import {validateSubredditName, validateSubredditNameList, validateUsername, validateUsernameList} from "../../src/validators/strings.js";

describe("validateUsernameList", () => {
    test.each([
        "/u/username",
        "/username",
        "/u/sername1,/u/username2,u/username3",
        "/u/username1, /u/username2, /u/username3,",
    ])("validateUsernameList(%s) should return prefixed error", async input => {
        expect(await validateUsernameList({value: input, isEditing: false})).toEqual<string>(ERRORS.USERNAMECSV_PREFIXED);
    });

    test.each([
        "username,username2,username3 ",
        " username,username2,username3",
        "username1,PitchforkAssistant-ModTeam, username2,username3",
        "username1, username2, username3,",
    ])("validateUsernameList(%s) should return space error", async input => {
        expect(await validateUsernameList({value: input, isEditing: false})).toEqual<string>(ERRORS.NO_SPACES);
    });

    test.each([
        "username1,PitchforkAssistant-ModTeam,username2,username3,",
        "username1,username2,username3,",
    ])("validateUsernameList(%s) should return trailing comma error", async input => {
        expect(await validateUsernameList({value: input, isEditing: false})).toEqual<string>(ERRORS.NO_TRAILING_COMMA);
    });

    test.each([
        "username1,PitchforkAssistantTooLong-ModTeam,username2,username3",
        "username1,username2,username3,questionmark?inuser",
        "username1,🦥,username3,questionmark?inuser",
        "username1,x,xistooshort",
    ])("validateUsernameList(%s) should return general error", async input => {
        expect(await validateUsernameList({value: input, isEditing: false})).toEqual<string>(ERRORS.USERNAMECSV_INVALID);
    });

    test.each([
        "reddit,PitchforkAssistant-ModTeam,AutoModerator,PitchforkAssistant",
        "spez",
        "",
    ])("validateUsernameList(%s) should return undefined", async input => {
        expect(await validateUsernameList({value: input, isEditing: false})).toBeUndefined();
    });
});

describe("validateUsername", () => {
    test.each([
        "/u/username",
        "u/username",
        "/u/sername1,/u/username2,u/username3",
        "/u/username1, /u/username2, /u/username3,",
    ])("validateUsername(%s) should return prefixed error", async input => {
        expect(await validateUsername({value: input, isEditing: false})).toEqual<string>(ERRORS.USERNAME_PREFIXED);
    });

    test.each([
        " username ",
        " username",
        "username1,PitchforkAssistant-ModTeam, username2,username3",
        "username1, username2, username3,",
    ])("validateUsername(%s) should return space error", async input => {
        expect(await validateUsername({value: input, isEditing: false})).toEqual<string>(ERRORS.NO_SPACES);
    });

    test.each([
        "username1,PitchforkAssistant-ModTeam,username2,username3",
        "username1,username2,username3",
    ])("validateUsername(%s) should return comma error", async input => {
        expect(await validateUsername({value: input, isEditing: false})).toEqual<string>(ERRORS.NO_COMMA);
    });

    test.each([
        "PitchforkAssistantTooLong-ModTeam",
        "questionmark?inuser",
        "🦥",
        "x",
    ])("validateUsername(%s) should return general error", async input => {
        expect(await validateUsername({value: input, isEditing: false})).toEqual<string>(ERRORS.USERNAME_INVALID);
    });

    test.each([
        "reddit",
        "spez",
        "PitchforkAssistant",
        "AutoModerator",
        "u_PitchforkAssistant-ModTeam",
        "",
    ])("validateUsername(%s) should return undefined", async input => {
        expect(await validateUsername({value: input, isEditing: false})).toBeUndefined();
    });
});

describe("validateSubredditNameList", () => {
    test.each([
        "/u/subname",
        "/subname",
        "/u/sername1,/u/subname2,u/subname3",
        "/u/subname1, /u/subname2, /u/subname3,",
    ])("validateSubredditNameList(%s) should return prefixed error", async input => {
        expect(await validateSubredditNameList({value: input, isEditing: false})).toEqual<string>(ERRORS.SUBNAMECSV_PREFIXED);
    });

    test.each([
        "subname,subname2,subname3 ",
        " subname,subname2,subname3",
        "subname1,PitchforkAssistant-ModTeam, subname2,subname3",
        "subname1, subname2, subname3,",
    ])("validateSubredditNameList(%s) should return space error", async input => {
        expect(await validateSubredditNameList({value: input, isEditing: false})).toEqual<string>(ERRORS.NO_SPACES);
    });

    test.each([
        "subname1,PitchforkAssistant-ModTeam,subname2,subname3,",
        "subname1,subname2,subname3,",
    ])("validateSubredditNameList(%s) should return trailing comma error", async input => {
        expect(await validateSubredditNameList({value: input, isEditing: false})).toEqual<string>(ERRORS.NO_TRAILING_COMMA);
    });

    test.each([
        "subname1,PitchforkAssistantTooLong,subname2,subname3",
        "subname1,subname2,subname3,questionmark?insub",
        "subname1,🦥,subname3",
        "subname1,x,xistooshort",
    ])("validateSubredditNameList(%s) should return general error", async input => {
        expect(await validateSubredditNameList({value: input, isEditing: false})).toEqual<string>(ERRORS.SUBNAMECSV_INVALID);
    });

    test.each([
        "reddit,PitchforkAssistant,AutoModerator,ModSupport",
        "wsb",
        "all,u_TwentyCharacterUName",
        "",
    ])("validateSubredditNameList(%s) should return undefined", async input => {
        expect(await validateSubredditNameList({value: input, isEditing: false})).toBeUndefined();
    });
});

describe("validateSubredditName", () => {
    test.each([
        "/r/subname",
        "r/subname",
        "/r/subname1,/r/subname2,r/subname3",
        "/r/subname1, /r/subname2, /r/subname3,",
    ])("validateSubredditName(%s) should return prefixed error", async input => {
        expect(await validateSubredditName({value: input, isEditing: false})).toEqual<string>(ERRORS.SUBNAME_PREFIXED);
    });

    test.each([
        " subname ",
        " subname",
        "subname1,PitchforkAssistantTooLongName, subname2,subname3",
        "subname1, subname2, subname3,",
    ])("validateSubredditName(%s) should return space error", async input => {
        expect(await validateSubredditName({value: input, isEditing: false})).toEqual<string>(ERRORS.NO_SPACES);
    });

    test.each([
        "subname1,PitchforkAssistant-ModTeam,subname2,subname3",
        "subname1,subname2,subname3",
    ])("validateSubredditName(%s) should return comma error", async input => {
        expect(await validateSubredditName({value: input, isEditing: false})).toEqual<string>(ERRORS.NO_COMMA);
    });

    test.each([
        "PitchforkAssistantTooLong",
        "questionmark?inname",
        "🦥",
        "x",
    ])("validateSubredditName(%s) should return general error", async input => {
        expect(await validateSubredditName({value: input, isEditing: false})).toEqual<string>(ERRORS.SUBNAME_INVALID);
    });

    test.each([
        "reddit",
        "ModSupport",
        "PitchforkAssistant",
        "Announcements",
        "all",
        "u_TwentyCharacterUName",
        "",
    ])("validateSubredditName(%s) should return undefined", async input => {
        expect(await validateSubredditName({value: input, isEditing: false})).toBeUndefined();
    });
});
