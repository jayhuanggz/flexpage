
const Required = {
    id: 'required',
    validate(pageContext, rule, data) {

        if (typeof data === 'undefined') {
            return false;
        }

        if (Array.isArray(data) && data.length === 0) {
            return false;
        }

        if (typeof data === 'string' && data.length === 0) {
            return false;
        }

        return true;
    },

    isRuleApplicable(rule, data) {
        return rule.required === true;
    }
};

export default Required;