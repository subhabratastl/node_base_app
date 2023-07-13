const roleVsMenuModel = require("../../models/roleVsMenuMapping")
const resData = require("../../utils/dataResponse")
const logger = require("../../utils/logger")
const path = '/controllers/roleVsMenuController/-';

var roleVsMenuController = module.exports = {
    initalRoleVsMenu: async function (req, res, next) {
        let resp = await resData(req, res, next);
        var params = req.body;
        params.myUserCode = req.userCode;
        if (params.op_type == "ADD_MENU_MAPPING") {
            roleVsMenuController.addRoleVsMenu(req, res, next, params, resp);
        } else if (params.op_type == "UPDATE_MENU_MAPPING") {
            roleVsMenuController.updateRoleVsMenu(req, res, next, params, resp);
        } else {
            roleVsMenuController.getRoleVsMenu(req, res, next, params, resp);
        }
    },

    addRoleVsMenu: async function (req, res, next, params, resp) {
        try {
            let result = await roleVsMenuModel.addRoleVsMenuModel(params);
            if (result.success) {
                let dataResponse = {
                    status: resp.successCode,
                    message: resp.success.INSERT,
                    responseData: {}
                }
                logger.info(`${path} addRoleVsMenu()- ${JSON.stringify(dataResponse)}`)
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
            logger.error(`${path}addRoleVsMenu()- ${err}`)
        }
    },

    getRoleVsMenu: async function (req, res, next, params, resp) {
        try {
            let result = await roleVsMenuModel.getRoleVsMenuModel(params);
            if (result.success) {
                let dataResponse = {
                    status: resp.successCode,
                    message: resp.success.FETCH,
                    responseData: {
                        data: ((result.data).length != 0) ? result.data : null,
                        num_rows: ((result.data).length != 0) ? result.data[0].total_count : 0
                    }
                }
                logger.info(`${path} getRoleVsMenu()- ${JSON.stringify(dataResponse)}`)
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
            logger.error(`${path}getRoleVsMenu()- ${err}`)
        }
    },

    updateRoleVsMenu: async function (req, res, next, params, resp) {
        try {
            let result = await roleVsMenuModel.updateRoleVsMenuModel(params);
            if (result.success) {
                let dataResponse = {
                    status: resp.successCode,
                    message: resp.success.UPDATE,
                    responseData: {}
                }
                logger.info(`${path} updateRoleVsMenu()- ${JSON.stringify(dataResponse)}`)
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
            logger.error(`${path}updateRoleVsMenu()- ${err}`)
        }
    },
}