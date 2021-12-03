
import { Request, Response } from 'express';
import DB from '../db';
const { Api } = DB.Models;
export default async (req: Request, res: Response) => {
  const versionThread = String(req.query.id);
  try {
    const apis = await Api.find({
      versionThread
    }).sort({
      createdTime: 'descending'
    }).exec();
    res.json({
      code: 1,
      data: apis
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
