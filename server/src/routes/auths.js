const router = require('express').Router();
const passport = require('passport'); // 세션이나 카카카오 로그인 같은 복잡한 로직해결
const bcrypt = require('bcrypt');
const pool = require('../config/db');
const path = require('path');
const { isLoggedIn, isNotLoggedIn} = require('./middlewares');


// 로그인 화면 불러오기
router.get('/', (req, res, next) => {
    res.sendFile(path.resolve('views/testLogin.html'));
})
//회원가입
router.post('/join', isNotLoggedIn, async (req,res,next) => {

    const { userId, email, password, username, nickname, token } = req.body;

    try {
        //아이디가 이미 존해하는지 조회 
        const [dbUser] = await pool.execute('SELECT userId,email,nickname FROM user WHERE userId = ? OR email=? OR nickname=?', [userId, email, nickname]);
        let message = "";
        //이미 존재하는 아이디인지 체크
        if (Array.isArray(dbUser) && dbUser.length > 0) {
            for (let i=0; i<dbUser.length; i++){
                console.log(dbUser);
                console.log(dbUser[i]);
                if (userId === dbUser[i].userId) {
                    message = "이미 존재하는 아이디입니다";
                    break;
                }
                if (email === dbUser[i].email) {
                    message = "이미 존재하는 이메일입니다";
                    break;
                }
                if (nickname === dbUser[i].nickname) {
                    message = "이미 존재하는 닉네임입니다";
                    break;
                }
            }
            return res.json({success:false,message:message})
        }
        //비밀번호 해쉬화
        const hash = await bcrypt.hash(password, 12);
        // 유저 정보 DB에 등록
        await pool.execute(
            'INSERT INTO user (email, userId, password, username, nickname) VALUES(?,?,?,?,?);',
            [email, userId, hash, username, nickname]
        );
        //화면 이동
        return res.json({success:true})

    } catch (error) {
        console.log(error);
        return next(error);
    }

});

// login 하는 경우
router.post('/login', isNotLoggedIn, (req, res, next) => {
    passport.authenticate('local', (authError, user, info) => { //done의 인자
        // 서버가 에러인 경우
        if (authError) {
            console.error(authError);
            return next(authError);
        }
        // 로그인을 실패한 경우
        if (!user) {
            return res.json({success:false,message:info.message})
        }
        return req.login(user, (loginError) => {
            if (loginError) {
                console.error(loginError);
                return next(loginError);
            }
            //login함수를 통해 세션쿠키를 브라우저로 보내줌
            return res.json({success:true,userId:user.userId})
        });
    })(req, res, next);
})

//로그아웃
router.get('/logout', isLoggedIn, (req, res) => {
    req.logout();
    req.session.destroy();
    res.redirect('/');
});
module.exports = router;
