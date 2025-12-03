/**
 * @file This file is home to a collection of miscellaneous helper functions.
 */

import {chunk} from "lodash-es";

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
    } catch {
        return defaultValue;
    }
}

/**
 * Print each item in an array to the console.
 * @param func The function to use for printing each item in the array, such as console.log or console.error.
 * @param array The array of items to print.
 */
export function printEach (func: (message: unknown) => void, array: unknown[]) {
    for (const item of array) {
        func(item);
    }
}

/**
 * Takes a string as an input and returns an array of strings, each of which is no longer than the specified maximum length.
 * @param str Full string
 * @param maxLen Maximum length of each string in the output array
 * @returns An array of strings, each of which is no longer than the specified maximum length.
 * @deprecated Use lodash.chunk(str, maxLen).map(chunk => chunk.join("")) instead.
 */
export function stringSplitter (str: string, maxLen: number): string[] {
    return chunk(str, maxLen).map(chunk => chunk.join(""));
}
