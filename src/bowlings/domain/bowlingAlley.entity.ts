import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Order } from "../../orders/domain/order.entity";
import { BowlingPark } from "./bowlingPark.entity";

@Entity()
export class BowlingAlley {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  number: number;

  @Column()
  qrCode: string;

  @ManyToOne(() => BowlingPark, (park) => park.alleys)
  bowlingPark: BowlingPark;

  @OneToMany(() => Order, (order) => order.bowlingAlley)
  orders: Order[];
}
