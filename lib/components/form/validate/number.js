
const Number = {
    id: 'number',
    validate(pageContext, rule, data) {
        if (typeof data !== 'number') {
            return false
        }

        if (rule.scale > 0) {
            return parseInt(data * (10 ^ rule.scale)) / (10 ^ rule.scale) === data;
        }

        return true;


    },

    isRuleApplicable(rule, data) {
        return rule.type === 'number' && typeof data !== 'undefined' && data !== null
    }
};

export default Number;