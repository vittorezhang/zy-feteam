const Koa = require('koa');
const cors = require('@koa/cors');
const logger = require('koa-logger');
const bodyParser = require('koa-bodyparser');
const socket = require('socket.io');
const http = require('http');
const { v4 } = require('uuid');
const Router = require('koa-router'); // 引入koa-router
const session = require('koa-session');
const passport = require('koa-passport');
const moment = require('moment');
const router = new Router();
const app = new Koa();

// middleware
// cors
app.use(
    cors({
        allowHeaders: '*',
        allowMethods: '*',
    }),
);
// log
app.use(logger());
// session
app.keys = ['fuck u all'];
const CONFIG = {
    key: 'koa.sess' /** (string) cookie key (default is koa.sess) */,
    /** (number || 'session') maxAge in ms (default is 1 days) */
    /** 'session' will result in a cookie that expires when session/browser is closed */
    /** Warning: If a session cookie is stolen, this cookie will never expire */
    maxAge: 86400000,
    autoCommit: true /** (boolean) automatically commit headers (default true) */,
    overwrite: true /** (boolean) can overwrite or not (default true) */,
    httpOnly: true /** (boolean) httpOnly or not (default true) */,
    signed: true /** (boolean) signed or not (default true) */,
    rolling:
        false /** (boolean) Force a session identifier cookie to be set on every response. The expiration is reset to the original maxAge, resetting the expiration countdown. (default is false) */,
    renew:
        false /** (boolean) renew session when session is nearly expired, so we can always keep user logged in. (default is false)*/,
    secure: false /** (boolean) secure cookie*/,
};
const sessionMiddleware = session(CONFIG, app);
app.use(sessionMiddleware);

app.use(passport.initialize()).use(passport.session());


// body
app.use(bodyParser());

app.use(router.routes()).use(router.allowedMethods());

const server = http.createServer(app.callback());

const io = new socket.Server(server, {
    cors: {
        origin: true,
    },
});

type MessageRecord = {
    msg: string;
    username: string;
    sendTime: string;
    messageId: string;
};

const message: MessageRecord[] = [
    {
        msg: '这是假数据',
        sendTime: '2023/04/20 16:54:00',
        username: 'zwt测试',
        messageId: v4(),
    }
];

io.on('connection', (socket: any) => {
    console.log('a user connected...');
    socket.emit('msg', []);
    setInterval(() => {
        // 编写服务端业务逻辑
        socket.emit('msg', message);
    }, 5000)
    socket.on('newMsg', (data: any, callback: any) => {

        try {
            message.push({
                msg: data.msg,
                sendTime: moment().toISOString(),
                username: data.username,
                messageId: v4(),
            });
            io.emit('msg', message);
            callback(true);
        } catch (e) {
            callback(false);
        }
    });
});

server.listen(3000, () => {
    console.log('当前服务是http://localhost:3000');
    console.log('Press CTRL-C to stop \n');
});

export { app };

