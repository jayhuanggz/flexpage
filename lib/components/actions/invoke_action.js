import Action from './action'

class InvokeAction extends Action {
    constructor() {
        super('invoke', '触发事件', true);
    }

    doTrigger(pageContext, widget, config, raw, data) {

        let target = config.target;

        let targetWidget;

        if (typeof target === 'string' && target.length > 0) {
            targetWidget = pageContext.widgetManager.findWidget(target);
            if (typeof targetWidget === 'undefined') {
                console.warn('Widget ' + target + " is not registered!");
                return;

            }

        } else {
            targetWidget = widget;
        }


        let method = config.method;
        if (Object.prototype.hasOwnProperty.call(targetWidget, method) && typeof targetWidget[method] === 'function') {
            targetWidget[method](config.params, data);
        } else {
            console.warn("widget " + target + " does not have method " + method + " or it is not a function!");
        }

    }

}

export default InvokeAction;