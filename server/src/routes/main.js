const router = require('express').Router();
const pool = require('../config/db');


// 카테고리 페이지 불러오기  get /
// 무한 스크롤 , 페이징  --> 추후 구현
router.get('/main', async (req, res, next) => {
    try {
        // DB에서 해당 카테고리 게시글 목록 불러오기
        const [dbPosts] = await pool.execute(
            `SELECT p.id, u.profile_img, u.nickname, p.title, p.content,p.comment_count, IFNULL(c.like_co,0) like_count, p.created_date
            FROM post p LEFT JOIN user u ON p.user_id = u.id
            LEFT JOIN (SELECT count(post_id) as like_co ,post_id FROM post_like
            GROUP BY post_id) c ON p.id = c.post_id`,
        );
        return res.status(200).json(dbPosts); // 추후 변경
    } catch (error) {
        console.log(error);
        return next(error);
    }
});
module.exports = router;
