<template>
  <div class="container single-page">
    <hlBreadcrumb :data="breadTitle">
      <el-button
        class="hlB_buts"
        size="small"
        icon="el-icon-download"
        :disabled="!equalShipperItems"
        @click="()=>{this.batchInspectionVisible = true}"
      >入库</el-button>
    </hlBreadcrumb>
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
        <label>品名</label>
        <div class="form-control">
          <el-select v-model="form.productNameId" placeholder="请选择" size="small">
            <el-option
              v-for="(item,index) in productNameList"
              :key="index"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </div>
      </div>
      <div class="form-item">
        <label>材质</label>
        <div class="form-control">
          <el-select v-model="form.materialId" placeholder="请选择" size="small">
            <el-option
              v-for="(item,index) in materialList"
              :key="index"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </div>
      </div>
      <div class="form-item">
        <label>规格</label>
        <div class="form-control">
          <el-select v-model="form.specificationsId" placeholder="请选择" size="small">
            <el-option
              v-for="(item,index) in specificationsList"
              :key="index"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </div>
      </div>
      <div class="form-item">
        <label>产地</label>
        <div class="form-control">
          <el-select v-model="form.originPlaceId" placeholder="请选择" size="small">
            <el-option
              v-for="(item,index) in originPlaceList"
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
      @pageChange="changePage"
      :total="listData.paginator.totalCount"
      :currentPage="listParams.page"
      :pageSize="listParams.pageSize"
      :pageSizes="[20]"
      :data="listData.list"
      :multiple="true"
      @selection-change="selectChange"
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
          <span>{{listData.list[scope.$index][item.prop]}}</span>
        </template>
      </el-table-column>
    </heltable>
    <transitiondialog
      :data="selectedItems"
      :tableHeader="tableHeader.slice(0,8)"
      :confirmCb="batchInspection"
      :visible="batchInspectionVisible"
      :cancelCb="()=>{this.batchInspectionVisible = false}"
      :title="titles[0]"
    ></transitiondialog>
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
import transitiondialog from "@/components/transitiondialog";

const defaultFormData = {
  cargoId: null,
  deliveryStoreId: null,
  productNameId: null,
  materialId: null,
  specificationsId: null,
  originPlaceId: null
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
    prop: "pilePosition",
    label: "区桩位",
    width: "180"
  },
  {
    prop: "productName",
    label: "品名",
    width: "180"
  },
  {
    prop: "materialName",
    label: "材质",
    width: "180"
  },
  {
    prop: "specificationsName",
    label: "规格",
    width: "180"
  },
  {
    prop: "originPlaceName",
    label: "产地",
    width: "180"
  },
  {
    prop: "supposedNumText",
    label: "应收数量",
    width: "180"
  },
  // {
  //   prop: "numUnitText",
  //   label: "数量单位",
  //   width: "180"
  // },
  {
    prop: "supposedWeightText",
    label: "应收重量",
    width: "180"
  },
  // {
  //   prop: "weightUnitText",
  //   label: "重量单位",
  //   width: "180"
  // },
  {
    prop: "measuringText",
    label: "计量方式",
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
              numUnitText:row.numUnitTypeEnum&&row.numUnitTypeEnum.text || "-",
              weightUnitText:row.weightUnitTypeEnum&&row.weightUnitTypeEnum.text || "-",
              measuringText:row.measuringTypeEnum&&row.measuringTypeEnum.text || "-",
              supposedNumText:`${row.supposedNum || "-"}${(row.numUnitTypeEnum&&row.supposedNum)&&row.numUnitTypeEnum.text || ""}`,
              supposedWeightText:`${row.supposedWeight}${row.weightUnitTypeEnum&&row.weightUnitTypeEnum.text || "-"}`,
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
    hlBreadcrumb,
    transitiondialog
  },
  data() {
    return {
      breadTitle: ["仓储管理", "待验收入库"],
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
      selectedItems: [],
      titles: ["入库"]
    };
  },
  computed: {
    ...mapGetters("app", ["role", "userId", "username", "IS_SHIPPER"]),
    /**选中的必须是同一个货主才能出库和过户*/
    equalShipperItems() {
      let arr = this.selectedItems.map(item => item.cargoId);
      return new Set(arr).size === 1;
    },
    /**请求参数估计只要id*/
    ids() {
      return this.selectedItems.map(item => {
        return item.id;
      });
    }
  },
  methods: {
    ...mapMutations("waitCheckEnter", ["setInspection"]),
    selectChange(selection) {
      this.selectedItems = selection.slice();
    },
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
    getListDataBylistParams() {
      this.listParams = { ...defaultListParams };
      this.getListData();
    },
    async getListData() {
      let obj = this._filter();
      this.isListDataLoading = true;
      const res = await this.$api.getStockRegisterList(obj);
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
    batchInspection() {
      this.setInspection(this.selectedItems);
      this.$router.push({
        path: "/web/yc/storage/stockRegister/page/checkEnter"
      });
    },
    init() {
      setTimeout(() => {
        this.clearListParams()
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
