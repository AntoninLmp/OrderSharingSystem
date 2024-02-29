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
  @HttpCode(HttpStatus.OK)
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

  @Post(":bowlingParkId/bowlingAlley")
  @HttpCode(HttpStatus.OK)
  async createBowlingAlley(
    @Param("bowlingParkId") bowlingParkId: number,
    @Body() createOrUpdateBowlingAlleyDto: CreateOrUpdateBowlingAlleyDto,
  ): Promise<BowlingAlley> {
    try {
      return await this.bowlingAlleyService.create(
        Number(bowlingParkId),
        createOrUpdateBowlingAlleyDto as BowlingAlley,
      );
    } catch (error) {
      if (error instanceof BowlingParkNotFoundException) {
        throw new HttpException(error.message, HttpStatus.NOT_FOUND);
      }
      if (
        error instanceof BowlingAlleyAlreadyExistsInBowlingParkException ||
        error instanceof BowlingAlleyIncorrectNumberException
      ) {
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
  @Get(":bowlingParkId/bowlingAlley")
  async getAllAlleyByBowlingPark(@Param("bowlingParkId") bowlingParkId: number): Promise<BowlingAlley[]> {
    try {
      return await this.bowlingAlleyService.findAll(bowlingParkId);
    } catch (error) {
      throw new HttpException("Internal Server Error", HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Get(":bowlingParkId")
  async getById(@Param("bowlingParkId") bowlingParkId: number): Promise<BowlingPark> {
    try {
      return await this.bowlingService.findById(bowlingParkId);
    } catch (error) {
      if (error instanceof BowlingParkNotFoundException) {
        throw new HttpException(error.message, HttpStatus.NOT_FOUND);
      }
      throw new HttpException("Internal Server Error", HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Put(":bowlingParkId")
  async update(
    @Param("bowlingParkId") bowlingParkId: string,
    @Body() createOrUpdateBowlingParkDto: CreateOrUpdateBowlingParkDto,
  ): Promise<BowlingPark> {
    try {
      return await this.bowlingService.update(Number(bowlingParkId), createOrUpdateBowlingParkDto as BowlingPark);
    } catch (error) {
      if (error instanceof BowlingParkNotFoundException) {
        throw new HttpException(error.message, HttpStatus.NOT_FOUND);
      }
      throw new HttpException("Internal Server Error", HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Delete(":bowlingParkId")
  @HttpCode(HttpStatus.NO_CONTENT)
  async delete(@Param("bowlingParkId") bowlingParkId: number): Promise<void> {
    try {
      await this.bowlingService.delete(bowlingParkId);
    } catch (error) {
      if (error instanceof BowlingParkNotFoundException) {
        throw new HttpException(error.message, HttpStatus.NOT_FOUND);
      }
      throw new HttpException("Internal Server Error", HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
