import { User } from "../domain/user.entity";

export interface IUserManagementService {
  create(user: User): Promise<User>;
  findAll(): Promise<User[]>;
  update(id: number, user: User): Promise<User>;
  delete(id: number): Promise<void>;
}
