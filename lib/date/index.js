import moment from 'moment';


let dates = {

    date: {
        truncate(date) {
            return date;
        },
        lastDay(date) {
            return date;
        },
        previousPeriod(date) {

            let yesterday = moment(date).add(-1, 'days').toDate();

            return [yesterday, yesterday];
        },
        thisPeriod(date) {

            let yesterday = moment(date).add(-1, 'days').toDate();

            return [yesterday, date];
        }
    },
    week: {
        truncate(date) {
            return moment(date).day('Monday').toDate();
        },
        lastDay(date) {
            return moment(date).day('Monday').add(6, 'days').toDate();
        },
        previousPeriod(date) {


            let start = moment(date).day('Monday').add(-7, 'days');
            let end = moment(date).day('Monday').add(-1, 'days');
            return [start.toDate(), end.toDate()];
        },
        thisPeriod(date) {


            let start = moment(date).day('Monday');
            let end = moment(date).day('Monday').add(6, 'days');
            return [start.toDate(), end.toDate()];
        }
    },


    month: {
        truncate(date) {
            return moment(date).date(1).toDate();
        },
        lastDay(date) {
            return moment(date).date(1).add(1, 'month').add(-1, 'days').toDate();

        },
        previousPeriod(date) {

            let start = moment(date).date(1).add('-1', 'months').toDate();
            let end = moment(date).date(1).add(-1, 'days').toDate();
            return [start, end];
        },
        thisPeriod(date) {

            let start = moment(date).date(1).toDate();
            let end = moment(date).date(1).add(1, 'months').add(-1, 'days').toDate();
            return [start, end];
        }
    },

    year: {
        truncate(date) {
            return moment(date).dayOfYear(1).toDate();
        },
        lastDay(date) {
            return moment(date).dayOfYear(1).add(1, 'years').add(-1, 'days').toDate();

        },
        previousPeriod(date) {

            let start = moment(date).dayOfYear(1).add(-1, 'years');
            let end = moment(date).dayOfYear(1).add(-1, 'years').add(1, 'years').add(-1, 'days');
            return [start.toDate(), end.toDate()];
        },
        thisPeriod(date) {

            let start = moment(date).dayOfYear(1);
            let end = moment(date).dayOfYear(1).add(1, 'years').add(-1, 'days');
            return [start.toDate(), end.toDate()];
        }
    }

}
class DateModule {
    constructor() {
    }

    init(config) {
        this.shortcuts = this.parseShortcuts(config.shortcuts);
    }

    parseShortcuts(data) {

        if (typeof data === 'undefined') {
            return;
        }

        let result = {};
        for (var key in data) {
            if (Object.prototype.hasOwnProperty.call(data, key)) {
                let shortcuts = data[key];
                if (shortcuts && shortcuts.length > 0) {
                    let compiled = [];
                    shortcuts.forEach(item => {

                        let fn = this.compile(item.value, key === 'daterange');
                        if (fn) {
                            compiled.push({
                                text: item.text,
                                onClick: (function (fn) {
                                    return function (picker) {
                                        let value = fn();
                                        picker.$emit("pick", value);
                                    }
                                })(fn)
                            });
                        }



                    });
                    result[key] = compiled;
                }
            }
        }
        return result;
    }

    compile(expression, range) {

        if (typeof expression === 'function') {
            return expression;
        }

        if (moment(expression).isValid()) {
            return () => moment(expression);

        }

        if (expression === 'now') {
            if (range) {
                return () => [new Date(), new Date()]

            } else {
                return () => new Date()
            }
        }

        if (expression === 'yesterday') {
            if (range) {
                return () => {
                    let date = moment()
                        .subtract(1, "days")
                        .toDate();
                    return [date, date];
                }
            } else {
                return () => moment()
                    .subtract(1, "days")
                    .toDate();
            }

        }
        expression = expression.trim().split(' ');

        if (expression.length == 1) {
            expression = expression[0];
            if (expression.indexOf('last') != -1) {
                if (range) {
                    let unit = expression.substring(4);
                    let dateType = dates[unit];

                    if (dateType) {
                        return () => {
                            let now = new Date();
                            let result = dateType.previousPeriod(now);
                            return result;

                        }
                    }

                } else {
                    let unit = expression.substring(4) + 's';

                    return () => moment()
                        .subtract(1, unit)
                        .toDate();
                }


                
            } else if (expression.indexOf('this') != -1) {

                if (range) {
                    let unit = expression.substring(4);
                    let dateType = dates[unit];

                    if (dateType) {
                        return () => {
                            let now = new Date();
                            let result = dateType.thisPeriod(now);
                            return result;

                        }
                    }
                } else {
                    console.warn('only daterange support "this" keyword: ', expression);
                }
            }
            else {
                console.warn('invalid date expression for shortcut: ', expression);
            }
        } else {
            let unit = expression[1], value = parseInt(expression[0], 10);
            if (isNaN(value)) {
                console.warn('invalid value for shortcut: ', expression[0]);
            } else {

                return () => {
                    let date = moment()
                        .add(value, unit)
                        .toDate();

                    if (value > 0) {
                        return [new Date(), date];
                    } else {
                        return [date, new Date()]
                    }
                }
            }


        }
    }

    getShortcuts() {
        return this.shortcuts;
    }
}

let module = new DateModule();

export default {
    name: 'date',
    configure(config) {
        module.init(config);
    },
    getShortcuts(type) {
        let shortcuts = module.getShortcuts();
        if (typeof shortcuts === 'undefined' || shortcuts.lenth === 0) {
            return undefined;
        }
        return shortcuts[type];
    }


}