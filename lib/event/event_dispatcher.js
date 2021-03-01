
var instance, Dispatcher = function () {
};

Dispatcher.prototype = {

    dispatch: function (event, bubbling) {

        var self = this, target = event.getCurrentTarget(), config = target.getEventConfig(event.getName());

        self.callSubscribers(event, target, target.getBeforeSubscribers(event.getName()));

        self.callSubscribers(event, target, target.getOnSubscribers(event.getName()));

        if (!bubbling && config) {
            if (config.defaultFn && !event.isDefaultPrevented()) {

                config.defaultFn.call(config.context || target, event);
            }
        }

        self.callSubscribers(event, target, target.getAfterSubscribers(event.getName()));

        self.bubble(event, target);


    },

    callSubscribers: function (event, target, subs) {

        if (subs && subs.length > 0) {

            var i, sub, sholdRemove;

            for (i = 0; i < subs.length; i += 1) {
                sub = subs[i];
                event.setCurrentTarget(sub.getTarget());
                sub.call(event);
                if (sub.isOnce()) {
                    if (!sholdRemove) {
                        sholdRemove = [];
                    }
                    sholdRemove.push(sub);
                }

            }

            if (sholdRemove && sholdRemove.length > 0) {

                var j;
                for (i = 0; i < sholdRemove.length; i++) {

                    if (subs.indexOf && typeof subs.indexOf === 'function') {
                        subs.splice(subs.indexOf(sholdRemove[i], 1));

                    } else {
                        for (j = 0; j < subs.length; j++) {

                            if (subs[j] === sholdRemove[i]) {
                                subs.splice(j, 1);

                                break;
                            }
                        }

                    }

                }
            }

        }

    },

    bubble: function (event, target) {

        if (event.isPropagating()) {
            var self = this, targets = target.getTargets();
            if (targets && targets.length > 0) {
                var i, bubbleTarget;
                for (i = 0; i < targets.length; i++) {
                    bubbleTarget = targets[i];
                    event.setCurrentTarget(bubbleTarget);
                    self.dispatch(event, true);

                }
            }
        }

    }
};

Dispatcher.getInstance = function () {
    if (!instance) {
        instance = new Dispatcher();
    }
    return instance;
};

export default Dispatcher;
