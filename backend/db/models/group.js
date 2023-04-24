'use strict';
const {Model} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Group extends Model {
    static associate(models) {
      Group.belongsTo(models.User, { foreignKey: 'organizerId', as: "Organizer"  });
      Group.hasMany(models.GroupImage, { foreignKey: 'groupId', onDelete:'CASCADE'  });
      Group.hasMany(models.Venue, { foreignKey: 'groupId' , onDelete:'CASCADE' });
      Group.hasMany(models.Membership, { foreignKey: 'groupId', onDelete:'CASCADE'  });
      Group.hasMany(models.Event, { foreignKey: 'groupId', onDelete:'CASCADE' });
    }
  }
  Group.init({
    organizerId: {
      type: DataTypes.INTEGER
    },
    name: {
      allowNull: false,
      type: DataTypes.STRING,
      validate: {
        len: [1,60],
      }
    },
    about: {
      type: DataTypes.TEXT,
      validate: {
        len: [50],
      }
    },
    type: {
      allowNull: false,
      type: DataTypes.ENUM('Online', 'In person')
    },
    private: {
      allowNull: false,
      type: DataTypes.BOOLEAN,
      validate: {
        isBoolean:true
      }
    },
    city: {
      allowNull: false,
      type: DataTypes.STRING,
      validate: {
        notEmpty:true
      }
    },
    state: {
      allowNull:false,
      type: DataTypes.STRING,
      validate: {
        notEmpty:true
      }
    }
  }, {
    sequelize,
    modelName: 'Group',
  });
  return Group;
};
