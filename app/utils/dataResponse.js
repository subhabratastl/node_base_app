const msgResponse = require("./message.json");
const statusResponse=require("./statusCode.json")

const msgData = async (req,res,next) => {
    let language=req.lang;
    let data={
        success:msgResponse[language].success,
        error : msgResponse[language].error,
        successCode:statusResponse.SUCCESS,
        errorCode:statusResponse.ERROR
    }
    return data;
}
module.exports = msgData;
    

