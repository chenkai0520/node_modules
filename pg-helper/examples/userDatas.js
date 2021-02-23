const pgHelper = require('./pgHelper');

module.exports = {
  async insert(params, options = {}) {
    options.tableName = USER_DATAS;
    const result = await pgHelper.insert(params, options);
    return result;
  },

  async delete(params, options = {}) {
    options.tableName = USER_DATAS;
    const result = await pgHelper.delete(params, options);
    return result;
  },

  async update(params, options = {}) {
    options.tableName = USER_DATAS;
    const result = await pgHelper.update(params, options);
    return result;
  },

  async select(params, options = {}) {
    options.tableName = USER_DATAS;
    const result = await pgHelper.select(params, options);
    return result;
  },

  async findOne(params, options = {}) {
    options.tableName = USER_DATAS;
    options.limit = 1;
    const result = await pgHelper.select(params, options);
    return result.rows[0];
  },
};