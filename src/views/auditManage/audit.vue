<template>
  <div class="memberForm">
    <el-form ref="form" :model="form" label-width="150px" size="small">
      <div class="form-block">
        <div class="head">入会审核</div>
        <el-row>
          <el-col :md="24" :sm="24" :xs="24">
            <el-form-item
              label="审核结果:"
              prop="checkResult"
              :rules="[{ required: true, message: '必填' }]"
            >
              <el-select v-model="form.checkResult" placeholder="请选择">
                <el-option
                  v-for="(item,index) in AuditResultList"
                  :key="index"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :md="12" :sm="12" :xs="24">
            <el-form-item
              label="审核意见:"
              prop="checkAdvice"
              :rules="[{ required: true, message: '必填' }]"
            >
              <el-input type="textarea" v-model="form.checkAdvice"></el-input>
            </el-form-item>
          </el-col>
          <el-col :offset="2" :md="20" :sm="20" :xs="20">
            <div style="color:#1890FF;font-size:14px;" @click.stop="open">历史审核意见</div>
          </el-col>
        </el-row>
      </div>
    </el-form>
    <div class="footer">
        <el-button type="primary" size="small" @click="submitForm" :loading="viploading">
          <span>确定</span>
        </el-button>
        <el-button @click="GoMember" size="small">
          <span>取消</span>
        </el-button>
    </div>
    <historyAuditdialog :visible="visible" :cancelCb="cancel"></historyAuditdialog>
  </div>
</template>

<script>
import { mapState } from "vuex";
import Dict from "util/dict.js";
import { DICT_SELECT_ARR } from "common/util.js";
import historyAuditdialog from "./historyAuditdialog";

const AuditResultList = DICT_SELECT_ARR(Dict.AUDIT_RESULT);
const defualtFormParams = {
  checkResult: null,
  checkAdvice: null
};

export default {
  name: "audit",
  data() {
    return {
      form: { ...defualtFormParams },
      AuditResultList,
      viploading: false,
      visible: false
    };
  },
  components: {
    historyAuditdialog
  },
  methods: {
    cancel() {
      this.visible = false;
    },
    open() {
      this.visible = true;
    },
    GoMember() {
      this.$emit("auditClose");
    },
    submitForm() {
      this.$refs.form.validate(valid => {
        if (valid) {
          this._UpdateAudit_(
            Object.assign({}, this.form, { id: this.auditId,userId:this.memberId })
          );
        } else {
          return false;
        }
      });
    },
    async _UpdateAudit_(params) {
      this.viploading = true;
      const res = await this.$api.updateAdmissionAudit(params);
      this.viploading = false;
      switch (res.code) {
        case Dict.SUCCESS:
          this.$messageSuccess("更新入会审核成功");
          this.GoMember();
          break;
        default:
          this.$messageError(res.mesg);
          break;
      }
    }
  },
  computed: {
    ...mapState("memberForm", ["auditId","memberId"])
  },
  mounted() {
    if (!this.auditId) {
      this.GoMember();
      return;
    }
  }
};
</script>

<style lang="less" scoped>
.memberForm {
  margin: 15px 20px 50px 20px;
  background: white;
  .el-table thead {
    color: #909399;
    font-weight: 500;
    background: #eee;
  }
  .form-block {
    padding-bottom: 20px;
    .head {
      margin-bottom: 20px;
      box-sizing: border-box;
      height: 45px;
      line-height: 45px;
      border-bottom: 1px solid #e1e1e2;
      padding-left: 20px;
      font-size: 14px;
    }
  }
}
.footer {
  position: fixed;
  bottom: 0;
  left: 142px;
  right: 35px;
  z-index: 100;
  height: 50px;
  line-height: 50px;
  padding-left: 20px;
  background-color: #fff;
  box-shadow: 0 1px 4px 0 hsla(0, 0%, 80%, 0.5);
}
</style>

