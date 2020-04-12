<template>
  <div class="header">
    <a-dropdown>
      <a-icon type="global" />
      <a-menu
        slot="overlay"
        :selectedKeys="[$route.query.locale || 'zh_CN']"
        @click="localeChange"
      >
        <a-menu-item key="zh_CN">
          <a href="javascript:;">中文</a>
        </a-menu-item>
        <a-menu-item key="en_US">
          <a href="javascript:;">English</a>
        </a-menu-item>
      </a-menu>
    </a-dropdown>
  </div>
</template>

<script>
export default {
  methods: {
    localeChange({ key }) {
      this.$router.push({
        query: {
          ...this.$route.query,
          locale: key
        }
      });
      this.$i18n.locale = key;
    }
  }
};
</script>

<style lang="less" scoped>
.header {
  float: right;
  margin-right: 30px;
}
</style>
