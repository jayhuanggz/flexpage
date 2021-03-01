import moment from 'moment';


export default {
    id: 'datetime',
    format(value) {
        if (!value) {
            return '';
        }
        return moment(value).format('YYYY-MM-DD HH:mm:ss')

    }
};