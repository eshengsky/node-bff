
import { Request, Response } from 'express';
import { ICategory } from '../../types/index';
import DB from '../db';
const { Category } = DB.Models;
export default async (req: Request, res: Response) => {
  try {
    const doc: ICategory = req.body;
    if (!doc._id) {
      const entity = new Category(doc);
      await entity.save();
    } else {
      doc.modifiedTime = new Date();
      await Category.findByIdAndUpdate(doc._id, doc).exec();
    }
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
  };
};
