<template>
  <el-drawer
    size="30%"
    :with-header="false"
    :visible="value"
    @close="close"
  >
    <div v-loading="loading" class="versions-wrap">
      <div class="drawer-header">版本管理</div>
      <div class="drawer-body">
        <el-timeline v-if="apiDataList.length">
          <el-timeline-item
            v-for="item in apiDataList"
            :key="item._id"
            size="large"
            :type="item.versionActive ? 'success' : ''"
            :timestamp="item.createdTime | formatTime"
            placement="top"
          >
            <el-card shadow="hover" class="card" :class="{ active: item.versionActive }">
              <div slot="header" class="card-header">
                <span class="version">
                  {{ item.version }}
                  <span v-if="item.versionActive">(当前版本)</span>
                </span>
                <div>
                  <el-button v-if="!item.versionActive" plain size="small" @click="setCurrent(item._id, item.versionThread, item.version)">设为当前版本</el-button>
                  <el-button plain size="small" @click="compareVersions">比较变更...</el-button>
                </div>
              </div>
              <el-collapse :value="item.versionActive ? item._id : ''">
                <el-collapse-item title="发布说明" :name="item._id">
                  <md-viewer :value="item.versionMessage" />
                </el-collapse-item>
              </el-collapse>
            </el-card>
          </el-timeline-item>
        </el-timeline>
      </div>
    </div>
  </el-drawer>
</template>

<script lang="ts">
import dayjs from 'dayjs';
import vue from 'vue';
import { IApi } from '~/types';
export default vue.extend({
  name: 'VersionManage',
  props: {
    id: {
      type: String
    },
    value: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      apiDataList: [] as IApi[],
      loading: false
    };
  },
  methods: {
    close () {
      this.$emit('input', false);
    },
    setCurrent (id: string, versionThread: string, version: string) {
      this.$confirm(`确定要将 ${version} 设为当前版本吗？`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        try {
          const data = await this.$axios.$put('/api/current', null, {
            params: {
              id,
              versionThread
            }
          });
          if (data.code === 1) {
            this.$emit('updateCurrent', data.data.current);
            this.$message.success('操作成功！');
            this.close();
          } else {
            this.$message.error(data.message);
          }
        } catch (err) {
          console.error(err);
          this.$message.error('网络错误，请稍后重试');
        }
      });
    },
    compareVersions () {
      this.$message.info('TODO');
    }
  },
  filters: {
    formatTime (time: string) {
      return dayjs(time).format('YYYY-MM-DD HH:mm:ss');
    }
  },
  watch: {
    async value (val: Boolean) {
      if (val) {
        this.loading = true;
        try {
          const data = await this.$axios.$get('/api/versions', {
            params: {
              id: this.id
            }
          });
          if (data.code === 1) {
            this.apiDataList = data.data;
          } else {
            this.apiDataList = [];
            this.$message.error(data.message);
          }
        } catch (err) {
          this.apiDataList = [];
          this.$message.error('网络错误，请稍后重试');
        }
        this.loading = false;
      } else {
        this.apiDataList = [];
      }
    }
  }
});
</script>
<style lang="scss" scoped>
.versions-wrap {
  height: 100vh;
  .drawer-header {
    height: 60px;
    font-size: 18px;
    display: flex;
    align-items: center;
    padding-left: 24px;
  }
  .drawer-body {
    height: calc(100vh - 60px);
    overflow-y: auto;
    padding-right: 30px;
    .card {
      margin-top: 15px;
      margin-bottom: 20px;
      color: #909399;
      &.active {
        color: #333;
      }
      .card-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        height: 22px;
        .version {
          font-size: 18px;
          font-weight: 500;
          span {
            font-weight: 400;
            color: #909399;
          }
        }
      }
    }
  }
}
</style>
<style lang="scss">
.versions-wrap {
  .el-collapse {
    border: 0;
  }
  .el-collapse-item__header,
  .el-collapse-item__wrap {
    border: 0;
  }
  .el-collapse-item__header {
    color: #909399;
  }
  .card.active {
    .el-collapse-item__header {
      color: #333;
    }
  }
  .el-collapse-item__content {
    padding: 0;
  }
  .el-card__body {
    padding: 10px 20px;
  }
}
</style>
