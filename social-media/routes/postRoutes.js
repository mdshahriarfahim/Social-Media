const express = require('express'); // express import করলাম
const router = express.Router(); // Router object বানালাম

const postController = require('../controllers/postController'); // controller import করলাম

router.post('/posts', postController.createPost); // নতুন পোস্ট তৈরি
router.get('/posts', postController.getAllPosts); // সব পোস্ট দেখা
router.get('/posts/:id', postController.getPostById); // একটা পোস্ট দেখা
router.put('/posts/:id', postController.updatePost); // পোস্ট আপডেট
router.delete('/posts/:id', postController.deletePost); // পোস্ট ডিলিট

router.put('/posts/:id/like', postController.toggleLike); // লাইক/আনলাইক
router.post('/posts/:id/comments', postController.addComment); // কমেন্ট করা
router.delete('/posts/:id/comments/:commentId', postController.deleteComment); // কমেন্ট ডিলিট

module.exports = router; // router export করলাম