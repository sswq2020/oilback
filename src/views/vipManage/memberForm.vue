<template>
  <div class="memberForm"></div>
</template>

<script>
import { mapState, mapActions } from "vuex";
export default {
  name: "memberForm",
  data() {
    return {};
  },
  methods: {
    GoSeller() {
      this.$router.push({
        path: "/web/hyw/member/member/pageSeller"
      });
    }
  },
  computed: {
    ...mapState("memberForm", ["memberType", "isEdit", "memberId"])
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

