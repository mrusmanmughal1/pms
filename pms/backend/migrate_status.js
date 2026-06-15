require('dotenv').config();
const mongoose = require('mongoose');

mongoose.connect(process.env.MONGO_URI).then(async () => {
  const res = await mongoose.connection.collection('users').updateMany(
    { status: { $exists: false } },
    { $set: { status: 'Active' } }
  );
  console.log('Updated users:', res.modifiedCount);
  process.exit(0);
}).catch(console.error);
