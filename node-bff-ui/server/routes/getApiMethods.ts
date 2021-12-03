
import { Request, Response } from 'express';
import DB from '../db';
const { Api } = DB.Models;
export default async (req: Request, res: Response) => {
  try {
    // 构建筛选条件对象
    const filters = {
      versionActive: true
    };
    const list = await Api.distinct('method', filters).exec();
    res.json({
      code: 1,
      data: list
    });
  } catch (err: any) {
    console.error(err);
    res.json({
      code: -1,
      message: '网络错误，请稍后重试',
      debugMessage: err.message
    });
  }
};
