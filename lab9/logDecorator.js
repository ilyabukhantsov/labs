const { performance } = require("perf_hooks");
const { createLogger } = require("./logger");

function log({
  level = "INFO",
  logToFile = false,
  onlyOnError = false,
  jsonOutput = false,
  profile = false,
} = {}) {
  const logger = createLogger({ level, logToFile, jsonOutput });

  return function (target, property, descriptor) {
    const originalFn = descriptor.value;

    descriptor.value = function (...args) {
      const isAsync = originalFn.constructor.name === "AsyncFunction";
      const logMeta = { args };

      const exec = () => {
        const start = performance.now();

        const logResult = (result) => {
          const end = performance.now();
          if (!onlyOnError) {
            logger.log(level, `Function "${property}" returned`, {
              ...logMeta,
              result,
              ...(profile && { execTimeMs: (end - start).toFixed(2) }),
            });
          }
          return result;
        };

        const logError = (err) => {
          logger.log("ERROR", `Function "${property}" threw an error`, {
            ...logMeta,
            error: err.message,
          });
          throw err;
        };

        try {
          const result = originalFn.apply(this, args);
          return isAsync
            ? result.then(logResult).catch(logError)
            : logResult(result);
        } catch (err) {
          logError(err);
        }
      };

      return exec();
    };

    return descriptor;
  };
}

module.exports = { log };
