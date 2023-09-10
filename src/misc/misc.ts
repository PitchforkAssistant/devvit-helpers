/**
 * @file This file is home to a collection of miscellaneous helper functions.
 */

/**
 * Get the hostname component of a string containing a URL, or return a default value if the string is not a valid URL.
 * @param urlString A URL in the form of a string.
 * @param defaultValue The value to return if the input cannot be converted to a URL. Empty string by default.
 * @returns The hostname component of the URL, or the default value if the input cannot be converted to a URL.
 */
export function domainFromUrlString (urlString: string, defaultValue = ""): string {
    try {
        const url = new URL(urlString);
        return url.hostname;
    } catch (error) {
        return defaultValue;
    }
}
