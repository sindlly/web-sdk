function Event() {
    this._events = {};
}

Event.prototype.on = function(type, fn) {
    if (!this._events[type]) {
        this._events[type] = []
    }
    this._events[type].push(fn);
}

Event.prototype.off = function(type, fn) {
    if (!this._events[type]) {
        return;
    }
    if (!fn) {
        this._events[type] = undefined;
        return;
    }
    var index = this._events[type].indexOf(fn);
    this._events[type].splice(index, 1);
}

Event.prototype.emit = function(type) {
    if (!this._events[type]) {
        return;
    }
    this._events[type].forEach(fn => fn());
}

Event.prototype.once = function(type, fn) {
    var _ = this;
    var _fn = () => {
        fn.apply(_, arguments);
        this.off(type);
    };

    this.on(type, _fn);
}
export { Event }
