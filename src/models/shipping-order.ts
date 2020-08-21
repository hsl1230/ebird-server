import Database from "../database";
import { Customer } from "./customer";

const db = Database.instance;
const bookshelf = db.bookshelf;

export default class ShippingOrder extends bookshelf.Model<ShippingOrder> {
  get tableName() {
    return "shipping_orders";
  }

  get owner(): Customer {
    return this.belongsTo(Customer, "customer_id", "id");
  }
}

export class ShippingOrders extends bookshelf.Collection<ShippingOrder> {
  get model() {
    return ShippingOrder;
  }
}