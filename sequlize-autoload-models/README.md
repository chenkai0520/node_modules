# sequlize-autoload-models
sequlize-autoload-models

# example
```javascript
const { Sequelize } = require('sequelize');
const autoloadModels = require('@c_kai/sequlize-autoload-models');


let sequelize = new Sequelize('postgres://postgres:postgres@localhost:5432/dbname');
sequelize = autoloadModels( sequelize, './models');

console.log(sequelize.models);
```


