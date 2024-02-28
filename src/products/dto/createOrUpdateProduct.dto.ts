import { BowlingPark } from "../../bowlings/domain/bowlingPark.entity";

export class CreateOrUpdateProductDto {
  name: string;
  description: string;
  price: number;
  bowlingPark: BowlingPark;
}
