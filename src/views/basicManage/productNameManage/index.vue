<template>
  <div class="container single-page">
    <HLBreadcrumb :data="breadTitle">
      <el-button type="primary" size="small" @click="add" icon="el-icon-plus">新增</el-button>
    </HLBreadcrumb>
    <div class="search-box">
      <div class="form-item">
        <label>大类</label>
        <div class="form-control">
          <el-select v-model="listParams.productTypeCode" placeholder="请选择">
            <el-option v-for="item in Object.keys(productTypeCodeData)" :key="item" :label="productTypeCodeData[item]" :value="item"></el-option>
          </el-select>
        </div>
      </div>
      <div class="form-item">
        <label>品名</label>
        <div class="form-control">
          <el-input v-model="listParams.productName" placeholder="请输入" size="small"></el-input>
        </div>
      </div>
      <div class="form-item">
        <label>品名代码</label>
        <div class="form-control">
          <el-input v-model="listParams.productNameCode" placeholder="请输入" size="small"></el-input>
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
          <el-button type="text" @click="forbiddenOrActiveItem(listData.list[scope.$index])">{{scope.row.productStatusCode == 0 ? '禁用' : '激活'}}</el-button>
        </template>
      </el-table-column>
    </HLtable>
    <ProductNameFormModal 
      :isEdit="isEdit"
      :editObj="editObj"
      :loading="isEditLoading"
      :confirmCb="modalConfirm"
    />
  </div>
  
</template>

<script>
import { mapState, mapMutations, mapActions  } from 'vuex';
import moment from 'moment';
import Dict from "@/util/dict.js";
import HLBreadcrumb from "@/components/hl-breadcrumb";
import HLtable from "@/components/hl_table";
import ProductNameFormModal from "./productNameFormModal.vue";

const defaultListParams = {
  page: 1,
  pageSize: 20,
  productTypeCode: '',
  productName: '',
  productNameCode: ''
};
export default {
  name: "productNameManage",
  components: {
    HLBreadcrumb,
    HLtable,
    ProductNameFormModal
  },
  data() {
    return {
      breadTitle: ["基础信息", "品名管理"],
      isListDataLoading: false,
      tableHeader: [
        {
          prop: "productTypeText",
          label: "大类",
          width: 180
        },
        {
          prop: "productName",
          label: "品名",
          width: 300
        },
        {
          prop: "productNameCode",
          label: "品名代码",
          width: 180
        },
        {
          prop: "createdTimeText",
          label: "录入时间",
          width: 180
        },
        {
          prop: "productStatusText",
          label: "状态",
          width: 180
        },
      ],
      listData: {
        paginator: {
          totalCount: 0,
        },
        list: []
      },
      listParams: {
        ...defaultListParams
      },
      isEdit: false,
      isEditLoading: false,
      editObj: {},
    }
  },
  computed: {
    ...mapState('app', ['productTypeCodeData'])
  },
  methods: {
    ...mapMutations('modal', ['SET_MODAL_VISIBLE']),
    ...mapActions('app', ['setYcData']),
    async getList() {
      this.isListDataLoading = true;
      const res = await this.$api.gettProductNamesList(this.listParams);
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
      this.editObj = null;
      this.SET_MODAL_VISIBLE(true);
    },
    editItem(obj) {
      this.isEdit = true;
      const { id, productName, productNameCode, productTypeCode } = obj;
      this.editObj = {
        id,
        productName,
        productNameCode,
        productTypeCode
      };
      this.SET_MODAL_VISIBLE(true);
    },
    forbiddenOrActiveItem(obj) {
      let that = this;
      const { id, productStatusCode, productName } = obj;
      const operationText = productStatusCode == 0 ? '禁用' : '激活';
      const serve =  productStatusCode == 0 ? 'disableProductName' : 'activeProductName';
      this.$confirm(`确定要确定要${operationText}品名${productName}?`, "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
      })
      .then(async () => {
        const response = await that.$api[serve]({id});
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
    async modalConfirm(obj) {
      const serve = this.isEdit ? "updateProductName" : "addProductName";
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
    this.setYcData();
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
