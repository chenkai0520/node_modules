class Event {
    /**
     * 绑定事件，同步|异步触发事件
     */
    constructor() {
        this.eventList = {};
    }

    _getEventList() {
        return this.eventList;
    }

    /**
     * 添加 listener 函数到名为 eventName 的事件的监听器数组的末尾。 不会检查 listener 是否已被添加。 多次调用并传入相同的 eventName 与 listener 会导致 listener 会被添加多次
     * @param {string} eventName 
     * @param {function|function[]} handler 
     */
    on(eventName, handler) {
        if (eventName in this.eventList) {
            if (!Array.isArray(handler)) {
                this.eventList[eventName].push(handler);
            } else {
                this.eventList[eventName].push(...handler);
            }
        } else {
            this.eventList[eventName] = [handler];
        }
    }

    /**
     * 按照监听器注册的顺序，异步步地调用每个注册到名为 eventName 的事件的监听器，并传入提供的参数。
     * @param {string} eventName 
     * @param {*} args 
     */
    emit(eventName, args) {
        if (!eventName in this.eventList) return;

        for (let handler of this.eventList[eventName]) {
            handler(args);
        };
    }

    /**
     * 按照监听器注册的顺序，同步地调用每个注册到名为 eventName 的事件的监听器，并传入提供的参数。
     * @param {string} eventName 
     * @param {*} args 
     */
    async emitSync(eventName, args) {
        if (!this.eventList.hasOwnProperty(eventName)) return;

        for (let handler of this.eventList[eventName]) {
            await handler(args);
        };
    }

    /**
     * 清空监听器eventName 的事件的监听器
     * @param {string} eventName 
     */
    clear(eventName) {
        this.eventList[eventName] = null;
        delete this.eventList[eventName];
    }
}

module.exports = Event;
