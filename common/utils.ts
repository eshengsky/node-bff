import { IApi } from '~/types';
export function generateDefinition (apiData: IApi, flowIndex?: number): string {
  // 动态生成url参数的定义
  let urlDefinition = '';
  if (apiData.urlParams.length) {
    apiData.urlParams.forEach((param) => {
      urlDefinition += `
        ${param.remark ? '/** ' + param.remark + ' */' : ''}
        ${param.paramName}${param.required ? '' : '?'}: string;
      `;
    });
  }

  // 动态生成请求头参数的定义
  let headerDefinition = '';
  if (apiData.headerParams.length) {
    apiData.headerParams.forEach((param) => {
      headerDefinition += `
        ${param.remark ? '/** ' + param.remark + ' */' : ''}
        ${param.paramName}${param.required ? '' : '?'}: string;
      `;
    });
  }

  if (typeof flowIndex !== 'undefined') {
    console.log(flowIndex);
  }

  const libSource = `
/**
 * 除undefined之外的其它任意类型
 */
type IJson = string | number | boolean | null | object | Array<any> | Date | RegExp;

/**
* 返回值类型
*/
declare interface IRespData {
  code: number;
  message?: string;
  debugMessage?: string;
  data?: any;
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
      allNames.push(...item.services.map(service => service.name));
    }
  });
  let code = '';
  if (allNames.length) {
    code += '{';
    allNames.forEach((name: string) => {
      code += `\n      ${name}: context.$${name}`;
    });
    code += '\n    }';
  } else {
    code = '{}';
  }
  return `export default function (context: IContext): IRespData {
  return {
    code: 1,
    data: ${code}
  }
}`;
}
