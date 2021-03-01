import Uploader from './uploader'

class MockUploader extends Uploader {
    constructor() {
        super();
    }

    init(config) {
        return new Promise(resolve => resolve());
    }

    upload(file, data) {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                resolve({
                    file: file,
                    res: {
                        url: file.url
                    }
                });
            }, 2000);
        });
    }


}

export default MockUploader;