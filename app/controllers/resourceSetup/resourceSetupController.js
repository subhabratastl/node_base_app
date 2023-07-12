const resourceSetupModel=require("../../models/resourceSetup")
const resData = require("../../utils/dataResponse")
const logger = require("../../utils/logger")
const path = '/controllers/resourceSetupController/-';
var resourceSetupController=module.exports={
    initialResource: async function (req, res, next) {
        let resp = await resData(req, res, next);
        var params = req.body;
        params.myUserCode = req.userCode;
        if (params.op_type == "CREATE_RESOURCE") {
            resourceSetupController.createResouce(req, res, next, params,resp);
        } else if (params.op_type == "UPDATE_RESOURCE") {
            resourceSetupController.updateResouce(req, res, next, params,resp);
        } else {
            resourceSetupController.getAllResouceData(req, res, next, params,resp);
        }
    },

    createResouce: async function (req, res, next, params,resp) {
        try {
            let max = 99999;
            let min = 10000;
            params.resourceCode = Math.floor(Math.random() * (max - min + 1) + min);
            let result = await resourceSetupModel.createResourceModel(params);
            if (result.success) {
                let dataResponse = {
                    status: resp.successCode,
                    message: resp.success.INSERT,
                    responseData: result.data
                }
                logger.info(`${path} createResouce()- ${JSON.stringify(dataResponse)}`)
                res.status(200).send(dataResponse)
            } else {
                let dataResponse = {
                    status: resp.errorCode,
                    message: resp.error.INSERT,
                    responseData: {}
                }
                res.status(200).send(dataResponse)
            }

        } catch (err) {
            logger.error(`${path}createResouce- ${err}`)
        }

    },

    getAllResouceData: async function (req, res, next, params,resp) {
        try {
            let result = await resourceSetupModel.getAllResourceModel(params);
            if (result.success) {
                let dataResponse = {
                    status: resp.successCode,
                    message: resp.success.FETCH,
                    responseData: {
                        data: result.data,
                        totalRecordCount: result.data[0].totalCount
                    }
                }
                logger.info(`${path} getAllResouceData()- ${JSON.stringify(dataResponse)}`)
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
            logger.error(`${path}getAllResouceData()- ${err}`)
        }
    },
    updateResouce: async function (req, res, next, params,resp) {
        try {
            params.myUserCode = req.userCode;
            let result = await resourceSetupModel.updateResouceModel(params);
            if (result.success) {
                let dataResponse = {
                    status: resp.successCode,
                    message: resp.success.UPDATE,
                    responseData: {}
                }
                logger.info(`${path} updateResouce()- ${JSON.stringify(dataResponse)}`)
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
            logger.error(`${path}updateResouce()- ${err}`)
        }
    },

    getResourceForDropdown:async function(req,res,next){
        try {
            let result = await resourceSetupModel.getResourceForDropdownModel();
            if (result.success) {
                let dataResponse = {
                    status: resp.successCode,
                    message: resp.success.FETCH,
                    responseData: result.data
                }
                logger.info(`${path} getResourceForDropdown()- ${JSON.stringify(dataResponse)}`)
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
            logger.error(`${path}getResourceForDropdown()- ${err}`)
        }
    },
}