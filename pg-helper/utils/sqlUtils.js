/**
 * sqlStr: `select * from ${USERS}  where username = {username}`
 * obj: {username: 'xiaohong'}
 * 转换为
 * text: `select * from ${USERS}  where username = $1`
 * value: ['xiaohong']
 * @param {string} sqlStr sql
 * @param {*} obj value
 */
function sqlTemplate(sqlTemp, obj) {
  const sqlArr = sqlTemp.split(/[{}]/);
  let sql = '';
  const sqlArrLen = sqlArr.length;
  const values = [];
  for (let index = 0; index < sqlArrLen; index += 1) {
    const item = sqlArr[index];
    if (!item) continue;
    if (index % 2 !== 0) {
      sql += `$${(index + 1) / 2}`;
      values.push(obj[item]);
    } else {
      sql += item;
    }
  }
  return {
    sql,
    values,
  };
}

function underline2hump(str) {
  return str.replace(/_([a-z])/g, (match, p1) => p1.toUpperCase());
}

function hump2underline(str) {
  return str.replace(/([A-Z])/g, (match, p1) => `_${p1.toLowerCase()}`);
}

function objHump2underline(obj) {
  const formatObj = {};
  Object.keys(obj).forEach((key)=>{
    formatObj[hump2underline(key)] = obj[key];
  })
  return formatObj;
}


function rowsUnderline2hump(rows) {
  if (!Array.isArray(rows) || rows.length === 0) return [];
  return rows.map((obj) => {
    const res = {};
    for (const key in obj) {
      if (Object.prototype.hasOwnProperty.call(obj, key)) {
        res[underline2hump(key)] = obj[key];
      }
    }
    return res;
  });
}

function orderSql(orders = []) {
  return orders.map((order) => {
    if(Array.isArray(order)) {
      const [field, type] = order;
      return `${field} ${type}`;
    }
    return `${order}`;
  }).join(',');
}

function getWhereSql(where) {
  if(!where) return '';

  const fields = Object.keys(where).filter((field) => {
    return ['and', 'or'].indexOf(field) === -1;
  });
  
  let sql = ` ( `;
  if(fields.length > 0) {
    const firstField = fields[0];
    sql += `${firstField} ${where[firstField]}`;

    fields.shift();
    fields.forEach((field)=>{
      sql += ` and ${field} ${where[field]} `;
    });
  }
  
  if('and' in where) {
    sql += ` and ${getWhereSql(where.and)} `;
  }
  if('or' in where) {
    sql += ` or ${getWhereSql(where.or)} `;
  }

  sql += ' ) ';
  
  return sql;
}

function whereSql(where) {
  let whereSql = getWhereSql(where);
  if(whereSql){
    whereSql = `where ${whereSql}`;
  }
  return whereSql;
}

function limitOffsetSql(params) {
  const { limit, offset } = params;
  return `${Number.isInteger(limit) ? ` limit ${limit} `:''} ${Number.isInteger(offset) ? ` offset ${offset} `:''}`;
}

function includeSql(params) {
  if(!params || !Array.isArray(params)) {
    return '*';
  }

  return params.map((param) => {
    if(Array.isArray(param)) {
      const [field, aliax, type] = param;
      return ` ${field} ${aliax ? `as ${aliax}`:''} ${type ? ` :: ${type}`:''}`;
    }
    return `${param}`;
  }).join(',');
}

function updateSql(params = {}) {
  if(Array.isArray(params)) {
    return params.map((field) => `${field}={${field}}`).join(',');
  } else {
    const fields = Object.keys(params);
    return fields.filter((field) => params[field] !== undefined).map((field) => `${field} = ${params[field]}`).join(',');
  }
}

function fieldsSql(params) {
  return params.join(',');
}

function insertSql(params, options) {
  let fieldsSql = ' ( ';
  let valuesSql = ' VALUES ';
  const data = [];
  if (!Array.isArray(params)) {
    params = [params];
  }

  const fields = Object.keys(params[0]);

  if(options.autoHump) {
    fieldsSql += fields.map((field) => objHump2underline(field)).join(',');
  } else {
    fieldsSql += fields.join(',');
  }
  fieldsSql +=')';

  const fieldCount = fields.length;
  valuesSql += params.map((param, index)=>{
    let valueSql = '(';
    const fields = Object.keys(param);
    valueSql += fields.map((value, valueIndex )=>{
      data.push(param[value]);
      return `$${index * fieldCount + valueIndex + 1}`
    }).join(',');
    valueSql += ')';
    return valueSql;
  }).join(',');
  return {
    sql: fieldsSql + valuesSql,
    data,
  };
}

function returningSql(returning) {
  if(!Array.isArray(returning)) {
    return returning ? ' returning * ' : '';
  }
  
  return ` returning ${returning.join(',')} `;
}

module.exports = {
  sqlTemplate,
  rowsUnderline2hump,
  objHump2underline,
  orderSql,
  whereSql,
  limitOffsetSql,
  includeSql,
  updateSql,
  insertSql,
  fieldsSql,
  returningSql,
};
