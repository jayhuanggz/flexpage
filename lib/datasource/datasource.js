import Transformer from './../transformer/transformer'
import { evaluate } from './../expression/expression'


const datasources = {};

class DataSource {
    constructor() {
    }

    init(params) {
        console.log('init', params);
    }

    loadData() {
    }

    destroy() { }

    static register(type, clazz) {
        datasources[type] = clazz;
    }

    static create(type) {
        let clazz = datasources[type];
        if (clazz) {
            return new clazz();
        } else {
            console.warn('DataSource ' + type + ' is not found!');
        }
    }

    static loadData(datasourceConfig, params, pagination, sort, pageContext) {
        if (datasourceConfig) {
            let datasource = DataSource.create(datasourceConfig.type);
            if (datasource) {

                params = typeof params === 'undefined'
                    ? datasourceConfig.params
                    : params;


                let thisRequestParams = this.datasourceRequestParams;
                if (thisRequestParams) {
                    let merged = {};
                    Object.assign(merged, params.params, this.thisRequestParams);
                    params.params = merged;
                }

                if (typeof pageContext !== 'undefined') {
                    params = evaluate(params, {
                        $context: pageContext.getState()
                    }, true);
                }


                return datasource
                    .init(datasourceConfig.config)
                    .then(() => datasource.loadData(params, pagination, sort))
                    .then(data => {
                        let transformers = datasourceConfig.transformers;
                        if (transformers && transformers.length > 0) {
                            data = Transformer.runPipeline(transformers, pageContext, data);
                        }
                        return data;

                    });
            }
        }
        return new Promise((resolve) => {
            return resolve();
        });
    }
}

export default DataSource