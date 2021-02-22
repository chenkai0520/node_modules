class Scheduler {
  /**
   * 生成一个异步调度器
   * @param {number} limit default:4
   */
  constructor(limit = 4) {
    this.limit = limit;
    this.awaitArr = [];
    this.count = 0;
  }

  /**
   * 添加函数到待执行列表
   * @param {function} handler 可以是异步|同步函数
   * @param  {array} args 函数的参数(可选)
   * @param {function} callback 回调函数(可选)
   * @returns 函数执行结果
   */
  async add(handler, args, callback) {

    if (typeof handler !== 'function') {
      throw "handler is not a function";
    }
    if (callback && typeof callback !== 'function') {
      throw "callback is not a function";
    }

    if (this.count >= this.limit) {
      await new Promise(resolve => {
        this.awaitArr.push(resolve);
      });
    }

    this.count++;
    let res;
    try {
      res = await handler.apply(null, args);
      callback && callback(null, res);
    } catch (error) {
      callback && callback(error);
    }
    this.count--;

    if (this.awaitArr.length) {
      this.awaitArr.shift()();
    }

    return res;
  }

  /**
   * 添加函数到待执行列表
   * @param {array} handlers 
   * @param {function} callback 
   * @returns handlers包含的函数执行结果
   */
  async adds(handlers, callback) {
    if (!Array.isArray(handlers)) {
      throw "handlers is not a Array";
    }
    if (callback && typeof callback !== 'function') {
      throw "callback is not a function";
    }

    let handlersArr = handlers.map((val) => {
      if (typeof val !== 'function') {
        return this.add(val.handler, val.args, val.callback);
      }
      return this.add(val);
    });

    let res;
    try {
      res = await Promise.all(handlersArr);
      callback && callback(null, res);
    } catch (error) {
      callback && callback(error)
    }
    return res;
  }
}

module.exports = Scheduler;