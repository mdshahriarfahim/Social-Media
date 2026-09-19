const Message = require('../models/Message'); // Message Model import করলাম

// POST /messages - নতুন মেসেজ পাঠানো (REST দিয়েও কাজ করবে, socket দিয়েও)
const sendMessage = async (req, res) => {
  try {
    const { sender, receiver, text } = req.body; // body থেকে sender, receiver, text নিলাম
    if (!sender || !receiver || !text) { // কোনোটা মিসিং থাকলে এরর
      return res.status(400).json({ error: 'sender, receiver and text are required' });
    }

    const newMessage = await Message.create({ sender, receiver, text }); // await দিয়ে অপেক্ষা করলাম ডাটা সেভ হওয়া পর্যন্ত

    const io = req.app.get('io'); // app থেকে socket.io instance নিলাম
    io.to(receiver).emit('receiveMessage', newMessage); // receiver যদি অনলাইনে থাকে তাকে সাথে সাথে মেসেজ পাঠালাম

    res.status(201).json(newMessage); // 201 মানে "Created", নতুন মেসেজ ফেরত পাঠালাম
  } catch (error) {
    res.status(400).json({ error: error.message }); // ভুল হলে এখানে ধরা পড়বে
  }
};

// GET /messages/:user1/:user2 - দুইজনের মধ্যেকার সব মেসেজ (chat history)
const getConversation = async (req, res) => {
  try {
    const { user1, user2 } = req.params; // URL থেকে দুইজনের username নিলাম

    const messages = await Message.find({ // দুই দিক থেকেই খুঁজলাম ($or ব্যবহার করে)
      $or: [
        { sender: user1, receiver: user2 }, // user1 থেকে user2 কে পাঠানো
        { sender: user2, receiver: user1 }, // user2 থেকে user1 কে পাঠানো
      ],
    }).sort({ createdAt: 1 }); // পুরনো মেসেজ আগে, নতুনটা শেষে (chat এর মতো ক্রম)

    res.status(200).json(messages); // ২০০ status সহ সব মেসেজ ফেরত পাঠালাম
  } catch (error) {
    res.status(500).json({ error: error.message }); // সার্ভার এরর হলে এই মেসেজ পাঠালাম
  }
};

// GET /messages/inbox/:username - একজনের ইনবক্স (কাদের সাথে কথা হয়েছে তার লিস্ট)
const getInbox = async (req, res) => {
  try {
    const { username } = req.params; // URL থেকে username নিলাম

    const messages = await Message.find({ // যেসব মেসেজে এই username sender বা receiver
      $or: [{ sender: username }, { receiver: username }],
    }).sort({ createdAt: -1 }); // নতুন মেসেজ আগে

    const conversations = {}; // কার সাথে শেষ কী মেসেজ হয়েছে তা রাখার জন্য object

    messages.forEach((msg) => { // প্রতিটা মেসেজ ঘুরে দেখলাম
      const otherUser = msg.sender === username ? msg.receiver : msg.sender; // অন্য পাশের ইউজার কে সেটা বের করলাম
      if (!conversations[otherUser]) { // এই ইউজারের সাথে এখনো এন্ট্রি না থাকলে
        conversations[otherUser] = msg; // সবচেয়ে নতুন মেসেজটা রেখে দিলাম (কারণ আগেই sort করা আছে)
      }
    });

    res.status(200).json(Object.values(conversations)); // object থেকে array বানিয়ে ফেরত পাঠালাম
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// DELETE /messages/:id - একটা মেসেজ ডিলিট
const deleteMessage = async (req, res) => {
  try {
    const deletedMessage = await Message.findByIdAndDelete(req.params.id); // খুঁজে মুছে ফেললাম
    if (!deletedMessage) { // মেসেজ না পেলে
      return res.status(404).json({ error: 'Message not found' });
    }
    res.status(200).json({ message: 'Message deleted successfully' }); // মুছে ফেলার confirm মেসেজ পাঠালাম
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = { // সব function একসাথে export করলাম
  sendMessage,
  getConversation,
  getInbox,
  deleteMessage,
};