import express from 'express';
import historyRouter from './src/api/history.js';

const app = express();
app.use(express.static('public'));
app.use(historyRouter);

app.listen(3000, () => {
  console.log('http://localhost:3000 でサーバー起動');
});
