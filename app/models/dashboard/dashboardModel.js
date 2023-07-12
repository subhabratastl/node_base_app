const db = require("../connection")
const logger = require("../../utils/logger")

let path = "/models/dashboard/-";

// Define your model
let sequelize = db.sequelize;

var dashboardModel=module.exports={
    getUserCountModel: async function () {
        try {
          const query = 'SELECT COUNT(*) AS totalUsers,CAST(SUM(CASE WHEN record_status = 1 THEN 1 ELSE 0 END)AS SIGNED) AS activeUsers,CAST(SUM(CASE WHEN record_status = 0 THEN 1 ELSE 0 END)AS SIGNED) AS inActiveUsers FROM user_masters WHERE record_status NOT IN (2)';
          const [resultData] = await sequelize.query(query, {})
          //return { success: true, data: result };
          return resultData;
        } catch (err) {
          logger.error(`${path}getUserCountModel()- ${err}`)
          //return { success: false, error: 'Sequelize query failed' };
    
        }
      },
    
      getGroupWiseUsersCountModel: async function () {
        try {
          const query = 'SELECT rm.role_name AS roleName,COUNT(*) AS totalCount FROM role_masters rm JOIN user_masters um ON rm.role_code = um.fk_role_code where rm.record_status NOT IN (2) GROUP BY rm.role_code ORDER BY rm.id';
          const [resultData] = await sequelize.query(query, {})
          return resultData;
        } catch (err) {
          logger.error(`${path}getGroupWiseUsersCountModel()- ${err}`)
        }
      },
}