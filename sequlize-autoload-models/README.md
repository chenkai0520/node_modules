# sequlize-autoload-models
sequlize-autoload-models

# example
models

```
./models
├── data.js
├── table
│   ├── table1.js
│   └── table2.js
└── user.js
```

/models/user.js
```js
function user (sequlize) {
  sequelize.define('modelName', {
    columnA: {
        type: Sequelize.BOOLEAN,
        field: 'column_a'
    },
    columnB: Sequelize.STRING,
    columnC: 'MY VERY OWN COLUMN TYPE'
  });
}

modules.exports = user;
```

```javascript
const path = require('path');
const { Sequelize } = require('sequelize');
const autoloadModels = require('@c_kai/sequlize-autoload-models');


let sequelize = new Sequelize('postgres://postgres:postgres@localhost:5432/dbname');
sequelize = autoloadModels( sequelize, path.join(__dirname, './models'));

console.log(sequelize.models);
//{ data: data, table1: table1, table2: table2, user: user }

//now you can make the standard CRUD queries
console.log(sequelize.models.user.create;
// detail: https://sequelize.org/master/manual/model-querying-basics.html
```


