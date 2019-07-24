<template>
  <div class="container single-page">
    <hlBreadcrumb :data="breadTitle"></hlBreadcrumb>
    <div class="form">
      <el-form ref="form" :rules="rules" :model="form" label-width="120px" size="small">
        <div class="form-block">
          <el-row>
            <el-col :md="12" :sm="12" :xs="24">
              <div class="head">基础信息</div>
            </el-col>
          </el-row>
          <el-row :gutter="50">
            <el-col :md="12" :sm="12" :xs="24">
              <el-form-item label="日期" prop="registerTime">
                <el-date-picker v-model="form.registerTime" type="date" placeholder="选择日期"></el-date-picker>
              </el-form-item>
            </el-col>
            <el-col :md="12" :sm="12" :xs="24">
              <el-form-item label="货主" prop="cargoId">
                <el-select v-model="form.cargoId" placeholder="请选择" size="small">
                  <el-option
                    v-for="(item,index) in cargoList"
                    :key="index"
                    :label="item.label"
                    :value="item.value"
                  ></el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="50">
            <el-col :md="12" :sm="12" :xs="24">
              <el-form-item label="入库类型" prop="incomingType">
                <el-select v-model="form.incomingType" placeholder="请选择" size="small">
                  <el-option
                    v-for="(item,index) in YcIncomingTypeList"
                    :key="index"
                    :label="item.label"
                    :value="item.value"
                  ></el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
        </div>
        <div class="form-block">
          <div class="head">商品信息</div>
          <el-row :gutter="50">
            <el-col :md="12" :sm="12" :xs="24">
              <el-form-item label="品名" prop="productNameId">
                <el-select v-model="form.productNameId" placeholder="请选择" size="small">
                  <el-option
                    v-for="(item,index) in productNameList"
                    :key="index"
                    :label="item.label"
                    :value="item.value"
                  ></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :md="12" :sm="12" :xs="24">
              <el-form-item label="材质" prop="materialId">
                <el-select v-model="form.materialId" placeholder="请选择" size="small">
                  <el-option
                    v-for="(item,index) in materialList"
                    :key="index"
                    :label="item.label"
                    :value="item.value"
                  ></el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="50">
            <el-col :md="12" :sm="12" :xs="24">
              <el-form-item label="规格" prop="specificationsId">
                <el-select v-model="form.specificationsId" placeholder="请选择" size="small">
                  <el-option
                    v-for="(item,index) in specificationsList"
                    :key="index"
                    :label="item.label"
                    :value="item.value"
                  ></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :md="12" :sm="12" :xs="24">
              <el-form-item label="产地" prop="originPlaceId">
                <el-select v-model="form.originPlaceId" placeholder="请选择" size="small">
                  <el-option
                    v-for="(item,index) in originPlaceList"
                    :key="index"
                    :label="item.label"
                    :value="item.value"
                  ></el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="50">
            <el-col :md="12" :sm="12" :xs="24">
              <el-form-item label="计量方式" prop="measuring">
                <el-select v-model="form.measuring" placeholder="请选择" size="small">
                  <el-option
                    v-for="(item,index) in YcMeasuringTypeList"
                    :key="index"
                    :label="item.label"
                    :value="item.value"
                  ></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :md="12" :sm="12" :xs="24">
              <el-form-item label="应收数量" prop="supposedNum">
                <el-input v-model.number="form.supposedNum" ></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="50">
            <el-col :md="12" :sm="12" :xs="24">
              <el-form-item label="重量单位" prop="weightUnit">
                <el-select v-model="form.weightUnit" placeholder="请选择" size="small">
                  <el-option
                    v-for="(item,index) in YcWeightUnitList"
                    :key="index"
                    :label="item.label"
                    :value="item.value"
                  ></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :md="12" :sm="12" :xs="24">
              <el-form-item label="应收重量" prop="supposedWeight">
                <el-input v-model="form.supposedWeight"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="50">
            <el-col :md="12" :sm="12" :xs="24">
              <el-form-item label="数量单位" prop="numUnit">
                <el-select v-model="form.numUnit" placeholder="请选择" size="small">
                  <el-option
                    v-for="(item,index) in YcNumUnitList"
                    :key="index"
                    :label="item.label"
                    :value="item.value"
                  ></el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
        </div>
        <div class="form-block">
          <div class="head">仓库信息</div>
          <el-row :gutter="50">
            <el-col :md="12" :sm="12" :xs="24">
              <el-form-item label="交易仓库" prop="deliveryStoreId">
                <el-select v-model="form.deliveryStoreId" placeholder="请选择" size="small">
                  <el-option
                    v-for="(item,index) in deliveryStoreList"
                    :key="index"
                    :label="item.label"
                    :value="item.value"
                  ></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :md="12" :sm="12" :xs="24">
              <el-form-item label="区桩位" prop="pilePositionId">
                <el-select v-model="form.pilePositionId" placeholder="请选择" size="small">
                  <el-option
                    v-for="(item,index) in pilePositionList"
                    :key="index"
                    :label="item.label"
                    :value="item.value"
                  ></el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
        </div>
        <div class="bottom">
          <el-form-item>
            <el-button type="primary" :loading="loading" @click="submitForm('form')">确定</el-button>
            <el-button @click="back">取消</el-button>
          </el-form-item>
        </div>
      </el-form>
    </div>
  </div>
</template>

<script>
import hlBreadcrumb from "@/components/hl-breadcrumb";
import Dict from "@/util/dict.js";
import { dictMixin } from "@/common/mixin.js";
import { _toArray_ } from "@/common/util";
import _ from "lodash";
const defualtFormParams = {
  registerTime: new Date(), // 登记日期
  cargoId: null, // 货主id
  incomingType: null, //入库类型
  productNameId: null, // 品名id
  materialId: null, // 材料id
  specificationsId: null, //规格id
  originPlaceId: null, //产地id
  deliveryStoreId: null, //交易仓库id
  pilePositionId: null, //区桩位id
  measuring: null, // 计量方式
  supposedNum: null, // 应收数量
  supposedWeight: null, // 应收重量
  weightUnit: null, // 数量单位
  numUnit: null // 重量单位
};

const RULES = {
  registerTime: [
    { required: true, message: "请输入登记日期", trigger: "blur" }
  ],
  cargoId: [{ required: true, message: "请输入货主", trigger: "blur" }],
  incomingType: [
    { required: true, message: "请选择入库类型", trigger: "blur" }
  ],
  productNameId: [{ required: true, message: "请选择品名", trigger: "blur" }],
  materialId: [{ required: true, message: "请选择材料", trigger: "blur" }],
  specificationsId: [
    { required: true, message: "请选择规格", trigger: "blur" }
  ],
  originPlaceId: [{ required: true, message: "请选择产地", trigger: "blur" }],
  deliveryStoreId: [
    { required: true, message: "请选择交易仓库", trigger: "blur" }
  ],
  pilePositionId: [
    { required: true, message: "请选择区桩位", trigger: "blur" }
  ],
  measuring: [{ required: true, message: "请选择计量方式", trigger: "blur" }],
  supposedNum: [
    { required: true, message: "请输入应收数量", trigger: "blur" },
    { pattern: /^[\d]{0,10}$/,message: '必须是正整数，最大10位', trigger: 'blur'},    
    ],
  supposedWeight: [
    { required: true, message: "请输入应收重量", trigger: "blur" },
    {max: 10, message: '最多10位', trigger: 'blur' },
    {  pattern: /^(?!0+(?:\.0+)?$)(?:[1-9]\d*|0)(?:\.\d{1,3})?$/, message: '正数可以包含3位小数'  },
  ],
  weightUnit: [{ required: true, message: "请选择数量单位", trigger: "blur" }],
  numUnit: [{ required: true, message: "请选择重量单位", trigger: "blur" }]
};

export default {
  name: "releaseNewCommodity",
  mixins: [dictMixin],
  components: {
    hlBreadcrumb
  },
  data() {
    return {
      loading: false,
      breadTitle: ["商品管理", "发布新商品"],
      form: { ...defualtFormParams },
      rules: RULES,
      productNameList: [],
      materialList: [],
      specificationsList: [],
      originPlaceList: [],
      pilePositionList: [],
      cargoList: [],
      deliveryStoreList: []
    };
  },
  methods: {
    back() {
      this.$router.push({
        path: "/web/cm/commodity/commodityOnSale/page"
      });
    },
    async _addStockRegister_(params) {
      this.loading = true;
      const res = await this.$api.addStockRegister(params);
      this.loading = false;
      switch (res.code) {
        case Dict.SUCCESS:
          this.$messageSuccess("入库登记成功");
          this.back();
          break;
        default:
          this.$messageError(res.mesg);
          break;
      }
    },
    _findName(arr = [], id) {
      let copy = _.clone(arr);
      const index = _.findIndex(copy, o => {
        return o.value == id;
      });
      if (index > -1) {
        return copy[index].label;
      } else {
        return null;
      }
    },
    _filter() {
      const params = _.clone(
        Object.assign(
          {},
          this.form,
          {
            productName: this._findName(
              this.productNameList,
              this.form.productNameId
            )
          },
          {
            materialName: this._findName(
              this.materialList,
              this.form.materialId
            )
          },
          {
            specificationsName: this._findName(
              this.specificationsList,
              this.form.specificationsId
            )
          },
          {
            originPlaceName: this._findName(
              this.originPlaceList,
              this.form.originPlaceId
            )
          },
          { cargoName: this._findName(this.cargoList, this.form.cargoId) },
          {
            deliveryStore: this._findName(
              this.deliveryStoreList,
              this.form.deliveryStoreId
            )
          },
          {
            pilePosition: this._findName(
              this.pilePositionList,
              this.form.pilePositionId
            )
          }
        )
      );
      return params;
    },
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          const params = this._filter();
          this._addStockRegister_(params);
        } else {
          return false;
        }
      });
    },
    /** 下拉品名*/
    async getSelectProducts() {
      const res = await this.$api.getProductNameData();
      switch (res.code) {
        case Dict.SUCCESS:
          this.productNameList = _toArray_(res.data);
          break;
        default:
          this.$messageError(res.mesg);
          break;
      }
    },
    /** 下拉材质*/
    async getMaterials(productNameId) {
      const res = await this.$api.getMaterialsData({ productNameId });
      switch (res.code) {
        case Dict.SUCCESS:
          this.materialList = _toArray_(res.data);
          break;
        default:
          this.$messageError(res.mesg);
          break;
      }
    },
    /** 下拉规格*/
    async getSpecs(productNameId, materialId) {
      const res = await this.$api.getSpecsData({ productNameId, materialId });
      switch (res.code) {
        case Dict.SUCCESS:
          this.specificationsList = _toArray_(res.data);
          break;
        default:
          this.$messageError(res.mesg);
          break;
      }
    },
    /** 下拉产地*/
    async getOriginPlaces(productNameId, materialId, specificationsId) {
      const res = await this.$api.getOriginPlacesData({
        productNameId,
        materialId,
        specificationsId
      });
      switch (res.code) {
        case Dict.SUCCESS:
          this.originPlaceList = _toArray_(res.data);
          break;
        default:
          this.$messageError(res.mesg);
          break;
      }
    },
    /** 下拉区桩位*/
    async getPilePositions(deliveryStoreId) {
      const res = await this.$api.getPilePositionsData(deliveryStoreId);
      switch (res.code) {
        case Dict.SUCCESS:
          this.pilePositionList = _toArray_(res.data);
          break;
        default:
          this.$messageError(res.mesg);
          break;
      }
    },
    /**下拉仓库*/
    async getdeliveryStores() {
      const res = await this.$api.getdeliveryStoresData();
      switch (res.code) {
        case Dict.SUCCESS:
          this.deliveryStoreList = _toArray_(res.data);
          break;
        default:
          this.$messageError(res.mesg);
          break;
      }
    },
    /** 下拉货主*/
    async _getAllBaseInfo() {
      const response = await this.$api.getAllBaseInfo();
      switch (response.code) {
        case Dict.SUCCESS:
          this.cargoList = _toArray_(response.data.cargoMap);
          break;
        default:
          break;
      }
    }
  },
  created() {
    let _this = this;
    this._getAllBaseInfo()
      .then(() => {
        _this.getSelectProducts();
      })
      .then(() => {
        _this.getdeliveryStores();
      });
  },
  watch: {
    "form.productNameId": {
      handler(newV, oldV) {
        if (newV !== oldV) {
          this.materialList = [];
          this.form.materialId = null;
          if (newV) {
            setTimeout(() => {
              this.getMaterials(newV);
            }, 20);
          }
        }
      }
    },
    "form.materialId": {
      handler(newV, oldV) {
        if (newV !== oldV) {
          this.specificationsList = [];
          this.form.specificationsId = null;
          if (newV) {
            setTimeout(() => {
              this.getSpecs(this.form.productNameId, newV);
            }, 20);
          }
        }
      }
    },
    "form.specificationsId": {
      handler(newV, oldV) {
        if (newV !== oldV) {
          this.originPlaceList = [];
          this.form.originPlaceId = null;
          if (newV) {
            setTimeout(() => {
              this.getOriginPlaces(
                this.form.productNameId,
                this.form.materialId,
                newV
              );
            }, 20);
          }
        }
      }
    },
    "form.deliveryStoreId": {
      handler(newV, oldV) {
        if (newV !== oldV) {
          this.pilePositionList = [];
          this.form.pilePositionId = null;
          if (newV) {
            setTimeout(() => {
              this.getPilePositions(newV);
            }, 20);
          }
        }
      }
    }
  }
};
</script>


<style scoped lang="less">
.form {
  padding: 30px 15px 50px 15px;
  .form-block {
    padding-bottom: 20px;
    .head {
      margin-bottom: 15px;
      font-size: 18px;
      font-weight: 700;
    }
  }
}
</style>
