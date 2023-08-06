'use strict';
const {Model} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Event extends Model {
    static associate(models) {
      Event.hasMany(models.EventImage, { foreignKey: 'eventId', onDelete:'CASCADE',hooks:true});
      Event.belongsTo(models.Venue, { foreignKey: 'venueId' ,  });
      Event.belongsTo(models.Group, { foreignKey: 'groupId' ,  });
      Event.hasMany(models.Attendance, {
        foreignKey:'eventId',
        onDelete:'CASCADE',
        hooks:true
      })
    }


  }
  Event.init({
    id: {
      type: DataTypes.INTEGER,
      allowNull:false,
      primaryKey:true,
      autoIncrement:true
    },
    venueId: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    groupId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      onDelete:"CASCADE"
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    type: {
      type: DataTypes.ENUM('Online','In Person'),
      allowNull: false
    },
    capacity: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    price: {
      type: DataTypes.DECIMAL,
      allowNull: false
    },
    startDate: {
      type: DataTypes.DATE,
      allowNull: false
    },
    endDate: {
      type: DataTypes.DATE,
      allowNull: false
    }
  }, {
    sequelize,
    modelName: 'Event',
  });
  return Event;
};
