const mongoose = require('mongoose'); // mongoose import করলাম

const commentSchema = new mongoose.Schema({ // কমেন্টের জন্য ছোট schema (sub-document)
  username: { // কে কমেন্ট করলো
    type: String, // শুধু text রাখা যাবে
    required: true, // এই ফিল্ড ছাড়া কমেন্ট করা যাবে না
  },
  text: { // কমেন্টের লেখা
    type: String, // শুধু text রাখা যাবে
    required: true, // এই ফিল্ড ছাড়া কমেন্ট করা যাবে না
  },
  createdAt: { // কমেন্ট করার সময়
    type: Date, // তারিখ/সময় রাখা যাবে
    default: Date.now, // না দিলে এখনকার সময় বসবে
  },
});

const postSchema = new mongoose.Schema({ // পোস্টের কাঠামো (blueprint) ডিফাইন করলাম
  username: { // কে পোস্ট করলো (login নেই, তাই সরাসরি নাম নিচ্ছি)
    type: String, // শুধু text রাখা যাবে
    required: true, // এই ফিল্ড ছাড়া পোস্ট করা যাবে না
  },
  content: { // পোস্টের লেখা/caption
    type: String, // শুধু text রাখা যাবে
    required: true, // এই ফিল্ড ছাড়া পোস্ট করা যাবে না
  },
  image: { // পোস্টের ছবি (ঐচ্ছিক), সরাসরি URL/link রাখা হচ্ছে
    type: String, // শুধু text (URL) রাখা যাবে
    default: '', // না দিলে খালি থাকবে
  },
  likes: [ // কারা কারা লাইক দিয়েছে তার লিস্ট
    {
      type: String, // প্রতিটা লাইক একটা username হিসেবে রাখা হচ্ছে
    },
  ],
  comments: [commentSchema], // পোস্টের নিচে কমেন্টের array, উপরের commentSchema ব্যবহার করে
  createdAt: { // পোস্ট করার সময়
    type: Date, // তারিখ/সময় রাখা যাবে
    default: Date.now, // না দিলে এখনকার সময় বসবে
  },
});

const Post = mongoose.model('Post', postSchema); // Schema থেকে Model তৈরি করলাম, collection নাম হবে "posts"

module.exports = Post; // Model export করলাম