// C:\Labmentix Projects\Web - Document Signature App\SealFlow\server\index.js

const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();

const app = express();
app.use(cors({ origin: 'http://localhost:5173' }));
app.use(express.json());

mongoose.connect(process.env.MONGODB_URI || 'mongodb+srv://thoratsiddhi35_db_user:GkcwFSFbDUzhpg70@sealflow.aitr0cz.mongodb.net/')
  .then(() => console.log('MongoDB connected!'))
  .catch(err => console.error('DB error:', err));

app.get('/', (req, res) => res.send('SealFlow API ready'));
app.listen(5000, () => console.log('Server on port 5000'));
