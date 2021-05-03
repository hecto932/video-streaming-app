'use strict'

import fs from 'fs';
import path from 'path';
import { Request, Response, Router } from 'express';
import allVideos from '../data/mockData';

const router = Router();

router.get('/', (req: Request, res: Response) => {
  res.json(allVideos);
});

router.get('/:id/data', (req: Request, res: Response) => {
  const id = parseInt(req.params.id, 10);

  res.json(allVideos[id])
});

router.get('/video/:id', (req: Request, res: Response) => {
  const videoPath = path.join(__dirname, '../', `/assets/${req.params.id}.mp4`);
  const videoStat = fs.statSync(videoPath);
  const videoFileSize = videoStat.size;
  const videoRange = req.headers?.range;

  if (videoRange) {
    const parts = videoRange.replace(/bytes=/, '').split('-')
    const start = parseInt(parts[0], 10);
    const end = parts[1]
      ? parseInt(parts[1], 10)
      : videoFileSize - 1;
    const chunksize = (end - start) + 1
    const file = fs.createReadStream(videoPath, { start, end })
    const head = {
      'Content-Range': `bytes ${start}-${end}/${videoFileSize}`,
      'Accept-Ranges': 'bytes',
      'Content-Length': chunksize,
      'Content-Type': 'video/mp4',
    }
    res.writeHead(206, head);
    file.pipe(res);
  } else {
    const head = {
      'Content-Length': videoFileSize,
      'Content-Type': 'video/mp4',
    };
    res.writeHead(200, head);
    fs.createReadStream(videoPath).pipe(res);
  }
});

export default router;