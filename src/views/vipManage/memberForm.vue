<template>
  <div class="container single-page">
    <hlBreadcrumb :data="breadTitle"></hlBreadcrumb>
    <div class="memberForm">
      <el-form ref="form" :model="form" label-width="130px" size="small">
        <div class="form-block">
          <el-row>
            <el-col :md="24" :sm="24" :xs="24">
              <div class="head">公司信息</div>
            </el-col>
          </el-row>
          <el-row>
            <el-col :md="6" :sm="24" :xs="24">
              <el-form-item
                label="所属公司:"
                prop="userId"
                :rules="[{ required: true, message: '必须选择一个公司'  }]"
              >
                <companyglass @companySelect="getCompanyInfo"></companyglass>
                <el-input type="hidden" :value="form.userId"></el-input>
              </el-form-item>
            </el-col>
            <el-col :md="24" :sm="24" :xs="24">
              <el-form-item label="公司名称:" prop="name">{{form.name}}</el-form-item>
            </el-col>
            <el-col :md="24" :sm="24" :xs="24">
              <el-form-item label="统一社会信用代码:" prop="mock2">{{form.creditCode}}</el-form-item>
            </el-col>
            <el-col :md="24" :sm="24" :xs="24">
              <el-form-item label="公司地址:" prop="mock3">{{form.address}}</el-form-item>
            </el-col>
            <el-col :md="24" :sm="24" :xs="24">
              <el-form-item label="公司类型:" prop="mock4">{{form.entType_}}</el-form-item>
            </el-col>
            <el-col :md="24" :sm="24" :xs="24">
              <el-form-item label="法人:" prop="mock5">{{form.legalPersonName}}</el-form-item>
            </el-col>
            <el-col :md="24" :sm="24" :xs="24">
              <el-form-item label="营业有效期:" prop="mock6">{{form.effectiveDt}}  -  {{form.expireDt}}</el-form-item>
            </el-col>
          </el-row>
        </div>
      </el-form>
    </div>
  </div>
</template>

<script>
import { mapState } from "vuex";
import Dict from "util/dict.js";
import hlBreadcrumb from "components/hl-breadcrumb";
import companyglass from "components/companyglass";
const defualtFormParams = {
  userId: null,
  name: "惠龙易通国际物流股份有限公司",
  creditCode: "182361826324876382476",
  address: "江苏省镇江市润州区长江路758号",
  entType_: "股份有限公司",
  legalPersonName: "程清",
  effectiveDt: "2020-06-06",
  expireDt: "2020-12-06"
};
export default {
  name: "memberForm",
  data() {
    return {
      form: { ...defualtFormParams }
    };
  },
  components: {
    hlBreadcrumb,
    companyglass
  },
  methods: {
    GoSeller() {
      this.$router.push({
        path: "/web/hyw/member/member/pageSeller"
      });
    },
    getCompanyInfo(obj) {
      const {userId,name,creditCode,legalPersonName,address,effectiveDt,expireDt,entType_} = obj
      this.form = Object.assign({},this.form,{userId,name,creditCode,legalPersonName,address,effectiveDt,expireDt,entType_})
    }
  },
  computed: {
    ...mapState("memberForm", ["memberType", "isEdit", "memberId"]),
    breadTitle() {
      const TypeText = this.memberType === Dict.SELLER_VIP ? "卖方" : "买方";
      const EditText = this.isEdit ? "编辑" : "新增";
      return ["会员管理", `${TypeText}管理`, `${EditText}${TypeText}`];
    }
  },
  created() {},
  mounted() {
    if (!this.memberType) {
      this.GoSeller();
      return;
    }
    if (this.isEdit && this.memberId) {
      console.info("这是编辑页面");
    } else {
      console.info("这是新增页面");
    }
  }
};
</script>

<style lang="less" scoped>
.memberForm {
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

