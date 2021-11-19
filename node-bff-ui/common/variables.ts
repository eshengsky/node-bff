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
  'accept',
  'accept-charset',
  'accept-encoding',
  'accept-language',
  'accept-datetime',
  'authorization',
  'cache-control',
  'connection',
  'cookie',
  'content-disposition',
  'content-length',
  'content-md5',
  'content-type',
  'date',
  'expect',
  'from',
  'host',
  'if-match',
  'if-modified-since',
  'if-none-match',
  'if-range',
  'if-unmodified-since',
  'max-forwards',
  'origin',
  'pragma',
  'proxy-authorization',
  'range',
  'referer',
  'te',
  'user-agent',
  'upgrade',
  'via',
  'warning',
  'x-requested-with',
  'dnt',
  'x-forwarded-for',
  'x-forwarded-host',
  'x-forwarded-proto',
  'front-end-https',
  'x-http-method-override',
  'x-att-deviceid',
  'x-wap-profile',
  'proxy-connection',
  'x-uidh',
  'x-csrf-token'
];

export const respFnKey = 999;

export const verifyKey = 1;

// 默认的 common handler 代码
export const defaultCommonFn = `export default function (context: IContext): IResp | void {
  // 在此处编写函数逻辑
}`;
// 默认的 response handler 代码
export const defaultRespFn = `export default function (context: IContext): IResp {
  // 在此处编写函数逻辑
  return {
    status: 200,
    data: {
      code: 1,
      data: {}
    }
  }
}`;
// common handler 正则
// 作用是当修改了函数的外层定义后，自动撤销代码，以保护代码结构
export const commonFnReg = /^export default function \(context: IContext\): IResp \| void {[\r\n][\s\S]*}$/m;
// response handler 正则
export const respFnReg = /^export default function \(context: IContext\): IResp {[\r\n][\s\S]*}$/m;
