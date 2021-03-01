const actions = {};

import Transformer from './../../transformer/transformer'
import Util from './../../utils/util'
class Action {
    constructor(id, name, register) {
        this.id = id;
        this.name = name;
        if (register === true) {
            actions[id] = this;
        }
    }

    trigger(pageContext, widget, params, data, callback) {


        params = Util.deepCopy(params);

        let transformers = params.transformers;
        let result;
        if (transformers && transformers.length > 0) {
            let transformed = Util.deepCopy(data);
            transformed = Transformer.runPipeline(transformers, pageContext, transformed);
            result = this.doTrigger(pageContext, widget, params, data, transformed);

        } else {
            result = this.doTrigger(pageContext, widget, params, data, data);
        }

        return this.triggerPostAction(result, pageContext, widget, params, data, callback);
    }

    doTrigger(pageContext, widget, params, rawData, transformedData) { }

    triggerPostAction(result, pageContext, widget, params, data, callback) {

        let postAction = params.postAction;
        if (typeof postAction === 'undefined') {
            return this.hookCallback(result, callback);
        }


        Action.triggerAction(postAction, pageContext, widget, data);

        return this.hookCallback(result, callback);


    }

    hookCallback(result, callback) {
        if (typeof callback === 'function') {
            if (Util.isPromise(result)) {
                return result.then(callback);
            } else {
                callback();
                return result;
            }
        } else {
            return result;
        }
    }

    static getAction(id) {
        return actions[id];
    }

    static triggerAction(actionConfig, pageContext, widget, data, callback) {
        let action = actions[actionConfig.id];

        if (action) {
            return action.trigger(pageContext, widget, actionConfig.params, data, callback);
        } else if (typeof actionConfig.trigger === "function") {
            let result = actionConfig.trigger(pageContext, widget, actionConfig.params, data);
            if (typeof callback === 'function') {
                if (Util.isPromise(result)) {
                    return result.then(callback);
                } else {
                    callback();
                    return result;
                }
            } else {
                return result;
            }
        } else {
            console.warn('Action ' + actionConfig.id + " is not registered");
        }
    }
}

export default Action;