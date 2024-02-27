import { Exclude } from "class-transformer";
import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { BowlingPark } from "../../bowlings/domain/bowlingPark.entity";
import { OrderItem } from "../../orders/domain/orderItem.entity";

@Entity()
export class Product {
  @PrimaryGeneratedColumn()
  @Exclude()
  id: number;

  @Column()
  name: string;

  @Column()
  description: string;

  @Column()
  price: number;

  @OneToMany(() => OrderItem, (orderItem) => orderItem.product)
  orderItems: OrderItem[];

  @ManyToOne(() => BowlingPark, (park) => park.products)
  bowlingPark: BowlingPark;
}
