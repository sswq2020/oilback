<template>
  <div class="deliveryStoreglass">
    <el-input placeholder="请选择交割库地址" :value="value" :readonly="true">
      <el-button :disabled="disabled" slot="append" icon="el-icon-search" @click="open"></el-button>
    </el-input>
    <el-dialog
      title="交割库信息"
      width="675px"
      :visible.sync="visible"
      :center="true"
      @close="cancel"
      :close-on-click-modal="false"
    >
      <div class="search-box" style="padding:0px;margin:0px 0px 10px 0px;">
        <div class="form-item">
          <el-button size="small" @click.stop="add">新增</el-button>
        </div>
      </div>
      <el-table
        stylestripe
        border
        highlight-current-row
        v-loading="isListDataLoading"
        :data="listData.list"
        @current-change="handleCurrentChange"
      >
        <el-table-column
          :prop="item.prop"
          :label="item.label"
          :width="item.width || 'auto'"
          :align="item.align || 'left'"
          header-align="center"
          :key="index"
          v-for="(item,index) in tableHeader"
        >
          <template slot-scope="scope">
            <span>{{listData.list[scope.$index][item.prop]}}</span>
          </template>
        </el-table-column>
        <el-table-column>
          <template slot-scope="scope">
            <span @click="edit(listData.list[scope.$index])">编辑</span>
            <span @click="del(listData.list[scope.$index])">删除</span>
          </template>
        </el-table-column>

      </el-table>
      <div class="tb_pagination">
        <el-pagination
          @current-change="changePage"
          :current-page="listParams.page"
          :page-size="listParams.pageSize"
          layout="total, prev, pager, next"
          :total="listData.paginator.totalCount"
        ></el-pagination>
      </div>
      <div slot="footer" class="dialog-footer" style="float:right">
        <el-button @click="cancel">取 消</el-button>
        <el-button type="primary" @click="comfirm">确 定</el-button>
      </div>
    </el-dialog>
    <deliveryEdit
      :cancleCb="()=>{this.cancleCb()}"
      :confirmCb="(obj)=>{this.confirmCb(obj)}"
      :isEditLoading="isEditLoading"
      :show="modalShow"
      :isEdit="isEdit"
      :deliveryObj="deliveryObj"
    ></deliveryEdit>


  </div>
</template>
<script>
import Dict from "util/dict.js";
const defaultListParams = {
  pageSize: 5,
  page: 1
};
const defaultListData = {
  paginator: {
    totalCount: 0,
    totalPage: 1
  },
  list: []
};

const defaultAuditResultTableHeader = [
  {
    prop: "deliveryStore",
    label: "名称"
  },
  {
    prop: "storeAddress",
    label: "地址"
  },
  {
    prop: "storeAddressDetail",
    label: "详细地址"
  }
];

export default {
  name: "deliveryStoreglass",
  props: {
    disabled:{
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      visible: false,
      isListDataLoading: false,
      listParams: { ...defaultListParams }, // 页数
      listData: { ...defaultListData }, // 返回list的数据结构
      tableHeader: [...defaultAuditResultTableHeader],
      currentRow:null, //选中的那一行数据
      value: null,

      /***新增编辑交割库按钮的loading**/
      isEditLoading:false,
      /***新增编辑交割库弹窗显示隐藏**/
      modalShow:false,
      /***默认新增**/
      isEdit:false,
      /***编辑的对象***/
      deliveryObj:Object.create(null)
    };
  },
  methods: {
    changePage(page) {
      this.listParams.page = page;
      this.getListData();
    },
    clearListParams() {
      this.currentRow = null;
      this.listParams = { ...defaultListParams };
      this.listData = { ...defaultListData };
      this.getListData();
    },
    async getListData() {
      this.isListDataLoading = true;
      const res = await this.$api.queryDeliveryStoreList({
        ...this.listParams,
      });
      this.isListDataLoading = false;
      switch (res.code) {
        case Dict.SUCCESS:
          this.listData = res.data;
          break;
        default:
          this.$messageError(res.mesg);
          break;
      }
    },
    open() {
      this.visible = true;
    },
    cancel() {
      this.visible = false;
    },
    del(item){
      const {id, deliveryStore} = item
      let that = this;
      this.$confirm(`确定要删除${deliveryStore}`, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(async () => {
        const res = await that.$api.delDeliveryStore({
            id,
            isDeleted: Dict.DELETE_NORMAL
        });
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
    /**打开弹窗,且为编辑状态**/
    edit(item){
       const {id,deliveryStore,storeAddress,storeAddressDetail} = item;
        this.deliveryObj = {id,deliveryStore,storeAddress,storeAddressDetail};
        this.isEdit = true;
        this.modalShow = true;
    },
    /**打开弹窗,且为新增状态**/
    add(){
        this.deliveryObj = Object.create(null);
        this.isEdit = false;
        this.modalShow = true;
    },
    cancleCb(){
      this.modalShow = false
    },
    /***编辑或者新增交割库**/
    async confirmCb(obj){
      let that = this;
      const text = `${this.isEdit ? '更新' : '新增'}`
      const url = this.isEdit ? 'updateDeliveryStore' : 'addDeliveryStore'
      this.$confirm(`确定要${text}交割库`, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(async () => {
        this.isEditLoading = true;
        const res = await that.$api[url](obj);
        this.isEditLoading = false;
        switch (res.code) {
          case Dict.SUCCESS:
            that.$messageSuccess(`${text}成功`);
            that.getListData();
            break;
          default:
            that.$messageError(`${text}失败,${res.mesg}`);
            break;
        }
      });
    },
    comfirm() {
      if(!this.currentRow) {
        this.$messageError("必须选中一行才能确认");
        return
      }
      this.value = this.currentRow.name || "";
      this.$emit('deliveryStoreSelect',this.currentRow);
      this.cancel();
    },
    handleCurrentChange(row) {
      this.currentRow = row;
    }
  },
  watch: {
    visible(newV) {
      if (newV) {
        this.clearListParams();
      }
    }
  }
};
</script>

<style scoped lang="less">
.search-box {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  background-color: white;
  font-size: 14px;
  .form-item {
    .el-button {
      margin-top: 20px;
    }
  }
}
.tb_pagination {
  text-align: right;
}
</style>

