const mongoose = require('mongoose'); // mongoose import করলাম

const messageSchema = new mongoose.Schema({ // মেসেজের কাঠামো (blueprint) ডিফাইন করলাম
  sender: { // কে মেসেজ পাঠালো
    type: String, // শুধু text (username) রাখা যাবে
    required: true, // এই ফিল্ড ছাড়া মেসেজ পাঠানো যাবে না
  },
  receiver: { // কাকে মেসেজ পাঠালো
    type: String, // শুধু text (username) রাখা যাবে
    required: true, // এই ফিল্ড ছাড়া মেসেজ পাঠানো যাবে না
  },
  text: { // মেসেজের লেখা
    type: String, // শুধু text রাখা যাবে
    required: true, // এই ফিল্ড ছাড়া মেসেজ পাঠানো যাবে না
  },
  createdAt: { // মেসেজ পাঠানোর সময়
    type: Date, // তারিখ/সময় রাখা যাবে
    default: Date.now, // না দিলে এখনকার সময় বসবে
  },
});

const Message = mongoose.model('Message', messageSchema); // Schema থেকে Model তৈরি করলাম, collection নাম হবে "messages"

module.exports = Message; // Model export করলাম