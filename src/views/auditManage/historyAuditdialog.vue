<template>
  <el-dialog
    append-to-body
    :close-on-click-modal="false"
    :visible.sync="visible"
    :show-close="showClose"
    :center="true"
    title="历史审核意见"
  >
    <div class="search-box" style="margin-bottom:10px" v-if="listData.length">
        <span style="margin-right:50px;font-size:14px;">用户名:{{listData[0].username}}</span>
        <span style="font-size:14px;">公司名称:{{listData[0].name}}</span>
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

const defaultTableHeader = [
  {
    prop: "createdBy",
    label: "审核人员"
  },
  {
    prop: "checkTime",
    label: "审核日期"
  },
  {
    prop: "resultText",
    label: "审核结果"
  },
  {
    prop: "checkAdvice",
    label: "审核意见"
  }
];
const rowAdapter = list => {
  if (!list) {
    return [];
  }
  if (list.length > 0) {
    list = list.map(row => {
      return (row = {
        ...row,
        resultText: Dict.AUDIT_RESULT[row.checkResult]
      });
    });
  }
  return list;
};
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
          this.listData = rowAdapter(res.data);
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
