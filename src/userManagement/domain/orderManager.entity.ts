import { Column, Entity } from "typeorm";
import { User } from "./user.entity";

@Entity()
export class orderManager extends User {
  @Column()
  assignedParkId: number;
}
