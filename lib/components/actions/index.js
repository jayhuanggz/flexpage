import HttpAction from './http_action'
import InvokeAction from './invoke_action'
import UrlAction from './url_action'
import BackAction from './back_action'
export default {
    init() {
        new HttpAction();
        new InvokeAction();
        new UrlAction();
        new BackAction();
    }
}