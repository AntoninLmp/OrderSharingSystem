export class BowlingAlleyIncorrectNumberException extends Error {
  constructor() {
    super("The number of the alley must be between 1 and 20");
  }
}
