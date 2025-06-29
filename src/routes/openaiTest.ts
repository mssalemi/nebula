import { Router, Request, Response } from 'express';
import { buildPrompt } from '../utils/buildPrompt';
import { getClipMarkers } from '../services/openaiService';

const router = Router();

router.get('/openai-test', async (req: Request, res: Response) => {
  const testTranscript = "00:00:03 This is a test. 00:00:05 This is only a test.";
  try {
    const prompt = buildPrompt(testTranscript);
    const markers = await getClipMarkers(prompt);
    res.json(markers);
  } catch (error) {
    const err = error as Error;
    res.status(500).json({ error: err.message });
  }
});

export default router; 