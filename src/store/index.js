import Vue from "vue";
import Vuex from "vuex";
import app from "./modules/app";
import {inventoryManage} from "./modules/warehouseManage";

Vue.use(Vuex);

const store = new Vuex.Store({
  state: {

  },
  getters: {

  },
  mutations: {

  },
  actions: {

  },
  modules: {
    app,
    inventoryManage
  }
});

export default store;
