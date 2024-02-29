import { BowlingPark } from "../domain/bowlingPark.entity";

export interface IBowlingsService {
  findAll(): Promise<BowlingPark[]>;
  findById(bowlingId: number): Promise<BowlingPark>;
  create(bowling: BowlingPark): Promise<BowlingPark>;
  update(id: number, bowling: BowlingPark): Promise<BowlingPark>;
  delete(bowlingId: number): Promise<void>;
}
