const profileSetupModel = require('../../models/profileSetup')
const resData = require("../../utils/dataResponse")
const logger = require("../../utils/logger")
const path = '/controllers/profileController/-';

var profileController = module.exports = {

    updateProfileDetails: async function (req, res, next) {
        try {
            let resp = await resData(req, res, next);
            var params = req.body;
            params.myUserCode = req.userCode;
            if ('updateProfilePhoto' in params) {
                let resultData = await profileSetupModel.UpdateProfilePhoto(params);
                let result = {};
                let finalResult;
                if (resultData.affectedRows == 1 || resultData.affectedRows == 0) {
                    result = await profileSetupModel.getProfile(params);
                    finalResult = {
                        "user_name": result[0].user_name,
                        "profile_photo": result[0].profile_photo
                    }
                }
                let dataResponse = {
                    status: resp.successCode,
                    message: resp.success.UPDATE,
                    responseData: finalResult
                }
                res.status(200).send(dataResponse)
            } else {
                let result = await profileSetupModel.UpdateProfileDetails(params);
                let dataResponse = {
                    status: resp.successCode,
                    message: resp.success.UPDATE,
                    responseData: {}
                }
                res.status(200).send(dataResponse)
            }

        } catch (err) {
            logger.error(`${path}updateProfileDetails()- ${err}`)
        }
    },
    getProfileDetails: async function (req, res, next) {
        try {
            let resp = await resData(req, res, next);
            var params = req.body;
            params.myUserCode = req.userCode;
            let result = await profileSetupModel.getProfile(params);
            let dataResponse = {
                status: "000",
                message: "get User Data",
                responseData: Object.assign({}, ...result)
            }
            //logger.info(`${path} getProfileDetails()- ${JSON.stringify(dataResponse)}`)
            res.status(200).send(dataResponse);
        } catch (err) {
            logger.error(`${path}getProfileDetails()- ${err}`)
        }
    },

    updatePassword: async function (req, res, next) {
        try {
            let resp = await resData(req, res, next);
            var params = req.body;
            params.myUserCode = req.userCode;
            let passwordMatch = await profileSetupModel.getPassword(params);
            if (passwordMatch.data[0].password_match) {
                let passwordUpdate = await profileSetupModel.passwordUpdate(params);
                let dataResponse = {
                    status: resp.successCode,
                    message: resp.success.PASSWORD_CHANGE,
                    responseData: {}
                }
                logger.info(`${path} updatePassword()- ${JSON.stringify(dataResponse)}`)
                res.status(200).send(dataResponse)
            } else {
                let dataResponse = {
                    status: resp.errorCode,
                    message: resp.error.PASSWORD_CHANGE,
                    responseData: {}
                }
                res.status(200).send(dataResponse)
            }

        } catch (err) {
            logger.error(`${path}updatePassword()- ${err}`)
        }
    },

    getMenu: async function (req, res, next) {
        try {
            let resp = await resData(req, res, next);
            var params = req.body;
            params.roleCode = req.roleCodeData;
            let result = await profileSetupModel.roleWiseAllMenuModel(params);
            let tree = await profileController.groupNodes(result.data);
            if (tree.status) {
                let dataResponse = {
                    status: resp.successCode,
                    message: resp.success.FETCH,
                    responseData: tree.data
                }
                logger.info(`${path} getMenu()- ${JSON.stringify(dataResponse)}`)
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
            logger.error(`${path}getMenu()- ${err}`)
        }
    },
    groupNodes: async function (nodes) {
        const rootNodes = [];
        const nodeMap = {};

        // Create a map of nodes using their IDs for easier access
        nodes.forEach(node => {
            node.subMenu = [];
            nodeMap[node.id] = node;
        });

        // Iterate over the nodes to build the tree structure
        nodes.forEach(node => {
            if (node.parent) {
                const parentNode = nodeMap[node.parent];
                if (parentNode) {
                    parentNode.subMenu.push(node);
                }
            } else {
                rootNodes.push(node);
            }
        });

        return { status: true, data: rootNodes };
    }
}