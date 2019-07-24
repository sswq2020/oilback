const store = {
    namespaced: true,
    state: {
        inspection:[], // 入户
    },
    mutations: {
        setInspection(state,payload) {
            state.inspection = payload;
        }
    },
    actions: {

    }
}

export default store;