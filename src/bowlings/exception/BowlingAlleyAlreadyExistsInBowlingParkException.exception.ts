export class BowlingAlleyAlreadyExistsInBowlingParkException extends Error {
  constructor() {
    super("Bowling alley already exists in bowling park");
  }
}
