const PgHelper = require('../index');


// detail https://node-postgres.com/api/pool
const pgHelper = new PgHelper({
  host,
  user,
  password,
  database,
  port: 5432,
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
}, {
  logger: console
});

(async ()=>{
  let result = await pgHelper.runSql('select now()');
  console.log(result)

  let result2 = await pgHelper.runSql('select power({a}, {b})', {
    a: 2,
    b: 4,
  });
  console.log(result2)


  const result3 = await pgHelper.runTSql([
    {
        sql: 'select now()',
    },
    {
        sql: 'select power({a}, {b})',
        params: { a: 2, b: 4}
    }
  ])
  console.log(result3)

  let transaction;
  try {
    transaction = await pgHelper.getTransaction();
    let result4 = await pgHelper.runSql('select {str1} || {str2}', {
      str1: 'xiao',
      str2: 'hong',
    }, {
      transaction,
    });
    transaction.commit();

    console.log(result4)
  } catch (error) {
    transaction.rollback();
  }
})();