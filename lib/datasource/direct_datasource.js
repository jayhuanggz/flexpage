import DataSource from './datasource'


class DirectDataSource extends DataSource {

    constructor() {
        super();
    }

     init() {
         return new Promise(r=>r());
    }
     loadData(params) {
        return new Promise((resolve) => {
            resolve(params);
        })
    }

}

DataSource.register('direct', DirectDataSource);

export default DirectDataSource;