export class ProductAlreadyExistsException extends Error {
  constructor() {
    super("Product already exists");
  }
}
