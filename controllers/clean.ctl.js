const mongoose = require('mongoose');
// access the MODEL
const Cleaner = require('../schemas/cleaners');
const Event = require('../schemas/events');
const User = require('../schemas/users');
var _this = this;
const server = require("../service/server");
var request = require('request');
var crypto = require('crypto');
var connectedUsers =


function sha1( data ) {
    let generator = crypto.createHash('sha1');
    generator.update( data )
    return generator.digest('hex')
}

function sha1( data ) {
    let generator = crypto.createHash('sha1');
    generator.update( data )
    return generator.digest('hex')
}


exports.login = (req,res) => {
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
    let date1 =  new Date()
    let date = date1.toISOString().slice(0, 10);
    let time = date1.toISOString().slice(11, 16);
    console.log(req)

    let userData = {
        eventUser: req.body.eventUser,
        sizeOfTheAppt:  req.body.sizeOfTheAppt,
        floor:  req.body.floor,
        time: time,
        eventCleaner:  req.body.eventCleaner,
        eventCleanerName:req.body.eventCleanerName,
        status: 'Requested',
        rating: 0,
        date:  date,
        address:req.body.address,
        cleanFloor: req.body.cleanFloor,
        cleanBathroom:req.body.cleanBathroom,
        cleanWindows:req.body.cleanWindows,
        notesByCleaner: ''
    }

    Event.create(userData, (error, user) => {
        if (error) {
            return res.json(error);
        } else {
            return res.json('Created');
        }
    });


    // var Event = new Event({
    //     eventUser: req.body.eventUser,
    //     sizeOfTheAppt:  req.body.sizeOfTheAppt,
    //     floor:  req.body.floor,
    //     time: time,
    //     eventCleaner:  req.body.eventCleaner,
    //     status: 'Requested',
    //     rating: 0,
    //     date:  date,
    //     address:req.body.address,
    //     cleanFloor: req.body.cleanFloor,
    //     cleanBathroom:req.body.cleanBathroom,
    //     cleanWindows:req.body.cleanWindows,
    //     notesByCleaner: ''
    // });
    // // save model to database
    // Event.save(function(err, Event) {
    //     if (err) return console.error(err);
    //     console.log(Event.eventUser + " saved to tasks collection.");
    // });
    // return res.json("New task: " + Event.eventUser + " saved to tasks collection and tweet posted.")
};


exports.register = (req, res) => {
    let {name = null} = req.body;
    let {email = null} = req.body;
    let {password = null} = req.body;
    let {address = null} = req.body;
    let {cleaner = null} = req.body;
    let {about = null} = req.body;
    let {avatar = null} = req.body;

    if(cleaner){
        let newUser = {
            name: name,
            rating: 0,
            email: email,
            address:address,
            avatar:avatar,
            events: [],
            available: false,
            about:about,
            cleaner: cleaner,
            windows:false,
            bathroom: false,
            floor:false,
            totalRating:0,
            numberOfSubmittedCleans:0,
        }
        Cleaner.create(newUser, (error, user) => {
            if (error) {
                return res.json(error);
            } else {
                return res.json('Created ' + user.email);
            }
        });


    }
    else {
        let newUser = {
            name: name,
            description: about,
            password: password,
            rating: 0,
            email: email,
            address: address,
            avatar: avatar,
            favorite_cleaners: [],
            events: [],
            cleaner: cleaner,
        }
        User.create(newUser, (error, user) => {
            if (error) {
                return res.json(error);
            } else {
                return res.json('Created ' + user.email);
            }
        });
    }

    // var Event = new Event({
    //     eventUser: req.body.eventUser,
    //     sizeOfTheAppt:  req.body.sizeOfTheAppt,
    //     floor:  req.body.floor,
    //     time: time,
    //     eventCleaner:  req.body.eventCleaner,
    //     status: 'Requested',
    //     rating: 0,
    //     date:  date,
    //     address:req.body.address,
    //     cleanFloor: req.body.cleanFloor,
    //     cleanBathroom:req.body.cleanBathroom,
    //     cleanWindows:req.body.cleanWindows,
    //     notesByCleaner: ''
    // });
    // // save model to database
    // Event.save(function(err, Event) {
    //     if (err) return console.error(err);
    //     console.log(Event.eventUser + " saved to tasks collection.");
    // });
    return res.json("New task: " + Event.eventUser + " saved to tasks collection and tweet posted.")
};




exports.addToStarred = (req, res) => {
    let {userEmail = null} = req.body;
    let {cleanerEmail = null} = req.body;

    User.findOne({email: {$eq: userEmail}}, function (err, user) {
        if (err || !user) {
            if (res.headersSent) return;
            else return res.json("Task already assigned to User");
        }
        let favorite_cleaners = user.favorite_cleaners;
        if (favorite_cleaners.includes(cleanerEmail)) {
            if (res.headersSent) return;
            else return res.json("Task already assigned to User");
        }

        favorite_cleaners.push(cleanerEmail);
        user.favorite_cleaners = favorite_cleaners
        user.save(function (err) {
            if(err) {
                console.error('ERROR!');
            }
        });


        // let neg,        w_req = ({
        //     body: {
        //         email: userEmail,
        //         favorite_cleaners: favorite_cleaners
        //     }
        // });
        // _this.updateUser(new_req, res);
        if (res.headersSent) return;
        else return res.json({success: true});
    });

}

exports.removeFromStarred = (req, res) => {


    console.log(req.body)
    let {userEmail = null} = req.body;
    let {cleanerEmail = null} = req.body;


    User.findOne({email: {$eq: userEmail}}, function (err, user) {
        if (err || !user) {
            if (res.headersSent) return;
            else return res.json("Task already assigned to User");
        }
        let favorite_cleaners = user.favorite_cleaners;
        if (favorite_cleaners.includes(cleanerEmail)) {
            favorite_cleaners.remove(cleanerEmail);
        }
        user.favorite_cleaners = favorite_cleaners
        user.save(function (err) {
            if(err) {
                console.error('ERROR!');
            }
        });
        if (res.headersSent) return;
        else return res.json({success: true});
    });

}

exports.updateEvent = (req, res) => {
    // console.log(req);
    let { id = null } = req.body;

    let uId = mongoose.Types.ObjectId(id);
    Event.findOne({ _id: { $eq: uId } }, function(err, task) {
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
                if (res.headersSent) return;
                else  return res.json(`ERROR! saving task failed ${err}`);
            } else {
                if (res.headersSent) return;
                else  return res.json(`Update Successful`);
            }
        });
    });
};

exports.updateUser = (req, res) => {
    let { email = null } = req.body;


    // User.update({email: email}, {
    //     username: newUser.username,
    //
    // }, function(err, numberAffected, rawResponse) {
    //     //handle it
    // })

    // let { tasks_in_progress = null } = req.body;
    User.findOne({ email: { $eq: email } }, function(err, user) {

        if (user.name !== req.body.name && req.body.name !== undefined) {
            user.name = req.body.name;
            user.markModified(user.name)
        }
        if (user.email !== req.body.email && req.body.email !== undefined) {
            user.email = req.body.email;
            user.markModified(user.email)
        }
        if (user.favorite_cleaners !== req.body.favorite_cleaners && req.body.favorite_cleaners !== undefined) {

            if(user.favorite_cleaners.length === 0)
                user.favorite_cleaners = []
            else
                user.favorite_cleaners = req.body.favorite_cleaners.slice();
            user.markModified(user.favorite_cleaners)
        }

        if (user.events !== req.body.events && req.body.events !== undefined) {
            user.events = req.body.events.slice();
            user.markModified(user.events)
        }
        if (user.rating !== req.body.rating && req.body.rating !== undefined) {
            user.rating = parseInt(req.body.rating);
            user.markModified(user.rating)
        }

        if (user.cleaner !== req.body.cleaner && req.body.cleaner !== undefined) {
            user.cleaner = parseInt(req.body.cleaner);
            user.markModified(user.cleaner)
        }

        user.save(function(err) {
            if (err) {
                if (res.headersSent) return;
                else  return res.json(`ERROR! saving user failed ${err}`);
            } else {
                if (res.headersSent) return;
                else  return res.json(`Update Successful`);
            }
        });
    });
};

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

exports.submitRating = (req, res) => {
    let { id = null } = req.body;
    let {rating = null} = req.body

    let uId = mongoose.Types.ObjectId(id);

    Event.findOne({ _id: { $eq: uId } }, function(err, myEvent) {
        if (err || !myEvent) {
            if (res.headersSent) return;
            else return res.json("ERR");
        }

        myEvent.rating = rating
        myEvent.save(function (err) {
            if (err) {
                if (res.headersSent) return;
                else  return res.json(`ERROR! saving task failed ${err}`);
            } else {

                Cleaner.findOne({ email: { $eq: myEvent.eventCleaner } }, function(err, cleaner) {
                    if (err || !cleaner) {
                        if (res.headersSent) return;
                        else return res.json("ERR");
                    }
                    cleaner.totalRating = cleaner.totalRating + rating
                    cleaner.numberOfSubmittedCleans = cleaner.numberOfSubmittedCleans + 1
                    cleaner.rating = cleaner.totalRating /cleaner.numberOfSubmittedCleans
                    cleaner.save(function (err) {
                        if (err) {
                            if (res.headersSent) return;
                            else  return res.json(`ERROR! saving task failed ${err}`);
                        } else {

                            for (let user in server.connectedUsers) {
                                // console.log(server.connectedUsers[user])
                                server.connectedUsers[user].emit('changedStatus', myEvent._id)
                            }

                            if (res.headersSent) return;
                            else  return res.json(`Update Successful`);
                        }
                    });
                })
                // for (let user in server.connectedUsers) {
                //     // console.log(server.connectedUsers[user])
                //     server.connectedUsers[user].emit('changedStatus', myEvent._id)
                // }

                if (res.headersSent) return;
                else  return res.json(`Update Successful`);
            }
        });
    })

}



exports.editEventByCleaner = (req, res) => {
    let { id = null } = req.body;
    let {email = null} = req.body
    let {newStatus = null} = req.body

    let uId = mongoose.Types.ObjectId(id);

    Event.findOne({ _id: { $eq: uId } }, function(err, myEvent) {
        if (err || !myEvent) {
            if (res.headersSent) return;
            else return res.json("ERR");
        }

        if (myEvent.eventCleaner === email) {
            myEvent.status = newStatus


            myEvent.save(function (err) {
                if (err) {
                    if (res.headersSent) return;
                    else  return res.json(`ERROR! saving task failed ${err}`);
                } else {
                    for (let user in server.connectedUsers) {
                        // console.log(server.connectedUsers[user])
                        server.connectedUsers[user].emit('changedStatus', myEvent._id)
                    }

                    if (res.headersSent) return;
                    else  return res.json(`Update Successful`);
                }

            });


        }
    })


}

exports.addNotes = (req, res) => {
    let { id = null } = req.body;
    let {email = null} = req.body
    let {notes = null} = req.body

    let uId = mongoose.Types.ObjectId(id);

    Event.findOne({ _id: { $eq: uId } }, function(err, myEvent) {
        if (err || !myEvent) {
            if (res.headersSent) return;
            else return res.json("ERR");
        }

        if (myEvent.eventCleaner === email) {
            myEvent.notesByCleaner = notes


            myEvent.save(function (err) {
                if (err) {
                    if (res.headersSent) return;
                    else  return res.json(`ERROR! saving task failed ${err}`);
                } else {
                    for (let user in server.connectedUsers) {
                        // console.log(server.connectedUsers[user])
                        server.connectedUsers[user].emit('changedStatus', myEvent._id)
                    }

                    if (res.headersSent) return;
                    else  return res.json(`Update Successful`);
                }

            });


        }
    })


}


exports.enterQueue = (req, res) => {
    let {floor = null } = req.body;
    let {bathroom = null} = req.body
    let {windows = null} = req.body
    let {available = null} = req.body
    let {email = null} = req.body
    console.log(req.body)
    Cleaner.findOne({ email: { $eq: email } }, function(err, cleaner) {
        if (err || !cleaner) {
            if (res.headersSent) return;
            else return res.json("ERR");
        }
        cleaner.floor = floor
        cleaner.bathroom = bathroom
        cleaner.windows = windows
        cleaner.available = available

        console.log(cleaner)
            cleaner.save(function (err) {
                if (err) {
                    if (res.headersSent) return;
                    else  return res.json(`ERROR! saving task failed ${err}`);
                } else {
                    console.log("Saved")
                    // for (let user in server.connectedUsers) {
                    //     // console.log(server.connectedUsers[user])
                    //     server.connectedUsers[user].emit('changedStatus', cleaner._id)
                    // }
                    if (res.headersSent) return;
                    else  return res.json(`Update Successful`);
                }
            });



    })


}



//
//
exports.deleteEvent = (req, res) => {
    console.log(req.body)
    let { id = null } = req.body;
    let uId = mongoose.Types.ObjectId(id);
    Event.findByIdAndRemove({ _id: uId }, function(err, doc) {
        if(err || !doc) {
            res.json(console.log(`query error: ${err}`));
        }
        else {
            res.json("Deleted task with id: " + id);
        }
    });
};

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