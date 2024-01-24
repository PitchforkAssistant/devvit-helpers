/**
 * @file This file contains default error messages for the included validators.
 */

export const ERRORS : Record<string, string> = {
    INVALID_TIMEFORMAT: "Invalid timeformat, see: https://date-fns.org/v2.30.0/docs/format",
    INVALID_TIMEZONE: "That is not a valid UTC offset or TZ identifier.",
    INVALID_LOCALE: "That is not a valid locale.",
    NOT_POSITIVE: "This number must be positive.",
    NOT_NEGATIVE: "This number must be negative.",
    NOT_POSITIVE_INTEGER: "This number must be a positive integer.",
    NOT_NONZERO: "This number can't be zero.",
    NOT_NUMBER: "This value must be a number.",
    NOT_INTEGER: "This number must be an integer.",
    NOT_FINITE: "This number must be finite.",
    USERNAMECSV_INVALID: "List is invalid. Either you have entered an impossible username or otherwise messed up.",
    USERNAMECSV_PREFIXED: "Please enter a list of usernames separated by commas, not including the u/ or /u/ prefixes.",
    SUBNAMECSV_INVALID: "List is invalid. Either you have entered an impossible subreddit name or otherwise messed up.",
    SUBNAMECSV_PREFIXED: "Please enter a list of subreddit names separated by commas, not including the r/ or /r/ prefixes.",
    NO_TRAILING_COMMA: "Please do not end the list with a trailing comma.",
    USERNAME_INVALID: "That is not a valid username.",
    USERNAME_PREFIXED: "Please do not include u/ or /u/ prefix.",
    SUBNAME_INVALID: "That is not a valid subreddit name.",
    SUBNAME_PREFIXED: "Please do not include r/ or /r/ prefix.",
    NO_SPACES: "Please do not include spaces.",
    NO_COMMA: "This field does not accept lists, please do not include commas.",
};
