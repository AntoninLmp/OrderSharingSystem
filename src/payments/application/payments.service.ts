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
  async paymentSpecificAmount(orderId: number, userId: number, amount: number): Promise<Order | null> {
    const orderFound = await this.findOrder(orderId);
    const userFound = await this.findUser(userId, orderId);

    if (orderFound!.totalAmount === 0) {
      throw new OrderHasAlreadyBeenPaidException(orderId);
    }
    await this.processPayment(orderFound, amount);
    await this.sendPaymentConfirmationAndRemainingAmountEmails(orderFound, userFound, amount);
    if (orderFound!.status === OrderStatus.COMPLETED) {
      await this.resetOrder(orderFound);
      return null;
    }
    return orderFound!;
  }

  async paymentTotalAmount(orderId: number, userId: number): Promise<Order | null> {
    try {
      const orderFound = await this.findOrder(orderId);
      const amount = orderFound!.totalAmount;
      return await this.paymentSpecificAmount(orderId, userId, amount);
    } catch (error) {
      throw error;
    }
  }
  async paymentUserOrder(orderId: number, userId: number): Promise<Order | null> {
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
  async paymentInCash(orderId: number, amount: number): Promise<Order | null> {
    const orderFound = await this.findOrder(orderId);
    if (orderFound!.totalAmount === 0) {
      throw new OrderHasAlreadyBeenPaidException(orderId);
    }
    await this.processPayment(orderFound, amount);
    await this.sendRemainingAmountEmailsToAllUsers(orderFound, amount);
    if (orderFound!.status === OrderStatus.COMPLETED) {
      await this.resetOrder(orderFound);
      return null;
    }
    return orderFound!;
  }

  private async findOrder(orderId: number): Promise<Order> {
    const orderFound = await this.orderRepository.findOne({
      where: { id: orderId },
      relations: ["items", "contributors"],
    });
    if (!orderFound && orderFound !== null) {
      throw new OrderNotFoundException(orderId);
    }
    return orderFound!;
  }

  private async findUser(userId: number, orderId: number): Promise<User> {
    const userFound = await this.userRepository.findOne({
      where: { id: userId },
      relations: { order: true },
    });
    if (!userFound) {
      throw new UserNotFoundException(userId);
    }
    if (userFound.order!.id !== orderId) {
      throw new UserIsNotAssociatedWithOrderException(userId, orderId);
    }
    return userFound;
  }
  private async processPayment(order: Order, amount: number): Promise<void> {
    if (order.totalAmount <= amount) {
      order.totalAmount = 0;
      order.status = OrderStatus.COMPLETED;
    } else {
      order.totalAmount = Number(order.totalAmount) - amount;
    }
    await this.orderRepository.save(order);
  }
  async resetOrder(order: Order): Promise<void> {
    // ---- Remove all items from the order ----
    for (const orderItem of order.items) {
      await this.orderItemRepository.remove(orderItem);
    }
    // ---- Update user from the order ----
    for (let i = 0; i < order.contributors.length; i++) {
      const user = await this.userRepository.findOne({ where: { id: order.contributors[i].id }, relations: ["order"] });
      if (user && user!.order !== null) {
        user!.order = null;
        await this.userRepository.save(user!);
      }
    }
    try {
      await this.orderRepository.remove(order);
    } catch (error) {
      console.error("Error deleting order: ", error);
    }
  }

  async sendPaymentConfirmationAndRemainingAmountEmails(order: Order, user: User, amount: number): Promise<void> {
    try {
      const invoiceBuffer = await this.createInvoice(user, amount);
      await this.EmailService.sendUserConfirmationOfPayment(user, amount, order.totalAmount, invoiceBuffer);
    } catch (error) {
      throw new EmailSendingException(error);
    }
    try {
      const otherUsersInOrder = await this.userRepository.find({ where: { order: order } });
      for (const user of otherUsersInOrder) {
        if (user.id !== user.id) {
          await this.EmailService.sendUserRemainingAmount(user, user.name, amount, order.totalAmount);
        }
      }
    } catch (error) {
      throw new EmailSendingException(error);
    }
  }
  async sendRemainingAmountEmailsToAllUsers(order: Order, amount: number): Promise<void> {
    try {
      const usersInOrder = await this.userRepository.find({ where: { order: order } });
      for (const user of usersInOrder) {
        await this.EmailService.sendUserRemainingAmount(user, user.name, amount, order.totalAmount);
      }
    } catch (error) {
      throw new EmailSendingException(error);
    }
  }

  async createInvoice(user: User, amountPaid: number): Promise<Buffer> {
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
      doc.fontSize(12).text(`Invoice ID: ${user.order!.id}`);
      doc.text(`Invoice Date: ${new Date().toLocaleDateString()}`);
      doc.text(`Name: ${user.name}`);
      doc.text(`Email: ${user.email}`);
      doc.text(`Phone Number: ${user.phoneNumber}`);
      doc.moveDown();
      // Order Information
      doc.text(`Order ID: ${user.order!.id}`);
      doc.text(`Order Status: ${user.order!.status}`);
      doc.text(`Amount Paid: €${amountPaid}`);
      doc.text(`Remaining Balance: €${user.order!.totalAmount}`);
      doc.moveDown();
      // Footer
      doc.text("Thank you for your business!", { align: "center" });
      doc.end();
    });
  }
}
