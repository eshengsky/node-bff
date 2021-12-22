
import { IApi } from '../../types/index';
import DB from '../db';
const { Api } = DB.Models;

/**
 * api新增或者修改的时候，根据路径和方法，判断是否已经存在相同api
 */
export default async (api: IApi) => {
  const query: any = {
    path: api.path,
    method: api.method
  };
  if (api._id) {
    query.versionThread = {
      $ne: api.versionThread
    };
  }
  const data = await Api.findOne(query);
  if (data) {
    return true;
  } else {
    return false;
  }
};
