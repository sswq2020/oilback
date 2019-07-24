<template>
  <el-dialog :title="title" :visible="visible" width="600px"  @close="cancle()">
    <el-form :model="form" :rules="rules" ref="ruleForm" label-position="right" label-width="150px">
      <el-form-item :label="item.label" :prop="item.prop" v-for="(item, index) in formItem" :key="index">
        <el-select v-model="form[item.prop]" placeholder="请选择" v-if="item.type === 'select'" @change="handleChange">
          <el-option v-for="optionItem in Object.keys(dropDownData.deliveryStoreMap)" :key="optionItem" :label="dropDownData.deliveryStoreMap[optionItem]" :value="optionItem"></el-option>
        </el-select>
        <el-input v-model="form[item.prop]" :maxlength="item.maxlength"  placeholder="请输入" v-if="item.type === 'input'"></el-input>
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
  storeId: '', // 仓库
  deliveryStore: '', // 仓库名称
  reservoirArea: '', // 库区
  cargoArea: '', // 货区
  positionName: '', // 仓位名称
}
export default {
  name: "pilePositionManage",
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
    }
    
  },
  data() {
    return {
      form:{...defaultForm},
      formItem: [
        {
          label: '仓库',
          prop: 'storeId',
          type: 'select',
        },
        {
          label: '库区',
          prop: 'reservoirArea',
          type: 'input',
          maxlength: 10
        },
        {
          label: '货区',
          prop: 'cargoArea',
          type: 'input',
          maxlength: 10
        },
        {
          label: '仓位名称',
          prop: 'positionName',
          type: 'input',
          maxlength: 20
        },
      ],
      rules: {
        storeId: [{ required: true, message: "请选择仓库", trigger: "blur" }],
        reservoirArea: [{ required: true, message: "请输入库区", trigger: "blur" }],
        cargoArea: [{ required: true, message: "请输入货区", trigger: "blur" }],
        positionName: [{ required: true, message: "请输入仓位名称", trigger: "blur" }],
      },
    };
  },
  computed: {
    ...mapState('modal', ['visible', 'dropDownData']),
    title() {
      return this.isEdit ? "编辑区桩位" : "新增区桩位";
    }
  },
  methods: {
    ...mapMutations('modal', ['SET_MODAL_VISIBLE']),
    /**
     * @author: xh
     * @description: 根据选择的仓库id设置对应的仓库名称
     */
    handleChange(val) {
      this.form.deliveryStore = this.dropDownData.deliveryStoreMap[val];
    },
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
    }
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
