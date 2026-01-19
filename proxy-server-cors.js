const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');
const cors = require('cors');

const app = express();
const PORT = 3002;

// Enable CORS for all routes (pre-flight)
app.use(cors({ origin: true, credentials: true }));

// Proxy all requests
const apiProxy = createProxyMiddleware({
    target: 'https://bbs.yamibo.com',
    changeOrigin: true,
    logLevel: 'debug',
    onProxyReq: (proxyReq, req, res) => {
        // Mock User-Agent to look like a mobile app or browser
        proxyReq.setHeader('User-Agent', 'Mozilla/5.0 (iPhone; CPU iPhone OS 16_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.6 Mobile/15E148 Safari/604.1');
        console.log(`[Proxy] ${req.method} ${req.url} -> https://bbs.yamibo.com${req.url}`);
    },
    onProxyRes: (proxyRes, req, res) => {
        // STRIP upstream CORS headers to avoid conflicts
        delete proxyRes.headers['access-control-allow-origin'];
        delete proxyRes.headers['access-control-allow-methods'];
        delete proxyRes.headers['access-control-allow-headers'];

        // Let the express 'cors' middleware (or manual setting) handle it.
        // Or explicitly set it here to be safe:
        proxyRes.headers['Access-Control-Allow-Origin'] = req.headers.origin || '*';
        proxyRes.headers['Access-Control-Allow-Credentials'] = 'true';
        proxyRes.headers['Access-Control-Allow-Methods'] = 'GET,POST,PUT,DELETE,OPTIONS';
        proxyRes.headers['Access-Control-Allow-Headers'] = 'Content-Type, Authorization, Content-Length, X-Requested-With, auth';

        console.log(`[Proxy] Response: ${proxyRes.statusCode}`);
    }
});

app.use('/', apiProxy);

app.listen(PORT, () => {
    console.log(`CORS Policy Proxy Server running on http://localhost:${PORT}`);
    console.log(`Forwarding all requests to https://bbs.yamibo.com with FORCE CORS`);
});
