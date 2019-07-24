const store = {
    namespaced: true,
    state: {
        retrieval:null, // 出库
    },
    mutations: {
        setRetrieval(state,payload) {
            state.retrieval = payload;
        }
    },
    actions: {

    }
}

export default store;