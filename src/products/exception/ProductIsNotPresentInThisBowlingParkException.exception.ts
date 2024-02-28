export class ProductIsNotPresentInThisBowlingParkException extends Error {
  constructor() {
    super("Product is not present in this bowling park !");
  }
}
