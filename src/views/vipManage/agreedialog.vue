<template>
  <el-dialog :show-close="false" :title="title" :visible="agreedialog" width="600px">
    <el-form
      :model="agreeFormParams"
      ref="ruleForm"
      label-position="right"
      label-width="150px"
    >
      <el-form-item label="协议名称" prop="agreementName">
        <el-input v-model="agreeFormParams.agreementName"></el-input>
      </el-form-item>
      <el-form-item label="协议类型" prop="agreementTypeCode">
        <el-select style="width:100%" v-model="agreeFormParams.agreementTypeCode">
          <el-option
            v-for="item in bankDict"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
      </el-form-item>      
      <el-form-item label="协议生效日期" prop="effectTime">
        <el-input v-model="agreeFormParams.effectTime"></el-input>
      </el-form-item>
      <el-form-item label="协议到期日期" prop="dueTime">
        <el-input v-model="agreeFormParams.dueTime"></el-input>
      </el-form-item>
      <el-checkbox v-model="checked">长期</el-checkbox>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="cancle">取 消</el-button>
      <el-button type="primary" @click="confirm">确 定</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { mapActions, mapState, mapMutations } from "vuex";
export default {
  name: "agreedialog",
  props: {},
  data() {
    return {
    };
  },
  computed: {
    ...mapState("accountinfomanage", [
      "agreeFormParams",
      "isEdit",
      "agreedialog",
    ]),
    title() {
      return this.isEdit ? "编辑入会协议" : "新增入会协议";
    }
  },
  methods: {
    ...mapMutations("accountinfomanage", ["setAgreedialog"]),
    ...mapActions("accountinfomanage", ["updateBankAccount"]),
    open() {
      this.setAgreedialog(true);
    },
    cancle() {
      this.setAgreedialog(false);
    },
    confirm() {
      let that = this;
      this.$refs.ruleForm.validate(valid => {
        if (valid) {
          // let parmas = JSON.parse(JSON.stringify(that.agreeFormParams));
          // const { agreementTypeCode } = parmas;
          // const index = that.bankDict.findIndex(item => {
          //   return item.value === agreementTypeCode;
          // });
          // parmas.bankName = that.bankDict[index].label;
          // this.updateBankAccount(parmas);
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    }
  },
  watch: {
    agreedialog(newV, oldV) {
      if (newV === false) {
        this.$refs.ruleForm.clearValidate();
      }
    }
  }
};
</script>
<style scoped lang="less">
</style>
