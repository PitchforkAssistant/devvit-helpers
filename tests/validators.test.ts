import {ERRORS} from "../src/constants/errors.js";
import {validateCustomDateformat, validateCustomLocale, validateCustomTimezone, validatePositiveInteger, validatePositiveNumber} from "../src/devvit/validators.js";

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
        expect(await validateCustomTimezone({value: input, isEditing: false})).toEqual(ERRORS.INVALID_TIMEZONE);
    });

    test.each([
        "00:00",
        "0",
    ])("validateCustomTimezone(%s) should return string", async input => {
        expect(await validateCustomTimezone({value: input, isEditing: false}, "test")).toEqual("test");
    });
});

describe("validateCustomLocale", () => {
    test.each([
        "enUS",
        "enGB",
        "DE",
    ])("validateCustomLocale(%s) should return undefined", async input => {
        expect(await validateCustomLocale({value: input, isEditing: false})).toBeUndefined();
    });

    test.each([
        "_lib",
        "aww",
    ])("validateCustomLocale(%s) should return string", async input => {
        expect(await validateCustomLocale({value: input, isEditing: false})).toEqual(ERRORS.INVALID_LOCALE);
    });

    test.each([
        "_lib",
        "aww",
    ])("validateCustomLocale(%s) should return string", async input => {
        expect(await validateCustomLocale({value: input, isEditing: false}, "test")).toEqual("test");
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
        expect(await validatePositiveInteger({value: input, isEditing: false})).toEqual(ERRORS.NOT_POSITIVE_INTEGER);
    });

    test.each([
        -2,
        3.41,
        0,
        Infinity,
        NaN,
    ])("validatePositiveInteger(%s) should return string", async input => {
        expect(await validatePositiveInteger({value: input, isEditing: false}, "test")).toEqual("test");
    });
});

describe("validatePositiveNumber", () => {
    test.each([
        1,
        5.2,
        10.3,
        999999.999999,
        Math.PI,
        Math.E,
    ])("validatePositiveNumber(%s) should return undefined", async input => {
        expect(await validatePositiveNumber({value: input, isEditing: false})).toBeUndefined();
    });

    test.each([
        -2,
        -3.41,
        0,
        Infinity,
        NaN,
    ])("validatePositiveNumber(%s) should return string", async input => {
        expect(await validatePositiveNumber({value: input, isEditing: false})).toEqual(ERRORS.NOT_POSITIVE_NUMBER);
    });

    test.each([
        -2,
        -3.41,
        0,
        Infinity,
        NaN,
    ])("validatePositiveNumber(%s) should return string", async input => {
        expect(await validatePositiveNumber({value: input, isEditing: false}, "test")).toEqual("test");
    });
});
