const XLSX = require('xlsx');

exports.xlsxToJs = (filePath: string) => {
  const workbook = XLSX.readFile(filePath);
  const sheetNameList = workbook.SheetNames;

  const sheets: any = {};

  sheetNameList.forEach((y: string) => {
    // const worksheet = workbook.Sheets[y];
    // const headers = {};
    const data: any[] = [];
    // for (z in worksheet) {
    //   if (z[0] === '!') continue;
    //   // parse out the column, row, and value
    //   let tt = 0;
    //   for (let i = 0; i < z.length; i++) {
    //     if (!isNaN(z[i])) {
    //       tt = i;
    //       break;
    //     }
    //   }
    //   const col = z.substring(0, tt);
    //   const row = parseInt(z.substring(tt));
    //   const value = worksheet[z].v;

    //   // store header names
    //   if (row == 1 && value) {
    //     headers[col] = value;
    //     continue;
    //   }

    //   if (!data[row]) data[row] = {};
    //   data[row][headers[col]] = value;
    // }
    // drop those first two rows which are empty
    data.shift();
    data.shift();
    sheets[y] = data;
  });
  return sheets;
};
