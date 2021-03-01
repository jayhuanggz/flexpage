import moment from 'moment';


export default {
    id: 'date',
    format(value) {
        if (!value) {
            return '';
        }
        return moment(value).format('YYYY-MM-DD')

    }
};