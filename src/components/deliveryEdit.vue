<template>
  <el-dialog :show-close="false" :title="title" :close-on-click-modal="false" :visible.sync="show" width="650px">
    <el-form :model="form" ref="ruleForm" label-position="right" label-width="135px" class="form">
      <el-form-item
        style="margin-bottom: 22px;"
        label="交割库名称"
        prop="deliveryStore"
        :rules="[{required: true, message: '必填',trigger: 'blur'}]"
      >
        <el-input v-model="form.deliveryStore" size="small"></el-input>
      </el-form-item>
      <el-form-item
        style="margin-bottom: 22px;"
        label="省市区"
        prop="storeAddress"
        :rules="[{ required: true, message: '必填',trigger: 'blur' }]"
      >
          <areaCascader 
            :value="form.storeAddress" 
            :clearable="true"
            @selection="selectArea"
          />
          <!-- <el-input type="hidden" :value="form.storeAddress" style="display:inline;height:0"></el-input> -->
      </el-form-item>
      <el-form-item
        style="margin-bottom: 22px;"
        label="详细地址"
        prop="storeAddressDetail"
        :rules="[{required: true, message: '必填',trigger: 'blur'}]"
      >
        <el-input size="small" v-model="form.storeAddressDetail"></el-input>
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
import areaCascader from "components/areaCascader"
const defaultform = {
  id: null,
  deliveryStore: null,
  storeAddress: [],
  storeAddressProvince:'',
  storeAddressCity:'',
  storeAddressCounty:'',
  storeAddressDetail: null
};
export default {
  name: "deliveryEdit",
  components:{
    areaCascader
  },
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
      form: _.cloneDeep(defaultform)
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
          that.confirmCb(that.form);
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
        this.form = Object.assign(
          {},
          this.form,
           _.cloneDeep(this.deliveryObj)
        );
      } else {
        this.form = { ...defaultform };
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
