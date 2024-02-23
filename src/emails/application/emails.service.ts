import { Injectable } from "@nestjs/common";
import { MailerService } from "@nestjs-modules/mailer";
import { User } from "../../users/domain/user.entity";

@Injectable()
export class EmailsService {
  constructor(private readonly mailerService: MailerService) {}

  async sendUserConfirmation(user: User, amountPaid: number, remainingAmount: number) {
    try {
      await this.mailerService.sendMail(
        {
          to: user.email,
          subject: "Confirmation of the payment ✔",
          text: "welcome",
          template: "./confirmation", // `.hbs` extension is appended automatically
          context: {
            // ✏️ filling curly brackets with content
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
}
