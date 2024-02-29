export class ProductIsNotValidException extends Error {
  constructor() {
    super("Product is not valid, one or more fields are missing or invalid");
  }
}
