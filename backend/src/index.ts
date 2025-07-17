import express from 'express';
import cors from 'cors';

import userRoutes from './routes/userRoutes';
import clientRoutes from './routes/clientRoutes';
import candidateRoutes from './routes/candidateRoutes';

const app = express();
const PORT = 4000;

app.use(cors());
app.use(express.json());

// ROTAS
app.use('/api/users', userRoutes);
app.use('/api/clients', clientRoutes);
app.use('/api/candidates', candidateRoutes);

// START SERVER
app.listen(PORT, () => {
  console.log(`🚀 Servidor rodando em http://localhost:${PORT}`);
});