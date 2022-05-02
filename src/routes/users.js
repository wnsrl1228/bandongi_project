const router = require('express').Router();

router.get('/', (req, res) => {
    res.send("이곳은 유저 루트 입니다");
});

module.exports = router;


router.route('/').get().post()

