function memoize(fn, options = {}) {
  const {
    maxSize = Infinity,
    strategy = "LRU",
    ttl = 0,
    customEvict = null,
  } = options;

  const cache = new Map();
  const usage = new Map();

  function getKey(args) {
    return JSON.stringify(args);
  }

  function evictIfNeeded() {
    if (cache.size <= maxSize) return;

    let keyToDelete;

    if (strategy === "LRU") {
      keyToDelete = usage.keys().next().value;
    } else if (strategy === "LFU") {
      let minFreq = Infinity;
      for (const [key, meta] of usage.entries()) {
        if (meta.freq < minFreq) {
          minFreq = meta.freq;
          keyToDelete = key;
        }
      }
    } else if (strategy === "TIME") {
      const now = Date.now();
      for (const [key, meta] of usage.entries()) {
        if (now - meta.time > ttl) {
          keyToDelete = key;
          break;
        }
      }
    } else if (strategy === "CUSTOM" && typeof customEvict === "function") {
      keyToDelete = customEvict({ cache, usage });
    }

    if (keyToDelete) {
      cache.delete(keyToDelete);
      usage.delete(keyToDelete);
    }
  }

  return function (...args) {
    const key = getKey(args);
    const now = Date.now();

    if (cache.has(key)) {
      const meta = usage.get(key);
      if (strategy === "LRU") {
        usage.delete(key);
        usage.set(key, { time: now });
      } else if (strategy === "LFU") {
        meta.freq += 1;
      } else if (strategy === "TIME") {
        if (now - meta.time > ttl) {
          cache.delete(key);
          usage.delete(key);
        } else {
          meta.time = now;
        }
      }

      return cache.get(key).result;
    }

    const result = fn(...args);
    cache.set(key, { result });

    usage.set(key, {
      freq: 1,
      time: now,
    });

    evictIfNeeded();

    return result;
  };
}

const slowSquare = (n) => {
  console.log("Computing...");
  return n * n;
};

const memoizedSquare = memoize(slowSquare, {
  maxSize: 3,
  strategy: "LRU",
});

console.log(memoizedSquare(2));
console.log(memoizedSquare(2));
console.log(memoizedSquare(3));
console.log(memoizedSquare(4));
console.log(memoizedSquare(5));
console.log(memoizedSquare(2));
