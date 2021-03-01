const validators = [];

const Validator = {

    add(validator) {
        if (validators.findIndex(v => v.id === validator.id) !== -1) {
            throw new Error('Validator ' + validator.id + ' already exists!');
        }
        validators.push(validator);
    },

    validate(pageContext, rule, data) {

        let validator;

        if (typeof rule.validator === 'string' && rule.validator.length > 0) {
            let index = validators.findIndex(v => v.id === rule.validator)
            if (index === -1) {
                console.warn('Validator ', rule.validator, ' not found!');
                return undefined;
            }
            validator = validators[index];

            if (!validator.isRuleApplicable(rule, data)) {
                return undefined;
            }

            return validator.validate(pageContext, rule, data);

        } else {

            let found = false;
            for (var i = 0; i < validators.length; i++) {

                if (validators[i].isRuleApplicable(rule, data)) {
                    let result = validators[i].validate(pageContext, rule, data);

                    if (result !== true) {
                        return result;
                    }
                    found = true;
                }
            }
            if (found) {
                return true
            } else {
                return undefined;
            }
        }

    },

    validateRules(pageContext, rules, data) {
        if (typeof rules === 'undefined' || rules.length === 0) {
            return true;
        }

        if (validators.length === 0) {
            return true;
        }
        let error, msg;
        for (var i = 0; i < rules.length; i++) {
            let rule = rules[i];
            let result = Validator.validate(pageContext, rule, data);
            if (result !== true && typeof result !== 'undefined') {
                error = result;
                msg = rule.message
                break;
            }
        }

        if (typeof error === 'undefined') {
            return true;
        }


        if (typeof error === 'string') {
            return error;
        }

        return typeof msg === 'string' && msg.length > 0 ? msg : false;
    }
}

export default Validator;