/* eslint-disable no-continue */
const XLSX = require('xlsx');

exports.xlsxToJs = (filePath: string) => {
  const workbook = XLSX.readFile(filePath);
  const sheetNameList = workbook.SheetNames;

  const sheets: object[] = XLSX.utils.sheet_to_json(
    workbook.Sheets[sheetNameList[0]]
  );

  sheets.forEach((r) => {
    console.log(r);
  });

  // sheetNameList.forEach((y: string) => {
  //   const worksheet = workbook.Sheets[y];
  //   const headers: any = {};
  //   const data: any[] = [];
  //   Object.keys(worksheet).forEach((z: any) => {
  //     // if (z[0] === '!') break;
  //     // parse out the column, row, and value
  //     let tt: number = 0;
  //     for (let i: number = 0; i < z.length; i += 1) {
  //       if (!Number.isNaN(z[i])) {
  //         tt = i;
  //       }
  //     }

  //     const col: string = z[0];
  //     const row: number = Number(z.substring(1, tt));
  //     console.log(z, col, row);
  //     const value: any = worksheet[z].v;
  //     // store header names
  //     if (row === 1 && value) {
  //       headers[col] = value;
  //     }

  //     if (!data[row]) data[row] = {};
  //     data[row][headers[col]] = value;
  //   });
  //   // drop those first two rows which are empty
  //   data.shift();
  //   data.shift();
  //   sheets[y] = data;
  // });
  return sheets;
};
