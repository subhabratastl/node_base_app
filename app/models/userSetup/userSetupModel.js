const db = require("../connection")
const logger = require("../../utils/logger")

let path = "/models/userSetupModel/-";
// Define your model
let sequelize = db.sequelize;
var userSetupModel=module.exports={
    createUserDetails: async function (params) {
        try {
          const query = 'INSERT INTO user_details (user_code, display_name,email_id,mobile_no,address,profile_photo,created_by) VALUES (?, ?, ?, ?, ?, ?, ?)';
          const [results] = await sequelize.query(query, {
            replacements: [params.user_codes, params.displayName, params.emailId, params.mobileNo, params.address, 'profilePhoto' in params ? params.profilePhoto : null, params.createdBy] // Provide values for the placeholders
          });
          return { success: true, data: results };
        } catch (err) {
          logger.error(`${path}createUserDetails()- ${err}`)
          return { success: false, data: 'Data not inserted properly' };
        }
      },
    
      createUserDetailsMaster: async function (params) {
        try {
          let query2 = "SELECT SHA2(CONCAT(?,'#','password'),256) AS encodePassword";
          try {
            const [result] = await sequelize.query(query2, {
              replacements: [params.userId]
            })
            const query = 'INSERT INTO user_masters (user_code,user_name,password,fk_role_code,created_by) VALUES (?, ?, ?, ?, ?)';
            const [resultData] = await sequelize.query(query, {
              replacements: [params.user_codes, params.userId, result[0].encodePassword, params.roleCode, params.createdBy]
            })
            return { success: true, data: resultData };
          } catch (err) {
            logger.error(`${path}createUserDetailsMaster() inside - ${err}`)
            return { success: false};
          }
        } catch (err) {
          logger.error(`${path}createUserDetailsMaster()- ${err}`)
        }
      },

      getAllUserList: async function (params) {
        console.log(params);
        try {
          // const limit = 10;  // The number of records to fetch
          // const offset = 20; // The number of records to skip
    
          // const resultData = await User.findAll({
          //   attributes: ['user_code', 'display_name','email_id','mobile_no','address','profile_photo'],
          //   limit: sequelize.literal('?'),
          //   offset: sequelize.literal('?'),
          //   replacements: [params.start, params.length],
          // });
          let replacementsData = [];
          let st = ((params.start - 1) * params.length);
          let query = 'SELECT u.user_code,u.display_name,u.email_id,u.mobile_no,u.address,u.profile_photo,um.user_name,um.fk_role_code AS role_code,um.record_status,rms.role_name AS role_name FROM user_details u INNER JOIN user_masters um ON (u.user_code=um.user_code) INNER JOIN role_masters rms on (rms.role_code=um.fk_role_code) ';
          query += ' WHERE um.record_status NOT IN (2)';
          // if (params.myRoleCode != 'SADMIN') {
          //   query += ' AND um.fk_role_code NOT IN(?)'
          //   replacementsData.push('SADMIN');
          // }
          query += 'ORDER BY u.id DESC LIMIT ? OFFSET ? ';
          replacementsData.push(params.length);
          replacementsData.push(st);
    
          console.log('queryyyy', query);
          const [resultData] = await sequelize.query(query, {
            replacements: replacementsData
          })
    
          //console.log(result)
          return { success: true, data: resultData };
        } catch (err) {
          logger.error(`${path}getAllUserList()- ${err}`)
          return { success: false, data: "User list not getting properly" };
        }
      },

      updateUserStatus: async function (params) {
        try {
          const query = 'UPDATE user_details JOIN user_masters ON user_details.user_code = user_masters.user_code SET user_details.record_status = ?, user_masters.record_status = ?,user_details.updated_by=?,user_masters.updated_by=? WHERE user_details.user_code = ?';
          const [resultData] = await sequelize.query(query, {
            replacements: [params.statusCode, params.statusCode, params.updatedBy, params.updatedBy, params.userCode]
          })
          return {success:true,data:resultData};
        } catch (err) {
          logger.error(`${path}updateUserStatus()- ${err}`)
          return {success:false}
        }
      },
      getUserCountModel: async function () {
        try {
          const query = 'SELECT COUNT(*) AS totalUsers,CAST(SUM(CASE WHEN record_status = 1 THEN 1 ELSE 0 END)AS SIGNED) AS activeUsers,CAST(SUM(CASE WHEN record_status = 0 THEN 1 ELSE 0 END)AS SIGNED) AS inActiveUsers FROM user_masters WHERE record_status NOT IN (2)';
          const [resultData] = await sequelize.query(query, {})
          return { success: true, data: resultData };
        } catch (err) {
          logger.error(`${path}getUserCountModel()- ${err}`)
          return { success: false };
    
        }
      },

      getTotalCount: async function (params) {
        try {
          let replacementsData = [];
          let query = 'SELECT COUNT(*) AS totalRecords FROM user_masters WHERE record_status NOT IN (2)';
          if (params.myRoleCode != 'SADMIN') {
            query += ' AND fk_role_code NOT IN(?)'
            replacementsData.push('SADMIN');
          }
          const [results] = await sequelize.query(query, {
            // Provide values for the placeholders
            replacements: replacementsData
          });
          return { success: true, data: results };
        } catch (err) {
          logger.error(`${path}getTotalCount()- ${err}`)
          return { success: false };
        }
      },

      UserUpdateDetails: async function (params) {
        try {
          if (params.profilePhoto == "") {
            params.profilePhoto = null
          }
          const query = 'UPDATE user_details ud JOIN user_masters um ON ud.user_code = um.user_code SET ud.display_name=?,ud.email_id=?,ud.mobile_no=?,ud.profile_photo=?,ud.address=?,ud.updated_by=?,um.fk_role_code=? Where ud.user_code=? AND um.user_code=?';
          const [results] = await sequelize.query(query, {
            replacements: [params.displayName, params.emailId, params.mobileNo, params.profilePhoto, params.address, params.updatedBy, params.roleCode, params.userCode, params.userCode] // Provide values for the placeholders
          });
          return {success:true,data:results};
        } catch (err) {
          logger.error(`${path}UserUpdateDetails()- ${err}`)
          return {success:false}
        }
      },
}