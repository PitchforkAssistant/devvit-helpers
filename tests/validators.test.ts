import {Context} from "@devvit/public-api";
import {ERRORS} from "../src/constants/errors.js";
import {validateCustomDateformat, validateCustomLocale, validateCustomTimezone, validateFinite, validateInteger, validateNegative, validateNonZero, validateNumber, validatePositiveInteger, validatePositive, validateUsernameList, validateMultiple, validatePositiveNumber, validateUsername, validateSubredditName, validateSubredditNameList} from "../src/devvit/validators.js";

test("validateMultiple should return undefined for a valid value", async () => {
    expect(await validateMultiple([validateNumber, validateFinite, validateInteger, validatePositive, validateNonZero], {value: 1, isEditing: false}, {} as Context)).toBeUndefined();
    expect(await validateMultiple([validateNumber, validateFinite, validateInteger, validatePositive, validateNonZero], {value: Infinity, isEditing: false}, {} as Context)).toEqual<string>(ERRORS.NOT_FINITE);
    expect(await validateMultiple([validateNumber, validateFinite, validateInteger, validatePositive, validateNonZero], {value: 0.2, isEditing: false}, {} as Context)).toEqual<string>(ERRORS.NOT_INTEGER);
    expect(await validateMultiple([validateNumber, validatePositive, validateNonZero], {value: -Infinity, isEditing: false}, {} as Context)).toEqual<string>(ERRORS.NOT_POSITIVE);
    expect(await validateMultiple([validateNumber, validateNonZero], {value: 0, isEditing: false}, {} as Context)).toEqual<string>(ERRORS.NOT_NONZERO);
    expect(await validateMultiple([validateNumber, validateNonZero], {value: 0, isEditing: false}, {} as Context, "test")).toEqual("test");
});

test("validateCustomTimeformat should return nothing for a valid timeformat", async () => {
    expect(await validateCustomDateformat({value: "yyyy-MM-dd HH:mm:ss", isEditing: false})).toBeUndefined();
});

describe("validateCustomTimezone", () => {
    test.each([
        "+02:00",
        "-07:00",
        "+00:15",
        "America/New_York",
        "Europe/London",
    ])("validateCustomTimezone(%s) should return undefined", async input => {
        expect(await validateCustomTimezone({value: input, isEditing: false})).toBeUndefined();
    });

    test.each([
        "00:00",
        "0",
    ])("validateCustomTimezone(%s) should return string", async input => {
        expect(await validateCustomTimezone({value: input, isEditing: false})).toEqual<string>(ERRORS.INVALID_TIMEZONE);
    });

    test.each([
        "00:00",
        "0",
    ])("validateCustomTimezone(%s) should return string", async input => {
        expect(await validateCustomTimezone({value: input, isEditing: false}, undefined, "test")).toEqual("test");
    });
});

describe("validateCustomLocale", () => {
    test.each([
        "enUS",
        "enGB",
        "DE",
        ["DE"],
    ])("validateCustomLocale(%s) should return undefined", async input => {
        expect(await validateCustomLocale({value: input, isEditing: false})).toBeUndefined();
    });

    test.each([
        "_lib",
        "aww",
        ["tifu"],
        ["aww", "tifu"],
    ])("validateCustomLocale(%s) should return string", async input => {
        expect(await validateCustomLocale({value: input, isEditing: false})).toEqual<string>(ERRORS.INVALID_LOCALE);
    });

    test.each([
        "_lib",
        "aww",
        ["aww", "tifu"],
    ])("validateCustomLocale(%s) should return string", async input => {
        expect(await validateCustomLocale({value: input, isEditing: false}, undefined, "test")).toEqual("test");
    });
});

describe("validatePositiveInteger", () => {
    test.each([
        1,
        5,
        10,
        999999,
    ])("validatePositiveInteger(%s) should return undefined", async input => {
        expect(await validatePositiveInteger({value: input, isEditing: false})).toBeUndefined();
    });

    test.each([
        -2,
        3.41,
        0,
        Infinity,
        NaN,
    ])("validatePositiveInteger(%s) should return string", async input => {
        expect(await validatePositiveInteger({value: input, isEditing: false})).toEqual<string>(ERRORS.NOT_POSITIVE_INTEGER);
    });

    test.each([
        -2,
        3.41,
        0,
        Infinity,
        NaN,
    ])("validatePositiveInteger(%s) should return string", async input => {
        expect(await validatePositiveInteger({value: input, isEditing: false}, undefined, "test")).toEqual("test");
    });
});

describe("validatePositiveNumber", () => {
    test.each([
        1,
        5.2,
        10.3,
        999999.999999,
        Infinity,
        Math.PI,
        Math.E,
    ])("validatePositiveNumber(%s) should return undefined", async input => {
        expect(await validatePositiveNumber({value: input, isEditing: false})).toBeUndefined();
    });

    test.each([
        -2,
        -3.41,
        0,
        NaN,
    ])("validatePositiveNumber(%s) should return string", async input => {
        expect(await validatePositiveNumber({value: input, isEditing: false})).toEqual<string>(ERRORS.NOT_POSITIVE);
    });

    test.each([
        -2,
        -3.41,
        0,
        NaN,
    ])("validatePositiveNumber(%s) should return string", async input => {
        expect(await validatePositiveNumber({value: input, isEditing: false}, undefined, "test")).toEqual("test");
    });
});

describe("validatePositive", () => {
    test.each([
        0,
        1,
        5.2,
        10.3,
        999999.999999,
        Infinity,
        Math.PI,
        Math.E,
    ])("validatePositive(%s) should return undefined", async input => {
        expect(await validatePositive({value: input, isEditing: false})).toBeUndefined();
    });

    test.each([
        -2,
        -3.41,
        NaN,
    ])("validatePositive(%s) should return string", async input => {
        expect(await validatePositive({value: input, isEditing: false})).toEqual<string>(ERRORS.NOT_POSITIVE);
    });

    test.each([
        -2,
        -3.41,
        NaN,
    ])("validatePositive(%s) should return string", async input => {
        expect(await validatePositive({value: input, isEditing: false}, undefined, "test")).toEqual("test");
    });
});

describe("validateNegative", () => {
    test.each([
        1,
        5.2,
        10.3,
        999999.999999,
        0,
        Infinity,
        Math.PI,
        Math.E,
        NaN,
    ])("validateNegative(%s) should return string", async input => {
        expect(await validateNegative({value: input, isEditing: false})).toEqual<string>(ERRORS.NOT_NEGATIVE);
    });

    test.each([
        -2,
        -3.41,
        -Infinity,
        -Math.PI,
        -Math.E,
    ])("validateNegative(%s) should return undefined", async input => {
        expect(await validateNegative({value: input, isEditing: false})).toBeUndefined();
    });

    test.each([
        1,
        5.2,
        10.3,
        999999.999999,
        0,
        Infinity,
        Math.PI,
        Math.E,
        NaN,
    ])("validateNegative(%s) should return string", async input => {
        expect(await validateNegative({value: input, isEditing: false}, undefined, "test")).toEqual("test");
    });
});

describe("validateInteger", () => {
    test.each([
        5.2,
        10.3,
        999999.999999,
        Infinity,
        Math.PI,
        Math.E,
        NaN,
    ])("validateInteger(%s) should return undefined", async input => {
        expect(await validateInteger({value: input, isEditing: false})).toEqual<string>(ERRORS.NOT_INTEGER);
    });

    test.each([
        -2,
        3,
    ])("validateInteger(%s) should return string", async input => {
        expect(await validateInteger({value: input, isEditing: false})).toBeUndefined();
    });

    test.each([
        5.2,
        10.3,
        999999.999999,
        Infinity,
        Math.PI,
        Math.E,
        NaN,
    ])("validateInteger(%s) should return string", async input => {
        expect(await validateInteger({value: input, isEditing: false}, undefined, "test")).toEqual("test");
    });
});

describe("validateFinite", () => {
    test.each([
        Infinity,
        NaN,
    ])("validateFinite(%s) should return string", async input => {
        expect(await validateFinite({value: input, isEditing: false})).toEqual<string>(ERRORS.NOT_FINITE);
    });

    test.each([
        -2,
        3.2,
        Math.PI,
        Math.E,
        999999.999999,
    ])("validateFinite(%s) should return undefined", async input => {
        expect(await validateFinite({value: input, isEditing: false})).toBeUndefined();
    });

    test.each([
        Infinity,
        NaN,
    ])("validateFinite(%s) should return string", async input => {
        expect(await validateFinite({value: input, isEditing: false}, undefined, "test")).toEqual("test");
    });
});

describe("validateNonZero", () => {
    test.each([
        0,
        -0,
        0.0,
        NaN,
    ])("validateNonZero(%s) should return string", async input => {
        expect(await validateNonZero({value: input, isEditing: false})).toEqual<string>(ERRORS.NOT_NONZERO);
    });

    test.each([
        -2,
        3.2,
        Math.PI,
        Math.E,
        Infinity,
        999999.999999,
    ])("validateNonZero(%s) should return undefined", async input => {
        expect(await validateNonZero({value: input, isEditing: false})).toBeUndefined();
    });

    test.each([
        0,
        -0,
        0.0,
        NaN,
    ])("validateNonZero(%s) should return string", async input => {
        expect(await validateNonZero({value: input, isEditing: false}, undefined, "test")).toEqual("test");
    });
});

describe("validateNumber", () => {
    test.each([
        NaN,
    ])("validateNumber(%s) should return string", async input => {
        expect(await validateNumber({value: input, isEditing: false})).toEqual<string>(ERRORS.NOT_NUMBER);
    });

    test.each([
        -2,
        3.2,
        Math.PI,
        Math.E,
        Infinity,
        999999.999999,
    ])("validateNumber(%s) should return undefined", async input => {
        expect(await validateNumber({value: input, isEditing: false})).toBeUndefined();
    });

    test.each([
        NaN,
    ])("validateNumber(%s) should return string", async input => {
        expect(await validateNumber({value: input, isEditing: false}, undefined, "test")).toEqual("test");
    });
});

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
