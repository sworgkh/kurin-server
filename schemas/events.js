let mongoose = require('mongoose');

const event_schema = new mongoose.Schema({
    eventUser: String,
    sizeOfTheAppt: String,
    floor: Number,
    time: String,
    eventCleaner: String,
    eventCleanerName: String,
    status: String,
    rating: Number,
    date: String,
    address:String,
    notesByCleaner:String,
    cleanFloor:Boolean,
    cleanBathroom:Boolean,
    cleanWindows:Boolean,
});

//model
const Events = mongoose.model('events',event_schema);
module.exports = Events;