const mongoose = require('mongoose');
// access the MODEL
const Cleaner = require('../schemas/cleaners');
const Event = require('../schemas/events');
const User = require('../schemas/users');
var _this = this;
var request = require('request');
var crypto = require('crypto');

function sha1( data ) {
    let generator = crypto.createHash('sha1');
    generator.update( data )
    return generator.digest('hex')
}


exports.login = (req,res) => {
    console.log(req.body)
    let {email = null} = req.body;
    let {password = null} = req.body;
    User.find({
        email: {$eq: email},
        password: {$eq: password},
        }
    )
        .then(docs => {
            let i = JSON.stringify(docs[0])
            // if(docs[0]._doc.password.toString())
            // console.log(docs[0]._doc.password)
            let passHash = sha1(docs[0]._doc.password.toString())
            return res.json({userToken: passHash})
            // return res.json({userToken:passHash.toString()});
        })
        .catch(err => {
            console.log(`query error: ${err}`);
            return res.json(`query error: ${err}`);
        });

}

exports.findMatchingCleaners = (req,res) => {
    console.log(req.body)
    let {floor = null} = req.body;
    let {windows = null} = req.body;
    let {bathroom = null} = req.body;
    let {available = null} = req.body;

    Cleaner.find({
            available: {$eq: available},
            bathroom: {$eq: bathroom},
            windows: {$eq: windows},
            floor: {$eq: floor}
    }
        )
        .then(docs => {
            console.log(docs);
            return res.json(docs);
        })
        .catch(err => {
            console.log(`query error: ${err}`);
            return res.json(`query error: ${err}`);
        });
}

exports.getAllCleaners = (req, res) => {
    Cleaner.find({}).exec()
        .then(docs => {
            console.log(docs);
            return res.json(docs);
        })
        .catch(err => {
            console.log(`query error: ${err}`);
            return res.json(`query error: ${err}`);
        });
};

// exports.findUserByEmail = (req, res) => {
//     let { email = null } = req.body;
//     User.find({ user_email: { $eq: email } })
//         .then(docs => {
//             console.log(docs);
//             return res.json(docs);
//         })
//         .catch(err => {
//             console.log(`query error: ${err}`);
//             return res.json(`query error: ${err}`);
//
//         });
// };

exports.findEventsByUserEmail = (req, res) => {
    let {email = null} = req.body;

    Event.find({ eventUser: { $eq: email } })
        .then(docs => {
            console.log(docs);
            return res.json(docs);
        })
        .catch(err => console.log(`query error: ${err}`))
};


exports.findEventsByCleanerEmail = (req, res) => {
    let {email = null} = req.body;
    Event.find({ eventCleaner: { $eq: email } })
        .then(docs => {
            console.log(docs);
            return res.json(docs);
        })
        .catch(err => console.log(`query error: ${err}`))
};

exports.addNewEvent = (req, res) => {
    // if (functions.validateUser(req.body.my_email)) { //check if user is the admin
    if (true) { //check if user is the admin
        let Event = new Event({
            eventUser: req.body.eventUser,
            sizeOfTheAppt:  req.body.sizeOfTheAppt,
            floor:  req.body.floor,
            time:  req.body.time,
            eventCleaner:  req.body.eventCleaner,
            status: req.body.status,
            rating:  req.body.rating,
            date:  req.body.date,
            notesByCleaner: req.body.notesByCleaner
        });
        // save model to database
        Event.save(function(err, Event) {
            if (err) return console.error(err);
            console.log(Event.eventUser + " saved to tasks collection.");
        });
        return res.json("New task: " + Event.eventUser + " saved to tasks collection and tweet posted.")
    } else {
        res.json("Only Administrator can add tasks!")
    }
};

// exports.updateTask = (req, res) => {
//     // console.log(req);
//     let { id = null } = req.body;
//
//     let uId = mongoose.Types.ObjectId(id);
//     Task.findOne({ _id: { $eq: uId } }, function(err, task) {
//         if(err || task === null)
//             return;
//
//         if (task.task_name !== req.body.task_name && req.body.task_name !== undefined) {
//             task.task_name = req.body.task_name;
//             task.markModified(task.task_name)
//         }
//         if (task.task_users !== req.body.task_users && req.body.task_users !== undefined) {
//             // console.log(req.body.task_users);
//             task.task_users = req.body.task_users.slice();
//             task.markModified(task.task_users)
//         }
//         if (task.is_vip !== req.body.is_vip && req.body.is_vip !== undefined) {
//             task.is_vip = req.body.is_vip;
//             task.markModified(task.is_vip)
//         }
//         if (task.description !== req.body.description && req.body.description !== undefined) {
//             task.description = req.body.description;
//             task.markModified(task.description)
//         }
//         if (task.users_submitted_completion !== req.body.users_submitted_completion && req.body.users_submitted_completion !== undefined) {
//             // console.log(req.body.users_submitted_completion);
//             task.users_submitted_completion = req.body.users_submitted_completion.slice();
//             task.markModified(task.users_submitted_completion)
//         }
//
//         if (task.task_level !== req.body.task_level && req.body.task_level !== undefined) {
//             task.task_level = parseInt(req.body.task_level);
//             task.markModified(task.task_level)
//         }
//         if (task.task_value_points !== req.body.task_value_points && req.body.task_value_points !== undefined) {
//             task.task_value_points = parseInt(req.body.task_value_points);
//             task.markModified(task.task_value_points)
//         }
//
//         task.save(function(err) {
//             if (err) {
//                 if (res.headersSent) return;
//                 else  return res.json(`ERROR! saving task failed ${err}`);
//             } else {
//                 if (res.headersSent) return;
//                 else  return res.json(`Update Successful`);
//             }
//         });
//     });
// };
//
// exports.updateUser = (req, res) => {
//     let { id = null } = req.body;
//     // let { tasks_in_progress = null } = req.body;
//     let uId = mongoose.Types.ObjectId(id);
//     User.findOne({ _id: { $eq: uId } }, function(err, user) {
//
//         if (user.user_name !== req.body.user_name && req.body.user_name !== undefined) {
//             user.user_name = req.body.user_name;
//             user.markModified(user.user_name)
//         }
//         if (user.tasks_completed !== req.body.tasks_completed && req.body.tasks_completed !== undefined) {
//             user.tasks_completed = req.body.tasks_completed.slice();
//             user.markModified(user.tasks_completed)
//         }
//         if (user.admin !== req.body.admin && req.body.admin !== undefined) {
//             user.admin = req.body.admin;
//             user.markModified(user.admin)
//         }
//         if (user.tasks_in_progress !== req.body.tasks_in_progress && req.body.tasks_in_progress !== undefined) {
//             // console.log(req.body.tasks_in_progress);
//             user.tasks_in_progress = req.body.tasks_in_progress.slice();
//             user.markModified(user.tasks_in_progress)
//         }
//
//         if (user.user_points !== req.body.user_points && req.body.user_points !== undefined) {
//             user.user_points = parseInt(req.body.user_points);
//             user.markModified(user.user_points)
//         }
//         if (user.user_email !== req.body.user_email && req.body.user_email !== undefined) {
//             user.user_email = parseInt(req.body.user_email);
//             user.markModified(user.user_email)
//         }
//
//         if (user.user_level !== req.body.user_level && req.body.user_level !== undefined) {
//             user.user_level = parseInt(req.body.user_level);
//             user.markModified(user.user_level)
//         }
//         if (user.join_date !== req.body.join_date && req.body.join_date !== undefined) {
//             user.join_date = parseInt(req.body.join_date);
//             user.markModified(user.join_date)
//         }
//
//         user.save(function(err) {
//             if (err) {
//                 if (res.headersSent) return;
//                 else  return res.json(`ERROR! saving user failed ${err}`);
//             } else {
//                 if (res.headersSent) return;
//                 else  return res.json(`Update Successful`);
//             }
//         });
//     });
// };
//
//
//
exports.getUserByEmail = (req, res) => {

    let { email = null } = req.body;

    User.find({ email: { $eq: email } })
        .then(docs => {
            return res.json(docs);
        })
        .catch(err => {
            console.log(`query error: ${err}`);
            return res.json(`query error: ${err}`);
        });
};

exports.getCleanerByEmail = (req, res) => {

    let { email = null } = req.body;

    Cleaner.find({ email: { $eq: email } })
        .then(docs => {
            return res.json(docs);
        })
        .catch(err => {
            console.log(`query error: ${err}`);
            return res.json(`query error: ${err}`);
        });
};


//
//
// exports.deleteTask = (req, res) => {
//     let { id = null } = req.body;
//     let uId = null;
//     try {
//
//         uId = mongoose.Types.ObjectId(id)
//
//     } catch (err) {
//
//         res.json(err);
//         if (res.headersSent) return;
//         else  return res.json(`ERROR! ${err}`);
//     }
//     Task.findByIdAndRemove({ _id: uId }, function(err, doc) {
//         if(err || !doc) {
//             res.json(console.log(`query error: ${err}`));
//         }
//         else {
//             res.json("Deleted task with id: " + id);
//         }
//     });
//
// };
// exports.AssignTaskToUser = (req, res) => {
//     let new_req_task = ({
//         id: req.body.task_id,
//
//     });
//
//     let uId = mongoose.Types.ObjectId(new_req_task.id);
//     Task.findOne({ _id : { $eq: uId } }, function(err, task) {
//         if(err || !task){
//             if (res.headersSent) return;
//             else  return res.json("Task already assigned to User");
//         }
//         let new_arr_mission = task.task_users;
//         if(new_arr_mission.includes(req.body.user_id)){
//             if (res.headersSent) return;
//             else  return res.json("Task already assigned to User");
//         }
//
//         new_arr_mission.push(req.body.user_id);
//         let new_req = ({
//             body: {
//                 id: req.body.task_id,
//                 task_users: new_arr_mission
//             }
//         });
//         _this.updateTask(new_req, res);
//         if (res.headersSent) return;
//         else return res.json({success:true});
//     });
//
//     let new_req_user = ({
//         id: req.body.user_id,
//
//     });
//
//     uId = mongoose.Types.ObjectId(new_req_user.id);
//     User.findOne({ _id : { $eq: uId } }, function(err, user) {
//         if(err || !user){
//             if (res.headersSent) return;
//             else return res.json("Task already assigned to User");
//         }
//
//         let new_arr_tasks = user.tasks_in_progress;
//         if(new_arr_tasks.includes(req.body.task_id))
//         {
//             if (res.headersSent) return;
//             else return res.json(err + " Error finding user!");;
//         }
//         new_arr_tasks.push(req.body.task_id);
//         let new_req = ({
//             body: {
//                 id: req.body.user_id,
//                 tasks_in_progress: new_arr_tasks
//             }
//         });
//         _this.updateUser(new_req, res);
//         if (res.headersSent) return;
//         else return res.json({success:true});
//     });
//
// };
//
// exports.RemoveTaskFromUser = (req, res) => {
//
//     let {user_id = null, task_id = null} = req.body;
//
//     User.findOne({ _id: { $eq: user_id } })
//         .then(docs => {
//             let tasksPerUser = docs.tasks_in_progress;
//             for(let i=0; i<tasksPerUser.length; i++){
//                 if (tasksPerUser[i]===task_id){
//                     tasksPerUser.splice(i, 1);
//                     let conditions = {_id: { $eq: user_id }},
//                         update = {'tasks_in_progress':tasksPerUser},
//                         opts   = {multi:false};
//                     User.update(conditions, update, opts,
//                         (err)=>{
//                             if (err)
//                                 console.log(`err: ${err}`);
//                             else
//                                 console.log(`updated user: ${User}`);
//                         });
//                 }
//             }
//         })
//         .catch(err => {console.log(`query error: ${err}`)
//             if (res.headersSent) return;
//             else return res.json(`query error: ${err}`);
//         });
//
//     Task.findOne({ _id: { $eq: task_id } })
//         .then(docs => {
//             let usersPerTask = docs.task_users;
//             for(let i=0; i<usersPerTask.length; i++){
//                 if (usersPerTask[i]===user_id){
//                     usersPerTask.splice(i, 1);
//                     let conditions = {_id: { $eq: task_id }},
//                         update = {'task_users':usersPerTask},
//                         opts   = {multi:false};
//                     Task.update(conditions, update, opts,
//                         (err)=>{
//                             if (err)
//                                 console.log(`err: ${err}`);
//                             else
//                                 console.log(`updated user: ${Task}`);
//                         });
//                 }
//             }
//         })
//         .catch(err => {console.log(`query error: ${err}`);
//             if (res.headersSent) return;
//             else return res.json(`query error: ${err}`);
//         });
//     if (res.headersSent) return;
//     else return res.json({success:true});
// };
//
// exports.getUserEvents = (req, res) => {
//     let uId = req.params["id"];
//     User.findOne({ _id: { $eq: uId } })
//         .then(docs => {
//             Task.find({ _id: { $in: docs.tasks_completed } })
//                 .then(doc => {res.json(doc)})
//                 .catch(err => {console.log(`query error: ${err}`)})
//         })
//         .catch(err => {console.log(`query error: ${err}`)
//             if (res.headersSent) return;
//             else return res.json(`query error: ${err}`);
//
// })};
//
// exports.getCurrentTasksForUser = (req, res) => {
//     let uId = req.params["id"];
//     User.findOne({ _id: { $eq: uId } })
//         .then(docs => {
//             Task.find({ _id: { $in: docs.tasks_in_progress } })
//                 .then(doc => {res.json(doc)})
//                 .catch(err => {console.log(`query error: ${err}`)})
//         })
//         .catch(err => {console.log(`query error: ${err}`)
//             if (res.headersSent) return;
//             else return res.json(`query error: ${err}`);
//         })
// };
//
// exports.getLevelAvailableTasks = (req, res) => {
//     let uId = req.params["id"];
//
//     User.findOne({ _id: { $eq: uId } })
//         .then(docs => {
//             let userLevel = docs.user_level;
//             Task.find({ task_level: {  $lte: userLevel}})
//                 .then(doc =>{
//                     console.log(doc);
//                     return res.json({tasks_avilable : doc});
//                 })
//                 .catch(err => {console.log(`query error: ${err}`)
//                     if (res.headersSent) return;
//                     else return res.json(`query error: ${err}`);
//                 })
//         })
//         .catch(err => {console.log(`query error: ${err}`);
//             if (res.headersSent) return;
//             else return res.json(`query error: ${err}`);
//         })
// };
//
//
// exports.submitCompletion = (req, res) => {
//
//     let {user_id = null, task_id = null} = req.body;
//     let taskPoints;
//
//     Task.findOne({ _id: { $eq: task_id } })
//         .then(docs => {
//             let usersPerTask = docs.task_users;
//             let usersCompletted = docs.users_submitted_completion;
//             taskPoints = docs.task_value_points;
//             for(let i=0; i<usersPerTask.length; i++){
//                 if (usersPerTask[i]===user_id){
//                     usersPerTask.splice(i, 1);
//                     usersCompletted.push(user_id);
//                     let conditions = {_id: { $eq: task_id }},
//                         update = {'task_users':usersPerTask, 'users_submitted_completion':usersCompletted},
//                         opts   = {multi:false};
//                     Task.update(conditions, update, opts,
//                         (err)=>{
//                             if (err){
//                                 console.log(`err: ${err}`);
//                                 res.json({success:false});
//                             }
//                             else
//                                 console.log(`updated user: ${Task}`);
//                         });
//                 }
//             }
//         })
//         .catch(err => console.log(`query error: ${err}`));
//
//     User.findOne({ _id: { $eq: user_id } })
//         .then(docs => {
//             let tasksPerUser = docs.tasks_in_progress;
//             let tasksCompleted = docs.tasks_completed;
//             let userPoints = docs.user_points + taskPoints;
//             let userLevel = Math.floor(userPoints/100);
//             for(let i=0; i<tasksPerUser.length; i++){
//                 if (tasksPerUser[i]===task_id){
//                     tasksPerUser.splice(i, 1);
//                     tasksCompleted.push(task_id);
//                     let conditions = {_id: { $eq: user_id }},
//                         update = {'tasks_in_progress':tasksPerUser, 'tasks_completed':tasksCompleted,
//                                 'user_points':userPoints, 'user_level':userLevel},
//                         opts   = {multi:false};
//                     User.update(conditions, update, opts,
//                         (err)=>{
//                             if (err){
//                                 console.log(`err: ${err}`);
//                                 res.json({success:false});
//                             }
//                             else
//                                 console.log(`updated user: ${User}`);
//                         });
//                 }
//             }
//         })
//         .catch(err => {console.log(`query error: ${err}`)
//             if (res.headersSent) return;
//             else return res.json(`query error: ${err}`);
//         });
//     if (res.headersSent) return;
//     else return res.json({success:true});
// };