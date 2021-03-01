import Vue from "vue";

import Registry from './lib/components/registry';
import Row from './lib/components/row';
import Col from './lib/components/col';
import Section from './lib/components/section';
import Popup from './lib/components/popup';

import Form from './lib/components/form/form';
import ComboList from './lib/components/form/combo_list/combo_list';

import Input from './lib/components/form/input';
import Select from './lib/components/form/select';
import SelectPopup from './lib/components/form/select_popup';

import Radio from './lib/components/form/radio';
import Image from './lib/components/form/image/image';
import ImageList from './lib/components/form/image/image_list';

import Date from './lib/components/form/date';
import DateRange from './lib/components/form/date_range';
import Switch from './lib/components/form/switch';

import Button from './lib/components/button';
import Text from './lib/components/text';
import Detail from './lib/components/detail';

import Tab from './lib/components/tab';

//table
import Table from './lib/components/table/table';

import Actions from './lib/components/actions/index'

Actions.init();


// eslint-disable-next-line
import HttpDataSource from './lib/datasource/http_datasource'

// eslint-disable-next-line
import DirectDataSource from './lib/datasource/direct_datasource'

import Decorators from './lib/decorator/index'
Decorators.init();

import DateType from './lib/data_type/index'
DateType.init();

import Transformers from './lib/transformer/index'
Transformers.init();

Registry.add('row', Row);
Registry.add('col', Col);
Registry.add('form', Form);
Registry.add('comboList', ComboList);
Registry.add('input', Input);
Registry.add('select', Select);
Registry.add('button', Button);
Registry.add('table', Table);
Registry.add('text', Text);
Registry.add('detail', Detail);
Registry.add('date', Date);
Registry.add('date_range', DateRange);
Registry.add('switch', Switch);
Registry.add('radio', Radio);
Registry.add('image', Image);
Registry.add('image_list', ImageList);
Registry.add('section', Section);
Registry.add('popup', Popup);
Registry.add('select_popup', SelectPopup);
Registry.add('tab', Tab);

function factory(root, widget, props) {
    let result = {
        class: ["fp-widget", widget.name || ''],
        props: props,
        on: root.$listeners,
        inject: widget.injects

    };


    return result;
}


function findMethods(widget) {
    let result = {};


    while (typeof widget !== 'undefined') {

        if (widget.methods) {
            for (var key in widget.methods) {
                if (!Object.prototype.hasOwnProperty.call(result, key)) {
                    result[key] = widget.methods[key];

                }
            }
        }

        // then look at mixin methods
        if (widget.mixins && widget.mixins.length > 0) {
            widget.mixins.forEach(m => {
                if (m.methods) {
                    for (var key in m.methods) {
                        if (!Object.prototype.hasOwnProperty.call(result, key)) {
                            result[key] = m.methods[key];

                        }
                    }
                }
            });
        }
        widget = widget.extends;
    }

    return result;

}

Vue.component("fp-widget", {
    render: function (createElement) {

        let widget = Registry.get(this.type);
        if (widget) {
            let element = createElement(widget, factory(this, widget, this.$props));
            let methods = findMethods(widget);
            for (var key in methods) {
                if (!Object.prototype.hasOwnProperty.call(this, key)) {
                    this[key] = (function (root, methods, key) {
                        return function () {
                            return methods[key].apply(root.$children[0], arguments)
                        };
                    })(this, methods, key);

                }
            }


            return element;
        } else {
            console.warn("Component not found: ", this.type);
            return createElement("div", {
                class: "fp-widget"
            });
        }
    },
    props: {
        eagerInit: {
            type: Boolean
        },
        id: {
            type: String
        },
        type: {
            type: String
        },
        config: {
            type: Object
        },
        extras: {
            type: Object
        }
    }
});


import FlexPage from './lib/flex_page'



FlexPage.modules = {};

FlexPage.registerModule = function (module) {
    FlexPage.modules[module.name] = module;
};

import DateModule from './lib/date/index'

FlexPage.registerModule(DateModule);

FlexPage.configure = function (module, config) {

    let mod = FlexPage.modules[module];
    if (typeof mod === 'undefined') {
        throw new Error('module ' + module + " is not registered!");
    }

    mod.configure(config);

}

import Transformer from './lib/transformer/transformer'
FlexPage.Transformer = Transformer;


import Validators from './lib/components/form/validate/index'

Validators.init();

import Validator from './lib/components/form/validate/validator'
FlexPage.Validator = Validator;

import Upload from './lib/upload/index'

Upload.init();

FlexPage.Upload = Upload;
FlexPage.registerModule(Upload);

export default FlexPage;







