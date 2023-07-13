const roleSetupModel = require('../../models/roleSetup')
const resData = require("../../utils/dataResponse")
const logger = require("../../utils/logger")
const path = '/controllers/roleSetupController/-';
var roleSetupController = module.exports = {

    initialRole: async function (req, res, next) {
        let resp = await resData(req, res, next);
        var params = req.body;
        params.createdBy = req.userCode;
        params.updatedBy = req.userCode;
        params.myRoleCode = req.roleCodeData;
        if (params.op_type == "ROLE_CREATE") {
            roleSetupController.createRole(req, res, next, params, resp);
        } else if (params.op_type == "ROLE_UPDATE") {
            roleSetupController.updateRole(req, res, next, params, resp);
        } else {
            roleSetupController.getAllRoles(req, res, next, params, resp);
        }
    },
    getAllRoles: async function (req, res, next, params, resp) {
        try {
            let result = await roleSetupModel.getAllRolesModel(params);
            if (result.success) {
                let dataResponse = {
                    status: resp.successCode,
                    message: resp.success.FETCH,
                    responseData: {
                        data: result.data,
                        num_rows: result.data[0].total_count
                    }
                }
                logger.info(`${path} createResouce()- ${JSON.stringify(dataResponse)}`)
                res.status(200).send(dataResponse);
            } else {
                let dataResponse = {
                    status: resp.errorCode,
                    message: resp.error.FETCH,
                    responseData: {}
                }
                res.status(200).send(dataResponse);
            }

        } catch (err) {
            logger.error(`${path}getAllRoles()- ${err}`)
        }
    },

    createRole: async function (req, res, next, params, resp) {
        try {
            let result
            if (params.myRoleCode !== 'SADMIN' && params.role_code == 'SADMIN') {
                let dataResponse = {
                    status: resp.errorCode,
                    message: resp.error.INSERT,
                    responseData: {}
                }
                res.status(200).send(dataResponse)
            } else {
                result = await roleSetupModel.createRoleDetails(params);
                if (result.success) {
                    let dataResponse = {
                        status: resp.successCode,
                        message: resp.success.INSERT,
                        responseData: {
                            data: result.data
                        }
                    }
                    logger.info(`${path} createRole()- ${JSON.stringify(dataResponse)}`)
                    res.status(200).send(dataResponse)
                } else {
                    let dataResponse = {
                        status: resp.errorCode,
                        message: resp.error.INSERT,
                        responseData: {}
                    }
                    res.status(200).send(dataResponse)
                }
            }
        } catch (err) {
            logger.error(`${path}createRole()- ${err}`)
        }
    },

    updateRole: async function (req, res, next, params, resp) {
        try {
            params.createdBy = req.userCode;
            let result = await roleSetupModel.updateRoleDetails(params);
            if (result.success) {
                let dataResponse = {
                    status: resp.successCode,
                    message: resp.success.UPDATE,
                    responseData: {
                        data: result.data
                    }
                }
                logger.info(`${path} updateRole()- ${JSON.stringify(dataResponse)}`)
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
            logger.error(`${path}updateRole()- ${err}`)
        }
    },

    getRolesForDropdown: async function (req, res, next) {
        try {
            let resp = await resData(req, res, next);
            let params = req.body;
            params.myRoleCode = req.roleCodeData;
            let result = await roleSetupModel.getRolesForDropdownModel(params);
            if (result.success) {
                let dataResponse = {
                    status: resp.successCode,
                    message: resp.success.FETCH,
                    responseData: {
                        data: result.data
                    }
                }
                logger.info(`${path} getRolesForDropdown()- ${JSON.stringify(dataResponse)}`)
                res.status(200).send(dataResponse);
            } else {
                let dataResponse = {
                    status: resp.errorCode,
                    message: resp.error.FETCH,
                    responseData: {}
                }
                res.status(200).send(dataResponse);
            }

        } catch (err) {
            logger.error(`${path}getRolesForDropdown()- ${err}`)
        }
    },

    activeDeactiveRole: async function (req, res, next) {
        try {
            let resp = await resData(req, res, next);
            let params = req.body;
            params.updatedBy = req.userCode;
            let result = await roleSetupModel.updateRoleStatus(params);
            if (result.success) {
                let dataResponse = {
                    status: resp.successCode,
                    message: resp.success.UPDATE,
                    responseData: {}
                }
                logger.info(`${path} activeDeactiveRole()- ${JSON.stringify(dataResponse)}`)
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
            logger.error(`${path}activeDeactiveRole()- ${err}`)
        }
    },
}