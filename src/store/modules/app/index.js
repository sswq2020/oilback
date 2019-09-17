import * as type from './mutations-types';
import api from "@/api";
import Dict from "@/util/dict.js";

const _DICT_SERVE_ = [
  "HywEmissionStandard",
  "HywSellState",
  "HywManufacturer",
  "HywContractCompany"
]

const store = {
    namespaced: true,
    state: {
        role:null,
        userId:null,
        username:null,
        HywEmissionStandardList:[],
        HywSellStateList:[],
        HywManufacturerList:[],
        HywContractCompanyList:[]        
    },
    getters: {
      role: state => state.role,
      userId: state => state.userId,
      username: state => state.username,
      IS_SHIPPER: state => state.role === "1", // 判断是否是货主
    },
    mutations: {
      [type.SET_ROLE](state,payload){
        state.role = payload
      },
      [type.SET_USER_ID](state,payload){
        state.userId = payload
      },
      [type.SET_USER_NAME](state,payload){
        state.username = payload
      },
      setHywEmissionStandardList(state,list){
        state.HywEmissionStandardList = list
      },
      setHywSellStateList(state,list){
        state.HywSellStateList = list
      },
      setHywManufacturerList(state,list){
        state.HywManufacturerList = list
      },
      setHywContractCompanyList(state,list){
        state.HywContractCompanyList = list
      }
    },
    actions: {
      // 获取数据字典项
      async setYcData({ commit  }) {
        const res = await api.getValidList({
          entryCodes: _DICT_SERVE_.join(),
          tenantId: 'hlyc'
        });
        switch (res.code) {
          case Dict.SUCCESS:
            res.data.forEach(obj => {
              let typeMutation = `set${obj.entryCode}List`;
              let listData = new Array;
              obj.items.forEach(item => {
                listData.push({
                  id:item.id,
                  name:item.text
                })
              });
              commit(typeMutation, listData);
            });
            break;
          default:
            break;
        }
      },
    }
}

export default store;