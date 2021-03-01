import DataSource from './datasource'

import axios from 'axios'

class HttpDataSource extends DataSource {

    constructor() {
        super();
    }

     init(params) {
        let self = this;
        return new Promise((resolve) => {
            self.service = axios.create({
                baseURL: params.base,
                timeout: params.timeout || 30000
            })
            resolve(self);
        })
    }
     loadData(params, pagination, sort) {

        return this.service(params).then(data => {
            let result = data;
            if (result) {
                result = result.data;
                if (result) {
                    result = result.data;
                }
            }
            return result;
        });
    }

}

DataSource.register('http', HttpDataSource);

export default HttpDataSource;