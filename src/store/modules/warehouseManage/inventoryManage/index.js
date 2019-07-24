const store = {
    namespaced: true,
    state: {
        transferOwnership:[], // 过户
        checkout:[], // 出库申请
        findDetail:null //查看明细
    },
    mutations: {
        setTransferOwnership(state,payload) {
            state.transferOwnership = payload;
        },
        setCheckout(state,payload){
            state.checkout = payload;
        },
        setFindDetail(state,payload){
            state.findDetail = payload;
        }
    },
    actions: {

    }
}

export default store;