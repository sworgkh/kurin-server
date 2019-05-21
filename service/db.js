const mongoose = require('mongoose');
const consts = process.env.NODE_ENV === "production" ? null : require('./dev-env');

const url = process.env.MLAB_CONNECTION_STRING || consts.MLAB_CONNECTION_STRING;
console.log(`Connecting to Mongo at: ${url}`);
const conn = mongoose.createConnection(url);
conn.on('connected', () => console.log('mongoose connected'));
conn.on('error', (err) => console.error(err));

mongoose.connect(url);

module.exports = conn;