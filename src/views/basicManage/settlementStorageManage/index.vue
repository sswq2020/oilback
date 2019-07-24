<template>
  <div class="container single-page">
    <HLBreadcrumb :data="breadTitle">
      <el-button type="primary" size="small" @click="add" icon="el-icon-plus">新增</el-button>
    </HLBreadcrumb>
    <div class="search-box">
      <div class="form-item">
        <label>交割库名称</label>
        <div class="form-control">
          <el-input v-model="listParams.deliveryStore" placeholder="请输入" size="small"></el-input>
        </div>
      </div>
      <div class="form-item">
        <label>交割库地址</label>
        <div class="form-control">
          <AreaCascader 
            :value="address" 
            :clearable="true"
            @selection="selectArea"
          />
        </div>
      </div>
      <div class="form-item">
        <label>交割库类型</label>
        <div class="form-control">
          <el-select v-model="listParams.storeType" placeholder="请选择">
            <el-option v-for="item in Object.keys(deliveryStoreTypeData)" :key="item" :label="deliveryStoreTypeData[item]" :value="item"></el-option>
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
        :align="item.align || 'left'"
        :prop="item.prop"
        :label="item.label"
        :key="item.id"
        v-for="(item) in tableHeader"
        :show-overflow-tooltip="true"
      >
        <template slot-scope="scope">
          <span>{{listData.list[scope.$index][item.prop]}}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" fixed="right" width="120px" align="left">
        <template slot-scope="scope">
          <el-button type="text" @click="editItem(listData.list[scope.$index])">编辑</el-button>
          <el-button type="text" @click="forbiddenOrActiveItem(listData.list[scope.$index])">{{scope.row.publicStatusEnum.code == '0' ? '禁用' : '激活'}}</el-button>
        </template>
      </el-table-column>
    </HLtable>
    <SettlementFormModal 
      :isEdit="isEdit"
      :editObj="editObj"
      :loading="isEditLoading"
      :confirmCb="modalConfirm"
    />
  </div>
  
</template>

<script>
import { mapMutations, mapActions, mapState  } from 'vuex';
import moment from 'moment';
import Dict from "@/util/dict.js";
import HLBreadcrumb from "@/components/hl-breadcrumb";
import HLtable from "@/components/hl_table";
import AreaCascader from "@/components/areaCascader";
import SettlementFormModal from "./settlementFormModal.vue";

const defaultListParams = {
  page: 1,
  pageSize: 20,
  deliveryStore: '', // 交割库名称
  storeAddressProvince: '', // 省
  storeAddressCity: '', // 市
  storeAddressCounty: '', // 区
  storeType: '' // 交割库类型
};
export default {
  name: "settlementStorageManage",
  components: {
    HLBreadcrumb,
    HLtable,
    AreaCascader,
    SettlementFormModal
  },
  data() {
    return {
      breadTitle: ["基础信息", "交割库管理"], // 面包屑title
      isListDataLoading: false,
      tableHeader: [ // 表头
        {
          prop: "deliveryStore",
          label: "交割库名称",
          align: 'left',
          width: 180
        },
        {
          prop: "addressText",
          label: "交割库地址",
          align: 'left',
          width: 300
        },
        {
          prop: "storeCapacity",
          label: "交割库库容量",
          align: 'right',
          width: 180
        },
        {
          prop: "storeTypeText",
          label: "交割库类型",
          align: 'left',
          width: 180
        },
        {
          prop: "leader",
          label: "负责人",
          align: 'left',
          width: 180
        },
        {
          prop: "contactTel",
          label: "联系电话",
          align: 'left',
          width: 180
        },
        {
          prop: "createdTimeText",
          label: "创建时间",
          width: 180
        },
        {
          prop: "stateText",
          label: "状态",
          align: 'left',
          width: 180
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
      address: [], // 地址列表 - ['省', '市', '区']
    }
  },
  computed: {
    ...mapState('app', ['deliveryStoreTypeData']),
  },
  methods: {
    ...mapMutations('modal', ['SET_MODAL_VISIBLE']),
    ...mapActions('app', ['setYcData']),
    /**
     * @author: xh
     * @description: 获取交割库管理列表
     */
    async getList() {
      this.isListDataLoading = true;
      const res = await this.$api.getDeliveryStoreList(this.listParams);
      this.isListDataLoading = false;
      switch (res.code) {
        case Dict.SUCCESS:
          this.listData = res.data;
          this.listData.list = res.data.list.map(item => {
            return {
              ...item,
              storeCapacity: item.storeCapacity ? item.storeCapacity : 0,
              createdTimeText: item.createdTime ? moment(item.createdTime).format("YYYY-MM-DD HH:mm:ss") : '',
              addressText: `${item.storeAddressProvince}${item.storeAddressCity}${item.storeAddressCounty}${item.storeAddressStreet}`,
              storeTypeText: item.storeTypeEnum.text,
              stateText: item.publicStatusEnum.text
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
      this.address = [];
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
    selectArea(value) {
      this.listParams.storeAddressProvince = value[0] || '';
      this.listParams.storeAddressCity = value[1] || '';
      this.listParams.storeAddressCounty = value[2] || '';
    },
    add() {
      this.isEdit = false;
      this.editObj = null;
      this.SET_MODAL_VISIBLE(true);
    },
    editItem(obj) {
      this.isEdit = true;
      this.editObj = {
        ...obj,
        address: [obj.storeAddressProvince, obj.storeAddressCity, obj.storeAddressCounty],
        storeCapacity: parseInt(obj.storeCapacity, 10)
      };
      this.SET_MODAL_VISIBLE(true);
    },
    /**
     * @author: xh
     * @description: 禁用或者激活
     */
    forbiddenOrActiveItem(obj) {
      let that = this;
      const { id, state, deliveryStore } = obj;
      const operationText = state == '0' ? '禁用' : '激活';
      const serve =  state == '0' ? 'disableDeliveryStore' : 'activeDeliveryStore';
      this.$confirm(`确定要确定要${operationText}交割库${deliveryStore}?`, "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
      })
      .then(async () => {
        const response = await that.$api[serve]({ id });
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
      const serve = this.isEdit ? "updateDeliveryStore" : "addDeliveryStore";
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
    this.setYcData(); // 获取字典项数据
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
