<template>
  <div class="container single-page" style="position:relative">
    <HletongBreadcrumb :data="breadTitle"></HletongBreadcrumb>
    <div class="computedHeight">
      <div class="form">
        <el-form ref="form" :model="form" label-width="125px" size="small">
          <div class="form-block">
            <div class="head">商品信息</div>
            <el-row>
              <el-col :xl="8" :lg="12" :md="24" :sm="24" :xs="24">
                <el-form-item
                  label="一级目录"
                  prop="firstCatalogId"
                  :rules="[{ required: true, message: '必选'  }]"
                >
                  <el-select v-model="form.firstCatalogId" placeholder="请选择" size="small">
                    <el-option
                      v-for="(item,index) in firstClassList"
                      :key="index"
                      :label="item.name"
                      :value="item.id"
                    ></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :xl="8" :lg="12" :md="24" :sm="24" :xs="24">
                <el-form-item
                  label="二级目录"
                  prop="secondCatalogId"
                  :rules="[{ required: true, message:'必选'  }]"
                >
                  <el-select v-model="form.secondCatalogId" placeholder="请选择" size="small">
                    <el-option
                      v-for="(item,index) in secondClassList"
                      :key="index"
                      :label="item.name"
                      :value="item.id"
                    ></el-option>
                  </el-select>
                </el-form-item>
              </el-col>

              <el-col :xl="8" :lg="12" :md="24" :sm="24" :xs="24">
                <el-form-item
                  label="交割库"
                  prop="deliveryStoreId"
                  :rules="[{ required: true, message: '必须选择一个交割库'}]"
                >
                  <deliveryStoreglass ref="deliveryStoreglass"  @deliveryStoreSelect="_getDeliveryStoreInfo" :disabled="isEdit"></deliveryStoreglass>
                  <el-input type="hidden" :value="form.deliveryStoreId" style="display:inline;height:0"></el-input>
                </el-form-item>
              </el-col>


              <el-col :xl="8" :lg="12" :md="24" :sm="24" :xs="24">
                <el-form-item
                  label="商品价格(元/吨)"
                  prop="price"
                  :rules="[{ required: true, message: '必填' }]"
                >
                  <el-input v-model="form.price"></el-input>
                </el-form-item>
              </el-col>
              <el-col :xl="8" :lg="12" :md="24" :sm="24" :xs="24">
                <el-form-item
                  label="库存(吨)"
                  prop="totalWeightInventory"
                  :rules="[{ required: true, message: '必填', trigger: 'blur'},
                        { pattern: /^[1-9][0-9]{0,3}$/,message: '只能输入1-9999'}]"
                >
                  <el-input v-model="form.totalWeightInventory"></el-input>
                </el-form-item>
              </el-col>

              <el-col :xl="8" :lg="12" :md="24" :sm="24" :xs="24">
                <el-form-item
                  label="需缴纳保证金"
                  prop="leastPrice"
                  :rules="validNeed(cautionMoneny)"              
                >
                {{form.leastPrice}}  <span style="margin-left:100px">(可用保证金余额:{{cautionMoneny}}元)</span>
                <el-input type="hidden" :value="form.leastPrice" style="display:inline;height:0"></el-input>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :xl="8" :lg="12" :md="24" :sm="24" :xs="24">
                <el-form-item
                  label="上传图片"
                  prop="fileId"
                  :rules="[{ required: true, message: '请正确上传图片' }]"
                >
                  <div class="imgBox" v-show="form.fileId">
                    <ImageBox :url="url" :onDelete="uploadDelete"></ImageBox>
                  </div>
                  <div class="imgBox" v-show="!(form.fileId)">
                    <ImageUpload :onSuccess="(file)=>{this.uploadSuceess(file)}"></ImageUpload>
                    <div
                      style="display:inline-block;vertical-align:text-bottom;font-size:12px;color:#333;margin-left:10px;"
                    >尺寸最大800*800。图片大小小于3M</div>
                  </div>
                  <el-input type="hidden" :value="form.fileId" style="display:inline;height:0"></el-input>
                </el-form-item>
              </el-col>
            </el-row>
          </div>
          <div class="form-block">
            <div class="head">销售状态</div>
            <el-row>
              <el-col :xl="8" :lg="12" :md="24" :sm="24" :xs="24">
                <el-form-item
                  label="销售状态"
                  prop="sellState"
                  :rules="[{ required: true, message: '必填' }]"
                >
                  <el-radio
                    v-for="item in SellStateList"
                    :key="item.id"
                    v-model="form.sellState"
                    :label="item.id"
                  >放入{{item.name}}</el-radio>
                </el-form-item>
              </el-col>
            </el-row>
          </div>
          <div class="form-block">
            <div class="head">参数信息</div>
            <div id="parameterList" v-show="form.parameterList.length">
              <el-row>
                <el-col
                  :xl="8"
                  :lg="12"
                  :md="24"
                  :sm="24"
                  :xs="24"
                  v-for="(item, index) in form.parameterList"
                  :key="item.id"
                >
                  <el-form-item
                    :label="item.paraName"
                    :prop="'parameterList.' + index + '.paraValue'"
                    :rules="{required: true, message: '必填', trigger: 'blur'}"
                  >
                    <el-input v-model="item.paraValue"></el-input>
                  </el-form-item>
                </el-col>
              </el-row>
            </div>
          </div>
        </el-form>
      </div>
    </div>
    <div class="bottom">
      <el-button
        type="primary"
        size="small"
        :loading="loading"
        v-if="auth"
        @click="submitForm('form')"
      >发布</el-button>
    </div>
  </div>
</template>

<script>
import { mapState, mapMutations } from "vuex";
import { classMixin } from "@/common/mixin.js";
import ImageBox from "components/ImageBox";
import ImageUpload from "components/ImageUpload";
import deliveryStoreglass from "components/deliveryStoreglass"
import Dict from "util/dict.js";
import areaData from "components/areaData.js";
import _ from "lodash";
import { judgeAuth } from "util/util.js";
import {num2,num9999} from "util/reg.js"
import { DICT_SELECT_ARR } from "common/util.js";
import NP from "number-precision";


const SellStateList = DICT_SELECT_ARR(Dict.SELL_STATE);

const ProvinceDataList = areaData.map(item => {
  return {
    name: item.value
  };
});

const defualtFormParams = {
  fileId: null, // 图片上传成功后返回的id
  firstCatalogId: null,
  secondCatalogId: null,
  
  deliveryStoreId:null, // 交割库Id
  storeInventoryName:null, // 交割库名称
  deliveryStore:null, // 交割库地址

  price: null,
  totalWeightInventory: null,
  leastPrice : 0,
  sellState: Dict.SELL_FOR_SALE,
  parameterList: []
};

/***系数***/
const RATIO = 1;


export default {
  name: "commodityForm",
  mixins: [classMixin],
  components: {
    ImageBox,
    ImageUpload,
    deliveryStoreglass
  },
  data() {
    return {
      // 权限
      hywGoodAdd: false,
      hywGoodEdit: false,
      loading: false,
      url: "#", // 后台改成上传成功后返回的url
      form: { ...defualtFormParams },
      paramsList: [],
      /**参数列表一般是由一牌号决定，但是编辑页面一开始进入的时候是唯一的外部触发*/
      ExternalTrigger: false,
      reservaSecondClassId: null,
      ProvinceDataList,
      SellStateList,
      /***最低保证金**/
      cautionMoneny:0
    };
  },
  computed: {
    ...mapState("releaseNewCommodity", ["isEdit", "commodityId","commodityObj"]),

    breadTitle() {
      return this.isEdit
        ? ["商品管理", "编辑商品"]
        : ["商品管理", "期货发布"];
    },
    auth() {
      if (this.isEdit) {
        return this.hywGoodEdit;
      } else {
        return this.hywGoodAdd;
      }
    }
  },
  methods: {
    ...mapMutations("releaseNewCommodity", ["setIsEdit", "setCommodityId"]),
    back() {
      this.$router.push({
        path: "/web/hyw/product/product/deploy"
      });
    },
    GoOnSale() {
      this.$router.push({
        path: "/web/hyw/product/product/pageOnSale"
      });
    },
    GoForSale() {
      this.$router.push({
        path: "/web/hyw/product/product/pageForSale"
      });
    },
    async _addCommodity_(params) {
      this.loading = true;
      const res = await this.$api.addCommodity(params);
      this.loading = false;
      switch (res.code) {
        case Dict.SUCCESS:
          this.$messageSuccess("新增商品成功");
          if (this.form.sellState === "0") {
            this.GoOnSale();
          } else {
            this.GoForSale();
          }
          break;
        default:
          this.$messageError(res.mesg);
          break;
      }
    },
    async _updateCommodity_(params) {
      this.loading = true;
      const res = await this.$api.updateCommodity(params);
      this.loading = false;
      switch (res.code) {
        case Dict.SUCCESS:
          this.$messageSuccess("编辑商品成功");
          if (this.form.sellState === "0") {
            this.GoOnSale();
          } else {
            this.GoForSale();
          }
          break;
        default:
          this.$messageError(res.mesg);
          break;
      }
    },
    _findName(arr = [], id) {
      let copy = _.clone(arr);
      const index = _.findIndex(copy, o => {
        return o.id == id;
      });
      if (index > -1) {
        return copy[index].name;
      } else {
        return null;
      }
    },
    _filter() {
      let params = _.clone(
        Object.assign(
          {},
          this.form,
          {
            firstCatalogName: this._findName(
              this.firstClassList,
              this.form.firstCatalogId
            )
          },
          {
            secondCatalogName: this._findName(
              this.secondClassList,
              this.form.secondCatalogId
            )
          },
          { url: this.url },
          {
            sellStateEnum: null
          }
        )
      );
      if (params.hasOwnProperty("manufacturerId_")) {
        delete params.manufacturerId_;
      }
      return params;
    },
    uploadSuceess(res) {
      this.url = res.data.url;
      this.form.fileId = res.data.id;
    },
    uploadDelete() {
      this.url = "#";
      this.form.fileId = null;
    },
    _getDeliveryStoreInfo(obj){
        this.form.deliveryStoreId = obj.id;
        this.form.storeInventoryName = obj.deliveryStore;
        this.form.deliveryStore = obj.storeAddress;
    },
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          const params = this._filter();
          if (this.isEdit) {
            this._updateCommodity_(params);
          } else {
            this._addCommodity_(params);
          }
        } else {
          return false;
        }
      });
    },
    async _getParameter(id) {
      const res = await this.$api.getParameterById(id);
      switch (res.code) {
        case Dict.SUCCESS:
          this.paramsList = _.cloneDeep(res.data); // 万一以后有用
          this.form.parameterList = res.data.map(item => {
            return { ...item, paraValue: "" };
          });
          break;
        default:
          this.$messageError(res.mesg);
          break;
      }
    },
    async _getDetailCommodity(id) {
      const res = await this.$api.getDetailCommodity({ id });
      switch (res.code) {
        case Dict.SUCCESS:
          this.url = res.data.picUrl || "#";
          this.reservaSecondClassId = _.cloneDeep(res.data.secondCatalogId);
          this.form = { ...res.data, secondCatalogId: null };
          break;
        default:
          this.$messageError(res.mesg);
          break;
      }
    },
    async _getFilesInfo(fileId) {
      const res = await this.$api.getFilesInfo({ fileId });
      switch (res.code) {
        case Dict.SUCCESS:
          this.url = res.data.url;
          break;
        default:
          this.$messageError(res.mesg);
          break;
      }
    },
    async _cautionMoneny() {
      const res = await this.$api.cautionMoneny();
      switch (res.code) {
        case Dict.SUCCESS:
          this.cautionMoneny = res.data;
          break;
        default:
          this.$messageError(res.mesg);
          break;
      }
    },
    validNeed(cautionMoneny) {
      return [
        {
          validator(rule, value, callback) {
            if(cautionMoneny === 0) {
              callback("可用保证金额余额为零,请充值保证金");
            }
            if(value) {
              if(NP.times(value,RATIO) > Number(cautionMoneny)) {
                callback("已超出可用保证金额度,请充值保证金,或减少发布货源量");
              }
            }
            callback();
          }
        }
      ];
    },
    perm() {
      this.hywGoodAdd = judgeAuth("hyw:productadd");
      this.hywGoodEdit = judgeAuth("hyw:productupdate");
    },
    init() {
      setTimeout(() => {
        this.perm();
      }, 20);
    }
  },
  mounted() {
    if (this.isEdit && this.commodityId) {
      this.ExternalTrigger = true;
      let {deliveryStore,deliveryStoreId} = this.commodityObj
      this.form.deliveryStoreId = deliveryStoreId;
      this.$refs.deliveryStoreglass.setDeliveryValue(deliveryStore);
      this._getClass().then(() => {
        this._getDetailCommodity(this.commodityId);
      });
    } else {
      if (this.$route.name === "editOldCommodity") {
        this.back();
      }
    }
    this.init();
  },
  created() {
    this._cautionMoneny();
  },
  beforeDestroy() {
    this.setIsEdit(false);
    this.setCommodityId(null);
  },
  watch: {
    "form.firstCatalogId": {
      handler(newV, oldV) {
        if (newV !== oldV) {
          if (newV) {
            const index = _.findIndex(this.firstClassList, o => {
              return o.id == newV;
            });
            this.secondClassList = this.firstClassList[index].children;
            if (this.ExternalTrigger) {
              this.form.secondCatalogId = this.reservaSecondClassId;
            } else {
              this.form.secondCatalogId = null;
            }
          }
        }
      }
    },
    "form.secondCatalogId": {
      handler(newV, oldV) {
        if (!newV) {
          setTimeout(() => {
            this.form.parameterList = [];
          }, 20);
          return;
        }
        if (this.ExternalTrigger) {
          this.ExternalTrigger = false;
          return;
        }
        if (newV !== oldV) {
          this._getParameter(newV);
        }
      }
    },
    "form.fileId": {
      handler(newV, oldV) {
        if (newV) {
          if (newV !== oldV && this.url === "#") {
            this._getFilesInfo(newV);
          }
        }
      }
    },
    "form.price":{
      handler(newV, oldV) {
        const {totalWeightInventory} = this.form;
        if(!newV){
          this.form.leastPrice = null
          return
        }
        if(!totalWeightInventory || !num9999(totalWeightInventory)) {
          this.form.leastPrice = null
          return
        }
        if (newV !== oldV && num2(newV)) {
            this.form.leastPrice = NP.times(newV, totalWeightInventory);
        }else {
            this.form.leastPrice = null
        }
        
      }      
    },
    "form.totalWeightInventory":{
      handler(newV, oldV) {
        const {price} = this.form;
        if(!newV){
          this.form.leastPrice = null
          return
        }
        if(!price || !num2(price)) {
          this.form.leastPrice = null
          return
        }
        if (newV !== oldV && num9999(newV)) {
            this.form.leastPrice = NP.times(newV, price);
        }else {
            this.form.leastPrice = null
        }
      }      
    }


  }
};
</script>


<style scoped lang="less">
.computedHeight {
  height: calc(100% - 101px);
  overflow: auto;
  .form {
    .form-block {
      padding: 20px;
      .head {
        margin-bottom: 20px;
        padding-left: 20px;
        height: 40px;
        line-height: 40px;
        font-size: 14px;
        color: #333333;
        background: #f6f8fa;
      }
    }
  }
}
.bottom {
  position: fixed;
  width: 86%;
  bottom: 20px;
  height: 50px;
  background-color: #f6f8fa;
  margin-left: 20px;
  box-shadow: 0 -1px 4px 0 hsla(0, 0%, 80%, 0.5);
  .el-button {
    min-width: 64px;
    margin-left: 20px;
    margin-top: 10px;
  }
}
</style>
