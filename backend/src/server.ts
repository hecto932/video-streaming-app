'use strict'

import express from 'express';
import cors from 'cors';

import videosRouter from './routes/video';

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());

app.use('/videos', videosRouter);

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`)
})