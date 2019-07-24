<template>
  <div class="container single-page">
    <hlBreadcrumb :data="breadTitle"></hlBreadcrumb>
    <div class="form" v-if="form.needShowData.length">
      <el-form ref="form" :model="form" label-width="120px" size="small">
        <div class="form-block" v-for="(item,index) in form.needShowData" :key="item.id">
          <div class="head">登记信息</div>
          <el-row :gutter="50">
            <el-col :md="12" :sm="12" :xs="24">
              <el-form-item label="登记日期" prop="registerTime">
                <el-input :value="item.registerTime" disabled="disabled"></el-input>
              </el-form-item>
            </el-col>
            <el-col :md="12" :sm="12" :xs="24">
              <el-form-item label="货主" prop="cargoName">
                <el-input :value="item.cargoName" disabled="disabled"></el-input>
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
              <el-form-item label="产地" prop="originPlaceName">
                <el-input :value="item.originPlaceName" disabled="disabled"></el-input>
              </el-form-item>
            </el-col>
            <el-col :md="12" :sm="12" :xs="24">
              <el-form-item label="规格" prop="specificationsName">
                <el-input :value="item.specificationsName" disabled="disabled"></el-input>
              </el-form-item>
            </el-col>
            <el-col :md="12" :sm="12" :xs="24">
              <el-form-item label="应收数量" prop="supposedNum">
                <el-input :value="item.supposedNum" disabled="disabled"></el-input>
              </el-form-item>
            </el-col>
            <el-col :md="12" :sm="12" :xs="24">
              <el-form-item label="应收重量" prop="supposedWeight">
                <el-input :value="item.supposedWeight" disabled="disabled"></el-input>
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
            <el-col :md="12" :sm="12" :xs="24">
              <el-form-item label="计量方式" prop="measuringText">
                <el-input :value="item.measuringText" disabled="disabled"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <div class="head">验收信息</div>
          <el-row :gutter="50">
            <el-col :md="12" :sm="12" :xs="24">
              <el-form-item 
              label="实收数量"
              :prop="'needShowData.' + index + '.num'"
              :rules="validatenum(item.supposedNum)"
              >
                <el-input v-model.number="item.num"></el-input>
              </el-form-item>
            </el-col>
            <el-col :md="12" :sm="12" :xs="24">
              <el-form-item
                label="实收重量"
                :prop="'needShowData.' + index + '.weight'"
                :rules="validateweight(item.supposedWeight)"
              >
                <el-input v-model="item.weight"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
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
            <!-- <el-col :md="6" :sm="12" :xs="24">
              <el-form-item label="层数" prop="piles">
                <el-input :value="item.piles" disabled="disabled"></el-input>
              </el-form-item>
            </el-col> -->
          </el-row>
        </div>
        <div class="bottom">
          <el-form-item>
            <el-button type="primary" :loading="loading"  size="medium" @click="submitForm('form')">确定</el-button>
            <el-button @click="back" size="medium">取消</el-button>
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
export default {
  name: "checkEnter",
  components: {
    hlBreadcrumb
  },
  data() {
    return {
      loading: false,
      breadTitle: ["仓储管理", "待验收入库", "验收入库"],
      disabled: true,
      form: {
        needShowData: [],
      }
    };
  },
  computed: {
    ...mapState("waitCheckEnter", ["inspection"]),
  },
  methods: {
    back() {
      this.$router.push({
        path: "/web/yc/storage/stockRegister/page"
      });
    },
    validateweight(weight, max = null) {
      return [
        {
          required: true,
          message: "请输入实收重量",
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
  _serialize_() {
      const params = this.form.needShowData.map((item) => {
        return Object.assign(
        {},
        item,
        {weightUnitTypeEnum:null},
        {numUnitTypeEnum:null},
        {measuringTypeEnum:null},
        );
      });
      return params;
    }, 
   async _examine_(params){
      this.loading = true;
      const res = await this.$api.examine(params);
      this.loading = false;
      switch (res.code) {
        case Dict.SUCCESS:
          this.$messageSuccess("验收入库成功");
          this.back();
          break;
        default:
          this.$messageError(res.mesg);
          break;
      }        
    },
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          const params = this._serialize_();
          this._examine_(params);
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    init() {
      if (this.inspection.length === 0) {
        this.back();
      } else {
        this.form.needShowData = this.inspection.slice().map(item => {
          return Object.assign(
            {},
            item,
            { num: null, weight: null },
            {
              measuringText:item.measuringTypeEnum && item.measuringTypeEnum.text || "-",
              numUnitText:item.numUnitTypeEnum && item.numUnitTypeEnum.text || "-",
              weightUnitText:item.weightUnitTypeEnum && item.weightUnitTypeEnum.text || "-",
            }
            );
        });
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
