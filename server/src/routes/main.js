const router = require('express').Router();
const pool = require('../config/db');

// 카테고리 페이지 불러오기  get /
// 무한 스크롤 , 페이징  --> 추후 구현
router.get('/main', async (req, res, next) => {

    try {
        // DB에서 해당 카테고리 게시글 목록 불러오기
        const [dbPosts] = await pool.execute(
            `SELECT p.id, u.profile_img, u.nickname,u.id userId , p.title, p.content,p.comment_count, p.post_img,
            IFNULL(c.like_co,0) like_count, DATE_FORMAT(p.created_date,'%Y-%m-%d %h:%m:%s') created_date
            FROM post p LEFT JOIN user u ON p.user_id = u.id
            LEFT JOIN (SELECT count(post_id) as like_co ,post_id FROM post_like
            GROUP BY post_id) c ON p.id = c.post_id
            ORDER BY created_date DESC`,
        );
        return res.status(200).json(dbPosts); // 추후 변경
    } catch (error) {
        console.log(error);
        return next(error);
    }
});
// 카테고리 페이지 불러오기  get /post/:category
// 무한 스크롤 , 페이징  --> 추후 구현
router.get('/:category', async (req, res, next) => {
    const category = req.params.category;

    // 카테고리 종류 --> 추후 변경
    categoryList = ['friend-make' ,'show-off','qna' ,'tips'];

    // 카테고리가 존해하지 않을 경우
    if (!categoryList.includes(category)) {
        return next();
    }
    // 카테고리가 존재하는 경우
    try {
        // DB에서 해당 카테고리 게시글 목록 불러오기
        const [dbPosts] = await pool.execute(
            `SELECT p.id, u.profile_img, u.nickname,u.id userId , p.title, p.content,p.comment_count, p.post_img,
            IFNULL(c.like_co,0) like_count, DATE_FORMAT(p.created_date,'%Y-%m-%d %h:%m:%s') created_date
            FROM post p LEFT JOIN user u ON p.user_id = u.id
            LEFT JOIN (SELECT count(post_id) as like_co ,post_id FROM post_like
            GROUP BY post_id) c ON p.id = c.post_id
            WHERE p.category = ?
            ORDER BY created_date DESC`,
            [category]
        );
        return res.status(201).json(dbPosts); // 추후 변경
    } catch (error) {
        console.log(error);
        return next(error);
    }
    
    // post데이터와 view 리턴 --> 추후 구현
    // res.render("이동할 view", { 게시글데이터 });
})
module.exports = router;
