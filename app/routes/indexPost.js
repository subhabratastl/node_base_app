const router= require("express").Router();
const languageVerify=require("../middlewares/validateLang")
const { verifyToken } = require("../middlewares/authJwt");

const authenticateController=require("../controllers/authenticate")

router.post(["/signin","/indexPost/signin"],languageVerify,authenticateController.loginUser);

module.exports=router