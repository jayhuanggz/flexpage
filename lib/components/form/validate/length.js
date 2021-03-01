

export default {

    id: 'length',
    validate(pageContext, rule, data) {

        return data.length === rule.length;
    },
    isRuleApplicable(rule, data) {
        return typeof data !== 'undefined' && data !== null && (
            typeof data === 'string' || Array.isArray(data)
        ) && rule.length > 0
    }
};