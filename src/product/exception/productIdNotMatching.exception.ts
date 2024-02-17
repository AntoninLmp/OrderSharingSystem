export class ProductIdNotMatchingException extends Error {
  constructor(idFromParam: number, idFromProduct: number) {
    super("Id " + idFromParam + " from param and product id " + idFromProduct + " does not match");
  }
}
