import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { BowlingAlley } from "../../bowlings/domain/bowlingAlley.entity";
import { User } from "../../users/domain/user.entity";
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

  @ManyToOne(() => BowlingAlley, (alley) => alley.orders)
  bowlingAlley: BowlingAlley;

  @OneToMany(() => User, (user) => user.order)
  contributors: User[];

  @OneToMany(() => OrderItem, (orderItem) => orderItem.order)
  items: OrderItem[];
}
