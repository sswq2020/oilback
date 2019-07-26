const store = {
    namespaced: true,
    state: {
        isEdit:false   // 默认都是新增商品的页面,
    },
    mutations: {
        setIsEdit(state,payload) {
            state.isEdit = payload;
        }
    },
    actions: {

    }
}

export default store;