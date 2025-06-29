import express from 'express';
import dotenv from 'dotenv';
import clipMarkersRouter from './routes/clipMarkers';
import openaiTestRouter from './routes/openaiTest';

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

app.use('/api', clipMarkersRouter);
app.use('/api', openaiTestRouter);

app.get('/', (req, res) => {
  res.send('Clip Marker API is running!');
});

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
}); 