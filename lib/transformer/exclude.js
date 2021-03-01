import Transformer from './transformer'


const Exclude = {

    id: 'exclude',
    transform(pageContext, config, data) {

        if (typeof data === 'object') {
            if (Array.isArray(data)) {
                let result = [];
                data.forEach(item => {
                    let value = Exclude.exclude(item, config);
                    if (typeof value !== 'undefined') {
                        result.push(value)
                    }
                });
                return result;
            } else {
                return Exclude.exclude(data, config);
            }
        } else {
            return data;
        }

    },

    exclude(data, config) {
        let props = config.props;

        let result = {};

        for (var key in data) {

            if (Object.prototype.hasOwnProperty.call(data, key)) {
                if ((typeof props === 'string' && props === key) ||
                    (Array.isArray(props) && props.indexOf(key) !== -1)) {
                    continue
                }
                result[key] = data[key];

            }
        }

        return result;


    }

};

export default Exclude;