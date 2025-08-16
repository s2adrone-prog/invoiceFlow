import express from 'express';
import cors from 'cors';
import authRouter from './auth.js';

const app = express();
const port = 5000;

app.use(cors());
app.use(express.json());
app.use('/', authRouter);

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});