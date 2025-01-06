# CoolIce

[![Discord](https://img.shields.io/discord/1211530334458617866?style=flat&logo=discord&logoColor=ffffff&color=5865f2)](https://discord.gg/FaCCaFM74Q)
[![GitHub Action](https://github.com/softwarexplus/coolice/actions/workflows/test.yaml/badge.svg)](https://github.com/softwarexplus/coolice/actions)
[![NPM Version](https://img.shields.io/npm/v/coolice)](https://www.npmjs.com/package/coolice)
[![NPM Downloads](https://img.shields.io/npm/dy/coolice)](https://www.npmjs.com/package/coolice)
[![NPM Unpacked Size](https://img.shields.io/npm/unpacked-size/coolice)](https://www.npmjs.com/package/coolice)
[![NPM License](https://img.shields.io/npm/l/coolice)](https://github.com/softwarexplus/coolice/blob/main/LICENSE)

A lightweight TypeScript library for appending JSON objects to array-based JSON files.

## Installation

```sh
npm install coolice
```

## Usage

```typescript
import { appendJSON } from "coolice"

// Basic usage
appendJSON("data.json", { name: "John" })

// With options
appendJSON(
    "data.json",
    { name: "John" },
    {
        force: true, // Force create new file if JSON is invalid
        space: 2, // Indentation spaces
        replacer: null // Custom JSON replacer
    }
)
// output: [{ "name": "John" }] --> data.json
```

## API

### appendJSON(path, data, options?)

Appends a JSON object to an array in a JSON file. If the file doesn't exist, creates a new file with the data.

#### Parameters

-   path (string) - The file path where the JSON data should be appended

-   data (object) - The object to append to the JSON array

-   options (optional) - Configuration options:

    -   force (boolean) - Whether to force create new file if JSON is invalid

    -   space (string|number) - Indentation spaces or characters to use

    -   replacer (function|array) - Custom replacer function for JSON.stringify

## License

MIT
