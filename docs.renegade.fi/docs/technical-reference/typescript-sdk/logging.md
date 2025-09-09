---
sidebar_position: 7
title: Logging
hide_title: true
description: How to configure and use logging in the Renegade TypeScript SDK
slug: /technical-reference/typescript-sdk/logging
---

# Logging

The Renegade SDK provides flexible logging capabilities to help you monitor and debug your application. By default, the SDK operates silently, but you can easily integrate your preferred logging library to capture detailed information about SDK operations.

## Overview

The SDK uses a minimal logger interface that can be implemented by any logging library (e.g., pino, winston, console). This design allows you to use your existing logging infrastructure without additional dependencies.

## Logger Interface

The SDK expects a logger that implements the following interface:

```typescript
interface Logger {
    debug(message: string, meta?: Record<string, unknown>): void;
    info(message: string, meta?: Record<string, unknown>): void;
    warn(message: string, meta?: Record<string, unknown>): void;
    error(message: string, meta?: Record<string, unknown>): void;
    child?(context: Record<string, unknown>): Logger;
}
```

## Basic Setup

### Using a Custom Logger

For production applications, integrate your preferred logging library:

```js
import { RenegadeClient } from "@renegade-fi/node";
import pino from "pino";

// Create a pino logger with pretty printing for development
const pinoLogger = pino({
    level: "debug", // Set to debug to see all SDK logs
    transport: {
        target: "pino-pretty",
        options: {
            colorize: true,
        },
    },
});

// Implement the Logger interface expected by the SDK
const logger = {
    debug: (message, meta) => pinoLogger.debug(meta, message),
    info: (message, meta) => pinoLogger.info(meta, message),
    warn: (message, meta) => pinoLogger.warn(meta, message),
    error: (message, meta) => pinoLogger.error(meta, message),
};

const renegadeClient = RenegadeClient.new({
    chainId: 421614,
    seed: "0x...",
    logger,
});
```

## Log Levels

The SDK uses four log levels to categorize different types of information:

- **`debug`**: Verbose diagnostic details useful for debugging (e.g., task progress, WebSocket events)
- **`info`**: General informational messages about normal operations
- **`warn`**: Recoverable issues or potential problems
- **`error`**: Errors and unexpected failures

## Log Message Structure

SDK log messages follow a consistent structure with a descriptive message and optional metadata:

```js
// Example log messages you'll see:
logger.debug("task create-wallet(...)", {
    walletId: "...",
    taskId: "..."
});
```

## Common Metadata Fields

The SDK includes relevant context in log metadata. Common fields include:

- **`walletId`**: The wallet identifier for the operation
- **`taskId`**: The task identifier for async operations
- **`orderId`**: The order identifier for trading operations
