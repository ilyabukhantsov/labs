const fibGenerator = require("./lib/fibGenerator");
const consumeWithTimeout = require("./lib/consumeWithTimeout");

const generator = fibGenerator();

const timeout = 3000;

consumeWithTimeout(generator, timeout);
