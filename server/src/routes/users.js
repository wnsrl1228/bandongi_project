const router = require('express').Router();
const pool = require('../config/db');
const path = require('path'); //추후 삭제가능성 있음
const { isLoggedIn, isNotLoggedIn} = require('./middlewares');
const fs = require('fs');
const multer = require('multer');

try {
    fs.readdirSync('uploads/profile');
} catch (error) {
    console.error('uploads/profile 폴더가 없어 uploads 폴더를 생성합니다.');
    fs.mkdirSync('uploads/profile');
}

const upload = multer({
    storage: multer.diskStorage({
        destination(req, file, cb) {
            cb(null, 'uploads/profile');
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
    return res.status(200).json({path: `/img/profile/${req.file.filename}`});
});

// 해당 id의 user 프로필 페이지 불러오기
router.get('/information', isLoggedIn, async (req, res, next) => {
    const userId = req.user.id
  
    try {
        // DB에 해당 id 유저의 정보랑 게시글 불러오기
        const [dbInformation] = await pool.execute(
            `SELECT id, nickname, profile_img FROM user WHERE id = ?;`,
            [userId]
        );
        if (Array.isArray(dbInformation) && dbInformation.length == 0) {
            console.log("존재하지 않은 프로필 입니다.");
            return res.redirect('/');
        }
        return res.status(201).json(dbInformation); //추후 변경, (이미지 추가)
    } catch (error) {
        console.log(error);
        return next(error);
    }
});

// 친구의 프로필인 경우 친구요청 페이지 바껴야됨 -->추후 변경
router.get('/profile/:id', isLoggedIn, async (req, res, next) => {
    const userId = req.params.id;
    try {
        // DB에 해당 id 유저의 정보랑 게시글 불러오기
        const [dbUserProfileAndPosts] = await pool.execute(
            `SELECT u.id userId, u.profile_img, u.nickname, u.profile_content, u.address,u.profile_background_img, p.id, p.title, p.content,p.comment_count,p.post_img,
            IFNULL(c.like_co,0) like_count, DATE_FORMAT(p.created_date,'%Y-%m-%d %H:%i:%s') created_date
            FROM user u LEFT JOIN post p ON u.id = p.user_id 
            LEFT JOIN (SELECT count(post_id) as like_co ,post_id FROM post_like
            GROUP BY post_id) c ON p.id = c.post_id
            WHERE u.id=?
            ORDER BY created_date DESC
            LIMIT 21;`,
            [userId]
        );
        if (Array.isArray(dbUserProfileAndPosts) && dbUserProfileAndPosts.length == 0) {
            console.log("존재하지 않은 프로필 입니다.");
            return res.redirect('/');
        }
        return res.status(201).json(dbUserProfileAndPosts); //추후 변경
    } catch (error) {
        console.log(error);
        return next(error);
    }
});
// 프로필 친구요청 버튼 보이는지 여부 -->추후 변경
router.get('/checkFriend/:id', isLoggedIn, async (req, res, next) => {
    const profileUserId = req.params.id;
    const userId = req.user.id
    try {
        // DB에 해당 id 유저의 정보랑 게시글 불러오기
        const [dbUserProfileAndPosts] = await pool.execute(
            `select count(*) count from friend where (user_id=? OR user_id=?) AND (friend_id=? OR friend_id=?)`,
            [userId,profileUserId,profileUserId,userId]
        );
        return res.status(201).json(dbUserProfileAndPosts[0]); //추후 변경
    } catch (error) {
        console.log(error);
        return next(error);
    }
});
// 유저 프로필 페이징
router.get('/profile/:id/paging/:lastId', isLoggedIn, async (req, res, next) => {
    const userId = req.params.id;
    const lastId = req.params.lastId;
    try {
        // DB에 해당 id 유저의 정보랑 게시글 불러오기
        const [dbUserProfileAndPosts] = await pool.execute(
            `SELECT u.id userId, u.profile_img, u.nickname, u.profile_content, u.address,u.profile_background_img, p.id, p.title, p.content,p.comment_count,p.post_img,
            IFNULL(c.like_co,0) like_count, DATE_FORMAT(p.created_date,'%Y-%m-%d %H:%i:%s') created_date
            FROM user u LEFT JOIN post p ON u.id = p.user_id 
            LEFT JOIN (SELECT count(post_id) as like_co ,post_id FROM post_like
            GROUP BY post_id) c ON p.id = c.post_id
            WHERE u.id=? AND p.id < ?
            ORDER BY created_date DESC
            LIMIT 21;`,
            [userId, lastId]
        );
        if (Array.isArray(dbUserProfileAndPosts) && dbUserProfileAndPosts.length == 0) {
            console.log("존재하지 않은 프로필 입니다.");
            return res.redirect('/');
        }
        return res.status(201).json(dbUserProfileAndPosts); //추후 변경
    } catch (error) {
        console.log(error);
        return next(error);
    }
});
// 유저 프로필 변경 페이지 불러오기 get +
router.get('/edit', isLoggedIn, async (req, res, next) => {
    const userId = req.user.id
    try {
        // DB에 유저 프로필 가져오기
        const [dbUserProfile] = await pool.execute(
            `SELECT id userId, nickname, address, profile_content, profile_img,profile_background_img
            FROM user WHERE id = ? `,
            [userId]
        );
        if ( dbUserProfile.length == 0){
            return next(error);
        }
        return res.status(201).json(dbUserProfile[0]); // 수정된 프로필로 이동 --> 추후 변경
    } catch (error) {
        console.log(error);
        
    }
});

const upload2 = multer()
// 유저 프로필 변경하기 patch +
router.patch('/edit', isLoggedIn,upload2.none(), async (req, res, next) => {
    const {nickname, profile_content, profile_img, address, profile_background_img} = req.body
    const userId = req.user.id
    try {
        // DB에 유저 프로필 수정하기
        await pool.execute(
            `UPDATE user SET nickname=?, profile_content=?, profile_img=?, address=?,profile_background_img=? where id=?`,
            [nickname, profile_content, profile_img, address,profile_background_img, userId, ]
        );
        return res.status(200).json({"success":"성공"})// 수정된 프로필로 이동 --> 추후 변경
    } catch (error) {
        console.log(error);
        return next(error);
    }
});




// // 게시글 좋아요 눌렀을 때 patch
// router.post('/post/:id/like', isLoggedIn, async (req, res, next) => {
//     const postId = req.params.id;
//     const userId = req.user.id
//     try {
//         // DB에서 해당 ID의 post 불러오기
//         const [dbPost] = await pool.execute(
//             `SELECT l.user_id, p.user_id post_user_id FROM 
//             post p LEFT JOIN post_like l ON l.post_id=p.id WHERE p.id=?;`,
//             [postId]
//         );
//         // post가 없는 경우
//         if (Array.isArray(dbPost) && dbPost.length == 0) {
//             console.log('존재하지 않는 게시글 입니다..');
//             return res.redirect('/');
//         }
//         // 좋아요 한 적이 없는 경우
//         if (dbPost[0].user_id === null) {
//             // 본인의 글을 좋아요 한 경우
//             if (dbPost[0].post_user_id == userId){
//                 console.log('본인의 글은 좋아요 할 수 없습니다...');
//                 return res.redirect('/');
//             } else {
//                 await pool.execute(
//                     `INSERT INTO post_like VALUES(?,?) `,
//                     [userId, postId]
//                 );
//                 return res.status(200).json({"result":"성공"});
//             }
//         } else {
//             // 이미 좋아요 한 경우
//             return res.json({"result":"이미 좋아요를 누른 게시물 입니다"});
//         }
//     } catch (error) {
//         console.log(error);
//         return next(error);
//     }

// });
// 댓글 좋아요 눌렀을 때 patch
router.post('/comment/:id/like', isLoggedIn, async (req, res, next) => {
    const commentId = req.params.id;
    const userId = req.user.id
    try {
        // DB에서 해당 ID의 comment 불러오기
        const [dbComment] = await pool.execute(
            `SELECT l.user_id, c.user_id comment_user_id FROM 
            comment c LEFT JOIN comment_like l ON l.comment_id=c.id WHERE c.id=?;`,
            [commentId]
        );
        // comment가 없는 경우
        if (Array.isArray(dbComment) && dbComment.length == 0) {
            console.log('존재하지 않는 댓글 입니다..');
            return res.redirect('/');
        }
        // 좋아요 한 적이 없는 경우
        if (dbComment[0].user_id === null) {
            // 본인의 댓글을 좋아요 한 경우
            if (dbComment[0].comment_user_id == userId){
                console.log('본인의 댓글은 좋아요 할 수 없습니다...');
                return res.redirect('/');
            } else {
                await pool.execute(
                    `INSERT INTO comment_like VALUES(?,?) `,
                    [userId, commentId]
                );
                return res.status(200).json({"result":"성공"});
            }
        } else {
            // 이미 좋아요 한 경우
            return res.json({"result":"이미 좋아요를 누른 댓글 입니다"});
        }
    } catch (error) {
        console.log(error);
        return next(error);
    }
});

module.exports = router;

