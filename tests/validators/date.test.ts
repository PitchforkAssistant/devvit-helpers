import {ERRORS} from "../../src/constants/errors.js";
import {LOCALE_OPTIONS} from "../../src/constants/locales.js";
import {validateCustomDateformat, validateCustomLocale, validateCustomTimezone} from "../../src/validators/date.js";

describe("validateCustomDateformat", () => {
    test.each([
        "yyyy-MM-dd HH:mm:ss",
        "yyyy-MM-dd",
        "yyyy-MM-dd HH:mm",
        "HH:mm:ss",
        "HH:mm",
        " ",
        "yyyy",
    ])("validateCustomDateformat(%s) should return undefined", async input => {
        expect(await validateCustomDateformat({value: input, isEditing: false})).toBeUndefined();
    });

    test.each([
        "clearly shouldn't be valid",
        "🙃 random text",
        "qwerty",
        "",
        undefined,
    ])("validateCustomDateformat(%s) should return string", async input => {
        expect(await validateCustomDateformat({value: input, isEditing: false})).toEqual(ERRORS.INVALID_TIMEFORMAT);
    });

    test.each([
        "invalid format",
        undefined,
    ])("validateCustomDateformat(%s) should return string", async input => {
        expect(await validateCustomDateformat({value: input, isEditing: false}, undefined, "test")).toEqual("test");
    });
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

    test.each([...LOCALE_OPTIONS])("validateCustomLocale(%s) should validate with all LOCALE_OPTIONS", async input => {
        expect(await validateCustomLocale({...input, isEditing: false})).toBeUndefined();
    });
});
