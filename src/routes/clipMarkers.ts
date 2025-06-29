import { Router, Request, Response } from 'express';
import { buildPrompt } from '../utils/buildPrompt';
import { getClipMarkers } from '../services/openaiService';
import { readTranscriptFile } from '../utils/transcriptReader';

const router = Router();

router.post('/clip-markers', async (req: Request, res: Response) => {
  const { filePath } = req.body;

  if (!filePath) {
    return res.status(400).json({ error: 'filePath is required.' });
  }

  try {
    const transcript = await readTranscriptFile(filePath);
    const prompt = buildPrompt(transcript);
    const markers = await getClipMarkers(prompt);
    res.json(markers);
  } catch (error) {
    const err = error as Error;
    res.status(500).json({ error: err.message });
  }
});

export default router; 