import { Column, Entity } from "typeorm";
import { User } from "./user.entity";

@Entity()
export class OrderManager extends User {
  @Column()
  assignedParkId: number;
}
