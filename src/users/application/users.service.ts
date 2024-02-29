import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import * as bcrypt from "bcrypt";
import { Repository } from "typeorm";
import { User } from "../domain/user.entity";
import { UserAlreadyExistsException } from "../exception/UserAlreadyExists.exception";
import { UserNotFoundException } from "../exception/UserNotFoundException.exception";
import { IUsersService } from "./users.service.interface";

@Injectable()
export class UsersService implements IUsersService {
  constructor(@InjectRepository(User) private readonly userRepository: Repository<User>) {}

  async create(user: User): Promise<User> {
    const userFound = await this.userRepository.findOneBy({ email: user.email, name: user.name });

    if (userFound) {
      throw new UserAlreadyExistsException(userFound.email);
    }

    const saltOrRounds = 10;
    user.password = await bcrypt.hash(user.password, saltOrRounds);

    return await this.userRepository.save(user);
  }

  async findByEmail(email: string): Promise<User> {
    const userFound = await this.userRepository.findOneBy({ email });

    if (!userFound) {
      throw new UserNotFoundException(undefined, email);
    }

    return userFound;
  }

  async update(id: number, user: User): Promise<User> {
    const userFound = await this.userRepository.findOneBy({ id });

    if (!userFound) {
      throw new UserNotFoundException(id);
    }

    const saltOrRounds = 10;
    user.password = await bcrypt.hash(user.password, saltOrRounds);
    return await this.userRepository.save({ ...userFound, ...user });
  }

  async delete(id: number): Promise<void> {
    const userFound = await this.userRepository.findOneBy({ id });

    if (!userFound) {
      throw new UserNotFoundException(id);
    }

    await this.userRepository.delete(id);
  }
}
