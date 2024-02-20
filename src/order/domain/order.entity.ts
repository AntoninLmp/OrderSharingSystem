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

  @Column({ type: "decimal", default: 0 })
  totalAmount: number;

  @Column({ type: "enum", enum: OrderStatus, default: OrderStatus.INPROGRESS })
  status: OrderStatus;

  @OneToMany(() => User, (user) => user.id)
  contributor: User[];

  @OneToMany(() => OrderItem, (orderItem) => orderItem.id)
  items: OrderItem[];
}
