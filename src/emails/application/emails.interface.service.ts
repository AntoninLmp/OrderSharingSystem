import { User } from "../../users/domain/user.entity";

export interface IEmailsService {
  sendUserConfirmationOfPayment(
    user: User,
    amountPaid: number,
    remainingAmount: number,
    invoice: Buffer,
  ): Promise<void>;
  sendUserRemainingAmount(user: User, payerName: string, amountPaid: number, remainingAmount: number): Promise<void>;
}
