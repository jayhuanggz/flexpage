import Length from './length'
import Max from './max'
import Min from './min'
import Number from './number'
import Regex from './regex';
import Required from './required'
import Equal from './equal'

import Validator from './validator'

export default {
    init() {

        Validator.add(Length);
        Validator.add(Max);
        Validator.add(Min);
        Validator.add(Number);
        Validator.add(Required);
        Validator.add(Equal);

    }
}