import Util from './../../utils/util'


class Source {
    constructor(widget) {
        this.widget = widget;
    }

    getWatchableProps() {
        let state = source.getState();
        if (state) {
            properties = [];
            for (var key in state) {
                if (Object.prototype.hasOwnProperty.call(state, key)) {
                    properties.push(key);
                }
            }
            return properties;
        }
    }

    watch(prop, fn) {
        return this.widget.watch(prop, fn);
    }


}

class PageSource extends Source {
    constructor(context) {
        super(context);
    }

    getWatchableProps() {
        let state = source.getState();
        if (state) {
            properties = [];
            for (var key in state) {
                if (Object.prototype.hasOwnProperty.call(state, key)) {
                    properties.push(key);
                }
            }
            return properties;
        }
    }

    watch(prop, fn) {
        return this.widget.context.watch(prop, fn);

    }
}


export {
    Source,
    PageSource
}