const { DataTypes } = require('sequelize');
const db = require('../connection');
let sequelize = db.sequelize;

const RoleMaster=sequelize.define('role_masters', {
    role_code: {
      type: DataTypes.STRING,
      primaryKey: true
    },
    role_name: DataTypes.STRING
  });

module.exports=RoleMaster;