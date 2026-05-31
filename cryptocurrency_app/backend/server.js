require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const http = require('http');
const { Server } = require('socket.io');
const connectDB = require('./config/db');
const { initCryptoSocket } = require('./sockets/cryptoSocket');
const { startCryptoPolling } = require('./services/cryptoDataService');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
  },
});

// Middleware
app.use(helmet()); // Xavfsizlik sarlavhalarini o'rnatish
app.use(morgan('combined')); // Xavfsizlik loglarini yuritish

// So'rovlarni cheklash (Rate Limiting)
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 daqiqa
  max: 100, // har bir IP uchun 15 daqiqa ichida maksimal 100 ta so'rov
  message: 'Ushbu IP manzildan juda ko\'p so\'rov yuborildi, iltimos 15 daqiqadan so\'ng qayta urinib ko\'ring',
});
app.use('/api', limiter); // Barcha API marshrutlariga qo'llash

app.use(cors());
app.use(express.json());

// Connect to Database
connectDB();

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/admin', require('./routes/admin'));
app.use('/api/crypto', require('./routes/crypto'));

// Initialize Socket.io
initCryptoSocket(io);

// Start polling crypto APIs
startCryptoPolling(io);

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
