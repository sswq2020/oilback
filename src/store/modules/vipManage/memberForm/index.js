const store = {
    namespaced: true,
    state: {
        isEdit: false, // 默认新增
        memberId:null, // 会员ID
        auditId:null // 审核ID
    },
    mutations: {
        setIsEdit(state,payload) {
            state.isEdit = payload;
        },
        setMemberId(state,payload){
            state.memberId = payload
        },
        setAuditId(state,payload){
            state.auditId = payload
        }        

    },
    actions: {

    }
}

export default store;