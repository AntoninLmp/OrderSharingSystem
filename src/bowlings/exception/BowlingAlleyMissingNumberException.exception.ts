export class BowlingAlleyMissingNumberException extends Error {
  constructor() {
    super("The number of the bowling alley is missing");
  }
}
