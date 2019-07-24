<template>
  <el-dialog :show-close="false" :visible="visible" width="600px">
    <!--startprint-->
    <div id="printContent">
      <div>
        <span>制单日期：2019-05-05</span>
        <span class="right">NO.12345678</span>
      </div>
      <ul>
        <li>
          <span>提货单位：</span>
          <span>11111</span>
        </li>
        <li>
          <span>提货单位：</span>
          <span>11111</span>
        </li>
        <li>
          <span>提货单位：</span>
          <span>11111</span>
        </li>
      </ul>
    </div>
    <!--endprint-->
    <div slot="footer" class="dialog-footer">
      <PrintBtn contentId="printContent"/>
      <el-button type="primary" >下载</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { mapState, mapMutations  } from 'vuex';
import PrintBtn from '@/components/print.vue';
export default {
  name: "productNameFormModal",
  components: {
    PrintBtn
  },
  data() {
    return {

    };
  },
  computed: {
    ...mapState('modal', ['visible']),
  },
  methods: {

  },
};
</script>

<style scoped lang="less">
.right {
  float :right
}
</style>

