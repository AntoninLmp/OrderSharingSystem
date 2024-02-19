export class UserIdNotMatchingException extends Error {
  constructor() {
    super("User id not matching with the request body id");
  }
}
