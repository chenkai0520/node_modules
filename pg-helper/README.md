# pg-helper

use node-postgres easier

# Examples

```js
const PgHelper = require('@c_kai/pg-helper');

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
});
```

## Examples Run sql

```js
await pgHelper.runSql('select now()');

// with params
await pgHelper.runSql('select power({a}, {b})', { a: 2, b: 4 });
```

## Examples Run transaction sql

```js
await pgHelper.runTSql([
    {
        sql: 'select now()',
    },
    {
        sql: 'select power({a}, {b})',
        params: { a: 2, b: 4}
    }
])
```

or 
```js
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
```



