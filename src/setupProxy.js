let proxy = require('http-proxy-middleware');

module.exports = function(app) {
  app.use(proxy('/api', { target: 'http://localhost:9000' }));
  app.use(proxy('/ws', { target: 'ws://localhost:9000', ws: true }));
};
