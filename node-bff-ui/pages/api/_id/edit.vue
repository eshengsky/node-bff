<template>
  <api-add-or-edit ref="comp" :api-data="data" />
</template>
<script>
import vue from 'vue';
import leaveConfirm from '~/mixins/leaveConfirm';
export default vue.extend({
  name: 'ApiEdit',
  mixins: [leaveConfirm],
  async asyncData ({ $axios, params, error }) {
    try {
      const { code, data } = await $axios.$get('/api', {
        params: {
          id: params.id
        }
      });
      if (code === 1) {
        if (!data) {
          error({
            statusCode: 404,
            message: '找不到该接口'
          });
        } else {
          // 对数据预处理
          data.category = data.category || 'default';
          data.lastVersion = data.version;
          data.version = '';
          data.versionMessage = '';
          return {
            data
          };
        }
      } else {
        error({
          statusCode: 500,
          message: '内部服务器错误'
        });
      }
    } catch (err) {
      error({
        statusCode: 500,
        message: '内部服务器错误'
      });
    }
  }
});
</script>
