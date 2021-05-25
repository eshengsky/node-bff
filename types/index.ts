import { EnumBodyType, EnumStatus } from './enum';

/**
 * 普通参数接口定义
 */
export interface ICommonParam {
  /** 唯一键，仅用作前端定位 */
  key: number;
  /** 参数名 */
  paramName: string;

  /** 是否必传 */
  required: boolean;

  /** 备注 */
  remark?: string;
}

export interface IJsonParam extends ICommonParam {
  parentKey: number;
  type: string;
  children: IJsonParam[] | null
}

export interface IHandler {
  key: number;

  /** 类型，固定值 */
  type: 'handler';

  /**
   * 是否自定义函数
   * 为false时表示默认函数，为true表示执行自定义代码
   * 一般处理函数的默认函数为空，最终处理函数的默认函数是一个动态生成的返回聚合接口内容的对象
   */
   custom: boolean;

  /** 处理函数源码 */
  source: string;

  comment: string;
}

export interface IServiceParam {
  /** 唯一键，仅用作前端定位 */
  key: number | string;

  /** 参数名 */
  paramName: string;

  /** 参数值 */
  paramValue: string;

  /** 值类型，固定值或者表达式 */
  valType: 'fixed' | 'expression'
}

export interface IService {
  key: number;

  name: string;

  method: string;

  path: string;

  pathParams: IServiceParam[];
  urlParams: IServiceParam[];
  bodyType: EnumBodyType;
  jsonSource: string;
  formParams: IServiceParam[];
  headerParams: IServiceParam[];

  comment: string;
}

export interface IServiceGroup {
  key: number;

  /** 类型，固定值 */
  type: 'services';
  services: IService[];
}

/**
 * 接口入参校验
 */
export interface IVerify {
  key: number;

  /** 类型，固定值 */
  type: 'verify';

  /**
   * 基础校验
   */
  base: boolean;

  /**
   * 高级设置的校验
   */
  advance: boolean;
}

export interface IApi {
  _id?: string;
  name: string;
  category: string;
  status: EnumStatus;
  method: string;
  path: string;
  urlParams: ICommonParam[];
  bodyType: EnumBodyType;
  jsonParams: IJsonParam[];
  formParams: ICommonParam[];
  headerParams: ICommonParam[];
  flowchart: Array<IHandler | IServiceGroup | IVerify>;
  description?: string;
  version: string;
  versionMessage: string;
  versionActive: boolean;
  versionThread: string;
  createdBy: string;
  createdTime?: Date;
}
