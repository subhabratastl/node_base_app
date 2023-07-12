const menuSetupModel= require("../../models/menuSetup")

var menuSetupController= module.exports ={

    initialMenu:async function(req,res,next){
        var params=req.body;
        params.myUserCode=req.userCode;
        if (params.op_type=="CREATE_MENU"){
            menuSetupController.createMenu(req,res,next,params);
        }else if(params.op_type=="UPDATE_MENU"){
            menuSetupController.updateMenu(req,res,next,params);
        }else{
            menuSetupController.getAllMenu(req,res,next,params);
        }
    },

    createMenu:async function(req,res,next,params){
        try{
            let result = await menuSetupModel.menuCreateModel(params);
            if(result.success){
                let dataResponse={
                    status:"000",
                    message:result.message,
                    responseData:{}
                  }
                res.status(200).send(dataResponse)
            }else{
                let dataResponse = {
                    status: false,
                    message: result.message,
                    responseData: {}
                }
                res.status(200).send(dataResponse)
            }
        }catch(err){
            console.log('error create menu..',err)
        }
    },

    getAllMenu:async function(req,res,next,params){
        try{
            let result=await menuSetupModel.menuGetAllModel(params);

            if(result.success){
                let dataResponse={
                    status:"000",
                    message:result.message,
                    responseData:result.data
                  }
                res.status(200).send(dataResponse)
            }else{
                let dataResponse = {
                    status: false,
                    message: result.message,
                    responseData: {}
                }
                res.status(200).send(dataResponse)
            }
        }catch(err){
            console.log('error get All Menu..',err);
        }
    },

    updateMenu:async function(req,res,next,params){
        try{
            let result=await menuSetupModel.menuUpdateModel(params);
            if(result.success){
                let dataResponse={
                    status:"000",
                    message:result.message,
                    responseData:result.data
                  }
                res.status(200).send(dataResponse)
            }else{
                let dataResponse = {
                    status: false,
                    message: result.message,
                    responseData: {}
                }
                res.status(200).send(dataResponse)
            }

        }catch(err){
            console.log('error update Menu..',err); 
        }
    },

    getMenuDataForDropdown: async function (req, res, next) {
        try {
            
            let result = await menuSetupModel.getMenuDataForDropdownModel();
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
            console.log("getMenuDataForDropdown ::", err)
        }
    }

}