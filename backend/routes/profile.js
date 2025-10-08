const express = require("express");
const router = express.Router();

const { auth, isInstructor } = require("../middleware/auth");
const { upload } = require("../middleware/multer");

// controllers
const {
    updateProfile,
    updateUserProfileImage,
    getUserDetails,
    getEnrolledCourses,
    deleteAccount,
    instructorDashboard
} = require('../controllers/profile');


// ********************************************************************************************************
//                                      Profile routes
// ********************************************************************************************************

// Delete User Account
router.delete('/deleteProfile', auth, deleteAccount);
router.put('/updateProfile', auth, updateProfile);
router.get('/getUserDetails', auth, getUserDetails);


// Get Enrolled Courses
router.get('/getEnrolledCourses', auth, getEnrolledCourses);

// update profile image - use multer middleware but make it optional with .any()
// This allows both file uploads and JSON requests to pass through
router.put('/updateUserProfileImage', auth, (req, res, next) => {
    // Check if request is multipart/form-data
    if (req.is('multipart/form-data')) {
        upload.single('profileImage')(req, res, next);
    } else {
        // Skip multer for JSON requests
        next();
    }
}, updateUserProfileImage);

// instructor Dashboard Details
router.get('/instructorDashboard', auth, isInstructor, instructorDashboard);



module.exports = router;
