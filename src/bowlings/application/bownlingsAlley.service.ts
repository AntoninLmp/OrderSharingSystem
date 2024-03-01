import { Injectable } from "@nestjs/common";
import { isEmpty } from "@nestjs/common/utils/shared.utils";
import { InjectRepository } from "@nestjs/typeorm";
import * as qrcode from "qrcode";
import { Repository } from "typeorm";
import { BowlingAlley } from "../domain/bowlingAlley.entity";
import { BowlingPark } from "../domain/bowlingPark.entity";
import { BowlingAlleyAlreadyExistsInBowlingParkException } from "../exception/BowlingAlleyAlreadyExistsInBowlingParkException.exception";
import { BowlingAlleyIncorrectNumberException } from "../exception/BowlingAlleyIncorrectNumberException.exception";
import { BowlingAlleyMissingNumberException } from "../exception/BowlingAlleyMissingNumberException.exception";
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
    const bowlingParkFound = await this.bowlingRepository.findOneBy({ id: bowlingId }); // BowlingPark must exist
    if (!bowlingParkFound) {
      throw new BowlingParkNotFoundException(bowlingId);
    }

    if (bowlingAlley.number === undefined) {
      throw new BowlingAlleyMissingNumberException();
    }
    if (bowlingAlley.number < 1 || bowlingAlley.number > 20) {
      throw new BowlingAlleyIncorrectNumberException();
    }

    const bowlingAlleyFound = await this.bowlingAlleyRepository.find({
      where: { number: bowlingAlley.number, bowlingPark: { id: bowlingId } },
      relations: ["bowlingPark"],
    });
    if (!isEmpty(bowlingAlleyFound)) {
      throw new BowlingAlleyAlreadyExistsInBowlingParkException();
    }

    bowlingAlley.qrCode = await this.generateQRCode(bowlingAlley.number.toString(), bowlingId.toString());
    bowlingAlley.bowlingPark = bowlingParkFound;

    return await this.bowlingAlleyRepository.save(bowlingAlley);
  }

  async findAll(bowlingId: number): Promise<BowlingAlley[]> {
    return await this.bowlingAlleyRepository.find({
      where: { bowlingPark: { id: bowlingId } },
      relations: ["bowlingPark"],
    });
  }

  private async generateQRCode(bowlingAlley: string, bowlingId: string): Promise<string> {
    try {
      // Generate QR code as a data URL
      return await qrcode.toDataURL(bowlingAlley + "-" + bowlingId);
    } catch (error) {
      console.error("Error generating QR code:", error);
      throw new Error("Failed to generate QR code");
    }
  }
}
