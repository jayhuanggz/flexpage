import DataSource from './../lib/datasource/datasource'

import axios from 'axios'



class ApiDataSource extends DataSource {

    constructor() {
        super();
    }

    init(params) {
        let self = this;
        return new Promise((resolve) => {
            self.service = axios.create({
                baseURL: 'https://rapapi.renqilai.com/app/mock/39'
            })
            resolve(self);
        })
    }
    loadData(params, pagination, sort) {

        let urlParams = {};
        Object.assign(urlParams, params.params);

        if (pagination) {
            urlParams.size = pagination.pageSize;
            urlParams.from = pagination.pageSize * Math.max(0, pagination.currentPage - 1)
        }

        if (sort && sort.property) {
            urlParams.sort = sort.property;
            if (sort.desc === true) {
                urlParams.desc = true;
            }
        }
        params.params = urlParams;

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

DataSource.register('api', ApiDataSource);

export default ApiDataSource;