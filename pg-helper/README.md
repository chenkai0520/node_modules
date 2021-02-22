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
```

## with params
```js
await pgHelper.runSql('select power({a}, {b})', { a: 2, b: 4 });
```

## insert

```js
const result = await pgHelper.insert([{
  percentage: 0,
  type: 'public',
  params: {},
  created_by: 1,
  status: 'created',
  job_uuid: '103',
},{
  percentage: 0,
  type: 'public',
  params: {},
  created_by: 1,
  status: 'created',
  job_uuid: '104',
}], {
  tableName: 'jobs',
  returning: true,
});
```

## delete

```js
const result = await pgHelper.delete({}, {
  tableName: 'jobs',
  transaction,
});
```
## update

```js
const result = await pgHelper.update({
  type: 'pravate',
  status: 'gg',
}, {
  update: ['type', 'status'],
  tableName: 'jobs',
  returning: ['id'],
  transaction,
});
```
## select

```js
const result = await pgHelper.select({
  percentage: 0,
}, {
  where: {
    percentage: ' = {percentage}'
  },
  schemaName: 'public',
  tableName: 'jobs',
  autoHump: false,
});
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



