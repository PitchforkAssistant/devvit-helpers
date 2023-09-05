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
    } catch (error) {
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
    } catch (error) {
        return defaultValue;
    }
}
