import path from 'path';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { Server } from 'http';

// 加载当前环境对应的.env文件到process.env
const envName = process.env.ENV_NAME || 'development';
console.info(`Current env name: ${envName}`);
dotenv.config({
  path: path.resolve(process.cwd(), `./src/env/.env.${envName}`),
});

let server: Server;
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(async () => {
  console.info('Connected to MongoDB');
  const app = await import('./app');
  server = app.default.listen(process.env.PORT, () => {
    console.info(`Listening: http://localhost:${process.env.PORT}`);
  });
});

const exitHandler = () => {
  if (server) {
    server.close(() => {
      console.info('Server closed');
      process.exit(1);
    });
  } else {
    process.exit(1);
  }
};

const unexpectedErrorHandler = (error: Error) => {
  console.error(error);
  exitHandler();
};

process.on('uncaughtException', unexpectedErrorHandler);
process.on('unhandledRejection', (reason) => {
  console.error(reason);
});

process.on('SIGTERM', () => {
  console.info('SIGTERM received');
  if (server) {
    server.close();
  }
});
