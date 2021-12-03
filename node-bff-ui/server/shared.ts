import { transformSync } from '@babel/core';
import { getHandlerServicesName, generateBuiltInRespFn } from '../common/utils';
import { IApi } from '../types/index';
import { respFnKey } from '../common/variables';

// 处理handler代码
// 如果选中了使用默认函数，则清空source字段，因为source字段暂存的是用户自定义代码
export function fixHandlers (api: IApi) {
  api.flowchart.forEach((item) => {
    if (item.type === 'handler' && !item.custom) {
      item.source = '';
    }
  });
}

const compileOptions = {
  plugins: ['@babel/plugin-transform-typescript'],
  presets: ['@babel/preset-env'],
  parserOpts: {
    // 允许非函数内的return关键字
    allowReturnOutsideFunction: true
  },
  generatorOpts: {
    // 压缩代码
    minified: true,
    // 去除注释
    comments: false
  }
};

function getErrMsg (msg: string) {
  const idx = msg.indexOf('\n\n');
  if (idx > 0) {
    return msg.substring(0, idx);
  }
  return msg;
}

function getFuncBody (source: string) {
  return source.substring(source.indexOf('\n') + 1, source.lastIndexOf('\n'));
}

/**
 * 编译处理函数和接口调用中的body函数
 * 注意只编译函数体部分，这是因为service端使用的是 new Function 而非 eval
 */
export function compileFunctions (api: IApi): string | void {
  for (let i = 0; i < api.flowchart.length; i++) {
    const current = api.flowchart[i];
    if (current.type === 'handler') {
      const handlerTitle = getHandlerServicesName(current, api);
      if (!current.custom) {
        if (current.key !== respFnKey) {
          // 一般处理函数，使用默认函数，无需编译
          continue;
        } else {
          // 最终处理函数，使用默认函数
          const code = getFuncBody(generateBuiltInRespFn(api));
          try {
            const result = transformSync(code, compileOptions);
            if (result && result.code) {
              current.sourceCompiled = result.code;
            } else {
              return `${handlerTitle} 编译失败`;
            }
          } catch (err) {
            console.error(`${handlerTitle} 编译失败`, err);
            return `${handlerTitle} 编译失败：${getErrMsg(err.message)}`;
          }
        }
      } else {
        // 使用自定义函数，直接读source即可
        const code = getFuncBody(current.source);
        try {
          const result = transformSync(code, compileOptions);
          if (result && result.code) {
            current.sourceCompiled = result.code;
          } else {
            return `${handlerTitle} 编译失败`;
          }
        } catch (err: any) {
          console.error(`${handlerTitle} 编译失败`, err);
          return `${handlerTitle} 编译失败：${getErrMsg(err.message)}`;
        }
      }
    }
  }
}
