import axios from 'axios';
import * as cheerio from 'cheerio';
import path from 'path';
import fs from 'fs';
const directoryName = 'emailsTemplate'; // 你可以替换成你想要的目录路径
const fileName = 'index.html';
export default function handler(req, res) {
  // 定义要下载的页面URL
  const url = 'http://localhost:3000/charts';
  const rootPath = path.parse(process.cwd()).root;
  // 使用axios下载页面内容
  axios
    .get(url)
    .then((response) => {
      // 使用cheerio解析HTML
      const $ = cheerio.load(response.data);
      return $;
    })
    .then(($) => {
      const html = $.html();
      // 创建目录
      fs.mkdir(path.join(rootPath, directoryName), { recursive: true }, (err) => {
        if (err) {
          res.status(500).json({ msg: 'fail' });
        } else {
          // 创建index.html文件
          const filePath = path.join(rootPath, directoryName, fileName);
          fs.writeFile(filePath, html, (err) => {
            if (err) {
              res.status(500).json({ msg: 'fail' });
              console.error(`Error creating ${fileName}: ${err.message}`);
            } else {
              console.log('success create file');
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
        console.log(jsFile);
        jsFiles.push(jsFile);
      });
      console.log('jsFiles', jsFiles);
      // 输出提取到的JS文件链接
      // 下载JS文件
      jsFiles.forEach((jsFile, i) => {
        axios
          .get('http://localhost:3000' + jsFile)
          .then((jsResponse) => {
            // 保存JS文件到本地
            const fileName = i;
            const filePath = path.join(rootPath, directoryName, fileName + '.js');
            fs.writeFileSync(filePath, jsResponse.data);
            console.log(`Downloaded ${fileName}`);
          })
          .catch((error) => {
            console.error(`Error downloading ${jsFile}: ${error.message}`);
          });
      });
      res.status(200).json({ msg: 'success' });
    })
    .catch((error) => {
      console.error(`Error fetching ${url}: ${error.message}`);
    });
}
