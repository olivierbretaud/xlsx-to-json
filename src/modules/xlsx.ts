/* eslint-disable prettier/prettier */
/* eslint-disable no-continue */
const XLSX = require('xlsx');

interface CommentData {
  [key: string]: any
}

interface Post {
  id: string;
  type: string;
  size: number;
  postsCount?: number;
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
  color: string;
}

interface Author {
  id: any;
  type: string;
  size: number;
  posts: string[];
  color: string
}

interface Link {
  source: string;
  target: string;
  type: string;
  color: string;
}

exports.xlsxToJs = (filePath: string) => {
  const workbook = XLSX.readFile(filePath);
  const sheetNameList = workbook.SheetNames;
  console.log(sheetNameList);

  const color = {
    post: '#2d1569',
    comment: '#8567cf',
    author: '#5A2BD1'
  };  

  const commentsDatas: CommentData[] = XLSX.utils.sheet_to_json(
    workbook.Sheets[sheetNameList[0]],
    { raw: false, dateNF: 'yyyy-mm-dd HH:mm:ss' }
  );

  let posts: Post[] = [];
  const comments: CommentData[] = [];
  let authors: Author[] = [];
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
          color: color.post
        });
      }
      if(!authors.find((p) => p.id === c['Facebook User ID'])) {
        authors.push({
          id : c['Facebook User ID'],
          type: 'author',
          posts: [],
          size: 8,
          color: color.author
        });
      }
      console.log(c);

      comments.push({
        id: commentId,
        type: 'comment',
        size: 5,
        author: c['Facebook User ID'],
        category: posts.find((p) => p.id === id)?.category,
        color: color.comment,
        post: id,
        ...c
      });
      // links.push({
      //   source: id,
      //   target: commentId,
      // });
    }
  });

  // 'disqualifiant',  'Harcèlement' 'Moqueur' 'Moqueur', Insultant , oposition politique


  posts = posts.map((p) => {
    const postComments = comments.filter((c) => c.post === p.id);
    const postsCount = postComments.length
    const size = 12;
    const disqualifying = postComments.filter((c) => c?.disqualifiant).length
    const politicalOpposition = postComments.filter((c) => c['oposition politique']).length
    const harassment = postComments.filter((c) => c?.Harcèlement).length
    const insulting = postComments.filter((c) => c?.Insultant).length
    const mocking = postComments.filter((c) => c?.Moqueur).length
    // const men = postComments.filter((c) => c?.genre?.toLowerCase() === "homme").length
    // const women = postComments.filter((c) => c?.genre?.toLowerCase() === "femme").length
    return {
      ...p,
      postsCount,
      size,
      disqualifying,
      politicalOpposition,
      harassment,
      insulting,
      mocking,
    }
  });

  authors = authors.map((a) => {
    const author = a
    comments.forEach((c) => {
      if (c.author === a.id) {
        links.push({
          source: author.id,
          color: color.comment,
          type:'comment',
          target: c.id,
        });
        if (!author.posts?.find((p) => p === c.post)) {
          author.posts = [...author.posts , c.post];
          links.push({
            source: c.post,
            type: 'post',
            target: author.id,
            color: color.author
          });
        }
      }
    });
    
    return a
  })

  return {
    nodes: [...posts,...comments , ...authors],
    links,
  };
};
