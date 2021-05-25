<template>
  <div>
    {{ apiData.name }}
    <div>{{ apiData.version }}</div>
    <el-button type="text" @click="goEdit">编辑</el-button>
  </div>
</template>

<script>
import vue from 'vue';
export default vue.extend({
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
          data.category = data.category || '';
          return {
            apiData: data
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
  },
  methods: {
    goEdit () {
      location.href = `/api/${this.apiData._id}/edit`;
    }
  }
});
</script>
