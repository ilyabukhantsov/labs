function consumeWithTimeout(iterator, timeoutMs) {
  const startTime = Date.now();
  let result;

  while ((result = iterator.next().value) !== undefined) {
    if (Date.now() - startTime > timeoutMs) {
      console.log("Timeout reached");
      break;
    }

    console.log(result);
  }
}

module.exports = consumeWithTimeout;
