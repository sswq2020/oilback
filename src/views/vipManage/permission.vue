<template>
    <div class="memberForm">
      <el-form ref="form" :model="form" label-width="140px" size="small">
        <div class="form-block">
          <el-row>
            <el-col :md="24" :sm="24" :xs="24">
              <div class="head">权限中心</div>
            </el-col>
          </el-row>
          <el-row>
            <el-col :md="24" :sm="24" :xs="24">
              <el-form-item
                label="是否允许重复交易"
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
        <div class="bottom">
          <el-form-item>
            <el-button type="primary" @click="submitForm" :loading="viploading">确定</el-button>
            <el-button  @click="GoMember">取消</el-button>
          </el-form-item>
        </div>
      </el-form>
    </div>
</template>

<script>
import { mapState } from "vuex";
import Dict from "util/dict.js";
import { DICT_SELECT_ARR } from "common/util.js";
const RetradestatusList = DICT_SELECT_ARR(Dict.RETRADE_STATUS);
const defualtFormParams = {
  isRetrade: Dict.RETRADE_DISABLE,
};

export default {
  name: "permission",
  data() {
    return {
      form: { ...defualtFormParams},
      retradestatusList: RetradestatusList,
      viploading:false
    };
  },
  methods: {
    GoMember() {
    this.$emit('permissionClose')
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
      const {userId,isRetrade} = params
      const res = await this.$api.UpdateVIP({userId,isRetrade});
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
    ...mapState("memberForm", ["isEdit", "memberId"]),
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

