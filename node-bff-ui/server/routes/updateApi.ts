
import { Request, Response } from 'express';
import { fixHandlers, compileFunctions } from '../shared';
import { IApi } from '../../types/index';
import DB from '../db';
import { setCache, delCache } from '../cache';
const { Api } = DB.Models;
export default async (req: Request, res: Response) => {
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
    // 1. 找出当前文档
    const lastDoc = await Api.findOne({
      _id: req.body._id,
      versionActive: true
    }).exec();
    if (lastDoc === null) {
      return res.json({
        code: -1,
        message: '网络错误，请稍后重试',
        debugMessage: '找不到该文档'
      });
    }
    // 2. 将当前文档的 versionActive 设为 false
    // 3. 创建新的文档
    // 4. 删除旧文档对应的缓存
    // 5. 创建新文档对应的缓存
    const newDoc: IApi = {
      ...req.body,
      versionThread: lastDoc.versionThread,
      createdTime: new Date()
    };
    if (req.body.category === 'default') {
      newDoc.category = null;
    }
    delete newDoc._id;
    const [, data] = await Promise.all([
      // 将旧文档设为非激活状态
      lastDoc.update({
        versionActive: false
      }).exec(),
      // 保存新文档
      new Api(newDoc).save(),
      // 删除旧文档path对应的缓存
      delCache(`${lastDoc.method.toUpperCase()}@${lastDoc.path}`)
    ]);
    await setCache(`${data.method.toUpperCase()}@${data.path}`, JSON.stringify(data));
    res.json({
      code: 1,
      data
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
