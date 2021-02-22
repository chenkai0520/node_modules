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

function fieldsString(params = {}) {
  const fields = Object.keys(params);
  return fields.filter((field) => params[field] !== undefined).map((field) => `${field}={${field}}`).join(',');
}

module.exports = {
  sqlTemplate,
  rowsUnderline2hump,
  fieldsString,
};
