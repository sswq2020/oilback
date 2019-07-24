<template>
  <div class="container single-page">
    <hlBreadcrumb :data="breadTitle"></hlBreadcrumb>
    <div class="search-box">
      <div class="form-item">
        <label>货主名称</label>
        <div class="form-control">
          <el-select v-model="form.cargoId" placeholder="请选择" size="small">
            <el-option
              v-for="(item,index) in cargoList"
              :key="index"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </div>
      </div>
      <div class="form-item">
        <label>单据号码</label>
        <div class="form-control">
          <el-input v-model="form.pledgeCode" placeholder="请输入" size="small"></el-input>
        </div>
      </div>
      <div class="form-item">
        <label>质押日期</label>
        <div class="form-control">
          <el-date-picker
            v-model="form.timeRange"
            size="small"
            type="daterange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
          ></el-date-picker>
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

      <el-table-column label="操作" fixed="right" width="120px" align="left">
        <template slot-scope="scope">
          <el-button type="text" @click="detail(listData.list[scope.$index])">质押单</el-button>
        </template>
      </el-table-column>
    </heltable>
    <tickets
      :visible="visible"
      :cancelCb="()=>{this.visible = false}"
      :contentId="contentId"
      title="质押单"
    >
       <template>
         <pledgeticket :id="contentId" :data="bill"></pledgeticket>
       </template>
    </tickets>
  </div>
</template>

<script>
// import NP from "number-precision";
import { mapGetters } from "vuex";
import { baseMixin } from "@/common/mixin.js";
import { requestParamsByTimeRange } from "@/common/util.js";
import _ from "lodash";
import Dict from "@/util/dict.js";
import heltable from "@/components/hl_table";
import hlBreadcrumb from "@/components/hl-breadcrumb";
import tickets from "@/components/tickets";
import pledgeticket from "./pledgeticket";

/**只是请求参数的key,页面中的观察属性却不需要，只在请求的那一刻由timeRange赋值*/
const EXTRA_PARAMS_KEYS = ["pledgeStartTime", "pledgeEndTime"];

const defaultFormData = {
  cargoId: null,
  pledgeCode: null,
  timeRange: []
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
    prop: "cargoName",
    label: "货主",
    width: "180"
  },
  {
    prop: "inventoryTotalNums",
    label: "库存数量",
    width: "180",
    align:"right"
  },
  {
    prop: "inventoryTotalWeight",
    label: "库存重量",
    width: "180",
    align:"right"
  },
  {
    prop: "pledgeNums",
    label: "质押数量",
    width: "180",
    align:"right"
  },
  {
    prop: "pledgeWeight",
    label: "质押重量",
    width: "180",
    align:"right"
  },
  {
    prop: "pledgeCode",
    label: "单据号码",
    width: "180"
  },
  {
    prop: "createdTime",
    label: "质押日期",
    width: "180"
  }
];

export default {
  name: "pledgeDetail",
  mixins: [baseMixin],
  components: {
    heltable,
    hlBreadcrumb,
    tickets,
    pledgeticket
  },
  data() {
    return {
      breadTitle: ["仓储管理", "质押明细"],
      isListDataLoading: false,
      listParams: { ...defaultListParams }, // 页数
      form: { ...defaultFormData }, // 查询参数
      listData: { ...defaultListData }, // 返回list的数据结构
      tableHeader: defaulttableHeader,
      showOverflowTooltip: true,
      visible: false,
      contentId:"customers",
      bill:[],
    };
  },
  computed: {
    ...mapGetters("app", ["role", "userId", "username", "IS_SHIPPER"])
  },
  methods: {
    _filter() {
      const { timeRange } = this.form;
      const _reqParams_ = requestParamsByTimeRange(
        this.form,
        timeRange,
        ...EXTRA_PARAMS_KEYS
      );
      return _.clone(Object.assign({}, _reqParams_, this.listParams));
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
      this.listParams = { ...defaultListParams, pageSize:pageSize };
      this.getListData();      
    },
    getListDataBylistParams() {
      this.listParams = { ...defaultListParams };
      this.getListData();
    },
    async getListData() {
      let obj = this._filter();
      this.isListDataLoading = true;
      const res = await this.$api.getPledgeDetailList(obj);
      this.isListDataLoading = false;
      switch (res.code) {
        case Dict.SUCCESS:
          this.listData =res.data;
          break;
        default:
          this.$messageError(res.mesg);
          break;
      }
    },
    async detail(item) {
      const res = await this.$api.PledgeinfoBill(item.id);
      switch (res.code) {
        case Dict.SUCCESS:
          this.bill = [res.data]
          this.visible = true
          break;
        default:
          this.$messageError(`${res.mesg},无法获取质押单`);
          break;
      }      
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
.tip {
  margin: 10px 0 20px 0;
  .line {
    font-size: 20px;
    color: red;
  }
}
</style>
