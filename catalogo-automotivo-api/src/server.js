require('dotenv').config();

const express = require('express');
const app = express();

app.use(express.json());

const productRoutes = require('./routes/product.routes');
app.use('/api', productRoutes);

app.get('/health', (_, res) => res.json({ status: 'ok' }));

app.use((_, res) => {
  res.status(404).json({ message: 'Rota não encontrada' });
});

app.use((err, _, res) => {
  console.error(err);
  res.status(500).json({ message: 'Erro interno' });
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
  console.log('GEMINI:', process.env.GEMINI_API_KEY ? 'OK' : 'EMPTY');
});
