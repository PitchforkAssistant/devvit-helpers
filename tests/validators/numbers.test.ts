import {ERRORS} from "../../src/constants/errors.js";
import {validateFinite, validateInteger, validateNegative, validateNonZero, validateNumber, validatePositive, validatePositiveInteger, validatePositiveNumber} from "../../src/validators/numbers.js";

describe("validatePositiveInteger", () => {
    test.each([
        1,
        5,
        10,
        999999,
    ])("validatePositiveInteger(%s) should return undefined", input => {
        expect(validatePositiveInteger({value: input, isEditing: false})).toBeUndefined();
    });

    test.each([
        -2,
        3.41,
        0,
        Infinity,
        NaN,
    ])("validatePositiveInteger(%s) should return string", input => {
        expect(validatePositiveInteger({value: input, isEditing: false})).toEqual<string>(ERRORS.NOT_POSITIVE_INTEGER);
    });

    test.each([
        -2,
        3.41,
        0,
        Infinity,
        NaN,
    ])("validatePositiveInteger(%s) should return string", input => {
        expect(validatePositiveInteger({value: input, isEditing: false}, undefined, "test")).toEqual("test");
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
    ])("validatePositiveNumber(%s) should return undefined", input => {
        expect(validatePositiveNumber({value: input, isEditing: false})).toBeUndefined();
    });

    test.each([
        -2,
        -3.41,
        0,
        NaN,
    ])("validatePositiveNumber(%s) should return string", input => {
        expect(validatePositiveNumber({value: input, isEditing: false})).toEqual<string>(ERRORS.NOT_POSITIVE);
    });

    test.each([
        -2,
        -3.41,
        0,
        NaN,
    ])("validatePositiveNumber(%s) should return string", input => {
        expect(validatePositiveNumber({value: input, isEditing: false}, undefined, "test")).toEqual("test");
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
    ])("validatePositive(%s) should return undefined", input => {
        expect(validatePositive({value: input, isEditing: false})).toBeUndefined();
    });

    test.each([
        -2,
        -3.41,
        NaN,
    ])("validatePositive(%s) should return string", input => {
        expect(validatePositive({value: input, isEditing: false})).toEqual<string>(ERRORS.NOT_POSITIVE);
    });

    test.each([
        -2,
        -3.41,
        NaN,
    ])("validatePositive(%s) should return string", input => {
        expect(validatePositive({value: input, isEditing: false}, undefined, "test")).toEqual("test");
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
    ])("validateNegative(%s) should return string", input => {
        expect(validateNegative({value: input, isEditing: false})).toEqual<string>(ERRORS.NOT_NEGATIVE);
    });

    test.each([
        -2,
        -3.41,
        -Infinity,
        -Math.PI,
        -Math.E,
    ])("validateNegative(%s) should return undefined", input => {
        expect(validateNegative({value: input, isEditing: false})).toBeUndefined();
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
    ])("validateNegative(%s) should return string", input => {
        expect(validateNegative({value: input, isEditing: false}, undefined, "test")).toEqual("test");
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
    ])("validateInteger(%s) should return undefined", input => {
        expect(validateInteger({value: input, isEditing: false})).toEqual<string>(ERRORS.NOT_INTEGER);
    });

    test.each([
        -2,
        3,
    ])("validateInteger(%s) should return string", input => {
        expect(validateInteger({value: input, isEditing: false})).toBeUndefined();
    });

    test.each([
        5.2,
        10.3,
        999999.999999,
        Infinity,
        Math.PI,
        Math.E,
        NaN,
    ])("validateInteger(%s) should return string", input => {
        expect(validateInteger({value: input, isEditing: false}, undefined, "test")).toEqual("test");
    });
});
describe("validateFinite", () => {
    test.each([
        Infinity,
        NaN,
    ])("validateFinite(%s) should return string", input => {
        expect(validateFinite({value: input, isEditing: false})).toEqual<string>(ERRORS.NOT_FINITE);
    });

    test.each([
        -2,
        3.2,
        Math.PI,
        Math.E,
        999999.999999,
    ])("validateFinite(%s) should return undefined", input => {
        expect(validateFinite({value: input, isEditing: false})).toBeUndefined();
    });

    test.each([
        Infinity,
        NaN,
    ])("validateFinite(%s) should return string", input => {
        expect(validateFinite({value: input, isEditing: false}, undefined, "test")).toEqual("test");
    });
});
describe("validateNonZero", () => {
    test.each([
        0,
        -0,
        0,
        NaN,
    ])("validateNonZero(%s) should return string", input => {
        expect(validateNonZero({value: input, isEditing: false})).toEqual<string>(ERRORS.NOT_NONZERO);
    });

    test.each([
        -2,
        3.2,
        Math.PI,
        Math.E,
        Infinity,
        999999.999999,
    ])("validateNonZero(%s) should return undefined", input => {
        expect(validateNonZero({value: input, isEditing: false})).toBeUndefined();
    });

    test.each([
        0,
        -0,
        0,
        NaN,
    ])("validateNonZero(%s) should return string", input => {
        expect(validateNonZero({value: input, isEditing: false}, undefined, "test")).toEqual("test");
    });
});
describe("validateNumber", () => {
    test.each([
        NaN,
    ])("validateNumber(%s) should return string", input => {
        expect(validateNumber({value: input, isEditing: false})).toEqual<string>(ERRORS.NOT_NUMBER);
    });

    test.each([
        -2,
        3.2,
        Math.PI,
        Math.E,
        Infinity,
        999999.999999,
    ])("validateNumber(%s) should return undefined", input => {
        expect(validateNumber({value: input, isEditing: false})).toBeUndefined();
    });

    test.each([
        NaN,
    ])("validateNumber(%s) should return string", input => {
        expect(validateNumber({value: input, isEditing: false}, undefined, "test")).toEqual("test");
    });
});
