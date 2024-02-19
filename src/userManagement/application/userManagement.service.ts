import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { User } from "../domain/user.entity";
import { UserAlreadyExistsException } from "../exception/UserAlreadyExists.exception";
import { UserNotFoundException } from "../exception/UserNotFoundException.exception";
import { IUserManagementService } from "./userManagement.service.interface";

@Injectable()
export class UserManagementService implements IUserManagementService {
  constructor(@InjectRepository(User) private readonly userRepository: Repository<User>) {}

  async create(user: User): Promise<User> {
    console.log("user", user);
    const userFound = await this.userRepository.findOne({
      where: {
        name: user.name,
        email: user.email,
      },
    });
    if (userFound) {
      throw new UserAlreadyExistsException(user.id);
    }
    return await this.userRepository.save(user);
  }

  async findAll(): Promise<User[]> {
    return await this.userRepository.find();
  }

  async update(id: number, user: User): Promise<User> {
    const userFound = await this.userRepository.findOneBy({ id });
    if (!userFound) {
      throw new UserNotFoundException(id);
    }
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
