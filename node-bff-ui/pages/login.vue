<template>
  <div>
    <el-button type="primary" @click="login">登录</el-button>
  </div>
</template>

<script lang="ts">
import vue from 'vue';
export default vue.extend({
  name: 'Login',
  layout: 'empty',
  methods: {
    login () {
      this.$auth.loginWith('social');
    }
  }
});
</script>
