const { DataTypes } = require('sequelize');
const db = require('../connection');
let sequelize = db.sequelize;

const UserDetail =sequelize.define('user_details', {

    user_code: {
      type: DataTypes.STRING,
      allowNull: false
    },
    display_name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    email_id: {
      type: DataTypes.STRING,
      allowNull: false
    },
    mobile_no: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    address: {
      type: DataTypes.STRING,
      allowNull: true
    },
    profile_photo: {
      type: DataTypes.STRING,
      allowNull: true
    },
    created_by: {
      type: DataTypes.INTEGER,
      allowNull: false
    }
  });
module.exports=UserDetail;

  