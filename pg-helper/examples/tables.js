const pgHelper = require('./pgHelper');

module.exports = {

  async getCounts(params, options = {}) {
    const { tableSchema, tableName } = params;

    const sql = `SELECT count(*) as counts FROM ${tableSchema}."${tableName}"`;
    const result = await pgHelper.runSql(sql, {}, options);
    return result.rows[0];
  },

  async isExists(params, options = {}) {
    const { tableSchema, tableName } = params;
    const sql = 'SELECT * from information_schema.tables where table_schema = {tableSchema} and table_name = {tableName}';
    const result = await pgHelper.runSql(sql, {
      tableSchema,
      tableName,
    }, options);
    return result.rows[0];
  },
  async isFieldExists(params, options = {}) {
    const { tableSchema, tableName, columnName } = params;

    const sql = 'SELECT * from information_schema.columns where table_schema = {tableSchema} and table_name = {tableName} and column_name = {columnName}';
    const result = await pgHelper.runSql(sql, {
      tableSchema,
      tableName,
      columnName,
    }, options);
    return result.rows[0];
  },
};