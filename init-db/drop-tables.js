
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
var sequence = require('when/sequence');
var _ = require('lodash');

function dropTable(tableName) {
  console.log('Dropping table ', tableName);
  return knex.schema.dropTable(tableName)
}

async function dropTables () {
  var tables = []
  var tableNames = await knex.select({name: 'table_name'}).from('information_schema.tables').where('table_schema', 'ebird')

  console.log('Dropping tables...');

  tables = _.map(tableNames, function (tableName) {
    return function () {
      return dropTable(tableName.name);
    };
  });

  return sequence(tables);
}

dropTables()
.then(function() {
  console.log('Tables dropped!!');
  process.exit(0);
})
.catch(function (error) {
  throw error;
});