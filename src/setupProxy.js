// let proxy = require('http-proxy-middleware');
const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function(app) {
  app.use('/api', createProxyMiddleware( { target: 'http://localhost:9000',  changeOrigin: true }));
  app.use('/api', createProxyMiddleware('/ws', { target: 'ws://localhost:9000', ws: true, changeOrigin: true }));

  // app.use(proxy('/api', { target: 'http://localhost:9000' }));
  // app.use(proxy('/ws', { target: 'ws://localhost:9000', ws: true }));
};

// module.exports = function(app) {
//   app.use(
//     '/api',
//     createProxyMiddleware({
//        target: 'http://localhost:6000',
//        changeOrigin: true
//     })
//   );
// };