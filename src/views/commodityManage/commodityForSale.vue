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
      <!-- <el-button
        type="primary"
        plain
        size="small"
        @click="GoReleaseNewCommodity"
        icon="el-icon-plus"
      >发布新商品</el-button> -->
      <el-button
        type="primary"
        plain
        size="small"
        @click="shelves(null)"
        :disabled="!selectedItems.length"
        icon="el-icon-download"
      >上架</el-button>
    </HletongBreadcrumb>
    <div class="search-box">
      <div class="form-item">
        <label>品类</label>
        <div class="form-control">
          <el-select v-model="form.firstCatalogId" placeholder="请选择" size="small">
            <el-option
              v-for="(item,index) in firstClassList"
              :key="index"
              :label="item.name"
              :value="item.id"
            ></el-option>
          </el-select>
        </div>
      </div>
      <div class="form-item">
        <label>牌号</label>
        <div class="form-control">
          <el-select v-model="form.secondCatalogId" placeholder="请选择" size="small">
            <el-option
              v-for="(item,index) in secondClassList"
              :key="index"
              :label="item.name"
              :value="item.id"
            ></el-option>
          </el-select>
        </div>
      </div>
      <div class="form-item">
        <label>商品编码</label>
        <div class="form-control">
          <el-input v-model="form.productNumber" placeholder="请输入内容" size="small"></el-input>
        </div>
      </div>
      <div class="form-item">
        <label>售价</label>
        <div class="form-control">
          <priceRange :low="form.startPrice" :high="form.endPrice" @lowest="getlow" @highest="gethigh" ></priceRange>
          <!-- <el-input v-model="form.startPrice" placeholder="最低价" size="small"></el-input>至
          <el-input v-model="form.endPrice" placeholder="最高价" size="small"></el-input> -->
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
    <HletongTable
      ref="tb"
      @pageChange="changePage"
      :total="listData.paginator.totalCount"
      :currentPage="listParams.page"
      :pageSize="listParams.pageSize"
      :pageSizes="[5]"
      :data="listData.list"
      :multiple="true"
      :blankCol="false"
      @selection-change="selectChange"
      :loading="isListDataLoading"
    >
      <el-table-column label="商品信息" width="500px" align="left">
        <template slot-scope="scope">
          <div class="goods">
            <div class="avatar">
              <img
                v-if="listData.list[scope.$index].picUrl"
                width="65"
                height="64"
                :src="listData.list[scope.$index].picUrl"
              />
              <span v-else>未设置图片</span>
            </div>
            <div class="goods-content">
              <div class="productName">
                <span
                  class="notyc"
                >{{listData.list[scope.$index].firstCatalogName+listData.list[scope.$index].secondCatalogName+listData.list[scope.$index].emissionStandardEnum.text || '-'}}</span>
                <span class="yc" v-if="listData.list[scope.$index].isYC === Dict.IS_YC">云仓</span>
                <span class="yc" v-if="listData.list[scope.$index].isYC !== Dict.IS_YC">期货</span>
              </div>
              <div class="productNumber">商品编码:{{listData.list[scope.$index].productNumber}}</div>
            </div>
          </div>
        </template>
      </el-table-column>

      <el-table-column label="售价" width="200px" align="center">
        <template slot-scope="scope">
          <div class="price">
            {{listData.list[scope.$index].price}}
            <i
              v-if="listData.list[scope.$index].isYC !== Dict.IS_YC"
              @click="open(listData.list[scope.$index])"
              class="el-edit"
            ></i>
            <i
              v-if="listData.list[scope.$index].isYC === Dict.IS_YC"
              @click="editItem(listData.list[scope.$index])"
              class="el-edit"
            ></i>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="库存" width="200px" align="center">
        <template slot-scope="scope">
          <div class="price">
            {{listData.list[scope.$index].totalWeightInventory}}
            <i
              v-if="listData.list[scope.$index].isYC !== Dict.IS_YC"
              @click="open(listData.list[scope.$index])"
              class="el-edit"
            ></i>
            <i
              v-if="listData.list[scope.$index].isYC === Dict.IS_YC"
              @click="editItem(listData.list[scope.$index])"
              class="el-edit"
            ></i>
          </div>
        </template>
      </el-table-column>

      <el-table-column
        :align="item.align || 'center'"
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
          <el-button type="text"  v-if="listData.list[scope.$index].isYC !== Dict.IS_YC"   @click="GoEditOldCommodity(listData.list[scope.$index])">编辑商品</el-button>
          <el-button type="text" @click="shelves(listData.list[scope.$index])">上架</el-button>
          <el-button type="text" @click="completelyDel(listData.list[scope.$index])">删除</el-button>
        </template>
      </el-table-column>
    </HletongTable>
    <pricedialog
      :title="editProductName"
      :priceLoading="priceLoading"
      :visible="priceVisible"
      :priceObj="priceObj"
      :cancleCb="()=>{this.priceVisible = false}"
      :confirmCb="(data)=>{this.updatePrice(data)}"
    ></pricedialog>
    <releaseInventoryModal
      :cancleCb="cancleCb"
      :confirmCb="(obj)=>{this.releaseGoods(obj)}"
      :releaseLoading="priceLoading"
      :visible="visible"
      :title="title"
      :releaseObj="releaseObj"
    >
    </releaseInventoryModal>
  </div>
</template>

<script>
import { mapMutations } from "vuex";
import { classMixin } from "@/common/mixin.js";
import _ from "lodash";
// import { judgeAuth } from "@/util/util.js";
import Dict from "@/util/dict.js";
// import heltable from "@/components/hl_table";
import priceRange from "@/components/priceRange";
import pricedialog from "./pricedialog.vue";
import releaseInventoryModal from "./releaseInventoryModal.vue";
import { number3 } from "util/validate.js";

const defaultFormData = {
  firstCatalogId: null,
  secondCatalogId: null,
  productNumber: null,
  startPrice: "",
  endPrice: ""
};
const defaultListParams = {
  pageSize: 5,
  page: 1,
  sellState: Dict.SELL_STATUS_OFF
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
    prop: "volumeWeightSold",
    label: "总销量",
  },
  {
    prop: "createdTime",
    label: "发布时间"
  }
];

export default {
  name: "commodityForSale",
  mixins: [classMixin],
  components: {
    // heltable,
    pricedialog,
    releaseInventoryModal,
    priceRange
  },
  data() {
    return {
      breadTitle: ["商品管理", "待售中的商品"],
      isListDataLoading: false,
      listParams: { ...defaultListParams }, // 页数
      form: { ...defaultFormData }, // 查询参数
      listData: { ...defaultListData }, // 返回list的数据结构
      tableHeader: defaulttableHeader,
      showOverflowTooltip: true,
      selectedItems: [],
      Dict: Dict,
      /*****云仓弹窗的*****/
      visible:false,
      releaseObj:Object.create(null),
      title:'修改',

      /*****期货弹窗的*****/
      priceVisible:false,
      editProductName: "编辑修改",
      priceLoading: false, 
      priceObj:Object.create(null) 

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
    ...mapMutations("releaseNewCommodity", ["setIsEdit", "setCommodityId","setCommodityObj"]),
    cancleCb(){
      this.releaseObj = Object.create(null);
      this.visible = false;
    },
    async editItem(obj){
      const {id} = obj
      const res = await this.$api.ycProductDetail(id);
      switch (res.code) {
        case Dict.SUCCESS:
          this.releaseObj = res.data
          this.visible = true
          break;
        default:
          this.$messageError(res.mesg);
          break;
      }      
    },
    selectChange(selection) {
      this.selectedItems = selection.slice();
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
    _filter() {
      const { startPrice, endPrice } = this.form;
      if (!startPrice && !endPrice) {
        return true;
      }
      if (!startPrice && endPrice) {
        this.$messageError("最低价应填");
        return false;
      }
      if (startPrice && !endPrice) {
        this.$messageError("最高价应填");
        return false;
      }
      if (number3(startPrice) && number3(endPrice)) {
        if (Number(endPrice) >= Number(startPrice)) {
          return true;
        } else {
          this.$messageError("最高价必须大于或等于最低价");
          return false;
        }
      } else {
        this.$messageError("价格必须是正数可以包含3位小数");
        return false;
      }
    },
    async getListData() {
      const flag = this._filter();
      if (!flag) return;
      this.isListDataLoading = true;
      const res = await this.$api.getCommodityForSaleList({
        ...this.form,
        ...this.listParams
      });
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
    open(item) {
      const {
        id,
        price,
        totalWeightInventory,
        firstCatalogName,
        secondCatalogName,
        emissionStandardEnum,
        productNumber
      } = item;
      this.editProductName = `编辑商品${firstCatalogName +
        secondCatalogName +
        emissionStandardEnum.text},编码为${productNumber}`;
      this.priceObj = {id, price, totalWeightInventory};
      this.priceVisible = true;
    },
    GoReleaseNewCommodity() {
      this.$router.push({
        path: "/web/hyw/product/product/deploy"
      });
    },
    GoEditOldCommodity(item) {
      const { id,deliveryStore,deliveryStoreId } = item;
      this.setIsEdit(true);
      this.setCommodityId(id);
      this.setCommodityObj({ id,deliveryStore,deliveryStoreId})
      this.$router.push({
        path: "/web/hyw/product/product/update"
      });
    },
    shelves(item = null) {
      let that = this;
      let params, productNumber, info;
      const url = "batchUpdateCommodity";
      if (item) {
        params = [{ id: item.id, sellState: Dict.SELL_STATUS_ON }];
        productNumber = item.productNumber;
      } else {
        params = this.ids.map(item => {
          return { id: item, sellState: Dict.SELL_STATUS_ON };
        });
        productNumber = this.productNumbers.join();
      }
      info = `商品编码${productNumber}`;
      this.$confirm(`确定要上架${info}`, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(async () => {
        const res = await that.$api[url](params);
        switch (res.code) {
          case Dict.SUCCESS:
            that.$messageSuccess(`上架成功`);
            that.getListData();
            break;
          default:
            that.$messageError(`上架失败,${res.mesg}`);
            break;
        }
      });
    },
    async updatePrice(data) {
      this.priceLoading = true;
      const res = await this.$api.updatePriceAndInventory(data);
      this.priceLoading = false;
      switch (res.code) {
        case Dict.SUCCESS:
          this.$messageSuccess(`修改成功`);
          this.priceVisible = false;
          this.getListData();
          break;
        default:
          this.$messageError(res.mesg);
          break;
      }
    },
    completelyDel(item = null) {
      let that = this;
      let params, productNumber, info;
      if (item) {
        params = [{ id: item.id, isDeleted: Dict.DELETE_NORMAL}];
        productNumber = item.productNumber;
      } else {
        params = this.ids.map(item => {
          return { id: item, isDeleted: Dict.DELETE_NORMAL};
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
            that.$messageError(`删除成功,${res.mesg}`);
            break;
        }
      });
    },
    async releaseGoods(obj) {
      const {weightInventory} = obj
      this.priceLoading = true;
      obj.totalWeightInventory = weightInventory;
      const res = await this.$api.updatePriceAndInventory(obj);
      this.priceLoading = false;
      switch (res.code) {
        case Dict.SUCCESS:
          this.$messageSuccess("修改成功");
          this.cancleCb();
          this.getListData();
          break;
        default:
          this.$messageError(res.mesg);
          break;
      }
    },
    getlow(number){
      this.form.startPrice = number
    },
    gethigh(number){
      this.form.endPrice = number
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
  },
  watch: {
    "form.firstCatalogId": {
      handler(newV, oldV) {
        if (newV !== oldV) {
          this.form.secondCatalogId = null;
          if (newV) {
            const index = _.findIndex(this.firstClassList, o => {
              return o.id == newV;
            });
            this.secondClassList = this.firstClassList[index].children;
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

.goods {
  position: relative;
  padding: 9px 10px 11px 15px;
  font-size: 0px;
  .avatar {
    display: inline-block;
    vertical-align: top;
    img {
      border-radius: 2px;
    }
  }
  .goods-content {
    display: inline-block;
    vertical-align: top;
    margin-left: 15px;
    height: 76px;
    .productName {
      font-size: 12px;
      color: #3c8bff;
      .notyc {
        display: inline-block;
      }
      .yc {
        margin-left: 15px;
        text-align: center;
        color: #fff;
        display: inline-block;
        width: 40px;
        height: 18px;
        line-height: 18px;
        background: #ffa715;
        border-radius: 4px;
      }
    }
    .productNumber {
      font-size: 12px;
      color: #333;
    }
  }
}

.price {
  text-align: center;
}

.el-edit {
  display:inline-block;
  width:14px;
  height:14px;
  vertical-align: sub;
  margin-left:5px;
  background: url("./edit.png");
  &:hover {
    cursor: pointer;
  }
}
</style>
