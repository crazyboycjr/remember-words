'use strict';
const controller = require('./controllers/controller');
const compress = require('koa-compress');
const logger = require('koa-logger');
const serve = require('koa-static');
const route = require('koa-route');
const koa = require('koa');
const path = require('path');
const app = module.exports = koa();

// Logger
app.use(logger());

//app.use(route.get('/messages/:id', messages.fetch));
//app.use(route.post('/messages', messages.create));

app.use(route.get('/', controller.home));
app.use(route.get('/index.html', controller.home));
app.use(route.get('/fetch', controller.fetch));

// Serve static files
app.use(serve(path.join(__dirname, 'public')));

// Compress
app.use(compress());

if (!module.parent) {
  app.listen(3000);
  console.log('listening on port 3000');
}

