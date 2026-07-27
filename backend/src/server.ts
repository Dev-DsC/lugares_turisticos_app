import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

import express from 'express';
import mongoose from 'mongoose';
import lugaresRouter from './routes/lugares.routes';
import authRouter from './routes/auth.routes';

const app = express();
const PORT = Number(process.env['PORT']) || 3000;
const mongoUri = process.env['MONGODB_URI'];

if (!mongoUri) {
  throw new Error('Falta MONGODB_URI en el archivo .env');
}

app.use(cors());
app.use(express.json());

app.use('/api/lugares', lugaresRouter);
app.use('/api/auth', authRouter);

app.get('/api/salud', (_request, response) => {
  response.json({
    mensaje: 'La API de lugares turísticos está funcionando',
  });
});

async function iniciarServidor(): Promise<void> {
  try {
    await mongoose.connect(mongoUri!);
    console.log('Conectado a MongoDB');

    app.listen(PORT, () => {
      console.log(`API disponible en http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error('No fue posible conectar con MongoDB:', error);
    process.exit(1);
  }
}

iniciarServidor();
