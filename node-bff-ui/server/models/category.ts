import { Schema, model, models, Model } from 'mongoose';
import { ICategorySchema } from '~/types/schema';

export class Category {
    private _model: Model<ICategorySchema>;

    constructor () {
      const schema = new Schema<ICategorySchema>(
        {
          /** 分类名称 */
          name: {
            type: Schema.Types.String
          },

          description: {
            type: Schema.Types.String
          },

          modifiedBy: {
            type: Schema.Types.String
          },

          modifiedTime: {
            type: Schema.Types.Date,
            default: new Date()
          }
        }
      );

      if (models.category) {
        this._model = models.category;
      } else {
        this._model = model('category', schema, 'categories');
      }
    }

    public get model () {
      return this._model;
    }
}
