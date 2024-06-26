const express = require("express");
const userRegistration = require("../controllers/userRegistration.js");
const userValidation = require("../controllers/userValidation.js");
const {userAuthorization} = require("../controllers/userAuthorization.js");
const {sendUserInfo} = require("../controllers/userAuthorization.js");
const {updateProfile} = require("../controllers/updateProfile.js");
const getUserProfile = require("../controllers/getUserProfile.js");
const {updateFollower,updateUserSpaces} = require("../controllers/updateProfile.js");
const router = express.Router();

router.post("/newUser", userRegistration);
router.post("/login", userValidation);
router.post("/authorizeUser",userAuthorization);
router.post("/currUser",sendUserInfo);
router.post("/updateProfile",updateProfile);
router.post("/profileDetails",getUserProfile);
router.post("/updateFollowers",updateFollower);
router.post("/add-user-space",updateUserSpaces);
module.exports = router;
