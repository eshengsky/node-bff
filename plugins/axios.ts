import https from 'https';
import { Context } from '@nuxt/types';
export default ({ $axios }: Context) => {
  $axios.defaults.httpsAgent = new https.Agent({ rejectUnauthorized: false });

  $axios.onRequest((config) => {
    console.info('发起请求 ' + config.url);
  });

  $axios.onError((err) => {
    console.error(err);
  });

  $axios.onResponse((resp) => {
    console.info(`请求 ${resp.config.url} 已完成！状态码：${resp.status}`);
  });
};
