import { Router } from 'express';
import getApis from './getApis';
import methods from './getApiMethods';
import creators from './getCreators';
import getApiById from './getApiById';
import latestApi from './getLatestApi';
import getDebugApi from './getDebugApi';
import addApi from './addApi';
import updateApi from './updateApi';
import updateApiStatus from './updateApiStatus';
import getApiSortVersions from './getApiSortVersions';
import updateApiVersionCurrent from './updateApiVersionCurrent';
import getCategories from './getCategories';
import addUpdateCategory from './addUpdateCategory';
import apiTest from './apiTest';

const router = Router();

/** 查询所有api */
router.get('/apis', getApis);

/** 根据接口ID查询单个接口 */
router.get('/api', getApiById);

/** 根据接口versionThread查询最新版本的接口 */
router.get('/latestApi', latestApi);

/** 实时调试api数据生成 */
router.post('/getDebugApi', getDebugApi);

/** 新增接口 */
router.post('/api', addApi);

/** 更新接口（新增一个版本） */
router.put('/api', updateApi);

/** 更新接口状态 */
router.put('/api/status', updateApiStatus);

/** 通过versionThread查询api，并根据 createdTime降序排  */
router.get('/api/versions', getApiSortVersions);

/** 更新接口的版本为当前版本 */
router.put('/api/current', updateApiVersionCurrent);

/** 查询所有api分类 */
router.get('/categories', getCategories);

/** 新增或修改分类 */
router.post('/category', addUpdateCategory);

/** 查询api中，所有method类型 */
router.get('/methods', methods);

/** 查询api中所有的创建者 */
router.get('/creators', creators);

/** api测试 */
router.post('/api-test', apiTest);

export default router;
