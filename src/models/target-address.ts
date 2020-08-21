import Database from "../database";

const db = Database.instance;
const bookshelf = db.bookshelf;

export default class TargetAddress extends bookshelf.Model<TargetAddress> {
  get tableName() {
    return "target_addresses";
  }
}

export class TargetAddresses extends bookshelf.Collection<TargetAddress> {
  get model() {
    return TargetAddress;
  }
}