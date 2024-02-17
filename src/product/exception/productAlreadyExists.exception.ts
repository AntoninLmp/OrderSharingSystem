export class ProductAlreadyExistsException extends Error {
  constructor(productId: number) {
    super("Product with id " + productId + " already exists");
  }
}
