
import extend from '../store/extend'
import BaseState from '../store/index'


/**
 * Form及Form组件默认store
 */
const state = {
    namespaced: true,
    state() {
        return {
            model: '',
            valid: true,
            error: ''
        }
    },
    mutations: {
        updateModel: (state, data) => {
            state.model = data;
        }

    }
}



export default extend(state, BaseState);