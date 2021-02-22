const pg = require('pg');
const sqlUtils = require('./utils/sqlUtils');

const { Pool, Client } = pg;
const { sqlTemplate, rowsUnderline2hump } = sqlUtils;

class MyClient extends Client {
  async runSql(sqlTem, obj = {}, options = {}) {
    const pgClient = options.transaction || this;
    const { sql, values } = sqlTemplate(sqlTem, obj);
    const result = await pgClient.query(sql, values);
    return result;
  }

  async begin() {
    await this.query('BEGIN');
  }

  async commit() {
    await this.query('COMMIT');
    await this.release();
  }

  async rollback() {
    await this.query('ROLLBACK');
    await this.release();
  }
}

class PgHelper {
  constructor(pooConfig, options = {}) {
    pooConfig.Client = MyClient;
    this.pooConfig = pooConfig;
    this.autoHump = options.autoHump;
    this.logger = options.logger || console;

    this.initPool();
  }

  initPool() {
    this.pool = new Pool(this.pooConfig);
    this.pool.on('error', (err) => {
      this.logger.error('数据库连接异常', err, this.dbConfig);
      this.pool.connect();
    });
    this.pool.on('connect', () => {
      this.logger.info('已连接数据库');
    });
  }

  async getClient() {
    const client = await this.pool.connect();
    return client;
  }

  async getTransaction() {
    const client = await this.getClient();

    this.logger.info('BEGIN TRANSACTION');
    await client.begin();

    return client;
  }

  async runSql(sqlTem, obj = {}, options = {}) {
    const pgClient = options.transaction || await this.getClient();

    try {
      const result = await pgClient.runSql(sqlTem, obj, options);
      if (this.autoHump) {
        result.rows = rowsUnderline2hump(result.rows);
      }
      return result;
    } catch (err) {
      this.logger.error(err);
      throw err;
    } finally {
      this.logger.info(`sql: ${sqlTem};\nvalues: ${JSON.stringify(obj)}`);
    }
  }

  /**
   * 事务
   * @param {Array<any>} sqlAndParams 参数
   * @returns { boolean } res
   */
  async runTSql(sqlTemps) {
    if (!sqlTemps || !Array.isArray(sqlTemps)) return false;

    // 对事务中的所有语句使用相同的实例
    const pgClient = await this.getClient();
    try {
      await pgClient.begin();

      const result = await Promise.all(sqlTemps.map((sqlTemp)=>{
        return this.runSql(sqlTemp.sql, sqlTemp.parmas, {
          transaction: pgClient,
        })
      }))

      await pgClient.commit();

      return result;
    } catch (err) {
      this.logger.error(err);
      await pgClient.rollback();
      throw err;
    } finally {
      this.logger.info(`TRANSACTION：${sqlTemps.map((item) => item.sql)}`);
    }
  }
}

module.exports = PgHelper;