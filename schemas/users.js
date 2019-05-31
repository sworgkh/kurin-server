let mongoose = require('mongoose');

const user_schema = new mongoose.Schema({
        name: { type: String, index:1,required: true},
        description: String,
        password: String,
        rating: Number,
        email: String,
        address:String,
        avatar:String,
        favorite_cleaners: [String],
        events: [String],
        cleaner: Boolean,
});

//model
const Users = mongoose.model('users',user_schema);
module.exports = Users;