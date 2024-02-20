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
import { IUsersService } from "../application/users.service.interface";
import { User } from "../domain/user.entity";
import { UserAlreadyExistsException } from "../exception/UserAlreadyExists.exception";
import { UserNotFoundException } from "../exception/UserNotFoundException.exception";

@Controller("users")
export class UsersController {
  constructor(@Inject("IUsersService") private readonly userService: IUsersService) {}

  @Post()
  @HttpCode(200)
  async create(@Body() user: User): Promise<User> {
    try {
      return await this.userService.create(user);
    } catch (error) {
      if (error instanceof UserAlreadyExistsException) {
        throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
      }
      throw new HttpException("Internal Server Error", HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Get()
  async findAll(): Promise<User[]> {
    try {
      return await this.userService.findAll();
    } catch (error) {
      throw new HttpException("Internal Server Error", HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Put(":id")
  @HttpCode(201)
  async update(@Param("id") id: string, @Body() user: User): Promise<User> {
    try {
      return await this.userService.update(Number(id), user);
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
      await this.userService.delete(id);
    } catch (error) {
      if (error instanceof UserNotFoundException) {
        throw new HttpException(error.message, HttpStatus.NOT_FOUND);
      }
      throw new HttpException("Internal Server Error", HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
