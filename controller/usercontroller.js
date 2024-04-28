var admin = require('../model/admin_register');
var staff = require('../model/add_staff');
var task = require('../model/add_task');
const bcrypt = require('bcrypt');
const storage = require('node-persist');
storage.init( /* options ... */);
var jwt = require('jsonwebtoken');

// ---------------- Admin Register -----------------//
exports.admin_register = async (req, res) => {
    var count = await admin.find();
    console.log(count);

    if (count.length > 0) {
        res.status(200).json({
            status: "Only One Admin Exist"
        });
    } else {
        var b_pass = await bcrypt.hash(req.body.password, 10);
        req.body.password = b_pass;

        var email = req.body.email;
        var existing = await admin.findOne({ email });

        if (existing) {
            res.status(200).json({
                status: "Admin Already Exist"
            });
        } else {
            var data = await admin.create(req.body);
            res.status(200).json({
                status: "Admin Register Success",
                data
            });
        }
    }
}

var admin_status;
// ---------------- Admin Log-in -----------------//
exports.admin_login = async (req, res) => {
    admin_status = await storage.getItem('login_admin');
    if (admin_status == undefined) {
        const data = await admin.find({ "email": req.body.email });
        if (data.length > 0) {
            bcrypt.compare(req.body.password, data[0].password, async function (err, result) {
                if (result == true) {
                    // var token = jwt.sign({ id: data[0].id }, 'secretkey');
                    await storage.setItem('login_admin', data[0].id);
                    res.status(200).json({
                        status: "Login Success",
                        // token
                    })
                } else {
                    res.status(200).json({
                        status: "Enter Valid Password"
                    })
                }
            });
        } else {
            res.status(200).json({
                status: "Enter Valid Email"
            })
        }
    } else {
        res.status(200).json({
            status: "Admin Already Login",
        })
    }
}

// ---------------- Admin Log-Out -----------------//
exports.admin_logout = async (req, res) => {
    await storage.removeItem('login_admin');
    res.status(200).json({
        status: "Logout Success",
    })
}

// ---------------- Add Staff  -----------------//
exports.add_staff = async (req, res) => {
    admin_status = await storage.getItem('login_admin');
    if (admin_status != undefined) {

        var b_pass = await bcrypt.hash(req.body.password, 10);
        req.body.password = b_pass;

        var username = req.body.username;
        var existing = await staff.findOne({ username });

        if (existing) {
            res.status(200).json({
                status: "Staff Already Exist"
            });
        } else {
            var data = await staff.create(req.body);
            res.status(200).json({
                status: "Add Staff Success",
                data
            })
        }
    } else {
        res.status(200).json({
            status: "Admin Not Logged In"
        })
    }
}

// ---------------- View Staff  -----------------//
exports.view_staff = async (req, res) => {
    admin_status = await storage.getItem('login_admin');
    if (admin_status != undefined) {
        const data = await staff.find();
        res.status(200).json({
            status: "View Staff Success",
            data
        })
    } else {
        res.status(200).json({
            status: "Admin Not Logged In"
        })
    }
}


// ---------------- Add Task  -----------------//
exports.add_task = async (req, res) => {
    admin_status = await storage.getItem('login_admin');
    if (admin_status != undefined) {

        var data = await task.create(req.body);
        if (data.approval == "Denied" && data.status == "Pending") {
            res.status(200).json({
                status: "Add Task Success",
                data
            })
        } else {
            res.status(200).json({
                status: "You Can't Change Approval & Status Here!"
            })
        }
    } else {
        res.status(200).json({
            status: "Admin Not Logged In"
        })
    }
}

// ---------------- View Task  -----------------//
exports.view_task = async (req, res) => {
    admin_status = await storage.getItem('login_admin');
    if (admin_status != undefined) {
        const data = await task.find().populate('staff_id');
        res.status(200).json({
            status: "View Task Success",
            data
        })
    } else {
        res.status(200).json({
            status: "Admin Not Logged In"
        })
    }
}

// ---------------- Update Task -----------------//
exports.update_task = async (req, res) => {
    admin_status = await storage.getItem('login_admin');
    if (admin_status != undefined) {
        var id = req.params.id;
        const data = await task.findByIdAndUpdate(id, req.body);
        if (data.approval == "Denied" && data.status == "Pending") {
            res.status(200).json({
                status: "Update Task Success",
                data
            })
        } else {
            res.status(200).json({
                status: "You Can't Change Approval & Status Here!"
            })
        }
    } else {
        res.status(200).json({
            status: "Admin Not Logged In"
        })
    }
}

// ---------------- Delete Task  -----------------//
exports.delete_task = async (req, res) => {
    admin_status = await storage.getItem('login_admin');
    if (admin_status != undefined) {
        var id = req.params.id;
        const data = await task.findByIdAndDelete(id);
        res.status(200).json({
            status: "Delete Success",
            data
        })
    } else {
        res.status(200).json({
            status: "Admin Not Logged In"
        })
    }
}


// ---------------- User Log-in -----------------//
exports.user_login = async (req, res) => {
    var user_status = await storage.getItem('login_user');

    if (user_status == undefined) {
        const data = await staff.find({ "username": req.body.username });
        if (data.length > 0) {
            bcrypt.compare(req.body.password, data[0].password, async function (err, result) {
                if (result == true) {
                    // var token1 = jwt.sign({ id: data[0].id }, 'userkey');
                    await storage.setItem('login_user', data[0].id);
                    res.status(200).json({
                        status: "Login Success",
                        // token1
                    })
                } else {
                    res.status(200).json({
                        status: "Enter Valid Password"
                    })
                }
            });
        } else {
            res.status(200).json({
                status: "Enter Valid Username"
            })
        }
    } else {
        res.status(200).json({
            status: "User Already Login",
        })
    }
}

// ---------------- User Log-Out -----------------//
exports.user_logout = async (req, res) => {
    await storage.removeItem('login_user');
    res.status(200).json({
        status: "Logout Success",
    })
}

// ---------------- Assign Task ------------------//
exports.assign_task = async (req, res) => {
    var user_status = await storage.getItem('login_user');
    var loggedInUserId = user_status;
    if (user_status != undefined) {
        const data = await task.find({ 'staff_id': loggedInUserId }).populate('staff_id');
        console.log(data);
        if (data) {
            if (data.length > 0) {
                res.status(200).json({
                    status: "Assign Task Success",
                    data
                });
            } else {
                res.status(200).json({
                    status: "No Task Found"
                });
            }
        } else {
            res.status(500).json({
                status: "Error",
                message: "An error occurred while fetching user tasks."
            });
        }

    } else {
        res.status(200).json({
            status: "User Not Logged In"
        })
    }
}

// ---------------- User Approval ------------------//
exports.user_approval = async (req, res) => {
    var user_status = await storage.getItem('login_user');
    if (user_status != undefined) {
        var loggedInUserId = user_status;
        var UpdateOfUserId = req.params.id;

        var data = await task.find({'staff_id': loggedInUserId });

        if ( data[0].id == UpdateOfUserId) {
            const data = await task.findByIdAndUpdate(UpdateOfUserId,  { approval: req.body.approval }, { new: true });
            res.status(200).json({
                status: "User Approval Success",
                data
            });
        } else {
            res.status(403).json({
                status: "You Can Only Approval Your Own Account",
            });
        }
    } else {
        res.status(200).json({
            status: "User Not Logged In"
        });
    }
}

// ---------------- Accept Task ------------------//
exports.accept_task = async (req, res) => {
    var user_status = await storage.getItem('login_user');
    if (user_status != undefined) {
        const data = await task.find({ 'approval': "Accept", 'staff_id': user_status }).populate('staff_id');
        if (data) {
            if (data.length > 0) {
                res.status(200).json({
                    status: "Accept Task Success",
                    data
                });
            } else {
                res.status(200).json({
                    status: "No Task Found"
                });
            }
        } else {
            res.status(500).json({
                status: "User Not Logged In"
            });
        }
    }
}

// ---------------- Denied Task ------------------//
exports.denied_task = async (req, res) => {
    var user_status = await storage.getItem('login_user');
    if (user_status != undefined) {
        const data = await task.find({ 'approval': "Denied", 'staff_id': user_status }).populate('staff_id');
        if (data) {
            if (data.length > 0) {
                res.status(200).json({
                    status: "Denied Task Success",
                    data
                });
            } else {
                res.status(200).json({
                    status: "No Task Found"
                });
            }
        } else {
            res.status(500).json({
                status: "User Not Logged In"
            });
        }
    }
}

// ---------------- User Status ------------------//
exports.user_status = async (req, res) => {
    var user_status = await storage.getItem('login_user');
    if (user_status != undefined) {
        var loggedInUserId = user_status;
        var UpdateOfUserId = req.params.id;

        var data = await task.find({'staff_id': loggedInUserId });

        if ( data[0].id == UpdateOfUserId) {
            if (data[0].approval == "Accept") {
                const data = await task.findByIdAndUpdate(UpdateOfUserId, { status: req.body.status }, { new: true });
                res.status(200).json({
                    status: "User Status Success",
                    data
                });
            } else {
                res.status(200).json({
                    status: "You Can Change If Approval Is Accept",
                });
            }
        } else {
            res.status(403).json({
                status: "You Can Only Approval Your Own Account",
            });
        }
    } else {
        res.status(200).json({
            status: "User Not Logged In"
        });
    }
}

// ---------------- Running Task ------------------//
exports.running_task = async (req, res) => {
    var user_status = await storage.getItem('login_user');
    if (user_status != undefined) {
        const data = await task.find({ 'status': "Running", 'staff_id': user_status }).populate('staff_id');
        if (data) {
            if (data.length > 0) {
                res.status(200).json({
                    status: "Running Task Success",
                    data
                });
            } else {
                res.status(200).json({
                    status: "No Task Found"
                });
            }
        } else {
            res.status(500).json({
                status: "User Not Logged In"
            });
        }
    }
}

// ---------------- Completed Task ------------------//
exports.completed_task = async (req, res) => {
    var user_status = await storage.getItem('login_user');
    if (user_status != undefined) {
        const data = await task.find({ 'status': "Completed", 'staff_id': user_status }).populate('staff_id');
        if (data) {
            if (data.length > 0) {
                res.status(200).json({
                    status: "Completed Task Success",
                    data
                });
            } else {
                res.status(200).json({
                    status: "No Task Found"
                });
            }
        } else {
            res.status(500).json({
                status: "User Not Logged In"
            });
        }
    }
}
