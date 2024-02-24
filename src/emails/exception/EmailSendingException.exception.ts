export class EmailSendingException extends Error {
  constructor(error: any) {
    super(`Error sending email: ${error}`);
  }
}
