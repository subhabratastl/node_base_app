const roleSetupModel=require('../../models/roleSetup')

var roleSetupController=module.exports={

    initialRole: async function (req, res, next) {
        var params = req.body;
        params.createdBy = req.userCode;
        params.updatedBy = req.userCode;
        params.myRoleCode = req.roleCodeData;
        //console.log("roleeeeeeeeeeeeeeeeeeee",req.body);
        if (params.op_type == "ROLE_CREATE") {
            roleSetupController.createRole(req, res, next);
        } else if (params.op_type == "ROLE_UPDATE") {
            roleSetupController.updateRole(req, res, next, params);
        } else {
            roleSetupController.getAllRoles(req, res, next, params);
        }
    },
    getAllRoles: async function (req, res, next) {
        try {
            let params = req.body;
            params.myRoleCode = req.roleCodeData;
            let result = await roleSetupModel.getAllRolesModel(params);
            console.log('Alll Role...', result);
            if (result.success) {
                let dataResponse = {
                    status: "000",
                    message: result.message,
                    responseData: {
                        data: result.data,
                        num_rows: result.data[0].total_count
                    }
                }
                res.status(200).send(dataResponse);
            } else {
                let dataResponse = {
                    status: false,
                    message: result.message,
                    responseData: {}
                }
                res.status(200).send(dataResponse);
            }

        } catch (err) {
            console.log(err);
        }
    },

    createRole: async function (req, res, next) {
        try {
            let params = req.body;
            params.createdBy = req.userCode;
            let result
            if (params.myRoleCode !== 'SADMIN' && params.role_code == 'SADMIN') {
                let dataResponse = {
                    status: false,
                    message: 'Data not inserted Properly',
                    responseData: {}
                }
                res.status(200).send(dataResponse)
            } else {
                result = await roleSetupModel.createRoleDetails(params);
                if (result.success) {
                    let dataResponse = {
                        status: "000",
                        message: result.message,
                        responseData: {
                            data: result.data
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
            }
        } catch (err) {
            console.log('create Role..', err);
        }
    },

    updateRole: async function (req, res, next, params) {
        try {
            params.createdBy = req.userCode;
            let result = await roleSetupModel.updateRoleDetails(params);
            if (result.success) {
                let dataResponse = {
                    status: "000",
                    message: result.message,
                    responseData: {
                        data: result.data
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
            console.log('create Role..', err);
        }
    },
    
    getRolesForDropdown: async function (req, res, next) {
        try {
            let params = req.body;
            params.myRoleCode = req.roleCodeData;
            let result = await roleSetupModel.getRolesForDropdownModel(params);
            console.log('Alll Role...', result);
            if (result.success) {
                let dataResponse = {
                    status: "000",
                    message: result.message,
                    responseData: {
                        data: result.data
                    }
                }
                res.status(200).send(dataResponse);
            } else {
                let dataResponse = {
                    status: false,
                    message: result.message,
                    responseData: {}
                }
                res.status(200).send(dataResponse);
            }

        } catch (err) {
            console.log(err);
        }
    },

    activeDeactiveRole: async function (req, res, next) {
        try {
            console.log("active and deactive Role..");
            let params = req.body;
            params.updatedBy = req.userCode;
            await roleSetupModel.updateRoleStatus(params);
            let dataResponse = {
                status: "000",
                message: "Updated Role Successfully",
                responseData: {}
            }
            res.status(200).send(dataResponse)

        } catch (err) {
            console.log('active deactive ..', err);
        }
    },
}