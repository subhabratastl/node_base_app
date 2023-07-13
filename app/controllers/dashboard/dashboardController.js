const dashboardModel = require("../../models/dashboard")
const resData = require("../../utils/dataResponse")
const logger = require("../../utils/logger")
const path = '/controllers/dashboardController/-';
var dashboardController = module.exports = {
    getUsersCount: async function (req, res, next) {
        try {
            let resp = await resData(req, res, next);
            console.log('inside getUser Count');
            let result = await dashboardModel.getUserCountModel();
            if (result.success) {
                let dataResponse = {
                    status: resp.successCode,
                    message: resp.success.TOTAL_COUNT,
                    responseData: Object.assign({}, ...result.data)
                }
                logger.info(`${path}getUsersCount()-${JSON.stringify(dataResponse)}`)
                res.status(200).send(dataResponse)
            } else {
                let dataResponse = {
                    status: resp.errorCode,
                    message: resp.error.TOTAL_COUNT,
                    responseData: {}
                }
                res.status(200).send(dataResponse)
            }
        } catch (err) {
            logger.error(`${path}getUsersCount()-${err}`)
        }
    },

    getGroupWiseUsersCount: async function (req, res, next) {
        try {
            let resp = await resData(req, res, next);
            let result = await dashboardModel.getGroupWiseUsersCountModel();
            if (result.success) {
                let dataResponse = {
                    status: resp.successCode,
                    message: resp.success.TOTAL_COUNT,
                    responseData: result.data
                }
                res.status(200).send(dataResponse)
            } else {
                let dataResponse = {
                    status: resp.errorCode,
                    message: resp.error.TOTAL_COUNT,
                    responseData: {}
                }
                res.status(200).send(dataResponse)
            }
        } catch (err) {
            logger.error(`${path}getGroupWiseUsersCount()-${err}`)
        }
    },
}