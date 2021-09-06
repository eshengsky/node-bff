import { Document, Types } from 'mongoose';
import { EnumBodyType, EnumStatus } from './enum';
import { ICommonParam, IJsonParam } from './index';

export interface IApiSchema extends Document {
  _id?: Types.ObjectId;
  name: string;
  category: Types.ObjectId | null;
  status: EnumStatus;
  method: string;
  path: string;
  urlParams: ICommonParam[];
  bodyType: EnumBodyType;
  jsonParams: IJsonParam[];
  formParams: ICommonParam[];
  headerParams: ICommonParam[];
  flowchart: [];
  description?: string;
  version: string;
  versionMessage: string;
  versionActive: boolean;
  versionThread: Types.ObjectId;
  createdBy: string;

  createdTime: Date;
}

export interface ICategorySchema extends Document {
  _id?: Types.ObjectId;
  name: string;
  description?: string;
  modifiedBy: string;
  modifiedTime: Date;
}
