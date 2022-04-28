//로그인인 필요한 라우터에 넣어줌
exports.isLoggedIn = (req, res, next) => {
    if (req.isAuthenticated()) {
        // 로그인 되어 있으면 쿠키값이 있고 true가 나옴
        next();
    } else {
        res.status(403).send('로그인 필요');
    }
};

exports.isNotLoggedIn = (req, res, next) => {
    if (!req.isAuthenticated()) {
        next();
    } else {
        const message = encodeURIComponent('로그인한 상태입니다.');
        res.redirect(`/?error=${message}`);
    }
};