const requireDirectory = require('require-directory');

function forEachObject(obj, fn, path) {
  for (const key in obj) {
      const deepPath = path ? `${path}.${key}` : key;
      fn.call(obj, obj[key], key, obj, deepPath);
      forEach(obj[key], fn, deepPath);
  }
}

function forEach(value, fn, path) {
  path = path || '';
  forEachObject(value, fn, path);
}

function autoloadModels(sequelize, modelPath) {
  if(sequelize.constructor.name !== 'Sequelize') {
    throw new Error('not instanceof Sequelize');
  }
  const models = requireDirectory(module, modelPath);
  forEach(models, (value, key, subject, path) => {
    if(typeof value === 'function') {
      value(sequelize);
    }
  });
  return sequelize;
}

module.exports = autoloadModels;