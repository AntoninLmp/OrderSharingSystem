import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

export enum UserRole {
  AGENT = "agent",
  CUSTOMER = "customer",
}

@Entity("users")
export class User {
  @PrimaryGeneratedColumn()
  id: number;
  @Column()
  name: string;
  @Column()
  email: string;
  @Column({ nullable: true })
  phoneNumber: string;
  @Column({ type: "enum", enum: UserRole, default: UserRole.CUSTOMER })
  role: UserRole;
  @Column({ nullable: true })
  assignedParkId: number;
}
