import { connect, connection, Connection, Model } from 'mongoose';
import { Api } from './models/api';
import { IApiSchema } from '~/types/schema';

/**
 * 重连次数
 */
let retryTimes = 5;

interface IModels {
    Api: Model<IApiSchema>;
}

export default class DB {
    private static instance: DB;

    private _db: Connection;

    private _models: IModels;

    private constructor () {
      // 连接 MongoDB
      this.connectDB();

      this._db = connection;
      this._db.on('open', this.connected);
      this._db.on('error', this.error);

      this._models = {
        Api: new Api().model
      };
    }

    public static get Models () {
      if (!DB.instance) {
        DB.instance = new DB();
      }
      return DB.instance._models;
    }

    connectDB () {
      connect(
        process.env.MONGO_URI as string,
        {
          useUnifiedTopology: true,
          useNewUrlParser: true,
          useCreateIndex: true,
          useFindAndModify: false
        }
      );
    }

    private connected () {
      console.log('成功连接MongoDB！');
      retryTimes = 5;
    }

    private error () {
      if (retryTimes > 0) {
        console.error('连接MongoDB失败！正在尝试重新连接...');
        setTimeout(() => {
          DB.instance.connectDB();
          retryTimes--;
        }, 1000);
      } else {
        console.error('重试数次后依然连接MongoDB失败，请检查MongoDB连接设置！');
        process.exit(1);
      }
    }
}
