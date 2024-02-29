import { Injectable } from "@nestjs/common";
import { isEmpty } from "@nestjs/common/utils/shared.utils";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { BowlingAlley } from "../domain/bowlingAlley.entity";
import { BowlingPark } from "../domain/bowlingPark.entity";
import { BowlingAlleyAlreadyExistsInBowlingParkException } from "../exception/BowlingAlleyAlreadyExistsInBowlingParkException.exception";
import { BowlingAlleyIncorrectNumberException } from "../exception/BowlingAlleyIncorrectNumberException.exception";
import { BowlingParkNotFoundException } from "../exception/BowlingParkNotFoundException.exception";
import { IBowlingsAlleyService } from "./bownlingsAlley.interface.service";

@Injectable()
export class BownlingsAlleyService implements IBowlingsAlleyService {
  constructor(
    @InjectRepository(BowlingPark)
    private readonly bowlingRepository: Repository<BowlingPark>,
    @InjectRepository(BowlingAlley)
    private readonly bowlingAlleyRepository: Repository<BowlingAlley>,
  ) {}
  async create(bowlingId: number, bowlingAlley: BowlingAlley): Promise<BowlingAlley> {
    const bowlingFound = await this.bowlingRepository.findOneBy({ id: bowlingId }); // BowlingPark must exist
    if (!bowlingFound) {
      throw new BowlingParkNotFoundException(bowlingId);
    }
    // BowlingAlley must not exist in the BowlingPark
    const bowlingAlleyFound = await this.bowlingAlleyRepository.find({
      where: { number: bowlingAlley.number, bowlingPark: { id: bowlingId } },
      relations: ["bowlingPark"],
    });
    if (!isEmpty(bowlingAlleyFound)) {
      throw new BowlingAlleyAlreadyExistsInBowlingParkException();
    }

    if (bowlingAlley.number < 1 || bowlingAlley.number > 20) {
      throw new BowlingAlleyIncorrectNumberException();
    }
    // TO DO QR Code
    bowlingAlley.qrCode = "TODO";
    bowlingAlley.bowlingPark = bowlingFound;

    return await this.bowlingAlleyRepository.save(bowlingAlley);
  }
  async findAll(bowlingId: number): Promise<BowlingAlley[]> {
    return await this.bowlingAlleyRepository.find({
      where: { bowlingPark: { id: bowlingId } },
      relations: ["bowlingPark"],
    });
  }
}
