<template>
  <div class="container single-page">
    <hlBreadcrumb :data="breadTitle"></hlBreadcrumb>

  </div>
</template>

<script>
import { mapState } from "vuex";
import Dict from "util/dict.js";
import hlBreadcrumb from "components/hl-breadcrumb";
export default {
  name: "memberForm",
  data() {
    return {
      
    };
  },
  components: {
    hlBreadcrumb
  },  
  methods: {
    GoSeller() {
      this.$router.push({
        path: "/web/hyw/member/member/pageSeller"
      });
    }
  },
  computed: {
    ...mapState("memberForm", ["memberType", "isEdit", "memberId"]),
    breadTitle() {
      const TypeText = this.memberType === Dict.SELLER_VIP ? '卖方':'买方';
      const EditText = this.isEdit ? '编辑':'新增';
      return ['会员管理',`${TypeText}管理`,`${EditText}${TypeText}`]
    }
  },
  created() {},
  mounted() {
    if (!this.memberType) {
      this.GoSeller();
      return;
    }
    if (this.isEdit && this.memberId) {
      console.info("这是编辑页面");
    } else {
      console.info("这是新增页面");
    }
  }
};
</script>

<style lang="less" scoped>
</style>

