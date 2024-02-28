export class BowlingParkIsMissingException extends Error {
  constructor() {
    super("Bowling Park is missing");
  }
}
