const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcrypt');
const pool = require('../config/db');

module.exports = () => {
    passport.use(new LocalStrategy({
        usernameField: 'userId', // req.body.userId 형태
        passwordField: 'password',
    }, async (userId, password, done) => {
        try {
            const [dbUser] = await pool.execute('SELECT * FROM user WHERE userId = ?', [userId]);
            // 해당 ID의 유저가 존재하는 경우
            if (Array.isArray(dbUser) && dbUser.length > 0) {
                const result = await bcrypt.compare(password, dbUser[0].password);
                // 입력 비밀번호화 db비밀번호 비교
                if (result) {
                    done(null, dbUser[0]);
                } else {
                    done(null, false, { message: '비밀번호가 일치하지 않습니다.' });
                }
            } else {
                done(null, false, {message: '가입되지 않은 회원입니다.'});
            }
        } catch (error) {
            console.error(error);
            done(error);
        }
    }));
};
//done(서버에러, 성공값, 실패메세지)
