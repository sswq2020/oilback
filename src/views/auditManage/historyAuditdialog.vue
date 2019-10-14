<template>
  <el-dialog
    append-to-body
    :close-on-click-modal="false"
    :visible.sync="visible"
    :show-close="showClose"
    :center="true"
    title="历史审核意见"
  >
    <div class="search-box" v-if="form.id">
      <div class="form-item">
        <label>用户名:</label>
        <div class="form-control">{{form.username}}</div>
      </div>
      <div class="form-item">
        <label>公司名称:</label>
        <div class="form-control">{{form.name}}</div>
      </div>
    </div>
    <el-table stylestripe :data="listData" v-loading="isListDataLoading">
      <el-table-column type="index" label="序号" width="40" align="center"></el-table-column>
      <el-table-column
        show-overflow-tooltip
        align="center"
        :prop="item.prop"
        :label="item.label"
        :key="index"
        v-for="(item,index) in tableHeader"
      >
        <template slot-scope="scope">
          <span>{{listData[scope.$index][item.prop]}}</span>
        </template>
      </el-table-column>
    </el-table>
    <slot name="count"></slot>
    <div slot="footer" class="dialog-footer">
      <el-button @click="cancle()">取 消</el-button>
    </div>
  </el-dialog>
</template>

<script>
import Dict from "util/dict.js";
import { mapState } from "vuex";

const defaultForm = {
  id: null,
  username: null,
  name: null
};
const defaultTableHeader = [
  {
    prop: "mock1",
    label: "审核人员"
  },
  {
    prop: "mock2",
    label: "审核日期"
  },
  {
    prop: "mock3",
    label: "审核结果"
  },
  {
    prop: "mock4",
    label: "审核意见"
  }
];

export default {
  name: "historyAuditdialog",
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    cancelCb: {
      type: Function,
      default: () => {}
    }
  },
  data() {
    return {
      showClose: false,
      tableHeader: defaultTableHeader,
      listData: [],
      form: { ...defaultForm },
      isListDataLoading: false
    };
  },
  computed: {
    ...mapState("memberForm", ["auditId"])
  },
  methods: {
    cancle() {
      this.cancelCb();
    },
    async _getData(id) {
      this.isListDataLoading = true;
      const res = await this.$api.historyAudit({ id });
      this.isListDataLoading = false;
      switch (res.code) {
        case Dict.SUCCESS:
          this.listData = res.data;
          break;
        default:
          this.$messageError(res.mesg);
          break;
      }
    }
  },
  watch: {
    visible(newV) {
      if (newV) {
        if (this.auditId) {
          this._getData(this.auditId);
        }
      }
    }
  }
};
</script>
<style scoped lang="less">
</style>
