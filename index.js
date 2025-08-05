const express = require('express');
const swaggerUi = require('swagger-ui-express');
const fs = require('fs');
const path = require('path');
const { createProxyMiddleware } = require('http-proxy-middleware');

const app = express();
const port = process.env.PORT || 3000;

// === Configuration du proxy pour l'API backend ===
app.use('/api', createProxyMiddleware({
  target: 'http://41.230.48.11:4800',
  changeOrigin: true,
  pathRewrite: { '^/api': '' }
}));

// === Lecture du premier fichier Swagger ===
const swaggerFilePath1 = path.join(__dirname, 'test.json');
let swaggerDocument1 = {};
try {
  swaggerDocument1 = JSON.parse(fs.readFileSync(swaggerFilePath1, 'utf8'));
  swaggerDocument1.servers = [{ url: 'https://swaggertelesys.onrender.com/api' }];
} catch (err) {
  console.error('Erreur chargement Swagger 1 :', err);
}

// === Lecture du deuxième fichier Swagger ===
const swaggerFilePath2 = path.join(__dirname, 'T6API.json');
let swaggerDocument2 = {};
try {
  swaggerDocument2 = JSON.parse(fs.readFileSync(swaggerFilePath2, 'utf8'));
  swaggerDocument2.servers = [{ url: 'https://swaggertelesys.onrender.com/api' }];
} catch (err) {
  console.error('Erreur chargement Swagger 2 :', err);
}

// === Deux routes Swagger UI ===
app.use('/api-docs1', swaggerUi.serveFiles(swaggerDocument1), swaggerUi.setup(swaggerDocument1));
app.use('/api-docs2', swaggerUi.serveFiles(swaggerDocument2), swaggerUi.setup(swaggerDocument2));

// Route par défaut : redirection vers la première doc
app.get('/', (req, res) => {
  res.redirect('/api-docs1');
});

// Lancement du serveur
app.listen(port, () => {
  console.log(`Serveur lancé sur http://localhost:${port}`);
  console.log(`Doc 1: http://localhost:${port}/api-docs1`);
  console.log(`Doc 2: http://localhost:${port}/api-docs2`);
});
