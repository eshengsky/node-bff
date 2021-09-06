/**
 * 接口状态枚举
 */
export enum EnumStatus {
  /** 正常 */
  regular,

  /** 已废弃 */
  deprecated,

  /** 已删除 */
  deleted
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
