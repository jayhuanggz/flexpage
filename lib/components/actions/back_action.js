import Action from './action'

class BackAction extends Action {
    constructor() {
        super('back', '后退', true);
    }

    doTrigger(pageContext, widget, config, raw, data) {

        window.history.go(-1);
    }

}

export default BackAction;