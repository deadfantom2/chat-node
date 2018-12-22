const express       = require('express');
const mongoose      = require('mongoose');
const cookieParser  = require('cookie-parser');
const logger        = require('morgan');
const bodyParser    = require('body-parser');
const cors          = require('cors');
const config        = require('./config/config');
const port          = 3000;

// Init express
const app           = express();

app.use(cors());

const server        = require('http').createServer(app);
const io            = require('socket.io').listen(server);

// Db Mongo
mongoose.Promise = global.Promise;
mongoose.connect(config.database).then(function(err) {
  if (err) console.log('Database is connected');
  else console.log('Connexion Mongo is faild: ' + err);
});

// CORS
app.use(function(req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Credentials', 'true');
  res.header('Access-Control-Allow-Methods', 'GET, PUT, POST, PATCH, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  next();
});

// Middlewares
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

app.use(cookieParser());

app.use(logger('dev'));

//require sockets
require('./socket/streams')(io);

// Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/chatapp', require('./routes/postRoutes'));
app.use('/api/chatapp', require('./routes/userRoutes'));
app.use('/api/chatapp', require('./routes/friendRoutes'));
app.use('/api/chatapp', require('./routes/messageRoutes'));

// Server
server.listen(port, () => {
  console.log('The server is running on port ' + port);
});
