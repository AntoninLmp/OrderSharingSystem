import { BowlingAlley } from "../../bowlings/domain/bowlingAlley.entity";

export class CreateOrUpdateOrdersDto {
  totalAmount: number;
  status: string;
  bowlingAlley: BowlingAlley;
}
