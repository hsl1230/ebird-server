
var knex = require('knex')({
  client: 'mysql',
  connection: {
    host: 'database-ebird.cg5e9fwanbzy.us-east-2.rds.amazonaws.com',
    user: 'ebird',
    password: 'oilyXY00',
    database: 'ebird',
    charset: 'utf8'
  }
});
var Bookshelf = require('bookshelf')(knex);
var Schema = require('./schema');
var sequence = require('when/sequence');
var _ = require('lodash');

const dataTypeMappings = {
  string: ['maxlength'], 
  integer: ['maxlength'],
  text: ['textType'],
  float: ['precision', 'scale'],
  double: ['precision', 'scale'],
  decimal: ['precision', 'scale'],
  binary: ['maxlength'],
  enum: ['values'],
  primary: ['columns', 'constraintName'],
  index: ['columns', 'indexName', 'indexType'],
  unique: ['columns', 'indexName']
}


function createTable(tableName) {
  console.log('creating table ', tableName);
  return knex.schema.createTable(tableName, function (table) {

    var column;
    var columnKeys = _.keys(Schema[tableName]);

    _.each(columnKeys, function (key) {
      if (['primary', 'index', 'unique'].includes(key)) {  
        var attributes = dataTypeMappings[key]
        if (key === 'primary') {
          attributes = attributes.map(function (name) { return Schema[tableName][key][name]})
          table[key](...attributes);
        } else {
          Schema[tableName][key].forEach(element => {
            var mappedAttributes = attributes.map(function (name) { return element[name]})
            table[key](...mappedAttributes);
          });
        }  
      } else {
        var attributes = dataTypeMappings[Schema[tableName][key].type]
        if (attributes) {
          attributes = attributes.map(function (name) { return Schema[tableName][key][name]})
          column = table[Schema[tableName][key].type](key, ...attributes)
        } else {
          column = table[Schema[tableName][key].type](key)
        }  
      }

      if (Schema[tableName][key].hasOwnProperty('nullable') && Schema[tableName][key].nullable === true) {
        column.nullable();
      }
      else {
        column.notNullable();
      }

      if (Schema[tableName][key].hasOwnProperty('primary') && Schema[tableName][key].primary === true) {
        column.primary();
      }

      if (Schema[tableName][key].hasOwnProperty('unique') && Schema[tableName][key].unique) {
        column.unique();
      }

      if (Schema[tableName][key].hasOwnProperty('unsigned') && Schema[tableName][key].unsigned) {
        column.unsigned();
      }

      if (Schema[tableName][key].hasOwnProperty('references')) {
        //check if table exists?
        column.references(Schema[tableName][key].references);
      }

      if (Schema[tableName][key].hasOwnProperty('defaultTo')) {
        column.defaultTo(Schema[tableName][key].defaultTo);
      }
    });
  });
}


function createTables () {
  var tables = [];
  var tableNames = _.keys(Schema);

  console.log('Creating tables...');

  tables = _.map(tableNames, function (tableName) {
    return function () {
      return createTable(tableName);
    };
  });

  return sequence(tables);
}

createTables()
.then(function() {
  console.log('Tables created!!');
  process.exit(0);
})
.otherwise(function (error) {
  throw error;
});