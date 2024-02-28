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
import { IBowlingsService } from "../application/bownlings.interface.service";
import { IBowlingsAlleyService } from "../application/bownlingsAlley.interface.service";
import { BowlingAlley } from "../domain/bowlingAlley.entity";
import { BowlingPark } from "../domain/bowlingPark.entity";
import { CreateOrUpdateBowlingAlleyDto } from "../dto/CreateOrUpdateBowlingAlley.dto";
import { CreateOrUpdateBowlingParkDto } from "../dto/CreateOrUpdateBowlingPark.dto";
import { BowlingAlleyAlreadyExistsInBowlingParkException } from "../exception/BowlingAlleyAlreadyExistsInBowlingParkException.exception";
import { BowlingAlleyIncorrectNumberException } from "../exception/BowlingAlleyIncorrectNumberException.exception";
import { BowlingParkAlreadyExistsException } from "../exception/BowlingParkAlreadyExistsException.exception";
import { BowlingParkNotFoundException } from "../exception/BowlingParkNotFoundException.exception";

@Controller("bowlings")
export class BowlingsController {
  constructor(
    @Inject("IBowlingsService") private readonly bowlingService: IBowlingsService,
    @Inject("IBowlingsAlleyService") private readonly bowlingAlleyService: IBowlingsAlleyService,
  ) {}

  @Post()
  @HttpCode(200)
  async createBowlingPark(@Body() createOrUpdateBowlingParkDto: CreateOrUpdateBowlingParkDto): Promise<BowlingPark> {
    try {
      return await this.bowlingService.create(createOrUpdateBowlingParkDto as BowlingPark);
    } catch (error) {
      if (error instanceof BowlingParkAlreadyExistsException) {
        throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
      }
      throw new HttpException("Internal Server Error", HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Post(":id/bowlingAlley")
  @HttpCode(200)
  async createBowlingAlley(
    @Param("id") id: number,
    @Body() createOrUpdateBowlingAlleyDto: CreateOrUpdateBowlingAlleyDto,
  ): Promise<BowlingAlley> {
    try {
      return await this.bowlingAlleyService.create(Number(id), createOrUpdateBowlingAlleyDto as BowlingAlley);
    } catch (error) {
      if (error instanceof BowlingParkNotFoundException) {
        throw new HttpException(error.message, HttpStatus.NOT_FOUND);
      }
      if (error instanceof BowlingAlleyAlreadyExistsInBowlingParkException) {
        throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
      }
      if (error instanceof BowlingAlleyIncorrectNumberException) {
        throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
      }
      throw new HttpException("Internal Server Error", HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Get()
  async getAll(): Promise<BowlingPark[]> {
    try {
      return await this.bowlingService.findAll();
    } catch (error) {
      throw new HttpException("Internal Server Error", HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
  @Get(":id/bowlingAlley")
  async getAllAlleyByBowlingPark(@Param("id") id: number): Promise<BowlingAlley[]> {
    try {
      return await this.bowlingAlleyService.findAll(id);
    } catch (error) {
      throw new HttpException("Internal Server Error", HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Get(":id")
  async getById(@Param("id") id: number): Promise<BowlingPark> {
    try {
      return await this.bowlingService.findById(id);
    } catch (error) {
      if (error instanceof BowlingParkNotFoundException) {
        throw new HttpException(error.message, HttpStatus.NOT_FOUND);
      }
      throw new HttpException("Internal Server Error", HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Put(":id")
  async update(
    @Param("id") id: string,
    @Body() createOrUpdateBowlingParkDto: CreateOrUpdateBowlingParkDto,
  ): Promise<BowlingPark> {
    try {
      return await this.bowlingService.update(Number(id), createOrUpdateBowlingParkDto as BowlingPark);
    } catch (error) {
      if (error instanceof BowlingParkNotFoundException) {
        throw new HttpException(error.message, HttpStatus.NOT_FOUND);
      }
      throw new HttpException("Internal Server Error", HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Delete(":id")
  @HttpCode(204)
  async delete(@Param("id") id: number): Promise<void> {
    try {
      await this.bowlingService.delete(id);
    } catch (error) {
      if (error instanceof BowlingParkNotFoundException) {
        throw new HttpException(error.message, HttpStatus.NOT_FOUND);
      }
      throw new HttpException("Internal Server Error", HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
