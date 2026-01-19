const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');
const cors = require('cors');

const app = express();
const PORT = 3001;

// Enable CORS
app.use(cors());

// Proxy all requests relative to root to the target, preserving the path.
// e.g. /api/mobile/index.php -> https://bbs.yamibo.com/api/mobile/index.php
const apiProxy = createProxyMiddleware({
    target: 'https://bbs.yamibo.com',
    changeOrigin: true,
    logLevel: 'debug',
    onProxyReq: (proxyReq, req, res) => {
        // Add fake User-Agent to avoid blocking
        proxyReq.setHeader('User-Agent', 'Mozilla/5.0 (iPhone; CPU iPhone OS 16_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.6 Mobile/15E148 Safari/604.1');
        console.log(`[Proxy] ${req.method} ${req.url} -> https://bbs.yamibo.com${req.url}`);
    },
    onProxyRes: (proxyRes, req, res) => {
        console.log(`[Proxy] Response: ${proxyRes.statusCode} ${req.url}`);
    }
});

app.use('/', apiProxy);

app.listen(PORT, () => {
    console.log(`Simple Proxy Server running on http://localhost:${PORT}`);
    console.log(`Forwarding all requests to https://bbs.yamibo.com`);
});
