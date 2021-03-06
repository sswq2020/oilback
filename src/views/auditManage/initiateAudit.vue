<template>
  <div class="container single-page">
    <HletongBreadcrumb :data="breadTitle"></HletongBreadcrumb>
    <div class="search-box">
      <div class="form-item">
        <label>公司名称</label>
        <div class="form-control">
          <el-input v-model="form.name" placeholder="请输入" size="small"></el-input>
        </div>
      </div>
      <div class="form-item">
        <label>审核状态</label>
        <div class="form-control">
          <el-select v-model="form.checkState"  clearable placeholder="请选择">
            <el-option
              v-for="(item,index) in AuditStatusList"
              :key="index"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </div>
      </div>
      <div class="form-item">
        <label>审核结果</label>
        <div class="form-control">
          <el-select v-model="form.checkResult" placeholder="请选择">
            <el-option
              v-for="(item,index) in AuditResultList"
              :key="index"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </div>
      </div>
      <div class="form-item">
        <el-button
          type="primary"
          :loading="isListDataLoading"
          @click="getListDataBylistParams"
          size="small"
        >查询</el-button>
        <el-button size="small" @click="clearListParams">重置</el-button>
      </div>
    </div>
    <HletongTable
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
        :align="item.align || 'left'"
        :prop="item.prop"
        :label="item.label"
        :key="item.id"
        v-for="(item) in tableHeader"
        :show-overflow-tooltip="showOverflowTooltip"
      >
        <template slot-scope="scope">
          <span>{{listData.list[scope.$index][item.prop]}}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="100px" align="left" fixed="right">
        <template slot-scope="scope">
          <el-button
            type="text"
            v-if="listData.list[scope.$index].checkState === Dict.WAIT_AUDIT"
            @click="edit(listData.list[scope.$index])"
          >审核</el-button>
        </template>
      </el-table-column>
    </HletongTable>
    <UserDialog :visible.sync="visible" @updateVisible="updateVisible">
      <el-tab-pane label="入会协议" v-if="visible">
        <editMemberForm @agreemtClose="updateVisible(false)" />
      </el-tab-pane>
      <el-tab-pane label="入会审核" v-if="visible">
        <audit @auditClose="updateVisible(false)"></audit>
      </el-tab-pane>
    </UserDialog>
  </div>
</template>

<script>
import { mapMutations } from "vuex";
import Dict from "util/dict.js";
import { DICT_SELECT_ARR } from "common/util.js";
import UserDialog from "components/userDialog";
import editMemberForm from "../vipManage/editMemberForm.vue";
import audit from "./audit.vue";
const AuditStatusList = DICT_SELECT_ARR(Dict.AUDIT_STATUS);
const AuditResultList = DICT_SELECT_ARR(Dict.AUDIT_RESULT);

const defaultFormData = {
  name: null, //公司名称
  checkState: Dict.WAIT_AUDIT, //审核状态
  checkResult: null // 审核结果
};
const defaultListParams = {
  pageSize: 20,
  page: 1
};
const defaultListData = {
  paginator: {
    totalCount: 0,
    totalPage: 1
  },
  list: []
};
const defaulttableHeader = [
  {
    prop: "username",
    label: "用户名",    
  },
  {
    prop: "name",
    label: "公司名称"
  },
  {
    prop: "telNo",
    label: "公司电话",
    align: "right"
  },
  {
    prop: "applyTime",
    label: "申请日期",
  },
  {
    prop: "statusText",
    label: "审核状态"
  },
  {
    prop: "resultText",
    label: "审核结果"
  }
];

const rowAdapter = list => {
  if (!list) {
    return [];
  }
  if (list.length > 0) {
    list = list.map(row => {
      return (row = {
        ...row,
        statusText: Dict.AUDIT_STATUS[row.checkState],
        resultText: Dict.AUDIT_RESULT[row.checkResult]
      });
    });
  }
  return list;
};
export default {
  name: "initiateAudit",
  components: {
    UserDialog,
    editMemberForm,
    audit
  },
  data() {
    return {
      breadTitle: ["审核管理", "入会审核"],
      isListDataLoading: false,
      listParams: { ...defaultListParams }, // 页数
      form: { ...defaultFormData }, // 查询参数
      listData: { ...defaultListData }, // 返回list的数据结构
      tableHeader: defaulttableHeader,
      showOverflowTooltip: true,
      visible: false,
      AuditStatusList,
      AuditResultList,
      Dict
    };
  },
  methods: {
    ...mapMutations("memberForm", ["setAuditId", "setIsEdit", "setMemberId"]),
    updateVisible(bol){
      if(!bol) {
        this.getListData();
      }
      this.visible = bol;
    },    
    clearListParams() {
      this.form = { ...defaultFormData };
      this.listParams = { ...defaultListParams };
      this.listData = { ...defaultListData };
      this.getListData();
    },
    changePage(page) {
      this.listParams.page = page;
      this.getListData();
    },
    changePageSize(pageSize) {
      this.listParams = { ...defaultListParams, pageSize: pageSize };
      this.getListData();
    },
    getListDataBylistParams() {
      this.listParams = { ...defaultListParams };
      this.getListData();
    },
    async getListData() {
      this.isListDataLoading = true;
      const res = await this.$api.getInitiateAuditList(
        Object.assign(this.form, this.listParams)
      );
      this.isListDataLoading = false;
      switch (res.code) {
        case Dict.SUCCESS:
          this.listData = { ...res.data, list: rowAdapter(res.data.list) };
          break;
        default:
          this.$messageError(res.mesg);
          break;
      }
    },
    edit(item) {
      const { userId,id } = item;
      this.setIsEdit(true);
      this.setMemberId(userId);
      this.setAuditId(id);
      this.visible = true;
    },
    init() {
      setTimeout(() => {
        this.clearListParams();
        this.perm();
      }, 20);
      this.perm();
    },
    perm() {}
  },
  mounted() {
    this.init();
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
