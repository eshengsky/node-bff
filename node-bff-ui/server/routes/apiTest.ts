
import { Request, Response } from 'express';
import axios, { AxiosResponse } from 'axios';

export default async (req: Request, res: Response) => {
  const done = (response: AxiosResponse) => {
    const respData: any = {
      headers: response.headers,
      status: response.status,
      statusText: response.statusText
    };
    if (response.data.data) {
      respData.data = response.data.data;
    }
    res.json({
      code: 1,
      response: respData,
      exts: response.data.exts
    });
  };
  try {
    const { reqObj, apiData } = req.body;
    const response = await axios.post('http://localhost:4001/api-test', {
      reqObj,
      apiData
    });
    done(response);
  } catch (err: any) {
    if (err.response) {
      done(err.response);
      return;
    }
    res.json({
      code: -1,
      message: '网络错误，请稍后重试',
      debugMessage: err.message
    });
  };
};
