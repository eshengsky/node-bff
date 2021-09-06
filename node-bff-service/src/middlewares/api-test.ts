import { Request, Response } from 'express';
import { performance } from 'perf_hooks';
import process from '../core/process';

export default async (req: Request, res: Response) => {
  const start = performance.now();
  const { reqObj, apiData } = req.body;
  const response = await process(reqObj, apiData, true);
  res.status(response.status || 200);
  if (response.headers) {
    Object.keys(response.headers).forEach((key) => {
      res.setHeader(key, response.headers[key]);
    });
  }
  const end = performance.now();
  const duration = end - start;
  res.setHeader('x-api-time', duration);
  const resData: any = {
    exts: response.exts,
  };
  if (response.data) {
    resData.data = response.data;
  }
  res.json(resData);
};
