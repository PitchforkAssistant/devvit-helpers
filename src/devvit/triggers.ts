/**
 * @file Defines common trigger event handlers.
 */

import {TriggerContext, TriggerEvent, TriggerEventType} from "@devvit/public-api";
import {chunk} from "lodash-es";

import {printEach} from "../index.js";

/**
 * This function is intended to take any trigger event and log all of it to the console. Useful for seeing what each event returns.
 * @param event A TriggerEvent object
 * @param context A TriggerContext object
 */
export async function onAnyTriggerConsoleLog (event: Partial<TriggerEventType[TriggerEvent]>, context: TriggerContext) {
    if (event.type) { // No longer present for singular event types :/
        console.log(`type: ${event.type}`);
    }
    // A single log line can't be longer than ~4970 characters, so we need may need to split them into multiple lines.
    printEach(console.log, chunk(JSON.stringify(event), 4970).map(chunk => chunk.join("")));
    printEach(console.log, chunk(JSON.stringify(context), 4970).map(chunk => chunk.join("")));
}

