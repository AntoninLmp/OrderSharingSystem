export class BowlingAlleyIsMissingException extends Error {
  constructor() {
    super("Bowling Alley is missing in the body request.");
  }
}
