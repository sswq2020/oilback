<template>
  <div class="container single-page">
    <HLBreadcrumb :data="breadTitle">
      <el-button type="primary" size="small" @click="add" icon="el-icon-plus">新增</el-button>
    </HLBreadcrumb>
    <div class="search-box">
      <div class="form-item">
        <label>物资代码</label>
        <div class="form-control">
          <el-input v-model="listParams.goodCode" placeholder="请输入" size="small"></el-input>
        </div>
      </div>
      <div class="form-item">
        <label>大类</label>
        <div class="form-control">
          <el-select v-model="listParams.productTypeCode" placeholder="请选择" >
            <el-option v-for="item in Object.keys(productTypeCodeData)" :key="item" :label="productTypeCodeData[item]" :value="item"></el-option>
          </el-select>
        </div>
      </div>
      <div class="form-item">
        <label>品名</label>
        <div class="form-control">
          <el-select v-model="listParams.productNameId" placeholder="请选择">
            <el-option v-for="item in Object.keys(productNameData)" :key="item" :label="productNameData[item]" :value="item"></el-option>
          </el-select>
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
    <HLtable
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
        :show-overflow-tooltip="true"
      >
        <template slot-scope="scope">
          <span>{{listData.list[scope.$index][item.prop] || '-'}}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" fixed="right" width="120px" align="left">
        <template slot-scope="scope">
          <el-button type="text" @click="editItem(listData.list[scope.$index])">编辑</el-button>
          <el-button type="text" @click="forbiddenOrActiveItem(listData.list[scope.$index])">{{scope.row.goodsStatusCode == '0' ? '禁用' : '激活'}}</el-button>
        </template>
      </el-table-column>
    </HLtable>
    <CommodityFormModal 
      :isEdit="isEdit"
      :editObj="editObj"
      :loading="isEditLoading"
      :confirmCb="modalConfirm"
    />
  </div>
</template>

<script>
import { mapState, mapMutations, mapActions } from 'vuex';
import moment from 'moment';
import Dict from "@/util/dict.js";
import HLBreadcrumb from "@/components/hl-breadcrumb";
import HLtable from "@/components/hl_table";
import CommodityFormModal from "./commodityFormModal.vue";

const defaultListParams = {
  page: 1,
  pageSize: 20,
  goodCode: '',
  productTypeCode: '', // 品名大类Code
  productNameId: '' // 品名Id
};
export default {
  name: "commodityManage",
  components: {
    HLBreadcrumb,
    HLtable,
    CommodityFormModal
  },
  data() {
    return {
      breadTitle: ["基础信息", "物资管理"], // 面包屑title
      isListDataLoading: false,
      tableHeader: [ // 表头
        {
          prop: "goodCode",
          label: "物资代码",
        },
        {
          prop: "productTypeText",
          label: "大类",
        },
        {
          prop: "productName",
          label: "品名",
        },
        {
          prop: "materialName",
          label: "材质",
        },
        {
          prop: "specificationsName",
          label: "规格",
        },
        {
          prop: "originPlaceName",
          label: "产地",
        },
        {
          prop: "createdTimeText",
          label: "录入时间",
        },
        {
          prop: "goodsStatusText",
          label: "状态",
        },
      ],
      listData: { // 列表数据
        paginator: { 
          totalCount: 0,
        },
        list: []
      },
      listParams: { // 列表请求参数
        ...defaultListParams
      },
      isEdit: false,
      isEditLoading: false,
      editObj: {},
      productNameData: {} // 品名下拉数据
    }
  },
  computed: mapState('app', ['productTypeCodeData']),
  methods: {
    ...mapMutations('modal', ['SET_MODAL_VISIBLE']),
    ...mapActions('app', ['setYcData']),
     /**
     * @author xh
     * @description 获取物资管理列表
     * */
    async getList() {
      this.isListDataLoading = true;
      const res = await this.$api.getGoodsList(this.listParams);
      this.isListDataLoading = false;
      switch (res.code) {
        case Dict.SUCCESS:
          this.listData = res.data;
          this.listData.list = res.data.list.map(item => {
            return {
              ...item,
              createdTimeText: item.createdTime ? moment(item.createdTime).format("YYYY-MM-DD HH:mm:ss") : '',
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
     * @description: 品名下拉列表
     */
    async getProductNameDropdownData() {
        const res = await this.$api.getProductNameData();
      switch (res.code) {
        case Dict.SUCCESS:
          this.productNameData = res.data;
          break;
        default:
          this.$messageError(res.mesg);
          break;
      }
    },
    search() {
      this.listParams.page = 1;
      this.getList();
    },
    reset() {
      this.listParams = {...defaultListParams};
      this.getList();
    },
    changePageSize(pageSize) {
      this.listParams.pageSize = pageSize;
      this.getList();
    },
    changePage(currentPage) {
      this.listParams.page = currentPage;
      this.getList();
    },
    add() {
      this.isEdit = false;
      this.editObj = {};
      this.SET_MODAL_VISIBLE(true);
    },
    editItem(obj) {
      this.isEdit = true;
      this.editObj = {...obj}; // 将此条数据带到弹窗编辑中
      this.SET_MODAL_VISIBLE(true);
    },
    /**
     * @author: xh
     * @description: 禁用或者激活
     */
    forbiddenOrActiveItem(obj) {
      let that = this;
      const { id, goodsStatusCode, goodCode, productName } = obj;
      const operationText = goodsStatusCode == '0' ? '禁用' : '激活';
      const apiUrl = goodsStatusCode == '0' ? 'disableGoods' : 'activeGoods';
      this.$confirm(`确定要${operationText}物资${goodCode}-${productName}?`, "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
      })
      .then(async () => {
        const response = await that.$api[apiUrl]({ id });
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
    /**
     * @author: xh
     * @description: 弹窗确定回调事件
     */
    async modalConfirm(obj) {
      const serve = this.isEdit ? "updateGoods" : "addGoods";
      const response = await this.$api[serve]({ ...obj });
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
    }
  },
  created() {
    this.getProductNameDropdownData(); 
    this.setYcData(); // 获取字典项
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
