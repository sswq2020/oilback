const store = {
    namespaced: true,
    state: {
        isEdit: false, // 默认新增
        memberId:null, // 会员ID
    },
    mutations: {
        setIsEdit(state,payload) {
            state.isEdit = payload;
        },
        setMemberId(state,payload){
            state.memberId = payload
        }

    },
    actions: {

    }
}

export default store;