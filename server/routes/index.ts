import { Router } from 'express';
import mongoose from 'mongoose';
import DB from '../db';
import { setCache, delCache } from '../cache';
import { IApi } from '~/types/index';

const router = Router();
const { Api } = DB.Models;

router.get('/apis', async (_req, res) => {
  try {
    const data = await Api.find(
      {},
      {}
    ).exec();
    res.json({
      code: 1,
      data
    });
  } catch (err) {
    console.error(err);
    res.json({
      code: -1,
      message: '网络错误，请稍后重试',
      debugMessage: err.message
    });
  };
});

/** 查询单个接口 */
router.get('/api', async (req, res) => {
  try {
    const data = await Api.findOne({
      _id: req.query.id as string,
      versionActive: true
    }).exec();
    res.json({
      code: 1,
      data
    });
  } catch (err) {
    console.error(err);
    res.json({
      code: -1,
      message: '网络错误，请稍后重试',
      debugMessage: err.message
    });
  };
});

/** 新增接口 */
router.post('/api', async (req, res) => {
  try {
    const doc: IApi = {
      ...req.body,
      category: req.body.category || null,
      versionThread: new mongoose.Types.ObjectId().toString()
    };
    const entity = new Api(doc);
    // 保存到数据库
    const data = await entity.save();
    // 保存到redis
    await setCache(req.body.path, JSON.stringify(doc));
    res.json({
      code: 1,
      data
    });
  } catch (err) {
    console.error(err);
    res.json({
      code: -1,
      message: '网络错误，请稍后重试',
      debugMessage: err.message
    });
  };
});

/** 更新接口（新增一个版本） */
router.put('/api', async (req, res) => {
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
      category: req.body.category || null,
      versionThread: lastDoc.versionThread
    };
    delete newDoc._id;
    delete newDoc.createdTime;
    const [, data] = await Promise.all([
      lastDoc.update({
        versionActive: false
      }).exec(),
      new Api(newDoc).save(),
      delCache(lastDoc.path)
    ]);
    await setCache(newDoc.path, JSON.stringify(newDoc));
    res.json({
      code: 1,
      data
    });
  } catch (err) {
    console.error(err);
    res.json({
      code: -1,
      message: '网络错误，请稍后重试',
      debugMessage: err.message
    });
  };
});

export default router;
