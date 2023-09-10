/**
 * @file This file contains functions to validate certain Devvit settings fields.
 */

import {SettingsFormFieldValidatorEvent} from "@devvit/public-api";
import {getTimezoneOffset} from "date-fns-tz";
import {enUS} from "date-fns/locale";
import {getLocaleFromString, safeFormatInTimeZone} from "../misc/date.js";
import {ERRORS} from "../constants/errors.js";

/**
 * This function validates a custom date format string.
 * @param event Takes the Devvit string settings field validator object.
 * @param errorMessage The error message to return if the validation fails, returns a default error message if not specified.
 * @returns The error message if the validation fails, or undefined if it passes.
 */
export async function validateCustomDateformat (event: SettingsFormFieldValidatorEvent<string>, errorMessage = ERRORS.INVALID_DATE_TEMPLATE): Promise<string | undefined> {
    if (!safeFormatInTimeZone(new Date(), {dateformat: event?.value?.toString() ?? "", timezone: "UTC", locale: enUS})) {
        return errorMessage;
    }
}

/**
 * This function validates a custom timezone string.
 * @param event Takes the Devvit string settings field validator object.
 * @param errorMessage The error message to return if the validation fails, returns a default error message if not specified.
 * @returns The error message if the validation fails, or undefined if it passes.
 */
export async function validateCustomTimezone (event: SettingsFormFieldValidatorEvent<string>, errorMessage = ERRORS.INVALID_TIMEZONE) {
    if (isNaN(getTimezoneOffset(event?.value?.toString() ?? ""))) {
        return errorMessage;
    }
}

/**
 * This function validates a custom locale string.
 * @param event Takes the Devvit string settings field validator object.
 * @param errorMessage The error message to return if the validation fails, returns a default error message if not specified.
 * @returns The error message if the validation fails, or undefined if it passes.
 */
export async function validateCustomLocale (event: SettingsFormFieldValidatorEvent<string>, errorMessage = ERRORS.INVALID_LOCALE) {
    if (!getLocaleFromString(event?.value?.toString() ?? "")) {
        return errorMessage;
    }
}

/**
 * This function validates a positive integer, zero is not considered valid.
 * @param event Takes the Devvit string settings field validator object.
 * @param errorMessage The error message to return if the validation fails, returns a default error message if not specified.
 * @returns The error message if the validation fails, or undefined if it passes.
 */
export async function validatePositiveInteger (event: SettingsFormFieldValidatorEvent<number>, errorMessage = ERRORS.NOT_POSITIVE_INTEGER) {
    const value = Number(event?.value);
    if (isNaN(value) || value < 0 || !Number.isInteger(value)) {
        return errorMessage;
    }
}
