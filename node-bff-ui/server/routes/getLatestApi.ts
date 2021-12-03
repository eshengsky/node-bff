
import { Request, Response } from 'express';
import mongoose from 'mongoose';
import DB from '../db';
const { Api } = DB.Models;
export default async (req: Request, res: Response) => {
  try {
    if (!mongoose.isValidObjectId(req.query.thread)) {
      res.json({
        code: -1,
        message: '找不到该接口！'
      });
      return;
    }
    const data = await Api.findOne({
      versionThread: req.query.thread as string,
      versionActive: true
    })
      .populate('category')
      .exec();
    if (!data) {
      res.json({
        code: -1,
        message: '找不到该接口！'
      });
      return;
    }
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
