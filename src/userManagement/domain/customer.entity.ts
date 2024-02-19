import { Column, Entity } from "typeorm";
import { User } from "./user.entity";

@Entity()
export class customer extends User {
  @Column()
  phoneNumber: string;
}
