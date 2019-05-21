const mongoose = require('mongoose');
// access the MODEL
const Task = require('../schemas/events');
const User = require('../schemas/users');
var _this = this;
var request = require('request');

exports.getAllUsers = (req, res) => {
    User.find({})
        .then(docs => {
            console.log(docs);
            return res.json(docs);
        })
        .catch(err => console.log(`query error: ${err}`))
};

exports.registerUser  = (req, res) => {
    User.find({})
        .then(docs => {
            console.log(docs);
            return res.json(docs);
        })
        .catch(err => console.log(`query error: ${err}`))
};


exports.findUserByEmail = (req, res) => {
    let { email = null } = req.body;
    User.find({ user_email: { $eq: email } })
        .then(docs => {
            console.log(docs);
            return res.json(docs);
        })
        .catch(err => console.log(`query error: ${err}`))
};


exports.updateUser = (req, res) => {
    let { id = null } = req.body;
    // let { tasks_in_progress = null } = req.body;
    let uId = mongoose.Types.ObjectId(id);
    User.findOne({ _id: { $eq: uId } }, function(err, user) {

        if (user.user_name !== req.body.user_name && req.body.user_name !== undefined) {
            user.user_name = req.body.user_name;
            user.markModified(user.user_name)
        }
        if (user.tasks_completed !== req.body.tasks_completed && req.body.tasks_completed !== undefined) {
            user.tasks_completed = req.body.tasks_completed.slice();
            user.markModified(user.tasks_completed)
        }
        if (user.admin !== req.body.admin && req.body.admin !== undefined) {
            user.admin = req.body.admin;
            user.markModified(user.admin)
        }
        if (user.tasks_in_progress !== req.body.tasks_in_progress && req.body.tasks_in_progress !== undefined) {
            // console.log(req.body.tasks_in_progress);
            user.tasks_in_progress = req.body.tasks_in_progress.slice();
            user.markModified(user.tasks_in_progress)
        }

        if (user.user_points !== req.body.user_points && req.body.user_points !== undefined) {
            user.user_points = parseInt(req.body.user_points);
            user.markModified(user.user_points)
        }
        if (user.user_email !== req.body.user_email && req.body.user_email !== undefined) {
            user.user_email = parseInt(req.body.user_email);
            user.markModified(user.user_email)
        }

        if (user.user_level !== req.body.user_level && req.body.user_level !== undefined) {
            user.user_level = parseInt(req.body.user_level);
            user.markModified(user.user_level)
        }
        if (user.join_date !== req.body.join_date && req.body.join_date !== undefined) {
            user.join_date = parseInt(req.body.join_date);
            user.markModified(user.join_date)
        }

        user.save(function(err) {
            if (err) {
                console.error('ERROR! saving user failed');
            } else {
                // res.json(user);
            }
        });
    });
};



exports.getUserById = (req, res) => {
    let { id = null } = req.body;
    let uId = mongoose.Types.ObjectId(id);
    User.find({ _id: { $eq: uId } })
        .then(docs => {
            console.log(docs);
            return res.json(docs);
        })
        .catch(err => console.log(`query error: ${err}`))
};

exports.getCompletedTasksByUser = (req, res) => {
    let uId = req.params["id"];

    User.findOne({ _id: { $eq: uId } })
        .then(docs => {
            completedTasks = docs.tasks_completed;
            return res.json({completed_tasks : completedTasks});
        })
        .catch(err => console.log(`query error: ${err}`))
};

exports.getCurrentTasksForUser = (req, res) => {
    let uId = req.params["id"];

    User.findOne({ _id: { $eq: uId } })
        .then(docs => {
            currensTasks = docs.tasks_in_progress;
            return res.json({tasks_in_progress : currensTasks});
        })
        .catch(err => console.log(`query error: ${err}`))
};
