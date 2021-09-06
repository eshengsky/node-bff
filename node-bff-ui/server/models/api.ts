import { Schema, model, models, Model } from 'mongoose';
import { IApiSchema } from '~/types/schema';

export class Api {
    private _model: Model<IApiSchema>;

    constructor () {
      const schema = new Schema<IApiSchema>(
        {
          /** 接口名称 */
          name: {
            type: Schema.Types.String
          },

          /** 接口分类 */
          category: {
            type: Schema.Types.ObjectId,
            ref: 'category',
            required: false
          },

          /** 接口状态 */
          status: {
            type: Schema.Types.Number
          },

          /** 接口方法 */
          method: {
            type: Schema.Types.String
          },

          path: {
            type: Schema.Types.String
          },

          urlParams: {
            type: Schema.Types.Array
          },

          bodyType: {
            type: Schema.Types.Number
          },

          jsonParams: {
            type: Schema.Types.Array
          },

          formParams: {
            type: Schema.Types.Array
          },

          headerParams: {
            type: Schema.Types.Array
          },

          flowchart: {
            type: Schema.Types.Array
          },

          /** 接口描述 */
          description: {
            type: Schema.Types.String
          },

          /** 接口版本号 */
          version: {
            type: Schema.Types.String
          },

          /** 版本更新描述 */
          versionMessage: {
            type: Schema.Types.String
          },

          /** 是否启用该版本，同时只能有1个版本可以被启用 */
          versionActive: {
            type: Schema.Types.Boolean
          },

          /**
           * 版本线ID，用来关联同一接口的不同版本记录
           * 只有新建接口时才生成新的值，后续编辑接口时沿用该值
           */
          versionThread: {
            type: Schema.Types.ObjectId
          },

          createdBy: {
            type: Schema.Types.String
          },

          createdTime: {
            type: Schema.Types.Date,
            default: new Date()
          }
        }
      );

      if (models.api) {
        this._model = models.api;
      } else {
        this._model = model('api', schema, 'apis');
      }
    }

    public get model () {
      return this._model;
    }
}
