require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const authRoutes = require('./src/routes/authRoutes');


const app = express();

// Middleware
app.use(express.json());
app.use(cors());

// Use Routes
app.use('/api/auth', authRoutes);
const path = require('path');

app.use('/uploads', express.static(path.join(__dirname, '../uploads')));
// MongoDB Connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB Connected"))
  .catch((err) => console.log("❌ Connection Error:", err));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));