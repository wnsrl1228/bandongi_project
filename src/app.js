const express = require('express');
const morgan = require('morgan');
const path = require('path');
const session = require('express-session');
const cookieParse = require('cookie-parser');
const dotenv = require('dotenv');
const passport = require('passport');
dotenv.config();
const passportConfig = require('./passport');


const authRouter = require('./routes/auths');
const postRouter = require('./routes/posts');
const userRouter = require('./routes/users');



const app =express();
app.set('port', process.env.PORT || 8001);

// app.use(express.static(path.join(__dirname, 'public')));

// middleware
passportConfig();
app.use(morgan('dev'));
app.use(cookieParse(process.env.COOKIE_SECRET)); //req.cookies로 쓸 수 있음
app.use(session({
    resave: false,
    saveUninitialized: false,
    secret: process.env.COOKIE_SECRET,
    cookie: {
        httpOnly: true,
        secure: false,
    },
})); //req.session 요청온 사용자 session임
app.use(express.json()); //req.body 로 쉽게 body값 사용가능
app.use(express.urlencoded({extended: true})); //form 파싱해줌, true:qs, false:queryString

app.use(passport.initialize());
app.use(passport.session());


//router
app.use('/auth', authRouter);
app.use('/post', postRouter);
app.use('/user', userRouter);

app.get('/', (req, res) => {
    // req.session.name='bbb';

    //임시 프론트
    res.sendFile(__dirname + '/views/testHome.html');
});



// 에러 처리
app.use((req,res,next) => {
    res.send('404');
})
app.use((err,req,res,next) => {
    console.error(err);
    res.status(500).send('에러발생');
})
app.listen(app.set('port'), () => {
    console.log("시작");
});