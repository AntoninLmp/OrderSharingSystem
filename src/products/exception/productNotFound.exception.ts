export class ProductNotFoundException extends Error {
  constructor(productId: number) {
    super("Product with id " + productId + " not found");
  }
}
