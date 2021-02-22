# scheduler
Execute asynchronous functions in order and limit the number of simultaneous executions。
按顺序执行异步函数，并限制同时执行的数量。

# examples文档

### class: Scheduler( limit )
生成一个scheduler
+ `limit`: **number; default:4**  Scheduler最大同时执行的数量;
+ `Returns`: scheduler

```js
let scheduler = new Scheduler(2);
```

### function: scheduler.add(handler, :args, :callback)
添加scheduler要执行的函数
+ `handler`: **function|async function** 要执行的异步或同步函数
+ `args`: 要执行函数的参数
+ `callback`: 回调函数
+ `Returns`:要执行的函数返回的结果

```js
async function timeoutAdd(time, ...args) {
  return new Promise(resolve => {
    setTimeout(() => {
      let result = (args && args.length) && args.reduce((pre, cur) => {
        return pre + cur;
      });
      console.log(`time:${time},  args:${args}, result:${result}`)
      resolve(result)
    }, time)
  });
}
function callback(err, res) {
  console.log(`callback:${res}`);
}


scheduler.add(timeoutAdd, [500, 3, 2]);
scheduler.add(() => timeoutAdd(1500, 2, 2));
scheduler.add(() => timeoutAdd(1500, 2, 2), null, callback);
scheduler.add(() => timeoutAdd(1500, 2, 2), null, (err, res) => {
  console.log(`callback:${res}`)
});
```

### function: scheduler.adds(handlers, :callback)
添加scheduler要执行的函数
+ `handlers`: **array function** 要执行的异步或同步函数数组
+ `callback`: 回调函数
+ `Returns`:要执行的函数返回的结果

```javascript
scheduler.adds([() => timeoutAdd(1000, 1, 3), () => timeoutAdd(500, 1, 2, 3, 4), () => timeoutAdd(400, 1, 4), () => timeoutAdd(600)];
scheduler.adds([{
  handler: timeoutAdd,
  args: [3000, 1, 3],
}]);
scheduler.adds([{
    handler: () => timeoutAdd(3000, 1, 3),
  }, {
    handler: () => timeoutAdd(1000),
  },
  {
    handler: timeoutAdd,
    args: [2000]
  }, {
    handler: timeoutAdd,
    args: [100, 1, 5],
    callback: callback,
  }, {
    handler: (val) => Promise.resolve(val),
    args: ['哈哈哈'],
    callback: (err, res) => {
      console.log(`callback:${res}`)
    },
  }
]);
```

### 获取函数返回的结果
```javascript
console.log('获取函数结果', await scheduler.add(timeoutAdd, [1, 9, 7]));
console.log('获取函数结果',await scheduler.adds([{
  handler: () => timeoutAdd(0, 1, 3),
}, {
  handler: () => timeoutAdd(0,3,4),
}]))
```


