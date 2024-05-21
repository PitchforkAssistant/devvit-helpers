/**
 * @file This file contains functions to validate certain Devvit settings fields.
 */

import {Context, SettingsFormFieldValidatorEvent, OnValidateHandler} from "@devvit/public-api";

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
