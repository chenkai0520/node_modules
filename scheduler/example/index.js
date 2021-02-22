var Scheduler = require('../index');


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


let scheduler = new Scheduler(4);
(async () => {
  scheduler.add((...arg) => timeoutAdd(...arg), [2000, 1, 2], (err, res) => {
    console.log(`callback:${res}`)
  });
  scheduler.add(() => timeoutAdd(1500, 2, 2), null, callback);
  scheduler.add(() => timeoutAdd(500, 3, 2));


  scheduler.adds([() => timeoutAdd(1000, 1, 3), () => timeoutAdd(500, 1, 2, 3, 4), () => timeoutAdd(400, 1, 4), () => timeoutAdd(600)]);
  scheduler.adds([{
    handler: () => timeoutAdd(3000, 1, 3)
  }]);
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


  // 获取函数结果
  console.log('获取函数结果', await scheduler.add(timeoutAdd, [1, 9, 7]));
  console.log('获取函数结果',await scheduler.adds([{
    handler: () => timeoutAdd(0, 1, 3),
  }, {
    handler: () => timeoutAdd(0,3,4),
  }]))
})()