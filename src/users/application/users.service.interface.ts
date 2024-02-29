import { User } from "../domain/user.entity";

export interface IUsersService {
  create(user: User): Promise<User>;
  findByEmail(email: string): Promise<User>;
  update(id: number, user: User): Promise<User>;
  delete(id: number): Promise<void>;
}
