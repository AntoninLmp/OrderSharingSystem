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
  ): Promise<Order | null> {
    try {
      return await this.paymentService.paymentSpecificAmount(Number(orderId), Number(userId), Number(amount));
    } catch (error) {
      this.handlePaymentError(error);
    }
  }
  @Put("total/order=:orderid/user=:userId")
  @HttpCode(201)
  async paymentByUserForOrderWithTotalAmount(
    @Param("orderid") orderId: number,
    @Param("userId") userId: number,
  ): Promise<Order | null> {
    try {
      return await this.paymentService.paymentTotalAmount(Number(orderId), Number(userId));
    } catch (error) {
      this.handlePaymentError(error);
    }
  }
  @Put("order=:orderid/user=:userId")
  @HttpCode(201)
  async paymentByUserForHimself(
    @Param("orderid") orderId: number,
    @Param("userId") userId: number,
  ): Promise<Order | null> {
    try {
      return await this.paymentService.paymentUserOrder(Number(orderId), Number(userId));
    } catch (error) {
      this.handlePaymentError(error);
    }
  }
  @Put("cash/order=:orderid/amount=:amount")
  @HttpCode(201)
  async paymentInCash(@Param("orderid") orderId: number, @Param("amount") amount: number): Promise<Order | null> {
    try {
      return await this.paymentService.paymentInCash(Number(orderId), Number(amount));
    } catch (error) {
      this.handlePaymentError(error);
    }
  }
  private handlePaymentError(error: any): never {
    if (error instanceof UserNotFoundException || error instanceof OrderNotFoundException) {
      throw new HttpException(error.message, HttpStatus.NOT_FOUND);
    }
    if (error instanceof UserIsNotAssociatedWithOrderException || error instanceof OrderHasAlreadyBeenPaidException) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
    if (error instanceof EmailSendingException) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
    throw new HttpException("Internal Server Error", HttpStatus.INTERNAL_SERVER_ERROR);
  }
}
