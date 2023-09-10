import {ERRORS} from "../src/constants/errors.js";
import {validateCustomDateformat, validateCustomLocale, validateCustomTimezone, validatePositiveInteger} from "../src/devvit/validators.js";

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
        Infinity,
        NaN,
    ])("validatePositiveInteger(%s) should return string", async input => {
        expect(await validatePositiveInteger({value: input, isEditing: false})).toEqual(ERRORS.NOT_POSITIVE_INTEGER);
    });
});
