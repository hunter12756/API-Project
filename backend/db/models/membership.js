'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Membership extends Model {
    static associate(models) {
      Membership.belongsTo(models.User, { foreignKey: 'userId' });
      Membership.belongsTo(models.Group, { foreignKey: 'grouprId' });
    }
  }
  Membership.init({
    userId: {
      allowNull:false,
      type: DataTypes.INTEGER
    },
    groupId: {
      allowNull:false,
      type: DataTypes.INTEGER
    },
    status: {
      allowNull:false,
      type: DataTypes.ENUM('member', 'co-host','pending')
    },
  }, {
    sequelize,
    modelName: 'Membership',
  });
  return Membership;
};
