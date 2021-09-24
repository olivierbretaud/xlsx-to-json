/* eslint-disable no-continue */
const XLSX = require('xlsx');

interface keyable {
  [key: string]: any;
}
exports.xlsxToJs = (filePath: string) => {
  const workbook = XLSX.readFile(filePath);
  const sheetNameList = workbook.SheetNames;
  console.log(sheetNameList);

  const commentsData: object[] = XLSX.utils.sheet_to_json(
    workbook.Sheets[sheetNameList[0]],
    { raw: false, dateNF: 'yyyy-mm-dd' }
  );

  const postsData: object[] = XLSX.utils.sheet_to_json(
    workbook.Sheets[sheetNameList[1]],
    { raw: false, dateNF: 'yyyy-mm-dd' }
  );

  const posts: object[] = postsData.map((p: keyable) => {
    const post: keyable = { ...p };
    post.id = p.postID;
    post.type = 'post';
    return post;
  });

  console.log(posts);

  return [...posts, ...commentsData];
};
