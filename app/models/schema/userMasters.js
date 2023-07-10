const { DataTypes } = require('sequelize');
const db = require('../connection');
let sequelize = db.sequelize;
const UserDetail = require('../schema/userDetails');
const RoleMaster = require('../schema/roleMasters');

const UserMaster=sequelize.define('user_masters', {

    user_code: {
      type: DataTypes.STRING,
      allowNull: false
    },
    user_name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false
    },
    fk_role_code: {
      type: DataTypes.STRING,
      allowNull: false
    },
    created_by: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    otp:{
      type: DataTypes.INTEGER,
      allowNull: false
    },
    expire_in:{
      type:DataTypes.DATE,
      allowNull:false
    }
  });
  UserMaster.belongsTo(UserDetail, { foreignKey: 'user_code' });
  UserMaster.belongsTo(RoleMaster, { foreignKey: 'fk_role_code',as:'role_code'});

module.exports=UserMaster