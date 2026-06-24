import {Context, SettingsFormFieldValidatorEvent} from "@devvit/public-api";

import {ERRORS} from "../constants/errors.js";

/**
 * This function validates a positive integer, zero is not considered valid.
 * @param event Takes the Devvit string settings field validator object.
 * @param _context Takes the Devvit context object for compatability, but it's not used in this function.
 * @param errorMessage The error message to return if the validation fails, returns a default error message if not specified.
 * @returns The error message if the validation fails, or undefined if it passes.
 * @deprecated Consider using validateMultiple with validatePositive, validateInteger, and validateNonZero instead.
 */

export function validatePositiveInteger (event: SettingsFormFieldValidatorEvent<number>, _context?: Context, errorMessage = ERRORS.NOT_POSITIVE_INTEGER): string | undefined {
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

export function validatePositiveNumber (event: SettingsFormFieldValidatorEvent<number>, _context?: Context, errorMessage = ERRORS.NOT_POSITIVE): string | undefined {
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

export function validatePositive (event: SettingsFormFieldValidatorEvent<number>, _context?: Context, errorMessage = ERRORS.NOT_POSITIVE): string | undefined {
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

export function validateNegative (event: SettingsFormFieldValidatorEvent<number>, _context?: Context, errorMessage = ERRORS.NOT_NEGATIVE): string | undefined {
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

export function validateInteger (event: SettingsFormFieldValidatorEvent<number>, _context?: Context, errorMessage = ERRORS.NOT_INTEGER): string | undefined {
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

export function validateNonZero (event: SettingsFormFieldValidatorEvent<number>, _context?: Context, errorMessage = ERRORS.NOT_NONZERO): string | undefined {
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

export function validateFinite (event: SettingsFormFieldValidatorEvent<number>, _context?: Context, errorMessage = ERRORS.NOT_FINITE): string | undefined {
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

export function validateNumber (event: SettingsFormFieldValidatorEvent<number>, _context?: Context, errorMessage = ERRORS.NOT_NUMBER): string | undefined {
    const value = Number(event?.value);
    if (isNaN(value)) {
        return errorMessage;
    }
}
