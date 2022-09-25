const router = require('express').Router();
const pool = require('../config/db');
const path = require('path'); //추후 삭제가능성 있음
const { isLoggedIn, isNotLoggedIn} = require('./middlewares');


// 유저 친구목록 불러오기 get
router.get('/', isLoggedIn, async (req, res, next) => {
    const userId = req.user.id
    try {
        // DB에 유저 친구목록 가져오기
        const [dbUserFriends] = await pool.execute(
            `SELECT friend_id, nickname, profile_img 
            FROM friend f LEFT JOIN user u ON f.friend_id=u.id WHERE f.user_id=? and status=1`,
            [userId]
        );
        return res.status(201).json(dbUserFriends); // 수정된 프로필로 이동 --> 추후 변경
    } catch (error) {
        console.log(error);
        return next(error);
    }
});
// 유저에게 친구 요청 보낸 사람 목록 불러오기 get
router.get('/receive', isLoggedIn, async (req, res, next) => {
    const userId = req.user.id
    try {
        const [dbUserFriends] = await pool.execute(
            `SELECT id, nickname, profile_img 
            FROM friend f LEFT JOIN user u ON f.user_id=u.id WHERE f.friend_id=? and status=0`,
            [userId]
        );
        return res.status(201).json(dbUserFriends); // 수정된 프로필로 이동 --> 추후 변경
    } catch (error) {
        console.log(error);
        return next(error);
    }
});
// 유저가 친구 요청 보낸 사람들 목록 불러오기 get
router.get('/send', isLoggedIn, async (req, res, next) => {
    const userId = req.user.id
    try {
        const [dbUserFriends] = await pool.execute(
            `SELECT id, nickname, profile_img 
            FROM friend f LEFT JOIN user u ON f.friend_id=u.id WHERE f.user_id=? and status=0`,
            [userId]
        );
        return res.status(201).json(dbUserFriends); // 수정된 프로필로 이동 --> 추후 변경
    } catch (error) {
        console.log(error);
        return next(error);
    }
});
// 유저가 차단한 사람들 목록 불러오기 get
router.get('/block', isLoggedIn, async (req, res, next) => {
    const userId = req.user.id
    try {
        const [dbUserFriends] = await pool.execute(
            `SELECT id, nickname, profile_img 
            FROM friend f LEFT JOIN user u ON f.user_id=u.id WHERE f.friend_id=? and status=2`,
            [userId]
        );
        return res.status(201).json(dbUserFriends); // 수정된 프로필로 이동 --> 추후 변경
    } catch (error) {
        console.log(error);
        return next(error);
    }
});
// 유저의 친구 삭제 delete
router.delete('/:id', isLoggedIn, async (req, res, next) => {
    const friendId = req.params.id;
    const userId = req.user.id;
    try {
        await pool.execute(
            `DELETE FROM friend where (user_id=? OR user_id=?) AND (friend_id=? OR friend_id=?)`,
            [userId,friendId,friendId,userId]
        );
        return res.status(200).json({"success":"성공"});
    } catch (error) {
        console.log(error);
        return next(error);
    }
});
// 친구의 요청 수락 post
router.get('/accept/:id', isLoggedIn, async (req, res, next) => {
    const friendId = req.params.id;
    const userId = req.user.id;
    try {
        await pool.execute(
            `UPDATE friend SET status=1 where user_id=? AND friend_id=?`,
            [friendId,userId]
        );
        await pool.execute(
            `INSERT INTO friend VALUES(?,?,1)`,
            [userId,friendId]
        );
        return res.status(200).json({"success":"성공"});
    } catch (error) {
        console.log(error);
        return next(error);
    }
});
// 친구의 요청 거절 post
router.get('/refuse/:id', isLoggedIn, async (req, res, next) => {
    const friendId = req.params.id;
    const userId = req.user.id;
    try {
        await pool.execute(
            `UPDATE friend SET status=2 where user_id=23 AND friend_id=21`,
            [friendId,userId]
        );
        return res.status(200).json({"success":"성공"});
    } catch (error) {
        console.log(error);
        return next(error);
    }
});
// 유저가 보낸 친구요청 취소 delete
router.delete('/cancel/:id', isLoggedIn, async (req, res, next) => {
    const friendId = req.params.id;
    const userId = req.user.id;
    try {
        await pool.execute(
            `DELETE FROM friend where user_id=? AND friend_id=?`,
            [userId,friendId]
        );
        return res.status(200).json({"success":"성공"});
    } catch (error) {
        console.log(error);
        return next(error);
    }
});
// 차단 풀기 post
router.post('/block/cancel/:id', isLoggedIn, async (req, res, next) => {
    const friendId = req.params.id;
    const userId = req.user.id;
    try {
        await pool.execute(
            `UPDATE friend SET status=0 where user_id=? AND friend_id=?`,
            [friendId,userId]
        );
        return res.status(200).json({"success":"성공"});
    } catch (error) {
        console.log(error);
        return next(error);
    }
});
// 유저 친구 검색 --> 추후 구현
router.get('/search', isLoggedIn, async (req, res, next) => {
    const nickname = '%' + req.body.nickname + '%';
    const userId = req.user.id;
    try {
        // DB에 해당되는 친구목록 가져오기
        const [dbUserFriends] = await pool.execute(
            `SELECT friend_id, nickname, profile_img 
            FROM friend f LEFT JOIN user u ON f.friend_id=u.id 
            WHERE f.user_id=? and status=1 and u.nickname LIKE ?;`,
            [userId,nickname]
        );
        return res.status(201).json(dbUserFriends);
    } catch (error) {
        console.log(error);
        return next(error);
    }
});
// 친구 요청 post
router.get('/request/:id', isLoggedIn, async (req, res, next) => {
    const friendId = req.params.id;
    const userId = req.user.id;

    try {
       await pool.execute(
            `INSERT INTO friend VALUES(?,?,0) `,
            [userId, friendId]
        );
        return res.status(200).json({"success":"성공"});
    } catch (error) {
        console.log(error);
        return next(error);
    }
});
module.exports = router;
