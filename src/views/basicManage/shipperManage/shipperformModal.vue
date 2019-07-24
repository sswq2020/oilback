<template>
  <el-dialog :title="title" :visible="visible" width="600px"  @close="cancle()">
    <el-form :model="form" :rules="rules" ref="ruleForm" label-position="right" label-width="150px">
      <el-form-item :label="item.label" :prop="item.prop" v-for="(item, index) in formItem" :key="index">
        <el-input v-model="form[item.prop]" :maxlength="item.maxlength"></el-input>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="cancle">取 消</el-button>
      <el-button type="primary" @click="confirm" :loading="loading">确 定</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { mapState, mapMutations } from 'vuex';
import { mobileValidation, phoneValidation } from '@/util/reg.js';
const defaultForm = {
  telPhone: null, // 手机号码
  cargoName: null, // 货主名称
  socialCreditCode: null, // 社会信用统一代码
  bizContact: null, // 联系人
  contactTel: null, // 联系电话
};

/**
 * @author: xh
 * @description: 手机号码校验
 */
const checkMobile = (rule, value, callback) => {
  if(!value) {
    callback(new Error('请输入手机号码'));
  } else if (!mobileValidation(value)) {
    callback(new Error('格式错误，请输入正确格式的手机号码'));
  } else {
    callback();
  }
};

/**
 * @author: xh
 * @description: 联系电话校验
 */
const checkPhone = (rule, value, callback) => {
  if(!value) {
    callback(new Error('请输入联系电话'));
  } else if (!phoneValidation(value)) {
    callback(new Error('格式错误，请输入正确格式的联系电话'));
  } else {
    callback();
  }
};

export default {
  name: "shipperformModalTest",
  props: {
    isEdit: {
      type: Boolean,
      default: false
    },
    loading: {
      type: Boolean,
      default: false
    },
    confirmCb: {
      type: Function,
      default: () => {}
    },
    shipperObj:{
      type: Object,
      default: () => {}
    }
    
  },
  data() {
    return {
      form: {...defaultForm},
      formItem: [
        {
          label: '手机号码',
          prop: 'telPhone',
          maxlength: 11
        },
        {
          label: '货主名称',
          prop: 'cargoName',
          maxlength: 50
        },
        {
          label: '社会统一信用代码',
          prop: 'socialCreditCode',
          maxlength: 20
        },
        {
          label: '联系人',
          prop: 'bizContact',
          maxlength: 10
        },
        {
          label: '联系电话',
          prop: 'contactTel',
          maxlength: 30
        }
      ],
      rules: {
        telPhone: [{ required: true, validator: checkMobile, trigger: "blur" }],
        cargoName: [{ required: true, message: "请输入货主名称", trigger: "blur" }],
        socialCreditCode: [{ required: true, message: "请输入社会统一信用代码", trigger: "blur" }],
        bizContact: [{ required: true, message: "请输入联系人姓名", trigger: "blur" }],
        contactTel: [{ required: true, validator: checkPhone, trigger: "blur" }]
      }
    };
  },
  computed: {
    ...mapState('modal', ['visible']),
    title() {
      return this.isEdit ? "编辑货主" : "新增货主";
    }
  },
  methods: {
    ...mapMutations('modal', ['SET_MODAL_VISIBLE']),
    cancle() {
      this.SET_MODAL_VISIBLE(false);
    },
    confirm() {
      let that = this;
      this.$refs.ruleForm.validate(valid => {
        if (valid) {
          that.confirmCb({...that.form});
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    }
  },
  watch: {
    visible(newV, oldV) {
      if (newV) {
        this.form = this.isEdit ? {...this.shipperObj} : {...defaultForm};
      } else {
        this.$refs.ruleForm.clearValidate();
      }
    }
  },
  mounted() {
    console.log(this.visible);
  }
};
</script>
<style scoped lang="less">
</style>
