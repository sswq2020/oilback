<template>
  <el-dialog :show-close="false" :title="title" :visible="visible" width="450px">
    <el-form
      :model="form"
      :rules="rules"
      ref="ruleForm"
      label-position="right"
      label-width="150px"
    >
      <el-form-item 
        label="售价" 
        prop="price" 
        :rules="[{ required: true, message: '必填' },
          { pattern: /^[1-9][0-9]{0,3}$/,message: '正数,小数点不超过2位'}
        ]">
        <el-input v-model="form.price"></el-input>
      </el-form-item>
      <el-form-item 
        label="库存" 
        prop="totalWeightInventory" 
        :rules="[{ required: true, message: '必填', trigger: 'blur'},
              { pattern: /^[1-9][0-9]{0,3}$/,message: '只能输入1-9999'}]">
        <el-input v-model="form.totalWeightInventory"></el-input>
      </el-form-item>

      <el-form-item 
        label="需缴纳保证金" 
        prop="leastPrice" 
        :rules="validNeed(cautionMoneny)" >
          {{form.leastPrice}}<span style="margin-left:100px">(可用保证金余额:{{cautionMoneny}}元)</span>
          <el-input type="hidden" :value="form.leastPrice" style="display:inline;height:0"></el-input>
      </el-form-item>

    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="cancle">取 消</el-button>
      <el-button type="primary" @click="confirm" :loading="priceLoading">确 定</el-button>
    </div>
  </el-dialog>
</template>

<script>
import Dict from "util/dict.js";
import NP from "number-precision";
import {num2,num9999} from "util/reg.js"
import {deepMerge} from "common/util"

/***系数***/
const RATIO = 1;

const defaultFormParams = {
    price: null, // 售价
    totalNumInventory: null, // 库存
    leastPrice:0,
}

export default {
  name: "pricedialog",
  props: {
    title:{
      type:String,
      default:''
    },
    cancleCb: {
      type: Function,
      default: () => {}
    },
    confirmCb:{
      type:Function,
      default:()=>{}
    },
    priceLoading:{
      type:Boolean,
      default:false
    },
    visible: {
      type: Boolean,
      default: false
    },    
    priceObj:{
      type: Object,
      default: () => {}      
    }
  },
  data() {
    return {
      form: deepMerge(defaultFormParams),
      isLoading:false,
      /***最低保证金**/
      cautionMoneny:0,
      rules: {
        price: [{ required: true, message: "售价必填", trigger: "blur" }],
        totalWeightInventory: [
          { required: true, message: "库存必填", trigger: "blur" }
        ]
      }
    };
  },
  methods: {
    cancle() {
      this.cancleCb();
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
    confirm() {
      let that = this;
      this.$refs.ruleForm.validate(valid => {
        if (valid) {
          let parmas = deepMerge(that.form);
          that.confirmCb(parmas);
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    }
  },
  watch: {
    pricedialog(newV, oldV) {
      if (newV === false) {
        this.$refs.ruleForm.clearValidate();
      }else {
        this.form = deepMerge(this.priceObj);
        this._cautionMoneny();
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
</style>
