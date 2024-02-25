/**
 * @file Defines common trigger event handlers.
 */

import {TriggerContext, TriggerEvent, TriggerEventType} from "@devvit/public-api";
import {Optional} from "@devvit/shared-types/BuiltinTypes.js";

/**
 * This function is intended to take any trigger event and log all of it to the console. Useful for seeing what each event returns.
 * @param event A TriggerEvent object
 * @param context A TriggerContext object
 */
export async function onAnyTriggerConsoleLog (event: Optional<TriggerEventType[TriggerEvent], "type">, context: TriggerContext) {
    if (event.type) { // No longer present for singular event types :/
        console.log(`type: ${event.type}`);
    }
    // A single log that's too long sometimes doesn't show up at all, so better to do these separately.
    console.log(`event: ${JSON.stringify(event)}`);
    console.log(`context: ${JSON.stringify(context)}`);
}

