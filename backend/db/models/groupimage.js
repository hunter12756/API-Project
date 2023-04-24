'use strict';
const {Model} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class GroupImage extends Model {
    static associate(models) {
      GroupImage.belongsTo(models.Group, {foreignKey: 'groupId'});
    }
  }
  GroupImage.init({
    id: {
      type: DataTypes.INTEGER,
      allowNull:false,
      primaryKey:true,
      autoIncrement:true
    },
    groupId: {
      type: DataTypes.INTEGER
    },
    url: {
      type: DataTypes.STRING
    },
    preview: {
      type: DataTypes.BOOLEAN
    }
  }, {
    sequelize,
    modelName: 'GroupImage',
  });
  return GroupImage;
};
