import express from 'express';
import cookieParser from 'cookie-parser';
import indexRoute from './routes/index';

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use(indexRoute);

// Error
app.use((err: Error, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  if (err.name === 'UnauthorizedError') {
    return res.sendStatus(401);
  }
  console.error('api route error', err);
  return res.sendStatus(500);
});

module.exports = {
  path: '/api-service',
  handler: app
};
