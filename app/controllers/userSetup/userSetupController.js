const userSetupModel = require('../../models/userSetup')
var userSetupController = module.exports = {
    intialUser: async function (req, res, next) {
        var params = req.body;
        params.createdBy = req.userCode;
        params.updatedBy = req.userCode;
        params.myRoleCode = req.roleCodeData;
        if (params.op_type == "USER_CREATE") {
            userSetupController.createUser(req, res, next, params);
        } else if (params.op_type == "USER_UPDATE") {
            userSetupController.updateUserDetails(req, res, next, params);
        } else {
            userSetupController.getUserList(req, res, next, params);
        }
    },

    createUser: async function (req, res, next, params) {
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
                        status: "000",
                        message: "Create User Successfully",
                        responseData: {
                            data: insertUserMaster
                        }
                    }
                    res.status(200).send(dataResponse)
                } else {
                    let dataResponse = {
                        status: false,
                        message: result.data,
                        responseData: {}
                    }
                    res.status(200).send(dataResponse)
                }
            } else {
                let dataResponse = {
                    status: false,
                    message: result.data,
                    responseData: {}
                }
                res.status(200).send(dataResponse)
            }

        } catch (err) {
            console.log('create user..', err);
        }
    },

    updateUserDetails: async function (req, res, next, params) {
        try {
            console.log('user update...controllerss...', params)
            let result = await userSetupModel.UserUpdateDetails(params);
            let dataResponse = {
                status: "000",
                message: "Updated user details Successfully",
                responseData: {
                    data: result
                }
            }
            res.status(200).send(dataResponse)
        } catch (err) {
            console.log('create Role..', err);
        }
    },
    getUserList: async function (req, res, next, params) {
        try {
            //let params=req.body;
            let result = await userSetupModel.getAllUserList(params);
            if (result.success) {
                let totalRecords = await userSetupModel.getTotalCount(params);
                if (totalRecords.success) {
                    let dataResponse = {
                        status: "000",
                        message: "get ALL User List",
                        responseData: {
                            data: result.data,
                            num_rows: totalRecords.data[0].totalRecords
                        }
                    }
                    res.status(200).send(dataResponse);

                } else {
                    let dataResponse = {
                        status: false,
                        message: totalRecords.data,
                        responseData: {}
                    }
                    res.status(200).send(dataResponse);
                }

            } else {
                let dataResponse = {
                    status: false,
                    message: result.data,
                    responseData: {}
                }
                res.status(200).send(dataResponse);
            }
        } catch (err) {
            console.log("get User List controller..", err)
        }
    },
    activeDeactiveUser: async function (req, res, next) {
        try {
            console.log("active and deactive usersss..");
            let params = req.body;
            params.updatedBy = req.userCode;
            await userSetupModel.updateUserStatus(params);
            let dataResponse = {
                status: "000",
                message: "Updated User Successfully",
                responseData: {}
            }
            res.status(200).send(dataResponse)

        } catch (err) {
            console.log('active deactive ..', err);
        }
    },
    getUsersCount: async function (req, res, next) {
        try {
            console.log('inside getUser Count');
            let result = await userSetupModel.getUserCountModel();
            let dataResponse = {
                status: "000",
                message: "get Users Count",
                responseData: Object.assign({}, ...result)
            }
            res.status(200).send(dataResponse)
            //console.log('result..getuserCount',result);

        } catch (err) {
            console.log('get User count.', err);
        }
    },

    
}