export class UserIsNotAssociatedWithOrderException extends Error {
  constructor(userId: number, orderId: number) {
    super(`User with id ${userId} is not associated with order ${orderId}`);
  }
}
