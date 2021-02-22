
let Event = require('../event');
let myEvent = new Event();

const timeout = (time) => new Promise(resolve => {
    setTimeout(() => {
        console.log(time)
        resolve();
    }, time)
})

myEvent.on('say', async () => {
    await timeout(300)
});
myEvent.on('say', async () => {
    await timeout(100)
});
myEvent.on('say', async () => {
    await timeout(400)
});
myEvent.on('say', async () => {
    await timeout(0)
});
myEvent.on('say', async () => {
    await timeout(400)
});

myEvent.emitSync('say');