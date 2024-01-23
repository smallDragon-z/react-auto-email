// // 创建目录
// const rootPath = path.parse(process.cwd()).root;
// fs.mkdir(path.join(rootPath, directoryName), { recursive: true }, async (err) => {
//   if (err) {
//     console.error(`${directoryName}创建失败: ${err.message}`);
//   } else {
//     const promiseWriteFileTasks = [];
//     // 遍历head中的script，按顺序请求js文件的内容保存到headJsSource中
//     for (const headScript of headJsFiles) {
//       const jsUrl = jsDownloadAddress(headScript.codeSrc, baseUrl);
//       const jsFile = await fetchJsFile(jsUrl);
//       // 将jsFile保存到本地指定目录
//       const filePath = path.join(rootPath + directoryName, `${headScript.index}_head.js`);
//       promiseWriteFileTasks.push(
//         new Promise((resolve, reject) => {
//           fs.writeFile(filePath, jsFile, (err) => {
//             if (err) {
//               console.error(`Error creating ${headScript.index}: ${err.message}`);
//               reject(err);
//             } else {
//               console.log(`success create ${headScript.index}_head.js`);
//               resolve();
//             }
//           });
//         }),
//       );
//     }
//     // 遍历body中的script，按请求js文件的内容保存到bodyJsSource中
//     for (const bodyScript of bodyJsFiles) {
//       const jsUrl = jsDownloadAddress(bodyScript.codeSrc, baseUrl);
//       const jsFile = await fetchJsFile(jsUrl);
//       // 将jsFile保存到本地指定目录
//       const filePath = path.join(rootPath + directoryName, `${bodyScript.index}_head.js`);
//       promiseWriteFileTasks.push(
//         new Promise((resolve, reject) => {
//           fs.writeFile(filePath, jsFile, (err) => {
//             if (err) {
//               console.error(`Error creating ${bodyScript.index}: ${err.message}`);
//               reject(err);
//             } else {
//               console.log(`success create ${bodyScript.index}_head.js`);
//               resolve();
//             }
//           });
//         }),
//       );
//     }
//     console.log(promiseWriteFileTasks.length);
//     // Promise.all(promiseWriteFileTasks)
//     //   .then(() => {
//     //     // 在所有文件创建完成后调用resSuc
//     //     console.log('handle ResSuc');
//     //     resHTML('success');
//     //   })
//     //   .catch((err) => {
//     //     console.error('Error in write operations:', err.message);
//     //   });
//   }
// });
