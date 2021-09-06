import vue from 'vue';
export default vue.extend({
  beforeRouteLeave (_to, _from, next) {
    // 判断是否存在修改
    const comp: any = this.$refs.comp;
    if (JSON.stringify(comp.apiData, null, 2) === comp.apiDataCopyStr) {
      next();
      return;
    }
    const answer = window.confirm('更改还未保存，确定要离开吗？');
    if (answer) {
      next();
    } else {
      next(false);
    }
  },
  mounted () {
    window.onbeforeunload = (event: BeforeUnloadEvent) => {
      // 判断是否存在修改
      const comp: any = this.$refs.comp;
      if (JSON.stringify(comp.apiData, null, 2) !== comp.apiDataCopyStr) {
        event.preventDefault();
        event.returnValue = '更改还未保存，确定要离开吗？';
      }
    };
  }
});
