/**
* 响应内容定义
*/
export interface IRespData {
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
export interface IResp {
  /** HTTP状态码，默认200 */
  status?: number;

  /** 响应内容 */
  data?: IRespData | null;

  /** 响应头 */
  headers?: {
    [key: string]: string | number | readonly string[]
  };

  /** 额外信息，用作调试模式 */
  exts?: {
    logs: any
  }
}
