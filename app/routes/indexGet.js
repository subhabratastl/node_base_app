const router= require("express").Router();
const languageVerify=require("../middlewares/validateLang")
const { verifyToken } = require("../middlewares/authJwt");

router.post(["/test","/indexApi/test"],languageVerify,verifyToken)

module.exports=router