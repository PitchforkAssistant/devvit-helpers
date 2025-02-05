import {Context, SettingsFormFieldValidatorEvent} from "@devvit/public-api";
import {getTimezoneOffset} from "date-fns-tz";
import {enUS} from "date-fns/locale";

import {ERRORS} from "../constants/errors.js";
import {getLocaleFromString, isCustomDateformat} from "../misc/date.js";

/**
 * This function validates a custom date format string.
 * @param event Takes the Devvit string settings field validator object.
 * @param _context Takes the Devvit context object for compatability, but it's not used in this function.
 * @param errorMessage The error message to return if the validation fails, returns a default error message if not specified.
 * @returns The error message if the validation fails, or undefined if it passes.
 */

export async function validateCustomDateformat (event: SettingsFormFieldValidatorEvent<string>, _context?: Context, errorMessage = ERRORS.INVALID_TIMEFORMAT): Promise<string | undefined> {
    if (!isCustomDateformat({dateformat: event.value?.toString() ?? "", timezone: "UTC", locale: enUS})) {
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

export async function validateCustomLocale (event: SettingsFormFieldValidatorEvent<string | string[]>, _context?: Context, errorMessage = ERRORS.INVALID_LOCALE): Promise<string | undefined> {
    if (!getLocaleFromString(event?.value?.toString() ?? "")) {
        return errorMessage;
    }
}
