import Provider from './variable_provider'

class UrlParamProvider extends Provider {

    constructor() {
        super();
    }

    supply() {
        let url = decodeURI(location.search);
        let result = {}, strs;
        if (url.indexOf("?") != -1) {
            var str = url.substr(1);
            strs = str.split("&");
            for (var i = 0; i < strs.length; i++) {
                result[strs[i].split("=")[0]] = (strs[i].split("=")[1]);
            }
        }
        return result;

    }
}

export default UrlParamProvider;