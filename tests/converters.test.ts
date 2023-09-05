import {toNumberOrDefault} from "../src/helpers/converters.js";

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
