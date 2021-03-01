

/**
 * 所有组件默认store
 */
export default {
    namespaced: true,
    state() {
        return {
            hidden: false,
            model: '',
            datasourceRequestParams: {},
            state: ''
        }
    },
    mutations: {
        show: (state) => {
            state.hidden = false;
        },
        hide: (state) => {
            state.hidden = true;
        },
        change: (state, data) => {
            if (data) {
                state[data.property] = data.value;
            }

        }

    }
}