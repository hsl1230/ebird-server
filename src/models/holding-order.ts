import Database from "../database";
import ShippingOrder from "./shipping-order";
import { Customer } from "./customer";

const db = Database.instance;
const bookshelf = db.bookshelf;

export default class HoldingOrder extends bookshelf.Model<HoldingOrder> {
  get tableName() {
    return "holding_orders";
  }

  get carrier(): Customer {
    return this.belongsTo(Customer, "customer_id", "id");
  }

  get shippingOrder(): ShippingOrder {
    return this.belongsTo(ShippingOrder, "shipping_order_id", "id");
  }
}

export class HoldingOrders extends bookshelf.Collection<HoldingOrder> {
  get model() {
    return HoldingOrder;
  }
}
