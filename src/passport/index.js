const passport = require('passport');
const local = require('./localStrategy');
const kakao = require('./kakaoStrategy');
const pool = require('../config/db');
module.exports = () => {
    //세션관리 
    passport.serializeUser((user, done) => {
        done(null, user.id); 
    });

    passport.deserializeUser((id, done) => {
        pool.execute('SELECT * FROM user WHERE id = ?', [id])
            .then(user => done(null, user[0][0]))
            .catch(err => done(err));
    });

    // 등록
    local();
    // kakao();
};