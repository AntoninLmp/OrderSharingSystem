import { Inject, Injectable } from "@nestjs/common";
import { User } from "../domain/user.entity";
import { UserAlreadyExistsException } from "../exception/UserAlreadyExists.exception";
import { UserIdNotMatchingException } from "../exception/UserIdNotMatching.exception";
import { UserNotFoundException } from "../exception/UserNotFoundException.exception";
import { IUserManagementRepository } from "../persistence/userManagement.repository.interface";
import { IUserManagementService } from "./userManagement.service.interface";

@Injectable()
export class UserManagementService implements IUserManagementService {
  constructor(@Inject("IUserManagementRepository") private readonly userRepository: IUserManagementRepository) {}

  create(user: User): User {
    if (this.userRepository.findById(user.id)) {
      throw new UserAlreadyExistsException(user.id);
    }
    return this.userRepository.create(user);
  }

  findAll(): User[] {
    return this.userRepository.findAll();
  }

  update(id: number, user: User): User {
    if (id !== user.id) {
      throw new UserIdNotMatchingException();
    }
    if (!this.userRepository.findById(id)) {
      throw new UserNotFoundException(id);
    }
    return this.userRepository.update(id, user);
  }

  delete(id: number): void {
    if (!this.userRepository.findById(id)) {
      throw new UserNotFoundException(id);
    }
    this.userRepository.delete(id);
  }
}
