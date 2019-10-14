<template>
  <div class="memberForm">
    <el-form ref="form" :model="form" label-width="150px" size="small">
      <div class="form-block">
        <div class="head">入会审核</div>
        <el-row>
          <el-col :md="24" :sm="24" :xs="24">
            <el-form-item
              label="审核结果"
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
              label="审核意见"
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
      <div class="bottom">
        <el-form-item>
          <el-button type="primary" @click="submitForm" :loading="viploading">确定</el-button>
          <el-button @click="GoMember">取消</el-button>
        </el-form-item>
      </div>
    </el-form>
    <historyAuditdialog
      :visible="visible"
      :cancelCb="cancel"
    ></historyAuditdialog>
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
            Object.assign({}, this.form, { id: this.auditId })
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
    ...mapState("memberForm", ["auditId"])
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
  padding: 15px;
  background: white;
  .el-table thead {
    color: #909399;
    font-weight: 500;
    background: #eee;
  }
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

