import {ERRORS} from "../../src/constants/errors.js";
import {validateFinite, validateInteger, validateNegative, validateNonZero, validateNumber, validatePositive, validatePositiveInteger, validatePositiveNumber} from "../../src/validators/numbers.js";

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
        0,
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
        0,
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
