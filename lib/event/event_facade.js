
var EventFacade = function (name, target, data) {
    var self = this;
    self.name = name;

    self.propagate = true;
    self.defaultPrevented = false;
    self.target = target;
    self.currentTarget = target;
    self.data = data;
    self.halted = false;

};

EventFacade.prototype = {

    getName: function () {
        return this.name;
    },
    stopPropagation: function () {
        this.propagate = false;
    },

    isPropagating: function () {
        return this.propagate;
    },

    preventDefault: function () {
        this.defaultPrevented = true;
    },

    isDefaultPrevented: function () {
        return this.defaultPrevented;
    },

    getTarget: function () {
        return this.target;
    },

    getCurrentTarget: function () {
        return this.currentTarget;
    },
    setCurrentTarget: function (currentTarget) {
        this.currentTarget = currentTarget;
    },

    halt: function () {
        var self = this;
        self.stopPropagation();
        self.preventDefault();
        self.halted = true;
    },
    getData: function () {
        return this.data;
    },
    isHalted: function () {
        return this.halted;
    }
};

export default EventFacade;
