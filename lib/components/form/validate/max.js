
const Max = {
    id: 'max',
    validate(pageContext, rule, data) {

        if (typeof data === 'string' || Array.isArray(data)) {
            return data.length <= rule.max;
        }

        return data <= rule.max;
    },
    isRuleApplicable(rule, data) {
        return typeof data !== 'undefined' && data !== null && (
            typeof data === 'string' || Array.isArray(data) || typeof data === 'number'
        ) && typeof rule.max === 'number'
    }
}


export default Max;