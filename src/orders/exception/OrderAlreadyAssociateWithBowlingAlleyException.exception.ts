export class OrderAlreadyAssociateWithBowlingAlleyException extends Error {
  constructor() {
    super("Order already associate with this Bowling Alley !");
  }
}
