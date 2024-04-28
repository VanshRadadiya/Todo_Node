var express = require('express');
var router = express.Router();

var user = require('../controller/usercontroller');
var auth = require('../middleware/auth');

/* GET home page. */

// -------------- Admin Side ---------------//
router.post('/admin_register',user.admin_register);
router.post('/admin_login',user.admin_login);
router.get('/admin_logout',user.admin_logout);

// -------------- Add & View Staff ---------------//
router.post('/add_staff',user.add_staff);
router.get('/view_staff',user.view_staff);

// -------------- Add & View Task ---------------//
router.post('/add_task',user.add_task);
router.get('/view_task',user.view_task);

// -------------- Manage Task ---------------//
router.post('/update_task/:id',user.update_task);
router.delete('/delete_task/:id',user.delete_task);


// -------------- User Side ---------------//
router.post('/user_login',user.user_login);
router.get('/user_logout',user.user_logout);


// -------------- User Task ----------------//
router.get('/assign_task',user.assign_task);

// -------------- User Approval ---------------//
router.post('/user_approval/:id',user.user_approval);
router.get('/accept_task',user.accept_task);
router.get('/denied_task',user.denied_task);

// -------------- User Status ---------------//
router.post('/user_status/:id',user.user_status);
router.get('/running_task',user.running_task);
router.get('/completed_task',user.completed_task);


module.exports = router;
