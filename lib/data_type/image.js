

export default {
    id: 'image',

    format(value) {
        if (!value) {
            return '<img/>'
        }

        return '<img src="' + value + '"/>';
    }
};