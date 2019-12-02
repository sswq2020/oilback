<template>
  <div class="memberForm">
    <el-form ref="form" :model="form" label-width="150px" size="small">
      <div class="form-block">
        <div class="head">权限中心</div>
        <el-row>
          <el-col :md="24" :sm="24" :xs="24">
            <el-form-item
              label="是否允许重复交易:"
              prop="isRetrade"
              :rules="[{ required: true, message: '必填' }]"
            >
              <el-radio
                v-for="item in retradestatusList"
                :key="item.value"
                v-model="form.isRetrade"
                :label="item.value"
              >{{item.label}}</el-radio>
            </el-form-item>
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
  </div>
</template>

<script>
import { mapState } from "vuex";
import Dict from "util/dict.js";
import { DICT_SELECT_ARR } from "common/util.js";
const RetradestatusList = DICT_SELECT_ARR(Dict.RETRADE_STATUS);
const defualtFormParams = {
  isRetrade: Dict.RETRADE_DISABLE
};

export default {
  name: "permission",
  data() {
    return {
      form: { ...defualtFormParams },
      retradestatusList: RetradestatusList,
      viploading: false
    };
  },
  methods: {
    GoMember() {
      this.$emit("permissionClose");
    },
    submitForm() {
      this.$refs.form.validate(valid => {
        if (valid) {
          this._UpdateVIP_(this.form);
        } else {
          return false;
        }
      });
    },
    async _UpdateVIP_(params) {
      this.viploading = true;
      const { userId, isRetrade } = params;
      const res = await this.$api.UpdateVIP({ userId, isRetrade });
      this.viploading = false;
      switch (res.code) {
        case Dict.SUCCESS:
          this.$messageSuccess("更新成功重复交易");
          this.GoMember();
          break;
        default:
          this.$messageError(res.mesg);
          break;
      }
    },
    async _getVIPInfo(userId) {
      const res = await this.$api.getVIPInfo({ userId });
      switch (res.code) {
        case Dict.SUCCESS:
          this.form = res.data;
          break;
        default:
          this.$messageError(res.mesg);
          break;
      }
    }
  },
  computed: {
    ...mapState("memberForm", ["isEdit", "memberId"])
  },
  mounted() {
    if (!this.memberId || !this.isEdit) {
      this.GoMember();
      return;
    }
    this._getVIPInfo(this.memberId);
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
  left: 116px;
  right: 20px;
  z-index: 100;
  height: 50px;
  line-height: 50px;
  padding-left: 20px;
  background-color: #fff;
  box-shadow: 0 1px 4px 0 hsla(0, 0%, 80%, 0.5);
}
</style>

