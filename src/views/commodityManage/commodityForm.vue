<template>
  <div class="container single-page">
    <hlBreadcrumb :data="breadTitle"></hlBreadcrumb>
    <div class="form">
      <el-form ref="form" :model="form" label-width="125px" size="small">
        <div class="form-block">
          <el-row>
            <el-col :md="12" :sm="12" :xs="24">
              <div class="head">商品信息</div>
            </el-col>
          </el-row>
          <el-row :gutter="20">
            <el-col :md="12" :sm="12" :xs="24">
              <el-form-item label="一级目录" prop="mock1" :rules="[{ required: true, message: '必选'  }]">
                <el-select v-model="form.mock1" placeholder="请选择" size="small">
                  <el-option
                    v-for="(item,index) in firstClassList"
                    :key="index"
                    :label="item.name"
                    :value="item.id"
                  ></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :md="12" :sm="12" :xs="24">
              <el-form-item label="二级目录" prop="mock2" :rules="[{ required: true, message:'必选'  }]">
                <el-select v-model="form.mock2" placeholder="请选择" size="small">
                  <el-option
                    v-for="(item,index) in secondClassList"
                    :key="index"
                    :label="item.name"
                    :value="item.id"
                  ></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :md="12" :sm="12" :xs="24">
              <el-form-item label="排放标准" prop="mock3" :rules="[{ required: true, message: '必填' }]">
                <el-input v-model="form.mock3"></el-input>
              </el-form-item>
            </el-col>
            <el-col :md="12" :sm="12" :xs="24">
              <el-form-item
                label="密度(kg/m³)"
                prop="mock4"
                :rules="[{ required: true, message: '必填' }]"
              >
                <el-input v-model="form.mock4"></el-input>
              </el-form-item>
            </el-col>
            <el-col :md="12" :sm="12" :xs="24">
              <el-form-item label="产品编号" prop="mock5" :rules="[{ required: true, message: '必填' }]">
                <el-input v-model="form.mock5"></el-input>
              </el-form-item>
            </el-col>
            <el-col :md="12" :sm="12" :xs="24">
              <el-form-item label="生产商" prop="mock6" :rules="[{ required: true, message: '必填' }]">
                <el-input v-model="form.mock6"></el-input>
              </el-form-item>
            </el-col>
            <el-col :md="12" :sm="12" :xs="24">
              <el-form-item
                label="商品价格(元/吨)"
                prop="mock7"
                :rules="[{ required: true, message: '必填' }]"
              >
                <el-input v-model="form.mock7"></el-input>
              </el-form-item>
            </el-col>
            <el-col :md="12" :sm="12" :xs="24">
              <el-form-item label="库存(件)" prop="mock8" :rules="[{ required: true, message: '必填' }]">
                <el-input v-model="form.mock8"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :md="12" :sm="12" :xs="24">
              <el-form-item
                label="上传图片"
                prop="fileId"
                :rules="[{ required: true, message: '请正确上传图片' }]"
              >
                <div class="imgBox" v-show="form.fileId">
                  <ImageBox :url="url" :onDelete="uploadDelete"></ImageBox>
                </div>
                <div class="imgBox" v-show="!(form.fileId)">
                  <ImageUpload :onSuccess="(file)=>{this.uploadSuceess(file)}"></ImageUpload>
                </div>
                <el-input type="hidden" :value="form.fileId"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
        </div>
        <div class="form-block" v-show="form.domains.length">
          <div class="head">参数信息</div>
          <el-row :gutter="50">
            <el-col
              :md="12"
              :sm="12"
              :xs="24"
              v-for="(domain, index) in form.domains"
              :key="domain.id"
            >
              <el-form-item
                :label="domain.paraName"
                :prop="'domains.' + index + '.value'"
                :rules="{required: true, message: '必填', trigger: 'blur'}"
              >
                <el-input v-model="domain.value"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
        </div>
        <div class="form-block">
          <div class="head">销售状态</div>
          <el-row :gutter="50">
            <el-col :md="12" :sm="12" :xs="24">
              <el-form-item label="销售状态" prop="mock9" :rules="[{ required: true, message: '必填' }]">
                <el-radio v-model="form.mock9" label="1">放入出售中</el-radio>
                <el-radio v-model="form.mock9" label="2">放入待售中</el-radio>
              </el-form-item>
            </el-col>
          </el-row>
        </div>
        <div class="bottom">
          <el-form-item>
            <el-button type="primary" :loading="loading" @click="submitForm('form')">发布</el-button>
            <el-button @click="addDomain">新增</el-button>
            <el-button @click="back">取消</el-button>
          </el-form-item>
        </div>
      </el-form>
    </div>
  </div>
</template>

<script>
import { mapState, mapMutations } from "vuex";
import hlBreadcrumb from "components/hl-breadcrumb";
import ImageBox from "components/ImageBox";
import ImageUpload from "components/ImageUpload_";
import Dict from "util/dict.js";
import { imgHost } from "api/mock";
import ENV from "common/env.js";
import _ from "lodash";
const imgUrl = `${imgHost[ENV]}/dfs/open/files/info/get?url=`;
const defualtFormParams = {
  fileId: null, // 图片上传成功后返回的id
  mock1: null,
  mock2: null,
  mock3: null,
  mock4: null,
  mock5: null,
  mock6: null,
  mock7: null,
  mock8: null,
  mock9: "1",
  mock10: null,
  domains: []
};

export default {
  name: "commodityForm",
  components: {
    hlBreadcrumb,
    ImageBox,
    ImageUpload
  },
  data() {
    return {
      loading: false,
      url:
        "https://fuss10.elemecdn.com/e/5d/4a731a90594a4af544c0c25941171jpeg.jpeg", // 后台改成上传成功后返回的url
      form: { ...defualtFormParams },
      firstClassList: [],
      secondClassList: [],
      paramsList:[]
    };
  },
  computed: {
    ...mapState("releaseNewCommodity", ["isEdit","commodityId"]),
    computedUrl() {
      return imgUrl + this.url;
    },
    breadTitle() {
      return this.isEdit
        ? ["商品管理", "编辑商品"]
        : ["商品管理", "发布新商品"];
    }
  },
  methods: {
    ...mapMutations("releaseNewCommodity", ["setIsEdit","setCommodityId"]),
    back() {
      this.$router.push({
        path: "/web/cm/commodity/releaseNewCommodity/page"
      });
    },
    async _addStockRegister_(params) {
      this.loading = true;
      const res = await this.$api.addStockRegister(params);
      this.loading = false;
      switch (res.code) {
        case Dict.SUCCESS:
          this.$messageSuccess("入库登记成功");
          this.back();
          break;
        default:
          this.$messageError(res.mesg);
          break;
      }
    },
    _findName(arr = [], id) {
      let copy = _.clone(arr);
      const index = _.findIndex(copy, o => {
        return o.value == id;
      });
      if (index > -1) {
        return copy[index].label;
      } else {
        return null;
      }
    },
    _filter() {
      const params = _.clone(
        Object.assign(
          {},
          this.form,
          {
            productName: this._findName(
              this.productNameList,
              this.form.productNameId
            )
          },
          {
            materialName: this._findName(
              this.materialList,
              this.form.materialId
            )
          },
          {
            specificationsName: this._findName(
              this.specificationsList,
              this.form.specificationsId
            )
          },
          {
            originPlaceName: this._findName(
              this.originPlaceList,
              this.form.originPlaceId
            )
          },
          { cargoName: this._findName(this.cargoList, this.form.cargoId) },
          {
            deliveryStore: this._findName(
              this.deliveryStoreList,
              this.form.deliveryStoreId
            )
          },
          {
            pilePosition: this._findName(
              this.pilePositionList,
              this.form.pilePositionId
            )
          }
        )
      );
      return params;
    },
    uploadSuceess(res) {
      // const {ext,id,mtUrl,name,stUrl,url} = res  联调测试的时候得到的值
      this.form.fileId = res.uid;
    },
    uploadDelete() {
      this.form.fileId = null;
      this.url = "#";
    },
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          // const params = this._filter();
          // this._addStockRegister_(params);
        } else {
          return false;
        }
      });
    },
    addDomain() {
      this.form.domains.push({
        value: "",
        key: Date.now()
      });
    },
    _handleClass(arr) {
      if (!arr || !arr.length) {
        return [];
      }
      if (arr.length) {
        arr.forEach(item => {
          if (!item.parentId) {
            item.parentId = "top";
          }
        });
      }
      let group = _.groupBy(arr, "parentId");
      let top = group.top;
      top.forEach(item => {
        item.children = group[item.id];
      });
      return top;
    },
    async _getClass() {
      const res = await this.$api.getClass();
      switch (res.code) {
        case Dict.SUCCESS:
          this.firstClassList = this._handleClass(res.data);
          break;
        default:
          this.$messageError(res.mesg);
          break;
      }
    },
    async _getParameter(id) {
      const res = await this.$api.getParameterById(id);
      switch (res.code) {
        case Dict.SUCCESS:
          if (res.data && res.data.length) {
            this.paramsList = _.cloneDeep(res.data) // 万一以后有用
            this.form.domains = res.data.map(item => {
              return { ...item, value: "" };
            });
          }
          break;
        default:
          this.$messageError(res.mesg);
          break;
      }
    },
    init() {
      this._getClass();
    }
  },
  mounted() {
    if (this.isEdit) {
      if(!this.commodityId) {
        this.back();
      }
      console.log("这是编辑页面");
    } else {
      console.log("这是新增页面");
    }
  },
  created() {
    this.init();
  },
  beforeDestroy() {
    this.setIsEdit(false);
    this.setCommodityId(null)
  },
  watch: {
    "form.mock1": {
      handler(newV, oldV) {
        if (newV !== oldV) {
          this.form.mock2 = null;
          if (newV) {
            setTimeout(() => {
              this.secondClassList = this.firstClassList[newV].children;
            }, 20);
          }
        }
      }
    },
    "form.mock2": {
      handler(newV, oldV) {
        if (!newV) {
          setTimeout(()=>{
            this.form.domains = []
          },20)
          return;
        }
        if (newV !== oldV) {
          this._getParameter(newV);
        }
      }
    }
  }
};
</script>


<style scoped lang="less">
.form {
  padding: 30px 15px 50px 15px;
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
