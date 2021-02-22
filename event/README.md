# event
绑定事件，同步|异步触发事件

# example
```javascript
let Event = require('event');
let myEvent = new Event();

myEvent.on('say', async () => {
    await timeout(100)
});
myEvent.on('say', ()=>{
    console.log('hello')
});

// 异步触发
myEvent.emit('say');

// 按照监听器注册的顺序触发
myEvent.emitSync('say');
```


