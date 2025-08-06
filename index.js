const express = require('express');
const swaggerUi = require('swagger-ui-express');
const fs = require('fs');
const path = require('path');
const { createProxyMiddleware } = require('http-proxy-middleware');

const app = express();
const port = process.env.PORT || 3000;

// Route de ping keep-alive
app.get('/ping', (req, res) => {
  res.status(200).send('pong');
});

app.use('/api', createProxyMiddleware({
  target: 'http://41.230.48.11:4800',
  changeOrigin: true,
  pathRewrite: { '^/api': '' }
}));

const swaggerFilePath = path.join(__dirname, 'test.json');
let swaggerDocument = {};

try {
  swaggerDocument = JSON.parse(fs.readFileSync(swaggerFilePath, 'utf8'));
  swaggerDocument.servers = [{ url: 'https://swaggertelesys.onrender.com/api' }];
} catch (err) {
  console.error('Erreur chargement Swagger :', err);
}

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.get('/', (req, res) => {
  res.redirect('/api-docs');
});

app.listen(port, () => {
  console.log(`Serveur lancé sur http://localhost:${port}`);
});
