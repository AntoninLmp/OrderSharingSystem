export class UserNotFoundException extends Error {
  constructor(id?: number, email?: string) {
    if (id) {
      super("User with id " + id + " not found");
    } else if (email) {
      super("User with email " + email + " not found");
    } else {
      super("User not found");
    }
  }
}
