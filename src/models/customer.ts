import Database from "../database";
import ShippingOrder from "./shipping-order";
import { Collection } from "bookshelf";
import HoldingOrder from "./holding-order";
import TargetAddress from "./target-address";

const db = Database.instance;
const bookshelf = db.bookshelf;

export class Customer extends bookshelf.Model<Customer> {
  get tableName() {
    return "customers";
  }

  get shippingOrders(): Collection<ShippingOrder> {
    return this.hasMany(ShippingOrder, "customer_id", "id");
  }

  get holdingOrders(): Collection<HoldingOrder> {
    return this.hasMany(HoldingOrder, "customer_id", "id");
  }

  get targetAddresses(): Collection<TargetAddress> {
    return this.hasMany(TargetAddress, "customer_id", "id");
  }
}

export class Customers extends bookshelf.Collection<Customer> {
  get model() {
    return Customer;
  }
}
