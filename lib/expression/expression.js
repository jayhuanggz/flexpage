const compile = function (exp) {
    return (function (e) {
        return function (context) {
            let compiled = '';
            if (typeof context !== 'undefined') {
                for (let key in context) {
                    compiled += 'let ';
                    compiled += key;
                    compiled += ' = context.';
                    compiled += key;
                    compiled += ';';
                }
            }
            compiled += e;
            return eval(compiled);

        }
    })(exp)
}


const evaluate = function (obj, context, deep) {
    var result = obj;
    if (typeof obj === 'object') {
        if (Array.isArray(obj)) {
            if (deep) {
                result = [];
                obj.forEach(item => {
                    result.push(evaluate(item, context, deep));
                })
                return result;
            } else {
                return obj;
            }
        } else {
            if (deep) {
                result = {};
                for (var key in obj) {
                    if (Object.prototype.hasOwnProperty.call(obj, key)) {
                        let value = evaluate(obj[key], context, deep);
                        result[key] =value ;
                    }
                }
                return result;
            } else {
                return obj;
            }

        }
    } else if (typeof obj === 'string') {
        if (obj.startsWith('=')) {
            return compile(obj.substr(1))(context);
        }
    }

    return obj;

}
export { compile, evaluate };