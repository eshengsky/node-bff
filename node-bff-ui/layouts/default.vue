<template>
  <el-container style="height: 100vh;">
    <el-header class="header">
      <div class="logo">node-bff</div>
      <div class="right">
        <div class="search" @click="searchVisible = true">
          <i class="el-icon-search" />搜索API
        </div>
        <div class="user">
          <el-dropdown placement="bottom-start" @command="handleCommand">
            <span class="el-dropdown-link">
              <img :src="user.avatar_url">
              <i class="el-icon-arrow-down el-icon--right" />
            </span>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item disabled>{{ user.name }}</el-dropdown-item>
              <el-dropdown-item disabled>@{{ user.username }}</el-dropdown-item>
              <el-dropdown-item divided />
              <el-dropdown-item command="logout">退出登录</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </div>
      </div>
    </el-header>
    <el-container style="height: calc(100vh - 60px);">
      <el-aside width="200px">
        <el-menu
          :router="true"
          :default-active="currentActive"
          style="height: 100%;"
        >
          <el-menu-item v-for="menu in menus" :key="menu.name" :index="menu.index">
            <font-icon :icon="menu.fontIcon" fixed-width />
            <span>{{ menu.title }}</span>
          </el-menu-item>
        </el-menu>
      </el-aside>
      <el-container class="container">
        <el-main class="main-container">
          <Nuxt />
        </el-main>
        <global-search v-model="searchVisible" @select-item="selectItem" />
      </el-container>
    </el-container>
  </el-container>
</template>
<script lang="ts">
import vue from 'vue';
import { IApi } from '~/types';
export default vue.extend({
  data () {
    return {
      searchVisible: false,
      menus: [{
        name: 'dashbord',
        title: '数据统计',
        fontIcon: ['fas', 'tachometer-alt'],
        index: '/'
      }, {
        name: 'list',
        title: 'API',
        fontIcon: ['fas', 'plug'],
        index: '/api'
      }, {
        name: 'test',
        title: 'API测试',
        fontIcon: ['fas', 'flask'],
        index: '/online-test'
      }, {
        name: 'category',
        title: '分类管理',
        fontIcon: ['fas', 'th-large'],
        index: '/category-manage'
      }, {
        name: 'environment',
        title: '环境配置',
        fontIcon: ['fas', 'cog'],
        index: '/public-env'
      }, {
        name: 'info',
        title: '系统信息',
        fontIcon: ['fas', 'info-circle'],
        index: '/system-info'
      }],
      user: this.$store.$auth.user
    };
  },
  computed: {
    currentActive () {
      if (this.$route.path.startsWith('/api')) {
        return '/api';
      }
      return this.$route.path;
    }
  },
  methods: {
    handleCommand (command: string) {
      if (command === 'logout') {
        this.$auth.logout();
      }
    },
    selectItem (item: IApi) {
      this.$router.push(`/api/${item._id}`);
    }
  }
});
</script>
<style lang="scss" scoped>
.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: rgb(84, 92, 100);
  .logo {
    display: flex;
    align-items: center;
    color: #fff;
    font-size: 24px;
  }
  .right {
    display: flex;
    align-items: center;
    .search {
      border-radius: 30px;
      width: 260px;
      height: 36px;
      line-height: 36px;
      padding: 0 15px;
      color: #999;
      background: #fff;
      cursor: pointer;
      margin-right: 20px;
      i {
        margin-right: 5px;
      }
    }
    .user {
      display: flex;
      align-items: center;
      .el-dropdown-link {
        display: flex;
        align-items: center;
        img {
          width: 40px;
          height: 40px;
          border-radius: 50%;
        }
        i {
          color: #fff;
        }
      }
    }
  }
}
.container {
  background: #f2f6fc;
  // padding: 20px;
  .main-container {
    background: #fff;
    // border: 1px solid #EBEEF5;
  }
}
</style>
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
  margin: 0;
  padding: 0;
  min-width: 1180px;
  background: #f6f8f9;
}

*,
*::before,
*::after {
  box-sizing: border-box;
}

.api-add-edit {
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
