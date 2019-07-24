<template>
  <div class="container single-page">
    <hlBreadcrumb :data="breadTitle"></hlBreadcrumb>
    <div class="form" v-if="form.needShowData.length">
      <el-form ref="form" :model="form" label-width="120px" size="small">
        <div class="form-block">
          <el-row>
            <el-col :md="12" :sm="12" :xs="24">
              <div class="head">过户信息</div>
            </el-col>
          </el-row>
          <el-row :gutter="50">
            <el-col :md="12" :sm="12" :xs="24">
              <el-form-item
                label="业务类型"
                prop="transferType"
                :rules="[{ required: true, message: '请选择业务类型'}]"
              >
                <el-select v-model="form.transferType" placeholder="请选择" size="small">
                  <el-option
                    v-for="(item,index) in typeDatas"
                    :key="index"
                    :label="item.label"
                    :value="item.value"
                  ></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :md="12" :sm="12" :xs="24">
              <el-form-item label="原货主" prop="originalShipperName">
                <el-input :value="form.originalShipperName" :disabled="disabled"></el-input>
              </el-form-item>
            </el-col>
            <el-col :md="12" :sm="12" :xs="24">
              <el-form-item
                label="新货主"
                prop="newShipperId"
                :rules="{ required: true, message: '请选择新货主'}"
              >
                <el-select v-model="form.newShipperId" placeholder="请选择" size="small">
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
        </div>
        <div class="form-block" v-for="(item,index) in form.needShowData" :key="item.id">
          <div class="head">库存信息</div>
          <el-row :gutter="50">
            <el-col :md="12" :sm="12" :xs="24">
              <el-form-item label="交易仓库" prop="deliveryStore">
                <el-input :value="item.deliveryStore" disabled="disabled"></el-input>
              </el-form-item>
            </el-col>
            <el-col :md="12" :sm="12" :xs="24">
              <el-form-item label="区桩位" prop="pilePosition">
                <el-input :value="item.pilePosition" disabled="disabled"></el-input>
              </el-form-item>
            </el-col>
            <el-col :md="12" :sm="12" :xs="24">
              <el-form-item label="层数" prop="piles">
                <el-input :value="item.piles" disabled="disabled"></el-input>
              </el-form-item>
            </el-col>
            <el-col :md="12" :sm="12" :xs="24">
              <el-form-item label="品名" prop="productName">
                <el-input :value="item.productName" disabled="disabled"></el-input>
              </el-form-item>
            </el-col>
            <el-col :md="12" :sm="12" :xs="24">
              <el-form-item label="材质" prop="materialName">
                <el-input :value="item.materialName" disabled="disabled"></el-input>
              </el-form-item>
            </el-col>
            <el-col :md="12" :sm="12" :xs="24">
              <el-form-item label="规格" prop="specificationsName">
                <el-input :value="item.specificationsName" disabled="disabled"></el-input>
              </el-form-item>
            </el-col>       
            <el-col :md="12" :sm="12" :xs="24">
              <el-form-item label="产地" prop="originPlaceName">
                <el-input :value="item.originPlaceName" disabled="disabled"></el-input>
              </el-form-item>
            </el-col>
            <el-col :md="12" :sm="12" :xs="24">
              <el-form-item label="库存数量" prop="totalNumInventory">
                <el-input :value="item.totalNumInventory" disabled="disabled"></el-input>
              </el-form-item>
            </el-col>
            <el-col :md="12" :sm="12" :xs="24">
              <el-form-item label="库存重量" prop="totalWeightInventory">
                <el-input :value="item.totalWeightInventory" disabled="disabled"></el-input>
              </el-form-item>
            </el-col>                    
            <el-col :md="12" :sm="12" :xs="24">
              <el-form-item label="计量方式" prop="measuringText">
                <el-input :value="item.measuringText" disabled="disabled"></el-input>
              </el-form-item>
            </el-col>
            <el-col :md="12" :sm="12" :xs="24">
              <el-form-item label="数量单位" prop="numUnitText">
                <el-input :value="item.numUnitText" disabled="disabled"></el-input>
              </el-form-item>
            </el-col>
            <el-col :md="12" :sm="12" :xs="24">
              <el-form-item label="重量单位" prop="weightUnitText">
                <el-input :value="item.weightUnitText" disabled="disabled"></el-input>
              </el-form-item>
            </el-col>
          </el-row>  
          <div class="head">出库信息</div>
          <el-row :gutter="50">
            <el-col :md="12" :sm="12" :xs="24">
              <el-form-item
                label="过户数量"
                :prop="'needShowData.' + index + '.transferNums'"
                :rules="validatenum(item.availableNumInventory)"
              >
                <el-input v-model.number="item.transferNums"></el-input>
              </el-form-item>
            </el-col>
            <el-col :md="12" :sm="12" :xs="24">
              <el-form-item
                label="过户重量"
                :prop="'needShowData.' + index + '.transferWeights'"
                :rules="validateweight(item.availableWeightInventory,max)"
              >
                <el-input v-model="item.transferWeights"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="50" v-if="form.needShowData&&form.needShowData.length===1">
            <el-col :offset="12" :md="12" :sm="12" :xs="24">
              <span
                style="color:red;font-size:12px;margin-left:45px;padding-bottom:4px;"
              >最大过户量:{{max}}</span>
            </el-col>
          </el-row>
        </div>
        <div class="bottom">
          <el-form-item>
            <el-button
              type="primary"
              :loading="loading"
              size="medium"
              @click="submitForm('form')"
            >确定</el-button>
            <el-button size="medium" @click="back">取消</el-button>
          </el-form-item>
        </div>
      </el-form>
    </div>
  </div>
</template>

<script>
import { mapState } from "vuex";
import hlBreadcrumb from "@/components/hl-breadcrumb";
import Dict from "@/util/dict.js";
import { baseMixin } from "@/common/mixin.js";
import _ from "lodash";
import { DICT_SELECT_ARR } from "@/common/util";
const TypeDatas = DICT_SELECT_ARR(Dict.TRANSFER_OWNERSHIP_BUSINESS_TYPE);
const defualtFormParams = {
  transferType: null,
  newShipperId: null,
  originalShipperName: null
};

export default {
  name: "transferOwnershipManage",
  mixins: [baseMixin],
  components: {
    hlBreadcrumb
  },
  data() {
    return {
      loading: false,
      breadTitle: ["仓储管理", "库存明细", "过户管理"],
      disabled: true,
      form: {
        needShowData: [],
        ...defualtFormParams
      },
      typeDatas: TypeDatas,
      max: null // 从库存明细页跳转过来,会另外带来最大重量的限制
    };
  },
  computed: {
    ...mapState("inventoryManage", ["transferOwnership"])
  },
  methods: {
    back() {
      this.$router.push({
        path: "/web/yc/storage/stockInventory/page"
      });
    },
    validateweight(weight, max = null) {
      return [
        {
          required: true,
          message: "请输入过户重量",
          trigger: "blur"
        },
        {  max: 10, 
           message: '最多10位',
           trigger: 'blur'
        },
        { 
          pattern: /^(?!0+(?:\.0+)?$)(?:[1-9]\d*|0)(?:\.\d{1,3})?$/,
          message: '正数可以包含3位小数'
        },        
        {
          validator(rule, value, callback) {
            if (max) {
              weight = max;
            }
            if (value > weight) {
              callback(new Error(`不能大于${weight}`));
            }
            callback();
          }
        }
      ];
    },
    validatenum(num) {
      return [
        {
          validator(rule, value, callback) {
            if (!value) {
              callback();
            }
            if (value > num) {
              callback(new Error(`不能大于${num}`));
            }
            callback();
          }
        }
      ];
    },
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          const params = this._serialize_();
          this._doTransfer_(params);
        } else {
          return false;
        }
      });
    },
    async _doTransfer_(params) {
      this.loading = true;
      const res = await this.$api.DoTransfer(params);
      this.loading = false;
      switch (res.code) {
        case Dict.SUCCESS:
          this.$messageSuccess("过户成功");
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
    _serialize_() {
      const newShipperName = this._findName(
              this.cargoList,
              this.form.newShipperId
            )
      const {
        newShipperId,
        originalShipperId,
        originalShipperName,
        transferType
      } = this.form;
      const params = this.form.needShowData.map((item, index) => {
        return Object.assign(
          {},
          {
            newShipperId,
            newShipperName,
            originalShipperId,
            originalShipperName,
            transferType
          },
          { stockId: this.transferOwnership[index].stockId },
          { realTransferNums: item.transferNums },
          { realTransferWeights: item.transferWeights },
          item
        );
      });
      return params;
    },
    async _getTransferAvailable_(arr) {
      const res = await this.$api.getTransferAvailable({
        cargoId: arr[0].cargoId,
        stockId: arr[0].id
      });
      switch (res.code) {
        case Dict.SUCCESS:
          this.max = Number(res.data);
          break;
        default:
          this.max = null;
          this.$messageError(res.mesg);
          break;
      }
    },
    async init() {
      if (this.transferOwnership.length === 0) {
        this.back();
        return;
      }
      let res = await this.$api.getInventoryTransferinfo(
        this.transferOwnership
      );
      switch (res.code) {
        case Dict.SUCCESS:
          if (res.data.length === 1) {
            this._getTransferAvailable_(res.data);
          }
          res.data = res.data.slice().map(item => {
            return Object.assign({}, item, {
              measuringText:item.measuringTypeEnum && item.measuringTypeEnum.text || "-",
              numUnitText:item.numUnitTypeEnum && item.numUnitTypeEnum.text || "-",
              weightUnitText:item.weightUnitTypeEnum && item.weightUnitTypeEnum.text || "-",
              transferNums: null,
              transferWeights: null
            });
          });
          this.form = Object.assign(
            {},
            {
              originalShipperId: res.data[0].cargoId,
              originalShipperName: res.data[0].cargoName
            },
            { needShowData: res.data }
          );
          break;
        default:
          this.$messageError(res.mesg);
          break;
      }
    }
  },
  created() {
    this.init();
  }
};
</script>
>

<style scoped lang="less">
.form {
  padding: 15px 15px 50px 15px;
  background: rgba(240, 242, 245, 1);
  .form-block {
    padding-top: 15px;
    margin-bottom: 15px;
    background: white;
    .head {
      padding-left: 10px;
      margin-bottom: 15px;
      font-size: 18px;
      font-weight: 700;
    }
  }
  .bottom {
    padding: 15px 0px 1px 0px;
    background: white;
  }
}
</style>
