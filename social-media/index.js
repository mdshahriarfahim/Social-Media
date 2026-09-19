require('dotenv').config(); // .env ফাইল লোড করলাম
const express = require('express'); // express import করলাম
const mongoose = require('mongoose'); // mongoose import করলাম
const http = require('http'); // socket.io চালানোর জন্য raw http server লাগবে
const { Server } = require('socket.io'); // socket.io এর Server class import করলাম

const postRoutes = require('./routes/postRoutes'); // post routes import করলাম
const messageRoutes = require('./routes/messageRoutes'); // message routes import করলাম

const app = express(); // app object বানালাম
const server = http.createServer(app); // express app দিয়ে raw http server বানালাম (socket.io এটার উপর বসবে)
const io = new Server(server, { // socket.io server বানালাম, একই http server এর সাথে যুক্ত করে
  cors: { origin: '*' }, // যেকোনো frontend থেকে connect করা যাবে (ডেভেলপমেন্টের জন্য)
});

const port = process.env.PORT; // .env থেকে PORT নিলাম

app.use(express.json()); // JSON body পড়ার middleware চালু করলাম
app.use(express.static('public')); // public ফোল্ডারের ফাইল সরাসরি ব্রাউজারে খোলা যাবে (chat-test.html সহ)
app.set('io', io); // io instance app এর মধ্যে রেখে দিলাম, যাতে controller থেকেও ব্যবহার করা যায়

mongoose.connect(process.env.MONGO_URI) // লোকাল MongoDB এর সাথে connect করার চেষ্টা করলাম
  .then(() => {
    console.log('MongoDB connected successfully!'); // সফল হলে এই মেসেজ
  })
  .catch((err) => {
    console.log('MongoDB connection error:', err); // ব্যর্থ হলে এই মেসেজ
  });

app.use('/', postRoutes); // postRoutes এর সব route যুক্ত করলাম
app.use('/', messageRoutes); // messageRoutes এর সব route যুক্ত করলাম

// socket.io connection হ্যান্ডলিং (real-time এর মূল অংশ)
io.on('connection', (socket) => { // যখনই কোনো ইউজার (browser/app) connect করবে
  console.log('🔌 New socket connected:', socket.id); // কানেক্ট হওয়ার লগ

  socket.on('join', (username) => { // ইউজার তার username দিয়ে নিজের একটা "room" এ join করবে
    socket.join(username); // এখন এই username টাই তার নিজস্ব চ্যানেল, এখানে মেসেজ পাঠানো যাবে
    console.log(`👤 ${username} joined their room`); // লগ
  });

  socket.on('disconnect', () => { // ইউজার চলে গেলে (ব্রাউজার বন্ধ/রিফ্রেশ)
    console.log('❌ Socket disconnected:', socket.id); // লগ
  });
});

server.listen(port, () => { // app.listen এর বদলে এখন server.listen (কারণ socket.io ও এর উপর বসানো আছে)
  console.log(`Server is running on http://localhost:${port}`); // চালু হওয়ার বার্তা দেখালাম
});