//const consts = process.env.NODE_ENV === "production" ? null : require('./dev-env');
const express = require('express');
//const passport = require('passport');
//const session = require('express-session')
//const MongoStore = require('connect-mongo')(session);
//const dbConnection= require('./db.js')
//const passportInit = require('./security/passport.init')
//const gardenCtl = require('./controllers/garden.ctl');
const app = express();
const port = process.env.PORT || 3001;

var server = require('http').createServer(app);

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

app.get('/', (req,res) => {
  console.log("time");
  return res.json({ "date": new Date() })
});


server.listen(port, () => console.log(`listening on port ${port}`));