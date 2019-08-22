const store = {
    namespaced: true,
    state: {
        memberType: null, // 会员类型 "1" 卖家  "2" 买家
        isEdit: false, // 默认新增
        memberId:null, // 会员ID
        listID:null // 前面列表页传来的主键id
    },
    mutations: {
        setIsEdit(state,payload) {
            state.isEdit = payload;
        },
        setMemberType(state,payload){
            state.memberType = payload
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