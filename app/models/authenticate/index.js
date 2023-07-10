const { Op } = require("sequelize");
const db = require("../connection");
const logger=require("../../utils/logger")
let sequelize = db.sequelize;

const UserDetail = require('../schema/userDetails')
const UserMaster = require('../schema/userMasters')
const RoleMaster = require('../schema/roleMasters')

UserDetail.hasMany(UserMaster, { foreignKey: 'user_code', sourceKey: 'user_code' });
UserMaster.belongsTo(UserDetail, { foreignKey: 'user_code', targetKey: 'user_code' });
UserMaster.belongsTo(RoleMaster, { foreignKey: 'fk_role_code', targetKey: 'role_code' });
let path="/models/authenticate/";

var authModel = module.exports = {
    

    validatedUser: async function (params) {
        try {
            let result = await UserMaster.findOne({
                where: {
                    user_name: {
                        [Op.eq]: sequelize.literal('?'),
                    },
                    password: {
                        [Op.eq]: sequelize.literal('?'),
                    },
                    record_status: {
                        [Op.eq]: 1
                    }
                },
                replacements: [params.userName, params.password],
                attributes: [
                    [sequelize.literal('1'), 'result'],
                ],
            });
            if (result != null) {
                return true;
            } else {
                return false;
            }
        } catch (err) {
            sequelize.close();
        }
    },

    getUserData: async function (params) {
        try {
            //   const query = 'SELECT user_code,fk_role_code AS role_code FROM user_masters WHERE user_name=?'
            //   const [resultData] = await sequelize.query(query, {
            //     replacements: [params.userName]
            //   })

            const users = await UserMaster.findAll({
                attributes: ['user_code', ['fk_role_code', 'role_code']],
                where: { user_name: params.userName },
            });
            if (users != null) {
                return users;
            } else {
                return false;
            }
        } catch (err) {
            logger.error(`${path}/getUserData() - Unable to Fetch the user data`)
        }
    },
}