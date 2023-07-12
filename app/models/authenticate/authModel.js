const { Op } = require("sequelize");
const db = require("../connection");
const logger = require("../../utils/logger")
let sequelize = db.sequelize;

const UserDetail = require('../schema/userDetails')
const UserMaster = require('../schema/userMasters')
const RoleMaster = require('../schema/roleMasters')

UserDetail.hasMany(UserMaster, { foreignKey: 'user_code', sourceKey: 'user_code' });
UserMaster.belongsTo(UserDetail, { foreignKey: 'user_code', targetKey: 'user_code' });
UserMaster.belongsTo(RoleMaster, { foreignKey: 'fk_role_code', targetKey: 'role_code' });
let path = "/models/authenticate/-";

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
                replacements: [params.userName.trim(), params.password.trim()],
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
                where: {
                    user_name: {
                        [Op.eq]: sequelize.literal(':userName')
                    }
                },
                replacements:{
                    userName:params.userName.trim()
                },
            });
            if (users != null) {
                return {success:true,data:users};
            } else {
                return {success:false};
            }
        } catch (err) {
            logger.error(`${path}getUserData()- ${err}`)
        }
    },

    passwordUpdate: async function (params) {
        try {
            const query='UPDATE user_masters SET password=? WHERE user_code=?';
            const [results] = await sequelize.query(query, {
              replacements: [params.newPassword.trim(),params.myUserCode]
            });
            return {success:true,data:results}
        } catch (err) {
            logger.error(`${path}passwordUpdate()- ${err}`)
            return {success:false}
        }
    },
    otpCreateOrUpdate: async function (params) {
        try {
              const query="UPDATE user_masters SET otp=?, expire_in=? WHERE user_name=?";
              const [results]=await sequelize.query(query,{
                replacements:[params.otp,params.expirTime.trim(),params.userName.trim()]
              });
              console.log('otpCreateOrUpdate ',results)
              return {success:true};
        } catch (err) {
            logger.error(`${path}otpCreateOrUpdate()- ${err}`)
            return {success:false};
        }


    },
    getDataForEmail: async function (params) {
        try {
              const query=`SELECT ud.user_code,ud.email_id,ud.mobile_no FROM user_details ud 
              INNER JOIN user_masters um ON (ud.user_code=um.user_code) Where um.user_name=?`;
              const [results]=await sequelize.query(query,{
                replacements:[params.userName.trim()]
              });
              return results;
        } catch (err) {
            logger.error(`${path}getDataForEmail()-${err}`)
        }
    },
    verifyOtpFromMail: async function (params) {
        try {

            //   const query="SELECT IF(otp=?,1,0) AS Otp_match, IF(expire_in>NOW(),1,0) AS expire_status FROM user_masters WHERE user_name=?";

            //   const [results]=await sequelize.query(query,{
            //     replacements:[params.otp,params.userName]
            //   });
            //   return results;
            const results = await UserMaster.findOne({
                attributes: [
                  [
                    sequelize.literal('IF(otp=:otp, 1, 0)'),
                    'Otp_match'
                  ],
                  [
                    sequelize.literal('IF(expire_in > NOW(), 1, 0)'),
                    'expire_status'
                  ]
                ],
                where: {
                  user_name: params.userName.trim()
                },
                replacements: {
                  otp: params.otp.trim()
                },
                raw:true
              });
              console.log('verifyOtpFromMail......',results)
              if (results != null) {
                return results;
            } else {
                return false;
            }

        } catch (err) {    
            logger.error(`${path}verifyOtpFromMail()- ${err}`)
        }
    },
}