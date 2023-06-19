'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Group extends Model {
    static associate(models) {
      Group.belongsTo(models.User, { foreignKey: 'organizerId', as: "Organizer" });
      Group.hasMany(models.GroupImage, { foreignKey: 'groupId', onDelete:'CASCADE',hooks:true });
      Group.hasMany(models.Venue, { foreignKey: 'groupId', onDelete:'CASCADE',hooks:true });
      Group.hasMany(models.Membership, { foreignKey: 'groupId', onDelete:'CASCADE',hooks:true });
      Group.hasMany(models.Event, { foreignKey: 'groupId',onDelete:'CASCADE',hooks:true });
    }
  }
  Group.init({
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    organizerId: {
      type: DataTypes.INTEGER
    },
    name: {
      allowNull: false,
      type: DataTypes.STRING,
    },
    about: {
      type: DataTypes.TEXT,
    },
    type: {
      allowNull: false,
      type: DataTypes.ENUM('Online', 'In person')
    },
    private: {
      allowNull: false,
      type: DataTypes.BOOLEAN,
    },
    city: {
      allowNull: false,
      type: DataTypes.STRING,

    },
    state: {
      allowNull: false,
      type: DataTypes.STRING,
    }
  }, {
    sequelize,
    modelName: 'Group',
  });
  return Group;
};
