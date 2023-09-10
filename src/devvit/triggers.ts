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
    console.log(`type: ${event.type}\nevent:\n${JSON.stringify(event)}\ncontext:\n${JSON.stringify(context)}`);
}
