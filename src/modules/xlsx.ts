/* eslint-disable prettier/prettier */
/* eslint-disable no-continue */
const XLSX = require('xlsx');

interface CommentData {
  [key: string]: string
}

interface Post {
  id: string;
  type: string;
  size: number;
  category: string;
  aime?: string;
  adore?: string;
  solidaire?: string;
  haha?: string;
  grr?: string;
  share?: string;
  women?: number
  men?: number;
  disqualifying?: number;
  politicalOpposition?: number;
  harassment ?: number; 
  insulting?: number; 
  mocking?: number;
  note?: string;
}

interface Link {
  source: string;
  target: string;
}

exports.xlsxToJs = (filePath: string) => {
  const workbook = XLSX.readFile(filePath);
  const sheetNameList = workbook.SheetNames;
  console.log(sheetNameList);

  const commentsDatas: CommentData[] = XLSX.utils.sheet_to_json(
    workbook.Sheets[sheetNameList[0]],
    { raw: false, dateNF: 'yyyy-mm-dd HH:mm:ss' }
  );

  let posts: Post[] = [];
  const comments: CommentData[] = [];
  const links: Link[] = [];

  commentsDatas.forEach((c, i) => {
    const id = c['Comment ID']?.split('_')[0];
    const commentId = `${c['Comment ID']}-${i}`;
    if (id) {
      if(!posts.find((p) => p.id === id)) {
        posts.push({
          id,
          type: 'post',
          size: 0,
          category: c['catégorie'],
          note: c['note publication'],
          aime: c?.aime,
          adore: c?.adore,
          solidaire: c?.solidaire,
          haha: c?.haha,
          grr: c?.grr,
          share: c?.share,
        });
      }
      comments.push({
        id: commentId,
        type: 'comment',
        post: id,
        ...c
      });
      links.push({
        source: id,
        target: commentId,
      });
    }
  });

  // 'disqualifiant',  'Harcèlement' 'Moqueur' 'Moqueur', Insultant , oposition politique


  posts = posts.map((p) => {
    const postComments = comments.filter((c) => c.post === p.id);
    const size = postComments.length
    const disqualifying = postComments.filter((c) => c?.disqualifiant).length
    const politicalOpposition = postComments.filter((c) => c['oposition politique']).length
    const harassment = postComments.filter((c) => c?.Harcèlement).length
    const insulting = postComments.filter((c) => c?.Insultant).length
    const mocking = postComments.filter((c) => c?.Moqueur).length
    // const men = postComments.filter((c) => c?.genre?.toLowerCase() === "homme").length
    // const women = postComments.filter((c) => c?.genre?.toLowerCase() === "femme").length
    return {
      ...p,
      size,
      disqualifying,
      politicalOpposition,
      harassment,
      insulting,
      mocking,
    }
  });

  return {
    nodes: [...posts,...comments],
    links,
  };
};
