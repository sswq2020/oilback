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
          <el-button type="text"  v-if="listData.list[scope.$index].inventoryAvailableWeight > 0"  @click="GoPledge(listData.list[scope.$index])">质押</el-button>
          <el-button type="text"  v-if="listData.list[scope.$index].totalPledgeWeight > 0" @click="GoReleasePledge(listData.list[scope.$index])">解押</el-button>
        </template>
      </el-table-column>

    </heltable>

  </div>
</template>

<script>
import { mapGetters, mapMutations } from "vuex";
import { baseMixin } from "@/common/mixin.js";
// import { judgeAuth } from "@/util/util.js";
import _ from "lodash";
import Dict from "@/util/dict.js";
import heltable from "@/components/hl_table";
import hlBreadcrumb from "@/components/hl-breadcrumb";

const defaultFormData = {
  cargoId: null,
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
    prop: "totalPledgeNums",
    label: "质押数量",
    width: "180",
    align:"right"
  },
  {
    prop: "totalPledgeWeight",
    label: "质押重量",
    width: "180",
    align:"right"
  }  
];
export default {
  name: "togglePledgeManage",
  mixins: [baseMixin],
  components: {
    heltable,
    hlBreadcrumb
  },
  data() {
    return {
      breadTitle: ["仓储管理", "质解押管理"],
      isListDataLoading: false,
      listParams: { ...defaultListParams }, // 页数
      form: { ...defaultFormData }, // 查询参数
      listData: { ...defaultListData }, // 返回list的数据结构
      tableHeader: defaulttableHeader,
      showOverflowTooltip: true
    };
  },
  computed: {
    ...mapGetters("app", ["role", "userId", "username", "IS_SHIPPER"]),
    /**请求参数估计只要id*/
    ids() {
      return this.selectedItems.map(item => {
        return item.id;
      });
    }
  },
  methods: {
    ...mapMutations("togglePledgeManage", ["setPledgeData","setReleasePledgeData"]),
    _filter() {
      return _.clone(Object.assign({}, this.form, this.listParams));
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
      const res = await this.$api.getPledgeinfo(obj);
      this.isListDataLoading = false;
      switch (res.code) {
        case Dict.SUCCESS:
          this.listData = res.data;
          break;
        default:
          this.listData = { ...defaultListData };
          this.$messageError(res.mesg);
          break;
      }
    },
    GoPledge(item) {
      this.setPledgeData(item);
      this.$router.push({
        path: "/web/yc/pledgeinfo/page/pledgeManage"
      });
    },
    GoReleasePledge(item){
      this.setReleasePledgeData(item);
      this.$router.push({
        path: "/web/yc/pledgeinfo/page/releasePledgeManage"
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
</style>
