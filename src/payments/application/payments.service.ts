import * as stream from "stream";
import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import * as PDFDocument from "pdfkit";
import { Repository } from "typeorm";
import { EmailsService } from "../../emails/application/emails.service";
import { EmailSendingException } from "../../emails/exception/EmailSendingException.exception";
import { Order, OrderStatus } from "../../orders/domain/order.entity";
import { OrderItem } from "../../orders/domain/orderItem.entity";
import { OrderNotFoundException } from "../../orders/exception/OrdersNotFoundException.exception";
import { User } from "../../users/domain/user.entity";
import { UserNotFoundException } from "../../users/exception/UserNotFoundException.exception";
import { OrderHasAlreadyBeenPaidException } from "../exception/OrderHasAlreadyBeenPaidException.exception";
import { UserIsNotAssociatedWithOrderException } from "../exception/UserIsNotAssociatedWithOrderException.exception";
import { IPaymentService } from "./payments.service.interface";

@Injectable()
export class PaymentsService implements IPaymentService {
  constructor(
    @InjectRepository(Order)
    private readonly orderRepository: Repository<Order>,
    @InjectRepository(OrderItem)
    private readonly orderItemRepository: Repository<OrderItem>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly EmailService: EmailsService,
  ) {}
  async paymentSpecificAmount(orderId: number, userId: number, amount: number): Promise<Order> {
    // ---- Order && User must exist ----
    const orderFound = await this.orderRepository.findOneBy({ id: orderId });
    if (!orderFound && orderFound !== null) {
      throw new OrderNotFoundException(orderId);
    }
    console.log("orderFound", orderFound);
    const userFound = await this.userRepository.findOne({
      where: { id: userId },
      relations: { order: true },
    });
    console.log("userFound", userFound);
    if (!userFound) {
      throw new UserNotFoundException(userId);
    }
    if (userFound!.order.id !== orderId) {
      throw new UserIsNotAssociatedWithOrderException(userId, orderId);
    }
    if (orderFound!.status === OrderStatus.COMPLETED) {
      throw new OrderHasAlreadyBeenPaidException(orderId);
    }

    // ---- Payment logic ----
    if (orderFound!.totalAmount <= amount) {
      orderFound!.totalAmount = 0;
      orderFound!.status = OrderStatus.COMPLETED;
    } else {
      orderFound!.totalAmount = Number(orderFound!.totalAmount) - amount;
    }
    await this.orderRepository.save(orderFound!);

    // ---- Send email confirmation of payment ----
    try {
      const invoiceBuffer = await this.createInvoice(userFound, amount!);
      await this.EmailService.sendUserConfirmationOfPayment(userFound!, amount, orderFound!.totalAmount, invoiceBuffer);
    } catch (error) {
      throw new EmailSendingException(error);
    }
    // ---- Send email with remaining amount to others ----
    try {
      const otherUsersInOrder = await this.userRepository.find({
        where: { order: orderFound! },
      });
      for (const user of otherUsersInOrder) {
        if (user.id !== userId) {
          await this.EmailService.sendUserRemainingAmount(user, userFound!.name, amount, orderFound!.totalAmount);
        }
      }
    } catch (error) {
      throw new EmailSendingException(error);
    }
    return orderFound!;
  }

  async paymentTotalAmount(orderId: number, userId: number): Promise<Order> {
    const orderFound = await this.orderRepository.findOneBy({ id: orderId });
    if (!orderFound && orderFound !== null) {
      throw new OrderNotFoundException(orderId);
    }
    try {
      const amount = orderFound!.totalAmount;
      return await this.paymentSpecificAmount(orderId, userId, amount);
    } catch (error) {
      throw error;
    }
  }
  async paymentUserOrder(orderId: number, userId: number): Promise<Order> {
    const orderItemFound = await this.orderItemRepository.find({
      where: { user: { id: userId } },
      relations: ["user", "product"],
    });
    // ---- Get the amount of the order ----
    let totalAmountOfOrder = 0;
    for (const item of orderItemFound) {
      totalAmountOfOrder += item.quantity * item.product.price;
    }
    try {
      return await this.paymentSpecificAmount(orderId, userId, totalAmountOfOrder);
    } catch (error) {
      throw error;
    }
  }

  private async createInvoice(user: User, amountPaid: number): Promise<Buffer> {
    return new Promise((resolve, reject) => {
      const doc = new PDFDocument();
      const buffers: Buffer[] = [];

      doc.on("data", buffers.push.bind(buffers));
      doc.on("end", () => {
        const pdfData = Buffer.concat(buffers);
        resolve(pdfData);
      });
      doc.on("error", reject);

      // Invoice Header
      doc.fontSize(20).text("Invoice", { align: "center" });
      doc.moveDown();

      // User Information
      doc.fontSize(12).text(`Invoice ID: ${user.order.id}`);
      doc.text(`Invoice Date: ${new Date().toLocaleDateString()}`);
      doc.text(`Name: ${user.name}`);
      doc.text(`Email: ${user.email}`);
      doc.text(`Phone Number: ${user.phoneNumber}`);
      doc.moveDown();

      // Order Information
      doc.text(`Order ID: ${user.order.id}`);
      doc.text(`Order Status: ${user.order.status}`);
      doc.text(`Amount Paid: €${amountPaid.toFixed(2)}`);
      doc.text(`Remaining Balance: €${user.order.totalAmount}`);
      doc.moveDown();

      // Footer
      doc.text("Thank you for your business!", { align: "center" });

      // Finalize PDF file
      doc.end();
    });
  }
}
