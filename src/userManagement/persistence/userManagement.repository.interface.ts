import { User } from "../domain/user.entity";

export interface IUserManagementRepository {
  create(user: User): User;
  findAll(): User[];
  findById(id: number): User;
  update(id: number, user: User): User;
  delete(id: number): void;
}
