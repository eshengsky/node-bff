<template>
  <el-drawer
    ref="drawer"
    size="40%"
    :with-header="false"
    :visible="value"
    :append-to-body="true"
    @close="close"
    @closed="onClosedHandler"
  >
    <div class="drawer-container">
      <div class="drawer-header">{{ handlerTitle }}</div>
      <div class="drawer-body">
        <p class="type-name">
          {{ customTypeName }}
          <el-popover
            v-if="handlerClone.comment"
            placement="top-start"
            title="备注信息"
            width="400"
            trigger="hover"
            :content="handlerClone.comment"
          >
            <i slot="reference" class="el-icon-warning-outline" />
          </el-popover>
        </p>
        <code-editor
          ref="editor"
          language="typescript"
          :value="handlerClone.custom ? handlerClone.source : builtInFn"
          class="editor-container"
          :readonly="true"
        />
      </div>
    </div>
  </el-drawer>
</template>

<script lang="ts">
import vue, { PropOptions } from 'vue';
import { respFnKey } from '~/common/variables';
import { generateDefinition, generateBuiltInRespFn, getHandlerServicesName } from '~/common/utils';
import { IApi, IHandler } from '~/types';
export default vue.extend({
  name: 'HandlerModal',
  props: {
    value: {
      type: Boolean,
      default: false
    },
    apiData: {
      type: Object
    } as PropOptions<IApi>,
    handler: {
      type: Object
    } as PropOptions<IHandler>
  },
  data () {
    return {
      handlerOrigin: {} as IHandler,
      handlerClone: {} as IHandler,
      codeDisposeEvent: null
    };
  },
  computed: {
    isRespFn (): boolean {
      return this.handlerClone.key === respFnKey;
    },
    builtInFn (): string {
      if (this.isRespFn) {
        return generateBuiltInRespFn(this.apiData);
      }
      return `export default function (): void {
}`;
    },
    customTypeName (): string {
      if (!this.handlerClone.custom) {
        if (this.isRespFn) {
          return '使用默认函数（自动聚合接口响应）';
        }
        return '使用默认函数（不执行任何操作）';
      }
      return '自定义函数逻辑';
    },
    handlerTitle (): string {
      return getHandlerServicesName(this.handler, this.apiData);
    }
  },
  methods: {
    addTypeDefinition () {
      const libSource = generateDefinition(this.apiData, 0);
      this.codeDisposeEvent = (this.$refs.editor as any).monaco.languages.typescript.typescriptDefaults.addExtraLib(libSource);
    },
    close () {
      this.$emit('input', false);
    },
    onClosedHandler () {
      // 移除类型定义，下次打开弹窗时再动态生成
      if (this.codeDisposeEvent) {
        (this.codeDisposeEvent as any).dispose();
      }
    }
  },
  watch: {
    value (val: Boolean) {
      if (val) {
        this.handlerOrigin = JSON.parse(JSON.stringify(this.handler));
        this.handlerClone = JSON.parse(JSON.stringify(this.handler));
        setTimeout(() => {
          // 抽屉弹出后，才加载ts类型定义
          this.addTypeDefinition();
        }, 0);
      }
    }
  }
});
</script>

<style lang="scss" scoped>
.drawer-container {
  display: flex;
  flex-direction: column;
  height: 100vh;
  .drawer-header {
    height: 60px;
    flex: none;
    font-size: 18px;
    display: flex;
    align-items: center;
    padding-left: 24px;
  }
  .drawer-body {
    flex: 1;
    display: flex;
    flex-direction: column;
    .type-name {
      margin: 0 0 15px 20px;
    }
    .editor-container {
      flex: 1;
      margin-bottom: 15px;
    }
  }
  .drawer-footer {
    text-align: right;
    margin: 0 15px 15px 0;
  }
}
</style>
