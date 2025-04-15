function* fibGenerator() {
  let actualNumber = 0;
  let preLastNumber = 1;

  while (true) {
    yield actualNumber;

    let nextNumber = actualNumber + preLastNumber;
    preLastNumber = actualNumber;
    actualNumber = nextNumber;
  }
}

module.exports = fibGenerator;
