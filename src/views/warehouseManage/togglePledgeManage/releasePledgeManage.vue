<template>
  <div class="container single-page">
    <hlBreadcrumb :data="breadTitle"></hlBreadcrumb>
    <div class="form"  v-if="releasePledgeData && releasePledgeData.cargoId">
      <el-form ref="form" :model="form" label-width="120px" size="small">
        <div class="form-block">
          <el-row>
            <el-col :md="12" :sm="12" :xs="24">
              <div class="head">质押信息</div>
            </el-col>
          </el-row>
          <el-row :gutter="50">
            <el-col :md="12" :sm="12" :xs="24">
              <el-form-item label="质权方" prop="bankName">
                <el-input :value="form.bankName" disabled="disabled"></el-input>
              </el-form-item>
            </el-col>
            <el-col :md="12" :sm="12" :xs="24">
              <el-form-item label="质压方" prop="cargoName">
                <el-input :value="form.cargoName" disabled="disabled"></el-input>
              </el-form-item>
            </el-col>
            <el-col :md="12" :sm="12" :xs="24">
              <el-form-item label="解押数量" prop="releaseNums" :rules="validatenum(form.inventoryTotalNums,this.maxnum)">
                <el-input v-model.number="form.releaseNums"></el-input>
              </el-form-item>
            </el-col>
            <el-col :md="12" :sm="12" :xs="24">
              <el-form-item 
                label="解押重量" prop="releaseWeight" :rules="validateweight(form.reserveweight,this.maxweight)">
                <el-input v-model="form.releaseWeight"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
        </div>
        <div class="form-block">
          <div class="head">库存信息</div>
          <el-row :gutter="50">
            <el-col :md="12" :sm="12" :xs="24">
              <el-form-item label="货主" prop="pledgeCargo">
                <el-input :value="form.pledgeCargo" disabled="disabled"></el-input>
              </el-form-item>
            </el-col>
            <el-col :md="12" :sm="12" :xs="24">
              <el-form-item label="库存数量" prop="inventoryTotalNums">
                <el-input :value="form.inventoryTotalNums" disabled="disabled"></el-input>
              </el-form-item>
            </el-col>
            <el-col :md="12" :sm="12" :xs="24">
              <el-form-item label="库存重量" prop="inventoryTotalWeight">
                <el-input :value="form.inventoryTotalWeight" disabled="disabled"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
        </div>
        <div class="bottom">
          <el-form-item>
            <el-button type="primary" size="medium" @click="submitForm('form')">确定</el-button>
            <el-button @click="back" size="medium">取消</el-button>
          </el-form-item>
        </div>
      </el-form>
    </div>
  </div>
</template>

<script>
import { mapState } from "vuex";
import _ from "lodash";
import hlBreadcrumb from "@/components/hl-breadcrumb";
import Dict from "@/util/dict.js";
import {number3} from "@/util/validate.js";
const defualtFormParams = {
  bankId: null, // 质权方id(银行id)
  bankName: null, // 银行名称
  cargoId: null, //货主id
  cargoName: null, // 货主也是质押方
  pledgeCargo: null, // 质押方
  releaseNums: null, // 解押数量
  releaseWeight: null,// 解押重量
  releaseCode: null, // 解押单号
  inventoryTotalNums: null, // 库存数量
  inventoryTotalWeight: null // 库存重量
};

export default {
  name: "releasePledgeManage",
  components: {
    hlBreadcrumb
  },
  data() {
    return {
      breadTitle: ["仓储管理", "质解押管理", "解押管理"],
      disabled: true,
      form: {
        ...defualtFormParams
      },
      maxweight:null,
      maxnum:null
    };
  },
  computed: {
    ...mapState("togglePledgeManage", ["releasePledgeData"]),
  },
  methods: {
    back() {
      this.$router.push({
        path: "/web/yc/pledgeinfo/page"
      });
    },
    validateweight(weight, max = null) {
      return [
        {
          required: true,
          message: "请输入解押重量",
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
            if(!number3) {
              callback(new Error('正数可以包含3位小数'))
            }
            if (value > weight) {
              callback(new Error(`不能大于${weight}`));
            }
            callback();
          }
        }
      ];
    },
    validatenum(num, max = null) {
      return [
        {
          validator(rule, value, callback) {
            if (!value) {
              callback();
            }
            if (max) {
              num = max;
            }
            if (value > num) {
              callback(new Error(`不能大于${num}`));
            }
            callback();
          }
        }
      ];
    },
    async _doReleasePledge_(obj) {
      const res = await this.$api.DoReleasePledge(obj);
      switch (res.code) {
        case Dict.SUCCESS:
          this.$messageSuccess(`解押成功`);
          this.back();
          break;
        default:
          this.$messageError(res.mesg);
          break;
      }
    },
    _serialize_() {
      const params =  Object.assign({},
        this.form,
        {releaseWeight:Number(this.form.releaseWeight)},
        );
      return params;
    },  
    submitForm(formName) {
      let that = this;
      this.$refs[formName].validate(valid => {
        if (valid) {
          // const Index = that.bankList.findIndex(item => {
          //   return item.label === that.form.bankName;
          // });
          // that.form.bankId = that.bankList[Index].value;
          const params = this._serialize_();
          that._doReleasePledge_(params);
        } else {
          return false;
        }
      });
    },
    async init() {
      if (this.releasePledgeData && this.releasePledgeData.cargoId) {
        const res = await this.$api.getPledgeNum(this.releasePledgeData.cargoId);
        switch (res.code) {
          case Dict.SUCCESS:
            if(res.data) {
               this.maxweight = Number(res.data.totalPledgeWeight);
               this.maxnum = Number(res.data.totalPledgeNums);
            }
            break;
          default:
            this.$messageError(res.mesg);
            break;
        }
        const res_ = await this.$api.getPledgeCargoinfo(this.releasePledgeData.cargoId);
        switch (res_.code) {
          case Dict.SUCCESS:
            this.form.bankId = res_.data.bankId
            this.form.bankName = res_.data.bankName
            break;
          default:
            this.$messageError(res_.mesg);
            break;
        }
        this.form = _.clone(
          Object.assign(
            {},
            this.form,
            { pledgeCargo: this.releasePledgeData.cargoName },
            this.releasePledgeData
          )
        );
      } else {
        this.back();
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
