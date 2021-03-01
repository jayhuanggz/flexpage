const types = {};

export default {
    add(type) {
        if (typeof types[type.id] !== 'undefined') {
            throw new Error('DataType ' + type.id + ' already exists!');
        }
        types[type.id] = type;

    },
    format(id, value, config) {
        let type = types[id];
        if (!type) {
            return value;
        }

        return type.format(value, config);
    }
};