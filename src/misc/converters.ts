/**
 * @file This file contains helper functions that convert values to other types, with a default value if the conversion fails.
 */

/**
 *
 * @param input Any value you want to convert to a number.
 * @param defaultValue The value to return if the input cannot be converted to a number.
 * @returns The input converted to a number, or the default value if the input cannot be converted to a number or is NaN.
 */
export function toNumberOrDefault (input: unknown, defaultValue: number): number {
    try {
        const value = Number(input);
        return isNaN(value) ? defaultValue : value;
    } catch {
        return defaultValue;
    }
}

/**
 *
 * @param input Any value you want to convert to a string.
 * @param defaultValue The value to return if the input cannot be converted to a number.
 * @returns The input converted to a number, or the default value if the input cannot be converted to a number or is NaN.
 */
export function toStringOrDefault (input: unknown, defaultValue = ""): string {
    try {
        return String(input);
    } catch {
        return defaultValue;
    }
}

/**
 * Takes a value and returns it as a single item array of that type, or undefined if the input is undefined.
 * @param value A value, array of values, or undefined.
 * @returns The provided value as a single item array, or undefined if the input is undefined, or the input if it is already an array.
 */
export function valueToArrayOrUndefined<T> (value: T | T[] | undefined): T[] | undefined {
    if (Array.isArray(value)) {
        return value;
    } else if (value !== undefined) {
        return [value];
    } else {
        return undefined;
    }
}
