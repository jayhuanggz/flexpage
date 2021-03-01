

const cache = {};
const Regex = {
    id: 'regex',
    validate(pageContext, rule, data) {

        let regex = cache[rule.regex];

        if (typeof regex === 'undefined') {
            regex = new RegExp(rule.regex);
            cache[rule.regex] = regex;
        }
        return regex.test(data);

    },

    isRuleApplicable(rule, data) {
        return typeof data === 'string' && typeof rule.regex === 'string' && rule.regex.length > 0

    }

}

export default Regex;