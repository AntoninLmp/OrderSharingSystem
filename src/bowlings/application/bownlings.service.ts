import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { BowlingPark } from "../domain/bowlingPark.entity";
import { BowlingParkAlreadyExistsException } from "../exception/BowlingParkAlreadyExistsException.exception";
import { BowlingParkNotFoundException } from "../exception/BowlingParkNotFoundException.exception";
import { IBowlingsService } from "./bownlings.interface.service";

@Injectable()
export class BownlingsService implements IBowlingsService {
  constructor(
    @InjectRepository(BowlingPark)
    private readonly bowlingRepository: Repository<BowlingPark>,
  ) {}

  async create(bowling: BowlingPark): Promise<BowlingPark> {
    const { name, town } = bowling;
    const bowlingFound = await this.bowlingRepository.findOneBy({ name: name, town: town });
    if (bowlingFound) {
      throw new BowlingParkAlreadyExistsException(name, town);
    }
    return await this.bowlingRepository.save(bowling);
  }

  async findAll(): Promise<BowlingPark[]> {
    return await this.bowlingRepository.find();
  }

  async findById(bowlingId: number): Promise<BowlingPark> {
    const bowlingFound = await this.bowlingRepository.findOneBy({ id: bowlingId });
    if (!bowlingFound) {
      throw new BowlingParkNotFoundException(bowlingId);
    }
    return bowlingFound;
  }

  async update(id: number, bowling: BowlingPark): Promise<BowlingPark> {
    const bowlingFound = await this.bowlingRepository.findOneBy({ id: id });
    if (!bowlingFound) {
      throw new BowlingParkNotFoundException(id);
    }
    return await this.bowlingRepository.save({ ...bowlingFound, ...bowling });
  }

  async delete(bowlingId: number): Promise<void> {
    const bowlingFound = await this.bowlingRepository.findOneBy({ id: bowlingId });
    if (!bowlingFound) {
      throw new BowlingParkNotFoundException(bowlingId);
    }
    await this.bowlingRepository.remove(bowlingFound);
  }
}
