const router = require('express').Router();
const pool = require('../config/db');
const path = require('path'); //추후 삭제가능성 있음
const { isLoggedIn } = require('./middlewares');
const fs = require('fs');
const multer = require('multer');
const db = require('../config/db');


// 파일 업로드

try {
    fs.readdirSync('uploads');
} catch (error) {
    console.error('uploads 폴더가 없어 uploads 폴더를 생성합니다.');
    fs.mkdirSync('uploads');
}

const upload = multer({
    storage: multer.diskStorage({
        destination(req, file, cb) {
            cb(null, 'uploads/');
        },
        filename(req, file, cb) {
            file.originalname = Buffer.from(file.originalname, 'latin1').toString('utf8') // 파일 글 깨짐 방지
            const ext = path.extname(file.originalname);
            cb(null, path.basename(file.originalname, ext) + Date.now() +ext);
        },
    }),
    limits: {fileSize: 5 * 1024 * 1024},
});

router.post('/img', isLoggedIn, upload.single('img'), async (req,res,next) => {
    if (req.file === undefined){
        return res.status(200).json({path: ''});
    }
    return res.status(200).json({path: `/img/${req.file.filename}`});
});
/*
    router끼리의 순서 중요
    로그인 여부 체크 -->추후 변경
    성고시 리턴값, 실패시 리턴값 지정 --> 추후 변경
*/

// 게시글 생성하기  post /post/create
const upload2 = multer()
router.post('/create', upload2.none(), isLoggedIn, async (req,res,next) => {
    const {title, content, category, postImg } = req.body;
    const userId = req.user.id;
    try {
        // 게시글 DB에 추가하기
        const [ResultSetHeader] = await pool.execute(
            "INSERT INTO post(user_id, title, content, category, post_img) VALUES(?,?,?,?,?)",
            [userId, title, content, category, postImg]
        );
        return res.status(200).json({"success":"성공","postId" : ResultSetHeader.insertId});
    } catch (error) {
        console.log(error);
        return next(error);
    }
});


//  게시글 댓글 추가하기 
router.post('/comment', isLoggedIn, async (req, res, next) => {
    const {post_id, content} = req.body;
    const userId = req.user.id;
    try {
        // DB에 댓글 추가하기
        await pool.execute(
            `INSERT INTO comment(user_id, post_id, content)  VALUES (?, ?, ?);`,
            [userId, post_id, content]
        );
        // 게시글 comment_count 증가
        await pool.execute(
            `UPDATE post SET comment_count = comment_count + 1 WHERE id = ?;`,
            [post_id]
        );
        return res.status(200).json({"success":"성공"});
    } catch (error) {
        console.log(error);
        return next(error);
    }
});

//  게시글 추천 추가 
router.post('/like/plus', isLoggedIn, async (req, res, next) => {
    const {post_id} = req.body
    const userId = req.user.id;
    try {
        // DB에 댓글 추가하기
        await pool.execute(
            `INSERT INTO post_like (user_id, post_id) VALUES (?, ?);`,
            [userId, post_id]
        );

        return res.status(200).json({"success":"성공"});
    } catch (error) {
        return next(error);
    }
});
//  게시글 추천 취소
router.post('/like/minus', isLoggedIn, async (req, res, next) => {
    const {post_id} = req.body
    const userId = req.user.id;
    
    try {
        // DB에 댓글 추가하기
        await pool.execute(
            `DELETE FROM post_like WHERE user_id = ? AND post_id = ?;`,
            [userId, post_id]
        );
        return res.status(200).json({"success":"성공"});
    } catch (error) {
        return next(error);
    }
});
//  댓글 추천 이벤트
router.post('/comment/like', isLoggedIn, async (req, res, next) => {
    const {comment_id} = req.body
    const userId = req.user.id;
    
    try {
        // DB에 댓글 추가하기
        const [likeValid] = await pool.execute(
            `SELECT count(*) as count FROM comment_like where user_id=? AND comment_id =?;`,
            [userId, comment_id]
        );
        // 추천이 안 되어 있는 상태
        if (likeValid[0].count == 0 ) {
            await pool.execute(
                `INSERT INTO comment_like (user_id, comment_id) VALUES (?, ?);`,
                [userId, comment_id]
            );
            return res.status(200).json({"result":"plus"});
        } else {
            return res.status(200).json({"result":"refuse"});
        }
       
    } catch (error) {
        return next(error);
    }
});
//  게시글 추천 체크 여부 확인 
router.get('/like/valid/:id', isLoggedIn, async (req, res, next) => {
    const post_id = req.params.id;
    const userId = req.user.id;
    try {
        // DB에 댓글 추가하기
        const [likeValid] = await pool.execute(
            `SELECT count(user_id) as valid FROM post_like where user_id=? AND post_id =?;`,
            [userId, post_id]
        );
        return res.status(200).json(likeValid);
    } catch (error) {
        console.log(error);
        return next(error);
    }
});


// 세부 게시글 페이지 불러오기 get /post/:id
router.get('/:id', isLoggedIn, async (req, res, next) => {
    const postId = req.params.id;
    try {
        // DB에서 해당 id의 게시글과 댓글 목록 가져오기
        const [dbPosts] = await pool.execute(
            `SELECT u.nickname userNickname, u.profile_img,u.id userId, p.id, p.title, p.content,p.comment_count,p.post_img, DATE_FORMAT(p.created_date,'%Y-%m-%d %H:%i:%s') created_date,
			IFNULL(p_l.p_like_count,0) p_like_count
            FROM post p LEFT JOIN user u ON p.user_id=u.id
            LEFT JOIN (SELECT count(post_id) as p_like_count, post_id FROM post_like WHERE post_id=?) p_l ON p.id = p_l.post_id
            WHERE p.id=?;`,
            [postId,postId]
        );
        // const [dbPostAndComments] = await pool.execute(
        //     `SELECT u.nickname userNickname, u.profile_img,u.id userId,u.profile_img, p.id, p.title, p.content,p.comment_count,p.post_img, DATE_FORMAT(p.created_date,'%Y-%m-%d %H:%i:%s') created_date,
		// 	IFNULL(p_l.p_like_count,0) p_like_count,IFNULL(c_l.c_like_count,0) c_like_count,
		// 	c.id c_id, c.content c_content, c.parent_group, c.child_group_order, DATE_FORMAT(c.created_date,'%Y-%m-%d %H:%i:%s') c_created_date, c.updated_date c_updated_date, cu.nickname commentNickname, cu.id commentUserID
        //     FROM post p LEFT JOIN user u ON p.user_id=u.id
        //     LEFT JOIN (SELECT count(post_id) as p_like_count, post_id FROM post_like WHERE post_id=?) p_l ON p.id = p_l.post_id
        //     LEFT JOIN comment c ON p.id=c.post_id
        //     LEFT JOIN user cu ON c.user_id = cu.id
        //     LEFT JOIN (SELECT count(comment_id) as c_like_count, comment_id FROM comment_like GROUP BY comment_id) c_l ON c.id = c_l.comment_id
        //     WHERE p.id=?;`,
        //     [postId,postId]
        // );
        return res.status(201).json(dbPosts); // 추후 변경
    } catch (error) {
        console.log(error);
        return next(error);
    }
})
router.get('/:id/comment/paging/:lastId', isLoggedIn, async (req, res, next) => {
    const postId = req.params.id;
    const lastId = req.params.lastId;
    try {
        // DB에서 해당 id의 게시글과 댓글 목록 가져오기
        if (lastId == 0) {
            const [dbComments] = await pool.execute(
                `SELECT IFNULL(c_l.c_like_count,0) c_like_count,
                c.id c_id, c.content c_content, c.parent_group, c.child_group_order, DATE_FORMAT(c.created_date,'%Y-%m-%d %H:%i:%s') c_created_date, c.updated_date c_updated_date, cu.nickname commentNickname, cu.id commentUserID, cu.profile_img commentUserProfileImg
                FROM comment c LEFT JOIN user cu ON c.user_id = cu.id
                LEFT JOIN (SELECT count(comment_id) as c_like_count, comment_id FROM comment_like GROUP BY comment_id) c_l ON c.id = c_l.comment_id
                WHERE c.post_id=?
                ORDER BY c_id DESC 
                LIMIT 20;`,
                [postId]
            );
            return res.status(201).json(dbComments); 
        } else {
            const [dbComments] = await pool.execute(
                `SELECT IFNULL(c_l.c_like_count,0) c_like_count,
                c.id c_id, c.content c_content, c.parent_group, c.child_group_order, DATE_FORMAT(c.created_date,'%Y-%m-%d %H:%i:%s') c_created_date, c.updated_date c_updated_date, cu.nickname commentNickname, cu.id commentUserID, cu.profile_img commentUserProfileImg
                FROM comment c LEFT JOIN user cu ON c.user_id = cu.id
                LEFT JOIN (SELECT count(comment_id) as c_like_count, comment_id FROM comment_like GROUP BY comment_id) c_l ON c.id = c_l.comment_id
                WHERE c.post_id=? AND c.id < ?
                ORDER BY c_id DESC 
                LIMIT 20;`,
                [postId,lastId]
            );
            return res.status(201).json(dbComments); 
        }
    } catch (error) {
        console.log(error);
        return next(error);
    }
})

// 세부 게시글 수정 페이지 불러오기  get /post/:id/edit
router.get('/edit/:id', isLoggedIn, async (req, res, next) => {
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
            return next(error);
        }
        // post를 쓴 userId 와 세션 유저 id가 다른 경우
        if (dbPostUser[0].user_id !== userId){
            return next(error);
        }
        // DB에서 수정할 게시글 가져오기
        const [dbPost] = await pool.execute(
            `SELECT title, content, category, post_img
            FROM post where id=?;`,
            [postId]
        );
        return res.status(201).json(dbPost[0]); // 추후 변경
    } catch (error) {
        console.log(error);
        return next(error);
    }
})

// 세부 게시글 수정하기 patch /post/edit/:id
router.post('/edit/:id', isLoggedIn, async (req,res,next) => {
    const postId = req.params.id;
    const userId = req.user.id;
    const {title, content, category, post_img} = req.body;
    try {
        // DB에서 post를 쓴 유저 id값 불러오기
        const [dbPostUser] = await pool.execute(
            `SELECT user_id FROM post where id=?;`,
            [postId]
        );
        // post_id가 잘못된 값인 경우
        if (Array.isArray(dbPostUser) && dbPostUser.length == 0) {
            console.log('잘못된 post_id 값');
            return res.status(200).json({"success":"실패"});
        }
        // post를 쓴 userId 와 세션 유저 id가 다른 경우
        if (dbPostUser[0].user_id !== userId){
            console.log('접근 오류')
            return res.status(200).json({"success":"실패"});
        }
        // DB에 게시글 수정하기
        await pool.execute(
            `UPDATE post SET title=?, content=?, category=?, post_img=? where id=?`,
            [title, content, category, post_img, postId]
        );
        return res.status(200).json({"success":"성공"})// 수정된 프로필로 이동 --> 추후 변경
    } catch (error) {
        console.log(error);
        return next(error);
    }
});
// 세부 게시글 수정하기 delete /post/:id
router.patch('/comment/:id', isLoggedIn, async (req,res,next) => {
    const commentId = req.params.id;
    const {content } = req.body;
    try {
        // 게시글 수정
        await pool.execute(
            `UPDATE comment SET content = ? WHERE id = ?;`,
            [content, commentId]
        );

        return res.status(200).json({"success":"성공"});
    } catch (error) {
        console.log(error);
        return next(error);
    }
});
// 세부 게시글 삭제하기 delete /post/:id
router.delete('/comment/:id', isLoggedIn, async (req,res,next) => {
    const commentId = req.params.id;

    try {
        // 게시글 comment_count 감소
        await pool.execute(
            `UPDATE post SET comment_count = comment_count - 1 WHERE id = (select post_id from comment where id = ?);`,
            [commentId]
        );
        // DB에 해당 id 게시글 삭제
        await pool.execute(
            "DELETE FROM comment WHERE id=?;",
            [commentId]
        );
        return res.status(200).json({"success":"성공"});
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
            return res.status(200).json({"success":"실패"});
        }
        // post를 쓴 userId 와 세션 유저 id가 다른 경우
        if (dbPostUser[0].user_id !== userId){
            return res.status(200).json({"success":"실패"});
        }
        // DB에 해당 id 게시글 삭제
        await pool.execute(
            "DELETE FROM post WHERE id=?;",
            [postId]
        );
        return res.status(200).json({"success":"성공"});
    } catch (error) {
        console.log(error);
        return next(error);
    }
});



module.exports = router;






