import { Injectable } from "@nestjs/common";
import { User } from "../domain/user.entity";
import { IUserManagementRepository } from "./userManagement.repository.interface";

@Injectable()
export class UserManagementRepository implements IUserManagementRepository {
  private readonly users: { [id: number]: User };
  constructor() {
    this.users = {};
  }
  create(user: User): User {
    this.users[user.id] = user;
    return this.users[user.id];
  }
  findAll(): User[] {
    return Object.values(this.users);
  }
  findById(id: number): User {
    return this.users[id];
  }
  update(id: number, user: User): User {
    this.users[id] = user;
    return this.users[id];
  }
  delete(id: number): void {
    delete this.users[id];
  }
}
