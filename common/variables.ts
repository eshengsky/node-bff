export const httpMethods = [{
  method: 'get',
  desc: '表示获取资源'
}, {
  method: 'post',
  desc: '表示新建资源'
}, {
  method: 'put',
  desc: '表示更新资源'
}, {
  method: 'delete',
  desc: '表示删除资源'
}, {
  method: 'patch',
  desc: '表示更新资源的一部分'
}, {
  method: 'head',
  desc: '表示获取元数据'
}, {
  method: 'options',
  desc: '表示获取支持的请求类型'
}];

export const headerAutoList = [
  'Accept',
  'Accept-Charset',
  'Accept-Encoding',
  'Accept-Language',
  'Accept-Datetime',
  'Authorization',
  'Cache-Control',
  'Connection',
  'Cookie',
  'Content-Disposition',
  'Content-Length',
  'Content-MD5',
  'Content-Type',
  'Date',
  'Expect',
  'From',
  'Host',
  'If-Match',
  'If-Modified-Since',
  'If-None-Match',
  'If-Range',
  'If-Unmodified-Since',
  'Max-Forwards',
  'Origin',
  'Pragma',
  'Proxy-Authorization',
  'Range',
  'Referer',
  'TE',
  'User-Agent',
  'Upgrade',
  'Via',
  'Warning',
  'X-Requested-With',
  'DNT',
  'X-Forwarded-For',
  'X-Forwarded-Host',
  'X-Forwarded-Proto',
  'Front-End-Https',
  'X-Http-Method-Override',
  'X-ATT-DeviceId',
  'X-Wap-Profile',
  'Proxy-Connection',
  'X-UIDH',
  'X-Csrf-Token'
];

export const respFnKey = 999;

export const verifyKey = 1;

// 默认的 common handler 代码
export const defaultCommonFn = `export default function (context: IContext): IRespData | void {
  // 在此处编写函数逻辑
}`;
// 默认的 response handler 代码
export const defaultRespFn = `export default function (context: IContext): IRespData {
  // 在此处编写函数逻辑
  return {
    code: 1,
    data: {
      time: new Date()
    }
  }
}`;
export const defaultJsonFn = `export default function (context: IContext): IJson {
  // 返回值需要能转换为JSON
  return {};
}`;
// common handler 正则
// 作用是当修改了函数的外层定义后，自动撤销代码，以保护代码结构
export const commonFnReg = /^export default function \(context: IContext\): IRespData \| void {[\r\n][\s\S]*}$/m;
// response handler 正则
export const respFnReg = /^export default function \(context: IContext\): IRespData {[\r\n][\s\S]*}$/m;
