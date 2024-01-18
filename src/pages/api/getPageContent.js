import axios from 'axios';
import * as cheerio from 'cheerio';
import path from 'path';
import fs from 'fs';
const directoryName = 'emailsTemplate'; // 你可以替换成你想要的目录路径
const fileName = 'index.html';
const baseUrl = 'http://localhost:3000';
export default function handler(req, res) {
  // 定义要下载的页面URL
  const url = baseUrl + '/charts';
  const rootPath = path.parse(process.cwd()).root;
  // 使用axios下载页面内容
  axios
    .get(url)
    .then((response) => {
      // 使用cheerio解析HTML
      const $ = cheerio.load(response.data);
      const html = $.html();
      // 创建目录
      fs.mkdirSync(path.join(rootPath, directoryName), { recursive: true }, (err) => {
        if (err) {
          throw new Error(`${directoryName} directory can't be created: ${err.message}`);
        } else {
          // 创建index.html文件
          const filePath = path.join(rootPath, directoryName, fileName);
          fs.writeFileSync(filePath, html, (err) => {
            if (err) {
              throw new Error(`Error creating ${fileName}: ${err.message}`);
            }
          });
        }
      });
      return $;
    })
    .then(($) => {
      // 提取页面中的JS文件链接
      const jsFiles = [];
      $('script[src]').each((index, element) => {
        const jsFile = $(element).attr('src');
        jsFiles.push(jsFile);
      });
      console.log('jsFiles', jsFiles);
      // 输出提取到的JS文件链接
      // 下载JS文件
      jsFiles.forEach((jsFile, i) => {
        axios
          .get(baseUrl + jsFile)
          .then((jsResponse) => {
            let jsFileName = '';
            // 保存JS文件到本地
            // 匹配斜杠后面的 js 文件名，直到字符串结尾或者问号为止
            const regex = /\/([^\/]+\.js)(?:\?|$)/;
            const match = jsFile.match(regex);
            if (match && match[1]) {
              jsFileName = match[1];
            }
            const filePath = path.join(rootPath, directoryName, jsFileName);
            fs.writeFileSync(filePath, jsResponse.data);
            console.log(`Downloaded ${fileName}`);
          })
          .catch((error) => {
            throw new Error(`Error downloading ${jsFile}: ${error.message}`);
          });
      });
      res.status(200).json({ msg: 'success' });
    })
    .catch((error) => {
      console.error(`Error fetching ${url}: ${error.message}`);
      res.status(500).json({ msg: 'fail' });
    });
}
