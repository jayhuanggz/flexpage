import Action from './action'
import axios from 'axios'

const bodyParsers = [{
    test(headers) {
        return headers && typeof headers['Content-Type'] === 'string' &&
            headers['Content-Type'].toLowerCase() === 'application/json'
    },
    parse(body) {
        return JSON.stringify(body)
    }
}, {
    test(headers) { return true; },
    parse(body) { return body }
}];

class HttpAction extends Action {
    constructor() {
        super('http', 'Ajax', true);
    }

    doTrigger(pageContext, widget, config, raw, data) {
        let http = config.http;

        let urlParams = this.parseUrlParams(pageContext, config.urlParams, data);

        if (typeof urlParams === 'object') {
            let httpParams = http.params;
            if (typeof httpParams === 'undefined') {
                httpParams = {};
                http.params = httpParams
            }
            Object.assign(httpParams, urlParams);

        }


        let body = config.body;
        if (typeof body === 'string') {
            body = this.parseBody(pageContext, body, data);
            if (typeof body === 'string') {
                http.data = body;
            } else if (typeof body === 'object') {
                for (var i = 0; i < bodyParsers.length; i++) {
                    if (bodyParsers[i].test(http.headers)) {
                        body = bodyParsers[i].parse(body);
                        break;
                    }
                }
                if (typeof body !== 'undefined') {
                    http.data = body;
                }
            }
        }

        return axios.create()(http);
    }


    parseBody(pageContext, expression, data) {
        return this.evaluateExpression(pageContext, expression, data);
    }

    evaluateExpression(pageContext, expression, data) {
        if (typeof expression !== 'string') {
            return;
        }
        let parsed = (function (expression) {
            return function ($context, $scope) {
                return eval(expression);
            }
        })(expression);
        return parsed(pageContext, data);
    }


    parseUrlParams(pageContext, urlParams, data) {

        if (typeof urlParams === 'undefined') {
            return;
        }

        if (typeof urlParams === 'string') {
            if (urlParams.indexOf('$scope') !== -1 || urlParams.indexOf('$context') !== -1) {
                return this.evaluateExpression(pageContext, urlParams, data);
            }

        } else {
            let result = {};
            for (var key in urlParams) {
                if (Object.prototype.hasOwnProperty.call(urlParams, key)) {
                    let value = urlParams[key];
                    if (typeof value === 'string') {
                        if (value.indexOf('$scope') !== -1 || value.indexOf('$context') !== -1) {
                            value = this.evaluateExpression(pageContext, value, data);
                            if (typeof value !== 'undefined') {
                                result[key] = value
                            }
                        } else {
                            result[key] = value
                        }
                    }
                }
                return result;
            }

        }
    }

}

export default HttpAction;