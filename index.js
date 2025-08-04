const express = require('express');
const swaggerUi = require('swagger-ui-express');
const fs = require('fs');
const path = require('path');
const { createProxyMiddleware } = require('http-proxy-middleware');

const app = express();
const port = process.env.PORT || 3000;

// Proxy API
app.use('/api', createProxyMiddleware({
  target: 'http://41.230.48.11:4800',
  changeOrigin: true,
  pathRewrite: { '^/api': '' }
}));

// Chargement swagger.json
let swaggerDocument;
try {
  swaggerDocument = JSON.parse(fs.readFileSync(path.join(__dirname, 'test.json'), 'utf8'));
  // Mise à jour du serveur proxy
  swaggerDocument.servers = [{ url: 'https://swaggertelesys.onrender.com/api' }];
} catch (err) {
  console.error('Erreur lecture swagger.json :', err);
  process.exit(1);
}

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// Redirection racine vers /api-docs
app.get('/', (req, res) => {
  res.send('Swagger UI placeholder');
});

app.listen(port, () => {
  console.log(`Serveur démarré sur le port ${port}`);
});
