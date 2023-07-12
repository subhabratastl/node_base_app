const roleVsMenuModel=require("../../models/roleVsMenuMapping")

var roleVsMenuController=module.exports={
    initalRoleVsMenu: async function (req, res, next) {
        var params = req.body;
        params.myUserCode = req.userCode;
        if (params.op_type == "ADD_MENU_MAPPING") {
            roleVsMenuController.addRoleVsMenu(req, res, next, params);
        } else if (params.op_type == "UPDATE_MENU_MAPPING") {
            roleVsMenuController.updateRoleVsMenu(req, res, next, params);
        } else {
            roleVsMenuController.getRoleVsMenu(req, res, next, params);
        }
    },
    
    addRoleVsMenu: async function (req, res, next, params) {
        try {
            let result = await roleVsMenuModel.addRoleVsMenuModel(params);
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
            console.log("Add menuVsRole..", err);
        }
    },

    getRoleVsMenu: async function (req, res, next, params) {
        try {
            let result = await roleVsMenuModel.getRoleVsMenuModel(params);
            console.log('result data....getRoleVsMenu',result);
            if (result.success) {
                let dataResponse = {
                    status: "000",
                    message: result.message,
                    responseData: {
                        data:((result.data).length!=0)?result.data:null,
                        num_rows:((result.data).length !=0)?result.data[0].total_count:0
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
            console.log("getMenuVsRole ::", err)
        }
    },

    updateRoleVsMenu: async function (req, res, next, params) {
        try {
            console.log('updateMenuVsRole ::::', params)
            let result = await roleVsMenuModel.updateRoleVsMenuModel(params);
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
            console.log("getMenuVsRole ::", err)
        }
    },
}