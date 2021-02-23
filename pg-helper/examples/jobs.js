const {sqlUtils} = require('@c_kai/pg-helper');
const pgHelper = require('./pgHelper');

module.exports = {
  async insert(params, options = {}) {
    options.tableName = JOBS;
    const result = await pgHelper.insert(params, options);
    return result;
  },

  async delete(params, options = {}) {
    options.tableName = JOBS;
    const result = await pgHelper.delete(params, options);
    return result;
  },

  async update(params, options = {}) {
    options.tableName = JOBS;
    if ('percentage' in params && typeof options.update === 'object') {
      options.update.percentage = sqlUtils.literalSql(`(
        CASE WHEN percentage < {percentage} 
        THEN  {percentage}
        ELSE percentage END)`);
    }
    const result = await pgHelper.update(params, options);
    return result;
  },

  async select(params, options = {}) {
    options.tableName = JOBS;
    const result = await pgHelper.select(params, options);
    return result;
  },

  async findOne(params, options = {}) {
    options.tableName = JOBS;
    options.limit = 1;
    const result = await pgHelper.select(params, options);
    return result.rows[0];
  },
};
