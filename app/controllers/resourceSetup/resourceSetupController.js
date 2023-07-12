const resourceSetupModel=require("../../models/resourceSetup")
var resourceSetupController=module.exports={
    initialResource: async function (req, res, next) {
        var params = req.body;
        params.myUserCode = req.userCode;
        if (params.op_type == "CREATE_RESOURCE") {
            resourceSetupController.createResouce(req, res, next, params);
        } else if (params.op_type == "UPDATE_RESOURCE") {
            resourceSetupController.updateResouce(req, res, next, params);
        } else {
            resourceSetupController.getAllResouceData(req, res, next, params);
        }
    },

    createResouce: async function (req, res, next, params) {
        try {
            console.log('create Resoursessssss....', params);
            let max = 99999;
            let min = 10000;
            params.resourceCode = Math.floor(Math.random() * (max - min + 1) + min);
            console.log('user codeeee', params);
            let result = await resourceSetupModel.createResourceModel(params);
            if (result.success) {
                let dataResponse = {
                    status: "000",
                    message: result.message,
                    responseData: result.data
                }
                res.status(200).send(dataResponse)
            } else {
                let dataResponse = {
                    status: false,
                    message: result.message,
                    responseData: {}
                }
                res.status(200).send(dataResponse)
            }

        } catch (err) {
            console.log('get error create resource', err);
        }

    },

    getAllResouceData: async function (req, res, next, params) {
        try {
            let result = await resourceSetupModel.getAllResourceModel(params);
            if (result.success) {
                let dataResponse = {
                    status: "000",
                    message: result.message,
                    responseData: {
                        data: result.data,
                        totalRecordCount: result.data[0].totalCount
                    }
                }
                res.status(200).send(dataResponse)
            } else {
                let dataResponse = {
                    status: false,
                    message: result.message,
                    responseData: {}
                }
                res.status(200).send(dataResponse)
            }

        } catch (err) {
            console.log('error get Resource data', err);
        }
    },
    updateResouce: async function (req, res, next, params) {
        try {
            params.myUserCode = req.userCode;
            let result = await resourceSetupModel.updateResouceModel(params);
            if (result.success) {
                let dataResponse = {
                    status: "000",
                    message: result.message,
                    responseData: {}
                }
                res.status(200).send(dataResponse)
            } else {
                let dataResponse = {
                    status: false,
                    message: result.message,
                    responseData: {}
                }
                res.status(200).send(dataResponse)
            }
        } catch (err) {
            console.log('create Role..', err);
        }
    },

    getResourceForDropdown:async function(req,res,next){
        try {
            let result = await resourceSetupModel.getResourceForDropdownModel();
            if (result.success) {
                let dataResponse = {
                    status: "000",
                    message: result.message,
                    responseData: result.data
                }
                res.status(200).send(dataResponse)
            } else {
                let dataResponse = {
                    status: false,
                    message: result.message,
                    responseData: {}
                }
                res.status(200).send(dataResponse)
            }

        } catch (err) {
            console.log('error get Resource data', err);
        }
    },
}