    var Sub = function(eventConfig, context, fn, target, priority, once) {
        var self = this;
        self.eventConfig = eventConfig;
        self.context = context;
        self.fn = fn;
        self.target = target;
        self.priority = priority || 0;
        self.once = once === true;
        self.active = true;
    };

    Sub.prototype = {
        getTarget : function() {
            return this.target;
        },
        call : function(eventFacade) {
            var self = this;

            if (!eventFacade.isHalted()) {
                self.fn.call(self.context || eventFacade.getTarget(), eventFacade);

            }

        },

        isOnce : function() {
            return this.once;
        },

        getPriority : function() {
            return this.priority;
        },

        destroy : function() {
            var self = this;
            self.context = undefined;
            self.fn = undefined;
            self.eventConfig = undefined;
            self.target = undefined;
            self.active = false;

        }
    };

export default Sub;

