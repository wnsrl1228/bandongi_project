const router = require('express').Router();
const pool = require('../config/db');
const path = require('path'); //추후 삭제가능성 있음
const { isLoggedIn, isNotLoggedIn} = require('./middlewares');




// 해당 id의 user 프로필 페이지 불러오기
// 친구의 프로필인 경우 친구요청 페이지 바껴야됨 -->추후 변경
router.get('/profile/:id', isLoggedIn, async (req, res, next) => {
    const userId = req.params.id;
    try {
        // DB에 해당 id 유저의 정보랑 게시글 불러오기
        const [dbUserProfileAndPosts] = await pool.execute(
            `SELECT u.profile_img, u.id, u.nickname, u.profile_content, p.id, p.title, p.content, p.view_count, p.comment_count, p.category, p.created_date 
            FROM user u LEFT JOIN post p ON u.id = p.user_id 
            WHERE u.id = ?;`,
            [userId]
        );
        if (Array.isArray(dbUserProfileAndPosts) && dbUserProfileAndPosts.length == 0) {
            console.log("존재하지 않은 프로필 입니다.");
            return res.redirect('/');
        }
        return res.status(201).json({dbUserProfileAndPosts}); //추후 변경
    } catch (error) {
        console.log(error);
        return next(error);
    }
});
// 유저 프로필 변경 페이지 불러오기 get
router.get('/edit', isLoggedIn, async (req, res, next) => {
    const {nickname, profile_content, profile_img, address } = req.user
    return res.status(200).json({
        "nickname": nickname,
        "profile_content": profile_content,
        "profile_img": profile_img,
        "address": address
    }); //추후 변경
});
// 유저 프로필 변경하기 patch
router.patch('/edit', isLoggedIn, async (req, res, next) => {
    const {nickname, profile_content, profile_img, address} = req.body
    const userId = req.user.id
    try {
        // DB에 유저 프로필 수정하기
        await pool.execute(
            `UPDATE user SET nickname=?, profile_content=?, profile_img=?, address=? where id=?`,
            [nickname, profile_content, profile_img, address, userId ]
        );
        return res.sendFile(path.resolve('views/testChangeProfile.html')); // 수정된 프로필로 이동 --> 추후 변경
    } catch (error) {
        console.log(error);
        return next(error);
    }
});
// 유저 친구목록 페이지 불러오기 get
router.get('/friend', isLoggedIn, async (req, res, next) => {

    const userId = req.user.id
    try {
        // DB에 유저 친구목록 가져오기
        const [dbUserFirends] = await pool.execute(
            `SELECT friend_id, nickname, profile_img 
            FROM friend f LEFT JOIN user u ON f.friend_id=u.id WHERE f.user_id=? and status=1`,
            [userId]
        );
        return res.status(201).json({dbUserFirends}); // 수정된 프로필로 이동 --> 추후 변경
    } catch (error) {
        console.log(error);
        return next(error);
    }
});
// 유저 친구 검색 --> 추후 구현
router.get('/friend/search', isLoggedIn, async (req, res, next) => {
    const nickname = '%' + req.body.nickname + '%';
    const userId = req.user.id;
    try {
        // DB에 해당되는 친구목록 가져오기
        const [dbUserFirends] = await pool.execute(
            `SELECT friend_id, nickname, profile_img 
            FROM friend f LEFT JOIN user u ON f.friend_id=u.id 
            WHERE f.user_id=? and status=1 and u.nickname LIKE ?;`,
            [userId,nickname]
        );
        return res.status(201).json({dbUserFirends});
    } catch (error) {
        console.log(error);
        return next(error);
    }
});
// 친구 요청받기 post --> 웹 소켓 활용 --> 추후구현
// 친구 요청 post
//웹소켓으로 알림 받기 --> 추후 구현
router.post('/friend/:id/request', isLoggedIn, async (req, res, next) => {
    const friendId = req.params.id;
    const userId = req.user.id;
    if (friendId == userId) {
        console.log('친구 아이디와 내 아이디가 같음.');
        return res.redirect('/');
    }
    try {
        // DB에서 친구 id 가 유호한 값인지 불러오기
        const [dbfriend] = await pool.execute(
            `SELECT id FROM user WHERE id=?`,
            [friendId]
        );
        if (Array.isArray(dbfriend) && dbfriend.length == 0) {
            console.log('친구id 가 유호하지 않습니다..');
            return res.redirect('/');
        }
        const [dbFriendCount] = await pool.execute(
            `SELECT user_id FROM friend WHERE user_id=? AND friend_id=? `,
            [userId, friendId]
        );
        // 최초의 친구 요청인 경우
        if (Array.isArray(dbFriendCount) && dbFriendCount.length == 0) {
            await pool.execute(
                `INSERT INTO friend VALUES(?,?,0)`,
                [userId, friendId]
            );
            // 상대방에게 요청 알림 보내는 코드 --> 추후 구현
            return res.status(200).json({"result":"성공"}); //추후 변경
        } else {
            console.log('친구 요청이 불가능 합니다.');
            return res.redirect('/');
        }
    } catch (error) {
        console.log(error);
        return next(error);
    }
});
// 친구 차단
router.patch('/friend/:id/block', isLoggedIn, async (req, res, next) => {
    const friendId = req.params.id;
    const userId = req.user.id;
    if (friendId == userId) {
        console.log('친구 아이디와 내 아이디가 같음.');
        return res.redirect('/');
    }
    try {

        // DB에서 해당 친구와의 관계 row 가져오기
        const [dbFriendStatus] = await pool.execute(
            `SELECT status FROM friend WHERE user_id=? and friend_id=?;`,
            [userId, friendId]
        );
        // 친구가 아닌 경우
        if (Array.isArray(dbFriendStatus) && dbFriendStatus.length == 0) {
            console.log('친구가 아닌 상태입니다.');
            return res.redirect('/');
        }
        // 올바른 친구 상태일 경우
        if (dbFriendStatus[0].status == 1){
            await pool.execute(
                `UPDATE friend SET status=2 WHERE user_id=? and friend_id=?`,
                [userId, friendId]
            );
            return res.status(200).json({"result":"성공"}); //추후 변경
        } else {
            console.log('승인 요청상태 또는 이미 차단한 상태입니다.');
            return res.redirect('/');
        }
    } catch (error) {
        console.log(error);
        return next(error);
    }
});
// 게시글 좋아요 눌렀을 때 patch
router.post('/post/:id/like', isLoggedIn, async (req, res, next) => {
    const postId = req.params.id;
    const userId = req.user.id
    try {
        // DB에서 해당 ID의 post 불러오기
        const [dbPost] = await pool.execute(
            `SELECT l.user_id, p.user_id post_user_id FROM 
            post p LEFT JOIN post_like l ON l.post_id=p.id WHERE p.id=?;`,
            [postId]
        );
        // post가 없는 경우
        if (Array.isArray(dbPost) && dbPost.length == 0) {
            console.log('존재하지 않는 게시글 입니다..');
            return res.redirect('/');
        }
        // 좋아요 한 적이 없는 경우
        if (dbPost[0].user_id === null) {
            // 본인의 글을 좋아요 한 경우
            if (dbPost[0].post_user_id == userId){
                console.log('본인의 글은 좋아요 할 수 없습니다...');
                return res.redirect('/');
            } else {
                await pool.execute(
                    `INSERT INTO post_like VALUES(?,?) `,
                    [userId, postId]
                );
                return res.status(200).json({"result":"성공"});
            }
        } else {
            // 이미 좋아요 한 경우
            return res.json({"result":"이미 좋아요를 누른 게시물 입니다"});
        }
    } catch (error) {
        console.log(error);
        return next(error);
    }

});
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

