const consts = process.env.NODE_ENV === "production" ? null : require('./dev-env');
const express = require('express');
const cleanCtl = require("../controllers/clean.ctl");
const passport = require('passport');
const session = require('express-session')
const MongoStore = require('connect-mongo')(session);
const socketio = require('socket.io');
const dbConnection= require('./db.js')
const http = require('http')
exports.connectedUsers = []
//const passportInit = require('./security/passport.init')
//const gardenCtl = require('./controllers/garden.ctl');
// const app = express();
const port = process.env.PORT || 3001;

// var server = require('http').createServer(app)

var app = express();
var server = http.Server(app);
var websocket = socketio(server);
// server.listen(port, () => console.log('listening on *:3000'));


// The event will be called when a client is connected.
websocket.on('connection', (socket) => {
    console.log('A client just joined on', socket.id);
    this.connectedUsers.push(socket)

    // this.connectedUsers[0].broadcast.emit('message','BLAAA')
});





app.set('port', port);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  (req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    res.set("Content-Type", "application/json");
    next();
  });


/*** All routes ***/
//
// // Task routes
// app.get('/getAllEvents', gardenCtl.getAllEvents);
app.get('/getAllCleaners', cleanCtl.getAllCleaners);

app.post('/login',cleanCtl.login)

app.post('/findMatchingCleaners',cleanCtl.findMatchingCleaners)
app.post('/findEventsByCleanerEmail', cleanCtl.findEventsByCleanerEmail);
app.post('/findEventsByUserEmail', cleanCtl.findEventsByUserEmail);
app.post('/addToStarred', cleanCtl.addToStarred);
app.post('/removeFromStarred', cleanCtl.removeFromStarred);
app.post('/deleteEvent', cleanCtl.deleteEvent);
app.post('/addNewEvent', cleanCtl.addNewEvent);
app.post('/editEventByCleaner',cleanCtl.editEventByCleaner)
app.post('/addNotes', cleanCtl.addNotes);
// app.get('/findAvailableTasks/:score', gardenCtl.findAvailableTasks);            //expects integer
// app.post('/addNewTask', gardenCtl.addNewTask);                                  //json must be sent with all new task data
// app.post('/updateTask', gardenCtl.updateTask);                                  //json must be sent with an update data  id="" must
// app.post('/deleteTask', gardenCtl.deleteTask);                                  //id string must be sent id=""
//
// // Users Tasks routes
// app.post('/AssignTaskToUser', gardenCtl.AssignTaskToUser);                      // Expects in body task_id="" user_id=""
// app.post('/RemoveTaskFromUser', gardenCtl.RemoveTaskFromUser);                  // Expects in body task_id="" user_id=""
// app.post('/submitCompletion', gardenCtl.submitCompletion);                      // Expects in body task_id="" user_id=""
// app.get('/getLevelAvailableTasks/:id', gardenCtl.getLevelAvailableTasks);
// app.get('/getUserEvents/:id', gardenCtl.getUserEvents);
// app.get('/getCurrentTasksForUser/:id', gardenCtl.getCurrentTasksForUser);
//
// User routes
// app.post('/createEvent', gardenCtl.createEvent);                         //createEvent
// app.post('/register', gardenCtl.registerUser);                        //id string must be sent email=""
// app.post('/register', gardenCtl.registerCleaner);                        //id string must be sent email=""
// app.post('/findUserByEmail', gardenCtl.findUserByEmail);                        //id string must be sent email=""
app.post('/getUserByEmail', cleanCtl.getUserByEmail);                                //email string must be sent
app.post('/getCleanerByEmail', cleanCtl.getCleanerByEmail);                                //email string must be sent
app.post('/updateUser', cleanCtl.updateUser);                                  //json must be sent with an update data  id="" must




app.get('/time', (req,res) => {
  console.log("time");
  return res.json({ "date": new Date() })
});


server.listen(port, () => {
    require('dns').lookup(require('os').hostname(), function (err, add, fam) {
        console.log('addr: '+add);
    })
    console.log(`listening on port ${port}`)
});