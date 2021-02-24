# pg-helper

A small helper for node-postgres to help you with building your queries.


[node-postgres](https://node-postgres.com/) 使用序数参数查询`($1, $2, etc)`, 因此变量需要有明确的顺序，一旦参数过多使用起来就异常麻烦，该模块使你更容易、更快速、更安全的构建SQL。

# Install

```shell
  yarn add @c_kai/pg-helper
```
## Featrues

+ 无需明确的顺序的参数化查询, sql中`{}`包括的参数会被对象中的对应值替换，你可以将`{}`模版用到任何需要参数的地方,最终执行时它都会被替换成`$n`的形式

```js

pgHelper.runSql('SELECT * FROM ${tablename} WHERE field1 = {field1} AND field2 = {field2}', {field1, field2});

//当然你仍然可以使用，这两种查询方式是等效的
pgHelper.runSql('SELECT * FROM ${tablename} WHERE field1 = $1 AND field2 = $2', [field1, field2]);
```

+ 提供了`select`、`update`、`delete`、`insert` 等函数方便对单表进行CURD

+ 封装了对事务的操作

```js
await pgHelper.runTSql([
    {
        sql: 'select now()',
    },
    {
        sql: 'select power({a}, {b})',
        params: { a: 2, b: 4}
    }
]);

//OR

let transaction;
try {
  transaction = await pgHelper.getTransaction();
  await pgHelper.runSql('select now()', {
    transaction,
  });
  await pgHelper.runSql('select power({a}, {b})', { a: 2, b: 4}, {
    transaction,
  });
  transaction.commit();

} catch (error) {
  transaction.rollback();
}
```



# API

`PgHelper` Class

### new PgHelper(config, options)
+ config
same as [pg.Pool](https://node-postgres.com/api/pool)
+ options
  + options.autoHump `Boolean` - 如果`autoHump`为true返回字段的名称会格式化为驼峰
  + options.returning `Boolean` - 如果`returning`为true返回结果会包含更新、插入、修改的数据
  + options.logger `Object` - 替换默认的日志需要包含`info`、`error`两个函数
### pgHelper.insert(params, options)

Function

#### params

+ params `Array<Object>` - 插入表的数据，其中`Object`的key需要和字段一一对应
+ options
  + options.tableName`String`- 表名称
  + options.schemaName`String`- 表名称;default: `public`
  + options.returning `Boolean｜Array` - 如果`returning`为true,返回结果会包含插入的数据，为数组时返回数组包含的字段

#### return

same as [pg.queries](https://node-postgres.com/features/queries)

### pgHelper.delete(params, options)

Function

#### params

+ params `Object` - 模版参数，其中`Object`的key需要和SQL模版中`{key}`值一一对应

+ options

  + options.tableName`String`- 表名称

  + options.schemaName`String`- 表名称;default: `public`

  + options.returning `Boolean｜Array` - 如果`returning`为true,返回结果会包含删除的数据，为数组时返回数组包含的字段

  + options.where`Object`  构建where sql 

    ```js
    {
    	id: '>10',
    	type: '={type}',
    	or:{
    		id:'= any({ids})'
    	}
    }
    
    // sql
    //where (id > 0 and type={type} or (id = any({ids} ) )
    ```

    

#### return

same as  [pg.queries](https://node-postgres.com/features/queries)

### pgHelper.update(params, options)

Function

#### params

+ params `Object` - 模版参数，其中`Object`的key需要和SQL模版中`{key}`值一一对应

+ options

  + options.tableName`String`- 表名称

  + options.schemaName`String`- 表名称;default: `public`

  + options.returning `Boolean｜Array` - 如果`returning`为true,返回结果会包含更新的数据，为数组时返回数组包含的字段

  + options.where`Object`  构建where sql 

    ```js
    {
    	id: '>10',
    	type: '={type}',
    	or:{
    		id:'= any({ids})'
    	}
    }
    
    // sql
    //where (id > 0 and type={type} or (id = any({ids} ) )
    ```

    

  + options. update`Array|Object` - 需要更新的字段

    ```js
    ['name', 'type']
    // name = {name},type={type}
    
    OR
    {
    	name: 'name',
    	type: 'myType',
    }
    //name = {name},type={myType}
    
    ```

    

#### return

same as  [pg.queries](https://node-postgres.com/features/queries)



### pgHelper.select(params, options)



Function

#### params

+ params `Object` - 模版参数，其中`Object`的key需要和SQL模版中`{key}`值一一对应

+ options

  + options.tableName`String`- 表名称

  + options.schemaName`String`- 表名称;default: `public`

  + options.where`Object`  构建where sql 

    ```js
    {
    	id: '>10',
    	type: '={type}',
    	or:{
    		id:'= any({ids})'
    	}
    }
    
    // sql
    //where (id > 0 and type={type} or (id = any({ids} ) )
    ```

  + options.limit `int` - limit number

  + options.offset `int` -offset number

  + options.count `Boolean` -是否返回查询的行数

  + options.include `array` - 返回的字段数组default`*`

  + options.order `array` 构建ordersql

    ```js
    ['id', ['type', 'desc'], [''name'', 'asc']]
    
    // order by id, type desc, name asc
    ```

    

#### return

same as  [pg.queries](https://node-postgres.com/features/queries)



### pgHelper.runSql(sqlTem, obj, options)

Function

#### params

+ sqlTem `String`- 执行的sql

+ obj `Object` - 模版参数，其中`Object`的key需要和SQL模版中`{key}`值一一对应

+ options `Object` 

  + options.autoHump `Boolean` - 如果`autoHump`为true返回字段的名称会格式化为驼峰

  + options.returning `Boolean` - 如果`returning`为true返回结果会包含更新、插入、修改的数据

  + options.transaction `Client` - `pgHelper.getTransaction()` 返回值

    ```js
    let transaction;
    try {
      transaction = await pgHelper.getTransaction();
      await pgHelper.runSql('select now()', {
        transaction,
      });
      await pgHelper.runSql('select power({a}, {b})', { a: 2, b: 4}, {
        transaction,
      });
      transaction.commit();
    
    } catch (error) {
      transaction.rollback();
    }
    ```

#### return

same as [pg.queries](https://node-postgres.com/features/queries)

### pgHelper.getTransaction()

Function

Get a transaction Client

### pgHelper.runTSql(sqlTemps)

Function

#### params

+ sqlTemps `Array<object>`

  ```js
  [
    {
      sql: 'select power({a}, {b})',
      params: { a: 2, b: 4}
    },
    {
      sql: 'any sql',
      params: '<any params>'
    }
  ]
  ```

#### return

same as [pg.queries](https://node-postgres.com/features/queries)

### pgHelper.commit()

Function

commit a transaction

### pgHelper.rollback()

Function

rollback a transaction

## sqlUtils

sqlUtils

### sqlUtils.literalSql(str)

#### params 

+ str `String` - 对应某些特殊SQL很有用 ，返回的sql不会在被当作模版中对key,如

  ```js
  // sql
  // update jobs set updated_at = (now() :: date) where id = {id}

  await model.update({
  	id,
  }, {
    table: 'jobs',
  	update: {
      updated_at: '(now() :: date)',
    },
  	where: {
  	id: '={id}'
  },
  });

  // will return error sql
  // update jobs set updated_at = {(now() :: date)}  where id = {id}
  
  
  await model.jobs.update({
  	percentage,
  	status: 'progress',
  }, {
  	update: {
  		status: 'status',
  		percentage: sqlUtils.literalSql(`now()`),
  	},
  	where: {
  	id: '={id}'
  },
  });

  // will return error sql
  // update jobs set updated_at = (now() :: date) where id = {id}
  ```



# Examples

```js
const {PgHelper} = require('@c_kai/pg-helper');

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
    percentage: '= {percentage}'
    or: {
      id: '=1',
    }
  },
  schemaName: 'public',
  tableName: 'jobs',
  autoHump: false,
  count: true,
});
```

## Run sql

```js
await pgHelper.runSql('select now()');

// with params
await pgHelper.runSql('select power({a}, {b})', { a: 2, b: 4 });
```


## Run sql use transaction

```js
await pgHelper.runTSql([
    {
        sql: 'select now()',
    },
    {
        sql: 'select power({a}, {b})',
        params: { a: 2, b: 4}
    }
]);
```

OR
```js
let transaction;
try {
  transaction = await pgHelper.getTransaction();
  await pgHelper.runSql('select now()', {
    transaction,
  });
  await pgHelper.runSql('select power({a}, {b})', { a: 2, b: 4}, {
    transaction,
  });
  transaction.commit();

} catch (error) {
  transaction.rollback();
}
```