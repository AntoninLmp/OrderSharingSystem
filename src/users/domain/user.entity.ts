import { Exclude } from "class-transformer";
import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Order } from "../../orders/domain/order.entity";
import { OrderItem } from "../../orders/domain/orderItem.entity";

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

  @Column({ nullable: true })
  assignedParkId: number;

  @ManyToOne(() => Order, (order) => order.contributors)
  order: Order;

  @OneToMany(() => OrderItem, (orderItem) => orderItem.user)
  items: OrderItem[];

  constructor(partial: Partial<User>) {
    Object.assign(this, partial);
  }
}
