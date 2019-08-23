const store = {
    namespaced: true,
    state: {
        isEdit: false, // 默认新增
        memberId:null, // 会员ID
        listID:null // 前面列表页传来的主键id
    },
    mutations: {
        setIsEdit(state,payload) {
            state.isEdit = payload;
        },
        setMemberId(state,payload){
            state.memberId = payload
        },
        setlistID(state,payload){
            state.listID = payload
        }    

    },
    actions: {

    }
}

export default store;