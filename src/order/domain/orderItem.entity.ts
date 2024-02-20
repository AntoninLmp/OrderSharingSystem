import { Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { Product } from "../../product/domain/product.entity";

@Entity()
export class OrderItem {
  @PrimaryGeneratedColumn()
  id: number;
  @OneToOne(() => Product)
  @JoinColumn()
  product: Product;
  @Column()
  quantity: number;
}
