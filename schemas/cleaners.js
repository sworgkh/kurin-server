let mongoose = require('mongoose');

const cleaner_schema = new mongoose.Schema({
    name: { type: String, index:1,required: true},
    rating: Number,
    email: String,
    address:String,
    avatar:String,
    events: [String],
    available: Boolean,
    about:String,
    cleaner: Boolean,
    windows:Boolean,
    bathroom: Boolean,
    floor:Boolean
});

//model
const Cleaners = mongoose.model('cleaners',cleaner_schema);
module.exports = Cleaners;