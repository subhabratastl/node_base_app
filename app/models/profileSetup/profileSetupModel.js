const logger=require("../../utils/logger")
const db = require("../connection")

// Define your model
let sequelize = db.sequelize;

const UserDetail = require('../schema/userDetails')
const UserMaster = require('../schema/userMasters')
const RoleMaster = require('../schema/roleMasters')

UserDetail.hasMany(UserMaster, { foreignKey: 'user_code', sourceKey: 'user_code' });
UserMaster.belongsTo(UserDetail, { foreignKey: 'user_code', targetKey: 'user_code' });
UserMaster.belongsTo(RoleMaster, { foreignKey: 'fk_role_code', targetKey: 'role_code' });
let path="/models/profileSetupModel/";

var profileSetupModel = module.exports = {

    UpdateProfileDetails: async function (params) {
        console.log("profile model......!!!!!!!!!!!!!!!!!")
        /* user_code,display_name,email_id,mobile_no,address,profile_photo,created_by*/
        // if (params.profilePhoto == "") {
        //   params.profilePhoto = null
        // }
        const query = 'UPDATE user_details SET display_name=?,email_id=?,mobile_no=?,address=? Where user_code=?';
    
        try {
          const [results] = await sequelize.query(query, {
            replacements: [params.displayName,params.emailId,params.mobileNo, params.address, params.myUserCode] // Provide values for the placeholders
          });
          console.log(results); // Display the query results
          return results;
        } catch (error) {
          console.error('Error executing query:', error);
        }
      },

      UpdateProfilePhoto: async function (params) {
        console.log("profile model......!!!!!!!!!!!!!!!!!",params)
        /* user_code,display_name,email_id,mobile_no,address,profile_photo,created_by*/
        // if (params.profilePhoto == "") {
        //   params.profilePhoto = null
        // }
        const query = 'UPDATE user_details SET profile_photo=? Where user_code=?';
    
        try {
          const [results] = await sequelize.query(query, {
            replacements: [params.updateProfilePhoto,params.myUserCode] // Provide values for the placeholders
          });
          console.log(results); // Display the query results
          return results;
        } catch (error) {
          console.error('Error executing query:', error);
        }
      },

      getProfile:async function(params){
        const query = 'SELECT ud.display_name,ud.email_id,ud.mobile_no,ud.address,ud.profile_photo,um.user_name,rm.role_name FROM user_details ud INNER JOIN user_masters um ON (ud.user_code=um.user_code) INNER JOIN role_masters rm ON (rm.role_code=um.fk_role_code) Where ud.user_code=?';
    
        try {
          const [results] = await sequelize.query(query, {
            replacements: [params.myUserCode] // Provide values for the placeholders
          });
          console.log(results); // Display the query results
          return results;
        } catch (error) {
          console.error('Error executing query:', error);
        }
      },

      getPassword:async function(params){
        const query='SELECT IF(password=?, 1, 0) AS password_match FROM user_masters WHERE user_code = ?';
        try {
            const [results] = await sequelize.query(query, {
              replacements: [params.oldPassword,params.myUserCode] // Provide values for the placeholders
            });
            console.log(results); // Display the query results
            return { success: true,message:'Old Password Do not match',data:results };
            
          } catch (error) {
            console.error('Error executing query:', error);
            return { success: false,message:'Password do not updated properly, due to server issue',data:results };
          }
      },

      passwordUpdate:async function(params){
        const query='UPDATE user_masters SET password=? WHERE user_code=?';
        try {
            const [results] = await sequelize.query(query, {
              replacements: [params.newPassword,params.myUserCode] // Provide values for the placeholders
            });
            //console.log(results); // Display the query results
            return results;
          } catch (error) {
            console.error('Error executing query:', error);
          }
      },

      roleWiseAllMenuModel:async function(params){
        try{
          let query= "SELECT mm.id,mm.parent_id as parent,mm.icon_class AS menuIcon,mvr.alias_menu_name AS menuName,mvr.access_type AS accessType, ";
          query += "ifnull(rm.resource_link,0) AS menuPath  from menu_master mm left join resource_master rm ON (rm.resource_code=mm.resource_code) ";
          query += "left join menu_vs_role mvr ON (mvr.menu_code=mm.id) WHERE mvr.role_code=?  AND mvr.record_status=1 AND mm.record_status=1";
          query += " order by mm.id;";
          const [results] = await sequelize.query(query, {
            replacements:[params.roleCode]
          });
          return { success: true,message:'Data Fetching Successfully',data:results };
        }catch(err){
          console.log("Get All Menu ::",err);
          return { success: false,message:'Data not fetching due to server issue' };
        }
      }
      
}