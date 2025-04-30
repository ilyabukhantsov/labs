const fs = require("fs");
const util = require("util");

const LOG_LEVELS = ["DEBUG", "INFO", "ERROR"];

function getTimestamp() {
  return new Date().toISOString();
}

function defaultFormatter(level, message, meta) {
  return JSON.stringify({
    timestamp: getTimestamp(),
    level,
    message,
    ...meta,
  });
}

function createLogger({
  level = "INFO",
  logToFile = false,
  filePath = "app.log",
  jsonOutput = false,
  customFormatter = null,
} = {}) {
  const levelIndex = LOG_LEVELS.indexOf(level);

  const formatter =
    customFormatter ||
    (jsonOutput
      ? defaultFormatter
      : (level, message, meta) =>
          `[${getTimestamp()}] [${level}] ${message} ${
            meta ? util.format(meta) : ""
          }`);

  function log(logLevel, message, meta = {}) {
    if (LOG_LEVELS.indexOf(logLevel) < levelIndex) return;
    const output = formatter(logLevel, message, meta);

    if (logToFile) {
      fs.appendFileSync(filePath, output + "\n");
    } else {
      console.log(output);
    }
  }

  return { log };
}
