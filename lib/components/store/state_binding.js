
import Transformer from './../../transformer/transformer'
class Binding {

    constructor(context, sources, watchedProps, target, property, expression, transformers) {
        let self = this, subs = [];
        self.expression = expression;
        self.sources = {};
        self.property = property;
        self.context = context;
        self.watchedProps = watchedProps;
        self.transformers = transformers;

        self.target = target;
        sources.forEach(source => {
            self.sources[source.getId()] = source;
            let watched = typeof watchedProps === 'undefined' ? undefined : watchedProps[source.getId()];
            let properties;

            if (watched && watched.length > 0) {
                properties = typeof watched === 'string' ? [watched] : watched;
            } else if (typeof source.getState === 'function') {
                let state = source.getState();
                if (state) {
                    properties = [];
                    for (var key in state) {
                        if (Object.prototype.hasOwnProperty.call(state, key)) {
                            properties.push(key);
                        }
                    }
                }
            }


            if (properties && properties.length > 0) {
                properties.forEach(property => {
                    subs.push(source.watch(property, self.triggerChange.bind(self)));
                })
            }
        });
        self.subs = subs;
        self.compileExpression();


        self.evaluate = (function (context) {
            return function () {
                let result = eval(context.compiledExpresson);
                return result;
            }
        })(self);
    }
    compileExpression() {
        let self = this;

        let compiled = 'let $context = context.context.getState();';

        for (var key in self.sources) {
            if (key && Object.prototype.hasOwnProperty.call(self.sources, key)) {
                compiled += 'let ';
                compiled += key;
                compiled += ' = context.sources.';
                compiled += key;
                compiled += ';';
            }
        }
        compiled += self.expression;
        self.compiledExpresson = compiled;
    }
    triggerChange(sourceProperty) {
        let self = this;

        if (sourceProperty && sourceProperty === self.property) {
            return;
        }

        let newValue = self.evaluate();

        let transformers = self.transformers;
        if (transformers && transformers.length > 0) {
            newValue = Transformer.runPipeline(transformers, self.context, newValue);
        }

        self.target.$store.commit(self.target.id + '/change', {
            property: self.property,
            value: newValue
        })
    }

    destroy() {
        this.subs.forEach(sub => sub());
        this.subs = undefined;
        this.expression = undefined;
        this.sources = undefined;
        this.property = undefined;
        this.compileExpression = undefined;
        this.evaluate = undefined;
        this.context = undefined;
    }
}



export default Binding;