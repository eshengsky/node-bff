
import { Request, Response } from 'express';
import mongoose from 'mongoose';
import { fixHandlers, compileFunctions } from '../shared';
import { IApi } from '../../types/index';
import DB from '../db';
import { setCache } from '../cache';
import apiExsit from '../service/apiExsit';
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
    const doc: IApi = {
      ...req.body,
      versionThread: new mongoose.Types.ObjectId().toString(),
      createdTime: new Date()
    };

    // 检查是否有重复接口
    if (await apiExsit(doc)) {
      res.json({
        code: -1,
        message: `${doc.method} ${doc.path} 接口重复`
      });
      return;
    }
    if (req.body.category === 'default') {
      doc.category = null;
    }
    const entity = new Api(doc);
    // 保存到数据库
    const data = await entity.save();
    // 保存到redis
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
