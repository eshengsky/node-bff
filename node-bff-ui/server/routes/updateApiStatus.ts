
import { Request, Response } from 'express';
import DB from '../db';
import { setCache } from '../cache';
const { Api } = DB.Models;
export default async (req: Request, res: Response) => {
  try {
    const doc = await Api.findOne({
      _id: req.body._id,
      versionActive: true
    }).exec();
    if (!doc) {
      res.json({
        code: -1,
        message: '网络错误，请稍后重试'
      });
      return;
    }
    doc.status = req.body.status;
    const newDoc = await doc.save();
    await setCache(`${newDoc.method.toUpperCase()}@${newDoc.path}`, JSON.stringify(newDoc));
    res.json({
      code: 1
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
