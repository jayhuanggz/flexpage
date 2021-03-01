import Include from './include'
import Exclude from './exclude'
import Unwrap from './unwrap'
import Rename from './rename'
import Transformer from './transformer'

export default {
    init() {
        Transformer.add(Include);
        Transformer.add(Exclude);
        Transformer.add(Unwrap);
        Transformer.add(Rename);

    }
}