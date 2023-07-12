const router = require("express").Router();
const languageVerify = require("../middlewares/validateLang")
const { verifyToken } = require("../middlewares/authJwt");

const authenticateController = require("../controllers/authenticate")
const profileController=require("../controllers/profileSetup")
const roleSetupController=require("../controllers/roleSetup")
const menuSetupController=require("../controllers/menuSetup")
const dashboardController=require("../controllers/dashboard")
const resourceSetupController=require("../controllers/resourceSetup")

 router.get(["/signout", "/indexGet/signout"], languageVerify, verifyToken, authenticateController.signout);
 router.get(["/getRoles", "/indexGet/getRoles"], languageVerify, verifyToken, roleSetupController.getRolesForDropdown);
 router.get(["/getUsersCount", "/indexGet/getUsersCount"], languageVerify, verifyToken, dashboardController.getUsersCount);
 router.get(["/getGroupUsersCount", "/indexGet/getGroupUsersCount"], languageVerify, verifyToken, dashboardController.getGroupWiseUsersCount);
 router.get(["/getResource", "/indexGet/getResource"], languageVerify, verifyToken, resourceSetupController.getResourceForDropdown);
 router.get(["/getProfileDetails","/indexGet/getProfileDetails"], languageVerify, verifyToken, profileController.getProfileDetails);
 router.get(["/getRoleMenu","/indexGet/getRoleMenu"], languageVerify, verifyToken, profileController.getMenu);
 router.get(["/getMenuData","/indexGet/getMenuData"], languageVerify, verifyToken, menuSetupController.getMenuDataForDropdown);

module.exports = router