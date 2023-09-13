/**
 * @file This file is home to a collection of miscellaneous helper functions.
 */

/**
 * Get the hostname component of a string containing a URL, or return the default value if the string is not a valid URL.
 * @param urlString A URL in the form of a string.
 * @param defaultValue The value to return if the input cannot be converted to a URL. Empty string by default.
 * @returns The hostname component of the URL, or the default value if the input cannot be converted to a URL.
 */
export function domainFromUrlString (url: string, defaultValue = ""): string {
    try {
        // URL() is not currently available in the Devvit execution environment, so we have to use regex.
        /* const url = new URL(urlString);
           return url.hostname; */
        const hostnameRegex = /(?<=^|:\/\/)(?:www\.)?([^/:\s]+?)(?=\/|:\d|$)/;
        const matches = url.match(hostnameRegex);
        if (matches && matches.length === 2) {
            return matches[1];
        } else {
            return defaultValue;
        }
    } catch (error) {
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
