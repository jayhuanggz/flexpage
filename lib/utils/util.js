import Decorator from '../decorator/decorator'
import DataType from '../data_type/data_type'


const units = ['b', 'k', 'm', 'g']
const sizePattern = /^\+?[1-9][0-9]*((g)|(m)|(k)|(b))$/;
/**
 * 把文件尺寸表达式解析成字节， 比如1kb->1024, 1mb->1024*1024, 1gb -> 1024^3
 */
function parseSize(expression) {
    let size = parseInt(expression, 10);
    if (!isNaN(size) && String(size) === expression) {
        console.log('纯数字，默认单位为字节');
        //纯数字，默认单位为字节
        return size;
    }

    expression = expression.toLowerCase();


    if (expression && expression.length > 0 && sizePattern.test(expression)) {

        let result = parseInt(expression.substr(0, expression.length - 1), 10);

        if (isNaN(result)) {
            throw new Error('invalid expression for size: ' + expression);
        }

        let unit = expression.charAt(expression.length - 1);
        let index = units.indexOf(unit);
        if (index === -1) {
            throw new Error('invalid expression for size: ' + expression);
        }

        while (index > 0) {
            result *= 1024;
            index--;
        }
        return result;

    } else {
        throw new Error('invalid expression for size: ' + expression);
    }


}



const Util = {

    deepCopy(obj, cache) {
        if (cache === void 0) cache = []

        // just return if obj is immutable value
        if (obj === null || typeof obj !== 'object') {
            return obj
        }

        // if obj is hit, it is in circular structure
        var hit = cache.filter((c) => c.original === obj)[0];
        if (hit) {
            return hit.copy
        }

        var copy = Array.isArray(obj) ? [] : {}
        // put the copy into cache at first
        // because we want to refer it in recursive deepCopy
        cache.push({
            original: obj,
            copy: copy
        })

        Object.keys(obj).forEach(function (key) {
            copy[key] = Util.deepCopy(obj[key], cache)
        })

        return copy
    },

    format(value, dataType, dataTypeConfig, decorators) {
        let result = DataType.format(
            dataType,
            value,
            dataTypeConfig
        );
        if (result) {
            if (decorators && decorators.length > 0) {
                decorators.forEach(decorator => {
                    result = Decorator.decorate(
                        decorator.type,
                        result,
                        decorator.config,
                        value
                    );
                });
            }
        }

        return result;
    },

    parseSize,
    isPromise(obj) {
        return !!obj
            && (typeof obj === 'object' || typeof obj === 'function')
            && typeof obj.then === 'function';
    },

    isDiff(left, right) {

        if (left !== right) {
            return true;
        }

        if (Array.isArray(left) && Array.isArray(right)) {
            if (left.length !== right.length) {
                return true;
            }
            for (var i = 0; i < left.length; i++) {
                if (Util.isDiff(left[i], right[i])) {
                    return true;
                }
            }
            return false;
        } else if (typeof left === 'object' && typeof right === 'object') {
            let keys = {}, key
            for (key in left) {
                if (Object.prototype.hasOwnProperty.call(left, key)) {
                    if (Util.isDiff(left[key], right[key])) {
                        return true;
                    }
                    keys[key] = true;
                }
            }
            for (key in right) {
                if (Object.prototype.hasOwnProperty.call(right, key)) {
                    if (!Object.prototype.hasOwnProperty.call(keys, key)) {
                        // key exists in right but not in left
                        return true;
                    }
                }
            }
            return false

        } else {
            return false;
        }
    }

}


export default Util