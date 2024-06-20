const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const passport = require('passport');
const session = require('express-session');
const { Server } = require('socket.io');
require('dotenv').config();

const app = express();

const socketIO = require('./src/core/utils/socketIO');
const server = require('http').createServer(app);
const io = new Server(server, {
  cors: {
    origin: '*',
  },
});

socketIO.setIO(io);

const authRoutes = require('./src/api/routes/auth');
const emailRoutes = require('./src/api/routes/email');
const userRoutes = require('./src/api/routes/user');
const folderRoutes = require('./src/api/routes/folder');
const webhookRoutes = require('./src/api/routes/webhook');
const { runJob } = require('./src/scheduler/jobs/syncEmailsData');
require('./config/passport');

app.use(bodyParser.json());
app.use(session({ secret: 'BGyu78', resave: false, saveUninitialized: true }));
app.use(passport.initialize());
app.use(passport.session());

// Enable CORS
app.use(cors());

app.use('/auth', authRoutes);
app.use('/api', emailRoutes);
app.use('/user', userRoutes);
app.use('/folder', folderRoutes);
app.use('/webhook', webhookRoutes);

// Socket.IO connection
io.on('connection', (socket) => {
  console.log('A user connected');

  socket.on('disconnect', () => {
    console.log('User disconnected');
  });
});

// Middleware to log request URL
app.use((req, res, next) => {
    console.log(`Request URL: ${req.url}`);
    next();
  });

// Start the cron job
runJob();

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});