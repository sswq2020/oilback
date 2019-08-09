const defaultAgreeFormParams = {
    id: null, // 协议ID 新增的没有,编辑有
    agreementName: null, // 协议名称
    agreementTypeCode: null, // 协议类型
    effectTime: null, // 协议生效日期
    dueTime: null, // 协议到期日期
}


const store = {
    namespaced: true,
    state: {
        agreedialogEdit: false, // 默认新增打开弹窗
        agreeFormParams:{...defaultAgreeFormParams}
    },
    mutations: {
        setAgreeDialogEdit(state,payload) {
            state.agreedialogEdit = payload;
        },
        setAgreeFormParams(state,payload){
            state.agreeFormParams = payload
        }     

    },
    actions: {

    }
}

export default store;