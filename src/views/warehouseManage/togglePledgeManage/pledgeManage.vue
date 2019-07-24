<template>
  <div class="container single-page">
    <hlBreadcrumb :data="breadTitle"></hlBreadcrumb>
    <div class="form" v-if="pledgeData && pledgeData.cargoId">
      <el-form ref="form" :model="form" label-width="120px" size="small">
        <div class="form-block">
          <el-row>
            <el-col :md="12" :sm="12" :xs="24">
              <div class="head">质押信息</div>
            </el-col>
          </el-row>
          <el-row :gutter="50">
            <el-col :md="12" :sm="12" :xs="24">
              <el-form-item
                label="业务类型"
                prop="pledgeType"
                :rules="[{ required: true, message: '请选择业务类型', trigger: 'blur' }]"
              >
                <el-select v-model="form.pledgeType" placeholder="请选择" size="small">
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
              <el-form-item
                label="质权方(银行)"
                prop="bankId"
                :rules="[{ required: true, message: '请选择质权方' }]"
              >
                <el-select v-model="form.bankId" placeholder="请选择" size="small">
                  <el-option
                    v-for="(item,index) in bankList"
                    :key="index"
                    :label="item.label"
                    :value="item.value"
                  ></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :md="12" :sm="12" :xs="24">
              <el-form-item label="质压方" prop="pledgeCargo">
                <el-input :value="form.pledgeCargo" disabled="disabled"></el-input>
              </el-form-item>
            </el-col>
            <el-col :md="12" :sm="12" :xs="24">
              <el-form-item
                label="质押数量"
                prop="pledgeNums"
                :rules="validatenum(form.inventoryTotalNums)"
              >
                <el-input v-model.number="form.pledgeNums"></el-input>
              </el-form-item>
            </el-col>
            <el-col :md="12" :sm="12" :xs="24">
              <el-form-item
                label="质押重量"
                prop="pledgeWeight"
                :rules="validateweight(form.inventoryTotalWeight,max)"
              >
                <el-input v-model="form.pledgeWeight"></el-input>
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
import { DICT_SELECT_ARR } from "@/common/util";
import { bankMixin } from "@/common/mixin.js";
const TypeDatas = DICT_SELECT_ARR(Dict.PLEDGE_BUSINESS_TYPE);
const defualtFormParams = {
  bankId: null,
  bankName: null,
  cargoId: null,
  cargoName: null,
  pledgeCargo: null,
  pledgeNums: null,
  pledgeType: "0",
  pledgeWeight: null,
  pledgeCode: null,
  inventoryTotalNums: null,
  inventoryTotalWeight: null
};

export default {
  name: "pledgeManage",
  mixins: [bankMixin],
  components: {
    hlBreadcrumb
  },
  data() {
    return {
      breadTitle: ["仓储管理", "质解押管理", "质押管理"],
      disabled: true,
      form: {
        ...defualtFormParams
      },
      typeDatas: TypeDatas,
      max: null // 进入该页面需要获取最大可用重量
    };
  },
  computed: {
    ...mapState("togglePledgeManage", ["pledgeData"])
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
          message: "请输入质押重量",
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
    async _doPledge_(obj) {
      const res = await this.$api.DoPledge(obj);
      switch (res.code) {
        case Dict.SUCCESS:
          this.$messageSuccess("质押成功");
          this.back();
          break;
        default:
          this.$messageError(res.mesg);
          break;
      }
    },
    submitForm(formName) {
      let that = this;
      this.$refs[formName].validate(valid => {
        if (valid) {
          const Index = that.bankList.findIndex(item => {
            return item.value === that.form.bankId;
          });
          that.form.bankName = that.bankList[Index].label;
          that._doPledge_(that.form);
        } else {
          return false;
        }
      });
    },
    async init() {
      if (this.pledgeData && this.pledgeData.cargoId) {
        const res = await this.$api.getAvailableNum(this.pledgeData.cargoId);
        switch (res.code) {
          case Dict.SUCCESS:
            if(res.data) {
               this.max = Number(res.data);
            }
            break;
          default:
            this.$messageError(res.mesg);
            break;
        }
        this.form = _.clone(
          Object.assign(
            {},
            this.form,
            { pledgeCargo: this.pledgeData.cargoName },
            this.pledgeData
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
  .form-block {
    padding-top: 15px;
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
