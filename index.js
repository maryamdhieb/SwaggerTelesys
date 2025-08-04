const express = require('express');
const swaggerUi = require('swagger-ui-express');
const fs = require('fs');
const path = require('path');
const { createProxyMiddleware } = require('http-proxy-middleware');

const app = express();
const port = process.env.PORT || 3000;

// Proxy vers le backend pour contourner le CORS
app.use('/api', createProxyMiddleware({
  target: 'http://41.230.48.11:4800',
  changeOrigin: true,
  pathRewrite: { '^/api': '' }
}));

// Swagger UI avec swagger.json modifié
const swaggerDocument = JSON.parse(fs.readFileSync(path.join(__dirname, 'test.json'), 'utf8'));

// 👉 Modifier dynamiquement les URLs de serveur dans swagger.json
swaggerDocument.servers = [
  {
    url: 'http://localhost:3000/api' // pointé vers notre proxy
  }
];

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.listen(port, () => {
  console.log(`✅ Swagger UI dispo sur : http://localhost:${port}/api-docs`);
});
