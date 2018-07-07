const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

// Passport
var path = require('path');
//var favicon = require('serve-favicon');
//var logger = require('morgan');
//var cookieParser = require('cookie-parser');
var passport = require('passport');

// Passport config
//require('./api/models/db');
require('./config/passport');

// Models
const Student = require('./models/student.js');
const Chat = require('./models/chat.js');

// Routes
var app = express();
var router = express.Router();
var http = require('http').createServer(app);
var chat = require('./app-chat.js');

//Socket.io
var io = require('socket.io')(http);

// var http = require('http').createServer(app);
// var io = require('socket.io')(http);
// var router = express.Router();
// var Chat = require('./models/chat.js');

http.listen(3000);


mongoose.connect("mongodb://localhost/students")
  .then(() => {
    console.log('Connected to database!')
  })
  .catch(() => {
    console.log('Connection failed!')
  });

app.use(bodyParser.json());

app.use((req, res, next) => {
  res.set('Access-Control-Allow-Credentials', 'true');
  res.setHeader("Access-Control-Allow-Origin", 'http://localhost:4200');
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Authorization, Accept"
  );
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PATCH, PUT, DELETE, OPTIONS"
  );
  next();
});

// Passport 

var routesApi = require('./routes/index');
app.use(passport.initialize());
app.use('/api', routesApi);

// Routes

app.post('/api/students', (req, res, next) => {
  const student = new Student({
    name: req.body.name,
    surname: req.body.surname,
    mail: req.body.mail,
    birthday: req.body.birthday,
    sex: req.body.sex,
    bus1: req.body.bus1,
    bus2: req.body.bus2,
    bus3: req.body.bus3
  });
  student.save().then(createdStudent => {
    //console.log(result);
    res.status(201).json({
      postId: createdStudent._id
    });
  }); //provided by mongoose
  //console.log(student);
});

app.put('/api/students/:id', (req, res, next) => {
  const student = new Student({
    _id: req.body._id,
    name: req.body.name,
    surname: req.body.surname,
    mail: req.body.mail,
    birthday: req.body.birthday,
    sex: req.body.sex,
    bus1: req.body.bus1,
    bus2: req.body.bus2,
    bus3: req.body.bus3
  });
  Student.updateOne({
    _id: req.params.id
  }, student).then(result => {
    console.log(result);
    res.status(200).json("succes");
  })
})

app.get('/api/students', (req, res, next) => {
  Student.find().then(documents => {
    //console.log(documents);
    res.status(200).json(documents);
  });
});

app.get('/api/students/:id', (req, res, next) => {
  Student.findById(req.params.id).then(student => {
    if (student) {
      res.status(200).json({
        student
      });
    } else {
      res.status(404).json({
        message: 'Student not found !'
      });
    }
  })
})

app.delete('/api/students/:id', (req, res, next) => {
  //console.log(req.params.id);
  Student.deleteOne({
    _id: req.params.id
  }).then(result => {
    //console.log(result);
  })
  res.status(200).json({
    message: "Student deleted!"
  });
});

// socket io
io.on('connection', function (socket) {
  console.log('User connected');
  socket.on('disconnect', function () {
    console.log('User disconnected');
  });
  socket.on('save-message', function (data) {
    io.emit('new-message', {
      message: data
    });
  });
});

//Chat routes

/* GET ALL CHATS */
app.get('/chat/:room', (req, res, next) => {
  Chat.find({
    room: req.params.room
  }).then(chats => {
    res.status(200).json({
      chats
    });
  });
});

/* SAVE CHAT */
app.post('/chat', function (req, res, next) {
  const message = new Chat({
    room: req.body.room,
    nickname: req.body.nickname,
    message: req.body.message,
    updated_at: req.body.updated_at
  });
  message.save().then(newMessage => {
    //console.log("le message", message);
    res.status(201).json();
  });
});

app.use('/', chat);

module.exports = app;