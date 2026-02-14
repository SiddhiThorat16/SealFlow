// WEB - Document Signature App/SealFlow/server/index.js

const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const path = require('path');  // ADD THIS LINE
require('dotenv').config();

const app = express();
app.use(cors({ origin: 'http://localhost:5173' }));
app.use(express.json());

// Auth routes & protected test
app.use('/api/auth', require('./routes/auth'));  // Auth routes
app.get('/api/protected', require('./middleware/auth'), (req, res) => {
  res.json({ msg: 'Protected route works!', user: req.user });
});  // Test middleware

// Document routes (Day 3)
app.use('/api/docs', require('./routes/documents'));  // Document routes

// SERVE UPLOADED PDFs STATICALLY - ADD THESE 2 LINES
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

mongoose.connect(process.env.MONGODB_URI || 'mongodb+srv://thoratsiddhi35_db_user:GkcwFSFbDUzhpg70@sealflow.aitr0cz.mongodb.net/')
  .then(() => console.log('MongoDB connected!'))
  .catch(err => console.error('DB error:', err));

app.get('/', (req, res) => res.send('SealFlow API ready'));
app.listen(5000, () => console.log('Server on port 5000'));
