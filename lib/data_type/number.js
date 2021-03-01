
export default {
    id: 'number',

    format(value, config) {
        return value || (config && config.default ? config.defaut : 0);
    }
};