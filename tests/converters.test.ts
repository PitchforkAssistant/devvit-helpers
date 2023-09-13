import {toNumberOrDefault, toStringOrDefault, valueToArrayOrUndefined} from "../src/misc/converters.js";

// String, fallback, expected output.
test.each([
    ["21421", 10, 21421],
    ["any text", 10, 10],
    ["234.4", 10, 234.4],
    ["-2", 10, -2],
    ["43310d", 10, 10],
])("toNumberOrDefault(%s, %s) -> %s", (input, fallback, expected) => {
    expect(toNumberOrDefault(input, fallback)).toEqual(expected);
});

// String, fallback, expected output.
test.each([
    ["21421", "", "21421"],
    [{}, "", "[object Object]"],
    [undefined, "", "undefined"],
    ["-2", "", "-2"],
    ["43310d", "", "43310d"],
    [null, "", "null"],
])("toNumberOrDefault(%s, %s) -> %s", (input, fallback, expected) => {
    expect(toStringOrDefault(input, fallback)).toEqual(expected);
});

// Value, expected output.
test.each([
    ["test1,test2,test3", ["test1,test2,test3"]],
    [undefined, undefined],
    [["test1", "test2", "test3"], ["test1", "test2", "test3"]],
    [1, [1]],
    [[1, 2, 3], [1, 2, 3]],
    [[], []],
])("valueToArrayOrUndefined(%s) -> %s", (input, expected) => {
    expect(valueToArrayOrUndefined(input)).toEqual(expected);
});
