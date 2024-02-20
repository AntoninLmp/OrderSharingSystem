import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { User } from "../../userManagement/domain/user.entity";
import { OrderItem } from "./orderItem.entity";

export enum OrderStatus {
  INPROGRESS = "in progress",
  COMPLETED = "completed",
  CANCELLED = "cancelled",
}

@Entity("orders")
export class Order {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: "decimal" })
  totalAmount: number;

  @Column({ type: "enum", enum: OrderStatus, default: OrderStatus.INPROGRESS })
  status: OrderStatus;

  @OneToMany(() => User, (user) => user.id, { cascade: true })
  contributor: User[];

  @OneToMany(() => OrderItem, (orderItem) => orderItem.id, { cascade: true })
  items: OrderItem[];
}
