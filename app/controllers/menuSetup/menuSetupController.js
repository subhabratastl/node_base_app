const menuSetupModel = require("../../models/menuSetup")
const resData = require("../../utils/dataResponse")
const logger = require("../../utils/logger")
const path = '/controllers/menuSetupController/-';

var menuSetupController = module.exports = {

    initialMenu: async function (req, res, next) {
        var params = req.body;
        params.myUserCode = req.userCode;
        let resp = await resData(req, res, next);
        if (params.op_type == "CREATE_MENU") {
            menuSetupController.createMenu(req, res, next, params, resp);
        } else if (params.op_type == "UPDATE_MENU") {
            menuSetupController.updateMenu(req, res, next, params, resp);
        } else {
            menuSetupController.getAllMenu(req, res, next, params, resp);
        }
    },

    createMenu: async function (req, res, next, params, resp) {
        try {
            let result = await menuSetupModel.menuCreateModel(params);
            if (result.success) {
                let dataResponse = {
                    status: resp.successCode,
                    message: resp.success.INSERT,
                    responseData: {}
                }
                logger.info(`${path} createMenu()- ${JSON.stringify(dataResponse)}`)
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
            logger.error(`${path} createMenu()- ${err}`)
        }
    },

    getAllMenu: async function (req, res, next, params, resp) {
        try {
            let result = await menuSetupModel.menuGetAllModel(params);

            if (result.success) {
                let dataResponse = {
                    status: resp.successCode,
                    message: resp.success.FETCH,
                    responseData: {
                        data:result.data,
                        num_rows:result.data[0].total_count
                    }
                }
                logger.info(`${path} getAllMenu()- ${JSON.stringify(dataResponse)}`)
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
            logger.error(`${path} getAllMenu()- ${err}`)
        }
    },

    updateMenu: async function (req, res, next, params, resp) {
        try {
            let result = await menuSetupModel.menuUpdateModel(params);
            if (result.success) {
                let dataResponse = {
                    status: resp.successCode,
                    message: resp.success.UPDATE,
                    responseData: result.data
                }
                logger.info(`${path} updateMenu()- ${JSON.stringify(dataResponse)}`)
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
            logger.error(`${path} updateMenu()- ${err}`)
        }
    },

    getMenuDataForDropdown: async function (req, res, next) {
        try {
            let resp = await resData(req, res, next);
            let result = await menuSetupModel.getMenuDataForDropdownModel();
            if (result.success) {
                let dataResponse = {
                    status: resp.successCode,
                    message: resp.success.FETCH,
                    responseData: result.data
                }
                logger.info(`${path} getMenuDataForDropdown()- ${JSON.stringify(dataResponse)}`)
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
            logger.error(`${path} getMenuDataForDropdown()- ${err}`)
        }
    }

}