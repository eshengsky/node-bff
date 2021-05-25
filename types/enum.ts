/**
 * 接口状态枚举
 */
export enum EnumStatus {
  /** 正常 */
  regular,

  /** 维护中 */
  maintaining,

  /** 已废弃 */
  deprecated
}

export enum EnumParamType {
  url,
  body,
  path,
  header
}

export enum EnumBodyType {
  none,
  json,
  formData
}
