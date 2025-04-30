class BiDirectionalPriorityQueue {
  constructor() {
    this.queue = []; // элементы хранятся в виде: { item, priority, timestamp }
    this.counter = 0; // для отслеживания порядка вставки
  }

  enqueue(item, priority) {
    this.queue.push({
      item,
      priority,
      timestamp: this.counter++,
    });
  }

  peek(mode = "highest") {
    if (this.queue.length === 0) return null;

    switch (mode) {
      case "highest":
        return this.queue.reduce((a, b) => (b.priority > a.priority ? b : a))
          .item;
      case "lowest":
        return this.queue.reduce((a, b) => (b.priority < a.priority ? b : a))
          .item;
      case "oldest":
        return this.queue.reduce((a, b) => (b.timestamp < a.timestamp ? a : b))
          .item;
      case "newest":
        return this.queue.reduce((a, b) => (b.timestamp > a.timestamp ? a : b))
          .item;
      default:
        throw new Error(`Invalid peek mode: ${mode}`);
    }
  }

  dequeue(mode = "highest") {
    if (this.queue.length === 0) return null;

    let index = 0;
    for (let i = 1; i < this.queue.length; i++) {
      const a = this.queue[i];
      const b = this.queue[index];
      if (
        (mode === "highest" && a.priority > b.priority) ||
        (mode === "lowest" && a.priority < b.priority) ||
        (mode === "oldest" && a.timestamp < b.timestamp) ||
        (mode === "newest" && a.timestamp > b.timestamp)
      ) {
        index = i;
      }
    }

    return this.queue.splice(index, 1)[0].item;
  }
}

const q = new BiDirectionalPriorityQueue();

q.enqueue("apple", 2);
q.enqueue("banana", 5);
q.enqueue("cherry", 1);
q.enqueue("date", 5);

console.log(q.peek("highest")); // banana (или date — одинаковый приоритет)
console.log(q.dequeue("highest")); // banana
console.log(q.peek("lowest")); // cherry
console.log(q.dequeue("oldest")); // apple
console.log(q.dequeue("newest")); // date
