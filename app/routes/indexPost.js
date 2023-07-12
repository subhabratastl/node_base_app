const router = require("express").Router();
const languageVerify = require("../middlewares/validateLang")
const { verifyToken } = require("../middlewares/authJwt");

const authenticateController = require("../controllers/authenticate")
const profileController=require("../controllers/profileSetup")
const roleSetupController=require("../controllers/roleSetup")
const userSetupController=require("../controllers/userSetup")
const menuSetupController=require("../controllers/menuSetup")
const resourceSetupController=require("../controllers/resourceSetup")
const roleToMenuController=require("../controllers/roleVsMenuMapping")


router.post(["/signin", "/indexPost/signin"], languageVerify, authenticateController.loginUser);
router.post(["/forgetPassword","/indexPost/forgetPassword"],languageVerify,authenticateController.forgetPaswrd);


router.post(["/userSetup", "/indexPost/userSetup"],languageVerify, verifyToken, userSetupController.intialUser);
router.post(["/getUserList", "/indexPost/getUserList"],languageVerify, verifyToken, userSetupController.intialUser);
router.post(["/updateUserStatus", "/indexPost/updateUserStatus"],languageVerify, verifyToken, userSetupController.activeDeactiveUser);

 router.post(["/roleSetup", "/indexPost/roleSetup"],languageVerify, verifyToken, roleSetupController.initialRole);
 router.post(["/updateRoleStatus", "/indexPost/updateRoleStatus"],languageVerify, verifyToken, roleSetupController.activeDeactiveRole);

 router.post(["/resourceSetup", "/indexPost/resourceSetup"],languageVerify, verifyToken, resourceSetupController.initialResource);

 router.post(["/roleToMenuMapping", "/indexPost/roleToMenuMapping"],languageVerify, verifyToken, roleToMenuController.initalRoleVsMenu);

router.post(["/updateProfileDetails","/indexPost/updateProfileDetails"],languageVerify,verifyToken,profileController.updateProfileDetails);
router.post(["/passwordUpdate","/indexPost/passwordUpdate"],languageVerify,verifyToken,profileController.updatePassword);

router.post(["/menuSetup","/menuApi/menuSetup"],languageVerify,verifyToken,menuSetupController.initialMenu);


module.exports = router