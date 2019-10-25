<template>
  <el-dialog :show-close="false" :title="title" :close-on-click-modal="false" :visible.sync="visible" width="550px">
    <el-form :model="formParams" ref="ruleForm" label-position="right" label-width="135px">
      <el-form-item label="品名" style="margin-bottom:0px">{{formParams.firstCatalogName}}</el-form-item>
      <el-form-item label="牌号" style="margin-bottom:0px">{{formParams.secondCatalogName}}</el-form-item>
      <el-form-item label="排放标准" style="margin-bottom:0px">{{formParams.emissionStandard}}</el-form-item>
      <el-form-item label="密度" style="margin-bottom:0px">{{formParams.density}}</el-form-item>
      <el-form-item label="生产商" style="margin-bottom:0px">{{formParams.manufacturerId_}}</el-form-item>
      <el-form-item label="交割库地址" style="margin-bottom:0px">{{formParams.deliveryStore}}</el-form-item>
      <el-form-item label="库存吨数">{{formParams.totalWeightInventory}}</el-form-item>
      <el-form-item
        label="发布吨数(吨)"
        prop="weightInventory"
        :rules="validateweight(formParams.totalWeightInventory)"
      >
        <el-input v-model="formParams.weightInventory"></el-input>
      </el-form-item>
      <el-form-item
        label="发布价格(元/吨)"
        prop="price"
        :rules="[{ required: true, message: '请维护正确价格' }]"
      >
        <el-input v-model="formParams.price" :disabled="releaseStatus"></el-input>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="cancle">取 消</el-button>
      <el-button type="primary" @click="confirm" :loading="releaseLoading">确 定</el-button>
    </div>
  </el-dialog>
</template>

<script>
const defaultFormParams = {
  firstCatalogName: null,
  secondCatalogName:null,
  totalWeightInventory: null,
  emissionStandard: null,
  density: null,
  manufacturerId_: null,
  deliveryStore: null,
  weightInventory: null,
  price: null
};
export default {
  name: "releaseInventoryModal",
  props: {
    title:{
      type:String,
      default:'发布货源'
    },
    cancleCb: {
      type: Function,
      default: () => {}
    },
    confirmCb: {
      type: Function,
      default: () => {}
    },
    releaseLoading: {
      type: Boolean,
      default: false
    },
    visible: {
      type: Boolean,
      default: false
    },
    releaseObj: {
      type: Object,
      default: () => {}
    },
    releaseStatus:{
      type: Boolean,
      default: false      
    }
  },
  data() {
    return {
      isLoading: false,
      formParams: { ...defaultFormParams }
    };
  },

  methods: {
    validateweight(weight) {
      return [
        {
          required: true,
          message: "必填",
          trigger: "blur"
        },
        {
          pattern: /^(?!0+(?:\.0+)?$)(?:[1-9]\d*|0)(?:\.\d{1,3})?$/,
          message: "正数可以包含3位小数"
        },
        {
          validator(rule, value, callback) {
            if (weight && value > weight) {
              callback(new Error(`超出可用量,请重新填写`));
            }
            callback();
          }
        }
      ];
    },
    cancle() {
      this.cancleCb();
    },
    confirm() {
      let that = this;
      this.$refs.ruleForm.validate(valid => {
        if (valid) {
          const { id, price, sellState, weightInventory } = that.formParams;
          let parmas = {
            id,
            price,
            sellState,
            weightInventory
          };
          that.confirmCb(parmas);
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    }
  },
  watch: {
    visible(newV) {
      if (newV) {
        this.formParams = Object.assign(
          {},
          this.formParams,
          JSON.parse(JSON.stringify(this.releaseObj))
        );
      } else {
        this.formParams = { ...defaultFormParams };
        setTimeout(() => {
          this.$refs.ruleForm.clearValidate();
        }, 100);
      }
    }
  }
};
</script>
<style scoped lang="less">
</style>
