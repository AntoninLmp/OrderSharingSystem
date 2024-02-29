import { BowlingAlley } from "../domain/bowlingAlley.entity";

export interface IBowlingsAlleyService {
  create(bowlingId: number, bowlingAlley: BowlingAlley): Promise<BowlingAlley>;
  findAll(bowlingId: number): Promise<BowlingAlley[]>;
}
