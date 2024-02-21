import { Exclude } from "class-transformer";
import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Order } from "../../order/domain/order.entity";

export enum UserRole {
  AGENT = "agent",
  CUSTOMER = "customer",
}

@Entity("users")
export class User {
  @PrimaryGeneratedColumn()
  @Exclude()
  id: number;

  @Column()
  name: string;

  @Column()
  email: string;

  @Column()
  @Exclude()
  password: string;

  @Column({ nullable: true })
  phoneNumber: string;

  @Column({ type: "enum", enum: UserRole, default: UserRole.CUSTOMER })
  role: UserRole;

  @Column({ name: "order_id", nullable: true })
  order_id: number;
  @ManyToOne(() => Order, (order) => order.id)
  @JoinColumn({ name: "order_id" })
  order: Order;

  @Column({ nullable: true })
  assignedParkId: number;
}
