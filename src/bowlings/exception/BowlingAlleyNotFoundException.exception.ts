export class BowlingAlleyNotFoundException extends Error {
  constructor() {
    super("Bowling Alley was not found");
  }
}
