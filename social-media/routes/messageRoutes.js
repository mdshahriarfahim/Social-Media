const express = require('express'); // express import করলাম
const router = express.Router(); // Router object বানালাম

const messageController = require('../controllers/messageController'); // controller import করলাম

router.post('/messages', messageController.sendMessage); // নতুন মেসেজ পাঠানো
router.get('/messages/inbox/:username', messageController.getInbox); // ইনবক্স (কনভারসেশন লিস্ট) - এটা আগে রাখলাম যাতে :user1/:user2 এর সাথে conflict না হয়
router.get('/messages/:user1/:user2', messageController.getConversation); // দুইজনের মধ্যেকার chat history
router.delete('/messages/:id', messageController.deleteMessage); // মেসেজ ডিলিট

module.exports = router; // router export করলাম