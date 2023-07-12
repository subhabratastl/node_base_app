const db = require("../connection")
const logger = require("../../utils/logger")

let path = "/models/roleVsMenuModel/-";
// Define your model
let sequelize = db.sequelize;

var roleVsMenuModel=module.exports={
    addRoleVsMenuModel: async function (params) {
        try {
          let query = 'INSERT INTO menu_vs_role (role_code,menu_code,alias_menu_name,created_by,record_status,access_type) VALUES (?,?,?,?,?,?)';
          const [results] = await sequelize.query(query, {
            replacements: [params.roleCode, params.menuCode, params.aliasMenuName, params.myUserCode, params.recordStatus, params.accessType]
          });
          return { success: true, message: "Data Add Successfully" };
        } catch (err) {
          logger.error(`${path}addRoleVsMenuModel()- ${err}`)
          return { success: false, message: 'Data not inserted properly' };
        }
      },
    //   getMenuVsRoleModel: async function (params) {
    //     try {
    //       let query = 'SELECT mvr.role_code AS roleCode,rms.role_Name AS roleName,mvr.menu_code AS menuCode,mvr.alias_menu_name AS aliasMenuName,mvr.record_status AS recordStatus FROM menu_vs_role mvr INNER JOIN role_masters rms ON (rms.role_code=mvr.role_code) ';
    //       queru += 'WHERE mvr.menu_code=? ';
    //       query += 'AND mvr.record_status NOT IN (2) ORDER BY mvr.id ';
    //       const [results] = await sequelize.query(query, {
    //         replacements: [params.menuCode]
    //       });
    //       return { success: true, message: 'Data Fetching Successfully', data: results };
    //     } catch (err) {
    //       console.log("Get MenuVsRole ::", err);
    //       return { success: false, message: 'Data not fetching due to server issue' };
    //     }
    //   },
    
      getRoleVsMenuModel: async function (params) {
        try {
          let replacementsData = [];
          let ofset = ((params.start - 1) * params.length);
          let query = 'SELECT mvr.id,mvr.role_code AS roleCode,mvr.menu_code AS menuCode,mm.menu_name AS menuName,mvr.alias_menu_name AS aliasMenuName,mvr.record_status AS recordStatus,mvr.access_type AS accessType,';
          query += ' (SELECT COUNT(*) FROM menu_vs_role lEFT JOIN menu_master ON (menu_master.id=menu_vs_role.menu_code) WHERE menu_master.record_status NOT IN (?) AND menu_vs_role.record_status NOT IN (?) AND menu_vs_role.role_code=?) AS total_count';
          query += ' FROM menu_vs_role mvr';
          query += ' Left join menu_master mm ON (mm.id=mvr.menu_code)';
          query += ' WHERE mvr.role_code=?';
          query += ' AND mvr.record_status NOT IN (2) ORDER BY mvr.id';
          query += ' LIMIT ? OFFSET ?';
          replacementsData = [...replacementsData, 2, 2, params.roleCode, params.roleCode, params.length, ofset]
          const [results] = await sequelize.query(query, {
            replacements: replacementsData
          });
          return { success: true, message: 'Data Fetching Successfully', data: results };
        } catch (err) {
          logger.error(`${path}getRoleVsMenuModel()- ${err}`)
          return { success: false, message: 'Data not fetching due to server issue' };
        }
      },
    
      updateRoleVsMenuModel: async function (params) {
        try {
          let status;
          if (params.recordStatus) {
            status = 1;
          } else {
            status = 0;
          }
          const query = "UPDATE menu_vs_role SET role_code=?,menu_code=?,alias_menu_name=?,record_status=?,updated_by=?,access_type=? WHERE id = ?";
          const [results] = await sequelize.query(query, {
            replacements: [params.roleCode, params.menuCode, params.aliasMenuName, status, params.myUserCode, params.accessType, params.menuId]
          });
          return { success: true, message: "Data Update Successfully" };
        } catch (err) {
          logger.error(`${path}updateRoleVsMenuModel()- ${err}`)
          return { success: false, message: 'Data do not updated due to server issue' };
        }
      },
}