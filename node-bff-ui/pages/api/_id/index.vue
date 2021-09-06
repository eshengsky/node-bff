<template>
  <div class="page-api-detail">
    <div v-if="apiData.status !== EnumStatus.regular" class="status-wrap">
      <status-alert :type="apiData.status" checked />
    </div>
    <div class="base-block">
      <div class="info-wrap">
        <div class="path-wrap">
          <el-tag class="method-tag" :type="getMethodType(apiData.method)">{{ apiData.method.toUpperCase() }}</el-tag>{{ apiData.path }}
        </div>
        <div class="name-wrap">{{ apiData.name }}</div>
        <div class="others-wrap">
          <div>分类：{{ apiData.category ? apiData.category.name : '默认分类' }}</div>
          <div>开发人员：{{ apiData.createdBy }}</div>
          <div>最近更新：{{ apiData.createdTime | formatTime }}</div>
          <div>
            当前版本：{{ apiData.version }}
            <el-link v-title="'查看发布说明'" class="btn-version-notes" :underline="false"><font-icon :icon="['far', 'file-alt']" @click="versionNotesShown = true" /></el-link>
          </div>
        </div>
      </div>
      <div class="action-wrap">
        <el-link :underline="false" @click="redirectTo(`/api/${apiData._id}/edit`)">
          <font-icon :icon="['fas', 'pencil-alt']" />编辑
        </el-link>
        <el-link :underline="false" @click="showVersionManage">
          <font-icon :icon="['fas', 'history']" />版本管理
        </el-link>
        <el-link :underline="false" @click="redirectTo(`/online-test?id=${apiData._id}`)">
          <font-icon :icon="['fas', 'flask']" />API测试
        </el-link>
      </div>
    </div>
    <div v-if="apiData.urlParams.length" class="common-block">
      <h2>URL参数</h2>
      <el-table :data="apiData.urlParams" border size="medium">
        <el-table-column prop="paramName" label="参数名" width="300" />
        <el-table-column prop="required" label="必传" width="100">
          <template slot-scope="{ row }">
            <i v-if="row.required" class="el-icon-check" />
          </template>
        </el-table-column>
        <el-table-column prop="remark" label="备注" />
      </el-table>
    </div>
    <div v-if="(apiData.bodyType === EnumBodyType.json && apiData.jsonParams.length) || (apiData.bodyType === EnumBodyType.formData && apiData.formParams.length)" class="common-block">
      <h2>
        Body参数<span>{{ apiData.bodyType === EnumBodyType.json ? 'JSON' : 'FormData' }}</span>
      </h2>
      <el-alert v-if="apiData.method === 'get'" type="warning" title="警告：GET请求设置Body参数可能无效！" :closable="false" style="margin-bottom: 10px;" />
      <template v-if="apiData.bodyType === EnumBodyType.json">
        <el-table
          :data="apiData.jsonParams"
          row-key="key"
          default-expand-all
          border
          size="medium"
        >
          <el-table-column prop="paramName" label="参数名" width="400">
            <template slot-scope="{ row }">
              <span :class="{ 'field-muted': isFieldMuted(row) }">{{ row.paramName }}</span>
              <!-- root节点的提示 -->
              <font-icon v-if="row.parentKey === 0" v-title="'表示JSON的根节点'" class="field-muted" :icon="['far', 'question-circle']" />
              <!-- item节点的提示 -->
              <font-icon v-else-if="isFieldMuted(row)" v-title="'表示数组的元素'" class="field-muted" :icon="['far', 'question-circle']" />
            </template>
          </el-table-column>
          <el-table-column prop="required" label="必传" width="100">
            <template slot-scope="{ row }">
              <i v-if="row.required" class="el-icon-check" />
            </template>
          </el-table-column>
          <el-table-column prop="type" label="类型" width="150" />
          <el-table-column prop="remark" label="备注" />
        </el-table>
      </template>
      <template v-else-if="apiData.bodyType === EnumBodyType.formData">
        <el-table :data="apiData.formParams" border size="medium">
          <el-table-column prop="paramName" label="参数名" width="300" />
          <el-table-column prop="required" label="必传" width="100">
            <template slot-scope="{ row }">
              <i v-if="row.required" class="el-icon-check" />
            </template>
          </el-table-column>
          <el-table-column prop="remark" label="备注" />
        </el-table>
      </template>
    </div>
    <div v-if="apiData.headerParams.length" class="common-block">
      <h2>Header参数</h2>
      <el-table :data="apiData.headerParams" border size="medium">
        <el-table-column prop="paramName" label="参数名" width="300" />
        <el-table-column prop="required" label="必传" width="100">
          <template slot-scope="{ row }">
            <i v-if="row.required" class="el-icon-check" />
          </template>
        </el-table-column>
        <el-table-column prop="remark" label="备注" />
      </el-table>
    </div>
    <div class="common-block">
      <h2>接口处理流程</h2>
      <flow-view :api-data="apiData" />
    </div>
    <version-manage
      :id="apiData.versionThread"
      v-model="versionManageShown"
      @updateCurrent="updateCurrent"
    />
    <version-notes v-model="versionNotesShown" :message="apiData.versionMessage" />
  </div>
</template>

<script lang="ts">
import vue from 'vue';
import dayjs from 'dayjs';
import { EnumBodyType, EnumStatus } from '~/types/enum';
import { IApi, IJsonParam } from '~/types';
export default vue.extend({
  name: 'ApiDetail',
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
  data () {
    return {
      apiData: {} as IApi,
      EnumBodyType,
      EnumStatus,
      versionManageShown: false,
      versionNotesShown: false
    };
  },
  methods: {
    getMethodType (method: string) {
      switch (method) {
        case 'get':
          return 'success';
        case 'post':
          return 'warning';
        case 'delete':
          return 'danger';
        case 'put':
          return '';
        default:
          return 'info';
      }
    },
    getNodeByKey (key: number): IJsonParam | undefined {
      let result;
      const search = (arr: IJsonParam[]) => {
        for (let i = 0; i < arr.length; i++) {
          const item = arr[i];
          if (item.key === key) {
            result = item;
            return;
          }
          if (item.children) {
            search(item.children);
          }
        }
      };
      search(this.apiData.jsonParams);
      return result;
    },
    isFieldMuted (row: IJsonParam): boolean {
      if (row.parentKey === 0) {
        return true;
      }
      const paretNode = this.getNodeByKey(row.parentKey);
      if (paretNode && paretNode.type === 'array') {
        return true;
      }
      return false;
    },
    redirectTo (url: string) {
      this.$router.push(url);
    },
    showVersionManage () {
      this.versionManageShown = true;
    },
    updateCurrent (id: string) {
      this.$router.replace(`/api/${id}`);
    }
  },
  filters: {
    formatTime (time: string) {
      return dayjs(time).format('YYYY-MM-DD HH:mm:ss');
    }
  }
});
</script>
<style lang="scss" scoped>
.status-wrap {
  margin-bottom: 20px;
}
.base-block {
  display: flex;
  border-bottom: 1px solid #EBEEF5;
  padding-bottom: 30px;
  margin-bottom: 30px;
  .info-wrap {
    flex: 1;
    .path-wrap {
      font-size: 20px;
      display: flex;
      align-items: center;
      margin-bottom: 15px;
      .method-tag {
        min-width: 60px;
        text-align: center;
        height: 28px;
        line-height: 28px;
        font-weight: 600;
        margin-right: 10px;
      }
    }
    .name-wrap {
      font-size: 16px;
      margin-bottom: 25px;
    }
    .others-wrap {
      display: flex;
      > div {
        margin-right: 50px;
        color: #555;
      }
      .btn-version-notes {
        padding: relative;
        top: -2px;
      }
    }
  }
  .action-wrap {
    flex: none;
    a {
      margin-right: 15px;
      svg {
        font-size: 13px;
        position: relative;
        top: -1px;
        margin-right: 5px;
      }
    }
  }
}
.common-block {
  margin-bottom: 30px;
  h2 {
    font-size: 18px;
    font-weight: 400;
    border-left: 3px solid #2395f1;
    padding-left: 10px;
    span {
      font-size: 12px;
      line-height: 12px;
      background: #999;
      color: #fff;
      border-radius: 4px;
      padding: 1px 4px;
      position: relative;
      top: -2px;
      margin-left: 4px;
    }
  }
  .field-muted {
    font-style: italic;
    opacity: .6;
  }
}
</style>
<style lang="scss">
.page-api-detail {
  .el-icon-check {
    font-weight: 600;
  }
}
</style>
