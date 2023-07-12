const dashboardModel=require("../../models/dashboard")
const resData = require("../../utils/dataResponse")
const logger = require("../../utils/logger")
const path = '/controllers/dashboardController/-';
var dashboardController=module.exports={
    getUsersCount: async function (req, res, next) {
        try {
            let resp = await resData(req, res, next);
            console.log('inside getUser Count');
            let result = await dashboardModel.getUserCountModel();
            let dataResponse = {
                status: resp.successCode,
                message: resp.success.TOTAL_COUNT,
                responseData: Object.assign({}, ...result)
            }
            res.status(200).send(dataResponse)
            //console.log('result..getuserCount',result);

        } catch (err) {
            logger.error(`${path}getUsersCount()-${err}`)
        }
    },

    getGroupWiseUsersCount: async function (req, res, next) {
        try {
            let resp = await resData(req, res, next);
            let result = await dashboardModel.getGroupWiseUsersCountModel();
            let dataResponse = {
                status: resp.successCode,
                message: resp.success.TOTAL_COUNT,
                responseData: result
            }
            res.status(200).send(dataResponse)
        } catch (err) {
            logger.error(`${path}getGroupWiseUsersCount()-${err}`)
        }
    },
}