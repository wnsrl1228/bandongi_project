// const Post = require('../models/Post');

// exports.getAllPosts = async (req, res, next) => {
//     try {
//         const posts = await Post.findAll();

//         res.status(200).json({posts});
//     } catch (error) {
//         console.log(error);
//         next(error);
//     }
// };
//이런 식으로 로직 작성