export class OrderNotFoundException extends Error {
  constructor(id: number) {
    super(`Order with id ${id} not found`);
  }
}
