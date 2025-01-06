import { describe, it, expect, beforeEach, vi } from "vitest"
import { appendJSON, writeJSON } from "./index"
import { existsSync, readFileSync, writeFileSync, mkdirSync, rmSync } from "node:fs"
import { dirname } from "node:path"

// Mock the fs module
vi.mock("node:fs", () => ({
    existsSync: vi.fn(),
    readFileSync: vi.fn(),
    writeFileSync: vi.fn(),
    mkdirSync: vi.fn(),
    rmSync: vi.fn()
}))

// Mock dirname
vi.mock("node:path", () => ({
    dirname: vi.fn()
}))

describe("appendJSON", () => {
    beforeEach(() => vi.clearAllMocks())

    it("should throw error when path is not provided", () => {
        expect(() => appendJSON("", {})).toThrow("Path is required")
    })

    it("should throw error when data is not provided", () => {
        expect(() => appendJSON("test.json", null as any)).toThrow("Data is required")
    })

    it("should create new file if it does not exist", () => {
        vi.mocked(existsSync).mockReturnValue(false)
        vi.mocked(dirname).mockReturnValue("/test")

        const testData = { test: "data" }
        appendJSON("test.json", testData)

        expect(writeFileSync).toHaveBeenCalledWith("test.json", JSON.stringify([testData], null, 4))
    })

    it("should append data to existing array", () => {
        vi.mocked(existsSync).mockReturnValue(true)
        vi.mocked(readFileSync).mockReturnValue(JSON.stringify([{ existing: "data" }]))

        const newData = { new: "data" }
        appendJSON("test.json", newData)

        expect(writeFileSync).toHaveBeenCalledWith(
            "test.json",
            JSON.stringify([{ existing: "data" }, newData], null, 4)
        )
    })

    it("should handle custom spacing option", () => {
        vi.mocked(existsSync).mockReturnValue(true)
        vi.mocked(readFileSync).mockReturnValue(JSON.stringify([{ existing: "data" }]))

        const newData = { new: "data" }
        appendJSON("test.json", newData, { space: 2 })

        expect(writeFileSync).toHaveBeenCalledWith(
            "test.json",
            JSON.stringify([{ existing: "data" }, newData], null, 2)
        )
    })

    it("should handle custom replacer function", () => {
        vi.mocked(existsSync).mockReturnValue(true)
        vi.mocked(readFileSync).mockReturnValue(JSON.stringify([{ existing: "data" }]))

        const replacer = (key: string, value: any) => (typeof value === "string" ? value.toUpperCase() : value)

        const newData = { new: "data" }
        appendJSON("test.json", newData, { replacer })

        expect(writeFileSync).toHaveBeenCalledWith(
            "test.json",
            JSON.stringify([{ existing: "data" }, newData], replacer, 4)
        )
    })

    it("should throw error when file content is not an array", () => {
        vi.mocked(existsSync).mockReturnValue(true)
        vi.mocked(readFileSync).mockReturnValue('{"not": "an array"}')

        expect(() => appendJSON("test.json", { test: "data" })).toThrow("File is not an array")
    })

    it("should recreate file when JSON parsing fails and force is true", () => {
        vi.mocked(existsSync).mockReturnValue(true)
        vi.mocked(readFileSync).mockReturnValue("invalid json")
        vi.mocked(dirname).mockReturnValue("/test")

        const testData = { test: "data" }
        appendJSON("test.json", testData, { force: true })

        expect(rmSync).toHaveBeenCalledWith("test.json", { recursive: true, force: true })
        expect(writeFileSync).toHaveBeenCalledWith("test.json", JSON.stringify([testData], null, 4))
    })

    it("should throw error when JSON parsing fails and force is false", () => {
        vi.mocked(existsSync).mockReturnValue(true)
        vi.mocked(readFileSync).mockReturnValue("invalid json")

        expect(() => appendJSON("test.json", { test: "data" })).toThrow("Unexpected token")
    })
})

describe("writeJSON", () => {
    beforeEach(() => {
        vi.clearAllMocks()
    })

    it("should create directory if it does not exist", () => {
        vi.mocked(existsSync).mockReturnValue(false)
        vi.mocked(dirname).mockReturnValue("/test/dir")

        const testData = { test: "data" }
        writeJSON("test.json", testData, null, 4)

        expect(mkdirSync).toHaveBeenCalledWith("/test/dir", { recursive: true })
        expect(writeFileSync).toHaveBeenCalledWith("test.json", JSON.stringify([testData], null, 4))
    })

    it("should write file with custom spacing", () => {
        vi.mocked(existsSync).mockReturnValue(true)
        vi.mocked(dirname).mockReturnValue("/test")

        const testData = { test: "data" }
        writeJSON("test.json", testData, null, 2)

        expect(writeFileSync).toHaveBeenCalledWith("test.json", JSON.stringify([testData], null, 2))
    })

    it("should use custom replacer function", () => {
        vi.mocked(existsSync).mockReturnValue(true)
        vi.mocked(dirname).mockReturnValue("/test")

        const replacer = (key: string, value: any) => (typeof value === "string" ? value.toUpperCase() : value)

        const testData = { test: "data" }
        writeJSON("test.json", testData, replacer, 4)

        expect(writeFileSync).toHaveBeenCalledWith("test.json", JSON.stringify([testData], replacer, 4))
    })
})
