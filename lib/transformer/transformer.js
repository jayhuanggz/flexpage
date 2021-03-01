
const transformers = {};

const Transformer = {

    add(transformer) {
        let id = transformer.id;
        if (Object.prototype.hasOwnProperty.call(transformers, id)) {
            throw new Error("transformer " + id + " already registered!");
        }
        transformers[id] = transformer;
    },

    transform(id, pageContext, config, data) {
        let transformer = transformers[id];
        if (typeof transformer === 'undefined') {
            throw new Error("transformer " + id + " not registered!");
        }
        let path = config ? config.path : undefined;

        if (path && path.length > 0) {
            let paths = path.split('.');
            let target = data
            for (var i = 0; i < paths.length; i++) {
                let p = paths[i];
                if (typeof target[p] === 'undefined') {
                    console.warn('invalid path: ' + path);
                    return data;
                }

                if (i === paths.length - 1) {
                    target[p] = transformer.transform(pageContext, config, target[p]);
                    return data;

                } else {
                    target = target[p];
                }
            }

        } else {
            return transformer.transform(pageContext, config, data);

        }


    },

    runPipeline(transformers, pageContext, data) {
        if (typeof data === 'undefined') {
            return data;
        }

        let result = data;
        transformers.forEach(transformer => {
            let id, config;
            if (typeof transformer === 'string') {
                id = transformer;
            } else {
                id = transformer.id;
                config = transformer.config;

            }

            result = Transformer.transform(id, pageContext, config, result);
        });
        return result;
    }
}



export default Transformer;