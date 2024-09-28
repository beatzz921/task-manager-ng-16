export class RandomNumberGenerator {
  private generatedNumbers: Set<number>;

  constructor() {
    this.generatedNumbers = new Set<number>();
  }

  generateRandomNumber(): number {
    let randomNumber;
    do {
      randomNumber = Math.floor(Math.random() * Number.MAX_SAFE_INTEGER) + 1;
    } while (this.generatedNumbers.has(randomNumber));

    this.generatedNumbers.add(randomNumber);
    return randomNumber;
  }
}
