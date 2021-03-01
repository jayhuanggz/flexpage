import FlexPage from './../../index'

var qiniu = require('qiniu-js')


class QuxiaUploader extends FlexPage.Uploader {
    constructor() {
        super('quxia');
    }
    async init(config) {

        let self = this;
        self.domain = config.domain;
        self.region = config.region;
        self.qiniuConfig = config.qiniuConfig;



        return new Promise((resolve, reject) => {
            resolve(self);
        })

    }


    async upload(file, name, data) { }

    uploadToQiniu() {

        let region = this.region;

        if (Object.prototype.hasOwnProperty.call(qiniu.region, region)) {
            region = qiniu.region[region];
        } else {
            region = qiniu.region.z2;
        }

        return this.getQiniuToken().then(token => {
            var config = {
                // useCdnDomain: true,
                region: region,
                uptoken: token,
                domain: this.domain,
                unique_names: true,
            };
            var putExtra = {
                ...config
            }
            var observable = qiniu.upload(file, undefined, token, putExtra, config)
            return new Promise((resolve, reject) => {
                observable.subscribe({
                    error(err) {
                        reject(err)
                    },
                    complete(data) {
                        data.path = self.domain + "/" + data.key
                        data.fileName = file.name
                        resolve(data)
                    }
                }) // 上传开始
            })
        })

    }

    getQiniuToken() {
        return request({
            url: this.tokenUrl,
            method: 'post',
        }).then(res => res.data.data).catch(e => {
            console.error("获取七牛云token失败", e)
        })
    }

} 