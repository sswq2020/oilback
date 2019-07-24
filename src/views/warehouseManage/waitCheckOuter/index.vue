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
        <label>仓库</label>
        <div class="form-control">
          <el-select v-model="form.deliveryStoreId" placeholder="请选择" size="small">
            <el-option
              v-for="(item,index) in deliveryStoreList"
              :key="index"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </div>
      </div>
      <div class="form-item">
        <label>出库申请时间</label>
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
      @selection-change="selectChange"
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
          <el-button type="text" @click="Retrieval(listData.list[scope.$index])">出库</el-button>
        </template>
      </el-table-column>
    </heltable>
  </div>
</template>

<script>
import { mapGetters, mapMutations } from "vuex";
import { baseMixin } from "@/common/mixin.js";
import { requestParamsByTimeRangeOrigin } from "@/common/util.js";
// import { judgeAuth } from "@/util/util.js";
import _ from "lodash";
import { normalTime } from "@/util/util.js";
import Dict from "@/util/dict.js";
import heltable from "@/components/hl_table";
import hlBreadcrumb from "@/components/hl-breadcrumb";

/**只是请求参数的key,页面中的观察属性却不需要，只在请求的那一刻由timeRange赋值*/
const EXTRA_PARAMS_KEYS = ["start", "end"];

const defaultFormData = {
  cargoId: null,
  deliveryStoreId: null,
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
    prop: "deliveryStore",
    label: "仓库",
    width: "180"
  },
  {
    prop: "cargoName",
    label: "货主",
    width: "180"
  },
  {
    prop: "supposedRemovalNum",
    label: "申请出库数量",
    width: "180",
    align:"right"
  },
  {
    prop: "supposedRemovalWeight",
    label: "申请出库重量",
    width: "180",
    align:"right"
  },
  {
    prop: "applyRemovalTimeText",
    label: "出库申请时间",
    width: "180"
  }
];

const rowAdapter = (list) => {
    if (!list) {
        return []
    }
    if (list.length > 0) {
        list = list.map((row) => {
            return row = { 
              ...row,
              applyRemovalTimeText:normalTime(row.applyRemovalTime),
              
            }
        })
    }
    return list
}


export default {
  name: "waitCheckEnter",
  mixins: [baseMixin],
  components: {
    heltable,
    hlBreadcrumb
  },
  data() {
    return {
      breadTitle: ["仓储管理", "待验收出库"],
      // #region 各种lodaing
      isListDataLoading: false,
      batchInspectionVisible: false,
      // #endgion

      // #region 查询的基本数据结构
      listParams: { ...defaultListParams }, // 页数
      form: { ...defaultFormData }, // 查询参数
      listData: { ...defaultListData }, // 返回list的数据结构
      // #endgion
      /**表格相关*/
      tableHeader: defaulttableHeader,
      showOverflowTooltip: true,
      /*多选的row*/
      selectedItems: []
    };
  },
  computed: {
    ...mapGetters("app", ["role", "userId", "username", "IS_SHIPPER"])
  },
  methods: {
    ...mapMutations("waitCheckOuter", ["setRetrieval"]),
    selectChange(selection) {
      this.selectedItems = selection.slice();
    },
    _filter() {
      const { timeRange } = this.form;
      const _reqParams_ = requestParamsByTimeRangeOrigin(
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
      const res = await this.$api.getStockRemovalList(obj);
      this.isListDataLoading = false;
      switch (res.code) {
        case Dict.SUCCESS:
          this.listData ={...res.data, list: rowAdapter(res.data.list) };
          break;
        default:
          this.listData = { ...defaultListData };
          this.$messageError(res.mesg);
          break;
      }
    },
    Retrieval(item) {
      const { removalId } = item;
      this.setRetrieval(removalId);
      this.$router.push({
        path: "/web/yc/storage/stockRemoval/page/CheckOuter"
      });
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
