import { Request, Response } from 'express';

const { xlsxToJs } = require('../modules/xlsx.ts');

exports.fileUpload = (req: Request, res: Response) => {
  const { file } = req;
  if (!file) {
    res.status(400).json({ message: 'file can not be empty' });
  } else {
    const fileData = xlsxToJs(file.path);
    res.status(201).json({ ...fileData });
  }
};
