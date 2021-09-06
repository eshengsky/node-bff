<template>
  <api-add-or-edit ref="comp" />
</template>

<script lang='ts'>
import vue from 'vue';
import leaveConfirm from '~/mixins/leaveConfirm';
export default vue.extend({
  name: 'ApiNew',
  mixins: [leaveConfirm]
});
</script>
