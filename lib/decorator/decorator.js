const decorators = {};

export default {

    add( decorator) {
        if (typeof decorators[decorator.id] !== 'undefined') {
            throw new Error('Decorator ' + decorator.id + ' already exists!');
        }
        decorators[decorator.id] = decorator;

    },
    decorate(id, value, config, data) {
        let decorator = decorators[id];
        if (!decorator) {
            return value;
        }

        return decorator.decorate(value, config, data);
    }

};