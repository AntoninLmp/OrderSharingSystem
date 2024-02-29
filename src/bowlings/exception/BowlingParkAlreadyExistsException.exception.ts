export class BowlingParkAlreadyExistsException extends Error {
  constructor(name: string, town: string) {
    super(" Bowling park " + name + " in " + town + " already exists");
  }
}
