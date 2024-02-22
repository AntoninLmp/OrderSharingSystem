import { Product } from "../../products/domain/product.entity";
import { Order } from "../domain/order.entity";

export class CreateOrUpdateOrdersItemsDto {
  product: Product;
  order: Order;
  quantity: number;
}
