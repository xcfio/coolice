/**
 * Options for appending data.
 * @interface AppendOptions
 * @property {boolean} [force] - When true, forces the append operation even if there are conflicts.
 * @property {string | number} [space] - Defines indentation for the output.
 * @property {Replacer} [replacer] - A function or array used to transform values during the operation.
 */
export type AppendOptions = {
    force?: boolean
    space?: string | number
    replacer?: Replacer
}

/**
 * A type representing a replacer function or array for JSON serialization.
 *
 * @type {Function|Array|null}
 *
 * When provided as a function:
 * - The function is called for each property in the object being stringified
 * - It receives the key and value as parameters, and 'this' is bound to the object being processed
 * - It should return the transformed value, or undefined to exclude the property
 *
 * When provided as an array:
 * - Only properties listed in the array will be included in the stringification
 * - Array elements should be strings or numbers representing property names
 *
 * When null:
 * - All properties of the object are included in their original form
 */
export type Replacer = ((this: any, key: string, value: any) => any) | (number | string)[] | null
