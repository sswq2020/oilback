const store = {
    namespaced: true,
    state: {
        pledgeData:null, // 质押
        releasePledgeData:null, // 解押
    },
    mutations: {
        setPledgeData(state,payload) {
            state.pledgeData = payload;
        },
        setReleasePledgeData(state,payload) {
            state.releasePledgeData = payload;
        },        
    },
    actions: {

    }
}

export default store;