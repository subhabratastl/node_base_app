const profileSetupModel = require('../../models/profileSetup')
var profileController=module.exports={

    updateProfileDetails: async function (req, res, next) {
        console.log('update profile....');
        try {
            var params = req.body;
            params.myUserCode = req.userCode;
            console.log('update profile....', params);
            if ('updateProfilePhoto' in params) {
                console.log('if for profile..');
                let resultData = await profileSetupModel.UpdateProfilePhoto(params);
                let result = {};
                let finalResult;
                if (resultData.affectedRows == 1 || resultData.affectedRows == 0) {
                    console.log("if case affectedRows...")
                    result = await profileSetupModel.getProfile(params);
                    finalResult = {
                        "user_name": result[0].user_name,
                        "profile_photo": result[0].profile_photo
                    }
                }
                console.log('resulttttt...', finalResult);
                let dataResponse = {
                    status: "000",
                    message: "Updated profile details Successfully",
                    responseData: finalResult
                }
                res.status(200).send(dataResponse)
            } else {
                console.log('else for profile..@@@@@@@@@@@@@@@2')
                let result = await profileSetupModel.UpdateProfileDetails(params);
                let dataResponse = {
                    status: "000",
                    message: "Updated profile details Successfully",
                    responseData: {}
                }
                res.status(200).send(dataResponse)
            }

        } catch (err) {
            console.log('Update Profile..', err);
        }
    },
    getProfileDetails: async function (req, res, next) {
        try {
            var params = req.body;
            params.myUserCode = req.userCode;
            let result = await profileSetupModel.getProfile(params);
            let dataResponse = {
                status: "000",
                message: "get User Data",
                responseData: Object.assign({}, ...result)
            }
            res.status(200).send(dataResponse);
        } catch (err) {
            console.log("get profile details..", err);
        }
    },

    updatePassword: async function (req, res, next) {
        try {
            var params = req.body;
            params.myUserCode = req.userCode;
            // let passwordMatch=await generalModel.getPassword(params);
            // console.log('passweorddddd',passwordMatch[0].password_match);
            // if(params.oldPassword==)
            console.log('password... entry');
            let passwordMatch = await profileSetupModel.getPassword(params);
            console.log('passsword........',passwordMatch);
            if (passwordMatch.data[0].password_match) {
                let passwordUpdate = await profileSetupModel.passwordUpdate(params);
                let dataResponse = {
                    status: "000",
                    message: "Password change successfully",
                    responseData: {}
                }
                res.status(200).send(dataResponse)
            } else {
                let dataResponse = {
                    status: false,
                    message: "Old password not match with our database",
                    responseData: {}
                }
                res.status(200).send(dataResponse)
            }

        } catch (err) {
            console.log("Password change..", err);
        }
    },

    getMenu: async function (req, res, next) {
        try {
            var params = req.body;
            params.roleCode = req.roleCodeData;
            console.log("paramsssss@@@@@@@@@#####", params);
            let result = await profileSetupModel.roleWiseAllMenuModel(params);

            let tree = await profileController.groupNodes(result.data);

            console.log("treeeee", tree);
            if (tree.status) {

                let dataResponse = {
                    status: "000",
                    message: result.message,
                    responseData: tree.data
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
            console.log("getMenu....", err);
        }
    },
    groupNodes: async function (nodes) {

        console.log('nodessssss', nodes);
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