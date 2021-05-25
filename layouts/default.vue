<template>
  <Nuxt />
</template>
<style lang="scss">
html {
  font-family:
    'Source Sans Pro',
    -apple-system,
    BlinkMacSystemFont,
    'Segoe UI',
    Roboto,
    'Helvetica Neue',
    Arial,
    sans-serif;
  font-size: 14px;
  word-spacing: 1px;
  -ms-text-size-adjust: 100%;
  -webkit-text-size-adjust: 100%;
  -moz-osx-font-smoothing: grayscale;
  -webkit-font-smoothing: antialiased;
  box-sizing: border-box;
}

body {
  min-width: 1180px;
}

*,
*::before,
*::after {
  box-sizing: border-box;
}

.container {
  .el-table--enable-row-hover .el-table__body tr:hover > td {
    background-color: #fff !important;
  }

  .el-tabs--border-card {
    box-shadow: none;
    border-radius: 4px;
    overflow: hidden;
  }

  .tab-panel {
    margin: -16px;
    .switch-body {
      margin: 20px 0 15px 15px;
    }
    .body-none {
      line-height: 40px;
      padding: 20px 0 10px;
      text-align: center;
      color: #999;
    }
  }
}
</style>
