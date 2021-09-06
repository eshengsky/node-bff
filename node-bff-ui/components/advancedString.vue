<template>
  <el-form ref="form" :model="form" label-width="100px">
    <el-form-item label="默认值">
      <el-input v-model="form.defaultValue" placeholder="非必填项才可以设置参数的默认值" />
    </el-form-item>
    <el-form-item label="最小长度">
      <el-input-number v-model="form.minLength" :min="0" />
    </el-form-item>
    <el-form-item label="最大长度">
      <el-input-number v-model="form.maxLength" :min="0" />
    </el-form-item>
    <el-form-item label="正则表达式">
      <el-input v-model="form.regexp" placeholder="使用正则表达式验证" />
    </el-form-item>
    <el-form-item label="枚举">
      <el-input v-model="form.enums" type="textarea" :rows="3" placeholder="每行一个枚举值" />
    </el-form-item>
  </el-form>
</template>

<script lang="ts">
import vue from 'vue';
export default vue.extend({
  name: 'AdvancedString',
  props: {
    paramObj: Object
  },
  data () {
    return {
      form: {
        defaultValue: this.paramObj.defaultValue || '',
        minLength: this.paramObj.minLength || '',
        maxLength: this.paramObj.maxLength || '',
        regexp: this.paramObj.regexp || '',
        enums: this.paramObj.enums || []
      }
    };
  },
  methods: {
    validate () {
      
    }
  }
});
</script>
