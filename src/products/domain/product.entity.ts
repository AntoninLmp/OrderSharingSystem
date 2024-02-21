import { Exclude } from "class-transformer";
import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

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
}
