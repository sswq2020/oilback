<template>
  <el-dialog :title="title" :visible="visible" width="600px" @close="cancle()">
    <el-form :model="form" :rules="rules" ref="ruleForm" label-position="right" label-width="150px">
      <el-form-item :label="item.label" :prop="item.prop" v-for="(item, index) in formItem" :key="index">
        <el-select v-model="form[item.prop]" placeholder="请选择" @change="select($event, item.prop)">
          <el-option v-for="optionItem in Object.keys(item.optionData)" :key="optionItem" :label="item.optionData[optionItem]" :value="optionItem"></el-option>
        </el-select>
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
import Dict from "@/util/dict.js";
const defaultForm = {
  productTypeCode: '', // 品名大类
  productName: '', // 品名
  productNameId: '', // 品名Id
  materialId: '', // 材质Id
  materialName: '', // materialName
  specificationsId: '', // 规格Id
  specificationsName: '', // 规格名称
  originPlaceId: '', // 产地Id
  originPlaceName: '', // 产地名称
};

export default {
  name: "commodityFormModal",
  props: {
    isEdit: { 
      type: Boolean,
      default: false
    },
    loading: { 
      type: Boolean,
      default: false
    },
    confirmCb: { // 确认之后的回调
      type: Function,
      default: () => {}
    },
    editObj: { // 编辑对象
      type: Object,
      default: () => {}
    }
  },
  data() {
    return {
      form:{...defaultForm},
      formItem: [
        {
          label: '大类',
          prop: 'productTypeCode',
          optionData: {}
        },
        {
          label: '品名',
          prop: 'productNameId',
          optionMap: 'productNameMap',
          optionData: {}
        },
        {
          label: '材质',
          prop: 'materialId',
          optionMap: 'materialMap',
          optionData: {}
        },
        {
          label: '规格',
          prop: 'specificationsId',
          optionMap: 'specificationsMap',
          optionData: {}
        },
        {
          label: '产地',
          prop: 'originPlaceId',
          optionMap: 'originPlaceMap',
          optionData: {}
        }
      ],
      rules: {
        productTypeCode: [{ required: true, message: "请选择大类", trigger: "blur" }],
        productNameId: [{ required: true, message: "请选择品名", trigger: "blur" }],
        materialId: [{ required: true, message: "请选择材质", trigger: "blur" }],
        specificationsId: [{ required: true, message: "请选择规格", trigger: "blur" }],
        originPlaceId: [{ required: true, message: "请选择产地", trigger: "blur" }]
      }
    };
  },
  computed: {
    ...mapState('modal', ['visible']),
    ...mapState('app', ['productTypeCodeData']),
    title() {
      return this.isEdit ? "编辑物资" : "新增物资";
    }
  },
  methods: {
    ...mapMutations('modal', ['SET_MODAL_VISIBLE']),
    /**
     * @author xh
     * @description 获取初始化下拉列表
     * */
    async getInitData() {
      const apiUrl = this.isEdit ? 'updateGoodsInit' : 'addGoodsInit';
      const params = this.isEdit ? {id: this.form.id} : {}
      const res = await this.$api[apiUrl](params);
      switch (res.code) {
        case Dict.SUCCESS:
          const { data } = res;
          this.formItem = this.formItem.map(item => {
            return {
              ...item,
              optionData:  item.optionMap && data[item.optionMap]   ? data[item.optionMap] : item.optionData
            }
          });
          break;
        default:
          this.$messageError(res.mesg);
          break;
      }
    },
    /**
     * @author xh
     * @description 下拉选择事件
     * */
    async select(value, prop) {
      if (prop == 'productTypeCode') { 
        // 根据大类获取品名列表
        const res = await this.$api.selectProductNames({productTypeCode: value});
        switch (res.code) {
          case Dict.SUCCESS:
            this.formItem[1].optionData = res.data; // 根据选择大类设置品名的下拉
            this.form.productNameId = '';
            this.form.productNameName = '';
            break;
          default:
            this.$messageError(res.mesg);
            break;
        }
      } else {
        // 根据选择的值(id)设置对应的name eg: productNameId选择的是'123',就将productName设置成'123'对应的中文
        let text = '';
        for(let i = 0, len = this.formItem.length; i < len; i++) {
          if (this.formItem[i].prop === prop) {
            text = this.formItem[i].optionData[value];
            break;
          }
        }
        this.form[prop.replace(/Id|NameId/, 'Name')] = text;
      }
      
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
    }
  },
  watch: {
    visible(newV, oldV) {
      if (newV) {
        this.form = this.isEdit ? {...this.editObj} : {...defaultForm};
        this.formItem[0].optionData = this.productTypeCodeData;
        this.getInitData();
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
