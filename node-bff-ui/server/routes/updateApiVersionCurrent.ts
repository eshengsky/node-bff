
import { Request, Response } from 'express';
import DB from '../db';
const { Api } = DB.Models;
export default async (req: Request, res: Response) => {
  try {
    const id = String(req.query.id);
    const versionThread = String(req.query.versionThread);
    await Api.updateMany({
      versionThread
    }, {
      versionActive: false
    }).exec();
    await Api.findByIdAndUpdate(id, {
      versionActive: true
    }).exec();
    res.json({
      code: 1,
      data: {
        current: id
      }
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
