const db = require("../connection")
const logger = require("../../utils/logger")

let path = "/models/roleSetupModel/-";

// Define your model
let sequelize = db.sequelize;

var roleSetupModel=module.exports={
    
    createRoleDetails: async function (params) {

        /* user_code,display_name,email_id,mobile_no,address,profile_photo,created_by*/
        try {
          const query = 'INSERT INTO role_masters (role_code, role_name,created_by) VALUES (?, ?, ?)';
          const [results] = await sequelize.query(query, {
            replacements: [params.role_code, params.role_name, params.createdBy] // Provide values for the placeholders
          });
          console.log(results); // Display the query results
          return { success: true, data: results, message: 'Created New Role Successfully' };
        } catch (err) {
          logger.error(`${path}createRoleDetails()- ${err}`)
          return { success: false, message: 'Data not inserted properly' };
        }
      },
    
      updateRoleDetails: async function (params) {
        /* user_code,display_name,email_id,mobile_no,address,profile_photo,created_by*/
        try {
          const query = 'UPDATE role_masters SET role_name=?, updated_by=? Where role_code=?';
          const [results] = await sequelize.query(query, {
            replacements: [params.role_name, params.updatedBy, params.role_code] // Provide values for the placeholders
          });
          console.log(results); // Display the query results
          return { success: true, data: results, message: 'Updated Role not Successfully' };
        } catch (err) {
          logger.error(`${path}updateRoleDetails()- ${err}`)
          return { success: false, message: 'Updated Role not Successfully' };
        }
      },
      getAllRolesModel: async function (params) {
        try {
          let replacementsData = [];
          let ofset = ((params.start - 1) * params.length);
          let query = 'SELECT role_code,role_name,record_status,';
          query += '(SELECT COUNT(*) FROM role_masters ';
          if (params.myRoleCode != 'SADMIN') {
            query += 'WHERE role_code NOT IN (?)';
            replacementsData.push('SADMIN');
          }
          query += ') AS total_count from role_masters where role_masters.record_status NOT IN (2) ';
          if (params.myRoleCode != 'SADMIN') {
            query += ' AND role_code NOT IN(?)'
            replacementsData.push('SADMIN');
          }
          query += 'order by id DESC LIMIT ? OFFSET ?';
          replacementsData.push(params.length);
          replacementsData.push(ofset);
    
          const [resultData] = await sequelize.query(query, {
            replacements: replacementsData
          })
          return { success: true, data: resultData, message: 'Get All Roles' };
        } catch (err) {
          logger.error(`${path}getAllRolesModel()- ${err}`)
          return { success: false, message: 'Data not Fetch properly' };
        }
      },
    
      getRolesForDropdownModel: async function (params) {
        try {
          let replacementsData = [];
          let query = 'SELECT role_code,role_name,record_status FROM role_masters WHERE record_status NOT IN (?,?) ';
          replacementsData.push(0);
          replacementsData.push(2);
          if (params.myRoleCode != 'SADMIN') {
            query += ' AND role_code NOT IN(?)';
            replacementsData.push('SADMIN');
          }
          const [results] = await sequelize.query(query, {
            replacements: replacementsData
          });
          console.log(results); // Display the query results
          return { success: true, data: results, message: 'Data Fetch Successfully' };
        } catch (err) {
          logger.error(`${path}getRolesForDropdownModel()- ${err}`)
          return { success: false, message: 'Data not Fetch Successfully' };
        }
      },

      updateRoleStatus: async function (params) {
        try {
          const query = 'UPDATE role_masters SET record_status = ?,updated_by=? WHERE role_code = ?';
          const [resultData] = await sequelize.query(query, {
            replacements: [params.statusCode, params.updatedBy, params.roleCode]
          })
          return resultData;
        } catch (err) {
          logger.error(`${path}updateRoleStatus()- ${err}`)
        }
      },
}