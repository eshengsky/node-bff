import { Request, Response } from 'express';
import httpStatus from 'http-status';
import { getCache, setCache } from '../cache';
import process from '../core/process';
import { Api } from '../models/api';
import { IApi } from '../types/index';
import { IRespData } from '../types/response';

const { model } = new Api();

export default async (req: Request, res: Response) => {
  const method = req.method.toUpperCase();
  let apiData: IApi;

  // 首先尝试从缓存获取数据
  try {
    // 缓存键名如：POST@/getData
    const cacheData = await getCache(`${method}@${req.path}`);
    if (cacheData) {
      console.info(`${method} ${req.path} 已获取到缓存数据`);
      apiData = JSON.parse(cacheData);
    }
  } catch (err) {
    // 查询Redis出错，不阻断流程，继续往下走
    console.error('查询Redis出错！', err);
  }

  // 从缓存或数据库中找到接口后，执行该方法
  const handler = async () => {
    // 处理接口流程
    const response = await process(req, apiData, !!req.query.isDebug);
    res.status(response.status || 200);
    if (response.headers) {
      Object.keys(response.headers).forEach((key) => {
        res.setHeader(key, response.headers[key]);
      });
    }
    if (response.data) {
      res.json(response.data);
    } else {
      res.end();
    }
  };

  if (apiData) {
    handler();
  } else {
    // 如果缓存中没有找到，再从数据库中找
    try {
      // 先仅根据path和是否当前版本，来查询接口
      const docs = await model.find({
        path: req.path,
        versionActive: true,
      }).exec();
      if (docs.length) {
        const doc = docs.find((t) => t.method.toUpperCase() === method);
        if (doc) {
          // 如果缓存中没有，但数据库中有，则存下缓存
          setCache(`${method}@${req.path}`, JSON.stringify(doc));
          apiData = doc as unknown as IApi;
          handler();
        } else {
          // path能匹配上，但method匹配不到，返回405 - 该method不支持
          const methods = docs.map((t) => t.method.toUpperCase()).join(',');
          res.status(httpStatus.METHOD_NOT_ALLOWED).json(<IRespData>{
            code: -1,
            message: `${req.path} 不支持${method}方法，只支持${methods}方法。`,
          });
        }
      } else {
        // 返回404 - 不存在该资源
        res.sendStatus(httpStatus.NOT_FOUND);
      }
    } catch (err) {
      // 查询数据库出错，返回500 - 服务器错误
      console.error('查询Mongo出错！', err);
      res.status(httpStatus.INTERNAL_SERVER_ERROR).json(<IRespData>{
        code: -1,
        message: err.message,
      });
    }
  }
};
