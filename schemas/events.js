let mongoose = require('mongoose');

const task_schema = new mongoose.Schema({
    eventUser: String,
    sizeOfTheAppt: String,
    floor: Number,
    time: String,
    eventCleaner: String,
    eventCleanerName: String,
    status: String,
    rating: Number,
    date: String,
    notesByCleaner:String
});

//model
const Events = mongoose.model('events',task_schema);
module.exports = Events;