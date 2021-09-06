import express, { Request, Response } from 'express';
import helmet from 'helmet';
// import xss from 'xss-clean';
import cors from 'cors';
import httpStatus from 'http-status';
import mainMiddleware from './middlewares/main';
import apiTestMiddleware from './middlewares/api-test';

const app = express();

app.use(helmet());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// app.use(xss());
app.use(cors());
// app.options('*', cors());

// API在线测试
app.post('/api-test', apiTestMiddleware);

// 核心中间件，处理普通请求
app.use(mainMiddleware);

app.use((err: Error, _req: Request, res: Response) => {
  console.error(err);
  res.sendStatus(httpStatus.INTERNAL_SERVER_ERROR);
});

export default app;
