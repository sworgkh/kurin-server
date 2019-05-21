const mongoose = require('mongoose');
// access the MODEL
const Task = require('../schemas/events');
const User = require('../schemas/users');
var _this = this;
var request = require('request');

exports.getAllTasks = (req, res) => {

    Task.find({})
        .then(docs => {
            console.log(docs);
            return res.json(docs);
        })
        .catch(err => console.log(`query error: ${err}`))
};

exports.findTasksByUserEmail = (req, res) => {
    let id = parseInt(req.params["id"]);
    Task.find({ task_id: { $eq: id } })
        .then(docs => {
            console.log(docs);
            return res.json(docs);
        })
        .catch(err => console.log(`query error: ${err}`))
};


exports.findTasksByCleanerEmail = (req, res) => {
    let id = parseInt(req.params["id"]);
    Task.find({ task_id: { $eq: id } })
        .then(docs => {
            console.log(docs);
            return res.json(docs);
        })
        .catch(err => console.log(`query error: ${err}`))
};


exports.addNewTask = (req, res) => {
    // if (functions.validateUser(req.body.my_email)) { //check if user is the admin
    if (true) { //check if user is the admin
        let taksDynamic = new Task({
            task_name: req.body.task_name,
            task_id: req.body.task_id,
            task_users: req.body.task_users,
            is_vip: req.body.is_vip,
            description: req.body.description,
            users_submitted_completion: req.body.users_submitted_completion,
            task_level: req.body.task_level,
            task_value_points: req.body.task_value_points
        });
        // save model to database
        taksDynamic.save(function(err, taksDynamic) {
            if (err) return console.error(err);
            console.log(taksDynamic.task_name + " saved to bookstore collection.");
            twitterRepo.PostTweet(req.body);
        });
        return res.json("New task: " + taksDynamic.task_name + " saved to bookstore collection and tweet posted.")
    } else {
        res.json("Only Administrator can add tasks!")
    }
};

exports.updateTask = (req, res) => {
    // console.log(req);
    let { id = null } = req.body;

    let uId = mongoose.Types.ObjectId(id);
    Task.findOne({ _id: { $eq: uId } }, function(err, task) {
        if(err || task === null)
            return;

        if (task.task_name !== req.body.task_name && req.body.task_name !== undefined) {
            task.task_name = req.body.task_name;
            task.markModified(task.task_name)
        }
        if (task.task_users !== req.body.task_users && req.body.task_users !== undefined) {
            // console.log(req.body.task_users);
            task.task_users = req.body.task_users.slice();
            task.markModified(task.task_users)
        }
        if (task.is_vip !== req.body.is_vip && req.body.is_vip !== undefined) {
            task.is_vip = req.body.is_vip;
            task.markModified(task.is_vip)
        }
        if (task.description !== req.body.description && req.body.description !== undefined) {
            task.description = req.body.description;
            task.markModified(task.description)
        }
        if (task.users_submitted_completion !== req.body.users_submitted_completion && req.body.users_submitted_completion !== undefined) {
            // console.log(req.body.users_submitted_completion);
            task.users_submitted_completion = req.body.users_submitted_completion.slice();
            task.markModified(task.users_submitted_completion)
        }
        if (task.task_max_participants !== req.body.task_max_participants && req.body.task_max_participants !== undefined) {
            task.task_max_participants = parseInt(req.body.task_max_participants);
            task.markModified(task.task_max_participants)
        }
        if (task.task_level !== req.body.task_level && req.body.task_level !== undefined) {
            task.task_level = parseInt(req.body.task_level);
            task.markModified(task.task_level)
        }
        if (task.task_value_points !== req.body.task_value_points && req.body.task_value_points !== undefined) {
            task.task_value_points = parseInt(req.body.task_value_points);
            task.markModified(task.task_value_points)
        }

        task.save(function(err) {
            if (err) {
                console.error('ERROR! can not save the database');
            } else {
                // res.json(task);
            }
        });
    });
};

exports.deleteTask = (req, res) => {
    let { id = null } = req.body;
    let uId = mongoose.Types.ObjectId(id);
    Task.findByIdAndRemove({ _id: uId }, function(err, doc) {
        if(err || !doc) {
            res.json(console.log(`query error: ${err}`));
        }
        else {
            res.json("Deleted task with id: " + id);
        }
    });

};