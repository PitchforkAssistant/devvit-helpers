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
        const hostnameRegex = /(?<=^|:\/\/)(www\.)?([^/:\s]+?)(?=\/|:\d|$)/;
        const matches = url.match(hostnameRegex);
        console.log(matches);
        if (matches && matches.length === 3) {
            return matches[2];
        } else {
            return defaultValue;
        }
    } catch (error) {
        return defaultValue;
    }
}
