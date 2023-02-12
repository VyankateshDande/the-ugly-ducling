class eventhandler {
    eventName;
    eventHandler;
    once = false;

    /**
     * @constructor
     * @param {String} name Name of event
     * @param {Function} func Function that handles the event
     * @param {Boolean} once once/on
     */
    constructor (name, func, once) {
        this.eventName = name;
        this.eventHandler = func;
        this.once = once;
    }
}

module.exports = eventhandler