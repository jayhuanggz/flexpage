export default {
    id: 'enum',
    format(value, config) {
        if (typeof config === 'undefined') {
            return value;
        }

        let defaultValue = config.default || '';

        if (!value) {
            return defaultValue;
        }
        return config.values ? config.values[value] || defaultValue : defaultValue;
    }
};