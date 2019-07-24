<template>
  <div class="container single-page">
    <hlBreadcrumb :data="breadTitle">
      <el-button type="primary" size="small" @click="add" icon="el-icon-plus">新增</el-button>
    </hlBreadcrumb>
    <div class="search-box">
      <div class="form-item">
        <label>货主名称</label>
        <div class="form-control">
          <el-input v-model="listParams.cargoName" placeholder="请输入" size="small"></el-input>
        </div>
      </div>
      <div class="form-item">
        <label>社会统一信用代码</label>
        <div class="form-control">
          <el-input v-model="listParams.socialCreditCode" placeholder="请输入" size="small"></el-input>
        </div>
      </div>
      <div class="form-item">
        <el-button
          type="primary"
          :loading="isListDataLoading"
          @click="search"
          size="small"
        >查询</el-button>
        <el-button size="small" @click="reset">重置</el-button>
      </div>
    </div>
    <heltable
      ref="tb"
      @sizeChange="changePageSize"
      @pageChange="changePage"
      :total="listData.paginator.totalCount"
      :currentPage="listParams.page"
      :pageSize="listParams.pageSize"
      :data="listData.list"
      :loading="isListDataLoading"
    >
      <el-table-column
        align="left"
        :prop="item.prop"
        :label="item.label"
        :key="item.id"
        v-for="(item) in tableHeader"
        :show-overflow-tooltip="showOverflowTooltip"
      >
        <template slot-scope="scope">
          <span>{{listData.list[scope.$index][item.prop] || '-'}}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" fixed="right" width="120px" align="left">
        <template slot-scope="scope">
          <el-button type="text" @click="editItem(listData.list[scope.$index])">编辑</el-button>
          <el-button type="text" @click="forbiddenOrActiveItem(listData.list[scope.$index])">{{ scope.row.state == '0' ? '禁用' : '激活' }}</el-button>
        </template>
      </el-table-column>
    </heltable>
    <shipperformModal
      ref="modal"
      :loading="isEditLoading"
      :isEdit="isEdit"
      :confirmCb="modalConfirm"
      :shipperObj="shipperObj"
    ></shipperformModal>
  </div>
</template>

<script>
import { mapState, mapMutations } from 'vuex';
import moment from 'moment';
import _ from "lodash";
import { judgeAuth } from "@/util/util.js";
import Dict from "@/util/dict.js";
import heltable from "@/components/hl_table";
import hlBreadcrumb from "@/components/hl-breadcrumb";
import shipperformModal from "./shipperformModal.vue";

const defaultListParams = {
  pageSize: 20,
  page: 1,
  cargoName: '',
  socialCreditCode: ''
};
const defaulttableHeader = [
  {
    prop: "telPhone",
    label: "手机号码",
    width: "180"
  },
  {
    prop: "cargoName",
    label: "货主名称",
    width: "180"
  },
  {
    prop: "socialCreditCode",
    label: "社会统一信用代码",
    width: "180"
  },
  {
    prop: "bizContact",
    label: "联系人",
    width: "180"
  },
  {
    prop: "contactTel",
    label: "联系电话",
    width: "180"
  },
  {
    prop: "createdTimeText",
    label: "创建时间",
    width: "180"
  },
  {
    prop: "stateText",
    label: "状态",
    width: "180"
  }
];
const rowAdapter = (row, response) => {
  return { ...row };
};

export default {
  name: "shipperManage",
  components: {
    heltable,
    hlBreadcrumb,
    shipperformModal,
  },
  data() {
    return {
      breadTitle: ["基础信息", "货主管理"], // 面包屑title
      // #region 查询的基本数据结构
      listParams: { ...defaultListParams }, // 页数
      listData: { // 返回list的数据结构
        paginator: {
          totalCount: 0
        },
        list: []
      }, 
      // #endgion

      // #region 表格相关
      isListDataLoading: false,
      isdeleteLoading: false,
      isEditLoading: false,
      tableHeader: defaulttableHeader,
      showOverflowTooltip: true,
      // #endgion

      // #region 弹窗相关
      isEdit: false,
      shipperObj: null
      // #endgion
    };
  },
  computed: {...mapState('modal',['visible'])},
  methods: {
    ...mapMutations('modal', ['SET_MODAL_VISIBLE']),
    /**
     * @author: xh
     * @description: 获取货主管理列表
     */
    async getList() {
      this.isListDataLoading = true;
      const res = await this.$api.getShipperManageList(this.listParams);
      this.isListDataLoading = false;
      switch (res.code) {
        case Dict.SUCCESS:
          this.listData = res.data;
          this.listData.list = res.data.list.map(item => {
            return {
              ...item,
              createdTimeText: item.createdTime ? moment(item.createdTime).format("YYYY-MM-DD HH:mm:ss") : '',
              stateText: item.state == '0' ? '正常' : '禁用'
            }
          });
          break;
        default:
          this.$messageError(res.mesg);
          break;
      }
    },
    /**
     * @author: xh
     * @description: 弹窗确定回调事件
     */
    async modalConfirm(obj) {
      const serve = this.isEdit ? "updateShipper" : "createShipper";
      const response = await this.$api[serve]({...obj});
      switch (response.code) {
        case Dict.SUCCESS:
          this.$messageSuccess(`${this.isEdit ? "修改" : "新增"}成功`);
          this.SET_MODAL_VISIBLE(false);
          this.getList();
          break;
        default:
          this.$messageError(response.mesg);
          break;
      }
    },
    search() {
      this.listParams.page = 1;
      this.getList();
    },
    reset() {
      this.listParams = { ...defaultListParams };
      this.getList();
    },
    changePage(currentPage) {
      this.listParams.page = currentPage;
      this.getList();
    },
    changePageSize(pageSize) {
      this.listParams.pageSize = pageSize;
      this.getList();
    },
    /**
     * @author: xh
     * @description: 禁用或者激活
     */
    forbiddenOrActiveItem(obj) {
      let that = this;
      const { id, state, version, cargoName } = obj;
      const operationText = state == '0' ? '禁用' : '激活';
      const serve = state == '0' ? 'disableCargo' : 'activeCargo';
      that.$confirm(`确定要确定要${operationText}货主${cargoName}?`, "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        })
        .then(async () => {
          const response = await that.$api[serve]({ id });
          switch (response.code) {
            case Dict.SUCCESS:
              that.$messageSuccess(`${operationText}成功`);
              that.getList();
              break;
            default:
              that.$messageError(`${operationText}失败，${response.mesg}`);
              break;
          }
        });
    },
    editItem(obj) {
      this.isEdit = true;
      const { id, cargoName, telPhone, socialCreditCode, bizContact, contactTel,  version} = obj;
      this.shipperObj = {
        id, 
        cargoName, 
        telPhone, 
        socialCreditCode, 
        bizContact, 
        contactTel,  
        version
      };
      this.SET_MODAL_VISIBLE(true);
    },
    add() {
      this.isEdit = false;
      this.shipperObj = null;
      this.SET_MODAL_VISIBLE(true);
    },
  },
  created() {
    this.getList();
  }
};
</script>

<style scoped lang="less">
.search-box {
  flex-wrap: wrap;
  margin: 0;
  .form-item {
    padding-top: 20px;
    .el-button {
      margin-top: 17px;
    }
  }
}
</style>
