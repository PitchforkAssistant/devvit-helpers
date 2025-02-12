import {Context, SettingsFormFieldValidatorEvent} from "@devvit/public-api";

import {ERRORS} from "../constants/errors.js";

/**
 * This function validates a comma-separated list of usernames.
 * @param event Takes the Devvit string settings field validator object.
 * @param _context Takes the Devvit context object for compatability, but it's not used in this function.
 * @param errorMessage This is the returned error message if the regex test at the end fails, most likely due to username length or invalid characters.
 * @param errorMessagePrefix This is the returned error message if the string contains a forward slash, indicating the presence of a /u/.
 * @param errorMessageSpace This is the returned error message if the string contains a space.
 * @param errorMessageTrailing This is the returned error message if the string ends with a comma.
 * @returns The error message if the validation fails, or undefined if it passes.
 */

export async function validateUsernameList (
    event: SettingsFormFieldValidatorEvent<string>, _context?: Context,
    errorMessage = ERRORS.USERNAMECSV_INVALID,
    errorMessagePrefix = ERRORS.USERNAMECSV_PREFIXED,
    errorMessageSpace = ERRORS.NO_SPACES,
    errorMessageTrailing = ERRORS.NO_TRAILING_COMMA
): Promise<string | undefined> {
    const usernameCSVString = event.value?.toString() ?? "";
    if (!usernameCSVString) {
        return;
    }

    if (usernameCSVString.includes("/")) {
        return errorMessagePrefix;
    } else if (usernameCSVString.includes(" ")) {
        return errorMessageSpace;
    } else if (usernameCSVString.endsWith(",")) {
        return errorMessageTrailing;
    }

    // Usernames can be 3-20 characters long, but there are special cases like subredditNameHere-ModTeam,
    // where it can be 21+8=29 characters. Subreddit names are limited to 21 characters.
    // Update: With user profile subreddits, a subreddit name can be 22 characters long, so we'll allow 22+8=30 characters.
    const usernameCSVRegex = new RegExp(/^[a-zA-Z0-9_-]{3,30}(,[a-zA-Z0-9_-]{3,30})*$/);
    if (!usernameCSVRegex.test(usernameCSVString)) {
        return errorMessage;
    }
}
/**
 * This function validates a comma-separated list of subreddit names.
 * @param event Takes the Devvit string settings field validator object.
 * @param _context Takes the Devvit context object for compatability, but it's not used in this function.
 * @param errorMessage This is the returned error message if the regex test at the end fails, most likely due to subname length or invalid characters.
 * @param errorMessagePrefix This is the returned error message if the string contains a forward slash, indicating the presence of a /r/.
 * @param errorMessageSpace This is the returned error message if the string contains a space.
 * @param errorMessageTrailing This is the returned error message if the string ends with a comma.
 * @returns The error message if the validation fails, or undefined if it passes.
 */

export async function validateSubredditNameList (
    event: SettingsFormFieldValidatorEvent<string>, _context?: Context,
    errorMessage = ERRORS.SUBNAMECSV_INVALID,
    errorMessagePrefix = ERRORS.SUBNAMECSV_PREFIXED,
    errorMessageSpace = ERRORS.NO_SPACES,
    errorMessageTrailing = ERRORS.NO_TRAILING_COMMA
): Promise<string | undefined> {
    const subredditNameCSVString = event.value?.toString() ?? "";
    if (!subredditNameCSVString) {
        return;
    }

    if (subredditNameCSVString.includes("/")) {
        return errorMessagePrefix;
    } else if (subredditNameCSVString.includes(" ")) {
        return errorMessageSpace;
    } else if (subredditNameCSVString.endsWith(",")) {
        return errorMessageTrailing;
    }

    // Subreddit names are limited to 22 characters.
    const subredditNameCSVRegex = new RegExp(/^[a-zA-Z0-9_-]{3,22}(,[a-zA-Z0-9_-]{3,22})*$/);
    if (!subredditNameCSVRegex.test(subredditNameCSVString)) {
        return errorMessage;
    }
}
/**
 * This function validates a username.
 * @param event Takes the Devvit string settings field validator object.
 * @param _context Takes the Devvit context object for compatability, but it's not used in this function.
 * @param errorMessage This is the returned error message if the regex test at the end fails, most likely due to username length or invalid characters.
 * @param errorMessagePrefix This is the returned error message if the string contains a forward slash, indicating the presence of a /u/.
 * @param errorMessageSpace This is the returned error message if the string contains a space.
 * @param errorMessageComma This is the returned error message if the string contains a comma.
 * @returns The error message if the validation fails, or undefined if it passes.
 */

export async function validateUsername (
    event: SettingsFormFieldValidatorEvent<string>, _context?: Context,
    errorMessage = ERRORS.USERNAME_INVALID,
    errorMessagePrefix = ERRORS.USERNAME_PREFIXED,
    errorMessageSpace = ERRORS.NO_SPACES,
    errorMessageComma = ERRORS.NO_COMMA
): Promise<string | undefined> {
    const usernameString = event.value?.toString() ?? "";
    if (!usernameString) {
        return;
    }

    if (usernameString.includes("/")) {
        return errorMessagePrefix;
    } else if (usernameString.includes(" ")) {
        return errorMessageSpace;
    } else if (usernameString.includes(",")) {
        return errorMessageComma;
    }

    // Usernames can be 3-20 characters long, but there are special cases like subredditNameHere-ModTeam,
    const usernameRegex = new RegExp(/^[a-zA-Z0-9_-]{3,30}$/);
    if (!usernameRegex.test(usernameString)) {
        return errorMessage;
    }
}
/**
 * This function validates a subreddit name.
 * @param event Takes the Devvit string settings field validator object.
 * @param _context Takes the Devvit context object for compatability, but it's not used in this function.
 * @param errorMessage This is the returned error message if the regex test at the end fails, most likely due to subreddit name length or invalid characters.
 * @param errorMessagePrefix This is the returned error message if the string contains a forward slash, indicating the presence of a /r/.
 * @param errorMessageSpace This is the returned error message if the string contains a space.
 * @param errorMessageComma This is the returned error message if the string contains a comma.
 * @returns The error message if the validation fails, or undefined if it passes.
 */

export async function validateSubredditName (
    event: SettingsFormFieldValidatorEvent<string>, _context?: Context,
    errorMessage = ERRORS.SUBNAME_INVALID,
    errorMessagePrefix = ERRORS.SUBNAME_PREFIXED,
    errorMessageSpace = ERRORS.NO_SPACES,
    errorMessageComma = ERRORS.NO_COMMA
): Promise<string | undefined> {
    const subredditString = event.value?.toString() ?? "";
    if (!subredditString) {
        return;
    }

    if (subredditString.includes("/")) {
        return errorMessagePrefix;
    } else if (subredditString.includes(" ")) {
        return errorMessageSpace;
    } else if (subredditString.includes(",")) {
        return errorMessageComma;
    }

    // Subreddit names are limited to 22 characters.
    const subredditRegex = new RegExp(/^[a-zA-Z0-9_-]{3,22}$/);
    if (!subredditRegex.test(subredditString)) {
        return errorMessage;
    }
}
