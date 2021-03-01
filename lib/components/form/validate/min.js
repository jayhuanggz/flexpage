
const Min = {
    id: 'min',
    validate(pageContext, rule, data) {

        if (typeof data === 'string' || Array.isArray(data)) {
            return data.length >= rule.min;
        }
        return data >= rule.min;
    },

    isRuleApplicable(rule, data) {
        return typeof data !== 'undefined' && data !== null && (
            typeof data === 'string' || Array.isArray(data) || typeof data === 'number'
        ) && typeof rule.min === 'number'
    }

};

export default Min;