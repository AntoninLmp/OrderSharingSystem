import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Product } from "../../products/domain/product.entity";
import { BowlingAlley } from "./bowlingAlley.entity";

@Entity()
export class BowlingPark {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  town: string;

  @OneToMany(() => BowlingAlley, (alley) => alley.bowlingPark)
  alleys: BowlingAlley[];

  @OneToMany(() => Product, (product) => product.bowlingPark)
  products: Product[];
}
