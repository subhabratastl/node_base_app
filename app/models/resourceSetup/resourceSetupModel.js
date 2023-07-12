const logger=require("../../utils/logger")
const db = require("../connection")

// Define your model
let sequelize = db.sequelize;
var resourceSetupModel=module.exports={
    createResourceModel: async function (params) {

        /* user_code,display_name,email_id,mobile_no,address,profile_photo,created_by*/
        try {
          const query = 'INSERT INTO resource_master (resource_code, resource_name,resource_link,is_maintenance,record_status,created_by) VALUES (?, ?, ?, ?, ?, ?)';
          const [results] = await sequelize.query(query, {
            replacements: [params.resourceCode, params.resourceName, params.resourceLink, params.isMaintenance, params.recordStatus, params.myUserCode] // Provide values for the placeholders
          });
          return { success: true, message: "Create Resource successfully", data: results };
        } catch (error) {
          console.error('Error executing query:', error);
          return { success: false, message: 'Data not inserted properly' };
        }
      },
      getAllResourceModel: async function (params) {
        try {
          let replacementsData = [];
          let ofset = ((params.start - 1) * params.length);
          let query = "SELECT resource_code AS resourceCode, resource_name AS resourceName,resource_link AS resourceLink,is_maintenance isMaintenance,record_status AS recordStatus,";
          query += " (SELECT COUNT(*) FROM resource_master WHERE record_status NOT IN (?)) AS totalCount ";
          query += " FROM resource_master WHERE record_status NOT IN (?) ORDER BY id DESC LIMIT ? OFFSET ? ";
          replacementsData = [...replacementsData, 2, 2, params.length, ofset]
          const [results] = await sequelize.query(query, {
            replacements: replacementsData
          });
    
          return { success: true, message: "Data Fetch Successfully", data: results };
        } catch (err) {
          console.error('Error executing query:', error);
          return { success: false, message: 'Data not fetching due to server issue' };
        }
      },
      updateResouceModel: async function (params) {
        try {
          const query = "UPDATE resource_master SET resource_name=?,resource_link=?,is_maintenance=?,record_status=?,updated_by=? WHERE resource_code = ?";
          const [results] = await sequelize.query(query, {
            replacements: [params.resourceName, params.resourceLink, params.isMaintenance, params.recordStatus, params.myUserCode, params.resourceCode]
          });
          return { success: true, message: "Data Update Successfully" };
        } catch (err) {
          console.error('Error executing query:', error);
          return { success: false, message: 'Data do not updated due to server issue' };
        }
      },
    
      getResourceForDropdownModel: async function () {
        try {
          let replacementsData = [];
          let query = "SELECT resource_code AS resourceCode, resource_name AS resourceName,resource_link AS resourceLink,is_maintenance isMaintenance,record_status AS recordStatus ";
          query += " FROM resource_master WHERE record_status NOT IN (?,?) ORDER BY id DESC";
          replacementsData = [...replacementsData, 2, 0]
          const [results] = await sequelize.query(query, {
            replacements: replacementsData
          });
    
          return { success: true, message: "Data Fetch Successfully", data: results };
        } catch (err) {
          console.error('Error executing query:', error);
          return { success: false, message: 'Data not fetching due to server issue' };
        }
      },
}