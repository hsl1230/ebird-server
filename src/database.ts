import Knex from "knex";
import Bookshelf from "bookshelf";

export default class Database {
  private static _instance: Database = new Database();
  private _knex: any;
  private _bookshelf: Bookshelf;

  private constructor() {
    this._knex = Knex({
      client: "mysql",
      connection: {
        host: "database-ebird.cg5e9fwanbzy.us-east-2.rds.amazonaws.com",
        user: "ebird",
        password: "oilyXY00",
        database: "ebird",
        charset: "utf8",
      },
    });

    this._bookshelf = Bookshelf(this._knex);
  }

  public static get instance(): Database {
    return Database._instance;
  }

  public get knex() {
    return this._knex;
  }

  public get bookshelf(): Bookshelf {
    return this._bookshelf;
  }
}
