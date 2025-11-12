import {Context} from "@devvit/public-api";

import {ERRORS} from "../../src/constants/errors.js";
import {validateMultiple} from "../../src/validators/meta.js";
import {validateFinite, validateInteger, validateNonZero, validateNumber, validatePositive} from "../../src/validators/numbers.js";

test("validateMultiple should return undefined for a valid value", async () => {
    expect(await validateMultiple([validateNumber, validateFinite, validateInteger, validatePositive, validateNonZero], {value: 1, isEditing: false}, {} as Context)).toBeUndefined();
    expect(await validateMultiple([validateNumber, validateFinite, validateInteger, validatePositive, validateNonZero], {value: Infinity, isEditing: false}, {} as Context)).toEqual<string>(ERRORS.NOT_FINITE);
    expect(await validateMultiple([validateNumber, validateFinite, validateInteger, validatePositive, validateNonZero], {value: 0.2, isEditing: false}, {} as Context)).toEqual<string>(ERRORS.NOT_INTEGER);
    expect(await validateMultiple([validateNumber, validatePositive, validateNonZero], {value: -Infinity, isEditing: false}, {} as Context)).toEqual<string>(ERRORS.NOT_POSITIVE);
    expect(await validateMultiple([validateNumber, validateNonZero], {value: 0, isEditing: false}, {} as Context)).toEqual<string>(ERRORS.NOT_NONZERO);
    expect(await validateMultiple([validateNumber, validateNonZero], {value: 0, isEditing: false}, {} as Context, "test")).toEqual("test");
});
