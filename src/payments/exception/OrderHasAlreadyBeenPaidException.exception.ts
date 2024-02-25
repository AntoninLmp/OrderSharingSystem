export class OrderHasAlreadyBeenPaidException extends Error {
  constructor(id: number) {
    super(`Order ${id} has already been paid`);
  }
}
