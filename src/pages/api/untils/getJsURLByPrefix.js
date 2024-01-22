/*
 * 根据前缀获取js文件下载路径
 * */
import { DOUBLE_SLASH_REG, URL_REG } from '@/src/pages/api/constants';

const jsDownloadAddress = (baseUrl, sourceURL) => {
  // 如果是完整的url，直接返回
  if (URL_REG.test(baseUrl)) {
    return baseUrl;
  }
  // 如果是以双斜杠开头的url，加上https:
  if (DOUBLE_SLASH_REG.test(baseUrl)) {
    return `https:${baseUrl}`;
  }
  // 如果是以单斜杠开头的url，加上源地址
  if (baseUrl.startsWith('/')) {
    return sourceURL + baseUrl;
  }
  return baseUrl;
};
export default jsDownloadAddress;
