<template>
  <el-dialog :show-close="false" :title="title" :close-on-click-modal="false" :visible.sync="show" width="550px">
    <el-form :model="formParams" ref="ruleForm" label-position="right" label-width="135px">
      <el-form-item
        label="交割库名称"
        prop="deliveryStore"
        :rules="[{required: true, message: '必填',trigger: 'blur'}]"
      >
        <el-input v-model="formParams.deliveryStore"></el-input>
      </el-form-item>
      <el-form-item
        label="省市区"
        prop="storeAddress"
        :rules="[{ required: true, message: '必填',trigger: 'blur' }]"
      >
          <AreaCascader 
            :value="formParams.storeAddress" 
            :clearable="true"
            @selection="selectArea"
          />
      </el-form-item>
      <el-form-item
        label="详细地址"
        prop="storeAddressDetail"
        :rules="[{required: true, message: '必填',trigger: 'blur'}]"
      >
        <el-input v-model="formParams.storeAddressDetail"></el-input>
      </el-form-item>


    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click.stop="cancle">取 消</el-button>
      <el-button type="primary" @click.stop="confirm" :loading="isEditLoading">确 定</el-button>
    </div>
  </el-dialog>
</template>

<script>
import _ from 'lodash'
const defaultFormParams = {
  id: null,
  deliveryStore: null,
  storeAddress: null,
  storeAddressProvince:'',
  storeAddressCity:'',
  storeAddressCounty:'',
  storeAddressDetail: null
};
export default {
  name: "deliveryEdit",
  props: {
    cancleCb: {
      type: Function,
      default: () => {}
    },
    confirmCb: {
      type: Function,
      default: () => {}
    },
    isEditLoading: {
      type: Boolean,
      default: false
    },
    show: {
      type: Boolean,
      default: false
    },
    isEdit:{
      type: Boolean,
      default: false
    },
    deliveryObj: {
      type: Object,
      default: () => {}
    },
  },
  data() {
    return {
      isLoading: false,
      formParams: _.cloneDeep(defaultFormParams)
    };
  },
  computed:{
      title(){
          return this.isEdit ? '编辑交割库地址':'新增交割库地址'
      }
  },
  methods: {
    cancle() {
      this.cancleCb();
    },
    /**
     * @author: xh
     * @description: 根据下拉选择的地址设置省市区
     */
    selectArea(value) {
      this.form.storeAddress = value;
      this.form.storeAddressProvince = value[0] || '';
      this.form.storeAddressCity = value[1] || '';
      this.form.storeAddressCounty = value[2] || '';
    },
    confirm() {
      let that = this;
      this.$refs.ruleForm.validate(valid => {
        if (valid) {
          that.confirmCb(that.formParams);
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    }
  },
  watch: {
    show(newV) {
      if (newV) {
        this.formParams = Object.assign(
          {},
          this.formParams,
           _.cloneDee(this.deliveryObj)
        );
      } else {
        this.formParams = { ...defaultFormParams };
        setTimeout(() => {
          this.$refs.ruleForm.clearValidate();
        }, 100);
      }
    }
  }
};
</script>
<style scoped lang="less">
</style>
