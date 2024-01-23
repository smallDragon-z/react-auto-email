import axios from 'axios';
import * as cheerio from 'cheerio';
import path from 'path';
import fs from 'fs';
import handleRes from '@/src/pages/api/untils/handleRes';
const directoryName = 'emailsTemplate'; // 你可以替换成你想要的目录路径
import { URL_REG } from '@/src/pages/api/constants';
import fetchJsFile from '@/src/pages/api/untils/reqJsFile';
import jsDownloadAddress from '@/src/pages/api/untils/getJsURLByPrefix';

export default function downloadWebPage(req, res) {
  const headJsFiles = [];
  const bodyJsFiles = [];
  const { resInvalid, resSuc } = handleRes(res);
  const { url } = req.query;
  const urlReg = URL_REG;
  // 判断url是否合法
  // 如果不合法，返回错误信息
  if (url === undefined || !urlReg.test(url)) {
    resInvalid('url为空或不合法');
    return;
  }
  const baseUrl = new URL(url).origin;
  // 发送请求，获取页面内容
  try {
    axios.get(url).then(async (response) => {
      // 使用cheerio解析HTML
      const $ = cheerio.load(response.data);
      // 获取html head中的script
      const headScripts = $('head>script').toArray();
      // 获取html body中的script
      const bodyScripts = $('body>script').toArray();
      // 整理head中的script
      for (let i = 0; i < headScripts.length; i++) {
        if (headScripts[i].attribs.src) {
          headJsFiles.push({
            codeSrc: headScripts[i].attribs.src,
            index: i,
          });
        }
      }
      // 整理body中的script
      for (let i = 0; i < bodyScripts.length; i++) {
        if (bodyScripts[i].attribs.src) {
          bodyJsFiles.push({
            codeSrc: bodyScripts[i].attribs.src,
            index: i,
          });
        }
      }
      // // 创建目录
      const rootPath = path.parse(process.cwd()).root;
      fs.mkdir(path.join(rootPath, directoryName), { recursive: true }, async (err) => {
        if (err) {
          console.error(`${directoryName}创建失败: ${err.message}`);
        } else {
          const promiseWriteFileTasks = [];
          // 遍历head中的script，按顺序请求js文件的内容保存到headJsSource中
          for (const headScript of headJsFiles) {
            const jsUrl = jsDownloadAddress(headScript.codeSrc, baseUrl);
            const jsFile = await fetchJsFile(jsUrl);
            // 将jsFile保存到本地指定目录
            const filePath = path.join(rootPath + directoryName, `${headScript.index}_head.js`);
            promiseWriteFileTasks.push(
              new Promise((resolve, reject) => {
                fs.writeFile(filePath, jsFile, (err) => {
                  if (err) {
                    console.error(`Error creating ${headScript.index}: ${err.message}`);
                    reject(err);
                  } else {
                    console.log(`success create ${headScript.index}_head.js`);
                    resolve();
                  }
                });
              }),
            );
          }
          // 遍历body中的script，按请求js文件的内容保存到bodyJsSource中
          for (const bodyScript of bodyJsFiles) {
            const jsUrl = jsDownloadAddress(bodyScript.codeSrc, baseUrl);
            const jsFile = await fetchJsFile(jsUrl);
            // 将jsFile保存到本地指定目录
            const filePath = path.join(rootPath + directoryName, `${bodyScript.index}_head.js`);
            promiseWriteFileTasks.push(
              new Promise((resolve, reject) => {
                fs.writeFile(filePath, jsFile, (err) => {
                  if (err) {
                    console.error(`Error creating ${bodyScript.index}: ${err.message}`);
                    reject(err);
                  } else {
                    console.log(`success create ${bodyScript.index}_head.js`);
                    resolve();
                  }
                });
              }),
            );
          }
          console.log(promiseWriteFileTasks.length);
          // Promise.all(promiseWriteFileTasks)
          //   .then(() => {
          //     // 在所有文件创建完成后调用resSuc
          //     console.log('handle ResSuc');
          //     resSuc('success');
          //   })
          //   .catch((err) => {
          //     console.error('Error in write operations:', err.message);
          //   });
        }
      });
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
