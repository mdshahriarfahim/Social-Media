const Post = require('../models/Post'); // Post Model import করলাম

// POST /posts - নতুন পোস্ট তৈরি
const createPost = async (req, res) => {
  try {
    const newPost = await Post.create({ // await দিয়ে অপেক্ষা করলাম ডাটা সেভ হওয়া পর্যন্ত
      username: req.body.username, // body থেকে username নিলাম (login নেই তাই সরাসরি নাম নিচ্ছি)
      content: req.body.content, // body থেকে content নিলাম
      image: req.body.image, // body থেকে image (optional) নিলাম
    });
    res.status(201).json(newPost); // 201 মানে "Created", নতুন পোস্ট ফেরত পাঠালাম
  } catch (error) {
    res.status(400).json({ error: error.message }); // ভুল হলে বা validation error হলে এখানে ধরা পড়বে
  }
};

// GET /posts - সব পোস্ট দেখা (নতুনটা আগে দেখাবে)
const getAllPosts = async (req, res) => {
  try {
    const posts = await Post.find().sort({ createdAt: -1 }); // createdAt অনুযায়ী উল্টো ক্রমে সাজালাম (নতুন পোস্ট আগে)
    res.status(200).json(posts); // ২০০ status সহ সব পোস্ট ফেরত পাঠালাম
  } catch (error) {
    res.status(500).json({ error: error.message }); // সার্ভার এরর হলে এই মেসেজ পাঠালাম
  }
};

// GET /posts/:id - একটা নির্দিষ্ট পোস্ট দেখা
const getPostById = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id); // নির্দিষ্ট _id দিয়ে document খুঁজলাম
    if (!post) { // post খুঁজে না পেলে (পাওয়া না গেলে null আসে)
      return res.status(404).json({ error: 'Post not found' });
    }
    res.status(200).json(post); // ২০০ status সহ post ফেরত পাঠালাম
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// PUT /posts/:id - পোস্ট আপডেট (caption/image বদলানো)
const updatePost = async (req, res) => {
  try {
    const updatedPost = await Post.findByIdAndUpdate(
      req.params.id, // কোন post আপডেট হবে
      { content: req.body.content, image: req.body.image }, // শুধু content আর image বদলানো যাবে
      { new: true, runValidators: true } // new: আপডেটের পরের ডাটা ফেরত দাও, runValidators: validation চালাও
    );
    if (!updatedPost) { // post খুঁজে না পেলে
      return res.status(404).json({ error: 'Post not found' });
    }
    res.status(200).json(updatedPost); // ২০০ status সহ আপডেট হওয়া post ফেরত পাঠালাম
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// DELETE /posts/:id - পোস্ট ডিলিট
const deletePost = async (req, res) => {
  try {
    const deletedPost = await Post.findByIdAndDelete(req.params.id); // খুঁজে মুছে ফেললাম
    if (!deletedPost) { // post খুঁজে না পেলে
      return res.status(404).json({ error: 'Post not found' });
    }
    res.status(200).json({ message: 'Post deleted successfully' }); // মুছে ফেলার confirm মেসেজ পাঠালাম
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// PUT /posts/:id/like - লাইক / আনলাইক (টগল করে)
const toggleLike = async (req, res) => {
  try {
    const { username } = req.body; // body থেকে কে লাইক দিচ্ছে তার username নিলাম
    if (!username) { // username না দিলে এরর
      return res.status(400).json({ error: 'username is required to like a post' });
    }

    const post = await Post.findById(req.params.id); // পোস্ট খুঁজলাম
    if (!post) { // পোস্ট না পেলে
      return res.status(404).json({ error: 'Post not found' });
    }

    const alreadyLiked = post.likes.includes(username); // আগে থেকেই লাইক দেওয়া আছে কিনা চেক করলাম

    if (alreadyLiked) {
      post.likes = post.likes.filter((user) => user !== username); // আগে থেকে লাইক থাকলে সরিয়ে দিলাম (আনলাইক)
    } else {
      post.likes.push(username); // লাইক না থাকলে যোগ করে দিলাম
    }

    await post.save(); // পরিবর্তন সেভ করলাম
    res.status(200).json({ likesCount: post.likes.length, likes: post.likes }); // মোট লাইক আর লিস্ট ফেরত পাঠালাম
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// POST /posts/:id/comments - কমেন্ট করা
const addComment = async (req, res) => {
  try {
    const { username, text } = req.body; // body থেকে কে কমেন্ট করছে আর কী লিখলো নিলাম
    if (!username || !text) { // দুটোর একটাও না দিলে এরর
      return res.status(400).json({ error: 'username and text are required to comment' });
    }

    const post = await Post.findById(req.params.id); // পোস্ট খুঁজলাম
    if (!post) { // পোস্ট না পেলে
      return res.status(404).json({ error: 'Post not found' });
    }

    post.comments.push({ username, text }); // নতুন কমেন্ট comments array এ যোগ করলাম
    await post.save(); // পরিবর্তন সেভ করলাম

    res.status(201).json(post.comments[post.comments.length - 1]); // সদ্য যোগ হওয়া কমেন্ট ফেরত পাঠালাম
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// DELETE /posts/:id/comments/:commentId - কমেন্ট ডিলিট
const deleteComment = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id); // পোস্ট খুঁজলাম
    if (!post) { // পোস্ট না পেলে
      return res.status(404).json({ error: 'Post not found' });
    }

    const comment = post.comments.id(req.params.commentId); // নির্দিষ্ট কমেন্ট তার id দিয়ে খুঁজলাম
    if (!comment) { // কমেন্ট না পেলে
      return res.status(404).json({ error: 'Comment not found' });
    }

    comment.deleteOne(); // sub-document থেকে কমেন্টটা সরিয়ে দিলাম
    await post.save(); // পরিবর্তন সেভ করলাম

    res.status(200).json({ message: 'Comment deleted successfully' }); // মুছে ফেলার confirm মেসেজ পাঠালাম
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = { // সব function একসাথে export করলাম
  createPost,
  getAllPosts,
  getPostById,
  updatePost,
  deletePost,
  toggleLike,
  addComment,
  deleteComment,
};