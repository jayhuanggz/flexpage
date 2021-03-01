export default {
    id: 'expression',
    validate(pageContext, rule, data, form) {

        form.model[rule.target] === data;
    },
    isRuleApplicable(rule, data) {
        return typeof data !== 'undefined' && data !== null && (
            typeof data === 'string' || typeof data === 'number'
        ) && typeof rule.target === 'string' && rule.expression.length > 0
    }
};