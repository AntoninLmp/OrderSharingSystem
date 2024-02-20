export class UserAlreadyExistsException extends Error {
  constructor(userId: number) {
    super("User with id " + userId + " already exists");
  }
}
