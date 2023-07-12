const dashboardModel=require("../../models/dashboard")

var dashboardController=module.exports={
    getUsersCount: async function (req, res, next) {
        try {
            console.log('inside getUser Count');
            let result = await dashboardModel.getUserCountModel();
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

    getGroupWiseUsersCount: async function (req, res, next) {
        try {
            console.log('Group Wise count');
            let result = await dashboardModel.getGroupWiseUsersCountModel();
            let dataResponse = {
                status: "000",
                message: "get Group Wise Users Count",
                responseData: result
            }
            res.status(200).send(dataResponse)
        } catch (err) {
            console.log('getGroupWiseUsersCount', err);
        }
    },
}