export const wrapRes = (resData:any) => {
  return {
    code:1,
    data:  {...resData}
  }
}

export const wrapResError = (resData:any, code:number, msg:string) => {
  return {
    code,
    data:  {...resData},
    msg
  }
}