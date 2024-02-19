import { Column, Entity } from "typeorm";
import { User } from "./user.entity";

@Entity()
export class Customer extends User {
  @Column()
  phoneNumber: string;
}
