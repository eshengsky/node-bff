<template>
  <el-drawer
    ref="drawer"
    size="40%"
    :with-header="false"
    :visible="value"
    :before-close="beforeClose"
    @close="close"
    @closed="onClosedHandler"
  >
    <div class="drawer-container">
      <div class="drawer-header">{{ handlerTitle }}</div>
      <div class="drawer-body">
        <div class="radio-group">
          <el-radio-group v-model="handlerClone.custom">
            <el-radio :label="false">{{ isRespFn ? '使用默认函数（自动聚合接口响应）' : '使用默认函数（不执行任何操作）' }}</el-radio>
            <el-radio :label="true">自定义函数逻辑</el-radio>
          </el-radio-group>
        </div>
        <!-- 默认函数代码Editor，只读属性 -->
        <code-editor
          v-show="!handlerClone.custom"
          ref="editor0"
          language="typescript"
          :value="builtInFn"
          class="editor-container"
          :readonly="true"
        />
        <!-- 自定义函数代码Editor -->
        <code-editor
          v-show="handlerClone.custom"
          ref="editor"
          language="typescript"
          :value="handlerClone.source || customFnTemplate"
          class="editor-container"
          @editorDidMount="editorDidMount"
        />
        <div v-show="handlerClone.custom" class="comment-wrap">
          <el-input
            v-model="handlerClone.comment"
            type="textarea"
            :rows="2"
            class="comment"
            placeholder="备注信息，如代码逻辑、注意事项等"
          />
        </div>
      </div>
      <div class="drawer-footer">
        <el-button @click="cancel">取消</el-button>
        <el-button type="primary" @click="confirm">确定</el-button>
      </div>
    </div>
  </el-drawer>
</template>

<script lang="ts">
import vue, { PropOptions } from 'vue';
import { commonFnReg, respFnReg, respFnKey, defaultRespFn, defaultCommonFn } from '~/common/variables';
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
    // 默认函数的代码
    builtInFn (): string {
      if (this.isRespFn) {
        return generateBuiltInRespFn(this.apiData);
      }
      return `export default function (): void {
}`;
    },
    // 自定义函数的代码模板
    customFnTemplate (): string {
      return this.isRespFn ? defaultRespFn : defaultCommonFn;
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
    editorDidMount (editor: any) {
      const model = editor.getModel();
      const doUndo = () => Promise.resolve().then(() => {
        model.undo();
      });

      // 监听代码改动
      model.onDidChangeContent(({ isUndoing }: { isUndoing: boolean }) => {
        if (!isUndoing) {
          const value: string = model.getValue();
          const matched = value.match(this.isRespFn ? respFnReg : commonFnReg);
          // 代码符合正则，且匹配项就是完整的代码，说明代码外层没有被修改
          if (matched && matched[0] === value) {
            // 必须是自定义函数，才设置source值
            if (this.handlerClone.custom) {
              this.handlerClone.source = value;
            }
          } else {
            console.log('=== Undo ===', matched, value);
            doUndo();
          }
        }
      });
    },
    confirm () {
      if (this.handlerClone.custom) {
        // FIXME:这里有个Bug：语法检查是需要时间的，如果检查结束之前就点击了确定，就有问题，待修复
        // 检查是否存在语法错误
        const markers = (this.$refs.editor as any).getMarkers();
        const errors: any[] = [];
        if (markers && markers.length) {
          // 只关注警告和错误的marker
          markers.forEach((marker: any) => {
            if (marker.severity === 4 || marker.severity === 8) {
              errors.push(markers);
            }
          });
        }
        if (errors.length) {
          console.log('错误列表：', errors);
          this.$message.error('代码存在错误或警告，请检查并修改！');
          return;
        }
        this.handlerClone.source = (this.$refs.editor as any).getEditor().getValue();
      }
      this.handlerOrigin = this.handlerClone;
      (this.$refs.drawer as any).closeDrawer();
      this.$emit('updateHandler', this.handlerClone);
    },
    cancel () {
      (this.$refs.drawer as any).closeDrawer();
    },

    /**
     * 关闭之前的回调
     * 检查是否做出过修改
     * 如果存在修改则弹窗提示
     * 否则直接关闭
     */
    beforeClose (done: Function) {
      if (JSON.stringify(this.handlerOrigin) === JSON.stringify(this.handlerClone)) {
        done();
      } else {
        this.$confirm('检测到未保存的内容，是否要保存修改？', '提示', {
          distinguishCancelAndClose: true,
          confirmButtonText: '保存',
          cancelButtonText: '放弃修改',
          type: 'warning'
        }).then(() => {
          this.confirm();
        }).catch((action) => {
          if (action === 'cancel') {
            done();
          }
        });
      }
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
    .radio-group {
      margin: 0 0 15px 20px;
    }
    .editor-container {
      flex: 1;
      margin-bottom: 15px;
    }
    .comment-wrap {
      margin: 0 15px 15px;
    }
  }
  .drawer-footer {
    text-align: right;
    margin: 0 15px 15px 0;
  }
}
</style>
