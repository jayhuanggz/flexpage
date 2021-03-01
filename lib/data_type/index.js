
import Date from './date'
import DateTime from './date_time'
import Text from './text'
import Image from './image'
import Number from './number'
import Enum from './enum'
import Money from './money'
import DataType from './data_type'

export default {
    init() {
        DataType.add(Date);
        DataType.add(DateTime);
        DataType.add(Text);
        DataType.add(Image);
        DataType.add(Enum);
        DataType.add(Number);
        DataType.add(Money);
    }
};

