
import {CustomDateformat} from "../date.js";

export type Placeholder = {
    placeholder: string;
    value: string;
}

/**
* Always require body. Allow for the header and footer to be optional, but if they are present, joiner must also be present.
*/
export type RemovalReasonTemplate = | {
    body: string;
    header?: never;
    footer?: never;
} | {
    body: string;
    header?: string;
    footer?: string;
    joiner: string;
}

/**
 * This is the function that does the actual replacing of the placeholders, but it does no actual fetching of data.
 * @param text Text potentially containing placeholders.
 * @param placeholders A list of objects containing the placeholder and its value.
 * @returns The text with all placeholders replaced (non-recursive).
 */
export function replacePlaceholders (text: string, placeholders: Placeholder[]): string {
    for (const placeholder of placeholders) {
        text = text.replaceAll(placeholder.placeholder, placeholder.value);
    }
    return text;
}

/**
 * This function assembles a removal reason from its components and populates their placeholders.
 * @param body The body of the removal reason, sandwiched between the header and footer.
 * @param placeholders A list of objects containing the placeholder and its value.
 * @param header Prepended to the body, empty by default.
 * @param footer Appended to the body, empty by default.
 * @param joiner The string that joins the header, body, and footer. Defaults to two newlines.
 * @returns The assembled removal reason.
 */
export function assembleRemovalReason (template: RemovalReasonTemplate, placeholders: Placeholder[]): string {
    let text = replacePlaceholders(template.body, placeholders);

    if (template.header) {
        text = replacePlaceholders(template.header, placeholders) + template.joiner + text;
    }
    if (template.footer) {
        text += template.joiner + replacePlaceholders(template.footer, placeholders);
    }

    return text;
}

/**
 * This function converts a Record<string, string> to a list of placeholders.
 * @param record An object containing the placeholder as the key with a corresponding value.
 * @returns List of placeholders.
 */
export function placeholdersFromRecord (record: Record<string, string>): Placeholder[] {
    const placeholders: Placeholder[] = [];
    for (const [placeholder, value] of Object.entries(record)) {
        placeholders.push({placeholder, value});
    }
    return placeholders;
}

/**
 * Async function that takes a value of type T and returns a string.
 */
export type TypeToStringAsync<T> = (arg: T) => Promise<string>;

/**
 * Type that requires all keys of type PlaceholderKeys to be present, and functions to retrieve their values from the DataSource. Hints at adding a customDateformat property to the DataSource.
 */
export type PlaceholderGetters<PlaceholderKeys extends string, DataSource> = {
    [key in PlaceholderKeys]: DataSource extends object & {customDateformat?: CustomDateformat} ? TypeToStringAsync<DataSource & {customDateformat?: CustomDateformat}> : TypeToStringAsync<DataSource>;
}

/**
 * This function takes a record of placeholder getters and a DataSource, and returns a list of placeholders with their values.
 * @param placeholderGetters A record that maps placeholders to functions that retrieve their values from a provided DataSource.
 * @param arg The DataSource to provide to the functions in placeholderGetters.
 * @returns A list of placeholders with their values.
 */
export async function getPlaceholdersFromGetters<PlaceholderKeys extends string, DataSource> (placeholderGetters: PlaceholderGetters<PlaceholderKeys, DataSource>, arg: DataSource): Promise<Placeholder[]> {
    const placeholdersPromises: Promise<Placeholder>[] = Object.entries(placeholderGetters).map(async ([placeholder, getter]) => {
        const value = await (getter as TypeToStringAsync<DataSource>)(arg);
        return {placeholder, value};
    });
    return Promise.all(placeholdersPromises);
}
