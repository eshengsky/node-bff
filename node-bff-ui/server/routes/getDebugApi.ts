
import { Request, Response } from 'express';
import { fixHandlers, compileFunctions } from '../shared';
import { IApi } from '../../types/index';
export default (req: Request, res: Response) => {
  // 处理一下source字段
  fixHandlers(req.body);

  // 先编译所有的handler和接口中的JSON函数
  const errMsg = compileFunctions(req.body);
  if (errMsg) {
    res.json({
      code: -1,
      message: errMsg
    });
    return;
  }

  try {
    const doc: IApi = {
      ...req.body,
      createdTime: new Date()
    };
    if (req.body.category === 'default') {
      doc.category = null;
    }
    res.json({
      code: 1,
      data: doc
    });
  } catch (err: any) {
    console.error(err);
    res.json({
      code: -1,
      message: '网络错误，请稍后重试',
      debugMessage: err.message
    });
  };
};
