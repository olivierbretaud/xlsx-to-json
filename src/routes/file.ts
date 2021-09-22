import { Router, Request } from 'express';

const router = Router();

const path = require('path');
const multer = require('multer');

const storage = multer.diskStorage({
  destination(req: Request, file: any, cb: any) {
    cb(null, 'uploads/');
  },
  filename(req: Request, file: any, cb: any) {
    cb(null, file.originalname + path.extname(file.originalname));
  },
});

const upload = multer({ storage });
const fileController = require('../controllers/fileController.ts');

router.post('/upload', upload.single('file'), fileController.fileUpload);

module.exports = router;
