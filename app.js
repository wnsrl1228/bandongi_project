const express = require('express');
const morgan = require('morgan');
const path = require('path');
const session = require('express-session');
const cookieParse = require('cookie-parser');
const dotenv = require('dotenv');
dotenv.config();



const app =express();
app.set('port', process.env.PORT || 8001);

app.use(morgan('dev'));

app.get('/', (req, res) => {
    res.send("반갑습니다");
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