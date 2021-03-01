import Transformer from './transformer'

const Unwrap = {
    id: 'unwrap',
    transform(pageContext, config, data) {

        if (typeof data === 'object') {

            if (Array.isArray(data)) {
                let result = [];
                data.forEach(item => {
                    let value = Unwrap.unwrap(item, config);
                    if (typeof value !== 'undefined') {
                        result.push(value)
                    }
                });
                return result;
            } else {
                return Unwrap.unwrap(data, config);

            }

        } else {
            return data;
        }

    },

    unwrap(data, config) {
        let prop = typeof config === 'undefined' ? undefined : config.prop;


        // if the property to unwrap is specified, use it, otherwise use the first property
        // or throw error if there is more than 1 property
        if (typeof prop === 'string') {
            if (Object.prototype.hasOwnProperty.call(data, prop)) {
                return data[prop];
            } else {
                console.warn('data to unwrap does not has key: ' + prop);
                return data;
            }
        } else {
            let matched = false, result;
            for (var key in data) {
                if (Object.prototype.hasOwnProperty.call(data, key)) {
                    if (matched) {
                        throw new Error('There are more than one property in the data to unwrap, check the data or ' +
                            'specify a "prop" configuration!');
                    } else {
                        matched = true;
                        result = data[key];
                    }
                }
            }

            return result;

        }

    }
}

export default Unwrap;