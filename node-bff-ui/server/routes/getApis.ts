
import { Request, Response } from 'express';
import mongoose from 'mongoose';
import DB from '../db';
const { Api } = DB.Models;
export default async (req: Request, res: Response) => {
  try {
    const page = Number(req.query.page || '1');
    const pageSize = Number(req.query.pageSize || '10');
    const methods = String(req.query.methods || '');
    const creators = String(req.query.creators || '');
    const statuses = String(req.query.statuses || '');
    const category = String(req.query.category || '');
    let keyword = String(req.query.keyword || '').trim();
    // 构建筛选条件对象
    const filters: any = {
      versionActive: true
    };
    if (methods) {
      filters.method = {
        $in: methods.split(',')
      };
    }
    if (creators) {
      filters.createdBy = {
        $in: creators.split(',')
      };
    }
    if (statuses) {
      filters.status = {
        $in: statuses.split(',')
      };
    }
    if (category) {
      if (category === 'default') {
        filters.category = null;
      } else {
        filters.category = category;
      }
    }
    if (keyword) {
      keyword = keyword.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&');
      const $or: any = [{
        name: new RegExp(keyword, 'gi')
      }, {
        path: new RegExp(keyword, 'gi')
      }, {
        description: new RegExp(keyword, 'gi')
      }];
      if (mongoose.isValidObjectId(keyword)) {
        $or.push({
          _id: keyword
        });
      }
      filters.$or = $or;
    }
    // 构建排序对象
    const sort: any = {};
    const sortProp = req.query.sortProp as string;
    if (sortProp) {
      sort[sortProp] = req.query.sortOrder;
    }
    // 如果排序字段不是修改时间，则再加上修改时间作为次级排序
    if (sortProp !== 'createdTime') {
      sort.createdTime = 'descending';
    }
    const [total, list] = await Promise.all([
      // 查出总条数
      Api.countDocuments(filters).exec(),

      // 分页查询数据
      Api.find(filters)
        .sort(sort)
        .skip((page - 1) * pageSize)
        .limit(pageSize)
        .populate('category')
        .exec()
    ]);
    res.json({
      code: 1,
      data: {
        total,
        list
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
