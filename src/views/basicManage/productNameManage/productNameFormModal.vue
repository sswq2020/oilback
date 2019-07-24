<template>
  <el-dialog :title="title" :visible="visible" width="600px"  @close="cancle()">
    <el-form :model="form" :rules="rules" ref="ruleForm" label-position="right" label-width="150px">
      <el-form-item :label="item.label" :prop="item.prop" v-for="(item, index) in formItem" :key="index">
        <el-select v-model="form[item.prop]" placeholder="请选择" v-if="item.type === 'select'">
          <el-option v-for="optionItem in Object.keys(productTypeCodeData)" :key="optionItem" :label="productTypeCodeData[optionItem]" :value="optionItem"></el-option>
        </el-select>
        <el-input v-model="form[item.prop]" maxlength="20"  placeholder="请输入" v-if="item.type === 'input'"></el-input>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="cancle">取 消</el-button>
      <el-button type="primary" @click="confirm" :loading="loading">确 定</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { mapState, mapMutations  } from 'vuex';
const defaultForm = {
  productTypeCode: null,
  productNameCode: null,
  productName: null,
}
export default {
  name: "productNameFormModal",
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
    editObj:{
      type: Object,
      default: () => {}
    },
    
  },
  data() {
    return {
      form:{...defaultForm},
      formItem: [
        {
          label: '大类',
          prop: 'productTypeCode',
          type: 'select',
        },
        {
          label: '品名代码',
          prop: 'productNameCode',
          type: 'input',
        },
        {
          label: '品名',
          prop: 'productName',
          type: 'input',
        }
      ],
      rules: {
        productTypeCode: [{ required: true, message: "请选择大类", trigger: "blur" }],
        productNameCode: [{ required: true, message: "请输入品名代码", trigger: "blur" }],
        productName: [{ required: true, message: "请输入品名", trigger: "blur" }],
      },
    };
  },
  computed: {
    ...mapState('modal', ['visible']),
    ...mapState('app', ['productTypeCodeData']),
    title() {
      return this.isEdit ? "编辑品名" : "新增品名";
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
    },
  },
  watch: {
    visible(newV, oldV) {
      if (newV) {
        this.form = this.isEdit ? {...this.editObj} : {...defaultForm};
      } else {
        this.$refs.ruleForm.clearValidate();
      }
    },
  }
};
</script>
<style scoped lang="less">
.two-form-item {
  display: flex;
  :first-child.el-form-item {
    margin-right: 10px; 
  }
  :last-child.el-form-item {
    margin-left: 10px;
  }
}
.el-select {
  width: 100%;
}
</style>
