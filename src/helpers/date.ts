/**
 * @file This file contains helper functions to simplify certain tasks involving the Date() object, date-fns, and date-fns-tz.
 */

import {Locale} from "date-fns";
import {formatInTimeZone} from "date-fns-tz";
import * as locales from "date-fns/locale";

/**
 *
 * @param datetime A Date() object.
 * @param timeformat The format string to use for formatting the time (see https://date-fns.org/docs/format).
 * @param timezone An IANA timezone string or offset string (see https://github.com/marnusw/date-fns-tz#formatintimezone).
 * @param locale A Locale object from date-fns.
 * @param defaultValue Value returned if something goes wrong, defaults to an empty string.
 * @returns A string containing the formatted time, or the default value if formatInTimeZone() throws an error.
 */
export function safeFormatInTimeZone (datetime: Date, timeformat: string, timezone: string, locale: Locale, defaultValue = ""): string {
    try {
        return formatInTimeZone(datetime, timezone, timeformat, {locale});
    } catch (e) {
        return defaultValue;
    }
}

/**
 * This function checks whether a Date() object is valid by checking whether its getTime() method returns a valid number.
 * @param date A Date() object.
 * @returns True if the date is valid, false if it is invalid.
 */
export function isValidDate (date: Date): boolean {
    return !isNaN(date.getTime());
}

/**
 * Convert a string containing a locale code to a Locale object from date-fns.
 * @param input A string containing a locale code, such as "de", "enUs", "en-US" or "en_US".
 * @returns A Locale object from date-fns, or undefined if the input is not a supported locale.
 */
export function getLocaleFromString (input: string): Locale | undefined {
    const processedInput = input.replace("_", "").replace("-", "").trim().toLowerCase();

    const locale = Object.keys(locales).find(key => key.toLowerCase() === processedInput);
    if (locale) {
        return locales[locale as keyof object] as Locale;
    }
}

/**
 * Returns the difference between two dates in number of seconds.
 * @param a A Date() object.
 * @param b Another Date() object.
 * @returns The difference between the two dates in seconds, or Infinity if either date is invalid.
 */
export function getTimeDeltaInSeconds (a: Date, b: Date): number {
    if (isValidDate(a) && isValidDate(b)) {
        return Math.abs(a.getTime() - b.getTime()) / 1000;
    }
    return Infinity;
}
