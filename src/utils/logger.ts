import { createLogger, format, transports } from 'winston'

// Define custom log levels
const customLevels = {
  levels: {
    error: 0,
    warn: 1,
    info: 2,
    http: 3,
    debug: 4,
  },
  colors: {
    error: 'red',
    warn: 'yellow',
    info: 'green',
    http: 'magenta',
    debug: 'blue',
  },
}

// Create a custom format for logs
const customFormat = format.combine(
  format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
  format.printf((info) => {
    // Destructure known properties and collect the rest as meta
    const { timestamp, level, message, ...meta } = info
    return JSON.stringify({
      timestamp,
      level,
      message,
      ...meta,
    })
  }),
)

// Initialize the logger
const logger = createLogger({
  levels: customLevels.levels,
  format: customFormat,
  transports: [
    new transports.Console(),
    // Add more transports here if needed, e.g., file transport
  ],
})

// Export the logger
export default logger
