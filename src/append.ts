import { existsSync, mkdirSync, readFileSync, rmSync, writeFileSync } from "node:fs"
import { AppendOptions, Replacer } from "./type"
import { dirname } from "node:path"

/**
 * Appends a JSON object to an array in a JSON file. If the file doesn't exist, creates it.
 * @param path - The file path where the JSON array is stored
 * @param data - The object to append to the JSON array
 * @param options - Optional configuration for appending
 * @param options.force - If true, recreates the file when JSON parsing fails
 * @param options.space - Number of spaces for JSON indentation (default: 4)
 * @param options.replacer - A function that transforms the results (default: null)
 * @throws {Error} When path or data is not provided
 * @throws {Error} When the file content is not a JSON array
 * @throws {Error} When JSON parsing fails and force option is false
 */
export function appendJSON(path: string, data: object, options?: AppendOptions) {
    if (!path) throw new Error("Path is required")
    if (!data) throw new Error("Data is required")

    const { force = false, space = 4, replacer = null } = options ?? {}
    if (!existsSync(path)) return writeJSON(path, data, replacer, space)

    try {
        const string = readFileSync(path, "utf-8")

        if (!string) {
            rmSync(path, { recursive: true, force: true })
            return writeJSON(path, data, replacer, space)
        }

        const rawdata = JSON.parse(string, replacer as any)
        if (!(rawdata instanceof Array)) {
            throw new Error("File is not an array")
        }

        rawdata.push(data)
        const outJSON = JSON.stringify(rawdata, replacer as any, space)

        writeFileSync(path, outJSON)
    } catch (error) {
        if (force && error instanceof Error && error.message.includes("Unexpected token")) {
            rmSync(path, { recursive: true, force: true })
            return writeJSON(path, data, replacer, space)
        } else {
            throw error
        }
    }
}

/**
 * Writes a JSON object to a file, creating the directory structure if it doesn't exist.
 *
 * @param path - The file path where the JSON should be written
 * @param data - The object to be serialized as JSON
 * @param replacer - A function that transforms the results of stringifying the object
 * @param space - Adds indentation, white space, and line break characters to the JSON string
 * @returns void
 * @throws {Error} If writing to file fails
 */
export function writeJSON(path: string, data: object, replacer: Replacer, space: string | number) {
    if (!existsSync(dirname(path))) mkdirSync(dirname(path), { recursive: true })
    return writeFileSync(path, JSON.stringify([data], replacer as any, space))
}
