export default {
    id: 'money',
    format(value, config) {
        return '￥' + (value || (config && config.default ? config.defaut : 0));
    }
};