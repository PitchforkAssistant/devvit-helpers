/**
 * @file This file contains functions to validate certain Devvit settings fields.
 */

import {Context, SettingsFormFieldValidatorEvent, OnValidateHandler} from "@devvit/public-api";
import {getTimezoneOffset} from "date-fns-tz";
import {enUS} from "date-fns/locale";
import {getLocaleFromString, safeFormatInTimeZone} from "../misc/date.js";
import {ERRORS} from "../constants/errors.js";

/**
 * This function lets you chain multiple validators together.
 * @param validators An array of OnValidateHandler functions.
 * @param event SettingsFormFieldValidatorEvent object.
 * @param context Devvit Context object.
 * @param errorMessage The error message to return if the validation fails, returns the error message of the first validator that fails if not specified.
 * @returns The error message of the first validator that fails, or undefined if all validators pass.
 */
export async function validateMultiple<ValueType> (validators: OnValidateHandler<ValueType>[], event: SettingsFormFieldValidatorEvent<ValueType>, context: Context, errorMessage?: string): Promise<string | undefined> {
    for (const validator of validators) {
        const result = await validator(event, context);
        if (result) {
            if (errorMessage) {
                return errorMessage;
            } else {
                return result;
            }
        }
    }
}

/**
 * This function validates a custom date format string.
 * @param event Takes the Devvit string settings field validator object.
 * @param _context Takes the Devvit context object for compatability, but it's not used in this function.
 * @param errorMessage The error message to return if the validation fails, returns a default error message if not specified.
 * @returns The error message if the validation fails, or undefined if it passes.
 */
export async function validateCustomDateformat (event: SettingsFormFieldValidatorEvent<string>, _context?: Context, errorMessage = ERRORS.INVALID_DATE_TEMPLATE): Promise<string | undefined> {
    if (!safeFormatInTimeZone(new Date(), {dateformat: event?.value?.toString() ?? "", timezone: "UTC", locale: enUS})) {
        return errorMessage;
    }
}

/**
 * This function validates a custom timezone string.
 * @param event Takes the Devvit string settings field validator object.
 * @param _context Takes the Devvit context object for compatability, but it's not used in this function.
 * @param errorMessage The error message to return if the validation fails, returns a default error message if not specified.
 * @returns The error message if the validation fails, or undefined if it passes.
 */
export async function validateCustomTimezone (event: SettingsFormFieldValidatorEvent<string>, _context?: Context, errorMessage = ERRORS.INVALID_TIMEZONE): Promise<string | undefined> {
    if (isNaN(getTimezoneOffset(event?.value?.toString() ?? ""))) {
        return errorMessage;
    }
}

/**
 * This function validates a custom locale string.
 * @param event Takes the Devvit string settings field validator object.
 * @param _context Takes the Devvit context object for compatability, but it's not used in this function.
 * @param errorMessage The error message to return if the validation fails, returns a default error message if not specified.
 * @returns The error message if the validation fails, or undefined if it passes.
 */
export async function validateCustomLocale (event: SettingsFormFieldValidatorEvent<string>, _context?: Context, errorMessage = ERRORS.INVALID_LOCALE): Promise<string | undefined> {
    if (!getLocaleFromString(event?.value?.toString() ?? "")) {
        return errorMessage;
    }
}

/**
 * This function validates a positive integer, zero is not considered valid.
 * @param event Takes the Devvit string settings field validator object.
 * @param _context Takes the Devvit context object for compatability, but it's not used in this function.
 * @param errorMessage The error message to return if the validation fails, returns a default error message if not specified.
 * @returns The error message if the validation fails, or undefined if it passes.
 * @deprecated Consider using validateMultiple with validatePositive, validateInteger, and validateNonZero instead.
 */
export async function validatePositiveInteger (event: SettingsFormFieldValidatorEvent<number>, _context?: Context, errorMessage = ERRORS.NOT_POSITIVE_INTEGER): Promise<string | undefined> {
    const value = Number(event?.value);
    if (isNaN(value) || value <= 0 || !Number.isInteger(value)) {
        return errorMessage;
    }
}

/**
 * This function validates a positive number, zero and infinity are not considered valid.
 * @param event Takes the Devvit number settings field validator object.
 * @param _context Takes the Devvit context object for compatability, but it's not used in this function.
 * @param errorMessage The error message to return if the validation fails, returns a default error message if not specified.
 * @returns The error message if the validation fails, or undefined if it passes.
 * @deprecated Consider using validateMultiple with validatePositive and validateNonZero instead.
 */
export async function validatePositiveNumber (event: SettingsFormFieldValidatorEvent<number>, _context?: Context, errorMessage = ERRORS.NOT_POSITIVE): Promise<string | undefined> {
    const value = Number(event?.value);
    if (isNaN(value) || value <= 0) {
        return errorMessage;
    }
}

/**
 * This function validates a positive number.
 * @param event Takes the Devvit number settings field validator object.
 * @param _context Takes the Devvit context object for compatability, but it's not used in this function.
 * @param errorMessage The error message to return if the validation fails, returns a default error message if not specified.
 * @returns The error message if the validation fails, or undefined if it passes.
 */
export async function validatePositive (event: SettingsFormFieldValidatorEvent<number>, _context?: Context, errorMessage = ERRORS.NOT_POSITIVE): Promise<string | undefined> {
    const value = Number(event?.value);
    if (isNaN(value) || value < 0) {
        return errorMessage;
    }
}

/**
 * This function validates a negative number, zero is considered positive.
 * @param event Takes the Devvit number settings field validator object.
 * @param _context Takes the Devvit context object for compatability, but it's not used in this function.
 * @param errorMessage The error message to return if the validation fails, returns a default error message if not specified.
 * @returns
 */
export async function validateNegative (event: SettingsFormFieldValidatorEvent<number>, _context?: Context, errorMessage = ERRORS.NOT_NEGATIVE): Promise<string | undefined> {
    const value = Number(event?.value);
    if (isNaN(value) || value >= 0) {
        return errorMessage;
    }
}

/**
 * This function validates that a number is an integer.
 * @param event Takes the Devvit number settings field validator object.
 * @param _context Takes the Devvit context object for compatability, but it's not used in this function.
 * @param errorMessage The error message to return if the validation fails, returns a default error message if not specified.
 * @returns The error message if the validation fails, or undefined if it passes.
 */
export async function validateInteger (event: SettingsFormFieldValidatorEvent<number>, _context?: Context, errorMessage = ERRORS.NOT_INTEGER): Promise<string | undefined> {
    const value = Number(event?.value);
    if (isNaN(value) || !Number.isInteger(value)) {
        return errorMessage;
    }
}

/**
 * This function validates that a number is not zero.
 * @param event Takes the Devvit number settings field validator object.
 * @param _context Takes the Devvit context object for compatability, but it's not used in this function.
 * @param errorMessage The error message to return if the validation fails, returns a default error message if not specified.
 * @returns The error message if the validation fails, or undefined if it passes.
 */
export async function validateNonZero (event: SettingsFormFieldValidatorEvent<number>, _context?: Context, errorMessage = ERRORS.NOT_NONZERO): Promise<string | undefined> {
    const value = Number(event?.value);
    if (isNaN(value) || value === 0) {
        return errorMessage;
    }
}

/**
 * This function validates that a number is finite as opposed to infinite or NaN.
 * @param event Takes the Devvit number settings field validator object.
 * @param _context Takes the Devvit context object for compatability, but it's not used in this function.
 * @param errorMessage The error message to return if the validation fails, returns a default error message if not specified.
 * @returns The error message if the validation fails, or undefined if it passes.
 */
export async function validateFinite (event: SettingsFormFieldValidatorEvent<number>, _context?: Context, errorMessage = ERRORS.NOT_FINITE): Promise<string | undefined> {
    const value = Number(event?.value);
    if (isNaN(value) || !Number.isFinite(value)) {
        return errorMessage;
    }
}

/**
 * This function validates a number.
 * @param event Takes the Devvit number settings field validator object.
 * @param _context Takes the Devvit context object for compatability, but it's not used in this function.
 * @param errorMessage The error message to return if the validation fails, returns a default error message if not specified.
 * @returns The error message if the validation fails, or undefined if it passes.
 */
export async function validateNumber (event: SettingsFormFieldValidatorEvent<number>, _context?: Context, errorMessage = ERRORS.NOT_NUMBER): Promise<string | undefined> {
    const value = Number(event?.value);
    if (isNaN(value)) {
        return errorMessage;
    }
}

/**
 * This function validates a comma-separated list of usernames.
 * @param event Takes the Devvit string settings field validator object.
 * @param _context Takes the Devvit context object for compatability, but it's not used in this function.
 * @param errorMessage This is the returned error message if the regex test at the end fails.
 * @param errorMessagePrefix This is the returned error message if the string contains a forward slash, indicating the presence of a /u/.
 * @param errorMessageSpace This is the returned error message if the string contains a space.
 * @param errorMessageTrailing This is the returned error message if the string ends with a comma.
 * @returns The error message if the validation fails, or undefined if it passes.
 */
export async function validateUsernameList (
    event: SettingsFormFieldValidatorEvent<string>, _context?: Context,
    errorMessage = ERRORS.USERNAMECSV_INVALID,
    errorMessagePrefix = ERRORS.USERNAMECSV_PREFIXED,
    errorMessageSpace = ERRORS.USERNAMECSV_SPACE,
    errorMessageTrailing = ERRORS.USERNAMECSV_TRAILING
): Promise<string | undefined> {
    const allowedAuthorsString = event.value?.toString() ?? "";
    if (!allowedAuthorsString) {
        return;
    }

    if (allowedAuthorsString.includes("/")) {
        return errorMessagePrefix;
    } else if (allowedAuthorsString.includes(" ")) {
        return errorMessageSpace;
    } else if (allowedAuthorsString.endsWith(",")) {
        return errorMessageTrailing;
    }

    // Usernames can be 3-20 characters long, but there are special cases like subredditNameHere-ModTeam,
    // where it can be 21+8=29 characters. Subreddit names are limited to 21 characters.
    // Update: With user profile subreddits, a subreddit name can be 22 characters long, so we'll allow 22+8=30 characters.
    const allowedAuthorsRegex = new RegExp(/^[a-zA-Z0-9_-]{3,30}(,[a-zA-Z0-9_-]{3,30})*$/);
    if (!allowedAuthorsRegex.test(allowedAuthorsString)) {
        return errorMessage;
    }
}
