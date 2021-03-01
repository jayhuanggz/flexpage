
export default {
    id: 'tag',
    decorate(value, config, data) {
        let tagClass = '';

        if (typeof config.type === 'string') {
            tagClass = "el-tag--" + config.type.toLowerCase();
        } else if (typeof config.type === 'object') {
            if (data && Object.prototype.hasOwnProperty.call(config.type, data)) {
                tagClass = "el-tag--" + config.type[data].toLowerCase();
            } else if (typeof config.default !== 'undefined') {
                tagClass = "el-tag--" + config.default.toLowerCase();
            }

        }

        return '<span class="el-tag el-tag--light ' + tagClass + '">' + value + '</span>'
    }
};