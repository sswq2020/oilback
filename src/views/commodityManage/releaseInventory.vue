<template>
  <div class="container single-page">
    <HletongBreadcrumb :data="breadTitle"></HletongBreadcrumb>
    <div class="search-box">
      <div class="form-item">
        <label>品类</label>
        <div class="form-control">
          <el-select v-model="form.firstCatalogId" placeholder="请选择" size="small">
            <el-option
              v-for="(item,index) in firstCatalogList"
              :key="index"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </div>
      </div>
      <div class="form-item">
        <label>牌号名称</label>
        <div class="form-control">
          <el-select v-model="form.secondCatalogId" placeholder="请选择" size="small">
            <el-option
              v-for="(item,index) in trademarkList"
              :key="index"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </div>
      </div>
      <div class="form-item">
        <label>生产商</label>
        <div class="form-control">
          <el-select v-model="form.manufacturerId" placeholder="请选择" size="small">
            <el-option
              v-for="(item,index) in ManufacturerList"
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
          <span>{{listData.list[scope.$index][item.prop] || '-'}}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" fixed="right" width="120px" align="left">
        <template slot-scope="scope">
          <el-button type="text" @click="editItem(listData.list[scope.$index])">发布</el-button>
        </template>
      </el-table-column>
    </heltable>
    <releaseInventoryModal
      :cancleCb="cancleCb"
      :confirmCb="(obj)=>{this.releaseGoods(obj)}"
      :releaseLoading="releaseLoading"
      :visible="visible"
      :releaseObj="releaseObj"
    ></releaseInventoryModal>
  </div>
</template>

<script>
// import { judgeAuth } from "@/util/util.js";
import Dict from "util/dict.js";
import heltable from "components/hl_table";
import { findIndexByValue, handleFilterSelf, _toArray_ } from "common/util.js";
import releaseInventoryModal from "./releaseInventoryModal.vue";

const defaultFormData = {
  firstCatalogId: null,
  secondCatalogId: null,
  manufacturerId: null
};

const defaultListParams = {
  pageSize: 20,
  page: 1
};
const defaulttableHeader = [
  {
    prop: "firstCatalogName",
    label: "品名",
    width: "150"
  },
  {
    prop: "secondCatalogName",
    label: "牌号",
    width: "150",
    align: "right"
  },
  {
    prop: "emissionStandardEnumText",
    label: "排放标准",
    width: "120"
  },
  {
    prop: "density",
    label: "密度",
    width: "120",
    align: "right"
  },
  {
    prop: "productNumber",
    label: "产品编号"
  },
  {
    prop: "manufacturerId_",
    label: "生产商"
  },
  {
    prop: "updatedTime",
    label: "录入时间"
  },
  {
    prop: "totalWeightInventory",
    label: "可发布吨数",
    align: "right"
  }
];

const defaultListData = {
  paginator: {
    totalCount: 0,
    totalPage: 1
  },
  list: []
};

const rowAdapter = list => {
  if (!list) {
    return [];
  }
  if (list.length > 0) {
    list = list.map(row => {
      return (row = {
        ...row,
        emissionStandardEnumText: `${row.emissionStandardEnum.text}` || "-"
      });
    });
  }
  return list;
};

export default {
  name: "releaseInventory",
  components: {
    heltable,
    releaseInventoryModal
  },
  data() {
    return {
      breadTitle: ["商品管理", "库存发布"], // 面包屑title
      Dict: Dict,
      /**生产商数据源*/
      ManufacturerList: [],
      /**品类数据源*/
      firstCatalogList: [],
      /**牌号数据源*/
      trademarkList: [],
      // #region 查询的基本数据结构
      listParams: { ...defaultListParams }, // 页数
      listData: { ...defaultListData },
      form: { ...defaultFormData },
      // #endgion

      // #region 表格相关
      isListDataLoading: false,
      tableHeader: defaulttableHeader,
      showOverflowTooltip: true,
      // #endgion

      // #region 弹窗相关
      visible: false,
      releaseObj: Object.create(null),
      releaseLoading: false
      // #endgion
    };
  },
  methods: {
    clearListParams() {
      this.form = { ...defaultFormData };
      this.listParams = { ...defaultListParams };
      this.listData = { ...defaultListData };
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
    getListDataBylistParams() {
      this.listParams.page = 1;
      this.getList();
    },
    async getList() {
      this.isListDataLoading = true;
      const res = await this.$api.releaseycList({
        ...this.listParams,
        ...this.form
      });
      this.isListDataLoading = false;
      switch (res.code) {
        case Dict.SUCCESS:
          this.listData = { ...res.data, list: rowAdapter(res.data.list) };
          break;
        default:
          this.listData = { ...defaultListData };
          this.$messageError(res.mesg);
          break;
      }
    },
    async releaseGoods(obj) {
      this.releaseLoading = true;
      const res = await this.$api.releaseYc(obj);
      this.releaseLoading = false;
      switch (res.code) {
        case Dict.SUCCESS:
          this.$messageSuccess("发布成功");
          this.cancleCb();
          this.getList();
          break;
        default:
          this.$messageError(res.mesg);
          break;
      }
    },
    async _getProducerSelectList() {
      const res = await this.$api.getProducerSelectList();
      switch (res.code) {
        case Dict.SUCCESS:
          this.ManufacturerList = _toArray_(res.data);
          break;
        default:
          this.$messageError(res.mesg);
          break;
      }
    },
    async _getTransferBaseList() {
      const res = await this.$api.getTransferBaseList(Dict.PRODUCT_OIL);
      switch (res.code) {
        case Dict.SUCCESS:
          if (res.data.firstCatalogList && res.data.firstCatalogList.length) {
            this.firstCatalogList = handleFilterSelf(res.data.firstCatalogList);
          }
          break;
        default:
          this.$messageError(res.mesg);
          break;
      }
    },
    editItem(obj) {
      this.releaseObj = obj;
      this.visible = true;
    },
    cancleCb() {
      this.releaseObj = null;
      this.visible = false;
    }
  },
  created() {
    this._getTransferBaseList(Dict.PRODUCT_OIL).then(() => {
      this._getProducerSelectList();
      this.clearListParams();
    });
  },
  watch: {
    "form.firstCatalogId": {
      handler(newV, oldV) {
        if (newV !== oldV) {
          this.form.secondCatalogId = null;
          if (newV) {
            setTimeout(() => {
              const index = findIndexByValue(this.firstCatalogList, newV);
              this.trademarkList = this.firstCatalogList[index].child;
            }, 20);
          }
        }
      }
    }
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
