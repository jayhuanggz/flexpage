import Transformer from './transformer'

const Rename = {
    id: 'remame',

    transform(pageContext, config, data) {

        if (typeof data === 'object') {

            if (Array.isArray(data)) {
                let result = [];
                data.forEach(item => {
                    let value = Rename.rename(item, config);
                    if (typeof value !== 'undefined') {
                        result.push(value)
                    }
                });
                return result;
            } else {
                return Rename.rename(data, config);

            }

        } else {
            return data;
        }

    },

    rename(data, config) {
        let from = config.from, to = config.to;

        if (Object.prototype.hasOwnProperty.call(data, from)) {

            if (to && to.length > 0) {
                data[to] = data[from];
                return data;
            } else {
                console.warn('missing to config for renmaing key: ' + from);
            }

        } else {
            console.warn('data to rename does not has key: ' + from);
            return data;
        }

    }

}

export default Rename;