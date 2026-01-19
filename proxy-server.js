const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');
const cors = require('cors');

const app = express();
const PORT = 3000;

// Enable CORS for the frontend app
app.use(cors());

// Proxy configuration
const apiProxy = createProxyMiddleware({
    target: 'https://bbs.yamibo.com',
    changeOrigin: true,
    pathRewrite: {
        '^/api': '/api/mobile/index.php', // rewrite path
    },
    onProxyReq: (proxyReq, req, res) => {
        // Add any necessary headers here if needed
        // proxyReq.setHeader('User-Agent', 'YamiboApp/1.0');
        console.log(`[Proxy] ${req.method} ${req.url} -> ${proxyReq.path}`);
    },
    onProxyRes: (proxyRes, req, res) => {
        console.log(`[Proxy] Response: ${proxyRes.statusCode}`);
    },
    logLevel: 'debug'
});

// Use the proxy for /api requests
app.use('/api', apiProxy);

app.listen(PORT, () => {
    console.log(`Local Proxy Server running on http://localhost:${PORT}`);
    console.log(`Proxying /api requests to https://bbs.yamibo.com/api/mobile/index.php`);
});
