//로그인인 필요한 라우터에 넣어줌
exports.isLoggedIn = (req, res, next) => {
    if (req.isAuthenticated()) {
        // 로그인 되어 있으면 쿠키값이 있고 true가 나옴
        return next();
    } else {
        return res.status(500).send('로그인 필요');
    }
};

exports.isNotLoggedIn = (req, res, next) => {
    if (!req.isAuthenticated()) {
        return next();
    } else {
        if(!req.body.token){
            console.log(req.body.token)
            req.logout();
            // req.session.destroy();
            return next();
        } else {
            const message = '로그인한 상태입니다.';
            return res.json({success:false,message:message});
        }
        
    }
};