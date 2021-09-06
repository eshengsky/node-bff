import { respFnKey } from './variables';
import { IApi, ICommonParam, IHandler, IServiceGroup } from '~/types';

function definitionFn (paramsList: ICommonParam[]) {
  let definition = '';
  paramsList.forEach((param) => {
    const propName = param.paramName.includes('-') ? `'${param.paramName}'` : param.paramName;
    definition += `
      ${param.remark ? '/** ' + param.remark + ' */' : ''}
      ${propName}${param.required ? '' : '?'}: string;
    `;
  });
  return definition;
}
export function generateDefinition (apiData: IApi, flowIndex?: number): string {
  // 动态生成url参数的定义
  const urlDefinition = definitionFn(apiData.urlParams);

  // 动态生成请求头参数的定义
  const headerDefinition = definitionFn(apiData.headerParams);

  if (typeof flowIndex !== 'undefined') {
    console.log(flowIndex);
  }

  const libSource = `
/**
 * 除undefined之外的其它任意类型
 */
type IJson = string | number | boolean | null | object | Array<any> | Date | RegExp;

/**
* 响应内容定义
*/
declare interface IRespData {
  /** 错误码 */
  code: number;

  /** 给用户看的错误消息 */
  message?: string;

  /** 给开发看的错误消息 */
  debugMessage?: string;

  /** 数据对象 */
  data?: any;
}

/**
* 响应定义
*/
declare interface IResp {
  /** HTTP状态码，默认200 */
  status?: number;

  /** 响应内容 */
  data?: IRespData | null;

  /** 响应头 */
  headers?: {
    [key: string]: string | number | readonly string[]
  };
}

/**
* 当前接口的上下文对象
*/
declare interface IContext {
  /** 请求参数 */
  $request: {
    /** 
     * 请求路径
     * 
     * ${apiData.path}
     */
    path: string,
    /** URL参数 */
    query: {
      ${urlDefinition}
    },
    /** 请求体参数 */
    body: any,
    /** 请求头参数 */
    headers: {
      ${headerDefinition}
    }
  };

  /** 公共参数及环境变量 */
  $public: Object;

  /** 获取对象任意深度的属性 */
  $getValue: Function;

  [x: string]: any
}`;
  return libSource;
}

export function generateBuiltInRespFn (apiData: IApi): string {
  const allNames: string[] = [];
  apiData.flowchart.forEach((item) => {
    if (item.type === 'services') {
      allNames.push(...item.services.map(service => service.no));
    }
  });
  let code = '';
  if (allNames.length) {
    code += '{';
    allNames.forEach((name: string, index: number) => {
      code += `\n        ${name}: context.$${name}${index === allNames.length - 1 ? '' : ','}`;
    });
    code += '\n      }';
  } else {
    code = '{}';
  }
  return `export default function (context: IContext): IResp {
  return {
    status: 200,
    data: {
      code: 1,
      data: ${code}
    }
  }
}`;
}

/**
 * 判断当前代码是否是表达式
 * 用在workflow接口调用时URL参数值的设置
 */
export function isExpression (code: string) {
  if (/^\s*function\s/.test(code)) {
    return false;
  }
  try {
    // eslint-disable-next-line no-new,no-new-func
    new Function('return ' + code);
    return true;
  } catch (e) {
    return false;
  }
}

export function getHandlerServicesName (item: IHandler | IServiceGroup, apiData: IApi) {
  if (item.type === 'handler' && item.key === respFnKey) {
    return '最终处理函数';
  }
  let handlerNum = 0;
  let serviceGroupNum = 0;
  for (let i = 0; i < apiData.flowchart.length; i++) {
    const current = apiData.flowchart[i];
    if (current.type === 'handler') {
      handlerNum++;
      if (item.key === current.key) {
        return `一般处理函数${handlerNum}`;
      }
    } else if (current.type === 'services') {
      serviceGroupNum++;
      if (item.key === current.key) {
        return `接口组${serviceGroupNum}`;
      }
    }
  }
  return '';
}

export function formatCostTime (costTime: number) {
  if (costTime < 1000) {
    return {
      time: Math.round(costTime * 100) / 100,
      unit: 'ms',
      originTime: costTime
    };
  }
  return {
    time: Math.round(costTime / 1000 * 100) / 100,
    unit: 's',
    originTime: costTime
  };
}
