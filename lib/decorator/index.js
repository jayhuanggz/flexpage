import Tag from './tag'
import Decorator from './decorator'

export default {
    init() {
        Decorator.add(Tag);
    }
}