
import { Request, Response } from 'express';
import DB from '../db';
const { Category } = DB.Models;
export default async (req: Request, res: Response) => {
  try {
    const data = await Category.find().exec();
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
