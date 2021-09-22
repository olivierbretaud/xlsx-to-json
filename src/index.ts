import express, { Application, Request, Response, NextFunction } from 'express';

const app: Application = express();
const port = 8080;

app.use((req: Request, res: Response, next: NextFunction) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', '*');
  res.header(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept, Authorization'
  );
  next();
});

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

const fileRoutes = require('./routes/file.ts');

app.use('/file', fileRoutes);

app.listen(port, () => {
  console.log(`server started at http://localhost:${port}`);
});
