/**
 * @file Defines common trigger event handlers.
 */

import {OnTriggerEvent, TriggerContext, TriggerEvent, TriggerEventType} from "@devvit/public-api";

/**
 * This function is intended to take any trigger event and log all of it to the console. Useful for seeing what each event returns.
 * @param event A TriggerEvent object
 * @param context A TriggerContext object
 */
export async function onAnyTriggerConsoleLog (event: OnTriggerEvent<TriggerEventType[TriggerEvent]>, context: TriggerContext) {
    // A single log that's too long sometimes doesn't show up at all, so better to do these separately.
    console.log(`type: ${event.type}`);
    console.log(`event: ${JSON.stringify(event)}`);
    console.log(`context: ${JSON.stringify(context)}`);
}
