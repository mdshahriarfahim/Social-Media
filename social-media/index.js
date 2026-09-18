require('dotenv').config(); // .env ফাইল লোড করলাম
const express = require('express'); // express import করলাম
const mongoose = require('mongoose'); // mongoose import করলাম

const postRoutes = require('./routes/postRoutes'); // routes import করলাম

const app = express(); // app object বানালাম
const port = process.env.PORT; // .env থেকে PORT নিলাম

app.use(express.json()); // JSON body পড়ার middleware চালু করলাম

mongoose.connect(process.env.MONGO_URI) // লোকাল MongoDB এর সাথে connect করার চেষ্টা করলাম
  .then(() => {
    console.log('MongoDB connected successfully!'); // সফল হলে এই মেসেজ
  })
  .catch((err) => {
    console.log('MongoDB connection error:', err); // ব্যর্থ হলে এই মেসেজ
  });

app.use('/', postRoutes); // postRoutes এর সব route যুক্ত করলাম

app.listen(port, () => { // নির্দিষ্ট পোর্টে সার্ভার চালু করলাম
  console.log(`Server is running on http://localhost:${port}`); // চালু হওয়ার বার্তা দেখালাম
});