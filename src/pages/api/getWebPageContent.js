import axios from 'axios';
import * as cheerio from 'cheerio';
import handleRes from '@/src/pages/api/untils/handleRes';
import { URL_REG } from '@/src/pages/api/constants';
import fetchJsFile from '@/src/pages/api/untils/reqJsFile';
import jsDownloadAddress from '@/src/pages/api/untils/getJsURLByPrefix';

export default async function getWebPageContent(req, res) {
  const headJsCodeSource = [];
  const bodyJsCodeSource = [];
  const headJsFiles = [];
  const bodyJsFiles = [];
  const { resInvalid, resHTML } = handleRes(res);
  const { url } = req.query;
  const urlReg = URL_REG;
  // 判断url是否合法
  // 如果不合法，返回错误信息
  if (url === undefined || !urlReg.test(url)) {
    resInvalid('url为空或不合法');
    return;
  }
  // 获取url的基础路径
  const baseUrl = new URL(url).origin;
  // 发送请求，获取页面内容
  try {
    axios
      .get(url)
      .then(async (response) => {
        // 使用cheerio解析HTML
        const $ = cheerio.load(response.data);
        // 获取html head中的script
        const $headScripts = $('head>script');
        // 获取html body中的script
        const $bodyScripts = $('body>script');
        // 整理head中的script
        for (let i = 0; i < $headScripts.length; i++) {
          if ($headScripts[i].attribs.src) {
            headJsFiles.push({
              codeSrc: $headScripts[i].attribs.src,
              index: i,
            });
          } else {
            headJsCodeSource.push({
              code: $headScripts[i].children[0].data,
              index: i,
            });
          }
        }
        // 整理body中的script
        for (let i = 0; i < $bodyScripts.length; i++) {
          if ($bodyScripts[i].attribs.src) {
            bodyJsFiles.push({
              codeSrc: $bodyScripts[i].attribs.src,
              index: i,
            });
          } else {
            bodyJsCodeSource.push({
              code: $bodyScripts[i].children[0].data,
              index: i,
            });
          }
        }
        // 遍历head中的script，按顺序请求js文件的内容保存到headJsSource中
        for (const headScript of headJsFiles) {
          const jsUrl = jsDownloadAddress(headScript.codeSrc, baseUrl);
          const jsCode = await fetchJsFile(jsUrl);
          headJsCodeSource.push({
            code: jsCode,
            index: headScript.index,
          });
        }
        // 遍历body中的script，按请求js文件的内容保存到bodyJsSource中
        for (const bodyScript of bodyJsFiles) {
          const jsUrl = jsDownloadAddress(bodyScript.codeSrc, baseUrl);
          const jsCode = await fetchJsFile(jsUrl);
          bodyJsCodeSource.push({
            code: jsCode,
            index: bodyScript.index,
          });
        }

        // 遍历head中的script元素，按照jsCodeSource中的顺序替换script元素的内容
        $headScripts.each((index, element) => {
          if (headJsCodeSource[index]) {
            // 移除当前script元素的src属性，并将jsCodeSource中的js代码替换到当前script元素中
            $(element).removeAttr('src').html(headJsCodeSource[index].code);
          }
        });
        $bodyScripts.each((index, element) => {
          if (bodyJsCodeSource[index]) {
            // 移除当前script元素的src属性,并将jsCodeSource中的js代码替换到当前script元素中
            $(element).removeAttr('src').html(bodyJsCodeSource[index].code);
          }
        });
        resHTML($.html());
      })
      .catch((error) => {
        console.log(error);
        resInvalid(error.message);
      });
  } catch (e) {
    resInvalid(`Error creating ${e.message}`);
  }
}

export const config = {
  api: {
    responseLimit: false,
  },
};
