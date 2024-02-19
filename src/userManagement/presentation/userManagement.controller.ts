import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpException,
  HttpStatus,
  Inject,
  Param,
  Post,
  Put,
} from "@nestjs/common";
import { IUserManagementService } from "../application/userManagement.service.interface";
import { User } from "../domain/user.entity";
import { UserAlreadyExistsException } from "../exception/UserAlreadyExists.exception";
import { UserNotFoundException } from "../exception/UserNotFoundException.exception";

@Controller("userManagement")
export class UserManagementController {
  constructor(@Inject("IUserManagementService") private readonly userService: IUserManagementService) {}

  @Post()
  @HttpCode(200)
  async create(@Body() user: User): Promise<User> {
    try {
      return this.userService.create(user);
    } catch (error) {
      if (error instanceof UserAlreadyExistsException) {
        throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
      }
      throw new HttpException("Internal Server Error", HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Get()
  async findAll(): Promise<User[]> {
    return this.userService.findAll();
  }

  @Put(":id")
  @HttpCode(201)
  async update(@Param("id") id: string, @Body() user: User): Promise<User> {
    try {
      return this.userService.update(Number(id), user);
    } catch (error) {
      if (error instanceof UserNotFoundException) {
        throw new HttpException(error.message, HttpStatus.NOT_FOUND);
      }
      throw new HttpException("Internal Server Error", HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Delete(":id")
  @HttpCode(204)
  async delete(@Param("id") id: number): Promise<void> {
    try {
      this.userService.delete(id);
    } catch (error) {
      if (error instanceof UserNotFoundException) {
        throw new HttpException(error.message, HttpStatus.NOT_FOUND);
      }
      throw new HttpException("Internal Server Error", HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
