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
  authors?: string[];
}

interface Author {
  id: any;
  type: string;
  size: number;
  posts: string[];
  color: string;
  code: string;
  name: string;
  disqualifying: number;
  politicalOpposition: number;
  gender: string;
  age: string;
  country: string;
  region: string;
  study: string;
  ideologies: string[];
  banner: string;
  job: string; 
}

interface Link {
  source: string;
  target: string;
  type: string;
  color: string;
  post?: string;
  author?:string;
}

exports.xlsxToJs = (filePath: string) => {
  const workbook = XLSX.readFile(filePath);
  const sheetNameList = workbook.SheetNames;

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
  let catergoriesList: string[] = [];

  commentsDatas.forEach((c, i) => {
    const id = c['Comment ID']?.split('_')[0];
    const commentId = `${c['Comment ID']}-${i}`;
    if (id) {
      if(!posts.find((p) => p.id === id)) {
        const catergory = c['catégorie'].trimEnd();
        if (catergory) {
          if (!catergoriesList.find((ai : string) => ai === catergory)) {
            catergoriesList = [...catergoriesList ,catergory]
          }
        }
        posts.push({
          id,
          type: 'post',
          size: 0,
          category: catergory,
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
      const ideologies : string[] = c['idéologies']?.split(',')?.map((s : string) => {
        if(s[0] === ' ') return s.substring(1);
        return s;
      });

      if(!authors.find((p) => p.id === c['Facebook User ID'])) {
        authors.push({
          id : c['Facebook User ID'],
          name: c.Name, 
          code: `Author ${i}`, 
          type: 'author',
          posts: [],
          size: 8,
          color: color.author,
          disqualifying: c?.disqualifiant? 1 : 0,
          politicalOpposition: c['oposition politique'] ? 1 : 0,
          gender: c?.genre?.trimEnd() || "S/I",
          age: c?.age ? c?.age.replace(/\s/g, '').replace('à','-') : "S/I",
          country: c?.pays?.trimEnd()  || "S/I",
          region: c?.region?.trimEnd() || "S/I",
          banner: c?.banner?.trimEnd() || "S/I",
          study: c?.étude?.trimEnd() || "S/I",
          job: c?.profession ? c?.profession?.trimEnd() : "S/I",
          ideologies: ideologies?.length ? ideologies : [],
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
        ideologies: ideologies || [],
        color: color.comment,
        post: id,
        comment: c.Comment || null ,
        url: c['Comment URL'] || null ,
        image: c.Image !== 'No Image' ? c.Image : null ,
        date: new Date(c['Comment Time']),
      });
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

  let idelologiesList : string[] = ["S/I"];
  let agesList : string[] = ["S/I"];
  let gendersList : string[] = ["S/I"];
  let countriesList : string[] = ["S/I"];
  let studiesList : string[] = ["S/I"];

  authors = authors.map((a) => {
    const author = a;
    if (a.age) {
      const age = a.age.replace(/\s/g, '').replace('à','-');
      if (!agesList.find((ai : string) => ai === age)) {
        agesList = [...agesList , age]
      }
    }
    if (a.gender) {
      if (!gendersList.find((ai : string) => ai === a.gender)) {
        gendersList = [...gendersList , a.gender]
      }
    }
    if (a.country) {
      if (!countriesList.find((ai : string) => ai === a.country)) {
        countriesList = [...countriesList , a.country]
      }
    }
    if (a.study) {
      if (!studiesList.find((ai : string) => ai === a.study)) {
        studiesList = [...studiesList , a.study]
      }
    }
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
            if (i !== "" && !idelologiesList.find((ai : string) => ai === i.trimEnd())) {
              idelologiesList = [...idelologiesList , i.trimEnd()]
            }
          })
        }
        c.author = author
        links.push({
          source: c.id,
          color: color.comment,
          type:'comment',
          post: c.post,
          target: author.id,
        });
        links.push({
          source: c.post,
          type: 'post',
          target: c.id,
          author: author.id,
          color: color.author
        });
        if (!author.posts?.find((p) => p === c.post)) {
          author.posts = [...author.posts , c.post];
          links.push({
            source: c.post,
            type: 'author',
            target: author.id,
            color: color.author
          });
        }
      }
    });
    
    return author
  });

  posts = posts.map((p) => {
    const post = p;
    const postAutors = authors.filter((a: Author) => {
      const found = a?.posts?.find((ap: string) => ap === p.id);
      if (found) {
        return a.id;
      }
      return null
    });
    post.authors = postAutors.map((a: Author) => a.id)
    return post;
  });

  function sortAlpha(array : string[]) {
    const result =  array.sort((a, b) => {
      if(a < b) { return -1; }
      if(a > b) { return 1; }
      return 0;
    });
    return result;
  };

  return {
    list: {
      idelologies: idelologiesList,
      ages: sortAlpha(agesList),
      genders: sortAlpha(gendersList).reverse(),
      countries: sortAlpha(countriesList).reverse(),
      studies: sortAlpha(studiesList).reverse(),
      ctegories: sortAlpha(catergoriesList),
    },
    nodes: [...posts,...comments , ...authors],
    links,
  };
};