/**
 * @file This file contains default error messages for the included validators.
 */

export const ERRORS : Record<string, string> = {
    INVALID_TIMEFORMAT: "Invalid timeformat, see: https://date-fns.org/v2.30.0/docs/format",
    INVALID_TIMEZONE: "That is not a valid UTC offset or TZ identifier.",
    INVALID_LOCALE: "That is not a valid locale.",
    NOT_POSITIVE_NUMBER: "This value must be a positive number.",
    NOT_POSITIVE_INTEGER: "This value must be a positive integer.",
};
