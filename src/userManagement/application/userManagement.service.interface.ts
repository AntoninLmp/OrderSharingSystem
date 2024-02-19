import { User } from "../domain/user.entity";

export interface IUserManagementService {
  create(user: User): User;
  findAll(): User[];
  update(id: number, user: User): User;
  delete(id: number): void;
}
