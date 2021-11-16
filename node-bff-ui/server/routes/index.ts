import { Router } from 'express';
import axios, { AxiosResponse } from 'axios';
import mongoose from 'mongoose';
import { transformSync } from '@babel/core';
import DB from '../db';
import { setCache, delCache } from '../cache';
import { getHandlerServicesName, generateBuiltInRespFn } from '../../common/utils';
import { IApi, ICategory } from '../../types/index';
import { EnumBodyType } from '../../types/enum';
import { respFnKey } from '../../common/variables';

const router = Router();
const { Api, Category } = DB.Models;

// 处理handler代码
// 如果选中了使用默认函数，则清空source字段，因为source字段暂存的是用户自定义代码
function fixHandlers (api: IApi) {
  api.flowchart.forEach((item) => {
    if (item.type === 'handler' && !item.custom) {
      item.source = '';
    }
  });
}

const compileOptions = {
  plugins: ['@babel/plugin-transform-typescript'],
  presets: ['@babel/preset-env'],
  parserOpts: {
    // 允许非函数内的return关键字
    allowReturnOutsideFunction: true
  },
  generatorOpts: {
    // 压缩代码
    minified: true,
    // 去除注释
    comments: false
  }
};

function getErrMsg (msg: string) {
  const idx = msg.indexOf('\n\n');
  if (idx > 0) {
    return msg.substring(0, idx);
  }
  return msg;
}

function getFuncBody (source: string) {
  return source.substring(source.indexOf('\n') + 1, source.lastIndexOf('\n'));
}

/**
 * 编译处理函数和接口调用中的body函数
 * 注意只编译函数体部分，这是因为service端使用的是 new Function 而非 eval
 */
function compileFunctions (api: IApi): string | void {
  for (let i = 0; i < api.flowchart.length; i++) {
    const current = api.flowchart[i];
    if (current.type === 'handler') {
      const handlerTitle = getHandlerServicesName(current, api);
      if (!current.custom) {
        if (current.key !== respFnKey) {
          // 一般处理函数，使用默认函数，无需编译
          continue;
        } else {
          // 最终处理函数，使用默认函数
          const code = getFuncBody(generateBuiltInRespFn(api));
          try {
            const result = transformSync(code, compileOptions);
            if (result && result.code) {
              current.sourceCompiled = result.code;
            } else {
              return `${handlerTitle} 编译失败`;
            }
          } catch (err) {
            console.error(`${handlerTitle} 编译失败`, err);
            return `${handlerTitle} 编译失败：${getErrMsg(err.message)}`;
          }
        }
      } else {
        // 使用自定义函数，直接读source即可
        const code = getFuncBody(current.source);
        try {
          const result = transformSync(code, compileOptions);
          if (result && result.code) {
            current.sourceCompiled = result.code;
          } else {
            return `${handlerTitle} 编译失败`;
          }
        } catch (err) {
          console.error(`${handlerTitle} 编译失败`, err);
          return `${handlerTitle} 编译失败：${getErrMsg(err.message)}`;
        }
      }
    } else if (current.type === 'services' && current.services.length) {
      const groupTitle = getHandlerServicesName(current, api);
      for (let j = 0; j < current.services.length; j++) {
        const service = current.services[j];
        if (service.bodyType === EnumBodyType.json) {
          const code = getFuncBody(service.jsonSource);
          try {
            const result = transformSync(code, compileOptions);
            if (result && result.code) {
              service.jsonSourceCompiled = result.code;
            } else {
              return `${groupTitle} - ${service.no} 的Body函数编译失败`;
            }
          } catch (err) {
            console.error(`${groupTitle} - ${service.no} 的Body函数编译失败`, err);
            return `${groupTitle} - ${service.no} 的Body函数编译失败：${getErrMsg(err.message)}`;
          }
        }
      }
    }
  }
}

router.get('/methods', async (_req, res) => {
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
  } catch (err) {
    console.error(err);
    res.json({
      code: -1,
      message: '网络错误，请稍后重试',
      debugMessage: err.message
    });
  }
});

router.get('/creators', async (_req, res) => {
  try {
    // 构建筛选条件对象
    const filters = {
      versionActive: true
    };
    const list = await Api.distinct('createdBy', filters).exec();
    res.json({
      code: 1,
      data: list
    });
  } catch (err) {
    console.error(err);
    res.json({
      code: -1,
      message: '网络错误，请稍后重试',
      debugMessage: err.message
    });
  }
});

router.get('/apis', async (req, res) => {
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
  } catch (err) {
    console.error(err);
    res.json({
      code: -1,
      message: '网络错误，请稍后重试',
      debugMessage: err.message
    });
  };
});

/** 根据接口ID查询单个接口 */
router.get('/api', async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.query.id)) {
      res.json({
        code: -1,
        message: '找不到该接口！'
      });
      return;
    }
    const data = await Api.findOne({
      _id: req.query.id as string,
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
  } catch (err) {
    console.error(err);
    res.json({
      code: -1,
      message: '网络错误，请稍后重试',
      debugMessage: err.message
    });
  };
});

/** 根据接口versionThread查询最新版本的接口 */
router.get('/latestApi', async (req, res) => {
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
  } catch (err) {
    console.error(err);
    res.json({
      code: -1,
      message: '网络错误，请稍后重试',
      debugMessage: err.message
    });
  };
});

/** 实时调试api数据生成 */
router.post('/getDebugApi', (req, res) => {
  // 处理一下source字段
  fixHandlers(req.body);

  // 先编译所有的handler和接口中的JSON函数
  const errMsg = compileFunctions(req.body);
  if (errMsg) {
    res.json({
      code: -1,
      message: errMsg
    });
    return;
  }

  try {
    const doc: IApi = {
      ...req.body,
      createdTime: new Date()
    };
    if (req.body.category === 'default') {
      doc.category = null;
    }
    res.json({
      code: 1,
      data: doc
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
  // 处理一下source字段
  fixHandlers(req.body);

  // 先编译所有的handler和接口中的JSON函数
  const errMsg = compileFunctions(req.body);
  if (errMsg) {
    res.json({
      code: -1,
      message: errMsg
    });
    return;
  }

  try {
    const doc: IApi = {
      ...req.body,
      versionThread: new mongoose.Types.ObjectId().toString(),
      createdTime: new Date()
    };
    if (req.body.category === 'default') {
      doc.category = null;
    }
    const entity = new Api(doc);
    // 保存到数据库
    const data = await entity.save();
    // 保存到redis
    await setCache(`${data.method.toUpperCase()}@${data.path}`, JSON.stringify(data));
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
  // 处理一下source字段
  fixHandlers(req.body);

  // 先编译所有的handler和接口中的JSON函数
  const errMsg = compileFunctions(req.body);
  if (errMsg) {
    res.json({
      code: -1,
      message: errMsg
    });
    return;
  }

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
      versionThread: lastDoc.versionThread,
      createdTime: new Date()
    };
    if (req.body.category === 'default') {
      newDoc.category = null;
    }
    delete newDoc._id;
    const [, data] = await Promise.all([
      // 将旧文档设为非激活状态
      lastDoc.update({
        versionActive: false
      }).exec(),
      // 保存新文档
      new Api(newDoc).save(),
      // 删除旧文档path对应的缓存
      delCache(`${lastDoc.method.toUpperCase()}@${lastDoc.path}`)
    ]);
    await setCache(`${data.method.toUpperCase()}@${data.path}`, JSON.stringify(data));
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

/** 更新接口状态 */
router.put('/api/status', async (req, res) => {
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
  } catch (err) {
    console.error(err);
    res.json({
      code: -1,
      message: '网络错误，请稍后重试',
      debugMessage: err.message
    });
  }
});

router.get('/api/versions', async (req, res) => {
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
  } catch (err) {
    console.error(err);
    res.json({
      code: -1,
      message: '网络错误，请稍后重试',
      debugMessage: err.message
    });
  }
});

/** 更新接口的版本为当前版本 */
router.put('/api/current', async (req, res) => {
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
  } catch (err) {
    console.error(err);
    res.json({
      code: -1,
      message: '网络错误，请稍后重试',
      debugMessage: err.message
    });
  }
});

router.get('/categories', async (_req, res) => {
  try {
    const data = await Category.find().exec();
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

/** 新增或修改分类 */
router.post('/category', async (req, res) => {
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
  } catch (err) {
    console.error(err);
    res.json({
      code: -1,
      message: '网络错误，请稍后重试',
      debugMessage: err.message
    });
  };
});

router.post('/api-test', async (req, res) => {
  const done = (response: AxiosResponse) => {
    const respData: any = {
      headers: response.headers,
      status: response.status,
      statusText: response.statusText
    };
    if (response.data.data) {
      respData.data = response.data.data;
    }
    res.json({
      code: 1,
      response: respData,
      exts: response.data.exts
    });
  };
  try {
    const { reqObj, apiData } = req.body;
    const response = await axios.post('http://localhost:4001/api-test', {
      reqObj,
      apiData
    });
    done(response);
  } catch (err) {
    if (err.response) {
      done(err.response);
      return;
    }
    res.json({
      code: -1,
      message: '网络错误，请稍后重试',
      debugMessage: err.message
    });
  };
});

export default router;
