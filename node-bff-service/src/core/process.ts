/* eslint-disable @typescript-eslint/no-implied-eval */
import httpStatus from 'http-status';
import axios, { AxiosRequestConfig, Method } from 'axios';
import Joi from 'joi';
import {
  IApi, ICommonParam, IHandler, IJsonParam, IService, IServiceGroup, IServiceParam,
} from '../types';
import { IResp } from '../types/response';
import { ILog } from '../types/log';
import { EnumBodyType, EnumStatus } from '../types/enum';

const respFnKey = 999;

const instance = axios.create({
  timeout: 5000,
});
instance.interceptors.response.use((response) => response, (error) => {
  // 服务器给出了响应
  if (error.response) {
    return Promise.resolve(error.response);
  }
  // 请求已经发出了，但服务器一直无响应
  if (error.request) {
    console.error('服务器无响应！', error.config);
    return Promise.resolve({
      status: httpStatus.INTERNAL_SERVER_ERROR,
      statusText: httpStatus[500],
      data: {
        code: -1,
        message: error.message,
      },
      config: error.config,
    });
  }
  // 请求没有发出去，就出错了
  console.error('请求发送失败！', error.config);
  return Promise.resolve({
    status: httpStatus.BAD_REQUEST,
    statusText: httpStatus[400],
    data: {
      code: -1,
      message: error.message,
    },
    config: error.config,
  });
});

/**
 * 获取当前handler或接口组的名称
 */
function getHandlerServicesName(item: IHandler | IServiceGroup, apiData: IApi): string {
  if (item.type === 'handler' && item.key === respFnKey) {
    return '最终处理函数';
  }
  let handlerNum = 0;
  let serviceGroupNum = 0;
  for (let i = 0; i < apiData.flowchart.length; i += 1) {
    const current = apiData.flowchart[i];
    if (current.type === 'handler') {
      handlerNum += 1;
      if (item.key === current.key) {
        return `一般处理函数${handlerNum}`;
      }
    } else if (current.type === 'services') {
      serviceGroupNum += 1;
      if (item.key === current.key) {
        return `接口组${serviceGroupNum}`;
      }
    }
  }
  return '';
}

// 生成参数对象
// 如果返回-1，说明有执行错误
function generateKeyValueObj(list: IServiceParam[], service: IService, context: any) {
  const data: any = {};
  for (let j = 0; j < list.length; j += 1) {
    const param = list[j];
    // 参数值类型为表达式，需要执行表达式获取返回值
    if (param.valType === 'expression') {
      try {
        const fn = new Function('context', param.paramValue);
        data[param.paramName] = fn(context);
      } catch (err) {
        console.error(`${service.no} - ${param.paramName} 参数表达式执行出错！`, err);
        return {
          hasErr: true,
          data: {
            status: httpStatus.INTERNAL_SERVER_ERROR,
            data: {
              code: -1,
              message: `${service.no} - ${param.paramName} 参数表达式执行出错！${err.message}`,
            },
          } as IResp,
        };
      }
    } else {
      data[param.paramName] = param.paramValue;
    }
  }
  return {
    hasErr: false,
    data,
  };
}

// 生成Params参数校验规则
function generateJoiSchema(params: ICommonParam[]) {
  const obj: Joi.SchemaMap = {};
  params.forEach((param) => {
    let schema = Joi.string();
    if (param.required) {
      schema = schema.required();
    }
    obj[param.paramName] = schema;
  });
  return Joi.object(obj).unknown();
}

// 生成JSON参数校验规则
function generateJoiJsonSchema(paramNode: IJsonParam) {
  switch (paramNode.type) {
    case 'object': {
      let schema: Joi.Schema;
      if (paramNode.children && paramNode.children.length) {
        const obj: Joi.SchemaMap = {};
        paramNode.children.forEach((param) => {
          obj[param.paramName] = generateJoiJsonSchema(param);
        });
        schema = Joi.object(obj).unknown();
      } else {
        schema = Joi.object().unknown();
      }
      if (paramNode.required) {
        schema = schema.required();
      }
      return schema;
    }
    case 'array': {
      let schema = Joi.array();
      // 取children的第1个元素，作为数组的元素对象
      if (paramNode.children && paramNode.children.length) {
        const item = paramNode.children[0];
        const itemSchema = generateJoiJsonSchema(item);
        schema = schema.items(itemSchema);
      }
      if (paramNode.required) {
        schema = schema.required();
      }
      return schema;
    }
    case 'string': {
      let schema = Joi.string();
      if (paramNode.required) {
        schema = schema.required();
      }
      return schema;
    }
    case 'number': {
      let schema = Joi.number();
      if (paramNode.required) {
        schema = schema.required();
      }
      return schema;
    }
    case 'boolean': {
      let schema = Joi.boolean();
      if (paramNode.required) {
        schema = schema.required();
      }
      return schema;
    }
    default:
      return Joi.object().unknown();
  }
}

if (!('toJSON' in Error.prototype)) {
  // eslint-disable-next-line no-extend-native
  Object.defineProperty(Error.prototype, 'toJSON', {
    value() {
      const alt: any = {
        isError: true,
      };

      Object.getOwnPropertyNames(this).forEach((key: string) => {
        alt[key] = this[key];
      }, this);

      return alt;
    },
    configurable: true,
    writable: true,
  });
}

export default async (reqObj: any, apiData: IApi, isDebug = false): Promise<IResp> => {
  // 调试模式下的日志生成
  const exts = {
    logs: [] as ILog[],
    apiData,
  };
  const myConsole: any = {};
  // 替换原生console
  ['log', 'info', 'warn', 'error'].forEach((level: 'log' | 'info' | 'warn' | 'error') => {
    myConsole[level] = (...args: any[]) => {
      if (isDebug) {
        exts.logs.push({
          time: Date.now(),
          level,
          messages: args,
        });
      }
      console[level].apply(args);
    };
  });

  // 返回IResp对象
  const sendResponse = (response: IResp) => {
    // 接口已被废弃
    if (apiData.status === EnumStatus.deprecated) {
      // 设置警告首部
      if (!response.headers) {
        response.headers = {};
      }
      // 参考链接：
      // https://stackoverflow.com/questions/13884141/convention-for-http-response-header-to-notify-clients-of-deprecated-api
      response.headers.Warning = '299 - "Deprecated API"';
    }
    if (isDebug) {
      response.exts = exts;
    }

    return response;
  };

  // 接口已被删除
  if (apiData.status === EnumStatus.deleted) {
    // 返回404 - 不存在该资源
    return sendResponse({
      status: httpStatus.NOT_FOUND,
    });
  }

  // 参数校验
  // URL参数校验
  const urlParamsValidate = generateJoiSchema(apiData.urlParams).validate(reqObj.query);
  if (urlParamsValidate.error) {
    return sendResponse({
      status: httpStatus.BAD_REQUEST,
      data: {
        code: -1,
        message: urlParamsValidate.error.message,
      },
    });
  }

  // FORM参数校验
  if (apiData.bodyType === EnumBodyType.formData) {
    const formParamsValidate = generateJoiSchema(apiData.formParams).validate(reqObj.body);
    if (formParamsValidate.error) {
      return sendResponse({
        status: httpStatus.BAD_REQUEST,
        data: {
          code: -1,
          message: formParamsValidate.error.message,
        },
      });
    }
  } else if (
    apiData.bodyType === EnumBodyType.json
    && apiData.jsonParams
    && apiData.jsonParams.length
  ) {
    const jsonParamsValidate = generateJoiJsonSchema(apiData.jsonParams[0]).validate(reqObj.body);
    if (jsonParamsValidate.error) {
      return sendResponse({
        status: httpStatus.BAD_REQUEST,
        data: {
          code: -1,
          message: jsonParamsValidate.error.message,
        },
      });
    }
  }

  // Header参数校验
  // 需要先将key转为小写，因为node接收到的headers的key全是小写
  const headerParamsClone: ICommonParam[] = [];
  const reqHeadersToValid: any = {};
  apiData.headerParams.forEach((param) => {
    const paramName = param.paramName.toLowerCase();
    headerParamsClone.push({
      key: param.key,
      paramName,
      required: param.required,
    });
    if (reqObj.headers[paramName]) {
      reqHeadersToValid[paramName] = reqObj.headers[paramName];
    }
  });
  const headerParamsValidate = generateJoiSchema(headerParamsClone).validate(reqHeadersToValid);
  if (headerParamsValidate.error) {
    return sendResponse({
      status: httpStatus.BAD_REQUEST,
      data: {
        code: -1,
        message: headerParamsValidate.error.message,
      },
    });
  }

  // 构建context对象
  const context: any = {
    $request: {
      path: reqObj.path,
      query: reqObj.query,
      body: reqObj.body,
      headers: reqObj.headers,
    },
    $public: {},
    $getValue: () => {}, // TODO:
  };

  for (let i = 0; i < apiData.flowchart.length; i += 1) {
    const current = apiData.flowchart[i];
    switch (current.type) {
      // 当前是处理函数
      case 'handler':
        if (isDebug) {
          current.beforeContext = JSON.stringify(context, null, 2);
        }
        if (current.custom || current.key === respFnKey) {
          // 自定义的函数，或者最终处理函数的默认函数，一定存在 sourceCompiled 字段
          try {
            const fn = new Function('context', 'console', current.sourceCompiled);
            const response: IResp = fn(context, myConsole);
            // 如果有返回值，说明应该直接响应
            if (response) {
              return sendResponse(response);
            }
            if (isDebug) {
              current.afterContext = JSON.stringify(context, null, 2);
            }
          } catch (err) {
            const hsName = getHandlerServicesName(current, apiData);
            console.error(`${hsName}执行出错！`, err);
            return sendResponse({
              status: httpStatus.INTERNAL_SERVER_ERROR,
              data: {
                code: -1,
                message: `${hsName}执行出错！${err.message}`,
              },
            });
          }
        } else if (isDebug) {
          current.afterContext = JSON.stringify(context, null, 2);
        }
        break;
      case 'services':
        if (current.services.length) {
          const hsName = getHandlerServicesName(current, apiData);
          const arr: AxiosRequestConfig[] = [];
          for (let j = 0; j < current.services.length; j += 1) {
            const service = current.services[j];
            const options: AxiosRequestConfig = {
              url: service.path,
              method: service.method as Method,
            };

            // 构建URL参数
            if (service.urlParams.length) {
              const obj = generateKeyValueObj(service.urlParams, service, context);
              if (obj.hasErr) {
                return sendResponse(obj.data);
              }
              options.params = obj.data;
            }

            // 构建Path参数
            if (service.pathParams.length) {
              const obj = generateKeyValueObj(service.urlParams, service, context);
              if (obj.hasErr) {
                return sendResponse(obj.data);
              }
              options.url = options.url.replace(/:(\w+)/g, (_a, b) => obj.data[b]);
            }

            // 构建Body参数
            if (service.bodyType === EnumBodyType.formData) {
              if (service.formParams.length) {
                const obj = generateKeyValueObj(service.formParams, service, context);
                if (obj.hasErr) {
                  return sendResponse(obj.data);
                }
                options.data = obj.data;
              }
            } else if (service.bodyType === EnumBodyType.json) {
              try {
                const fn = new Function('context', 'console', service.jsonSourceCompiled);
                options.data = fn(context, myConsole);
              } catch (err) {
                console.error(`${hsName} - ${service.no} Body函数执行出错！`, err);
                return {
                  status: httpStatus.INTERNAL_SERVER_ERROR,
                  data: {
                    code: -1,
                    message: `${hsName} - ${service.no} Body函数执行出错！${err.message}`,
                  },
                };
              }
            }

            // 构建Headers参数
            if (service.headerParams.length) {
              const obj = generateKeyValueObj(service.headerParams, service, context);
              if (obj.hasErr) {
                return sendResponse(obj.data);
              }
              options.headers = obj.data;
            }

            arr.push(options);
          }

          // eslint-disable-next-line no-await-in-loop
          const result = await Promise.all(arr.map((options) => instance(options)));
          result.forEach((response, index) => {
            const service = current.services[index];
            context[`$${service.no}`] = {
              status: response.status,
              data: response.data,
              headers: response.headers,
            };
            if (isDebug) {
              service.requestSource = JSON.stringify(response.config, null, 2);
              service.responseSource = JSON.stringify({
                data: response.data,
                status: response.status,
                statusText: response.statusText,
                headers: response.headers,
              }, null, 2);
            }
          });
        }
        break;
      default:
        break;
    }
  }

  // 兜底，应该走不到这里的
  console.error('咋走到这了呢？？', apiData);
  return sendResponse({
    status: 500,
  });
};
