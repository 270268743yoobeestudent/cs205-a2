// backend/server.js
const express = require('express');
const session = require('express-session');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const MongoStore = require('connect-mongo');

const authRoutes = require('./routes/Auth');
const adminRoutes = require('./routes/admin');
const employeeRoutes = require('./routes/employee');

const app = express();

// Connect to MongoDB
mongoose.connect('mongodb+srv://anthony:admin@cs205-a2.lqx6x.mongodb.net/', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('MongoDB connected'))
.catch(err => console.error(err));

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Setup session (using a MongoDB store)
app.use(session({
  secret: 'yourSecretKey',
  resave: false,
  saveUninitialized: false,
  store: MongoStore.create({ mongoUrl: 'mongodb+srv://anthony:admin@cs205-a2.lqx6x.mongodb.net/' }),
  cookie: { maxAge: 1000 * 60 * 30 } // 30 minutes session timeout
}));

// Define API Routes
app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/employee', employeeRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
