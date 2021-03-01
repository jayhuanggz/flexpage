
import DataSource from './datasource'
export default {

    methods: {
        loadData(params, pagination, sort) {
            let datasourceConfig = this.config.datasource
            return DataSource.loadData(datasourceConfig, params, pagination, sort, this.fpContext);
        }
    }
};