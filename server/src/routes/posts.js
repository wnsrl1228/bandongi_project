const router = require('express').Router();
const pool = require('../config/db');
const path = require('path'); //추후 삭제가능성 있음
const { isLoggedIn } = require('./middlewares');

/*
    router끼리의 순서 중요
    로그인 여부 체크 -->추후 변경
    성고시 리턴값, 실패시 리턴값 지정 --> 추후 변경
*/

// 게시글 생성 페이지 불러오기  get /post/create
router.get('/create', isLoggedIn, (req, res, next) => {
    res.sendFile(path.resolve('views/testCreatePost.html')); // 추후 변경
})

// 게시글 생성하기  post /post/create
// 이미지 삽입 --> 추후 구현
router.post('/create', isLoggedIn, async (req,res,next) => {
    const {title, content, category } = req.body;
    const userId = req.user.id;
    try {
        // 게시글 DB에 추가하기
        await pool.execute(
            "INSERT INTO post(user_id, title, content, category) VALUES(?,?,?,?)",
            [userId, title, content, category]
        );
        return res.redirect('/'); // 생성된 게시글페이지로 이동 --> 추후 변경
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
        // :id 라우터로 이동
        return next();
    }
    // 카테고리가 존재하는 경우
    try {
        // DB에서 해당 카테고리 게시글 목록 불러오기
        const [dbPosts] = await pool.execute(
            `SELECT p.id, u.profile_img, unickname, p.title, p.content, p.view_count, p.comment_count, p.category, p.created_date 
            FROM post p LEFT JOIN user u ON p.user_id = u.id
            WHERE p.category = ?;`,
            [category]
        );
        return res.status(201).json({dbPosts}); // 추후 변경
    } catch (error) {
        console.log(error);
        return next(error);
    }

    // post데이터와 view 리턴 --> 추후 구현
    // res.render("이동할 view", { 게시글데이터 });
})

// 세부 게시글 페이지 불러오기 get /post/:id
router.get('/:id', isLoggedIn, async (req, res, next) => {
    const postId = req.params.id;
    try {
        // DB에서 해당 id의 게시글과 댓글 목록 가져오기
        const [dbPostAndComments] = await pool.execute(
            `SELECT u.nickname, u.profile_img, p.*, c.id c_id, c.content c_content, c.parent_group, c.child_group_order, c.created_date c_created_date, c.updated_date c_updated_date
            FROM post p LEFT JOIN user u ON p.user_id=u.id 
            LEFT JOIN comment c ON p.id=c.post_id
            WHERE p.id=?;`,
            [postId]
        );
        // dbPostAndComments 잘못된 값인 경우
        if (Array.isArray(dbPostAndComments) && dbPostAndComments.length == 0) {
            return res.redirect('/');
        }
        return res.status(201).json({dbPostAndComments}); // 추후 변경
    } catch (error) {
        console.log(error);
        return next(error);
    }
})

// 세부 게시글 수정 페이지 불러오기  get /post/:id/edit
router.get('/:id/edit', isLoggedIn, async (req, res, next) => {
    const postId = req.params.id;
    const userId = req.user.id;
    try {
        // DB에서 post를 쓴 유저 id값 불러오기
        const [dbPostUser] = await pool.execute(
            `SELECT user_id FROM post where id=?;`,
            [postId]
        );
        // post_id가 잘못된 값인 경우
        if (Array.isArray(dbPostUser) && dbPostUser.length == 0) {
            console.log('잘못된 post_id 값');
            return res.redirect('/');
        }
        // post를 쓴 userId 와 세션 유저 id가 다른 경우
        if (dbPostUser[0].user_id !== userId){
            console.log('접근 오류')
            return res.redirect('/');
        }
        // DB에서 수정할 게시글 가져오기
        const [dbPost] = await pool.execute(
            `SELECT u.nickname, u.profile_img, p.title, p.content, p.category 
            FROM post p LEFT JOIN user u ON p.user_id=u.id
            where p.id=?;`,
            [postId]
        );
        return res.status(201).json({dbPost}); // 추후 변경
    } catch (error) {
        console.log(error);
        return next(error);
    }
})

// 세부 게시글 수정하기 patch /post/:id
router.patch('/:id', isLoggedIn, async (req,res,next) => {
    const postId = req.params.id;
    const userId = req.user.id;
    const {title, content, category} = req.body;
    try {
        // DB에서 post를 쓴 유저 id값 불러오기
        const [dbPostUser] = await pool.execute(
            `SELECT user_id FROM post where id=?;`,
            [postId]
        );
        // post_id가 잘못된 값인 경우
        if (Array.isArray(dbPostUser) && dbPostUser.length == 0) {
            console.log('잘못된 post_id 값');
            return res.redirect('/');
        }
        // post를 쓴 userId 와 세션 유저 id가 다른 경우
        if (dbPostUser[0].user_id !== userId){
            console.log('접근 오류')
            return res.redirect('/');
        }
        // DB에 해당 id 게시글 수정하기
        await pool.execute(
            "UPDATE post SET title=?, content=?, category=? where id=?",
            [title, content, category, postId]
        );
        return res.redirect('/'); // 수정된 게시글로 이동 --> 추후 변경
    } catch (error) {
        console.log(error);
        return next(error);
    }
});
// 세부 게시글 삭제하기 delete /post/:id
router.delete('/:id', isLoggedIn, async (req,res,next) => {
    const postId = req.params.id;
    const userId = req.user.id;
    try {
        // DB에서 post를 쓴 유저 id값 불러오기
        const [dbPostUser] = await pool.execute(
            `SELECT user_id FROM post where id=?;`,
            [postId]
        );
        // post_id가 잘못된 값인 경우
        if (Array.isArray(dbPostUser) && dbPostUser.length == 0) {
            console.log('잘못된 post_id 값');
            return res.redirect('/');
        }
        // post를 쓴 userId 와 세션 유저 id가 다른 경우
        if (dbPostUser[0].user_id !== userId){
            console.log('접근 오류')
            return res.redirect('/');
        }
        // DB에 해당 id 게시글 삭제
        await pool.execute(
            "DELETE FROM post WHERE id=?;",
            [postId]
        );
        return res.redirect('/'); // 게시글 목록 페이지로 이동 --> 추후 변경
    } catch (error) {
        console.log(error);
        return next(error);
    }
});



module.exports = router;






