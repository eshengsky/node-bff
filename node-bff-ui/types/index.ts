import { EnumBodyType, EnumStatus } from './enum';

interface IAdvancedParam {
  defaultValue?: string;
  minLength?: number;
  maxLength?: number;
  regexp?: string;
  enums?: [];
}

/**
 * 普通参数接口定义
 */
export interface ICommonParam extends IAdvancedParam {
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

  sourceCompiled: string;

  comment: string;
  /** 执行handler前的context */
  beforeContext?: string;

  /** 执行handler后的context */
  afterContext?: string;
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
export interface IServiceParamJson {
  /** 唯一键，仅用作前端定位 */
  key: number;

  /** 父节点的key值 */
  parentKey: number;

  /** 参数名 */
  paramName: string;

  /** 参数值 */
  paramValue: string | boolean;

  /** 值类型，固定值或者表达式或者对象 */
  type: 'boolean' | 'array' | 'object' | 'fixed' | 'expression';

  /** 值类型为对象时，孩子节点 */
  children?: IServiceParamJson[] | null
}

export interface IService {
  key: number;
  no: string;

  name: string;

  method: string;

  path: string;

  pathParams: IServiceParam[];
  urlParams: IServiceParam[];
  bodyType: EnumBodyType;
  jsonParams: IServiceParamJson[];
  formParams: IServiceParam[];
  headerParams: IServiceParam[];
  comment: string;
  requestSource?: string;
  responseSource?: string;
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
  category: string | null;
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

export interface ICategory {
  _id?: string;
  name: string;
  description?: string;
  modifiedBy: string;
  modifiedTime?: Date;
}
