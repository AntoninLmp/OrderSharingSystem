import { Injectable } from "@nestjs/common";
import { MailerService } from "@nestjs-modules/mailer";
import { User } from "../../users/domain/user.entity";
import { IEmailsService } from "./emails.interface.service";

@Injectable()
export class EmailsService implements IEmailsService {
  constructor(private readonly mailerService: MailerService) {}

  async sendUserConfirmationOfPayment(user: User, amountPaid: number, remainingAmount: number) {
    try {
      await this.mailerService.sendMail(
        {
          to: user.email,
          subject: "Confirmation of the payment ✔",
          template: "./confirmation", // `.hbs` extension is appended automatically
          context: {
            name: user.name,
            amountPaid: amountPaid,
            remainingAmount: remainingAmount,
          },
        },
        // FOR DEBUGGING
        /*).then((success) => {
          console.log(success);
        })
        .catch((err) => {
          console.log(err);
        }*/
      );
    } catch (error) {
      throw new Error(`Failed to send email to ${user.email}: ${error.message}`);
    }
  }

  async sendUserRemainingAmount(user: User, payerName: string, amountPaid: number, remainingAmount: number) {
    try {
      await this.mailerService.sendMail({
        to: user.email,
        subject: "Remaining amount of order 💵",
        template: "./remainingAmount",
        context: {
          name: user.name,
          payerName: payerName,
          amountPaid: amountPaid,
          remainingAmount: remainingAmount,
        },
      });
    } catch (error) {
      throw new Error(`Failed to send email to ${user.email}: ${error.message}`);
    }
  }
}
