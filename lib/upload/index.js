const registry = {};
const configuration = {
    uploader: '',
    initParams: {},
    uploadData: {}
};

import Uploader from './uploader'

import MockUploader from './mock_uploader'

export default {

    name : 'upload',

    Uploader: Uploader,

    register(type, clazz) {
        if (Object.prototype.hasOwnProperty.call(registry, type)) {
            throw new Error('Uploader type: ' + type + " already registered!");
        }
        registry[type] = clazz;

    },

    createUploader(type) {
        if (!Object.prototype.hasOwnProperty.call(registry, type)) {
            throw new Error('Uploader type: ' + type + " not registered!");
        }

        return new registry[type]();
    },

    initUploader(context, uploader) {
        let initParams = configuration.initParams;
        if (typeof initParams === 'function') {
            initParams = initParams(context);
        } else if (typeof initParams === 'object') {
            let copy = {};
            Object.assign(copy, initParams);
            initParams = copy;
        }
        return uploader.init(initParams);
    },


    getUploadData(context) {
        let uploadData = configuration.uploadData;
        if (typeof uploadData === 'function') {
            uploadData = uploadData(context);
        } else if (typeof uploadData === 'object') {
            let copy = {};
            Object.assign(copy, uploadData);
            uploadData = copy;
        }
        return uploadData;
    },

    configure(config) {
        configuration.uploader = config.uploader;
        configuration.initParams = config.initParams || {};
        configuration.uploadData = config.uploadData || {};
    },

    init() {
        this.register('mock', MockUploader);
    },

    configuration: configuration
}