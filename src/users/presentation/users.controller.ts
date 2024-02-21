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
import { CreateOrUpdateUserDto } from "../dto/createOrUpdateUser.dto";
import { UserAlreadyExistsException } from "../exception/UserAlreadyExists.exception";
import { UserNotFoundException } from "../exception/UserNotFoundException.exception";

@Controller("users")
export class UsersController {
  constructor(@Inject("IUsersService") private readonly usersService: IUsersService) {}

  @Post()
  @HttpCode(200)
  async create(@Body() createOrUpdateUserDto: CreateOrUpdateUserDto): Promise<User> {
    try {
      const userCreated = await this.usersService.create(createOrUpdateUserDto as User);
      return new User(userCreated);
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
  async update(@Param("id") id: string, @Body() createOrUpdateUserDto: CreateOrUpdateUserDto): Promise<User> {
    try {
      const userUpdated = await this.usersService.update(Number(id), createOrUpdateUserDto as User);
      return new User(userUpdated);
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
