/* eslint-disable no-param-reassign */
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
  color: string;
  name: string;
  disqualifying: number;
  politicalOpposition: number;
  gender: string;
  age: string;
  country: string;
  region: string;
  study: string;
  ideologies: string[];
}

interface Link {
  source: string;
  target: string;
  type: string;
  color: string;
  post?: string;
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
      const idéologies : string[] = c['idéologies']?.split(',')?.map((s : string) => {
        if(s[0] === ' ') return s.substring(1);
        return s;
      });

      console.log(idéologies)
      if(!authors.find((p) => p.id === c['Facebook User ID'])) {
        console.log(idéologies)
        authors.push({
          id : c['Facebook User ID'],
          name: `Author ${i}`, 
          type: 'author',
          posts: [],
          size: 8,
          color: color.author,
          disqualifying: c?.disqualifiant? 1 : 0,
          politicalOpposition: c['oposition politique'] ? 1 : 0,
          gender: c?.genre || 'inconnu',
          age: c?.age || 'inconnu',
          country: c?.pays  || 'inconnu',
          region: c?.region || 'inconnu',
          study: c?.étude || 'inconnu',
          ideologies: idéologies || [],
        });
      }

      comments.push({
        id: commentId,
        type: 'comment',
        size: 5,
        author: c['Facebook User ID'],
        category: posts.find((p) => p.id === id)?.category,
        disqualifying: c?.disqualifiant? 1 : 0,
        politicalOpposition: c['oposition politique'] ? 1 : 0,
        ideologies: idéologies || [],
        color: color.comment,
        post: id,
        comment: c.Comment || null ,
        url: c['Comment URL'] || null ,
        image: c.Image !== 'No Image' ? c.Image : null ,
        date: new Date(c['Comment Time']),
      });
      console.log(c['Comment Time']);
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

  let idelologiesList : string[] = [];

  authors = authors.map((a) => {
    const author = a
    comments.forEach((c) => {
      if (c.author === a.id) {
        if (c.politicalOpposition) {
          author.politicalOpposition += 1
        }
        if (c.disqualifying) {
          author.disqualifying += 1
        }
        if (c.ideologies) {
          c.ideologies.forEach((i : string) => {
            if (!author.ideologies.find((ai : string) => ai === i) && i !== "") {
              author.ideologies = [...author.ideologies , c.ideology]
            }
            if (i !== "" && !idelologiesList.find((ai : string) => ai === i)) {
              console.log(i)
              idelologiesList = [...idelologiesList , i]
            }
          })
        }
        c.author = author
        links.push({
          source: author.id,
          color: color.comment,
          type:'comment',
          post: c.post,
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
    
    return author
  })

  return {
    list: {
      idelologies: idelologiesList,
    },
    nodes: [...posts,...comments , ...authors],
    links,
  };
};
