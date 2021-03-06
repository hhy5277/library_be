const Koa = require('koa')
const bodyParser = require('koa-bodyparser')
const mongoose = require('mongoose')
const serve = require('koa-static')
const session = require('koa-session-minimal')
const MongoStore = require('koa-generic-session-mongo')
const scheme = require('koa-scheme');
const errorHandler = require('koa-handle-error')
const path = require('path')
const router = require('./routers')
const databaseConfig = require('./config/database'); 

mongoose.Promise = global.Promise;
mongoose.connect(`mongodb://${databaseConfig.url}/${databaseConfig.name}`);

const app = new Koa();
app.keys = ['keys', 'keykeys'];

const onError = err => {
  console.error(err);
};

app.use(errorHandler(onError))
    .use(bodyParser())
    .use(serve(__dirname + '/upload'))
    .use(serve(path.join(__dirname, '/library_fe/dist')))
    .use(session({
        cookie: ctx => ({
            maxAge: ctx.session.pin ? 2*60*1000 : 24*60*60*1000
        }),
        store: new MongoStore()
    }))
    .use(scheme(path.join(__dirname + '/config/scheme.js'), {debug: true}))
    .use(router.routes())
    .use(router.allowedMethods())

const port = 8888;
app.listen(port, ()=>{
    console.log(`app start : localhost:${port}`);
});