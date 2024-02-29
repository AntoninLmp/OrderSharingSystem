export class BowlingParkNotFoundException extends Error {
  constructor(id: number) {
    super("Bowling park with id " + id + " not found");
  }
}
