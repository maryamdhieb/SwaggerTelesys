const express = require('express');
const swaggerUi = require('swagger-ui-express');
const fs = require('fs');
const path = require('path');
const { createProxyMiddleware } = require('http-proxy-middleware');

const app = express();
const port = process.env.PORT || 3000;

// Proxy vers ton API distante
app.use('/api', createProxyMiddleware({
  target: 'http://41.230.48.11:4800',
  changeOrigin: true,
  pathRewrite: { '^/api': '' }
}));

// Charge swagger.json
const swaggerDocument = JSON.parse(fs.readFileSync(path.join(__dirname, 'test.json'), 'utf8'));

// Mets à jour le serveur Swagger pour utiliser ton URL Render avec proxy
swaggerDocument.servers = [{ url: 'https://swaggertelesys.onrender.com/api' }];

// Swagger UI sur /api-docs
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// Redirige la racine vers Swagger UI
app.get('/', (req, res) => {
  res.redirect('/api-docs');
});

app.listen(port, () => {
  console.log(`Serveur démarré sur http://localhost:${port}`);
});
