<template>
  <div class="container single-page">
    <HletongBreadcrumb :data="breadTitle">
      <el-button
        type="primary"
        plain
        size="small"
        :disabled="!selectedItems.length"
        @click="completelyDel(null)"
        icon="el-icon-delete"
      >批量删除</el-button>
    </HletongBreadcrumb>
    <heltable
      ref="tb"
      @sizeChange="changePageSize"
      @pageChange="changePage"
      :total="listData.paginator.totalCount"
      :currentPage="listParams.page"
      :pageSize="listParams.pageSize"
      :data="listData.list"
      :multiple="true"
      @selection-change="selectChange"
      :loading="isListDataLoading"
    >
      <el-table-column
        align="center"
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
      <el-table-column label="操作" width="250px" align="center">
        <template slot-scope="scope">
          <el-button type="text" @click="completelyDel(listData.list[scope.$index])">彻底删除</el-button>
        </template>
      </el-table-column>
    </heltable>
  </div>
</template>

<script>
import Dict from "util/dict.js";
import heltable from "components/hl_table";

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
    prop: "firstCatalogName",
    label: "品名"
  },
  {
    prop: "secondCatalogName",
    label: "牌号"
  },
  {
    prop: "emissionStandardText",
    label: "排放标准"
  },
  {
    prop: "density",
    label: "密度"
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
    prop: "totalWeightInventory",
    label: "吨数"
  },
  {
    prop: "updatedTime",
    label: "删除时间"
  },
  {
    prop: "origin",
    label: "来源"
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
        emissionStandardText:
          (row.emissionStandardEnum && row.emissionStandardEnum.text) || "",
        origin: row.isYc === Dict.IS_YC ? "云仓发布" : "本系统发布"
      });
    });
  }
  return list;
};

export default {
  name: "recycleManage",
  components: {
    heltable
  },
  data() {
    return {
      breadTitle: ["商品管理", "回收站"],
      isListDataLoading: false,
      listParams: { ...defaultListParams }, // 页数
      listData: { ...defaultListData }, // 返回list的数据结构
      tableHeader: defaulttableHeader,
      showOverflowTooltip: true,
      selectedItems:[]
    };
  },
  computed: {
    /**请求参数估计只要id*/
    ids() {
      return this.selectedItems.map(item => {
        return item.id;
      });
    },
    productNumbers() {
      return this.selectedItems.map(item => {
        return item.productNumber;
      });
    }
  },
  methods: {
    selectChange(selection) {
      this.selectedItems = selection.slice();
    },
    clearListParams() {
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
      const res = await this.$api.getRecycleList(this.listParams);
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
    async completelyDel(item = null) {
      let that = this;
      let params, productNumber, info;
      if (item) {
        params = [{ id: item.id, isDeleted: Dict.DELETE_COMPLETE }];
        productNumber = item.productNumber;
      } else {
        params = this.ids.map(item => {
          return { id: item, isDeleted: Dict.DELETE_COMPLETE };
        });
        productNumber = this.productNumbers.join();
      }
      info = `商品编码${productNumber}`;
      this.$confirm(`确定要删除${info}`, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(async () => {
        const res = await that.$api.delOrResume(params);
        switch (res.code) {
          case Dict.SUCCESS:
            that.$messageSuccess(`删除成功`);
            that.getListData();
            break;
          default:
            that.$messageError(`删除失败,${res.mesg}`);
            break;
        }
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
