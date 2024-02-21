export class OrderAlreadyExistsException extends Error {
  constructor(id: number) {
    super("Order " + id + " already exists");
  }
}
