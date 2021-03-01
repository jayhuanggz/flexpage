
import EventSubscriber from './sub'
import EventFacade from './event_facade'
import EventDispatcher from './event_dispatcher'

class EventTarget {
    constructor() {
        var self = this;
        self.targets = [];
        self.onSubscribers = {};
        self.beforeSubscribers = {};
        self.afterSubscribers = {};
        self.eventConfigs = {};
    }

    on(eventName, fn, context, priority, once) {

        eventName = this._getEventType(eventName);

        var self = this, subs = self.onSubscribers[eventName];

        if (!subs) {
            subs = [];
            self.onSubscribers[eventName] = subs;
        }

        var sub = new EventSubscriber(eventName, context, fn, self, priority, once);

        subs.push(sub);

        self.sortSubscriptions(subs);

        return sub;
    }

    _getEventType(type) {

        var _type = this.constructor._type;

        if (_type && type.indexOf(':') === -1) {
            return _type + ':' + type;

        }
        return type;

    }

    once(eventName, fn, context, priority, once) {
        return this.on(eventName, fn, context, priority, true);
    }

    sortSubscriptions(subs) {
        subs.sort(function (a, b) {

            if (a.getPriority() > b.getPriority()) {
                return -1
            }

            if (a.getPriority() < b.getPriority()) {
                return 1;
            }

            return 0;

        });
    }

    before(eventName, fn, context, priority) {
        eventName = this._getEventType(eventName);

        var self = this, subs = self.beforeSubscribers[eventName];

        if (!subs) {
            subs = [];
            self.beforeSubscribers[eventName] = subs;
        }

        var sub = new EventSubscriber(eventName, context, fn, self, priority);
        subs.push(sub);
        self.sortSubscriptions(subs);

        return sub;
    }

    after(eventName, fn, context, priority) {
        eventName = this._getEventType(eventName);
        var self = this, subs = self.afterSubscribers[eventName];

        if (!subs) {
            subs = [];
            self.afterSubscribers[eventName] = subs;
        }
        var sub = new EventSubscriber(eventName, context, fn, self, priority);
        subs.push(sub);
        self.sortSubscriptions(subs);
        return sub;
    }

    publish(name, config) {

        var self = this;

        self.eventConfigs[self._getEventType(name)] = config;

    }

    fire(name, data) {

        name = this._getEventType(name);

        var self = this, event = new EventFacade(name, self, data);
        EventDispatcher.getInstance().dispatch(event);
        return event;

    }

    getEventConfig(name) {
        return this.eventConfigs[name];
    }

    getOnSubscribers(name) {
        return this.onSubscribers[name];
    }

    getBeforeSubscribers(name) {
        return this.beforeSubscribers[name];
    }
    getAfterSubscribers(name) {
        return this.afterSubscribers[name];
    }

    removeTargets() {

        this.targets = [];
    }

    removeTarget(target) {
        var self = this, index = self.getTargetIndex(target);

        if (index !== -1) {
            self.targets.splice(index, 1);
        }
    }

    getTargetIndex(target) {

        var i, self = this;
        if (typeof self.targets.indexOf === 'function') {
            return self.targets.indexOf(target);
        } else {
            for (i = 0; i < self.targets.length; i += 1) {
                if (self.targets[i] === target) {
                    return i;

                }
            }
        }
        return -1;
    }

    getTargets() {
        return this.targets;
    }

    addTarget(target) {

        if (!(target instanceof EventTarget)) {
            throw new Error('Not an instance of EventTarget!');
        }
        var self = this, index = self.getTargetIndex(target);

        if (index === -1) {
            self.targets.push(target);
        }

    }
    off(type, fn) {

        var self = this;

        self._detachSubscribers(self.beforeSubscribers, type, fn);
        self._detachSubscribers(self.onSubscribers, type, fn);
        self._detachSubscribers(self.afterSubscribers, type, fn);
    }

    _detachSubscribers(subs, type, fn) {

        if (type == null || type == undefined) {
            var key;
            for (key in subs) {
                if (key && Object.prototype.hasOwnProperty.call(subs, key)) {
                    this._detachSubscribers(subs, key);
                }
            }

        } else {
            type = this._getEventType(type);
            var targets = subs[type];

            if (targets) {
                var i, removed = 0;
                for (i = 0; i < targets.length; i++) {

                    if (!fn || targets[i].fn === fn) {
                        targets[i].destroy();
                        removed++;
                    }

                }

                if (removed >= targets.length) {
                    delete subs[type];

                } else {

                    var loop = true;
                    while (loop) {
                        for (i = 0; i < targets.length; i++) {

                            if (!targets[i].active) {
                                targets.splice(i, 1);
                                loop = targets.length > 0;
                                break;
                            }

                            loop = false;

                        }
                    }

                }

            }

        }

    }
}


export default EventTarget;
