const userSetupModel = require('../../models/userSetup')
const resData = require("../../utils/dataResponse")
const logger = require("../../utils/logger")
const path = '/controllers/userSetupController/-';

var userSetupController = module.exports = {
    intialUser: async function (req, res, next) {
        let resp = await resData(req, res, next);
        var params = req.body;
        params.createdBy = req.userCode;
        params.updatedBy = req.userCode;
        params.myRoleCode = req.roleCodeData;
        if (params.op_type == "USER_CREATE") {
            userSetupController.createUser(req, res, next, params, resp);
        } else if (params.op_type == "USER_UPDATE") {
            userSetupController.updateUserDetails(req, res, next, params, resp);
        } else {
            userSetupController.getUserList(req, res, next, params, resp);
        }
    },

    createUser: async function (req, res, next, params, resp) {
        try {
            let max = 999999;
            let min = 100000;
            params.user_codes = Math.floor(Math.random() * (max - min + 1) + min);
            console.log('user codeeee', params);
            let result = await userSetupModel.createUserDetails(params);
            if (result.success) {
                let insertUserMaster = await userSetupModel.createUserDetailsMaster(params);
                if (insertUserMaster.success) {
                    let dataResponse = {
                        status: resp.successCode,
                        message: resp.success.INSERT,
                        responseData: {
                            data: insertUserMaster.data
                        }
                    }
                    logger.info(`${path} createUser()- ${JSON.stringify(dataResponse)}`)
                    res.status(200).send(dataResponse)
                } else {
                    let dataResponse = {
                        status: resp.errorCode,
                        message: resp.error.INSERT,
                        responseData: {}
                    }
                    res.status(200).send(dataResponse)
                }
            } else {
                let dataResponse = {
                    status: resp.errorCode,
                    message: resp.error.INSERT,
                    responseData: {}
                }
                res.status(200).send(dataResponse)
            }

        } catch (err) {
            logger.error(`${path}createUser()- ${err}`)
        }
    },

    updateUserDetails: async function (req, res, next, params, resp) {
        try {
            let result = await userSetupModel.UserUpdateDetails(params);
            if (result.success) {
                let dataResponse = {
                    status: resp.successCode,
                    message: resp.success.UPDATE,
                    responseData: {
                        data: result.data
                    }
                }
                logger.info(`${path} updateUserDetails()- ${JSON.stringify(dataResponse)}`)
                res.status(200).send(dataResponse)
            } else {
                let dataResponse = {
                    status: resp.errorCode,
                    message: resp.error.UPDATE,
                    responseData: {}
                }
                res.status(200).send(dataResponse)
            }
        } catch (err) {
            logger.error(`${path}updateUserDetails()- ${err}`)
        }
    },
    getUserList: async function (req, res, next, params, resp) {
        try {
            let result = await userSetupModel.getAllUserList(params);
            if (result.success) {
                let totalRecords = await userSetupModel.getTotalCount(params);
                if (totalRecords.success) {
                    let dataResponse = {
                        status: resp.successCode,
                        message: resp.success.FETCH,
                        responseData: {
                            data: result.data,
                            num_rows: totalRecords.data[0].totalRecords
                        }
                    }
                    logger.info(`${path} getUserList()- ${JSON.stringify(dataResponse)}`)
                    res.status(200).send(dataResponse);

                } else {
                    let dataResponse = {
                        status: resp.errorCode,
                        message: resp.error.FETCH,
                        responseData: {}
                    }
                    res.status(200).send(dataResponse);
                }
            } else {
                let dataResponse = {
                    status: resp.errorCode,
                    message: resp.error.FETCH,
                    responseData: {}
                }
                res.status(200).send(dataResponse);
            }
        } catch (err) {
            logger.error(`${path}getUserList()- ${err}`)
        }
    },
    activeDeactiveUser: async function (req, res, next) {
        try {
            let resp = await resData(req, res, next);
            let params = req.body;
            params.updatedBy = req.userCode;
            let result = await userSetupModel.updateUserStatus(params);
            if (result.success) {
                let dataResponse = {
                    status: resp.successCode,
                    message: resp.success.UPDATE,
                    responseData: {}
                }
                logger.info(`${path} activeDeactiveUser()- ${JSON.stringify(dataResponse)}`)
                res.status(200).send(dataResponse)
            } else {
                let dataResponse = {
                    status: resp.errorCode,
                    message: resp.error.UPDATE,
                    responseData: {}
                }
                res.status(200).send(dataResponse)
            }
        } catch (err) {
            logger.error(`${path}activeDeactiveUser()- ${err}`)
        }
    },
    getUsersCount: async function (req, res, next) {
        try {
            let resp = await resData(req, res, next);
            let result = await userSetupModel.getUserCountModel();
            if (result.success) {
                let dataResponse = {
                    status: resp.successCode,
                    message: resp.success.FETCH,
                    responseData: Object.assign({}, ...result.data)
                }
                logger.info(`${path} getUsersCount()- ${JSON.stringify(dataResponse)}`)
                res.status(200).send(dataResponse)
            } else {
                let dataResponse = {
                    status: resp.errorCode,
                    message: resp.error.FETCH,
                    responseData: {}
                }
                res.status(200).send(dataResponse)
            }
        } catch (err) {
            logger.error(`${path}getUsersCount()- ${err}`)
        }
    },


}