import Action from './action'

class UrlAction extends Action {
    constructor() {
        super('url', '打开链接', true);
    }

    doTrigger(pageContext, widget, config, raw, data) {

        let url = config.url;

        if (data && typeof data === 'object') {

            if (url.indexOf('?') === -1) {
                url += '?';
            }

            let first = true;
            for (var key in data) {
                if (Object.prototype.hasOwnProperty.call(data, key)) {
                    if (first) {
                        first = false;
                    } else {
                        url += '&';
                    }
                    url += key;
                    url += '=';
                    url += encodeURIComponent(data[key]);
                }
            }

        }

        if (config.blank) {
            window.open(url);
        } else {
            location.href = url;
        }
    }

}

export default UrlAction;