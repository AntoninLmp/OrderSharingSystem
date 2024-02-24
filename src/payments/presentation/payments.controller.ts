import { Controller, HttpCode, HttpException, HttpStatus, Inject, Param, Put } from "@nestjs/common";
import { EmailSendingException } from "../../emails/exception/EmailSendingException.exception";
import { Order } from "../../orders/domain/order.entity";
import { OrderNotFoundException } from "../../orders/exception/OrdersNotFoundException.exception";
import { UserNotFoundException } from "../../users/exception/UserNotFoundException.exception";
import { IPaymentService } from "../application/payments.service.interface";
import { OrderHasAlreadyBeenPaidException } from "../exception/OrderHasAlreadyBeenPaidException.exception";
import { UserIsNotAssociatedWithOrderException } from "../exception/UserIsNotAssociatedWithOrderException.exception";

@Controller("payments")
export class PaymentsController {
  constructor(@Inject("IPaymentService") private readonly paymentService: IPaymentService) {}

  @Put("order=:orderid/user=:userId/amount=:amount")
  @HttpCode(201)
  async paymentByUserForOrder(
    @Param("orderid") orderId: number,
    @Param("userId") userId: number,
    @Param("amount") amount: number,
  ): Promise<Order> {
    try {
      return await this.paymentService.payment(Number(orderId), Number(userId), Number(amount));
    } catch (error) {
      if (error instanceof UserNotFoundException || error instanceof OrderNotFoundException) {
        throw new HttpException(error.message, HttpStatus.NOT_FOUND);
      }
      if (error instanceof UserIsNotAssociatedWithOrderException) {
        throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
      }
      if (error instanceof OrderHasAlreadyBeenPaidException) {
        throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
      }
      if (error instanceof EmailSendingException) {
        throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
      }
      throw new HttpException("Internal Server Error", HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
